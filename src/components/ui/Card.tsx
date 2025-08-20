import React from "react";
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-panel glass border border-brand/20 rounded-xl shadow-md transition hover:shadow-lg hover:scale-[1.01] ${className}`}
    >
      {children}
    </div>
  );
}
export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
export function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-panel border border-brand/20 flex items-center gap-3 shadow-sm transition hover:shadow-md hover:scale-[1.02]">
      {icon && <div className="text-gray-700 text-xl">{icon}</div>}
      <div>
        <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </div>
    </div>
  );
}
