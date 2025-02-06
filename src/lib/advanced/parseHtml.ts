import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import * as turndownPluginGfm from 'joplin-turndown-plugin-gfm';

export function parseHtml(html: string) {
  const dom = cheerio.load(html);
  const title = dom('title').text();
  const description = dom('meta[name="description"]').attr('content') ?? '';
  const keywords = dom('meta[name="keywords"]').attr('content') ?? '';
  const bodyHtml = dom('body').html() ?? '';
  const bodyText = dom('body').text() ?? '';
  const bodyMarkdown = convertToMarkdown(bodyHtml);
  return { title, description, keywords, bodyHtml, bodyText, bodyMarkdown };
}

function convertToMarkdown(content: string) {
  if (!content) {
    throw new Error('Failed to parse article content');
  }

  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    bulletListMarker: '-',
  });

  turndownService.use(turndownPluginGfm.gfm);

  turndownService.addRule('ignoreScriptsAndStyles', {
    filter: ['script', 'style', 'noscript'],
    replacement: () => '',
  });

  turndownService.keep([
    'h1',
    'h2',
    'h3',
    'p',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'blockquote',
    'pre',
    'code',
  ]);

  let markdown = turndownService.turndown(content);
  markdown = markdown.replace(/({|})/g, '\\$1');
  markdown = markdown.replace(/\[Skip to Content\]\(#[^\)]*\)/gi, '');

  return markdown;
}
