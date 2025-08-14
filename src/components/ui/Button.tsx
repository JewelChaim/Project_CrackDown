import React from "react";
type V = "primary" | "secondary" | "danger";
type P = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; loading?: boolean; };
const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-transform shadow-sm hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50";
const styles: Record<V, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-brand text-brand hover:bg-brand/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
export const buttonVariants = (variant: V = "primary") => `${base} ${styles[variant]}`;
export default function Button({ className = "", variant = "primary", loading = false, children, ...props }: P) {
  return (
    <button {...props} className={`${buttonVariants(variant)} ${className}`}>
      {loading ? "…" : children}
    </button>
  );
}
