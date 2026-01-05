"use client";

import useSWR from "swr";

import { fetchTime } from "@/lib/fetchers/time";

export function TimeBlock() {
  const { data } = useSWR("time", fetchTime, { refreshInterval: 60000 });
  const now = data?.now ? new Date(data.now) : new Date();

  const time = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const date = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p
        suppressHydrationWarning
        className="font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
      >
        {time}
      </p>
      <p suppressHydrationWarning className="font-ui text-xs uppercase tracking-[0.32em] text-white/80">
        {date}
      </p>
    </div>
  );
}
