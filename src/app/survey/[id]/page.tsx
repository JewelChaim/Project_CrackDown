import { notFound, redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Card, CardBody } from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import prisma from "@/lib/prisma";

export default async function PublicSurvey({ params, searchParams }: { params: { id: string }, searchParams: Record<string,string> }) {
  const survey = await prisma.survey.findUnique({ where: { id: params.id } });
  if (!survey) notFound();

  async function submit(formData: FormData) {
    "use server";
    const payloadTxt = String(formData.get("payload") || "{}");
    let json: Prisma.InputJsonValue = {};
    try { json = JSON.parse(payloadTxt) as Prisma.InputJsonValue; } catch { json = { text: payloadTxt }; }
    if (!survey) {
      throw new Error("Survey not found");
    }
    await prisma.surveyResponse.create({ data: { surveyId: survey.id, payload: json } });
    redirect(`/survey/${survey.id}?ok=1`);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody>
        <h1 className="text-xl font-semibold">{survey.title}</h1>
        {searchParams?.ok && <div className="mt-3 text-sm text-teal-200">Thanks! Response recorded.</div>}
        <p className="text-sm text-teal-100/70 mt-2">Paste JSON or type text; we’ll store it as JSON.</p>
        <form action={submit} className="space-y-3 mt-4">
          <Textarea name="payload" rows={10} placeholder='{"answer":"Yes"}' />
          <Button type="submit">Submit</Button>
        </form>
      </CardBody>
    </Card>
  );
}
