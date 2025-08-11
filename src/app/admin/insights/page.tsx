import { requireAdmin } from "@/lib/auth";
import { facilityRiskAnalysis, surveyTrends } from "@/lib/analytics";
import { Card, CardBody, Stat } from "@/components/ui/Card";

export default async function InsightsPage() {
  await requireAdmin();
  const [loads, trends] = await Promise.all([
    facilityRiskAnalysis(),
    surveyTrends(),
  ]);

  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-semibold">Insights</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Facility Load Forecast</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {loads.map(f => {
            const color = f.risk === "high" ? "text-red-400" : f.risk === "medium" ? "text-yellow-300" : "text-teal-200";
            return (
              <Stat
                key={f.id}
                label={`${f.name} (${f.employees})`}
                value={f.risk.toUpperCase()}
                valueClass={color}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Survey Trends</h2>
        <Card>
          <CardBody>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {trends.length ? (
                trends.map(t => <li key={t.word}>{t.word} – {t.count}</li>)
              ) : (
                <li className="list-none text-teal-100/60">No responses yet.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
