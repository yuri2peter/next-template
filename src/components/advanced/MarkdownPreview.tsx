import Markdown from 'react-markdown';

export default function MarkdownPreview({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return <Markdown className={'prose ' + className}>{children}</Markdown>;
}
