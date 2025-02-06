import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRootLayer } from '@/components/ui/rootLayer';
import { createContext, useContext } from 'react';

export function openModal(title: string, content: React.ReactNode) {
  const { addElement } = useRootLayer.getState();
  const remover = addElement(
    <Dialog
      open
      onOpenChange={() => {
        remover();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogContextProvider value={{ close: () => remover() }}>
          <div className="max-h-[calc(100vh-200px)] overflow-auto">
            {content}
          </div>
        </DialogContextProvider>
      </DialogContent>
    </Dialog>
  );
}

const DialogContext = createContext({
  close: () => {},
});

const DialogContextProvider = DialogContext.Provider;
export const useDialogContext = () => useContext(DialogContext);
