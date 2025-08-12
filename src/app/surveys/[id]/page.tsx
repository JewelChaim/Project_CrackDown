import { PrismaClient } from "@prisma/client";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

async function submitSurvey(id: string, formData: FormData) {
  "use server";
  const payload: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    payload[key] = value as string;
  }
  await prisma.surveyResponse.create({ data: { surveyId: id, payload } });
  revalidatePath(`/surveys/${id}`);
}

export default async function SurveyPage({ params }: { params: { id: string } }) {
  const [survey, responses, session] = await Promise.all([
    prisma.survey.findUnique({ where: { id: params.id } }),
    prisma.surveyResponse.findMany({ where: { surveyId: params.id } }),
    getSession(),
  ]);
  if (!survey) notFound();
  type SurveyQuestion = { prompt: string; type?: "text" | "scale" };
  const questions: SurveyQuestion[] = (
    survey.questions as unknown as (string | SurveyQuestion)[]
  ).map((q) => (typeof q === "string" ? { prompt: q, type: "text" } : q));
  const role = (session?.user as { role?: string })?.role;
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">{survey.title}</h1>
      <Card>
        <CardBody>
          <form action={submitSurvey.bind(null, survey.id)} className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <label>{q.prompt}</label>
                {q.type === "scale" ? (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={n}
                          required
                          className="accent-[var(--ring)]"
                        />
                        <span className="text-xs">{n}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Textarea name={`q${i}`} required />
                )}
              </div>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </CardBody>
      </Card>
      {role === "ADMIN" && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Responses</h2>
          {responses.length === 0 ? (
            <p>No responses yet.</p>
          ) : (
            <div className="space-y-2">
              {responses.map((r) => (
                <Card key={r.id}>
                  <CardBody>
                    <ul className="list-disc pl-4">
                      {questions.map((q, i) => (
                        <li key={i}>
                          <strong>{q.prompt}:</strong> {(r.payload as Record<string, string>)[`q${i}`]}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
