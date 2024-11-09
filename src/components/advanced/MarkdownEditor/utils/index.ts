import { Schema } from '@milkdown/kit/prose/model'
import type { Selection } from '@milkdown/kit/prose/state'

export function isInCodeBlock(selection: Selection) {
  const type = selection.$from.parent.type
  return type.name === 'code_block'
}

export function isInList(selection: Selection) {
  const type = selection.$from.node(selection.$from.depth - 1)?.type
  return type?.name === 'list_item'
}

export function defIfNotExists(tagName: string, element: CustomElementConstructor) {
  if (customElements.get(tagName) == null)
    customElements.define(tagName, element)
}

export function getNodeByUploadedFile({
  originalName,
  isImage,
  uploadedName,
  url,
  schema,
}: {
  originalName: string;
  isImage: boolean;
  uploadedName: string;
  url: string;
  schema: Schema;
}) {
  if (isImage) {
    return schema.node('image', {
      src: url,
      alt: uploadedName,
    });
  } else {
    return schema.text(originalName, [
      schema.marks.link.create({
        title: originalName,
        href: url,
      }),
    ]);
  }
}
