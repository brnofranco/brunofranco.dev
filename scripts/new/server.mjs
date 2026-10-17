import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '../..');
const postsDirectory = path.join(projectRoot, 'src/posts');
const imagesDirectory = path.join(projectRoot, 'public/images/posts');
const readingsDirectory = path.join(projectRoot, 'src/readings');
const booksDirectory = path.join(projectRoot, 'public/images/books');
const interfacePath = path.join(scriptDirectory, 'post.html');
const readingsInterfacePath = path.join(scriptDirectory, 'reading.html');
const host = '127.0.0.1';
const port = Number(process.env.POST_AUTHOR_PORT || 4310);
const mode = process.argv[2] === 'reading' ? 'reading' : 'post';
const activeInterfacePath = mode === 'reading' ? readingsInterfacePath : interfacePath;
const maxBodySize = 12 * 1024 * 1024;
const maxImageSize = 8 * 1024 * 1024;

let lastValidation = null;

function sendJson(response, statusCode, payload) {
	response.writeHead(statusCode, {
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'no-store',
	});
	response.end(JSON.stringify(payload));
}

function sendHtml(response, filePath) {
	fs.readFile(filePath)
		.then((content) => {
			response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
			response.end(content);
		})
		.catch(() => sendJson(response, 500, { error: 'Não foi possível carregar a interface.' }));
}

function readRequestBody(request) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		let totalSize = 0;

		request.on('data', (chunk) => {
			totalSize += chunk.length;
			if (totalSize > maxBodySize) {
				reject(new Error('O payload excede o limite de 12 MB.'));
				request.destroy();
				return;
			}
			chunks.push(chunk);
		});
		request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
		request.on('error', reject);
	});
}

function slugify(value) {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 100);
}

function parseCategories(value) {
	return String(value || '')
		.split(',')
		.map((category) => category.trim())
		.filter(Boolean)
		.map((title) => ({ id: slugify(title), title }));
}

