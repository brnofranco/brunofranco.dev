'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReadingData } from '@/services/getReadings';

interface BookCardProps {
	book: ReadingData;
}

export const BookCard = ({ book }: BookCardProps) => {
	return (
		<div className="border-border flex flex-col border-b py-8 first:border-t lg:flex-row lg:gap-8">
			<div className="border-border relative aspect-11/15 w-40 shrink-0 border shadow-sm sm:w-48 lg:w-40">
				<Image
					className="object-cover"
					src={book.coverPath}
					alt={book.title}
					fill
					sizes="(min-width: 1024px) 224px, 100vw"
					priority
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col pt-5 lg:pt-0">
				<h2 className="text-title text-2xl font-semibold">{book.title}</h2>
				<p className="text-text-muted text-xs tracking-[0.12em] uppercase">{book.author}</p>

				<p className="text-text-subtle mt-4 leading-7">{book.description}</p>

				<div className="mt-4 flex gap-4 text-sm">
					{book.postLink && (
						<Link
							className="text-link underline decoration-1 underline-offset-4"
							href={book.postLink}
							target="_blank"
						>
							Meu post sobre o livro
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};
