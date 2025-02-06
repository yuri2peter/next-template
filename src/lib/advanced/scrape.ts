// This scraper has been replaced by scrapeLite, which is much faster and not dependent on Chromium
import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import { Browser, Page } from 'puppeteer';
import { shortId } from '@/lib/string';
import { RUNTIME_DATA_PATH, UPLOADS_PATH } from '@/lib/path';
import path from 'path';

export const DEFAULT_VIEWPORT = { width: 1440, height: 480 };

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

let browser: Browser | null = null;

export async function scrape({ url }: { url: string }) {
  let page: Page | null = null;

  try {
    console.log('Scraping started: ', url);
    if (!browser) {
      console.log('Launching scraper browser');
      browser = await puppeteer.launch({
        // https://github.com/puppeteer/puppeteer/issues/7740
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-gpu',
        ],
      });
    }
    page = await browser.newPage();
    await page.setViewport(DEFAULT_VIEWPORT);
    await page.setUserAgent(DEFAULT_USER_AGENT);
    await navigateToPage(page, url);
    const screenshotUrl = await screenshot(page);
    const content = await getPageContent(page);
    fs.writeFileSync(
      path.join(RUNTIME_DATA_PATH, `scrape-content.html`),
      content
    );
    return {
      screenshotUrl,
      content,
    };
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  } finally {
    await cleanup(page);
  }
}

async function screenshot(page: Page) {
  const filename = `screenshot-${shortId()}.png`;
  const filepath = path.join(UPLOADS_PATH, filename);
  fs.ensureDirSync(UPLOADS_PATH);
  await page.screenshot({ path: filepath });
  return '/uploads/' + filename;
}

async function navigateToPage(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'load', timeout: 30 * 1000 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve());
        }
      })
  );
}

async function getPageContent(page: Page): Promise<string> {
  return page.evaluate(() => new XMLSerializer().serializeToString(document));
}

async function cleanup(page: Page | null, browser?: Browser): Promise<void> {
  if (page) await page.close();
  if (browser) await browser.close();
}
