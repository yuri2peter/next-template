import CodeMirror from '@uiw/react-codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';
import { useMemo, useRef } from 'react';
import { debounce } from 'radash';

export default function MarkdownCodemirror({
  value,
  onChange,
  className,
  onChangeDebounceDelay = 0,
}: {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  onChangeDebounceDelay?: number;
}) {
  const refOnChange = useRef(onChange);
  refOnChange.current = onChange;
  const handleChangeFixed = useMemo(() => {
    const delay = onChangeDebounceDelay ?? 0;
    const handleChange = (text: string) => {
      refOnChange.current?.(text);
    };
    return delay > 0 ? debounce({ delay }, handleChange) : handleChange;
  }, [onChangeDebounceDelay]);
  return (
    <CodeMirror
      value={value}
      onChange={handleChangeFixed}
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
