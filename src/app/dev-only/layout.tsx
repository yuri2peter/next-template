import { redirect } from 'next/navigation';
import { ALLOW_DEV_ONLY_PAGES, IS_DEV_SERVER } from '@/lib/server';
import DevOnlyNavLinks from './DevOnlyNavLinks';
import Menu from './Menu';
import { ModeToggle } from '@/components/ui/theme-mode-toggle';

export default function DevOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(ALLOW_DEV_ONLY_PAGES || IS_DEV_SERVER)) {
    return redirect('/');
  }
  return (
    <div className="p-4 pt-12 mx-auto max-w-screen-xl flex flex-col gap-8">
      <div className="flex justify-between">
        <DevOnlyNavLinks />
        <ModeToggle />
      </div>
      <div className="flex gap-12 items-start">
        <Menu />
        {children}
      </div>
    </div>
  );
}
