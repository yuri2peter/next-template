import { saveDataToPublic } from '@/lib/advanced/saveToPublic';
import { ImageGenerateService } from './defines';
import { createImageService } from 'pollinationsai';

export const pollinationsaiImageGenerateService: ImageGenerateService = {
  generateImage: async (prompt: string) => {
    const imageService = createImageService();
    // Generate image from prompt
    const imageBuffer = await imageService.generate(prompt, {
      model: 'flux',
      // 16:9
      width: 1280,
      height: 720,
      private: true,
      safe: true,
      nologo: true,
      enhance: true,
    });
    const url = await saveDataToPublic(imageBuffer, `${Date.now()}.jpg`);
    return url;
  },
};
