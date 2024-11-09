import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Dropzone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRootLayer } from '@/components/ui/rootLayer';
import { checkIsImageUrl } from '@/lib/string';
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
        <div className="flex flex-row items-center gap-8 justify-between">
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="url">URL:</Label>
            <Input
              id="url"
              value={state.url}
              onChange={(e) => {
                setState((draft) => {
                  draft.url = e.target.value;
                  draft.isImage = checkIsImageUrl(e.target.value);
                  draft.name = e.target.value.split('/').pop() || 'Untitled';
                });
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              id="isImage"
              checked={state.isImage}
              onCheckedChange={(checked) => {
                setState((draft) => {
                  draft.isImage = Boolean(checked);
                });
              }}
            />
            <Label htmlFor="isImage">Show as image</Label>
          </div>
        </div>
        <Dropzone
          onUploaded={(data) => {
            setState((draft) => {
              draft.name = data.filename;
              draft.url = data.url;
              draft.isImage = data.isImage;
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
