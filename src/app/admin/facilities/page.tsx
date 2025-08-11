import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const prisma = new PrismaClient();

async function ensureAdmin() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
}

export default async function FacilitiesPage() {
  await ensureAdmin();
  const facilities = await prisma.facility.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { createdAt: "desc" }
  });

  async function createFacility(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    if (!name) return;
    const p = new PrismaClient();
    await p.facility.create({ data: { name } });
    redirect("/admin/facilities");
  }

  async function deleteFacility(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const p = new PrismaClient();
    await p.employee.deleteMany({ where: { facilityId: id } });
    await p.facility.delete({ where: { id } });
    redirect("/admin/facilities");
  }

  async function updateFacility(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    if (!id || !name) return;
    const p = new PrismaClient();
    await p.facility.update({ where: { id }, data: { name } });
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
          <div key={f.id} className="flex items-center gap-2 p-3">
            <form action={updateFacility} className="flex-1 flex items-center gap-2">
              <Input name="name" defaultValue={f.name} className="flex-1" />
              <input type="hidden" name="id" value={f.id} />
              <Button type="submit" variant="ghost" className="text-xs">Save</Button>
            </form>
            <div className="text-sm text-teal-100/70 w-24 text-center">{f._count.employees} staff</div>
            <form action={deleteFacility}>
              <input type="hidden" name="id" value={f.id} />
              <Button variant="destructive">Delete</Button>
            </form>
          </div>
        ))}
        {facilities.length === 0 && <div className="p-3 text-teal-100/60">No facilities yet.</div>}
      </div>
    </main>
  );
}
