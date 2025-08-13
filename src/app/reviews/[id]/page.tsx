import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const prisma = new PrismaClient();

async function submit(id: string, formData: FormData) {
  "use server";
  const feedback = formData.get("feedback") as string;
  await prisma.review.update({ where: { id }, data: { feedback } });
  revalidatePath(`/reviews/${id}`);
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = (session.user as { id: string }).id;
  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: { employee: true, reviewer: true },
  });
  if (!review) redirect("/");
  if (review.reviewerId !== userId) redirect("/");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Review for {review.employee.name} ({review.period})
      </h1>
      {review.feedback ? (
        <p>{review.feedback}</p>
      ) : (
        <form action={submit.bind(null, review.id)} className="space-y-2">
          <Textarea name="feedback" placeholder="Feedback" required />
          <Button type="submit">Submit</Button>
        </form>
      )}
    </main>
  );
}
