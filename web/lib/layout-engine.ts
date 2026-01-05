import type { Layout } from "@/lib/types";

export type GridBounds = {
  cols: number;
  rows: number;
};

export function layoutsOverlap(a: Layout, b: Layout) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function detectCollision(layout: Layout, layouts: Layout[]) {
  return layouts.some((item) => layoutsOverlap(layout, item));
}

export function clampLayout(layout: Layout, bounds: GridBounds) {
  const width = Math.min(layout.w, bounds.cols);
  const height = Math.min(layout.h, bounds.rows);
  const maxX = Math.max(0, bounds.cols - width);
  const maxY = Math.max(0, bounds.rows - height);
  return {
    ...layout,
    w: width,
    h: height,
    x: Math.min(Math.max(layout.x, 0), maxX),
    y: Math.min(Math.max(layout.y, 0), maxY),
  };
}

export function findNearestSpot(
  layout: Layout,
  layouts: Layout[],
  bounds: GridBounds,
): Layout | null {
  const width = Math.min(layout.w, bounds.cols);
  const height = Math.min(layout.h, bounds.rows);
  const maxX = Math.max(0, bounds.cols - width);
  const maxY = Math.max(0, bounds.rows - height);

  for (let y = 0; y <= maxY; y += 1) {
    for (let x = 0; x <= maxX; x += 1) {
      const candidate = { ...layout, w: width, h: height, x, y };
      if (!detectCollision(candidate, layouts)) {
        return candidate;
      }
    }
  }
  return null;
}

export type LayoutWithId = {
  id: string;
  layout: Layout;
};

export function autoLayoutLayouts(items: LayoutWithId[], bounds: GridBounds): LayoutWithId[] {
  const placed: LayoutWithId[] = [];
  const occupied: Layout[] = [];

  for (const item of items) {
    const base = clampLayout(item.layout, bounds);
    const candidate = findNearestSpot(base, occupied, bounds) ?? base;
    const layout = clampLayout(candidate, bounds);
    placed.push({ ...item, layout });
    occupied.push(layout);
  }

  return placed;
}

export function autoLayoutWithAnchor(
  items: LayoutWithId[],
  anchorId: string,
  bounds: GridBounds,
): LayoutWithId[] {
  const anchor = items.find((item) => item.id === anchorId);
  if (!anchor) {
    return autoLayoutLayouts(items, bounds);
  }

  const placed: LayoutWithId[] = [];
  const occupied: Layout[] = [];

  const anchorLayout = clampLayout(anchor.layout, bounds);
  placed.push({ ...anchor, layout: anchorLayout });
  occupied.push(anchorLayout);

  for (const item of items) {
    if (item.id === anchorId) continue;
    const base = clampLayout(item.layout, bounds);
    const candidate = findNearestSpot(base, occupied, bounds) ?? base;
    const layout = clampLayout(candidate, bounds);
    placed.push({ ...item, layout });
    occupied.push(layout);
  }

  const placedMap = new Map(placed.map((item) => [item.id, item.layout]));
  return items.map((item) => ({
    ...item,
    layout: placedMap.get(item.id) ?? item.layout,
  }));
}

export function normalizeLayouts(items: LayoutWithId[], bounds: GridBounds): LayoutWithId[] {
  const placed: LayoutWithId[] = [];
  const occupied: Layout[] = [];

  for (const item of items) {
    let layout = clampLayout(item.layout, bounds);
    if (detectCollision(layout, occupied)) {
      const candidate = findNearestSpot(layout, occupied, bounds);
      if (candidate) {
        layout = candidate;
      }
    }
    layout = clampLayout(layout, bounds);
    placed.push({ ...item, layout });
    occupied.push(layout);
  }

  return placed;
}

export function pushDownLayouts(
  items: LayoutWithId[],
  movingId: string,
  bounds: GridBounds,
): LayoutWithId[] {
  const moving = items.find((item) => item.id === movingId);
  if (!moving) return items;

  const movingLayout = clampLayout(moving.layout, bounds);
  const placed: LayoutWithId[] = [{ ...moving, layout: movingLayout }];

  const others = items
    .filter((item) => item.id !== movingId)
    .sort((a, b) => (a.layout.y - b.layout.y) || (a.layout.x - b.layout.x));

  for (const item of others) {
    let candidate = clampLayout(item.layout, bounds);
    let attempts = 0;
    const maxAttempts = bounds.rows * bounds.cols + 10;
    while (detectCollision(candidate, placed.map((p) => p.layout)) && attempts < maxAttempts) {
      candidate = { ...candidate, y: candidate.y + 1 };
      if (candidate.y + candidate.h > bounds.rows) {
        const fallback = findNearestSpot(candidate, placed.map((p) => p.layout), bounds);
        if (fallback) {
          candidate = fallback;
          break;
        }
        candidate = clampLayout({ ...candidate, y: bounds.rows - candidate.h }, bounds);
        break;
      }
      candidate = clampLayout(candidate, bounds);
      attempts += 1;
    }
    placed.push({ ...item, layout: candidate });
  }

  const placedMap = new Map(placed.map((item) => [item.id, item.layout]));
  return items.map((item) => ({
    ...item,
    layout: placedMap.get(item.id) ?? item.layout,
  }));
}
