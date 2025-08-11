"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        <main className="mx-auto max-w-5xl p-16">
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto">{String(error?.stack || error?.message)}</pre>
        </main>
      </body>
    </html>
  );
}

