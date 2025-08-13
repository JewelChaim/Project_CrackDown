import { PrismaClient, StaffType } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

const prisma = new PrismaClient();

async function updateEmployee(id: string, formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const facilityId = formData.get("facilityId") as string;
  const staffType = formData.get("staffType") as StaffType;
  const phone = formData.get("phone") as string | null;
  const managerId = formData.get("managerId") as string | null;
  await prisma.employee.update({
    where: { id },
    data: {
      name,
      facilityId,
      staffType,
      phone: phone || undefined,
      managerId: managerId || undefined,
    },
  });
  revalidatePath("/admin/employees");
  redirect("/admin/employees");
}

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const [employee, employees, facilities] = await Promise.all([
    prisma.employee.findUnique({ where: { id: params.id } }),
    prisma.employee.findMany(),
    prisma.facility.findMany(),
  ]);
  if (!employee) redirect("/admin/employees");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Employee</h1>
      <Link href="/admin/employees" className="underline text-sm">
        ← Back to Employees
      </Link>
      <Card>
        <CardBody>
          <form action={updateEmployee.bind(null, employee.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={employee.name} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={employee.phone || ""} />
            </div>
            <div>
              <Label htmlFor="facilityId">Facility</Label>
              <Select id="facilityId" name="facilityId" defaultValue={employee.facilityId} required>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="managerId">Manager</Label>
              <Select id="managerId" name="managerId" defaultValue={employee.managerId || ""}>
                <option value="">Optional</option>
                {employees
                  .filter((m) => m.id !== employee.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="staffType">Staff Type</Label>
              <Select id="staffType" name="staffType" defaultValue={employee.staffType} required>
                <option value="INTERNAL">Internal</option>
                <option value="AGENCY">Agency</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
