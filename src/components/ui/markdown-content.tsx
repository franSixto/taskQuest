'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function MarkdownContent({ content, className, variant = 'default' }: MarkdownContentProps) {
  const isCompact = variant === 'compact';
  
  return (
    <div className={cn(
      'markdown-content text-gray-300',
      isCompact ? 'markdown-compact' : '',
      className
    )}>
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className={cn(
              'font-bold text-white border-b border-white/10 pb-2',
              isCompact ? 'text-base mb-2' : 'text-xl mb-3'
            )}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn(
              'font-bold text-white',
              isCompact ? 'text-sm mb-1.5 mt-3' : 'text-lg mb-2 mt-4'
            )}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn(
              'font-semibold text-gray-200',
              isCompact ? 'text-sm mb-1 mt-2' : 'text-base mb-2 mt-3'
            )}>
              {children}
            </h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className={cn(
              'text-gray-400',
              isCompact ? 'text-sm mb-2 leading-relaxed' : 'mb-3 leading-relaxed'
            )}>
              {children}
            </p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className={cn(
              'list-disc list-inside space-y-1 text-gray-400',
              isCompact ? 'text-sm mb-2 ml-1' : 'mb-3 ml-2'
            )}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={cn(
              'list-decimal list-inside space-y-1 text-gray-400',
              isCompact ? 'text-sm mb-2 ml-1' : 'mb-3 ml-2'
            )}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          // Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-300">{children}</em>
          ),
          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-surface-dark text-primary text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={cn(className, 'block p-3 rounded-lg bg-surface-dark text-sm font-mono overflow-x-auto mb-3')}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="rounded-lg bg-surface-dark border border-white/5 overflow-hidden mb-3">
              {children}
            </pre>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className={cn(
              'border-l-2 border-primary/50 pl-3 italic text-gray-400',
              isCompact ? 'text-sm mb-2' : 'mb-3'
            )}>
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="border-white/10 my-4" />
          ),
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-400 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          // Checkbox (for task lists)
          input: ({ type, checked }) => {
            if (type === 'checkbox') {
              return (
                <input 
                  type="checkbox" 
                  checked={checked} 
                  readOnly 
                  className="mr-2 rounded border-gray-600 bg-surface-dark text-primary focus:ring-primary/50"
                />
              );
            }
            return null;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
