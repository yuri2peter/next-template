import { editorViewCtx, schemaCtx } from '@milkdown/kit/core';
import {
  blockquoteSchema,
  bulletListSchema,
  codeBlockSchema,
  headingSchema,
  hrSchema,
  listItemSchema,
  orderedListSchema,
  paragraphSchema,
} from '@milkdown/kit/preset/commonmark';
import { NodeSelection } from '@milkdown/kit/prose/state';
import { createTable } from '@milkdown/kit/preset/gfm';
import {
  bulletListIcon,
  codeIcon,
  dividerIcon,
  h1Icon,
  h2Icon,
  h3Icon,
  h4Icon,
  orderedListIcon,
  quoteIcon,
  tableIcon,
  textIcon,
  todoListIcon,
} from '../../icons';
import type { MenuItemGroup } from './utils';
import {
  clearContentAndAddBlockType,
  clearContentAndAddNode,
  clearContentAndSetBlockType,
  clearContentAndWrapInBlockType,
  clearRange,
} from './utils';
import { GroupBuilder } from './group-builder';
import { uploadIcon } from '../../icons/upload';
import { selectFileFromBrowser, uploadFile } from '@/lib/file';
import { getNodeByUploadedFile } from '../upload';

export function getGroups(filter?: string) {
  const groupBuilder = new GroupBuilder();
  groupBuilder
    .addGroup('text', 'Text')
    .addItem('text', {
      label: 'Text',
      icon: textIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndSetBlockType(paragraphSchema.type(ctx));
        command(state, dispatch);
      },
    })
    .addItem('h1', {
      label: 'Heading 1',
      icon: h1Icon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndSetBlockType(headingSchema.type(ctx), {
          level: 1,
        });
        command(state, dispatch);
      },
    })
    .addItem('h2', {
      label: 'Heading 2',
      icon: h2Icon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndSetBlockType(headingSchema.type(ctx), {
          level: 2,
        });
        command(state, dispatch);
      },
    })
    .addItem('h3', {
      label: 'Heading 3',
      icon: h3Icon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndSetBlockType(headingSchema.type(ctx), {
          level: 3,
        });
        command(state, dispatch);
      },
    })
    .addItem('h4', {
      label: 'Heading 4',
      icon: h4Icon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndSetBlockType(headingSchema.type(ctx), {
          level: 4,
        });
        command(state, dispatch);
      },
    })
    .addItem('quote', {
      label: 'Quote',
      icon: quoteIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndWrapInBlockType(
          blockquoteSchema.type(ctx)
        );
        command(state, dispatch);
      },
    })
    .addItem('divider', {
      label: 'Divider',
      icon: dividerIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndAddBlockType(hrSchema.type(ctx));
        command(state, dispatch);
      },
    });

  groupBuilder
    .addGroup('list', 'List')
    .addItem('bullet-list', {
      label: 'Bullet List',
      icon: bulletListIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndWrapInBlockType(
          bulletListSchema.type(ctx)
        );
        command(state, dispatch);
      },
    })
    .addItem('ordered-list', {
      label: 'Ordered List',
      icon: orderedListIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndWrapInBlockType(
          orderedListSchema.type(ctx)
        );
        command(state, dispatch);
      },
    })
    .addItem('todo-list', {
      label: 'Todo List',
      icon: todoListIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndWrapInBlockType(
          listItemSchema.type(ctx),
          { checked: false }
        );
        command(state, dispatch);
      },
    });

  groupBuilder
    .addGroup('advanced', 'Advanced')
    .addItem('code', {
      label: 'Code',
      icon: codeIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;

        const command = clearContentAndAddBlockType(codeBlockSchema.type(ctx));
        command(state, dispatch);
      },
    })
    .addItem('table', {
      label: 'Table',
      icon: tableIcon,
      onRun: (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;
        const tr = clearRange(state.tr);
        const table = createTable(ctx, 3, 3);
        tr.replaceSelectionWith(table);
        const { from } = tr.selection;
        const pos = from - table.nodeSize + 2;
        dispatch(tr);
        requestAnimationFrame(() => {
          const selection = NodeSelection.create(view.state.tr.doc, pos);
          dispatch(view.state.tr.setSelection(selection).scrollIntoView());
        });
      },
    })
    .addItem('upload', {
      label: 'Upload',
      icon: uploadIcon,
      onRun: async (ctx) => {
        const view = ctx.get(editorViewCtx);
        const { dispatch, state } = view;
        const schema = ctx.get(schemaCtx);
        const file = await selectFileFromBrowser(false);
        const { filename, url } = await uploadFile({ file });
        const node = getNodeByUploadedFile({
          originalName: file.name,
          isImage: file.type.startsWith('image'),
          uploadedName: filename,
          url,
          schema,
        });
        const command = clearContentAndAddNode(node);
        command(state, dispatch);
      },
    });

  let groups = groupBuilder.build();

  if (filter) {
    groups = groups
      .map((group) => {
        const items = group.items.filter((item) =>
          item.label.toLowerCase().includes(filter.toLowerCase())
        );

        return {
          ...group,
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }

  const items = groups.flatMap((groups) => groups.items);
  items.forEach((item, index) => {
    Object.assign(item, { index });
  });

  groups.reduce((acc, group) => {
    const end = acc + group.items.length;
    Object.assign(group, {
      range: [acc, end],
    });
    return end;
  }, 0);

  return {
    groups: groups as MenuItemGroup[],
    size: items.length,
  };
}
