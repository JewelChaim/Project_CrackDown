/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ensureAdmin } from "@/lib/auth";
import type { Question } from "@/types/survey";
import { Card, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default async function PublicSurvey({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string,string>>; }) {
  const { id } = await params;
  const sp = await searchParams;
  const survey = await prisma.survey.findUnique({ where: { id } });
  if (!survey) notFound();
  const surveyId = survey.id;
  const questions = (survey.questions as Question[] | null) ?? [];

  async function submit(formData: FormData) {
    "use server";
    await ensureAdmin();
    const entries: Record<string, any> = {};
    for (const q of questions) {
      const key = `q_${q.id}`;
      if (q.type === "select" && (q as any).multiple) entries[q.label] = formData.getAll(key);
      else if (q.type === "yes_no") entries[q.label] = formData.get(key) === "yes";
      else if (q.type === "rating") {
        const v = Number(formData.get(key)); entries[q.label] = Number.isFinite(v) ? v : null;
      } else { entries[q.label] = formData.get(key); }
    }
    await prisma.surveyResponse.create({ data: { surveyId, payload: entries } });
    redirect(`/survey/${surveyId}?ok=1`);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody>
        <h1 className="text-xl font-semibold">{survey.title}</h1>
        {survey.description && <p className="text-sm text-teal-100/80 mt-1">{survey.description}</p>}
        {sp?.ok && <div className="mt-3 text-sm text-teal-200">Thanks! Response recorded.</div>}

        <form action={submit} method="post" className="space-y-4 mt-6">
          {questions.map(q => (
            <div key={q.id} className="space-y-1">
              <label className="text-sm font-medium">{q.label}{q.required ? " *" : ""}</label>
              {q.helpText && <div className="text-xs text-teal-100/70">{q.helpText}</div>}
              {q.type === "short_text" && <Input name={`q_${q.id}`} required={!!q.required} placeholder={(q as any).placeholder || ""} />}
              {q.type === "long_text"  && <Textarea name={`q_${q.id}`} required={!!q.required} rows={4} placeholder={(q as any).placeholder || ""} />}
              {q.type === "yes_no" && (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name={`q_${q.id}`} value="yes" required={!!q.required} /> Yes</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name={`q_${q.id}`} value="no"  required={!!q.required} /> No</label>
                </div>
              )}
              {q.type === "rating" && (
                <select name={`q_${q.id}`} required={!!q.required} className="w-32 rounded-lg bg-panel border border-panel px-3 py-2">
                  <option value="">Select…</option>
                  {Array.from({ length: (q as any).max ?? 5 }, (_, i) => i+1).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              )}
              {q.type === "select" && (
                (q as any).multiple ? (
                  <select name={`q_${q.id}`} multiple className="w-full rounded-lg bg-panel border border-panel px-3 py-2">
                    {(q as any).options?.map((opt: string, idx: number) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <select name={`q_${q.id}`} required={!!q.required} className="w-full rounded-lg bg-panel border border-panel px-3 py-2">
                    <option value="">Select…</option>
                    {(q as any).options?.map((opt: string, idx: number) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                )
              )}
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </CardBody>
    </Card>
  );
}
