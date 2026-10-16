'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PostPreview from '@/components/PostPreview';
import { PostMetadata } from '@/services/getPosts';
import CategoryFilter from '@/components/CategoryFilter';

interface PostsPaginationProps {
	allPosts: PostMetadata[];
	postsPerPage: number;
}

export default function PostsPagination({ allPosts, postsPerPage }: Readonly<PostsPaginationProps>) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const selectedIds = new Set(searchParams.get('categories')?.split(',').filter(Boolean));
	const allCategories = Array.from(
		new Map(allPosts.flatMap((post) => post.categories).map((category) => [category.id, category])).values()
	).sort((first, second) => first.title.localeCompare(second.title, 'pt-BR'));
	const filteredPosts = allPosts.filter(
		(post) => selectedIds.size === 0 || post.categories.some((category) => selectedIds.has(category.id))
	);
	const requestedPage = Number.parseInt(searchParams.get('page') || '0', 10);
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const currentPage = Number.isNaN(requestedPage)
		? 0
		: Math.min(Math.max(requestedPage, 0), Math.max(totalPages - 1, 0));
	const paginatedPosts = filteredPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

	function updateCategories(categoryId?: string) {
		const nextSelectedIds = new Set(selectedIds);
		if (categoryId) {
			nextSelectedIds.has(categoryId) ? nextSelectedIds.delete(categoryId) : nextSelectedIds.add(categoryId);
		} else {
			nextSelectedIds.clear();
		}

		const nextParams = new URLSearchParams(searchParams.toString());
		if (nextSelectedIds.size > 0) {
			nextParams.set('categories', Array.from(nextSelectedIds).sort().join(','));
		} else {
			nextParams.delete('categories');
		}

		nextParams.delete('page');
		router.replace(`${pathname}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`);
	}

	function pageHref(page: number) {
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.set('page', String(page));
		return `${pathname}?${nextParams.toString()}`;
	}

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<div className="mb-6 flex flex-col gap-2">
					<h1 className="text-foreground text-3xl font-semibold">Posts</h1>
					<p className="text-text-muted text-sm">Artigos sobre desenvolvimento, aprendizado e carreira.</p>
				</div>

				<CategoryFilter
					allCategories={allCategories}
					selectedIds={selectedIds}
					onToggleCategory={updateCategories}
					onClear={() => updateCategories()}
				/>
			</div>

			<div className="flex h-full w-full flex-col items-center">
				{paginatedPosts.length === 0 ? (
					<p className="text-text-muted text-center text-sm xl:w-5xl">Nenhum post encontrado.</p>
				) : (
					paginatedPosts.map((post) => <PostPreview key={post.slug} post={post} />)
				)}
			</div>

			<div
				className={`mt-6 flex h-full w-full items-center ${currentPage === 0 ? 'justify-end' : currentPage === totalPages - 1 ? 'justify-start' : 'justify-between'}`}
			>
				{currentPage > 0 ? (
					<Link
						href={pageHref(currentPage - 1)}
						className="text-title hover:text-foreground flex h-full items-center justify-center gap-2 py-3 text-xs font-semibold tracking-[0.12em] uppercase transition"
					>
						<FaChevronLeft />
						<span>Anterior</span>
					</Link>
				) : null}

				{currentPage < totalPages - 1 ? (
					<Link
						href={pageHref(currentPage + 1)}
						className="text-title hover:text-foreground flex h-full items-center justify-center gap-3 py-3 text-xs font-semibold tracking-[0.12em] uppercase transition"
					>
						<span>Próximo</span>
						<FaChevronRight />
					</Link>
				) : null}
			</div>
		</>
	);
}
