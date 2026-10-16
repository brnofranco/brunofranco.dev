'use client';

import Link from 'next/link';
import { config } from '@/shared/config';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaMoon, FaSun } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Header() {
	const pathname = usePathname();
	const basePath = pathname.split('/')[1];
	const iconSize = 24;
	const isPostsPage = basePath === '' || basePath === 'posts';
	const isReadingsPage = basePath === 'readings';
	const isAboutPage = basePath === 'about';
	const [isDarkMode, setIsDarkMode] = useState(true);
	const themeStorageKey = 'theme';

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			try {
				const savedTheme = localStorage.getItem(themeStorageKey);
				const isLightMode = savedTheme === 'light';

				document.documentElement.classList.toggle('theme-light', isLightMode);
				setIsDarkMode(!isLightMode);
			} catch (error) {
				console.error('Local storage error:', error);
			}
		});

		return () => window.cancelAnimationFrame(frame);
	}, []);

	function toggleTheme() {
		const nextIsDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('theme-light', !nextIsDarkMode);

		try {
			localStorage.setItem(themeStorageKey, nextIsDarkMode ? 'dark' : 'light');
		} catch (error) {
			console.error('Local storage error:', error);
		}

		setIsDarkMode(nextIsDarkMode);
	}

	return (
		<header className="border-border flex w-full flex-col justify-center border-b pb-7">
			<div className="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
				<Link href="/" className="flex flex-col gap-1">
					<p
						className="text-foreground text-3xl font-semibold sm:text-4xl"
						style={{ fontFamily: 'var(--font-title), serif' }}
					>
						Bruno Franco
					</p>
					<p className="text-text-muted text-sm">Notas, estudos e reflexões.</p>
				</Link>

				<div className="flex items-center gap-4 sm:pb-1">
					<Link href={config.socialMediaLinks.linkedIn} target="_blank" title="LinkedIn">
						<FaLinkedin
							className="text-title hover:text-foreground cursor-pointer transition-colors"
							size={iconSize}
						/>
					</Link>

					<Link href={config.socialMediaLinks.gitHub} target="_blank" title="GitHub">
						<FaGithub
							className="text-title hover:text-foreground cursor-pointer transition-colors"
							size={iconSize}
						/>
					</Link>

					<Link href={config.socialMediaLinks.twitter} target="_blank" title="Twitter / X">
						<FaXTwitter
							className="text-title hover:text-foreground cursor-pointer transition-colors"
							size={iconSize}
						/>
					</Link>
				</div>

				<div className="flex items-center gap-6 text-sm uppercase sm:gap-8">
					<nav className="flex items-center gap-6 text-sm uppercase sm:gap-8">
						<Link
							href="/"
							aria-current={isPostsPage ? 'page' : undefined}
							className={`relative pb-1 font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:transition-transform after:duration-200 ${isPostsPage ? 'text-foreground after:bg-title after:scale-x-100' : 'text-text after:bg-border-subtle hover:text-foreground hover:after:bg-border after:scale-x-0 hover:after:scale-x-100'}`}
						>
							Posts
						</Link>

						<Link
							href="/readings"
							aria-current={isReadingsPage ? 'page' : undefined}
							className={`relative pb-1 font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:transition-transform after:duration-200 ${isReadingsPage ? 'text-foreground after:bg-title after:scale-x-100' : 'text-text after:bg-border-subtle hover:text-foreground hover:after:bg-border after:scale-x-0 hover:after:scale-x-100'}`}
						>
							Leituras
						</Link>

						<Link
							href="/about"
							aria-current={isAboutPage ? 'page' : undefined}
							className={`relative pb-1 font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:transition-transform after:duration-200 ${isAboutPage ? 'text-foreground after:bg-title after:scale-x-100' : 'text-text after:bg-border-subtle hover:text-foreground hover:after:bg-border after:scale-x-0 hover:after:scale-x-100'}`}
						>
							Sobre
						</Link>
					</nav>

					<button
						type="button"
						onClick={toggleTheme}
						aria-label={`Ativar modo ${isDarkMode ? 'claro' : 'escuro'}`}
						title={`Ativar modo ${isDarkMode ? 'claro' : 'escuro'}`}
						className="text-title hover:text-foreground cursor-pointer transition-colors"
					>
						{isDarkMode ? <FaSun size={iconSize} /> : <FaMoon size={iconSize} />}
					</button>
				</div>
			</div>
		</header>
	);
}
