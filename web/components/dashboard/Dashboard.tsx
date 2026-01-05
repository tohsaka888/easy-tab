"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas } from "@/components/canvas/Canvas";
import { useGridMetrics } from "@/components/canvas/use-grid-metrics";
import { ModuleDrawer } from "@/components/dashboard/ModuleDrawer";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { TimeBlock } from "@/components/dashboard/TimeBlock";
import {
  autoLayoutLayouts,
  autoLayoutWithAnchor,
  clampLayout,
  findNearestSpot,
  normalizeLayouts,
  pushDownLayouts,
} from "@/lib/layout-engine";
import type { Layout, ModuleDefinition, ModuleInstance } from "@/lib/types";
import { getModuleDefinitions } from "@/modules/registry";
import { useDashboardStore } from "@/stores/useDashboardStore";

const gridHint = "Drag tiles to reorder. Resize with the corner handles.";

export function Dashboard() {
  const {
    editMode,
    drawerOpen,
    activeDragId,
    modules,
    canvasRows,
    autoCanvasHeight,
    autoLayout,
    toggleEditMode,
    setDrawerOpen,
    addModule,
    removeModule,
    setActiveDragId,
    setCanvasRows,
    setModules,
    toggleAutoLayout,
    toggleAutoCanvasHeight,
  } = useDashboardStore();
  const [previewLayout, setPreviewLayout] = useState<Layout | null>(null);
  const effectivePreviewLayout = editMode ? previewLayout : null;

  const maxBottom = modules.reduce((max, module) => Math.max(max, module.layout.y + module.layout.h), 0);
  const rowsHintBase = Math.max(canvasRows, maxBottom + 1);
  const rowsHint = autoCanvasHeight ? rowsHintBase : Math.max(rowsHintBase, 6);
  const { ref: canvasRef, metrics } = useGridMetrics({ rowsHint });

  useEffect(() => {
    if (!autoCanvasHeight) return;
    const desiredRows = Math.max(6, maxBottom + 1);
    if (desiredRows > canvasRows) {
      setCanvasRows(desiredRows);
    }
  }, [autoCanvasHeight, canvasRows, maxBottom, setCanvasRows]);

  const moduleDefinitions = useMemo(() => getModuleDefinitions(), []);
  const modulesRef = useRef(modules);
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);
  const moduleKey = useMemo(() => modules.map((module) => module.id).join("|"), [modules]);

  useLayoutEffect(() => {
    const currentModules = modulesRef.current;
    if (!currentModules.length) return;
    const bounds = { cols: metrics.cols, rows: metrics.rows };
    const layoutItems = currentModules.map((module) => ({ id: module.id, layout: module.layout }));
    const arranged = autoLayout
      ? autoLayoutLayouts(layoutItems, bounds)
      : normalizeLayouts(layoutItems, bounds);
    const arrangedMap = new Map(arranged.map((item) => [item.id, item.layout]));
    const next = currentModules.map((module) => ({
      ...module,
      layout: arrangedMap.get(module.id) ?? module.layout,
    }));

    const changed = currentModules.some(
      (module, index) =>
        module.layout.x !== next[index].layout.x ||
        module.layout.y !== next[index].layout.y ||
        module.layout.w !== next[index].layout.w ||
        module.layout.h !== next[index].layout.h,
    );

    if (changed) setModules(next);
  }, [autoLayout, metrics.cols, metrics.rows, moduleKey, setModules]);

  const handleAddModule = (definition: ModuleDefinition) => {
    const bounds = { cols: metrics.cols, rows: metrics.rows };
    const occupied = modules.map((module) => module.layout);
    const defaultLayout = clampLayout(definition.defaultLayout, bounds);
    const layout = findNearestSpot(defaultLayout, occupied, bounds) ?? defaultLayout;
    const newModule: ModuleInstance = {
      id: `mod-${definition.type}-${Date.now()}`,
      type: definition.type,
      layout,
    };
    addModule(newModule);
    setDrawerOpen(false);
  };

  const handleUpdateLayout = (id: string, layout: Layout) => {
    const bounds = { cols: metrics.cols, rows: metrics.rows };
    const nextModules = modules.map((module) =>
      module.id === id ? { ...module, layout: clampLayout(layout, bounds) } : module,
    );

    if (autoLayout) {
      const anchored = autoLayoutWithAnchor(
        nextModules.map((module) => ({ id: module.id, layout: module.layout })),
        id,
        bounds,
      );
      const anchoredMap = new Map(anchored.map((item) => [item.id, item.layout]));
      setModules(
        nextModules.map((module) => ({
          ...module,
          layout: anchoredMap.get(module.id) ?? module.layout,
        })),
      );
      return;
    }

    const pushed = pushDownLayouts(
      nextModules.map((module) => ({ id: module.id, layout: module.layout })),
      id,
      bounds,
    );
    const pushedMap = new Map(pushed.map((item) => [item.id, item.layout]));
    setModules(
      nextModules.map((module) => ({
        ...module,
        layout: pushedMap.get(module.id) ?? module.layout,
      })),
    );
  };

  const handleRowsChange = (delta: number) => {
    if (autoCanvasHeight) return;
    setCanvasRows(Math.max(6, canvasRows + delta));
  };

  const handleRequireRows = (rows: number) => {
    if (!autoCanvasHeight) return;
    const nextRows = Math.max(6, Math.ceil(rows));
    if (nextRows > canvasRows) {
      setCanvasRows(nextRows);
    }
  };

  return (
    <div className="app-shell relative overflow-hidden">
      <div className="relative z-10 px-4 pb-20">
        <header className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 pt-16">
          <div className="flex w-full items-center justify-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/90 transition hover:bg-white/20"
                onClick={() => setDrawerOpen(true)}
              >
                Add
              </button>
              <button
                type="button"
                className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/90 transition hover:bg-white/20"
                onClick={toggleAutoLayout}
              >
                Auto {autoLayout ? "On" : "Off"}
              </button>
              <button
                type="button"
                className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/90 transition hover:bg-white/20"
                onClick={toggleAutoCanvasHeight}
              >
                Auto Height {autoCanvasHeight ? "On" : "Off"}
              </button>
              <button
                type="button"
                className="rounded-full border border-white/50 bg-white/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white transition hover:bg-white/30"
                onClick={() => {
                  if (editMode) setPreviewLayout(null);
                  toggleEditMode();
                }}
              >
                {editMode ? "Done" : "Edit"}
              </button>
              <div className="flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                <button
                  type="button"
                  className="h-5 w-5 rounded-full bg-white/15 text-white hover:bg-white/25"
                  onClick={() => handleRowsChange(-1)}
                  disabled={autoCanvasHeight}
                >
                  -
                </button>
                <span className="px-1">Rows {metrics.rows}</span>
                <button
                  type="button"
                  className="h-5 w-5 rounded-full bg-white/15 text-white hover:bg-white/25"
                  onClick={() => handleRowsChange(1)}
                  disabled={autoCanvasHeight}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <TimeBlock />
          <SearchBar />
          <div className="font-ui text-[11px] uppercase tracking-[0.3em] text-white/60">
            Canvas Mode - {metrics.cols} cols / {metrics.rows} rows
          </div>
        </header>

        <div ref={canvasRef} className="mx-auto w-full max-w-[1480px]">
          <Canvas
            metrics={metrics}
            modules={modules}
            editMode={editMode}
            autoLayout={autoLayout}
            activeDragId={activeDragId}
            previewLayout={effectivePreviewLayout}
            autoCanvasHeight={autoCanvasHeight}
            onRequireRows={handleRequireRows}
            onUpdateLayout={handleUpdateLayout}
            onDelete={removeModule}
            onActiveChange={setActiveDragId}
            onPreviewChange={setPreviewLayout}
          />
        </div>

        <footer className="mx-auto mt-6 max-w-[1200px] text-center font-ui text-xs text-white/70">
          {editMode ? gridHint : "Tap edit to rearrange your canvas."}
        </footer>
      </div>

      <ModuleDrawer
        open={drawerOpen}
        modules={moduleDefinitions}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddModule}
      />
    </div>
  );
}
