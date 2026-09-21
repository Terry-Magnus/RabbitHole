import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { RopeStop } from "../types/rope";

interface RopeState {
  stops: RopeStop[];
  addStop: (stop: Omit<RopeStop, "id">) => void;
  // Not persisted (see partialize below) — purely so any component (the
  // floating pill, the Summit's "See the rope" link) can open the same
  // panel without prop-drilling a shared open/close handler between them.
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

// sessionStorage, not localStorage: the trail should survive an accidental
// refresh but not outlive the tab — there's no signed-in account yet for it
// to belong to (that's Unit 13, once Unit 12 exists). Stops are only ever
// appended, never removed — jumping back to an earlier stop doesn't erase
// the branches taken after it (see context/specs/08-rope-navigation.md).
export const useRopeStore = create<RopeState>()(
  persist(
    (set) => ({
      stops: [],
      addStop: (stop) =>
        set((state) => ({
          stops: [...state.stops, { ...stop, id: crypto.randomUUID() }],
        })),
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "rabbit-hole-rope",
      storage: createJSONStorage(() => sessionStorage),
      // isOpen is transient UI state, not part of the trail's memory —
      // reopening a fresh tab should never come back with the panel open.
      partialize: (state) => ({ stops: state.stops }),
    },
  ),
);
