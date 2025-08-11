import React from "react";
export function Card({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-panel glass shadow-glass border border-panel rounded-2xl ${className}`}>{children}</div>;
}
export function CardBody({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
export function Stat({ label, value, valueClass = "" }: { label: string; value: string | number; valueClass?: string }) {
  return (
    <div className="p-4 rounded-xl bg-panel border border-panel">
      <div className="text-xs uppercase tracking-wider text-teal-200/70">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}
