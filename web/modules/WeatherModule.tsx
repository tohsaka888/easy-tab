import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SunIcon } from "@/components/icons";
import type { ModuleRenderProps } from "@/lib/types";

export function WeatherModule({ instance }: ModuleRenderProps) {
  const city = (instance.config?.city as string) ?? "Shanghai";
  return (
    <Card className="h-full">
      <CardHeader className="border-b border-[color:var(--card-border)] px-4 pt-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[color:var(--card-ink)]">
        <Badge
          className="border border-[color:var(--card-border)] bg-[color:var(--overlay-soft)] text-[color:var(--card-ink)] shadow-sm"
        >
          {city}
        </Badge>
        <div className="flex items-end justify-between rounded-xl border border-[color:var(--card-border)] bg-[color:var(--overlay-soft)] px-4 py-3 shadow-[0_14px_38px_rgba(0,0,0,0.25)]">
            <p className="text-3xl font-semibold text-[color:var(--card-ink)]">26 deg</p>
            <p className="text-xs text-[color:var(--card-ink-muted)]">Cloudy, humid</p>
          <div className="text-right text-xs text-[color:var(--card-ink-muted)]">
        <Badge className="bg-[color:var(--surface-3)]">{city}</Badge>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold text-[color:var(--ink-1)]">26 deg</p>
            <p className="text-xs text-[color:var(--ink-2)]">Cloudy, humid</p>
          </div>
          <div className="text-right text-xs text-[color:var(--ink-2)]">
            <p>Feels like 29 deg</p>
            <p>Wind 4 km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
