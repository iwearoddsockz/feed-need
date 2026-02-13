"use client";

import { useState, useMemo } from "react";
import type { DayOfWeek, MealType } from "@/types/location";
import { useLocations, type LocationFilters } from "@/lib/hooks/useLocations";
import { getMarkerStatus } from "@/lib/utils/location-status";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/search/FilterBar";
import { LocationList } from "@/components/search/LocationList";

export default function SearchPage() {
  const [selectedSuburb, setSelectedSuburb] = useState<string | undefined>();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>();
  const [selectedMealType, setSelectedMealType] = useState<
    MealType | undefined
  >();
  const [openNow, setOpenNow] = useState(false);

  const filters: LocationFilters = useMemo(
    () => ({
      suburb: selectedSuburb,
      day: selectedDay,
      mealType: selectedMealType,
    }),
    [selectedSuburb, selectedDay, selectedMealType]
  );

  const { locations, loading, error } = useLocations(filters);

  const filteredLocations = useMemo(() => {
    if (!openNow) return locations;
    return locations.filter((loc) => getMarkerStatus(loc) === "serving");
  }, [locations, openNow]);

  const hasActiveFilters = !!(selectedDay || selectedMealType || openNow);

  function handleSuburbSelect(suburb: string, _postcode: string) {
    setSelectedSuburb(suburb);
  }

  function handleSearchClear() {
    setSelectedSuburb(undefined);
  }

  function handleClearAllFilters() {
    setSelectedDay(undefined);
    setSelectedMealType(undefined);
    setOpenNow(false);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4">
      <h1 className="sr-only">Search locations</h1>

      <SearchBar onSelect={handleSuburbSelect} onClear={handleSearchClear} />

      <div className="mt-3">
        <FilterBar
          day={selectedDay}
          mealType={selectedMealType}
          openNow={openNow}
          onDayChange={setSelectedDay}
          onMealTypeChange={setSelectedMealType}
          onOpenNowChange={setOpenNow}
          onClearAll={handleClearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="mt-4">
        <LocationList
          locations={filteredLocations}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
