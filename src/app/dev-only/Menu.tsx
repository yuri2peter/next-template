'use client';

import { usePathname } from 'next/navigation';
import { links } from './defines';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Menu() {
  const pathname = usePathname();
  return (
    <ul className="p-4 pl-0">
      {links.map((link) => {
        const fullPath = `/dev-only/${link.subPath}`;
        const isActive = pathname === fullPath;
        return (
          <li key={link.subPath}>
            <Link
              href={fullPath}
              className={cn(
                'block p-1 hover:bg-gray-100 rounded-md',
                isActive ? 'text-blue-500' : ''
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
