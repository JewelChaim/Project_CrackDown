import { redirect } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";

export default async function SurveysPage() {
  const session = await requireAdmin();
  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { responses: true } } }
  });

  async function createSurvey(formData: FormData) {
    "use server";
    const title = String(formData.get("title")||"").trim();
    if (!title) return;
    await prisma.survey.create({ data: { title, createdBy: session.user.email || "admin" } });
    redirect("/admin/surveys");
  }

  async function deleteSurvey(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    await prisma.surveyResponse.deleteMany({ where: { surveyId: id } });
    await prisma.survey.delete({ where: { id } });
    redirect("/admin/surveys");
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Surveys</h1>
      <form action={createSurvey} className="flex gap-2 max-w-xl">
        <Input name="title" placeholder="New survey title" />
        <Button type="submit">Create</Button>
      </form>

      <ul className="space-y-4">
        {await Promise.all(surveys.map(async s => {
          const href = `/survey/${s.id}`;
          const qr = await QRCode.toDataURL(href);
          return (
            <li key={s.id} className="border border-panel rounded bg-panel p-4">
              <div className="flex items-start gap-4">
                <Image src={qr} alt="QR" width={96} height={96} className="w-24 h-24 border border-panel rounded bg-white" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-teal-100/60">{s._count.responses} responses</div>
                  </div>
                  <div className="text-sm text-teal-100/60 flex items-center gap-2">
                    <a className="underline" href={href}>{href}</a>
                    <CopyButton value={href} />
                  </div>
                  <div className="text-sm text-teal-100/60 flex items-center gap-3">
                    <a className="underline" href={`/api/export/survey/${s.id}`}>Download CSV</a>
                    <form action={deleteSurvey} className="inline">
                      <input type="hidden" name="id" value={s.id} />
                      <Button variant="destructive" className="text-xs">Delete</Button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          );
        }))}
      </ul>
    </main>
  );
}
