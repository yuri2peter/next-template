'use client';

import CanvasAnimatedGradientBackground, {
  CanvasAnimatedGradientBackgroundControls,
  Params,
} from '@/components/advanced/backgrounds/CanvasAnimatedGradientBackground';
import Head from 'next/head';
import { useState } from 'react';

export default function PageContent() {
  const [value, setValue] = useState<Params>({});
  return (
    <>
      <Head>
        <title>Background</title>
      </Head>
      <div className="w-[560px] h-[800px] flex flex-col gap-4">
        <CanvasAnimatedGradientBackgroundControls
          value={value}
          onChange={(v) => {
            setValue(v);
          }}
        />
        <pre>{JSON.stringify(value)}</pre>
        <CanvasAnimatedGradientBackground {...value} />
      </div>
    </>
  );
}
