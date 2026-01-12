import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "@/components/icons";
import type { ModuleRenderProps } from "@/lib/types";

      <CardHeader className="border-b border-[color:var(--card-border)] px-4 pt-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[color:var(--card-ink)]">
                className="group/item flex flex-col gap-2 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--overlay-soft)] px-3 py-3 text-[color:var(--card-ink-muted)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent-2)]/50 hover:bg-[color:var(--accent-2)]/10"
                  className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${item.color} text-[11px] font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-[color:var(--stroke-soft)]`}
                <span className="text-[12px] font-medium tracking-wide text-[color:var(--card-ink)]">
                  {item.name}
                </span>
  { name: "Drive", color: "bg-[#34A853]/15 text-[#34A853]" },
  { name: "Calendar", color: "bg-[#4285F4]/15 text-[#4285F4]" },
  { name: "Linear", color: "bg-[#5E6AD2]/15 text-[#5E6AD2]" },
  { name: "Docs", color: "bg-[#F8B547]/20 text-[#B97300]" },
];

export function ShortcutsModule(_: ModuleRenderProps) {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent-1)]/15 text-[color:var(--accent-1)]">
            <LinkIcon className="h-4 w-4" />
          </span>
          Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-4 gap-3 text-xs">
          {shortcuts.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col items-center gap-2 rounded-xl bg-white/70 px-2 py-3 text-[color:var(--ink-2)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                <span className="text-xs font-semibold">{item.name.slice(0, 1)}</span>
              </span>
              <span className="text-[11px] font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
