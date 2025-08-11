import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import QRCode from "qrcode";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const prisma = new PrismaClient();

async function ensureAdmin() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
  return session;
}

export default async function SurveysPage() {
  const session = await ensureAdmin();
  const surveys = await prisma.survey.findMany({ orderBy: { createdAt: "desc" } });

  async function createSurvey(formData: FormData) {
    "use server";
    const title = String(formData.get("title")||"").trim();
    if (!title) return;
    const p = new PrismaClient();
    await p.survey.create({ data: { title, createdBy: (session as any)?.user?.email || "admin" } });
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
                <img src={qr} alt="QR" className="w-24 h-24 border border-panel rounded bg-white" />
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
