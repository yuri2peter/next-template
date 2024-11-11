import CodeMirror from '@uiw/react-codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

export default function MarkdownCodemirror({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      className={cn(styles.editor, className)}
      extensions={[
        basicSetup({
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
        }),
        keymap.of(defaultKeymap.concat(indentWithTab)),
        vscodeDark,
        loadLanguage('markdown')!,
      ]}
    />
  );
}
