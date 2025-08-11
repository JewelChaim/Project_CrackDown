import { requireAdmin } from "@/lib/auth";
import { fetchApploiJobs } from "@/lib/apploi";

export default async function ApploiPage() {
  await requireAdmin();
  const data = await fetchApploiJobs();
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Apploi Jobs</h1>
      <pre className="bg-panel border border-panel rounded p-4 overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
