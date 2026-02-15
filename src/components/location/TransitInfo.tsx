"use client";

import { Bus, TrainFront, ExternalLink } from "lucide-react";
import type { NearbyTransit } from "@/types/location";
import { getStopTransitUrl, getWalkingDirectionsUrl } from "@/lib/utils/transit";

interface TransitInfoProps {
  transit: NearbyTransit;
}

export function TransitInfo({ transit }: TransitInfoProps) {
  const hasBus = transit.bus_stops.length > 0;
  const hasTrain = transit.train_stations.length > 0;

  if (!hasBus && !hasTrain) return null;

  return (
    <div className="space-y-4">
      {hasBus && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Bus className="h-4 w-4" aria-hidden="true" />
            Nearby bus stops
          </h3>
          <ul className="mt-2 space-y-2">
            {transit.bus_stops.map((stop) => (
              <li key={stop.stop_id} className="rounded-md border p-3 text-sm">
                <div className="font-medium">{stop.name}</div>
                <div className="mt-0.5 text-muted-foreground">
                  {stop.distance_m}m away ({stop.walk_min} min walk)
                </div>
                {stop.routes.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1" role="list" aria-label="Bus routes at this stop">
                    {stop.routes.map((route) => (
                      <span
                        key={route}
                        role="listitem"
                        className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                      >
                        <span className="sr-only">Route </span>{route}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={getStopTransitUrl(stop.lat, stop.lng, stop.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary"
                  aria-label={`View ${stop.name} on Google Maps (opens in new tab)`}
                >
                  View on map
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasTrain && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <TrainFront className="h-4 w-4" aria-hidden="true" />
            Nearest train station
          </h3>
          <ul className="mt-2 space-y-2">
            {transit.train_stations.map((station) => (
              <li key={station.name} className="rounded-md border p-3 text-sm">
                <div className="font-medium">{station.name}</div>
                <div className="mt-0.5 text-muted-foreground">
                  {station.distance_m}m away ({station.walk_min} min walk)
                </div>
                <a
                  href={getWalkingDirectionsUrl(station.lat, station.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary"
                  aria-label={`Walking directions to ${station.name} station (opens in new tab)`}
                >
                  Walking directions
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
