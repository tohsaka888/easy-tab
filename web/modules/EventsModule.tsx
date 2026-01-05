import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "@/components/icons";
import type { ModuleRenderProps } from "@/lib/types";

const events = [
  { time: "09:30", title: "Design sync" },
  { time: "13:00", title: "Prototype review" },
  { time: "17:30", title: "Release check" },
];

export function EventsModule(_: ModuleRenderProps) {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent-1)]/20 text-[color:var(--accent-1)]">
            <CalendarIcon className="h-4 w-4" />
          </span>
          Today
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="space-y-2 text-sm">
          {events.map((event) => (
            <div
              key={event.time}
              className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 text-[color:var(--ink-1)]"
            >
              <span className="text-xs text-[color:var(--ink-2)]">{event.time}</span>
              <span className="font-medium">{event.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
