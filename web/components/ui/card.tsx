import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[radial-gradient(circle_at_20%_20%,rgba(var(--accent-2-rgb)/0.18),transparent),radial-gradient(circle_at_80%_0%,rgba(var(--accent-1-rgb)/0.16),transparent),linear-gradient(135deg,rgba(10,16,32,0.86),rgba(16,22,40,0.7))] text-[color:var(--card-ink)] shadow-[0_25px_80px_rgba(6,12,34,0.55)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold leading-none tracking-tight text-[color:var(--card-ink)]", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-h-0 text-sm text-[color:var(--card-ink-muted)]", className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

export { Card, CardContent, CardHeader, CardTitle };
