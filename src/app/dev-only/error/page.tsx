export const metadata = {
  title: 'Error',
};

export default function Page() {
  throw new Error('This is a test error');
  return (
    <>
      <h1>Error</h1>
    </>
  );
}
