"use client";

import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-[640px]">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-2)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <Input
        placeholder="Search or type a URL"
        className="pl-11 pr-4 text-sm shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
}
