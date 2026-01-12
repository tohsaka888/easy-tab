"use client";

import type { ModuleDefinition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModuleDrawerProps = {
  open: boolean;
  modules: ModuleDefinition[];
  onClose: () => void;
  onAdd: (module: ModuleDefinition) => void;
};

export function ModuleDrawer({ open, modules, onClose, onAdd }: ModuleDrawerProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-[320px] translate-x-full bg-[color:var(--surface-2)] p-6 shadow-2xl transition-transform",
          open && "translate-x-0",
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-ui text-lg font-semibold text-[color:var(--ink-1)]">Add modules</h2>
          <button
            type="button"
            className="rounded-full px-2 py-1 text-sm text-[color:var(--ink-2)] hover:bg-black/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {modules.map((module) => (
            <div
              key={module.type}
              className="rounded-2xl border border-[color:var(--stroke-soft)] bg-[color:var(--surface-2)] p-4 shadow-[0_12px_26px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[color:var(--ink-1)]">{module.name}</p>
                  <p className="text-xs text-[color:var(--ink-2)]">
                    {module.defaultLayout.w}x{module.defaultLayout.h} grid
                  </p>
                </div>
                <Button className="rounded-full px-3 py-1 text-xs" onClick={() => onAdd(module)}>
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
