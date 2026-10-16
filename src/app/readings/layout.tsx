import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'brunofranco.dev - Leituras',
	description: 'Lista de livros de programação lidos e recomendados por Bruno Franco.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <>{children}</>;
}
