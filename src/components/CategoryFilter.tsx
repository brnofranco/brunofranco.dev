'use client';

import { useRef, useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import type { PostCategory } from '@/services/getPosts';

interface CategoryFilterProps {
	allCategories: PostCategory[];
	selectedIds: Set<string>;
	onToggleCategory: (id: string) => void;
	onClear: () => void;
}

export default function CategoryFilter({
	allCategories,
	selectedIds,
	onToggleCategory,
	onClear,
}: Readonly<CategoryFilterProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!popoverRef.current || popoverRef.current.contains(event.target as Node)) return;
			setIsOpen(false);
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={popoverRef}>
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className="bg-surface text-text-muted hover:bg-surface-hover hover:text-foreground border-border flex h-9 cursor-pointer items-center justify-center gap-2 border px-3 text-xs font-semibold tracking-[0.12em] uppercase transition"
			>
				<FaFilter aria-hidden="true" className="text-[0.65rem]" />
				<span>Filtrar</span>
				{selectedIds.size > 0 ? (
					<span className="bg-background border-border text-foreground border px-1.5 py-0.5 text-[0.65rem] leading-none">
						{selectedIds.size}
					</span>
				) : null}
			</button>

			{isOpen ? (
				<div className="bg-surface border-border absolute right-0 z-10 mt-3 w-64 border p-4 shadow-xl">
					<div className="mb-3 flex items-center justify-between">
						<p className="text-foreground text-xs font-semibold tracking-[0.24em] uppercase">Categorias</p>
						<button
							type="button"
							onClick={onClear}
							className="text-text-subtle hover:text-foreground text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition"
						>
							Limpar
						</button>
					</div>

					<div className="flex max-h-64 flex-col gap-2 overflow-auto pr-1">
						{allCategories.map((category) => {
							const isSelected = selectedIds.has(category.id);
							return (
								<label
									key={category.id}
									className={`text-text-muted hover:border-border flex cursor-pointer items-center gap-2 border px-2 py-1 text-sm transition ${isSelected ? 'border-border bg-background' : 'border-transparent'}`}
								>
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => onToggleCategory(category.id)}
										className="border-border-subtle bg-surface-hover h-4 w-4 text-white"
									/>
									<span>{category.title}</span>
								</label>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
