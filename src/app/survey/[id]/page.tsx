import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const prisma = new PrismaClient();

export default async function PublicSurvey({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string>;
}) {
  const survey = await prisma.survey.findUnique({ where: { id: params.id } });
  if (!survey) notFound();
  type SurveyQuestion = { prompt: string; type?: "text" | "scale" };
  const questions: SurveyQuestion[] = (
    survey.questions as unknown as (string | SurveyQuestion)[]
  ).map((q) => (typeof q === "string" ? { prompt: q, type: "text" } : q));

  async function submit(formData: FormData) {
    "use server";
    const payload: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = value as string;
    }
    const p = new PrismaClient();
    await p.surveyResponse.create({
      data: { surveyId: survey.id, payload },
    });
    redirect(`/survey/${survey.id}?ok=1`);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody>
        <h1 className="text-xl font-semibold">{survey.title}</h1>
        {searchParams?.ok && (
          <div className="mt-3 text-sm text-teal-200">
            Thanks! Response recorded.
          </div>
        )}
        <form action={submit} className="space-y-4 mt-4">
          {questions.map((q, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm font-medium">{q.prompt}</label>
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
  );
}
