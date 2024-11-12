import { getMarkdownExample } from '../utils';
import PageContent from './PageContent';
export const metadata = {
  title: 'Markdown Preview',
};

export default function Page() {
  const text = getMarkdownExample();
  return <PageContent defaultValue={text} />;
}
