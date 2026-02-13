import L from "leaflet";
import type { MarkerStatus } from "@/lib/utils/location-status";

export { type MarkerStatus, getMarkerStatus, getTodaySchedules } from "@/lib/utils/location-status";

const MARKER_COLORS: Record<MarkerStatus, string> = {
  serving: "#16a34a", // green-600 (functional: currently serving)
  today: "#2563eb", // blue-600 (functional: open today)
  closed: "#6b7280", // gray-500 (functional: closed)
};

function pinSvg(color: string): string {
  return `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12.5" cy="12.5" r="5" fill="white"/>
  </svg>`;
}

export function createMarkerIcon(status: MarkerStatus): L.DivIcon {
  return L.divIcon({
    className: "",
    html: pinSvg(MARKER_COLORS[status]),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

export function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 2px rgba(59,130,246,0.4),0 2px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function createClusterIcon(cluster: {
  getChildCount(): number;
}): L.DivIcon {
  const count = cluster.getChildCount();
  const size = count < 10 ? 36 : count < 50 ? 44 : 52;
  const fontSize = count < 10 ? 13 : count < 100 ? 12 : 11;

  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:rgba(124,58,237,0.85);color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${fontSize}px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
