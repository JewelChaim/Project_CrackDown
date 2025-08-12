import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

export default async function EmployeeProfile({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: {
      facility: true,
      manager: true,
      reviews: { include: { reviewer: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!employee) redirect("/employees");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">{employee.name}</h1>
      <Card>
        <CardBody>
          <p>
            Facility: {employee.facility.name}
            {employee.manager && (
              <span className="text-sm text-teal-100/70"> (mgr: {employee.manager.name})</span>
            )}
          </p>
        </CardBody>
      </Card>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {employee.reviews.length === 0 ? (
          <p className="text-teal-100/70">No reviews yet.</p>
        ) : (
          <div className="space-y-2">
            {employee.reviews.map((r) => (
              <Card key={r.id}>
                <CardBody className="flex flex-col gap-1">
                  <div className="text-sm text-teal-100/70">
                    {r.period} - {r.reviewer.name}
                  </div>
                  <div>{r.feedback || "Pending"}</div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
