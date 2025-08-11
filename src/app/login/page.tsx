"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@jewelhc.com");
  const [password, setPassword] = useState("");
  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={()=>signIn("credentials", { email, password, callbackUrl: "/" })}>
        Sign in
      </button>
    </main>
  );
}
