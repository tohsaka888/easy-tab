import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Layout, ModuleInstance } from "@/lib/types";
import { createIndexedDBStorage } from "@/lib/indexeddb-storage";
import { initialModules } from "@/mocks/initial-modules";

type DashboardState = {
  editMode: boolean;
  drawerOpen: boolean;
  activeDragId: string | null;
  canvasRows: number;
  autoCanvasHeight: boolean;
  autoLayout: boolean;
  modules: ModuleInstance[];
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  setDrawerOpen: (value: boolean) => void;
  setActiveDragId: (value: string | null) => void;
  setCanvasRows: (value: number) => void;
  setAutoCanvasHeight: (value: boolean) => void;
  toggleAutoCanvasHeight: () => void;
  setAutoLayout: (value: boolean) => void;
  toggleAutoLayout: () => void;
  addModule: (module: ModuleInstance) => void;
  removeModule: (id: string) => void;
  updateModuleLayout: (id: string, layout: Layout) => void;
  setModules: (modules: ModuleInstance[]) => void;
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      editMode: false,
      drawerOpen: false,
      activeDragId: null,
      canvasRows: 10,
      autoCanvasHeight: true,
      autoLayout: true,
      modules: initialModules,
      setEditMode: (value) => set({ editMode: value }),
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
      setDrawerOpen: (value) => set({ drawerOpen: value }),
      setActiveDragId: (value) => set({ activeDragId: value }),
      setCanvasRows: (value) => set({ canvasRows: value }),
      setAutoCanvasHeight: (value) => set({ autoCanvasHeight: value }),
      toggleAutoCanvasHeight: () => set((state) => ({ autoCanvasHeight: !state.autoCanvasHeight })),
      setAutoLayout: (value) => set({ autoLayout: value }),
      toggleAutoLayout: () => set((state) => ({ autoLayout: !state.autoLayout })),
      addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
      removeModule: (id) =>
        set((state) => ({ modules: state.modules.filter((item) => item.id !== id) })),
      updateModuleLayout: (id, layout) =>
        set((state) => ({
          modules: state.modules.map((item) => (item.id === id ? { ...item, layout } : item)),
        })),
      setModules: (modules) => set({ modules }),
    }),
    {
      name: "dashboard-store",
      storage: createIndexedDBStorage<DashboardState>({
        dbName: "easy-tab",
        storeName: "dashboard",
      }),
      partialize: (state) => ({
        modules: state.modules,
        canvasRows: state.canvasRows,
        autoCanvasHeight: state.autoCanvasHeight,
        autoLayout: state.autoLayout,
      }),
      version: 1,
    },
  ),
);
