import PostsPagination from '@/components/PostsPagination';
import { getAllPosts } from '@/services/getPosts';
import { config } from '@/shared/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'brunofranco.dev',
	description:
		'Código, aprendizado e reflexões sobre desenvolvimento Full Stack. Artigos técnicos sobre React, Next.js, Node.js, Java, arquitetura de software e boas práticas de programação.',
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'brunofranco.dev',
		description:
			'Código, aprendizado e reflexões sobre desenvolvimento Full Stack. Artigos técnicos sobre React, Next.js, Node.js, Java, arquitetura de software e boas práticas de programação.',
		type: 'website',
	},
};

export default function Home() {
	const allPosts = getAllPosts().map(({ content: _content, ...postMetadata }) => postMetadata);

	return (
		<div className="h-full w-full flex-2">
			<PostsPagination allPosts={allPosts} postsPerPage={config.postsPerPage} />
		</div>
	);
}
