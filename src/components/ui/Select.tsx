import React from "react";
export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-lg bg-panel border border-panel px-3 py-2 outline-none focus:ring-4 focus:ring-[var(--ring)] ${props.className||""}`} />;
}
