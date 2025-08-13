import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

async function addGoal(userId: string, formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  await prisma.goal.create({ data: { ownerId: userId, title } });
  revalidatePath("/me/goals");
}

export default async function MyGoals() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;
  const goals = await prisma.goal.findMany({ where: { ownerId: userId } });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">My Goals</h1>
      <Card>
        <CardBody>
          <form action={addGoal.bind(null, userId)} className="flex flex-col gap-2 sm:flex-row">
            <Input name="title" placeholder="Goal title" required className="flex-1" />
            <Button type="submit" className="sm:w-32">Add Goal</Button>
          </form>
        </CardBody>
      </Card>
      {goals.length === 0 ? (
        <p className="text-teal-100/70">No goals yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((g) => (
            <Card key={g.id}>
              <CardBody>
                <div className="font-medium">{g.title}</div>
                <div className="text-sm text-teal-100/70">Progress: {g.progress}%</div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
