import type { ModuleDefinition } from "@/lib/types";
import { EventsModule } from "@/modules/EventsModule";
import { FocusModule } from "@/modules/FocusModule";
import { NotesModule } from "@/modules/NotesModule";
import { ShortcutsModule } from "@/modules/ShortcutsModule";
import { WeatherModule } from "@/modules/WeatherModule";

const registry = new Map<string, ModuleDefinition>();

const definitions: ModuleDefinition[] = [
  {
    type: "weather",
    name: "Weather",
    defaultLayout: { x: 0, y: 0, w: 4, h: 2 },
    minW: 3,
    minH: 2,
    maxW: 6,
    maxH: 3,
    render: (props) => <WeatherModule {...props} />,
  },
  {
    type: "events",
    name: "Today",
    defaultLayout: { x: 0, y: 0, w: 4, h: 2 },
    minW: 3,
    minH: 2,
    maxW: 6,
    maxH: 3,
    render: (props) => <EventsModule {...props} />,
  },
  {
    type: "notes",
    name: "Notes",
    defaultLayout: { x: 0, y: 0, w: 4, h: 2 },
    minW: 3,
    minH: 2,
    maxW: 6,
    maxH: 3,
    render: (props) => <NotesModule {...props} />,
  },
  {
    type: "focus",
    name: "Focus",
    defaultLayout: { x: 0, y: 0, w: 4, h: 2 },
    minW: 3,
    minH: 2,
    maxW: 6,
    maxH: 3,
    render: (props) => <FocusModule {...props} />,
  },
  {
    type: "shortcuts",
    name: "Shortcuts",
    defaultLayout: { x: 0, y: 0, w: 8, h: 2 },
    minW: 4,
    minH: 2,
    maxW: 8,
    maxH: 3,
    render: (props) => <ShortcutsModule {...props} />,
  },
];

definitions.forEach((definition) => registry.set(definition.type, definition));

export function getModuleDefinition(type: string) {
  return registry.get(type);
}

export function getModuleDefinitions() {
  return Array.from(registry.values());
}
