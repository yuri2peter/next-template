import { redirect } from 'next/navigation';

export const devOnly = () => {
  if (process.env.NODE_ENV === 'production') {
    redirect('/');
  }
};
