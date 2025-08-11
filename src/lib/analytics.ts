import prisma from "@/lib/prisma";

export async function facilityRiskAnalysis() {
  const facilities = await prisma.facility.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { name: "asc" },
  });
  return facilities.map(f => {
    const count = f._count.employees;
    const risk = count < 5 ? "high" : count < 10 ? "medium" : "low";
    return { id: f.id, name: f.name, employees: count, risk };
  });
}

export async function surveyTrends() {
  const responses = await prisma.surveyResponse.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  const text = responses.map(r => JSON.stringify(r.payload ?? {}).toLowerCase()).join(" ");
  const words = text.match(/\b[a-z]{4,}\b/g) || [];
  const stop = new Set(["this","that","with","have","from","there","their","about","http","https"]);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (stop.has(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}
