import { redirect } from 'next/navigation';
import Image from 'next/image';
import getPostBySlug, { getAllPosts } from '@/services/getPosts';
import { getFormattedDate } from '@/shared/dayjs';
import Comments from '@/components/Comments';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { getMDXComponents } from '@/hooks/useMDXComponents';

interface PostProps {
	params: Promise<{ slug: string }>;
}

function normalizeWhitespace(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildSeoDescription(title: string, preview?: string): string {
	const cleanPreview = normalizeWhitespace(preview || '');

	if (!cleanPreview) {
		return truncate(`Leia o artigo ${title} no blog do Bruno Franco.`, 160);
	}

	const lowerPreview = cleanPreview.toLocaleLowerCase('pt-BR');
	const lowerTitle = title.toLocaleLowerCase('pt-BR');
	const combined = lowerPreview.includes(lowerTitle) ? cleanPreview : `${title}. ${cleanPreview}`;

	return truncate(combined, 160);
}

function buildKeywords(title: string, slug: string): string[] {
	const terms = `${title} ${slug}`
		.toLocaleLowerCase('pt-BR')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.split(/[^a-z0-9]+/)
		.filter((term) => term.length > 2);

	return Array.from(new Set(['blog', 'desenvolvimento', 'programacao', ...terms])).slice(0, 14);
}

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post?.title) return {};

	const description = buildSeoDescription(post.title, post.preview);
	const keywords = buildKeywords(post.title, slug);
	const canonicalPath = `/posts/${slug}`;

	return {
		title: post.title,
		description,
		keywords,
		robots: {
			index: true,
			follow: true,
		},
		alternates: {
			canonical: canonicalPath,
		},
		openGraph: {
			title: post.title,
			description,
			type: 'article',
			url: canonicalPath,
			publishedTime: post.date,
			images: [{ url: post.coverPath, alt: post.title }],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description,
			creator: '@brnofranco',
			images: [post.coverPath],
		},
	};
}

export default async function Post({ params }: Readonly<PostProps>) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post?.title) {
		redirect('/404');
	}

	const components = getMDXComponents();

	return (
		<>
			<div className="h-full w-full flex-2">
				<div className="flex h-full w-full justify-center">
					<div key={post.id} className="h-full w-full">
						<h1 className="text-title mb-6 text-center text-3xl leading-tight font-semibold sm:text-4xl">
							{post.title}
						</h1>

						<p className="text-text-muted mb-10 text-center text-sm">
							Publicado em {getFormattedDate(post.date)}
						</p>

						<Image
							src={post.coverPath}
							alt={post.title}
							width={1920}
							height={1080}
							className="mb-12 h-auto w-full"
							priority
						/>

						<div className="structured-data">
							<MDXRemote source={post.content} components={components} />
						</div>
					</div>
				</div>

				<div className="mt-4">
					<Comments />
				</div>
			</div>
		</>
	);
}
