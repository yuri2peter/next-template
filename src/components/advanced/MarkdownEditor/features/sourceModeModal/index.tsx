import MarkdownCodemirror from '@/components/advanced/MarkdownCodemirror';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRootLayer } from '@/components/ui/rootLayer';
import { useImmer } from 'use-immer';

function Modal({
  defaultValue,
  onOpenChange,
}: {
  defaultValue: string;
  onOpenChange: (open: boolean, markdown: string) => void;
}) {
  const [state, setState] = useImmer({
    value: defaultValue,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        onOpenChange(open, state.value);
      }}
    >
      <DialogContent className="max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Source Mode</DialogTitle>
        </DialogHeader>
        <MarkdownCodemirror
          className="max-h-[calc(100vh-200px)] min-h-[200px] w-full overflow-auto"
          value={state.value}
          enableAiEnhancer
          onChangeDebounceDelay={500}
          onChange={(markdown) => {
            setState((draft) => {
              draft.value = markdown;
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function openSourceModeModal(
  markdown: string,
  onChange: (markdown: string) => void
) {
  const remover = useRootLayer.getState().addElement(
    <Modal
      defaultValue={markdown}
      onOpenChange={(open, markdown) => {
        if (!open) {
          onChange(markdown);
          remover();
        }
      }}
    />
  );
  return remover;
}
