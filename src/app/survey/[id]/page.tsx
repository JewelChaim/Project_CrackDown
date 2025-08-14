import type { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import prisma from "@/lib/prisma";

export default async function PublicSurvey({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>>; }) {
  const { id } = await params;
  const sp = await searchParams;
  const survey = await prisma.survey.findUnique({ where: { id } });
  if (!survey) notFound();
  const surveyId = survey.id;

  async function submit(formData: FormData) {
    "use server";
    const payloadTxt = String(formData.get("payload") || "{}");
    let json: Prisma.JsonValue = {};
    try {
      json = JSON.parse(payloadTxt) as Prisma.JsonValue;
    } catch {
      json = { text: payloadTxt };
    }
    await prisma.surveyResponse.create({ data: { surveyId, payload: json as Prisma.InputJsonValue } });
    redirect(`/survey/${surveyId}?ok=1`);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardBody>
        <h1 className="text-xl font-semibold">{survey.title}</h1>
        {sp?.ok && <div className="mt-3 text-sm text-teal-200">Thanks! Response recorded.</div>}
        <p className="text-sm text-teal-100/70 mt-2">Paste JSON or type text; we’ll store it as JSON.</p>
        <form action={submit} className="space-y-3 mt-4">
          <Textarea name="payload" rows={10} placeholder='{"answer":"Yes"}' />
          <Button type="submit">Submit</Button>
        </form>
      </CardBody>
    </Card>
  );
}
