"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const LEGEND_ITEMS = [
  { color: "bg-green-600", label: "Serving now" },
  { color: "bg-blue-600", label: "Open today" },
  { color: "bg-gray-400", label: "Closed today" },
] as const;

export function MapLegend() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium shadow-md"
        aria-expanded={expanded}
        aria-label="Map legend"
      >
        Legend
        {expanded ? (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="mt-1 rounded-lg bg-white p-3 shadow-md">
          <ul className="space-y-1.5" role="list">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${item.color}`}
                  aria-hidden="true"
                />
                {item.label}
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-blue-300"
                aria-hidden="true"
              />
              Your location
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
