"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import type { Layout, ModuleDefinition, ModuleInstance } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { GridMetrics } from "@/components/canvas/use-grid-metrics";
import { clampLayout } from "@/lib/layout-engine";

type ResizeHandle = "nw" | "ne" | "sw" | "se";

type ModuleTileProps = {
  instance: ModuleInstance;
  definition: ModuleDefinition;
  index: number;
  metrics: GridMetrics;
  editMode: boolean;
  active: boolean;
  autoCanvasHeight: boolean;
  onRequireRows: (rows: number) => void;
  onUpdateLayout: (layout: Layout) => void;
  onDelete: () => void;
  onActiveChange: (id: string | null) => void;
  onPreviewChange: (layout: Layout | null) => void;
};

type DragState = {
  pointerId: number;
  mode: "drag" | "resize";
  handle?: ResizeHandle;
  startX: number;
  startY: number;
  layout: Layout;
  element: HTMLDivElement;
};

export function ModuleTile({
  instance,
  definition,
  index,
  metrics,
  editMode,
  active,
  autoCanvasHeight,
  onRequireRows,
  onUpdateLayout,
  onDelete,
  onActiveChange,
  onPreviewChange,
}: ModuleTileProps) {
  const [invalid, setInvalid] = useState(false);
  const dragState = useRef<DragState | null>(null);

  const endDrag = useCallback(() => {
    const state = dragState.current;
    if (!state) return;
    dragState.current = null;
    setInvalid(false);
    onActiveChange(null);
    onPreviewChange(null);
    try {
      if (state.element.hasPointerCapture(state.pointerId)) {
        state.element.releasePointerCapture(state.pointerId);
      }
    } catch {
      // no-op: element may not have pointer capture anymore
    }
  }, [onActiveChange, onPreviewChange]);

  useEffect(() => {
    const handleWindowPointerUp = () => endDrag();
    const handleWindowBlur = () => endDrag();
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [endDrag]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!editMode) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }
    event.preventDefault();
    const handleElement = target.closest<HTMLElement>("[data-resize-handle]");
    const handle = (handleElement?.dataset.resizeHandle as ResizeHandle | undefined) ?? undefined;
    const mode = handle ? "resize" : "drag";
    dragState.current = {
      pointerId: event.pointerId,
      mode,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      layout: instance.layout,
      element: event.currentTarget,
    };
    onActiveChange(instance.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const state = dragState.current;
    if (state.pointerId !== event.pointerId) return;

    const deltaX = Math.round((event.clientX - state.startX) / metrics.cellSize);
    const deltaY = Math.round((event.clientY - state.startY) / metrics.cellSize);

    let candidate: Layout = { ...state.layout };

    if (state.mode === "drag") {
      candidate = {
        ...candidate,
        x: candidate.x + deltaX,
        y: candidate.y + deltaY,
      };
    } else {
      const handleType = state.handle ?? "se";
      if (handleType.includes("w")) {
        candidate = { ...candidate, x: candidate.x + deltaX, w: candidate.w - deltaX };
      }
      if (handleType.includes("e")) {
        candidate = { ...candidate, w: candidate.w + deltaX };
      }
      if (handleType.includes("n")) {
        candidate = { ...candidate, y: candidate.y + deltaY, h: candidate.h - deltaY };
      }
      if (handleType.includes("s")) {
        candidate = { ...candidate, h: candidate.h + deltaY };
      }
    }

    const maxW = Math.min(definition.maxW, metrics.cols);
    const maxH = autoCanvasHeight ? definition.maxH : Math.min(definition.maxH, metrics.rows);
    candidate = {
      ...candidate,
      w: Math.min(Math.max(candidate.w, definition.minW), maxW),
      h: Math.min(Math.max(candidate.h, definition.minH), maxH),
    };

    const inBounds =
      candidate.x >= 0 &&
      candidate.y >= 0 &&
      candidate.x + candidate.w <= metrics.cols;

    setInvalid(!inBounds);
    if (!inBounds) {
      onPreviewChange(null);
      return;
    }

    const requestedRows = candidate.y + candidate.h;
    const boundsRows = autoCanvasHeight ? Math.max(metrics.rows, requestedRows) : metrics.rows;
    candidate = clampLayout(candidate, { cols: metrics.cols, rows: boundsRows });

    if (autoCanvasHeight && requestedRows >= metrics.rows) {
      onRequireRows(requestedRows + 1);
    }
    onPreviewChange(candidate);
    onUpdateLayout(candidate);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    if (dragState.current.pointerId !== event.pointerId) return;
    endDrag();
  };

  const { cellSize, padding, gap } = metrics;
  const style = {
    left: padding + instance.layout.x * cellSize + gap / 2,
    top: padding + instance.layout.y * cellSize + gap / 2,
    width: instance.layout.w * cellSize - gap,
    height: instance.layout.h * cellSize - gap,
  };

  return (
    <div
      className={cn(
        "absolute select-none touch-none transition-[left,top,width,height,box-shadow] duration-150 ease-out",
        editMode ? (active ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
        editMode && "animate-[wiggle_0.38s_ease-in-out_infinite]",
        active && "z-20",
      )}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-[14px] transition",
          editMode ? "ring-1 ring-white/70" : "ring-0",
          invalid && "ring-2 ring-[color:var(--danger)]",
          active && "shadow-[0_14px_36px_rgba(0,0,0,0.22)]",
        )}
      >
        <div className="tile-enter h-full w-full" style={{ animationDelay: `${index * 60}ms` }}>
          {definition.render({ instance })}
        </div>

        {editMode && (
          <>
            <button
              type="button"
              className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--danger)] text-xs font-semibold text-white shadow-lg"
              onClick={onDelete}
              aria-label="Remove module"
            >
              x
            </button>
            {(["nw", "ne", "sw", "se"] as ResizeHandle[]).map((handle) => {
              const position =
                handle === "nw"
                  ? "left-1 top-1"
                  : handle === "ne"
                    ? "right-1 top-1"
                    : handle === "sw"
                      ? "left-1 bottom-1"
                      : "right-1 bottom-1";
              return (
                <span
                  key={handle}
                  data-resize-handle={handle}
                  className={cn(
                    "absolute h-3.5 w-3.5 rounded-full border border-white/70 bg-[color:var(--accent-2)] shadow-[0_0_10px_rgba(59,166,166,0.6)]",
                    position,
                  )}
                />
              );
            })}
            {invalid && (
              <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[color:var(--danger)]/10" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
