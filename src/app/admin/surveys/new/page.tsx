import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SurveyBuilder from "@/components/surveys/Builder";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import type { SurveyDraft } from "@/types/survey";

export default async function NewSurveyPage() {
  await requireAdmin();

  async function create(formData: FormData) {
    "use server";
    const session = await requireAdmin();
    const raw = String(formData.get("draft") || "{}");
    let draft: SurveyDraft;
    try { draft = JSON.parse(raw) as SurveyDraft; } catch { throw new Error("Invalid form payload"); }

    if (!draft.title?.trim()) throw new Error("Title is required");
    if ((draft.startsAt && draft.endsAt) && new Date(draft.startsAt) > new Date(draft.endsAt)) {
      throw new Error("Opens must be before Closes");
    }

    await prisma.survey.create({
      data: {
        title: draft.title.trim(),
        description: draft.description || null,
        status: draft.status,
        allowAnon: !!draft.allowAnon,
        startsAt: draft.startsAt ? new Date(draft.startsAt) : null,
        endsAt: draft.endsAt ? new Date(draft.endsAt) : null,
        questions: draft.questions ?? [],
        createdBy: session.user?.email || "admin",
      },
    });

    redirect(`/admin/surveys`);
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">New Survey</h1>
      <Card>
        <CardBody>
          <form action={create} method="post" id="create-survey-form" className="space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore Client Component */}
            <SurveyBuilder />
            <div className="flex gap-2">
              <Button type="submit">Create survey</Button>
              <a href="/admin/surveys" className="px-3 py-2 rounded-lg border border-panel hover:bg-panel">Cancel</a>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
