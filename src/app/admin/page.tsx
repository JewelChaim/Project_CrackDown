import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Stat from "@/components/Stat";

export default async function AdminHome() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  // TODO: Replace these mock values with real data fetching logic
  const facilityCount = 0;
  const employeeCount = 0;
  const surveyCount = 0;

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
