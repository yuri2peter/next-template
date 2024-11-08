import PageContent from './PageContent';
import fs from 'fs';
export const metadata = {
  title: 'Markdown Editor',
};

export default function Page() {
  const text = fs.readFileSync('./assets/markdown-test.md', 'utf8');
  return <PageContent defaultValue={text} />;
}
