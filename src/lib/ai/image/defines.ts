export type ImageGenerateService = {
  // should return a url like '/uploads/123.jpg'
  generateImage: (prompt: string) => Promise<string>;
};
