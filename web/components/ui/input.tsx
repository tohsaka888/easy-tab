import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-full border border-white/60 bg-white/80 px-4 text-sm text-[color:var(--ink-1)] shadow-[0_10px_26px_rgba(0,0,0,0.12)] backdrop-blur-md transition placeholder:text-[color:var(--ink-2)] focus-visible:border-[color:var(--accent-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-2)]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
