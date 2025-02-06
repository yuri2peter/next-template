import FileUploader from '@/components/advanced/FileUploader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRootLayer } from '@/components/ui/rootLayer';
import { useImmer } from 'use-immer';

function UploadModal({
  onOpenChange,
  onConfirm,
}: {
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { name: string; url: string; isImage: boolean }) => void;
}) {
  const [state, setState] = useImmer({
    name: '',
    url: '',
    isImage: false,
  });
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Image / File Block</DialogTitle>
          <DialogDescription>
            Create an image or file block from a URL or upload a file.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          onChange={(info) => {
            setState((draft) => {
              draft.name = info.filename;
              draft.url = info.url;
              draft.isImage = info.isImage;
            });
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={!state.url}
              onClick={() => {
                onConfirm(state);
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function openUploadModal(
  handleConfirm: (data: { name: string; url: string; isImage: boolean }) => void
) {
  const remover = useRootLayer.getState().addElement(
    <UploadModal
      onConfirm={handleConfirm}
      onOpenChange={(open) => {
        if (!open) {
          remover();
        }
      }}
    />
  );
  return remover;
}
