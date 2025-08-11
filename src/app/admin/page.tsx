import { Stat } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AdminHome() {
  await requireAdmin();

  const [facilityCount, employeeCount, surveyCount] = await Promise.all([
    prisma.facility.count(),
    prisma.employee.count(),
    prisma.survey.count(),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Facilities" value={facilityCount} />
        <Stat label="Employees" value={employeeCount} />
        <Stat label="Surveys" value={surveyCount} />
      </div>
    </main>
  );
}
