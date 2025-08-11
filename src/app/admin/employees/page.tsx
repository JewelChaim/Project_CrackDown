import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const prisma = new PrismaClient();

async function ensureAdmin() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");
}

export default async function EmployeesPage() {
  await ensureAdmin();
  const [employees, facilities] = await Promise.all([
    prisma.employee.findMany({ include: { facility: true }, orderBy: { createdAt: "desc" } }),
    prisma.facility.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function createEmployee(formData: FormData) {
    "use server";
    const name = String(formData.get("name")||"").trim();
    const phone = String(formData.get("phone")||"").trim() || null;
    const facilityId = String(formData.get("facilityId")||"");
    const staffType = String(formData.get("staffType")||"INTERNAL") as any;
    if (!name || !facilityId) return;
    const p = new PrismaClient();
    await p.employee.create({ data: { name, phone, facilityId, staffType } });
    redirect("/admin/employees");
  }

  async function deleteEmployee(formData: FormData) {
    "use server";
    const id = String(formData.get("id")||"");
    const p = new PrismaClient();
    await p.employee.delete({ where: { id } });
    redirect("/admin/employees");
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Employees</h1>

      <form action={createEmployee} className="grid grid-cols-5 gap-2 max-w-5xl">
        <Input name="name" placeholder="Full name" className="col-span-2" />
        <Input name="phone" placeholder="Phone (optional)" />
        <Select name="facilityId">
          <option value="">Choose facility</option>
          {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </Select>
        <Select name="staffType">
          <option value="INTERNAL">Internal</option>
          <option value="AGENCY">Agency</option>
        </Select>
        <div className="col-span-5">
          <Button type="submit">Add</Button>
        </div>
      </form>

      <div className="divide-y border border-panel rounded bg-panel">
        {employees.map(e => (
          <div key={e.id} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">{e.name} <span className="text-xs text-teal-100/60">({e.staffType})</span></div>
              <div className="text-sm text-teal-100/60">{e.facility?.name}</div>
              {e.phone && <div className="text-sm text-teal-100/60">{e.phone}</div>}
            </div>
            <form action={deleteEmployee}>
              <input type="hidden" name="id" value={e.id} />
              <Button variant="destructive">Delete</Button>
            </form>
          </div>
        ))}
        {employees.length === 0 && <div className="p-3 text-teal-100/60">No employees yet.</div>}
      </div>
    </main>
  );
}
