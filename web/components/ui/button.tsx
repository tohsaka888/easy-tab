import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent-1)] px-4 py-2 text-sm font-medium text-[color:var(--accent-ink)] shadow-[0_6px_16px_rgba(var(--accent-1-rgb)/0.35)] transition hover:-translate-y-[1px] hover:shadow-[0_10px_20px_rgba(var(--accent-1-rgb)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-2)]",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
