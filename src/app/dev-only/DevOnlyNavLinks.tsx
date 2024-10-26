'use client';

import NavLinks from '@/components/advanced/NavLinks';
import { usePathname } from 'next/navigation';
import { links } from './defines';

export default function DevOnlyNavLinks() {
  const pathname = usePathname();
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dev Only', href: '/dev-only' },
  ];
  const matchPage = links.find(
    (link) => pathname === '/dev-only/' + link.subPath
  );
  if (matchPage) {
    navLinks.push({
      label: matchPage.label,
      href: pathname,
    });
  }
  return <NavLinks links={navLinks} />;
}
