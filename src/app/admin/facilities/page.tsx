import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

async function addFacility(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;
  const capacityStr = formData.get("capacity") as string | null;
  const capacity = capacityStr ? Number(capacityStr) : null;
  await prisma.facility.create({
    data: { name, address: address || undefined, capacity: capacity ?? undefined },
  });
  revalidatePath("/admin/facilities");
}

async function deleteFacility(id: string) {
  "use server";
  await prisma.facility.delete({ where: { id } });
  revalidatePath("/admin/facilities");
}

export default async function FacilitiesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const facilities = await prisma.facility.findMany();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Facilities</h1>
      <Card>
        <CardBody>
          <form action={addFacility} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" />
            </div>
            <div className="md:col-span-3">
              <Button type="submit">Add Facility</Button>
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
                <th className="p-2">Address</th>
                <th className="p-2">Capacity</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} className="border-t border-panel hover:bg-panel/50">
                  <td className="p-2">{f.name}</td>
                  <td className="p-2">{f.address || "-"}</td>
                  <td className="p-2">
                    {typeof f.capacity === "number" ? f.capacity : "-"}
                  </td>
                  <td className="p-2 text-right">
                    <a
                      href={`/admin/facilities/${f.id}`}
                      className="underline mr-2"
                    >
                      Edit
                    </a>
                    <form action={deleteFacility.bind(null, f.id)} className="inline">
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
