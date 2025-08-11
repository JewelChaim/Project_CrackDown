import { requireAdmin } from "@/lib/auth";
import { fetchTimeEntries } from "@/lib/hostedtime";

export default async function TimeClockPage() {
  await requireAdmin();
  const data = await fetchTimeEntries();
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Time Clock</h1>
      <pre className="bg-panel border border-panel rounded p-4 overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
