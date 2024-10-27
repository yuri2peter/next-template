'use client';

import { usePathname } from 'next/navigation';
import { links } from './defines';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Menu() {
  const pathname = usePathname();
  return (
    <ul className="p-4 pl-0">
      {links.map((link) => {
        const fullPath = `/dev-only/${link.subPath}`;
        const isActive = pathname === fullPath;
        return (
          <li key={link.subPath}>
            <Button
              asChild
              variant={'linkHover2'}
              className="w-full justify-start"
            >
              <Link
                href={fullPath}
                className={cn({ 'text-blue-500': isActive })}
              >
                {link.label}
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
