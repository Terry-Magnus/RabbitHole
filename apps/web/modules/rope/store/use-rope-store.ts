import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { RopeStop } from "../types/rope";

interface RopeState {
  stops: RopeStop[];
  addStop: (stop: Omit<RopeStop, "id">) => void;
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
    }),
    {
      name: "rabbit-hole-rope",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
