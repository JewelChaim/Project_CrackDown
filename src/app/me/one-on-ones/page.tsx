import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

async function addNote(userId: string, formData: FormData) {
  "use server";
  const otherId = formData.get("otherId") as string;
  const scheduledAt = formData.get("scheduledAt") as string;
  const notes = formData.get("notes") as string;
  await prisma.oneOnOne.create({
    data: {
      participantAId: userId,
      participantBId: otherId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      notes,
    },
  });
  revalidatePath("/me/one-on-ones");
}

export default async function OneOnOnes() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;
  const employees = await prisma.employee.findMany();
  const meetings = await prisma.oneOnOne.findMany({
    where: { OR: [{ participantAId: userId }, { participantBId: userId }] },
    include: { participantA: true, participantB: true },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">1:1 Meetings</h1>
      <Card>
        <CardBody>
          <form action={addNote.bind(null, userId)} className="grid gap-2 sm:grid-cols-2">
            <Select name="otherId" required className="sm:col-span-2">
              <option value="">With</option>
              {employees.filter((e) => e.id !== userId).map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
            <Input type="datetime-local" name="scheduledAt" required />
            <Textarea name="notes" placeholder="Notes" required className="sm:col-span-2" />
            <Button type="submit" className="sm:col-span-2">Add Note</Button>
          </form>
        </CardBody>
      </Card>
      {meetings.length === 0 ? (
        <p className="text-teal-100/70">No meetings yet.</p>
      ) : (
        <div className="space-y-2">
          {meetings.map((m) => (
            <Card key={m.id}>
              <CardBody>
                <div className="font-medium">
                  {m.participantA.name} & {m.participantB.name}
                </div>
                <div className="text-sm text-teal-100/70">
                  {m.scheduledAt?.toLocaleString()}
                </div>
                <p className="mt-2 whitespace-pre-wrap">{m.notes}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
