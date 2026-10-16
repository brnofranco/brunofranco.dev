'use client';

import { config } from '@/shared/config';
import Link from 'next/link';

export default function Footer() {
	const today = new Date();
	const currentYear = today.getFullYear();

	return (
		<footer className="border-border flex h-full w-full flex-col justify-center border-t pt-6">
			<div className="mb-4 flex gap-6 text-sm font-semibold uppercase">
				<Link href={config.socialMediaLinks.linkedIn} target="_blank" title="LinkedIn">
					<p>LinkedIn</p>
				</Link>

				<Link href={config.socialMediaLinks.gitHub} target="_blank" title="GitHub">
					<p>GitHub</p>
				</Link>

				<Link href={config.socialMediaLinks.twitter} target="_blank" title="Twitter / X">
					<p>Twitter / X</p>
				</Link>
			</div>

			<p className="text-text-dim text-xs">© {currentYear} Criado por Bruno Franco</p>
		</footer>
	);
}
