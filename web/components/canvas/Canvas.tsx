"use client";

import type { Layout, ModuleInstance } from "@/lib/types";
import { getModuleDefinition } from "@/modules/registry";
import { cn } from "@/lib/utils";
import type { GridMetrics } from "@/components/canvas/use-grid-metrics";
import { ModuleTile } from "@/components/canvas/ModuleTile";

type CanvasProps = {
  metrics: GridMetrics;
  modules: ModuleInstance[];
  editMode: boolean;
  autoLayout: boolean;
  activeDragId: string | null;
  previewLayout: Layout | null;
  onUpdateLayout: (id: string, layout: Layout) => void;
  onDelete: (id: string) => void;
  onActiveChange: (id: string | null) => void;
  onPreviewChange: (layout: Layout | null) => void;
};

export function Canvas({
  metrics,
  modules,
  editMode,
  autoLayout,
  activeDragId,
  previewLayout,
  onUpdateLayout,
  onDelete,
  onActiveChange,
  onPreviewChange,
}: CanvasProps) {
  const { cellSize, padding, gap } = metrics;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden pb-24",
        editMode && "cursor-crosshair",
      )}
      style={{
        "--grid-size": `${metrics.cellSize}px`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10 bg-white/5 opacity-60 backdrop-blur-[2px]"
        style={{ margin: metrics.padding / 2 }}
      />
      {editMode && (
        <div
          className="pointer-events-none absolute inset-0 grid-surface opacity-40"
          style={{ margin: metrics.padding }}
        />
      )}
      {editMode && previewLayout && (
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            margin: metrics.padding,
            backgroundImage:
              "linear-gradient(rgba(59,166,166,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,166,166,0.35) 1px, transparent 1px)",
            backgroundSize: `${metrics.cellSize}px ${metrics.cellSize}px`,
          }}
        />
      )}
      <div className="relative" style={{ minHeight: metrics.rows * metrics.cellSize + padding * 2 }}>
        {previewLayout && (
          <div
            className="pointer-events-none absolute rounded-[16px] border border-[color:var(--accent-2)]/60 bg-[color:var(--accent-2)]/15 shadow-[0_0_30px_rgba(59,166,166,0.35)]"
            style={{
              left: padding + previewLayout.x * cellSize + gap / 2,
              top: padding + previewLayout.y * cellSize + gap / 2,
              width: previewLayout.w * cellSize - gap,
              height: previewLayout.h * cellSize - gap,
            }}
          />
        )}
        {modules.map((module, index) => {
          const definition = getModuleDefinition(module.type);
          if (!definition) return null;
          return (
            <ModuleTile
              key={module.id}
              instance={module}
              definition={definition}
              index={index}
              metrics={metrics}
              autoLayout={autoLayout}
              editMode={editMode}
              active={activeDragId === module.id}
              onUpdateLayout={(layout) => onUpdateLayout(module.id, layout)}
              onDelete={() => onDelete(module.id)}
              onActiveChange={onActiveChange}
              onPreviewChange={onPreviewChange}
            />
          );
        })}
      </div>
    </div>
  );
}
