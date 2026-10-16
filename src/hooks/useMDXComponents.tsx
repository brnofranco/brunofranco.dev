import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/components/CopyButton';

interface CodeProps {
	className?: string;
	children?: ReactNode;
}

function CodeBlock({ children }: Readonly<{ children?: ReactNode }>) {
	if (!isValidElement<CodeProps>(children)) {
		return <pre>{children}</pre>;
	}

	const language = children.props.className?.replace('language-', '') || 'text';
	const code = String(children.props.children ?? '').replace(/\n$/, '');

	return (
		<div className="code-block">
			<div className="code-block-header">
				<span>{language}</span>
				<CopyButton code={code} />
			</div>

			<SyntaxHighlighter language={language} style={vscDarkPlus}>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}

export function getMDXComponents(components: MDXComponents = {}): MDXComponents {
	return {
		...components,
		pre: CodeBlock,
	};
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return getMDXComponents(components);
}
