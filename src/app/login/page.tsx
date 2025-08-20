"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@jewelhc.com");
  const [password, setPassword] = useState("");

  return (
    <Card className="max-w-md mx-auto">
      <CardBody>
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
        <div className="space-y-3">
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button onClick={()=>signIn("credentials", { email, password, callbackUrl: "/admin" })}>Continue</Button>
        </div>
        <p className="text-xs text-gray-500 mt-4">Dev mode: password not validated; email must exist.</p>
      </CardBody>
    </Card>
  );
}
