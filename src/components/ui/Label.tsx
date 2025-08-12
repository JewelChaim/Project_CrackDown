import React from "react";

export default function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={`block text-sm font-medium mb-1 ${className}`} />;
}

