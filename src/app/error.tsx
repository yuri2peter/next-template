'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1 className="text-3xl mb-8">Ops! Something went wrong.</h1>
        <div className="flex gap-4">
          <p>
            You can go back to the{' '}
            <Link href="/" className="text-blue-500 underline">
              home
            </Link>{' '}
            page or{' '}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
              className="text-blue-500 underline"
            >
              try again
            </Link>{' '}
            to the previous page.
          </p>
        </div>
      </div>
    </div>
  );
}
