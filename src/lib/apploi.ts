export async function fetchApploiJobs() {
  const base = process.env.APPLOI_BASE_URL;
  const key = process.env.APPLOI_API_KEY;
  if (!base || !key) {
    return { error: "Apploi env vars not configured" };
  }
  const res = await fetch(`${base}/jobs`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch Apploi jobs");
  return res.json();
}
