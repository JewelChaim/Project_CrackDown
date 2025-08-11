export async function fetchTimeEntries() {
  const base = process.env.HOSTEDTIME_BASE_URL;
  const token = process.env.HOSTEDTIME_API_KEY;
  if (!base || !token) {
    return { error: "HostedTime env vars not configured" };
  }
  const res = await fetch(`${base}/entries`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch time entries");
  return res.json();
}
