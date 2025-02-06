const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export async function scrapeLite({ url }: { url: string }) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
      },
    });
    const html = await res.text();
    return { content: html };
  } catch (error) {
    return { content: `<html><head><title>${url}</title></head><body><h1>Error</h1><p>${error}</p></body></html>` };
  }
}