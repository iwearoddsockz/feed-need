"use client";

import { useEffect, useState } from "react";
import { usePlannerStore } from "@/lib/stores/planner";
import { WeekGrid } from "@/components/planner/WeekGrid";
import { PlannerSummary } from "@/components/planner/PlannerSummary";

export default function PlannerPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    usePlannerStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <h1 className="text-xl font-bold">Weekly Meal Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan your meals for the week. Your plan is saved on this device.
        </p>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Loading your plan...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4">
      <h1 className="text-xl font-bold">Weekly Meal Planner</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Plan your meals for the week. Your plan is saved on this device.
      </p>

      <div className="mt-4">
        <PlannerSummary />
      </div>

      <div className="mt-4">
        <WeekGrid />
      </div>
    </div>
  );
}
