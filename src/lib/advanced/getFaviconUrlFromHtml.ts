import { remoteDownload } from '@/app/api/file/remote-download/lib';
import * as cheerio from 'cheerio';
import { fixRelativeLinks } from '../string';

export async function getFaviconUrlFromHtml(html: string, pageUrl: string) {
  const dom = cheerio.load(html);
  const faviconUrl =
    dom('link')
      .filter((_i, el) => {
        const rel = dom(el).attr('rel');
        return !!rel && rel.includes('icon');
      })
      .attr('href') || '/favicon.ico';
  const { url } = await remoteDownload(fixRelativeLinks(faviconUrl, pageUrl));
  return url;
}
