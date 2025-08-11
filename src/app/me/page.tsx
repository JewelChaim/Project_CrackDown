"use client";
import { useSession } from "next-auth/react";

export default function Me() {
  const { data, status } = useSession();
  return (
    <pre style={{ padding: 20 }}>
      status: {status}
      {"\n"}
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
