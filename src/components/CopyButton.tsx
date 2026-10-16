'use client';

import { useEffect, useState } from 'react';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

export default function CopyButton({ code }: Readonly<{ code: string }>) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (!isChecked) return;

		const timeoutId = window.setTimeout(() => setIsChecked(false), 2000);
		return () => window.clearTimeout(timeoutId);
	}, [isChecked]);

	const copyCodeToClipboard = async () => {
		await navigator.clipboard.writeText(code);
		setIsChecked(true);
	};

	return (
		<button
			type="button"
			onClick={copyCodeToClipboard}
			title="Copiar código"
			aria-label="Copiar código"
			className="cursor-pointer"
		>
			{isChecked ? <FaCheck /> : <FaRegCopy />}
		</button>
	);
}
