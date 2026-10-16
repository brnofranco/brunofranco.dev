export const config = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://brnofranco.vercel.app',
	siteTitle: 'brunofranco.dev',
	siteDescription:
		'Código, aprendizado e reflexões sobre desenvolvimento Full Stack. Artigos técnicos sobre React, Next.js, Node.js, arquitetura de software e boas práticas de programação.',
	postsPerPage: parseInt(process.env.POSTS_PER_PAGE || '10'),
	socialMediaLinks: {
		linkedIn: process.env.LINKEDIN_URL ? process.env.LINKEDIN_URL : 'https://www.linkedin.com/in/brunofmoraes/',
		gitHub: process.env.GITHUB_URL ? process.env.GITHUB_URL : 'https://github.com/brnofranco',
		twitter: process.env.TWITTER_URL ? process.env.TWITTER_URL : 'https://x.com/brnofranco',
	},
	utteranc: {
		src: 'https://utteranc.es/client.js',
		repo: process.env.UTTERANC_REPO || 'brnofranco/brnoblog',
		issueTerm: process.env.UTTERANC_PATHNAME || 'pathname',
		theme: 'github-dark',
		crossorigin: process.env.UTTERANC_CROSSORIGIN || 'anonymous',
	},
};
