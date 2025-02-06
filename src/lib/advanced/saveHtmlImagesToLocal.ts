import { remoteDownload } from '@/app/api/file/remote-download/lib';
import * as cheerio from 'cheerio';

// localImageOriginFake is a fake origin for local images, which is used to avoid AI hallucination
export async function saveHtmlImagesToLocal(
  html: string,
  localImageOriginFake = ''
) {
  const dom = cheerio.load(html);
  const tasks: Promise<void>[] = [];
  dom('img').each((_index, item) => {
    const src = dom(item).attr('src');
    if (src && src.startsWith('http')) {
      tasks.push(
        (async () => {
          try {
            const { url, ext } = await remoteDownload(src);
            if (ext === 'html') {
              return;
            }
            dom(item).attr('src', localImageOriginFake + url);
          } catch (error) {
            console.error(error);
          }
        })()
      );
    }
  });
  await Promise.all(tasks);
  return dom.html();
}
