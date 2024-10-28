'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PageContent() {
  const [error, setError] = useState('');
  if (error) {
    throw new Error(error);
  }
  return (
    <main className="prose flex flex-col">
      <h3>This is a test error page.</h3>
      <p>Click the button below to throw an error.</p>
      <p>
        <Button
          variant={'ringHover'}
          onClick={() => setError('This is a test error')}
        >
          Throw Error
        </Button>
      </p>
    </main>
  );
}
