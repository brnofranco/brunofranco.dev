import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ReadingData {
	id: string;
	title: string;
	author: string;
	description: string;
	postLink: string;
	coverPath: string;
	date: string;
}

const readingsDirectory = path.join(process.cwd(), 'src/readings');

export function getAllReadings() {
	return getReadingSlugs()
		.flatMap((slug) => {
			try {
				return [parseReadingFile(path.join(readingsDirectory, `${slug}.mdx`))];
			} catch (error) {
				console.warn(`Skipping reading "${slug}": ${String(error)}`);
				return [];
			}
		})
		.sort((first, second) => Date.parse(second.date) - Date.parse(first.date));
}

function getReadingSlugs() {
	try {
		return fs
			.readdirSync(readingsDirectory)
			.filter((file) => path.extname(file) === '.mdx')
			.map((file) => file.replace(/\.mdx$/, ''));
	} catch (error) {
		console.warn(`Failed to read readings directory: ${String(error)}`);
		return [];
	}
}

function parseReadingFile(filePath: string): ReadingData {
	if (!fs.existsSync(filePath)) {
		throw new Error(`Reading file not found: ${filePath}`);
	}

	const rawContent = fs.readFileSync(filePath, 'utf8');
	const { content, data } = matter(rawContent);

	return { ...data, description: content.trim() } as ReadingData;
}
