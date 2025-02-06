import { redirect } from 'next/navigation';
import { IS_DEV_SERVER } from '@/lib/server';
import DevOnlyNavLinks from './DevOnlyNavLinks';
import Menu from './Menu';
import ThemeModeToggle from '@/components/ui/theme-mode-toggle';

export default async function DevOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!IS_DEV_SERVER) {
    return redirect('/');
  }
  return (
    <div className="p-4 pt-12 mx-auto max-w-screen-xl flex flex-col gap-8">
      <div className="flex justify-between">
        <DevOnlyNavLinks />
        <ThemeModeToggle />
      </div>
      <div className="flex gap-12 items-start">
        <Menu />
        {children}
      </div>
    </div>
  );
}
