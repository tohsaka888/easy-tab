import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparkIcon } from "@/components/icons";
import type { ModuleRenderProps } from "@/lib/types";

export function FocusModule(_: ModuleRenderProps) {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent-2)]/20 text-[color:var(--accent-2)]">
            <SparkIcon className="h-4 w-4" />
          </span>
          Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-2)] px-4 py-3">
          <div>
            <p className="text-xs text-[color:var(--ink-2)]">Next session</p>
            <p className="text-2xl font-semibold text-[color:var(--ink-1)]">25:00</p>
          </div>
          <div className="text-right text-xs text-[color:var(--ink-2)]">
            <p>2 tasks queued</p>
            <p>Gentle mode</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
