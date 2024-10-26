'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1 className="text-3xl mb-8">404 | Page Not Found</h1>
        <div className="flex gap-4">
          <p>
            You can go back to the{' '}
            <Link href="/" className="text-blue-500 underline">
              home
            </Link>{' '}
            page or{' '}
            <Link
              href="javascript:void(0)"
              onClick={() => router.back()}
              className="text-blue-500 underline"
            >
              go back
            </Link>{' '}
            to the previous page.
          </p>
        </div>
      </div>
    </div>
  );
}
