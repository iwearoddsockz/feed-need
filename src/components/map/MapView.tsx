"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import type { MealLocation } from "@/types/location";
import { PERTH_CENTRE, DEFAULT_MAP_ZOOM } from "@/lib/utils/constants";
import { formatTime } from "@/lib/utils/date";
import { formatAddress, getDirectionsUrl, formatMealType } from "@/lib/utils/format";
import {
  createMarkerIcon,
  createUserLocationIcon,
  createClusterIcon,
  getMarkerStatus,
  getTodaySchedules,
} from "./marker-icons";

interface MapViewProps {
  locations: MealLocation[];
  userLocation: { latitude: number; longitude: number } | null;
}

function InvalidateSize() {
  const map = useMap();

  useEffect(() => {
    // Leaflet may initialize before the container has dimensions (dynamic import).
    // Force a size recalculation after the first paint.
    const timer = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function ClusterAccessibility() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    function labelMarkers() {
      container
        .querySelectorAll('.leaflet-marker-icon[role="button"]:not([aria-label])')
        .forEach((el) => {
          const text = el.textContent?.trim();
          if (text && /^\d+$/.test(text)) {
            el.setAttribute("aria-label", `Cluster of ${text} locations`);
          }
        });
    }

    const observer = new MutationObserver(labelMarkers);
    observer.observe(container, { childList: true, subtree: true });
    labelMarkers();

    return () => observer.disconnect();
  }, [map]);

  return null;
}

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 14);
  }, [position, map]);

  return null;
}

function LocationPopupContent({ location }: { location: MealLocation }) {
  const status = getMarkerStatus(location);
  const todaySchedules = getTodaySchedules(location);

  return (
    <div className="min-w-[200px] max-w-[280px]">
      <h3 className="text-base font-semibold leading-tight">{location.name}</h3>
      {location.organisation && location.organisation !== location.name && (
        <p className="text-sm text-muted-foreground">{location.organisation}</p>
      )}
      <p className="mt-1 text-sm">
        {formatAddress(location.street_address, location.suburb, location.postcode)}
      </p>

      <div className="mt-2">
        {status === "serving" && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
            <span
              className="inline-block h-2 w-2 rounded-full bg-green-600"
              aria-hidden="true"
            />
            Serving now
          </span>
        )}
        {status === "today" && todaySchedules.length > 0 && (
          <div className="text-sm text-blue-700">
            <span className="inline-flex items-center gap-1 font-medium">
              <span
                className="inline-block h-2 w-2 rounded-full bg-blue-600"
                aria-hidden="true"
              />
              Today
            </span>
            <p className="mt-0.5">
              {todaySchedules
                .map(
                  (s) =>
                    `${formatMealType(s.meal_type)}: ${formatTime(s.start_time)}\u2013${formatTime(s.end_time)}`
                )
                .join(", ")}
            </p>
          </div>
        )}
        {status === "closed" && (
          <span className="inline-flex items-center gap-1 text-sm text-gray-500">
            <span
              className="inline-block h-2 w-2 rounded-full bg-gray-400"
              aria-hidden="true"
            />
            Not serving today
          </span>
        )}
      </div>

      <div className="mt-2 flex gap-3 text-sm">
        <a
          href={`/location/${location.id}`}
          className="font-medium text-primary underline underline-offset-2"
        >
          Details
        </a>
        <a
          href={getDirectionsUrl(location.latitude, location.longitude, location.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2"
        >
          Directions
        </a>
      </div>
    </div>
  );
}

export function MapView({ locations, userLocation }: MapViewProps) {
  return (
    <div className="absolute inset-0">
    <MapContainer
      center={[PERTH_CENTRE.latitude, PERTH_CENTRE.longitude]}
      zoom={DEFAULT_MAP_ZOOM}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <InvalidateSize />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createMarkerIcon(getMarkerStatus(location))}
            eventHandlers={{
              add: (e) => {
                const el = e.target.getElement();
                if (el) el.setAttribute("aria-label", location.name);
              },
            }}
          >
            <Popup>
              <LocationPopupContent location={location} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <ClusterAccessibility />

      {userLocation && (
        <>
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserLocationIcon()}
            zIndexOffset={1000}
            eventHandlers={{
              add: (e) => {
                const el = e.target.getElement();
                if (el) el.setAttribute("aria-label", "Your location");
              },
            }}
          >
            <Popup>
              <p className="text-sm font-medium">You are here</p>
            </Popup>
          </Marker>
          <FlyToLocation
            position={[userLocation.latitude, userLocation.longitude]}
          />
        </>
      )}
    </MapContainer>
    </div>
  );
}
