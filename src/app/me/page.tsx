"use client";
import { useSession } from "next-auth/react";

export default function Me() {
  const { data, status } = useSession();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl mb-4">Session</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        status: {status}
        {"\n"}
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}

