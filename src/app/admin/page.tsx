import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getSession();
  const role = (session as any)?.user?.role;
  if (!session) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="space-x-4 underline">
        <a href="/admin/facilities">Facilities</a>{" | "}
        <a href="/admin/employees">Employees</a>{" | "}
        <a href="/admin/surveys">Surveys</a>
      </div>
    </main>
  );
}
