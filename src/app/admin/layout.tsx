export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-3 space-y-2">
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin">Overview</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/facilities">Facilities</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/employees">Employees</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/surveys">Surveys</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/insights">Insights</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/apploi">Apploi</a>
        <a className="block bg-panel border border-panel rounded-xl px-4 py-3 hover:bg-panel/70" href="/admin/timeclock">Time Clock</a>
      </aside>
      <section className="lg:col-span-9">{children}</section>
    </div>
  );
}
