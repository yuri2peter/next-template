import { fal } from '@fal-ai/client';
import { ImageGenerateService } from './defines';
import { remoteDownload } from '@/app/api/file/remote-download/lib';

export const falImageGenerateService: ImageGenerateService = {
  generateImage: async (prompt: string) => {
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });
    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt,
        num_images: 1,
        image_size: 'landscape_16_9',
      },
    });
    const remoteUrl = result.data.images[0].url;
    const { url } = await remoteDownload(remoteUrl);
    return url;
  },
};
