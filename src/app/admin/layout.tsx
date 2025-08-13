import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3 space-y-2">
        <Link className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin">
          Overview
        </Link>
        <Link className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/facilities">
          Facilities
        </Link>
        <Link className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/employees">
          Employees
        </Link>
        <Link className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/surveys">
          Surveys
        </Link>
        <Link className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/reviews">
          Reviews
        </Link>
      </aside>
      <section className="lg:col-span-9">{children}</section>
    </div>
  );
}
