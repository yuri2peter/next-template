import * as cheerio from 'cheerio';
import { fixRelativeLinks } from '../string';

export function cleanAndFixHtml(html: string, link: string) {
  const dom = cheerio.load(html);

  // remove unneeded tags
  ['script', 'style', 'link', 'svg', 'noscript'].forEach((tag) => {
    dom(tag).each((_index, item) => {
      dom(item).remove();
    });
  });
  // remove style, class, data-* attribute
  dom('*').each((_index, item) => {
    dom(item).removeAttr('style');
    dom(item).removeAttr('class');
    // remove data-* attributes
    const attributes = dom(item).attr();
    for (const attr in attributes) {
      if (attr.startsWith('data-')) {
        dom(item).removeAttr(attr);
      }
    }
  });
  // remove meta tags
  dom('meta').each((_index, item) => {
    // keep keywords and description
    const name = dom(item).attr('name');
    if (name === 'keywords' || name === 'description') {
      return;
    }
    dom(item).remove();
  });

  // fix relative links
  dom('img').each((_index, item) => {
    const src = dom(item).attr('src');
    if (src) {
      dom(item).attr('src', fixRelativeLinks(src, link));
    }
  });
  dom('a').each((_index, item) => {
    const href = dom(item).attr('href');
    if (href) {
      dom(item).attr('href', fixRelativeLinks(href, link));
    }
  });
  return dom.html();
}
