'use client';

import React from 'react';
import { useImmer } from 'use-immer';
import FileUploader from '@/components/advanced/FileUploader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function PageContent() {
  const [state, setState] = useImmer({
    type: 'auto' as const as 'auto' | 'image' | 'file',
    filename: '',
    url: '',
  });
  return (
    <main className="prose flex flex-col w-full gap-4">
      <h2>Upload File</h2>
      <p>Try to upload a file here.</p>
      <RadioGroup
        value={state.type}
        className="flex flex-row gap-2"
        onValueChange={(value) =>
          setState((draft) => {
            draft.type = value as 'auto' | 'image' | 'file';
          })
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auto" id="r1" />
          <Label htmlFor="r1">Auto</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image" id="r2" />
          <Label htmlFor="r2">Image</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="file" id="r3" />
          <Label htmlFor="r3">File</Label>
        </div>
      </RadioGroup>
      <FileUploader
        type={state.type}
        defaultSrc={state.url}
        onChange={({ url, filename }) =>
          setState((draft) => {
            draft.url = url;
            draft.filename = filename;
          })
        }
      />
      {state.url && (
        <p>
          <a href={state.url} target="_blank" rel="noreferrer">
            {state.filename}
          </a>
        </p>
      )}
    </main>
  );
}
