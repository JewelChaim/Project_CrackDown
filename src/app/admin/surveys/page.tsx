import { redirect } from "next/navigation";
import { ensureAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as QRCode from "qrcode";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default async function SurveysPage() {
  await ensureAdmin();
  const surveys = await prisma.survey.findMany({ orderBy: { createdAt: "desc" } });

  async function createSurvey(formData: FormData) {
    "use server";
    const session = await ensureAdmin();
    const title = String(formData.get("title") || "").trim();
    if (!title) return;
    await prisma.survey.create({ data: { title, createdBy: session.user?.email ?? "admin" } });
    redirect("/admin/surveys");
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Surveys</h1>
        <a href="/admin/surveys/new">
          <Button type="button">Create survey</Button>
        </a>
      </div>
      <form action={createSurvey} method="post" className="flex gap-2 max-w-xl">
        <Input name="title" placeholder="New survey title" />
        <Button type="submit">Create</Button>
      </form>

      <ul className="space-y-4">
        {await Promise.all(surveys.map(async s => {
          const href = `/survey/${s.id}`;
          const qr = await QRCode.toDataURL(href);
          return (
            <li key={s.id} className="border border-brand/20 rounded-xl bg-panel p-4 shadow-md transition hover:shadow-lg">
              <div className="flex items-start gap-4">
                <Image src={qr} alt="QR" width={96} height={96} className="w-24 h-24 border border-brand/20 rounded bg-white" unoptimized />
                <div className="flex-1">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-teal-100/60">
                    Link: <a className="underline" href={href}>{href}</a>
                  </div>
                  <div className="text-sm text-teal-100/60">
                    <a className="underline" href={`/api/export/survey/${s.id}`}>Download CSV</a>
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
