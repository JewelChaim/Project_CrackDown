"use client";
import React from "react";

export default function CopyButton({ value, children = "Copy", className = "" }: { value: string; children?: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(value)}
      className={`underline text-xs text-teal-100/80 hover:text-teal-50 ${className}`}
    >
      {children}
    </button>
  );
}
