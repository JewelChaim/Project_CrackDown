import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import prisma from "@/lib/prisma";

async function ensureAdmin() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
}

export default async function FacilitiesPage() {
  await ensureAdmin();
    const facilities = await prisma.facility.findMany({ orderBy: { createdAt: "desc" } });

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

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Facilities</h1>

      <form action={createFacility} className="flex gap-2 max-w-xl">
        <Input name="name" placeholder="New facility name" />
        <Button type="submit">Add</Button>
      </form>

      <div className="divide-y border border-panel rounded bg-panel">
        {facilities.map(f => (
          <div key={f.id} className="flex items-center justify-between p-3">
            <div>{f.name}</div>
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
