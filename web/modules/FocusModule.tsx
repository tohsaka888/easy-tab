import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparkIcon } from "@/components/icons";
      <CardHeader className="border-b border-[color:var(--card-border)] px-4 pt-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[color:var(--card-ink)]">
        <div className="flex items-center justify-between rounded-xl border border-[color:var(--card-border)] bg-[color:var(--overlay-soft)] px-4 py-3 text-[color:var(--card-ink)] shadow-[0_14px_38px_rgba(0,0,0,0.25)]">
            <p className="text-xs text-[color:var(--card-ink-muted)]">Next session</p>
            <p className="text-3xl font-semibold text-[color:var(--card-ink)]">25:00</p>
          <div className="text-right text-xs text-[color:var(--card-ink-muted)]">
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
