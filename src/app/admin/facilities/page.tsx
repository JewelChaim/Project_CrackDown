import { redirect } from "next/navigation";
import { getSession, requireAdmin } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureAdmin() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
}

export default async function FacilitiesPage() {
  await requireAdmin();
  const facilities = await prisma.facility.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { createdAt: "desc" }
  });

  async function createFacility(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    if (!name) return;
    await prisma.facility.create({ data: { name } });
    redirect("/admin/facilities");
  }

  async function deleteFacility(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    await prisma.employee.deleteMany({ where: { facilityId: id } });
    await prisma.facility.delete({ where: { id } });
    redirect("/admin/facilities");
  }

  async function updateFacility(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    if (!id || !name) return;
    await prisma.facility.update({ where: { id }, data: { name } });
    redirect("/admin/facilities");
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Facilities</h1>

      <form action={createFacility} className="flex gap-2 max-w-xl">
        <Input name="name" placeholder="New facility name" />
        <Button type="submit">Add</Button>
      </form>

      <div className="divide-y border border-panel rounded bg-panel">
        {facilities.map(f => (
          <li key={f.id} className="flex items-center justify-between border p-3 rounded">
            <div>{f.name}</div>
            <form action={deleteFacility}>
              <input type="hidden" name="id" value={f.id} />
              <Button variant="destructive">Delete</Button>
            </form>
          </li>
        ))}
        {facilities.length === 0 && <div className="p-3 text-teal-100/60">No facilities yet.</div>}
      </div>
    </main>
  );
}
