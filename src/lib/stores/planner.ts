import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlannerEntry, WeekPlan, MealSlotType } from "@/types/planner";
import type { DayOfWeek } from "@/types/location";

interface PlannerState {
  plan: WeekPlan;
  addEntry: (entry: Omit<PlannerEntry, "id">) => void;
  removeEntry: (id: string) => void;
  updateEntryNotes: (id: string, notes: string) => void;
  clearDay: (day: DayOfWeek) => void;
  clearAll: () => void;
}

const emptyPlan: WeekPlan = {
  entries: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      plan: emptyPlan,

      addEntry: (entry) =>
        set((state) => ({
          plan: {
            ...state.plan,
            entries: [
              ...state.plan.entries,
              { ...entry, id: crypto.randomUUID() },
            ],
            updated_at: new Date().toISOString(),
          },
        })),

      removeEntry: (id) =>
        set((state) => ({
          plan: {
            ...state.plan,
            entries: state.plan.entries.filter((e) => e.id !== id),
            updated_at: new Date().toISOString(),
          },
        })),

      updateEntryNotes: (id, notes) =>
        set((state) => ({
          plan: {
            ...state.plan,
            entries: state.plan.entries.map((e) =>
              e.id === id ? { ...e, notes } : e
            ),
            updated_at: new Date().toISOString(),
          },
        })),

      clearDay: (day) =>
        set((state) => ({
          plan: {
            ...state.plan,
            entries: state.plan.entries.filter((e) => e.day !== day),
            updated_at: new Date().toISOString(),
          },
        })),

      clearAll: () =>
        set({
          plan: {
            entries: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }),
    }),
    {
      name: "feed-need-planner",
      skipHydration: true,
    }
  )
);
