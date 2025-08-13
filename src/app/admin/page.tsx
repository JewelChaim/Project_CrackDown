import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");

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
