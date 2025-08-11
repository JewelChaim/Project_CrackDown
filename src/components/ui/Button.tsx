import React from "react";
type V = "primary"|"ghost"|"destructive";
type P = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; loading?: boolean; };
export default function Button({ className="", variant="primary", loading=false, children, ...props }: P) {
  const base="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition border border-panel focus:outline-none focus:ring-4 focus:ring-[var(--ring)] disabled:opacity-50";
  const styles:Record<V,string>={primary:"bg-brand text-white hover:bg-brand-dark",ghost:"bg-transparent hover:bg-panel",destructive:"bg-red-600 text-white hover:bg-red-700"};
  return <button {...props} className={`${base} ${styles[variant]} ${className}`}>{loading?"…":children}</button>;
}
