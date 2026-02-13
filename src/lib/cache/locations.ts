import { openDB, type IDBPDatabase } from "idb";
import type { MealLocation } from "@/types/location";

const DB_NAME = "feed-need";
const DB_VERSION = 1;
const LOCATIONS_STORE = "locations";
const META_STORE = "meta";

interface FeedNeedDB {
  locations: {
    key: string;
    value: MealLocation;
  };
  meta: {
    key: string;
    value: { key: string; value: string };
  };
}

let dbPromise: Promise<IDBPDatabase<FeedNeedDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FeedNeedDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(LOCATIONS_STORE)) {
          db.createObjectStore(LOCATIONS_STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function cacheLocations(locations: MealLocation[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction([LOCATIONS_STORE, META_STORE], "readwrite");
    const store = tx.objectStore(LOCATIONS_STORE);
    const meta = tx.objectStore(META_STORE);

    await store.clear();
    for (const loc of locations) {
      await store.put(loc);
    }
    await meta.put({ key: "locations_cached_at", value: new Date().toISOString() });
    await tx.done;
  } catch {
    // IndexedDB not available (e.g. private browsing in some browsers)
  }
}

export async function getCachedLocations(): Promise<MealLocation[]> {
  try {
    const db = await getDB();
    return await db.getAll(LOCATIONS_STORE);
  } catch {
    return [];
  }
}

export async function getLocationsCachedAt(): Promise<string | null> {
  try {
    const db = await getDB();
    const entry = await db.get(META_STORE, "locations_cached_at");
    return entry?.value ?? null;
  } catch {
    return null;
  }
}
