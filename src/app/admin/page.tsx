import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Stat } from "@/components/ui/Card";

interface AppSession extends Session {
  user?: Session["user"] & { role?: string };
}

export default async function AdminHome() {
  const session = (await getSession()) as AppSession | null;
  const role = session?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");

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
