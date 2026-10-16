import Curriculum from '@/components/Curriculum';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sobre',
	description: 'Conheça Bruno Franco, desenvolvedor Full Stack com experiência em React, Node, Java e Go.',
	openGraph: {
		title: 'Sobre |  brunofranco.dev',
		description: 'Conheça Bruno Franco, desenvolvedor Full Stack com experiência em React, Node, Java e Go.',
		type: 'profile',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Sobre | brunofranco.dev',
		description: 'Conheça Bruno Franco, desenvolvedor Full Stack com experiência em React, Node, Java e Go.',
	},
};

export default function About() {
	return (
		<div className="flex h-full w-full flex-col gap-10">
			<div className="flex flex-col gap-3">
				<h1 className="text-foreground text-3xl font-semibold">Sobre</h1>
				<p className="text-text-muted text-sm">Um pouco sobre minha trajetória, interesses e objetivos.</p>
			</div>

			<div className="border-border flex h-full w-full flex-col gap-4 border-b pb-8">
				<p className="text-text-subtle leading-7">
					Prazer, sou Bruno. Estou em contato com o mundo da programação desde 2018 e, quanto mais aprendo,
					mais percebo o quanto ainda tenho a aprender. Isso me mantém sempre descobrindo algo novo,
					questionando o que sei e buscando maneiras melhores de fazer as coisas.
				</p>

				<p className="text-text-subtle leading-7">
					Sou católico, noivo e alguém que gosta de aproveitar o tempo livre com bons livros, videogames e
					música. Tenho um carinho especial por fantasia, ficção científica e, principalmente, distopias. Nos
					jogos, prefiro os de ação e aventura em mundo aberto. Na música, um bom rock.
				</p>

				<p className="text-text-subtle leading-7">
					Criei este site para compartilhar conhecimento sobre os assuntos que estudo e que despertam minha
					curiosidade. Aqui, faço um registro dos meus estudos e reflexões recentes. A intenção é construir um
					acervo pessoal, mas aberto para quem quiser aprender junto.
				</p>

				<p className="text-text-subtle leading-7">
					Profissionalmente, quero me aprofundar em arquitetura de software. Meu objetivo é desenvolver uma
					visão cada vez mais ampla sobre como projetar sistemas, tomar boas decisões técnicas e construir
					soluções que façam sentido.
				</p>

				<p className="text-text-subtle leading-7">
					Abaixo segue um resumo da minha trajetória, incluindo minha formação acadêmica, experiência
					profissional e as habilidades que adquiri ao longo do caminho. Se quiser saber mais detalhes, é só
					me chamar.
				</p>
			</div>

			<div className="flex h-full w-full flex-col gap-4">
				<Curriculum />
			</div>
		</div>
	);
}
