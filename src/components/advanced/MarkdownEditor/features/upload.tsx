import { upload, uploadConfig } from '@milkdown/kit/plugin/upload';
import { Editor } from '@milkdown/kit/core';
import { uploadFile } from '@/lib/file';
import { Node } from '@milkdown/kit/prose/model';
import { getNodeByUploadedFile } from '../utils';

export function defineUploadFeature(editor: Editor) {
  editor
    .config(async (ctx) => {
      ctx.update(uploadConfig.key, (defaultConfig) => ({
        ...defaultConfig,
        uploader: async (files, schema) => {
          const nodes: Node[] = [];
          for (const file of files) {
            const { filename, url } = await uploadFile({ file });
            const node = getNodeByUploadedFile({
              originalName: file.name,
              isImage: file.type.startsWith('image'),
              uploadedName: filename,
              url,
              schema,
            });
            nodes.push(node);
          }
          return nodes;
        },
        enableHtmlFileUploader: true,
      }));
    })
    .use(upload);
}
