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
    <div className="p-4 pt-12 mx-auto max-w-screen-md flex flex-col gap-8">
      <DevOnlyNavLinks />
      <div className="flex gap-12">
        <Menu />
        {children}
      </div>
    </div>
  );
}