import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

const prisma = new PrismaClient();

async function updateFacility(id: string, formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;
  const capacityStr = formData.get("capacity") as string | null;
  const capacity = capacityStr ? Number(capacityStr) : null;
  await prisma.facility.update({
    where: { id },
    data: { name, address: address || undefined, capacity: capacity ?? undefined },
  });
  revalidatePath("/admin/facilities");
  redirect("/admin/facilities");
}

export default async function EditFacilityPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const facility = await prisma.facility.findUnique({ where: { id: params.id } });
  if (!facility) redirect("/admin/facilities");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Facility</h1>
      <Link href="/admin/facilities" className="underline text-sm">
        ← Back to Facilities
      </Link>
      <Card>
        <CardBody>
          <form action={updateFacility.bind(null, facility.id)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={facility.name} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={facility.address || ""} />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                defaultValue={facility.capacity ?? ""}
              />
            </div>
            <div className="md:col-span-3">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
