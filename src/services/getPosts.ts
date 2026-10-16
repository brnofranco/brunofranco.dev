import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface PostCategory {
	id: string;
	title: string;
}

export interface PostMetadata {
	id: string;
	title: string;
	slug: string;
	preview: string;
	date: string;
	coverPath: string;
	categories: PostCategory[];
}

export interface Post extends PostMetadata {
	content: string;
}

const postsDirectory = path.join(process.cwd(), 'src/posts');

export default function getPostBySlug(slug: string) {
	const realSlug = normalizeSlug(slug);
	const filePath = path.join(postsDirectory, `${realSlug}.mdx`);

	try {
		return parsePostFile(filePath);
	} catch {
		return undefined;
	}
}

export function getAllPosts() {
	const posts = getPostSlugs().flatMap((slug) => {
		try {
			return [parsePostFile(path.join(postsDirectory, `${slug}.mdx`))];
		} catch (error) {
			console.warn(`Skipping post "${slug}": ${String(error)}`);
			return [];
		}
	});

	return posts.sort((first, second) => Date.parse(second.date) - Date.parse(first.date));
}

function normalizeSlug(slug: string) {
	return slug.replace(/\.mdx?$/, '');
}

function getPostSlugs() {
	try {
		return fs
			.readdirSync(postsDirectory)
			.filter((file) => path.extname(file) === '.mdx')
			.map(normalizeSlug);
	} catch (error) {
		console.warn(`Failed to read posts directory: ${String(error)}`);
		return [];
	}
}

function parsePostFile(filePath: string): Post {
	if (!fs.existsSync(filePath)) {
		throw new Error(`Post file not found: ${filePath}`);
	}

	const rawContent = fs.readFileSync(filePath, 'utf8');
	const { content, data } = matter(rawContent);

	return {
		...(data as PostMetadata),
		content,
	};
}