async function getImageData(dataUrl) {
	const match = /^data:(image\/(?:gif|jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
	if (!match) {
		throw new Error('A capa deve ser uma imagem PNG, JPG, GIF ou WebP.');
	}

	const [, , encodedImage] = match;
	const imageBuffer = Buffer.from(encodedImage, 'base64');
	if (!imageBuffer.length || imageBuffer.length > maxImageSize) {
		throw new Error('A imagem deve ter entre 1 byte e 8 MB.');
	}

	return { buffer: await sharp(imageBuffer).jpeg({ quality: 85, mozjpeg: true }).toBuffer(), extension: 'jpg' };
}

async function validateInput(input) {
	const title = String(input.title || '').trim();
	const slug = slugify(String(input.slug || title));
	const preview = String(input.preview || '').trim();
	const content = String(input.content || '').trim();
	const date = new Date().toISOString();
	const categories = parseCategories(input.categories);

	if (!title || !slug || !preview || !content || !date || !categories.length) {
		throw new Error('Preencha título, slug, preview, data, categorias e conteúdo.');
	}
	if (slug !== String(input.slug || title).trim()) {
		throw new Error(`Use o slug normalizado: ${slug}`);
	}
	if (slug === 'index' || slug === '404') {
		throw new Error('Esse slug é reservado pelo site.');
	}

	const image = await getImageData(input.cover);
	return {
		metadata: {
			id: slug,
			title,
			slug,
			preview,
			date,
			coverPath: `/images/posts/${slug}.${image.extension}`,
			categories,
		},
		content: `${content}\n`,
		image,
	};
}

async function ensureDirectories() {
	await Promise.all([fs.mkdir(postsDirectory, { recursive: true }), fs.mkdir(imagesDirectory, { recursive: true })]);
}

async function ensureReadingDirectories() {
	await Promise.all([
		fs.mkdir(readingsDirectory, { recursive: true }),
		fs.mkdir(booksDirectory, { recursive: true }),
	]);
}

async function ensureAvailable(filePath) {
	try {
		await fs.access(filePath);
		throw new Error(`O arquivo já existe: ${path.relative(projectRoot, filePath)}`);
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
}

async function createPost(input) {
	const validated = await validateInput(input);
	const postPath = path.join(postsDirectory, `${validated.metadata.slug}.mdx`);
	const imagePath = path.join(imagesDirectory, `${validated.metadata.slug}.${validated.image.extension}`);
	await ensureDirectories();
	await Promise.all([ensureAvailable(postPath), ensureAvailable(imagePath)]);

	const mdx = matter.stringify(validated.content, validated.metadata);
	const token = randomUUID();
	const temporaryPostPath = `${postPath}.${token}.tmp`;
	const temporaryImagePath = `${imagePath}.${token}.tmp`;

	try {
		await Promise.all([
			fs.writeFile(temporaryPostPath, mdx, 'utf8'),
			fs.writeFile(temporaryImagePath, validated.image.buffer),
		]);
		await fs.rename(temporaryImagePath, imagePath);
		await fs.rename(temporaryPostPath, postPath);
	} catch (error) {
		await Promise.allSettled([fs.unlink(temporaryPostPath), fs.unlink(temporaryImagePath), fs.unlink(imagePath)]);
		throw error;
	}

	lastValidation = { slug: validated.metadata.slug, postPath, imagePath, passed: false };
	const validation = await runValidation();
	if (!validation.ok) {
		return {
			ok: false,
			validation,
			files: [path.relative(projectRoot, postPath), path.relative(projectRoot, imagePath)],
		};
	}

	lastValidation = { ...lastValidation, passed: true };
	return {
		ok: true,
		validation,
		files: [path.relative(projectRoot, postPath), path.relative(projectRoot, imagePath)],
	};
}

async function createReading(input) {
	const title = String(input.title || '').trim();
	const slug = slugify(String(input.slug || title));
	const author = String(input.author || '').trim();
	const description = String(input.description || '').trim();
	const postLink = String(input.postLink || '').trim();
	const date = new Date().toISOString();

	if (!title || !slug || !author || !description || !date) {
		throw new Error('Preencha título, slug, autor e descrição.');
	}
	if (slug !== String(input.slug || title).trim()) {
		throw new Error(`Use o slug normalizado: ${slug}`);
	}
	if (slug === 'index' || slug === '404') {
		throw new Error('Esse slug é reservado pelo site.');
	}

	const image = await getImageData(input.cover);
	const metadata = {
		id: slug,
		title,
		author,
		description,
		postLink,
		coverPath: `/images/books/${slug}.jpg`,
		date,
	};
	const readingPath = path.join(readingsDirectory, `${slug}.mdx`);
	const imagePath = path.join(booksDirectory, `${slug}.jpg`);
	await ensureReadingDirectories();
	await Promise.all([ensureAvailable(readingPath), ensureAvailable(imagePath)]);

	const mdx = matter.stringify(`${description}\n`, metadata);
	const token = randomUUID();
	const temporaryReadingPath = `${readingPath}.${token}.tmp`;
	const temporaryImagePath = `${imagePath}.${token}.tmp`;

	try {
		await Promise.all([
			fs.writeFile(temporaryReadingPath, mdx, 'utf8'),
			fs.writeFile(temporaryImagePath, image.buffer),
		]);
		await fs.rename(temporaryImagePath, imagePath);
		await fs.rename(temporaryReadingPath, readingPath);
	} catch (error) {
		await Promise.allSettled([
			fs.unlink(temporaryReadingPath),
			fs.unlink(temporaryImagePath),
			fs.unlink(imagePath),
		]);
		throw error;
	}

	lastValidation = { slug, readingPath, postPath: readingPath, imagePath, passed: false };
	const validation = await runValidation();
	if (!validation.ok) {
		return {
			ok: false,
			validation,
			files: [path.relative(projectRoot, readingPath), path.relative(projectRoot, imagePath)],
		};
	}

	lastValidation = { ...lastValidation, passed: true };
	return {
		ok: true,
		validation,
		files: [path.relative(projectRoot, readingPath), path.relative(projectRoot, imagePath)],
	};
}

function runCommand(command, args) {
	return new Promise((resolve) => {
		execFile(command, args, { cwd: projectRoot, maxBuffer: 1024 * 1024 * 8 }, (error, stdout, stderr) => {
			resolve({ ok: !error, output: `${stdout}${stderr}`.trim() });
		});
	});
}

async function runValidation() {
	const lint = await runCommand('npm', ['run', 'lint']);
	if (!lint.ok) return { ok: false, step: 'lint', output: lint.output };
	const build = await runCommand('npm', ['run', 'build']);
	return { ok: build.ok, step: build.ok ? 'build' : 'build', output: build.output };
}

async function gitStatus() {
	return runCommand('git', ['status', '--short', '--branch']);
}

async function commitPost(input) {
	if (!lastValidation?.passed) throw new Error('Valide um post com sucesso antes de criar o commit.');
	const statusBefore = await runCommand('git', ['diff', '--cached', '--quiet']);
	if (!statusBefore.ok)
		throw new Error('Existem arquivos já preparados no Git. Resolva o staging antes de continuar.');
	const message = String(input.message || '').trim();
	if (!message) throw new Error('Informe uma mensagem de commit.');
	const add = await runCommand('git', [
		'add',
		'--',
		path.relative(projectRoot, lastValidation.postPath),
		path.relative(projectRoot, lastValidation.imagePath),
	]);
	if (!add.ok) throw new Error(add.output || 'Não foi possível preparar os arquivos.');
	const commit = await runCommand('git', ['commit', '-m', message]);
	if (!commit.ok) throw new Error(commit.output || 'Não foi possível criar o commit.');
	return { ok: true, output: commit.output };
}

async function pushChanges() {
	if (!lastValidation?.passed) throw new Error('Valide um post antes de fazer push.');
	const push = await runCommand('git', ['push']);
	if (!push.ok) throw new Error(push.output || 'Não foi possível fazer push.');
	return { ok: true, output: push.output || 'Push concluído.' };
}

async function handleApi(request, response, pathname) {
	try {
		if (request.method === 'GET' && pathname === '/api/status') {
			const status = await gitStatus();
			return sendJson(response, 200, { ...status, lastValidation });
		}
		if (request.method !== 'POST') return sendJson(response, 405, { error: 'Método não permitido.' });
		const body = JSON.parse(await readRequestBody(request));
		if (pathname === '/api/create') return sendJson(response, 200, await createPost(body));
		if (pathname === '/api/readings/create') return sendJson(response, 200, await createReading(body));
		if (pathname === '/api/commit') return sendJson(response, 200, await commitPost(body));
		if (pathname === '/api/push') return sendJson(response, 200, await pushChanges());
		return sendJson(response, 404, { error: 'Endpoint não encontrado.' });
	} catch (error) {
		return sendJson(response, 400, { error: error instanceof Error ? error.message : 'Erro inesperado.' });
	}
}

const server = http.createServer((request, response) => {
	const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);
	if (requestUrl.pathname.startsWith('/api/')) {
		handleApi(request, response, requestUrl.pathname);
		return;
	}
	if (request.method === 'GET' && requestUrl.pathname === '/') {
		sendHtml(response, activeInterfacePath);
		return;
	}
	sendJson(response, 404, { error: 'Página não encontrada.' });
});

server.listen(port, host, () => {
	const url = `http://${host}:${port}/`;
	console.log(`Painel de ${mode} disponível em ${url}`);
	execFile('xdg-open', [url], (error) => {
		if (error) console.warn(`Não foi possível abrir o navegador automaticamente: ${error.message}`);
	});
});
