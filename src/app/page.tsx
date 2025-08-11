import { Stat } from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      <section className="rounded-3xl bg-panel glass border border-panel p-10">
        <h1 className="text-3xl font-semibold mb-2">Welcome to Project CrackDown</h1>
        <p className="text-teal-100/80 max-w-2xl">Manage facilities, staff, and lightweight surveys. Fast, secure, on-brand.</p>
        <div className="mt-6 flex gap-3">
          <a href="/login" className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white border border-panel">Sign in</a>
          <a href="/admin" className="px-4 py-2 rounded-lg bg-transparent border border-panel hover:bg-panel">Admin</a>
        </div>
      </section>
      <section className="grid sm:grid-cols-3 gap-4">
        <Stat label="Uptime" value="99.9%" />
        <Stat label="Security" value="SOC2-ready" />
        <Stat label="Latency" value="<100ms" />
      </section>
    </>
  );
}
