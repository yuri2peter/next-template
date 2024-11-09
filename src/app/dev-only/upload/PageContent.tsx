'use client';

import React from 'react';
import { useImmer } from 'use-immer';
import Dropzone from '@/components/ui/dropzone';

export default function PageContent() {
  const [state, setState] = useImmer({
    filename: '',
    url: '',
  });
  return (
    <main className="prose flex flex-col">
      <h2>Upload</h2>
      <p>You can upload files here.</p>
      <Dropzone
        onShouldUpload={() => true}
        onUploaded={(data) => {
          setState((draft) => {
            draft.filename = data.filename;
            draft.url = data.url;
          });
        }}
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
