'use client';

import { PostCategory, PostMetadata } from '@/services/getPosts';
import { getFormattedDate } from '@/shared/dayjs';
import Link from 'next/link';

export interface PaginatedPostData {
	allPosts: PostMetadata[];
}

export default function PostPreview({ post }: Readonly<{ post: PostMetadata }>) {
	return (
		<Link
			href={`/posts/${post.slug}`}
			key={post.slug}
			className="border-border group hover:bg-surface-hover/50 flex h-full w-full flex-col gap-3 border-b py-7 first:border-t sm:px-4"
		>
			<div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
				<p className="text-text-muted text-xs tracking-[0.12em] uppercase">{getFormattedDate(post.date)}</p>
				<div className="flex flex-wrap gap-2">
					{post.categories.map((category: PostCategory) => (
						<span
							key={category.id}
							className="border-border text-text-muted border px-2 py-1 text-[0.65rem] tracking-[0.12em] uppercase"
						>
							{category.title}
						</span>
					))}
				</div>
			</div>

			<h2 className="text-title group-hover:text-foreground text-2xl font-semibold transition-colors">
				{post.title}
			</h2>

			<p className="text-text-subtle leading-7">{post.preview}</p>
			<span className="text-link text-xs font-semibold tracking-[0.12em] uppercase">Ler post</span>
		</Link>
	);
}
