import type { Metadata } from 'next';
import { BookCard } from '@/components/BookCard';
import Link from 'next/link';
import { getAllReadings } from '@/services/getReadings';

export const metadata: Metadata = {
	title: 'Leituras',
	description: 'Lista de livros de programação recomendados por Bruno Franco.',
	openGraph: {
		title: 'Leituras | brunofranco.dev',
		description: 'Lista de livros de programação recomendados por Bruno Franco.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Leituras | brunofranco.dev',
		description: 'Lista de livros de programação recomendados por Bruno Franco.',
	},
};

export default async function Readings() {
	const books = getAllReadings();

	return (
		<>
			<div className="border-border flex h-full w-full flex-col gap-3 pb-8">
				<h1 className="text-foreground text-3xl font-semibold">Recomendações de leitura</h1>

				<p className="text-text-subtle leading-7">
					Esses são os livros que li sobre programação e as minhas mais humildes recomendações.
				</p>
				<p className="text-text-subtle leading-7">
					Cada vez menos, em nossa área, as pessoas estão utilizando livros como método de estudo, tanto pela
					velocidade da evolução das tecnologias quanto pela falta de hábito da maioria dos estudantes.
				</p>
				<p className="text-text-subtle leading-7">
					Desde 2024, tenho desenvolvido o hábito da leitura. Minha motivação era ter maior facilidade e
					velocidade em ler, que é uma habilidade importante para desenvolvedores. Por isso, sigo lendo livros
					técnicos e de entretenimento. Conto mais sobre isso no meu{' '}
					<Link
						href="/posts/habito-de-leitura-e-livros-que-li-em-2024"
						target="_blank"
						className="text-link underline"
					>
						post
					</Link>{' '}
					das leituras de 2024. Fica a recomendação para sair das telas.
				</p>
			</div>

			<div className="mt-2 h-full w-full">
				<div className="flex h-full w-full flex-col justify-center">
					{books.map((book) => (
						<BookCard key={book.id} book={book} />
					))}
				</div>
			</div>
		</>
	);
}
