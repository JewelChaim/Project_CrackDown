import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

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

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Facilities</h1>

      <form action={createFacility} className="flex gap-2">
        <input name="name" placeholder="New facility name" className="border px-3 py-2 rounded" />
        <button className="px-3 py-2 border rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {facilities.map(f => (
          <li key={f.id} className="flex items-center justify-between border p-3 rounded">
            <div>{f.name}</div>
            <form action={deleteFacility}>
              <input type="hidden" name="id" value={f.id} />
              <button className="text-red-600 underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
