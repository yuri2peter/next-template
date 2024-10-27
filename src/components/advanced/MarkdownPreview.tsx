import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

export default function MarkdownPreview({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <Markdown
      className={cn('prose', 'prose-pre:p-0', className)}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[
        rehypeKatex,
        [
          rehypeHighlight,
          {
            detect: true,
          },
        ],
      ]}
    >
      {children}
    </Markdown>
  );
}
