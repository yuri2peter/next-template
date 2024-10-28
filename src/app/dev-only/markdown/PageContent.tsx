'use client';

import MarkdownPreview from '@/components/advanced/MarkdownPreview';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Head from 'next/head';
import React, { useState } from 'react';
import defaultText from './defaultText.md';

export default function PageContent() {
  const [value, setValue] = useState(defaultText);
  return (
    <>
      <Head>
        <title>Markdown Preview</title>
      </Head>
      <main className="flex flex-row gap-4 w-full h-[640px]">
        <Textarea
          autoFocus
          placeholder="Markdown contents here..."
          className="resize-none w-1/2"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <Card className="w-1/2 shadow-none rounded-md p-2 overflow-auto">
          <MarkdownPreview>{value}</MarkdownPreview>
        </Card>
      </main>
    </>
  );
}
