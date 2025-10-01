// src/components/views/CodeViewer.tsx
'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a theme. `vscDarkPlus` is a popular choice that mimics VS Code's dark theme.
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewerProps {
  code: string;
  language: string;
}

// Helper to map file extensions to language names the library understands
const getLanguage = (filePath: string): string => {
  const extension = filePath.split('.').pop() || '';
  switch (extension) {
    case 'js': return 'javascript';
    case 'jsx': return 'jsx';
    case 'ts': return 'typescript';
    case 'tsx': return 'tsx';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'html': return 'html';
    case 'yml':
    case 'yaml': return 'yaml';
    default: return 'plaintext';
  }
};

export function CodeViewer({ code, language }: CodeViewerProps) {
  return (
    <div className="flex-1 overflow-auto rounded-md bg-[#1e1e1e]">
      <SyntaxHighlighter
        language={getLanguage(language)}
        style={vscDarkPlus}
        showLineNumbers // Optional: adds line numbers for better readability
        wrapLines
        customStyle={{
          margin: 0,
          padding: '1rem',
          height: '100%',
          backgroundColor: 'transparent',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)', // Use the same monospace font as the rest of the app
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

