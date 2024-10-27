import { devOnly } from '@/lib/route';
import DevOnlyNavLinks from './DevOnlyNavLinks';
import Menu from './Menu';

export default function DevOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  devOnly();
  return (
    <div className="p-4 pt-12 mx-auto max-w-screen-xl flex flex-col gap-8">
      <DevOnlyNavLinks />
      <div className="flex gap-12 items-start">
        <Menu />
        {children}
      </div>
    </div>
  );
}
