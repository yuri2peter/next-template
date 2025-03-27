import { ImageGenerateService } from './defines';
import { pollinationsaiImageGenerateService } from './pollinationai';

export async function getImageGenerateService(): Promise<ImageGenerateService> {
  return pollinationsaiImageGenerateService;
}
