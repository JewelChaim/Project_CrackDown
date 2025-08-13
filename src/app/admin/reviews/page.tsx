import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const prisma = new PrismaClient();

async function addReview(formData: FormData) {
  "use server";
  const employeeId = formData.get("employeeId") as string;
  const reviewerId = formData.get("reviewerId") as string;
  const period = formData.get("period") as string;
  const feedback = formData.get("feedback") as string;
  await prisma.review.create({ data: { employeeId, reviewerId, period, feedback } });
  revalidatePath("/admin/reviews");
}

async function launchCycle(formData: FormData) {
  "use server";
  const period = formData.get("period") as string;
  const employees = await prisma.employee.findMany({ include: { manager: true } });
  for (const e of employees) {
    // self review
    await prisma.review.create({ data: { employeeId: e.id, reviewerId: e.id, period, feedback: "" } });
    // manager review
    if (e.managerId) {
      await prisma.review.create({ data: { employeeId: e.id, reviewerId: e.managerId, period, feedback: "" } });
    }
    // peer review - pick first different employee
    const peer = employees.find((p) => p.id !== e.id && p.id !== e.managerId);
    if (peer) {
      await prisma.review.create({ data: { employeeId: e.id, reviewerId: peer.id, period, feedback: "" } });
    }
  }
  revalidatePath("/admin/reviews");
}

export default async function ReviewsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const [employees, reviews] = await Promise.all([
    prisma.employee.findMany(),
    prisma.review.findMany({ include: { employee: true, reviewer: true } }),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Performance Reviews</h1>
      <form action={launchCycle} className="space-y-2">
        <Input name="period" placeholder="Period (e.g. Q2 2024)" required />
        <Button type="submit">Launch Review Cycle</Button>
      </form>
      <form action={addReview} className="space-y-2">
        <Select name="employeeId" required>
          <option value="">Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
        <Select name="reviewerId" required>
          <option value="">Reviewer</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
        <Input name="period" placeholder="Period (e.g. Q1 2024)" required />
        <Textarea name="feedback" placeholder="Feedback" required />
        <Button type="submit">Add Review</Button>
      </form>
      <ul className="space-y-2">
        {reviews.map((r) => (
          <li key={r.id} className="bg-panel border border-panel rounded-lg p-2">
            <a href={`/reviews/${r.id}`} className="underline">
              {r.period} - {r.employee.name} reviewed by {r.reviewer.name}
            </a>
            {r.feedback && <p className="mt-1">{r.feedback}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
