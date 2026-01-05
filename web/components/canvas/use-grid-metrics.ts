"use client";

import { useEffect, useRef, useState } from "react";

export type GridMetrics = {
  cols: number;
  rows: number;
  cellSize: number;
  padding: number;
  gap: number;
};

type GridOptions = {
  rowsHint?: number;
};

export function useGridMetrics({ rowsHint }: GridOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<GridMetrics>({
    cols: 8,
    rows: 10,
    cellSize: 96,
    padding: 48,
    gap: 12,
  });

  useEffect(() => {
    const update = () => {
      const width = containerRef.current?.clientWidth ?? window.innerWidth;
      const padding = width < 768 ? 24 : 48;
      const minCell = width < 768 ? 84 : 96;
      const available = Math.max(0, width - padding * 2);
      const cols = Math.max(2, Math.floor(available / minCell));
      const cellSize = Math.max(48, Math.floor(available / cols));
      const baseRows = Math.max(
        6,
        Math.floor((window.innerHeight - padding * 2) / Math.max(cellSize, 1)),
      );
      const rows = Math.max(rowsHint ?? 0, baseRows);
      const gap = Math.max(10, Math.floor(cellSize * 0.16));
      setMetrics({ cols, rows, cellSize, padding, gap });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [rowsHint]);

  return { ref: containerRef, metrics };
}
