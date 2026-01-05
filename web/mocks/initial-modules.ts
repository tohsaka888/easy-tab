import type { ModuleInstance } from "@/lib/types";

export const initialModules: ModuleInstance[] = [
  {
    id: "mod-weather",
    type: "weather",
    layout: { x: 0, y: 0, w: 4, h: 2 },
    config: { city: "Shanghai" },
  },
  {
    id: "mod-events",
    type: "events",
    layout: { x: 4, y: 0, w: 4, h: 2 },
  },
  {
    id: "mod-notes",
    type: "notes",
    layout: { x: 0, y: 2, w: 4, h: 2 },
  },
  {
    id: "mod-focus",
    type: "focus",
    layout: { x: 4, y: 2, w: 4, h: 2 },
  },
  {
    id: "mod-shortcuts",
    type: "shortcuts",
    layout: { x: 0, y: 4, w: 8, h: 2 },
  },
];
