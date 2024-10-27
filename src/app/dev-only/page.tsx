export const metadata = {
  title: 'Dev Only',
};

export default function Wip() {
  return (
    <main className="prose flex flex-col">
      <h2>Dev Only</h2>
      <p>Playground for development.</p>
      <blockquote>
        This page is only available in development mode. It is not available in
        production.
      </blockquote>
    </main>
  );
}
