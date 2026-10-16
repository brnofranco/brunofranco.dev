import type { Metadata } from 'next';
import './global.css';
import PageLayout from '../components/PageLayout';
import { DM_Sans, Lora, Poppins } from 'next/font/google';
import { config } from '@/shared/config';

export const metadata: Metadata = {
	metadataBase: new URL(config.siteUrl),
	title: {
		default: config.siteTitle,
		template: `%s | ${config.siteTitle}`,
	},
	description: config.siteDescription,
	keywords: [
		'programação',
		'desenvolvimento',
		'software',
		'tecnologia',
		'javascript',
		'typescript',
		'React',
		'nextjs',
		'nodejs',
		'blog',
		'arquitetura de software',
	],
	authors: [{ name: 'Bruno Franco' }],
	creator: 'Bruno Franco',
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		url: config.siteUrl,
		siteName: config.siteTitle,
		title: config.siteTitle,
		description: config.siteDescription,
	},
	twitter: {
		card: 'summary_large_image',
		title: config.siteTitle,
		description: config.siteDescription,
	},
	robots: {
		index: true,
		follow: true,
	},
};

const bodyFont = DM_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-body',
});

const displayFont = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-display',
});

const titleFont = Lora({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-title',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="pt-br"
			className={`${bodyFont.variable} ${displayFont.variable} ${titleFont.variable}`}
			suppressHydrationWarning
		>
			<body>
				<PageLayout>{children}</PageLayout>
			</body>
		</html>
	);
}
