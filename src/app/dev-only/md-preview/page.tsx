import { getMarkdownExample } from '../utils';
import PageContent from './PageContent';
export const metadata = {
  title: 'Markdown Preview',
};

export default async function Page() {
  const text = await getMarkdownExample();
  return <PageContent defaultValue={text} />;
}
