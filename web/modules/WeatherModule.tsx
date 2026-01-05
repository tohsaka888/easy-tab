import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SunIcon } from "@/components/icons";
import type { ModuleRenderProps } from "@/lib/types";

export function WeatherModule({ instance }: ModuleRenderProps) {
  const city = (instance.config?.city as string) ?? "Shanghai";
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent-2)]/15 text-[color:var(--accent-2)]">
            <SunIcon className="h-4 w-4" />
          </span>
          Weather
        </CardTitle>
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
