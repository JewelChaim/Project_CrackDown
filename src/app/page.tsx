import Link from "next/link";
import { Stat } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <section className="rounded-xl bg-panel glass border border-brand/20 p-10 shadow-md">
        <h1 className="text-3xl font-semibold mb-2">Welcome to Project CrackDown</h1>
        <p className="text-teal-100/80 max-w-2xl">Manage facilities, staff, and lightweight surveys. Fast, secure, on-brand.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className={buttonVariants("primary")}>Sign in</Link>
          <Link href="/admin" className={buttonVariants("secondary")}>Admin</Link>
        </div>
      </section>
      <section className="grid sm:grid-cols-3 gap-4 mt-8">
        <Stat label="Uptime" value="99.9%" icon="✅" />
        <Stat label="Security" value="SOC2-ready" icon="🛡️" />
        <Stat label="Latency" value="<100ms" icon="⚡" />
      </section>
    </>
  );
}
