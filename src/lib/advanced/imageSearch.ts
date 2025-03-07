import { createClient } from 'pexels';
import { generateOpenaiJsonReply } from '../ai';
import { getRandomItemSplitByComma, shortId } from '../string';

export type Images = {
  id: string;
  src: string;
  alt: string;
}[];

const pexelsApiKey = process.env.PEXELS_API_KEY || '';

export async function imageSearchByApi(keywords: string): Promise<Images> {
  if (pexelsApiKey) {
    return imageSearchPexelsApi(keywords);
  }
  throw new Error('No image search engine available');
}

// https://www.pexels.com/api/documentation/?language=javascript
async function imageSearchPexelsApi(keywords: string): Promise<Images> {
  const client = createClient(getRandomItemSplitByComma(pexelsApiKey));
  const results = await client.photos.search({
    query: keywords,
    per_page: 16,
    orientation: 'landscape',
  });
  if (client.typeCheckers.isError(results)) {
    throw new Error(results.error);
  }
  return results.photos.map((t) => ({
    id: shortId(),
    src: t.src.landscape,
    alt: t.alt ?? '',
  }));
}

export async function imageSearchByAi(
  keywords: string[],
  relatedContent: string
): Promise<Images> {
  const images: Images = [];
  await Promise.all(
    keywords.map(async (keyword) => {
      const apiResults = await imageSearchByApi(keyword);
      images.push(...apiResults.slice(0, 16));
    })
  );
  const { imageIds } = await generateOpenaiJsonReply<{ imageIds: string[] }>({
    system: `
You are a helpful assistant that can help me find the best images for my content.
Select images to match the content, no more than 16.

EXAMPLE JSON OUTPUT:
{
  "imageIds": ["imageId1", "imageId2", "imageId3"],
}
`,
    user: `
Content:
${relatedContent}

------

Images: ${JSON.stringify(
      images.map((t) => ({
        id: t.id,
        alt: t.alt,
      }))
    )}
    `,
  });
  return (imageIds as string[])
    .map((id) => images.find((t) => t.id === id)!)
    .filter(Boolean)
    .slice(0, 16);
}
