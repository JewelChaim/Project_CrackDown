import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";

const prisma = new PrismaClient();

export default async function EmployeeDirectory() {
  const session = await getSession();
  if (!session) redirect("/login");
  const employees = await prisma.employee.findMany({
    include: { facility: true, manager: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Employee Directory</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <Card key={e.id}>
            <CardBody className="space-y-1">
              <Link
                href={`/employees/${e.id}`}
                className="text-lg font-medium hover:underline"
              >
                {e.name}
              </Link>
              <p className="text-sm text-teal-100/70">{e.facility.name}</p>
              {e.manager && (
                <p className="text-xs text-teal-100/50">
                  Manager: {e.manager.name}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}

