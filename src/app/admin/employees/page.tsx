import { PrismaClient, StaffType } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

async function addEmployee(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const facilityId = formData.get("facilityId") as string;
  const staffType = formData.get("staffType") as StaffType;
  const phone = formData.get("phone") as string | null;
  const managerId = formData.get("managerId") as string | null;
  await prisma.employee.create({
    data: {
      name,
      facilityId,
      staffType,
      phone: phone || undefined,
      managerId: managerId || undefined,
    },
  });
  revalidatePath("/admin/employees");
}

async function deleteEmployee(id: string) {
  "use server";
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/admin/employees");
}

export default async function EmployeesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const [employees, facilities] = await Promise.all([
    prisma.employee.findMany({ include: { facility: true, manager: true } }),
    prisma.facility.findMany(),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Employees</h1>
      <Card>
        <CardBody>
          <form action={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div>
              <Label htmlFor="facilityId">Facility</Label>
              <Select id="facilityId" name="facilityId" required>
                <option value="">Select facility</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="managerId">Manager</Label>
              <Select id="managerId" name="managerId">
                <option value="">Optional</option>
                {employees.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="staffType">Staff Type</Label>
              <Select id="staffType" name="staffType" required>
                <option value="INTERNAL">Internal</option>
                <option value="AGENCY">Agency</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Add Employee</Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-panel">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Facility</th>
                <th className="p-2">Manager</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-t border-panel hover:bg-panel/50">
                  <td className="p-2">{e.name}</td>
                  <td className="p-2">{e.facility.name}</td>
                  <td className="p-2">{e.manager ? e.manager.name : "-"}</td>
                  <td className="p-2 text-right">
                    <a
                      href={`/admin/employees/${e.id}`}
                      className="underline mr-2"
                    >
                      Edit
                    </a>
                    <form action={deleteEmployee.bind(null, e.id)} className="inline">
                      <Button variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </main>
  );
}
