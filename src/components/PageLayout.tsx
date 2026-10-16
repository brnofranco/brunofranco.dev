'use client';

import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

export default function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className="flex min-h-screen w-full flex-col items-center px-5 py-8 sm:px-8 md:py-12">
			<div className="flex min-h-screen w-full max-w-[1040px] flex-col">
				<div className="flex w-full flex-col items-center justify-center pb-10">
					<Header />
				</div>

				<main className="flex h-full w-full justify-center">
					<div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
				</main>

				<div className="flex w-full flex-col items-center justify-center pt-16 pb-8">
					<Footer />
				</div>
			</div>
		</div>
	);
}
