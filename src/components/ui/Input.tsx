import React from "react";
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg bg-panel border border-panel px-3 py-2 outline-none focus:ring-4 focus:ring-[var(--ring)] ${props.className||""}`} />;
}
