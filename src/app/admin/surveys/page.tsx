import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const prisma = new PrismaClient();

async function addSurvey(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const questions = (formData.get("questions") as string)
    .split("\n")
    .map((q) => q.trim())
    .filter(Boolean)
    .map((line) => {
      const [prompt, type] = line.split("|").map((s) => s.trim());
      return { prompt, type: type === "scale" ? "scale" : "text" };
    });
  const session = await getSession();
  const createdBy = (session?.user as { email?: string })?.email || "unknown";
  await prisma.survey.create({ data: { title, questions, createdBy } });
  revalidatePath("/admin/surveys");
}

async function deleteSurvey(id: string) {
  "use server";
  await prisma.survey.delete({ where: { id } });
  revalidatePath("/admin/surveys");
}

export default async function SurveysAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const surveys = await prisma.survey.findMany();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Surveys</h1>
      <form action={addSurvey} className="space-y-2">
        <Input name="title" placeholder="Title" required />
        <Textarea
          name="questions"
          placeholder="One question per line. Add '|scale' for 1-5 rating."
          required
        />
        <Button type="submit">Create Survey</Button>
      </form>
      <ul className="space-y-2">
        {surveys.map((s) => (
          <li
            key={s.id}
            className="bg-panel border border-panel rounded-lg p-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <a href={`/surveys/${s.id}`} className="underline">
                {s.title}
              </a>
              <a
                href={`/survey/${s.id}`}
                className="text-xs underline text-teal-200"
              >
                public link
              </a>
            </div>
            <form action={deleteSurvey.bind(null, s.id)}>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
