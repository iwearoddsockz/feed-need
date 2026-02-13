# Feed Need by Beneath the Surface AU

## Project Overview

**Feed Need by Beneath the Surface AU** -- a Progressive Web App (PWA) that helps people find free meals in the Perth metropolitan area (Western Australia).

**Organisation:** [Beneath the Surface AU](https://beneaththesurface.au)

**Target audience:** People experiencing food insecurity, homelessness, or financial hardship.

**Core features:**
1. **Map View** -- Interactive Perth metro map showing all free meal locations
2. **Suburb/Postcode Search** -- Browse and filter locations by suburb name or postcode
3. **Weekly Meal Planner** -- Create a weekly food plan based on location and available services

**Design principles:**
- Mobile-first (target audience uses phones, often at libraries or community centres)
- Accessible (WCAG 2.1 AA)
- Offline-capable (works without internet after first visit)
- Zero sign-up friction (no accounts required)
- Fast and lightweight

## Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 | TypeScript strict, Server Components by default |
| React | React + React DOM | 19.2.3 | |
| Styling | Tailwind CSS + shadcn/ui | 4.1.18 / 3.8.4 | Mobile-first, purple primary (#7C3AED), neutral base, tw-animate-css |
| Icons | lucide-react | 0.563.0 | Tree-shakeable SVG icon library |
| UI Primitives | radix-ui | 1.4.3 | Via shadcn/ui (button, card, dialog, input installed) |
| Mapping | Leaflet via react-leaflet | leaflet 1.9.4, react-leaflet 5.0.0, cluster 4.0.0 | Free OSM tiles, no API key needed |
| Database | Supabase (PostgreSQL + PostGIS) | supabase-js 2.95.3, ssr 0.8.0 | Geospatial queries, free tier, managed via dashboard |
| Client State | Zustand | 5.0.11 | Planner persistence via localStorage |
| PWA | Serwist | 9.5.5 | @serwist/next + serwist, service worker, offline caching |
| Offline DB | idb | 8.0.3 | Promise-based IndexedDB wrapper for location caching |
| E2E Testing | Playwright | 1.58.2 | Chromium, smoke tests for all pages |
| Package Manager | pnpm | 10.28.2 | |
| TypeScript | TypeScript | 5.9.3 | Strict mode enabled |
| Deployment | Vercel | | |

## Project Structure

Files marked with `*` exist as stubs (placeholder content).

```
feed-need/
├── public/
│   ├── icons/
│   │   ├── icon-192.png          # PWA icon 192x192 (green circle with "FN")
│   │   └── icon-512.png          # PWA icon 512x512 (green circle with "FN")
│   ├── apple-touch-icon.png      # Apple touch icon 180x180
│   ├── favicon.png               # Favicon 32x32
│   └── manifest.json             # PWA manifest (3 icon entries incl. maskable)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Geist font, Header, BottomNav, OfflineBanner, skip-to-content)
│   │   ├── page.tsx              # Home page (3 feature cards linking to Map/Search/Planner)
│   │   ├── globals.css           # Tailwind imports + shadcn/ui CSS variables (neutral theme)
│   │   ├── sw.ts                 # Serwist service worker (precache + tile caching)
│   │   ├── map/
│   │   │   └── page.tsx          # Map page (useLocations, useGeolocation, DynamicMap, locate button)
│   │   ├── search/
│   │   │   └── page.tsx          # Search page (SearchBar + FilterBar + LocationList)
│   │   ├── planner/
│   │   │   └── page.tsx          # Planner page (hydration-safe, WeekGrid + PlannerSummary)
│   │   ├── location/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Server page (async params) -> LocationDetail client component
│   │   ├── about/
│   │   │   └── page.tsx          # About page (data warning, how-to, emergency contacts, privacy, credits)
│   │   └── api/
│   │       ├── locations/
│   │       │   └── route.ts      * GET locations stub
│   │       └── suburbs/
│   │           └── route.ts      * GET suburbs stub
│   ├── components/
│   │   ├── ui/                   # shadcn/ui: button, card, dialog, input
│   │   ├── map/
│   │   │   ├── MapView.tsx       # Main map (MapContainer + TileLayer + clustered markers + popups)
│   │   │   ├── DynamicMap.tsx    # next/dynamic wrapper (ssr: false) for MapView
│   │   │   ├── MapLegend.tsx     # Collapsible floating legend overlay
│   │   │   └── marker-icons.ts   # DivIcon factories (pin SVG), cluster icons, re-exports location-status
│   │   ├── search/
│   │   │   ├── SearchBar.tsx     # Combobox autocomplete (useSuburbs, keyboard nav, ARIA)
│   │   │   ├── FilterBar.tsx     # Day/meal type selects + "Open now" toggle + clear button
│   │   │   └── LocationList.tsx  # Renders LocationCard list with loading/empty/error states
│   │   ├── planner/
│   │   │   ├── WeekGrid.tsx      # Day tabs (mobile) / 7-column grid (desktop)
│   │   │   ├── MealSlot.tsx      # Breakfast/lunch/dinner slot with entries + add button
│   │   │   ├── AddMealDialog.tsx  # Dialog: search locations, conflict warnings, add to plan
│   │   │   └── PlannerSummary.tsx # Stats (meals/days/locations), Google Maps directions per day
│   │   ├── location/
│   │   │   ├── LocationCard.tsx  # Card with name, org, address, status, directions link
│   │   │   └── LocationDetail.tsx # Full detail view (schedule table, contact, eligibility, CTA)
│   │   └── layout/
│   │       ├── BottomNav.tsx     # Mobile bottom tab bar (4 tabs, lucide icons)
│   │       ├── Header.tsx        # Desktop top nav bar + mobile app title + ThemeToggle
│   │       ├── ThemeToggle.tsx   # Dark/light mode toggle (localStorage + system preference)
│   │       └── OfflineBanner.tsx  # Yellow banner on offline detection
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # createBrowserClient<Database> (uses @supabase/ssr)
│   │   │   ├── server.ts         # createServerClient<Database> with cookie handling
│   │   │   └── types.ts          # Manual Database type (Row/Insert/Update for all 3 tables)
│   │   ├── cache/
│   │   │   └── locations.ts      # IndexedDB cache: cacheLocations, getCachedLocations (idb library)
│   │   ├── stores/
│   │   │   └── planner.ts        # Zustand store: addEntry, removeEntry, clearDay, clearAll (persist middleware)
│   │   ├── utils/
│   │   │   ├── geo.ts            # distanceKm (Haversine), sortByDistance, formatDistance
│   │   │   ├── date.ts           # getCurrentDay, getCurrentTime, isTimeBetween, formatTime, formatDay
│   │   │   ├── format.ts         # formatAddress, getDirectionsUrl, formatMealType
│   │   │   ├── location-status.ts # getMarkerStatus, getTodaySchedules (no Leaflet dependency)
│   │   │   └── constants.ts      # PERTH_CENTRE, DEFAULT_MAP_ZOOM, PERTH_METRO_BOUNDS, DAYS_OF_WEEK, MEAL_TYPES
│   │   ├── hooks/
│   │   │   ├── useLocations.ts   # Fetch + filter by suburb/postcode/day/mealType, client-side schedule filtering
│   │   │   ├── useSuburbs.ts     # Debounced (300ms) suburb/postcode search, offline fallback to static array
│   │   │   ├── useGeolocation.ts # navigator.geolocation wrapper (10s timeout, 5min cache)
│   │   │   └── useOnlineStatus.ts # navigator.onLine + event listeners
│   │   ├── data/
│   │   │   └── perth-suburbs.ts  # Static array of 409 Perth metro suburbs (offline fallback)
│   │   └── utils.ts              # shadcn/ui cn() utility (clsx + tailwind-merge)
│   └── types/
│       ├── location.ts           # MealLocation, OperatingSchedule, MealType, DayOfWeek
│       ├── planner.ts            # PlannerEntry, WeekPlan, MealSlotType
│       └── suburb.ts             # Suburb interface
├── supabase/
│   └── migrations/
│       ├── 001_create_locations.sql  # locations + operating_schedules + PostGIS + triggers + indexes
│       ├── 002_create_suburbs.sql    # suburbs table + indexes
│       ├── 003_seed_suburbs.sql      # 409 Perth metro suburbs (postcodes 6000-6199)
│       └── 004_seed_locations.sql    # 25 free meal locations + operating schedules
├── e2e/
│   └── smoke.spec.ts             # Playwright smoke tests (home, map, planner, dark mode, search)
├── .env.local.example            # Template for Supabase credentials
├── .gitignore                    # Includes .env* exclusion, !.env.local.example exception
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── playwright.config.ts          # Playwright test config (chromium, localhost:3000)
├── components.json               # shadcn/ui configuration
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── CLAUDE.md
```

## Key Commands

```bash
pnpm dev                          # Start development server
pnpm build                        # Production build (SLOW on OneDrive path)
pnpm lint                         # Run ESLint (SLOW on OneDrive path)
pnpm type-check                   # Run TypeScript compiler check (SLOW on OneDrive path)
supabase start                    # Start local Supabase (Docker required)
supabase db push                  # Push migrations to Supabase
supabase gen types typescript     # Generate TypeScript types from schema
```

### Dev Environment Notes

- **OneDrive path causes very slow I/O** for build/lint/type-check. For fast type checking, copy `src/`, config files (`tsconfig.json`, `package.json`, `next.config.ts`, `components.json`, `next-env.d.ts`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) to `/private/tmp/claude-501/feed-need-check`, run `pnpm install` there (pulls from local store in ~6s), then run `npx tsc --noEmit`. Do NOT symlink or copy `node_modules` from OneDrive -- it's too slow.
- **macOS zsh** (not bash): `shopt` doesn't exist. Use `{.,}*` glob for dotfiles.
- **`curl` is aliased to `http` (httpie)**: Use `/usr/bin/curl` for actual curl.
- **Variable quoting is critical**: OneDrive path has spaces. Always double-quote: `"$PROJ"`.

## Architecture Decisions

### Layout (Phase 1 -- implemented)
- **Font**: Geist Sans via `next/font/google`, set as `--font-geist-sans` CSS variable
- **Brand colours**: Purple `#7C3AED` (primary, from Beneath the Surface AU logo) + Cyan `#06B6D4` (accent). Theme colour `#7C3AED` in PWA manifest and viewport meta
- **shadcn/ui theme**: Primary set to `oklch(0.541 0.267 293.009)` (light) / `oklch(0.65 0.25 293.009)` (dark). Neutral base for backgrounds/cards/borders. Ring colour matches primary
- **Root layout order**: skip-to-content > OfflineBanner > Header > main (with `pb-16 md:pb-0` for bottom nav) > BottomNav
- **Height model**: `min-h-dvh` on wrapper (dynamic viewport height for mobile browsers)
- **Metadata template**: `"%s | Feed Need"` with default `"Feed Need by Beneath the Surface AU"`
- **Apple Web App**: `capable: true`, `statusBarStyle: "default"`

### Navigation (Phase 1 -- implemented)
- **Mobile (< md)**: Fixed bottom tab bar (`BottomNav.tsx`), 4 tabs: Map, Search, Planner, About
  - Uses `usePathname()` for active state via `pathname.startsWith(href)`
  - Icons from lucide-react (Map, Search, CalendarDays, Info)
  - 44px min touch targets, `aria-current="page"` on active, `aria-label` on all links
- **Desktop (>= md)**: Top navigation bar in `Header.tsx` with "Feed Need" brand link + same 4 tabs
  - Active tab gets `bg-primary/10 text-primary` treatment
  - Bottom nav hidden via `md:hidden`, top nav hidden via `hidden md:block`

### Home Page (Phase 1 -- implemented)
- Three feature cards (Map, Search, Weekly Planner) using shadcn Card component
- Cards link to `/map`, `/search`, `/planner` respectively
- Grid layout: single column on mobile, 3 columns on `sm:` breakpoint

### Map Rendering (Phase 3 -- implemented)
- **Dynamic import**: `MapView` loaded via `next/dynamic` with `ssr: false` in `DynamicMap.tsx`. Leaflet CSS imported inside the client-only `MapView.tsx` via `import "leaflet/dist/leaflet.css"`
- **react-leaflet 5.0.0**: Compatible with React 19. Uses `MapContainer`, `TileLayer`, `Marker`, `Popup`, `useMap` hooks
- **Marker clustering**: `react-leaflet-cluster` 4.0.0 with custom `iconCreateFunction` -- purple brand circles (`rgba(124,58,237,0.85)`) with count, no external CSS needed. Uses `chunkedLoading` for performance
- **Tile layer**: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`), free, no API key
- **Centre/zoom**: Perth metro at `-31.9505, 115.8605`, zoom `11` (from `PERTH_CENTRE` / `DEFAULT_MAP_ZOOM` constants)
- **Marker icons**: Custom SVG pin shapes via `L.divIcon` (no image files). Three status colours:
  - **Green** (`#16a34a`): Currently serving (schedule matches today + current time is within start/end)
  - **Blue** (`#2563eb`): Has a schedule today but not currently within service hours
  - **Grey** (`#6b7280`): No schedule today
- **Status logic**: `getMarkerStatus()` in `location-status.ts` (no Leaflet dependency) uses `getCurrentDay()` + `getCurrentTime()` + `isTimeBetween()` to determine marker colour at render time. `marker-icons.ts` re-exports these for map components
- **Popups**: Show location name, organisation, address, today's schedule with meal type and times, status indicator (dot + text), "Details" link to `/location/[id]`, "Directions" link to Google Maps
- **User location**: Blue dot marker (`#3b82f6`) with white border and shadow ring. `FlyToLocation` effect component uses `map.flyTo(position, 14)` when user location changes
- **Locate button**: Floating top-right overlay (outside MapContainer). Uses `useGeolocation` hook. Shows spinner while loading, tooltip shows error if geolocation fails
- **Legend**: Floating bottom-left overlay, collapsible via toggle button. Shows all 4 marker types (green/blue/grey/user). Uses `aria-expanded` for accessibility
- **Loading state**: `Loader2` spinner centred in the map area while locations load from Supabase
- **Error state**: Destructive alert with `AlertCircle` icon and `role="alert"`
- **Map page**: Client component (`"use client"`) -- uses `useLocations()` for data and `useGeolocation()` for user position. Map fills `flex-1` of the main content area

### Search & Filter (Phase 4 -- implemented)
- **Search page**: Client component at `/search`. Shows all locations on initial load (no search required). Layout: SearchBar > FilterBar > LocationList, all within `max-w-2xl` container
- **SearchBar** (`search/SearchBar.tsx`): Combobox autocomplete using `useSuburbs` hook with 300ms debounce. Full ARIA combobox pattern: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"` on dropdown, `role="option"` on items. Keyboard navigation (ArrowDown/Up, Enter, Escape). Click-outside-to-close. Shows `"Suburb (postcode)"` format. Clear button resets search
- **Suburb selection**: When user selects a suburb, only the suburb name is passed as a filter (not postcode). The `useLocations` hook uses `ilike("suburb", "%name%")` which provides useful fuzzy matching (e.g. "Perth" matches Perth, East Perth, North Perth)
- **FilterBar** (`search/FilterBar.tsx`): Native `<select>` elements for day-of-week and meal type (better mobile UX than Radix Select). "Open now" toggle button with `aria-pressed`. Clear all button shown when any filter is active
- **"Open now" filter**: Applied client-side via `getMarkerStatus(loc) === "serving"` after `useLocations` returns results. Uses `useMemo` to avoid recomputation
- **LocationList** (`search/LocationList.tsx`): Shows result count, loading spinner, error state, or empty state ("No locations found"). Wraps `LocationCard` components in `role="list"` / `role="listitem"` for accessibility
- **LocationCard** (`location/LocationCard.tsx`): Links to `/location/[id]`. Shows name, organisation, address (with MapPin icon), status indicator (same green/blue/grey pattern as map markers), today's schedule summary, wheelchair accessible text, and Directions link (with `e.stopPropagation()` to prevent navigation). Uses `location-status.ts` (not `marker-icons.ts`) to avoid Leaflet dependency
- **Location detail page** (`/location/[id]`): Server component passes `id` to `LocationDetail` client component. Exports static metadata `{ title: "Location Details" }`. `LocationDetail` fetches single location from Supabase via `createClient()` with `.single()` query. Displays: status badge (pill), address/phone/website with icons, description, wheelchair/referral badges, eligibility criteria, full schedule grouped by day (using `DAYS_OF_WEEK` order), notes, and full-width "Get directions" CTA button
- **Refactoring**: Extracted `getMarkerStatus()` and `getTodaySchedules()` from `marker-icons.ts` into `location-status.ts` (no Leaflet dependency). `marker-icons.ts` re-exports these for backward compatibility with map components. Search/location components import from `location-status.ts` directly

### Weekly Planner (Phase 5 -- implemented)
- **Zustand store** (`lib/stores/planner.ts`): `usePlannerStore` with `persist` middleware. Stores `WeekPlan` (array of `PlannerEntry`). Actions: `addEntry`, `removeEntry`, `updateEntryNotes`, `clearDay`, `clearAll`. Each entry gets `crypto.randomUUID()` as ID. `updated_at` timestamp maintained on every mutation
- **Hydration**: Store uses `skipHydration: true` to prevent SSR/client mismatch. Planner page calls `usePlannerStore.persist.rehydrate()` in `useEffect`, shows "Loading your plan..." until hydrated. This prevents React hydration errors from localStorage data
- **localStorage key**: `"feed-need-planner"` -- stores serialised `WeekPlan` object
- **WeekGrid** (`planner/WeekGrid.tsx`): Mobile (< `lg`): horizontal scrollable day tabs (`role="tablist"`) with single-day panel below. Desktop (`lg`+): full 7-column grid showing all days. Default selected day is today via `getCurrentDay()`
- **MealSlot** (`planner/MealSlot.tsx`): Shows 3 slots per day (breakfast, lunch, dinner). Empty state shows dashed "Add meal" button. Filled state shows entry cards with location name, suburb, times, notes, and remove button. Each slot manages its own `AddMealDialog` open state
- **AddMealDialog** (`planner/AddMealDialog.tsx`): Two-step flow: (1) Browse/search locations from Supabase (client-side text filter on name/suburb/organisation), (2) Confirm selection with optional notes. Fetches all locations via `useLocations()` hook (25 locations, client-side filter is fine). Location list shows conflict warning icon (yellow triangle) for schedule mismatches
- **Conflict detection**: `getScheduleWarning()` checks if selected location has active schedules for the target day and meal type. Three levels: no schedules for that day ("doesn't operate on X"), has day schedules but not for that meal type ("doesn't serve X on Y"), or exact match (no warning). Warning shown as yellow banner with `AlertTriangle` icon
- **Schedule inference**: `getBestSchedule()` finds the best start/end times for a planner entry. Priority: exact day+meal match > any schedule on that day > any schedule for that meal type > fallback defaults (breakfast 7-9, lunch 11:30-1:30, dinner 5-7)
- **PlannerSummary** (`planner/PlannerSummary.tsx`): Shows total meals, days with meals, unique locations. Per-day Google Maps directions links (with waypoints for multi-stop). Entries sorted by slot order (breakfast > lunch > dinner) for routing. "Clear all" button with destructive styling. Hidden when no entries
- **Google Maps directions**: Single destination for 1 location; origin/destination/waypoints for 2+ locations. All addresses include ", WA" suffix. Uses `encodeURIComponent` for URL safety
- **Multiple entries per slot**: Users can add multiple locations to the same meal slot (e.g. two lunch options). Each entry has its own remove button
- **Data denormalization**: `PlannerEntry` stores `location_name`, `location_address`, `location_suburb` directly (not just `location_id`) so planner works fully offline without Supabase lookups

### Data Flow (Phase 2 -- implemented)
- **Supabase browser client**: `createBrowserClient<Database>` via `@supabase/ssr` in `src/lib/supabase/client.ts`
- **Supabase server client**: `createServerClient<Database>` with cookie handling in `src/lib/supabase/server.ts`
- **Database types**: Manual `Database` interface in `src/lib/supabase/types.ts` with `Row`, `Insert`, `Update` types for all 3 tables, plus convenience aliases (`LocationRow`, `ScheduleRow`, `SuburbRow`)
- **useLocations hook**: Fetches from Supabase with `is_active = true`, supports suburb/postcode/day/mealType filters. Day and meal type filtering done client-side (post-join filter on `operating_schedules`)
- **useSuburbs hook**: 300ms debounced search. Tries Supabase first (`ilike` for names, `like` for postcodes), falls back to static `PERTH_SUBURBS` array on error/offline. Supports both suburb names and postcodes (detects via `/^\d+$/` regex)
- All location queries MUST filter by `is_active = true`
- The weekly planner is entirely client-side (Zustand + localStorage, no server persistence)

### PWA & Offline (Phase 6 -- implemented)
- **Service worker**: Serwist 9.5.5 via `@serwist/next` 9.5.5. `src/app/sw.ts` compiled to `public/sw.js` by webpack plugin
- **next.config.ts**: Wrapped with `withSerwistInit({ swSrc: "src/app/sw.ts", swDest: "public/sw.js", disable: dev, reloadOnOnline: true })`
- **Precaching**: App shell (pages, JS, CSS) automatically precached via `self.__SW_MANIFEST` injected by Serwist's webpack plugin
- **Runtime caching**: `defaultCache` from `@serwist/next/worker` handles Next.js pages/data/images/fonts. Custom rule added for OpenStreetMap tiles
- **Map tile caching**: `CacheFirst` strategy with `ExpirationPlugin` (max 2000 entries, 30-day expiry) for `[abc].tile.openstreetmap.org`. Tiles cached as user views them (not pre-downloaded). Regex matcher: `/^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i`
- **Location data caching**: `idb` 8.0.3 wraps IndexedDB for promise-based access. Two object stores: `locations` (keyed by `id`) and `meta` (stores `locations_cached_at` timestamp). Singleton DB connection via lazy `getDB()`
- **useLocations offline fallback**: On successful Supabase fetch (unfiltered), data is saved to IndexedDB via `cacheLocations()`. On fetch failure, falls back to `getCachedLocations()` with client-side filtering via `applyClientFilters()`. Returns `fromCache: boolean` flag so UI can indicate stale data
- **useSuburbs offline fallback**: Already implemented in Phase 2 -- falls back to static `PERTH_SUBURBS` array (409 suburbs bundled in JS)
- **Perth suburb data**: Bundled as a static TypeScript array of 409 suburbs in `src/lib/data/perth-suburbs.ts` for offline fallback
- **OfflineBanner**: Detects offline via `navigator.onLine` + event listeners, shows yellow alert banner (implemented in Phase 1)
- **Service worker disabled in dev**: `disable: process.env.NODE_ENV === "development"` prevents caching issues during development
- **Build artifacts gitignored**: `public/sw*` and `public/swe-worker*` added to `.gitignore`
- **tsconfig.json**: Added `"webworker"` to `lib` array, `"@serwist/next/typings"` to `types`, `"public/sw.js"` to `exclude`
- **Serwist constructor**: `skipWaiting: true`, `clientsClaim: true`, `navigationPreload: true` for immediate activation and fast navigation

### About Page (Phase 7 -- implemented)
- **Server component** with static metadata `{ title: "About" }`
- **Sections**: Data warning (yellow bordered box), How to use (Map/Search/Planner with icons), Emergency resources (Foodbank WA, Entrypoint Perth, Lifeline with `tel:` links), Privacy statement, Credits (Beneath the Surface AU link)
- **Emergency contacts**: Clickable phone links using `tel:` protocol for one-tap calling on mobile
- **Decorative icons**: All lucide icons marked `aria-hidden="true"`
- **Content level**: Plain English, Grade 6 reading level, no jargon

### Accessibility Fixes (Phase 7 -- implemented)
- **Skip-to-content link**: Added `<a href="#main-content">Skip to main content</a>` in root layout with `sr-only focus:not-sr-only` pattern. `<main>` has `id="main-content"`
- **AddMealDialog**: Replaced incorrect `role="listbox"` / `role="option"` / `aria-selected={false}` with `role="list"` / `role="listitem"`. Added `role="alert"` on warning banner, `aria-hidden` on AlertTriangle icons, `sr-only` conflict text
- **PlannerSummary**: Added descriptive `aria-label` on direction links (e.g. "Get directions for Monday (2 meals) - opens Google Maps"), `aria-hidden` on ExternalLink icons
- **MealSlot touch targets**: `icon-xs` buttons (24px visual) given `-m-2 p-2` for ~40px touch area, `aria-hidden` on decorative MapPin
- **Map marker accessible names** (axe `aria-command-name`): Leaflet `divIcon` markers get `role="button"` but Leaflet's `alt` prop doesn't set `aria-label` on `divIcon` wrappers. Fix: each `<Marker>` uses `eventHandlers.add` to call `el.setAttribute("aria-label", location.name)` on the wrapper div. Cluster markers labeled via `ClusterAccessibility` component with `MutationObserver` that detects cluster count text and sets `aria-label` (e.g. "Cluster of 10 locations")
- **Heading order** (axe `heading-order`): LocationCard used `<h3>` but search page only has `<h1>`, skipping `<h2>`. Changed LocationCard heading from `<h3>` to `<h2>`

### Dark Mode (Phase 7 -- implemented)
- **ThemeToggle** (`layout/ThemeToggle.tsx`): Client component with sun/moon icons (lucide-react). Reads `localStorage.getItem("theme")` on mount, falls back to `window.matchMedia("(prefers-color-scheme: dark)")` system preference. Toggles `.dark` class on `document.documentElement`. Persists choice to localStorage as `"dark"` or `"light"`. Renders 10x10 placeholder until mounted to prevent layout shift
- **FOUC prevention**: Inline `<script>` in `layout.tsx` `<head>` applies `.dark` class before React hydrates. Reads localStorage/system preference synchronously. `suppressHydrationWarning` on `<html>` prevents React warnings from class mismatch
- **Header placement**: ThemeToggle appears in the right side of the Header bar, visible on both mobile and desktop
- **CSS variables**: Full light and dark variable sets already exist in `globals.css` (set up by shadcn/ui). `.dark` class activates dark oklch values for all semantic tokens (background, foreground, card, primary, muted, border, etc.)

### Bug Fixes (Phase 7 -- implemented)
- **Zustand 5 + React 19 infinite loop**: Selectors returning derived values (e.g. `.filter()`) create new references on every render, causing `useSyncExternalStore` to infinite loop. `useShallow` from `zustand/react/shallow` does NOT fix this reliably. Fix: select stable references (e.g. `s.plan.entries`) and use `useMemo` for derived filtering in the component. Applied to `MealSlot.tsx` and `PlannerSummary.tsx`
- **Leaflet blank map in flex layout**: `MapContainer` with percentage-based dimensions renders at 0 height inside flexbox parents using `min-h-dvh`. Fix: wrap `MapContainer` in `<div className="absolute inset-0">`, use `style={{ height: "100%", width: "100%" }}` on MapContainer (inline style, not Tailwind class), and add `InvalidateSize` child component that calls `map.invalidateSize()` in a `setTimeout(0)` useEffect to handle dynamic import timing
- **OneDrive + Turbopack HMR stale cache**: File changes on OneDrive path may not be picked up by Turbopack HMR. Fix: `rm -rf .next` and restart dev server after code changes if behaviour doesn't match code

### Geolocation (Phase 2 -- implemented)
- **useGeolocation hook**: Wraps `navigator.geolocation.getCurrentPosition`
- Settings: `enableHighAccuracy: false`, `timeout: 10000`, `maximumAge: 300000` (5 min cache)
- Returns `{ latitude, longitude, error, loading, requestLocation }`

### Utility Functions (Phase 2 -- implemented)
- **geo.ts**: Haversine formula (`distanceKm`), `sortByDistance` (adds `distance` field, sorts ascending), `formatDistance` (e.g. "800m", "2.3km")
- **date.ts**: `getCurrentDay` (maps JS `Date.getDay()` to our `DayOfWeek` enum), `getCurrentTime` (HH:mm), `isTimeBetween`, `formatTime` (12-hour: "7am", "12:30pm"), `formatDay`/`formatDayShort`
- **format.ts**: `formatAddress` ("street, suburb WA postcode"), `getDirectionsUrl` (Google Maps), `formatMealType` ("food_parcel" -> "Food Parcel")
- **constants.ts**: `PERTH_CENTRE`, `DEFAULT_MAP_ZOOM` (11), `PERTH_METRO_BOUNDS`, `DAYS_OF_WEEK`, `MEAL_TYPES`, `MEAL_SLOT_TYPES`

## Database Schema

### Migrations (Phase 2 -- implemented)

4 migration files in `supabase/migrations/`:

**001_create_locations.sql**: Creates `meal_type` and `day_of_week` PostgreSQL enums, `locations` table, `operating_schedules` table, all indexes, PostGIS extension, `update_geom()` trigger (auto-computes `geom` from lat/lng), `update_updated_at()` trigger.

**002_create_suburbs.sql**: Creates `suburbs` table with `UNIQUE(name, postcode)` constraint, indexes on `name` and `postcode`.

**003_seed_suburbs.sql**: 409 Perth metro suburbs (postcodes 6000-6199) sourced from Elkfox Australian Postcode Data (public domain). `ON CONFLICT DO NOTHING`.

**004_seed_locations.sql**: 25 real free meal locations with operating schedules. Each location inserted individually, schedules reference via `SELECT id FROM locations WHERE name = '...'`.

### locations
```sql
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organisation TEXT,
  description TEXT,
  street_address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  postcode TEXT NOT NULL,
  state TEXT DEFAULT 'WA',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  geom GEOGRAPHY(POINT, 4326),    -- PostGIS, auto-computed via trigger
  phone TEXT,
  email TEXT,
  website TEXT,
  eligibility_criteria TEXT,       -- "Anyone", "Referral required", etc.
  referral_required BOOLEAN DEFAULT false,
  wheelchair_accessible BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### operating_schedules
```sql
CREATE TABLE operating_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  day day_of_week NOT NULL,        -- enum: monday-sunday
  meal_type meal_type NOT NULL,    -- enum: breakfast, lunch, dinner, snack, food_parcel, pantry
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(location_id, day, meal_type, start_time)
);
```

### suburbs
```sql
CREATE TABLE suburbs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  postcode TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  lga TEXT,                        -- Local Government Area
  UNIQUE(name, postcode)
);
```

### Database Triggers
- `locations_geom_trigger`: BEFORE INSERT/UPDATE on `latitude`/`longitude` -> computes `geom` as `ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography`
- `locations_updated_at_trigger`: BEFORE UPDATE on `locations` -> sets `updated_at = now()`

### Key Indexes
- `locations(suburb)`, `locations(postcode)`, `locations(geom)` (GIST), `locations(is_active)` (partial, WHERE true)
- `operating_schedules(location_id)`, `operating_schedules(day)`, `operating_schedules(meal_type)`
- `suburbs(name)`, `suburbs(postcode)`

### Geospatial
- PostGIS extension enabled (`CREATE EXTENSION IF NOT EXISTS postgis`)
- Proximity search: `ST_DWithin(geom, ST_MakePoint(lng, lat), radius_meters)`

## Seed Data (Phase 2 -- implemented)

### 25 Seeded Meal Locations

Organisations represented: Salvation Army (4), Foodbank WA (3), Australian Red Cross (2), St Vincent de Paul Society (2), St Patrick's Community Support Centre, Uniting WA, Ruah Community Services, Seeds of Hope Perth, The Haven Centre (HavenWell), Midland Meals Inc, Grace Anglican Church, The Pantry WA, Anglicare WA, Mission Australia, OzHarvest, No Limits Perth, 55 Central.

Geographic coverage: Perth CBD/Northbridge, East Perth, Fremantle, Midland, Joondalup, Rockingham/Cooloongup, Armadale, Gosnells, East Victoria Park, Maylands, Osborne Park, North Perth, Wangara, Marangaroo, Merriwa, Mandurah/Greenfields.

Service types: Breakfast, lunch, dinner, food parcels, pantry services, mobile street outreach.

### 409 Seeded Suburbs

Perth metro postcodes 6000-6199. Source: Elkfox Australian Postcode Data (GitHub, public domain). Each suburb has: name, postcode, latitude, longitude.

## TypeScript Types

### Core types (src/types/location.ts)
```typescript
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'food_parcel' | 'pantry';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface MealLocation {
  id: string;
  name: string;
  organisation: string | null;
  description: string | null;
  street_address: string;
  suburb: string;
  postcode: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  eligibility_criteria: string | null;
  referral_required: boolean;
  wheelchair_accessible: boolean;
  is_active: boolean;
  last_verified_at: string | null;
  notes: string | null;
  operating_schedules: OperatingSchedule[];
}

interface OperatingSchedule {
  id: string;
  location_id: string;
  day: DayOfWeek;
  meal_type: MealType;
  start_time: string;  // "HH:mm"
  end_time: string;
  notes: string | null;
  is_active: boolean;
}
```

### Planner types (src/types/planner.ts)
```typescript
type MealSlotType = 'breakfast' | 'lunch' | 'dinner';

interface PlannerEntry {
  id: string;
  day: DayOfWeek;
  slot: MealSlotType;
  location_id: string;
  location_name: string;      // denormalized for offline
  location_address: string;
  location_suburb: string;
  start_time: string;
  end_time: string;
  notes: string;
}
```

### Database types (src/lib/supabase/types.ts)
```typescript
// Full Database interface with Row/Insert/Update for all 3 tables
// Convenience aliases: LocationRow, ScheduleRow, SuburbRow
// Re-exports domain types: MealLocation, OperatingSchedule, MealType, DayOfWeek, Suburb
```

## Styling Conventions

- Mobile-first: design for **320px** width, then add `sm:`, `md:`, `lg:` breakpoints
- Use Tailwind utility classes; avoid custom CSS files
- Minimum touch target: **44x44px** (use `p-3` or larger on interactive elements)
- Minimum font size: **16px** (`text-base`); never use `text-xs` for body content
- High contrast: maintain **4.5:1** contrast ratio minimum
- shadcn/ui for all UI primitives (buttons, cards, dialogs, selects)
- **shadcn/ui theme**: Purple primary (`#7C3AED`) with neutral base, uses `oklch` colour values in CSS variables. Brand colours from Beneath the Surface AU logo
- **Dark mode**: Configured via `.dark` class variant (`@custom-variant dark (&:is(.dark *))`)
- **CSS structure**: `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"` in `globals.css`

## Code Conventions

- TypeScript strict mode
- Prefer named exports over default exports
- Use `'use client'` directive ONLY when component needs browser APIs or client state
- Server Components are the default
- Absolute imports with `@/` alias (e.g., `@/components/ui/button`)
- Wrap Supabase calls in try/catch, show user-friendly error messages
- All text content: plain English, **Grade 6 reading level**, no jargon
- Next.js 16 async params: `params: Promise<{ id: string }>` with `await params` in page components

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- All interactive elements keyboard-accessible
- Screen reader support with proper ARIA labels on every interactive element
- `aria-current="page"` on active navigation links
- `aria-hidden="true"` on decorative icons
- `role="alert"` on the offline banner
- The `/search` list view is the accessible alternative to the map
- Font size scalable; respect user preferences
- High contrast mode support

## Data Sources

### Perth Suburbs (implemented)
- Source: [Elkfox Australian Postcode Data](https://github.com/Elkfox/Australian-Postcode-Data) (public domain)
- Filtered to WA postcodes 6000-6199 (Perth metro), yielding **409 suburbs**
- Fields: suburb name, postcode, latitude, longitude
- Stored in both SQL (`003_seed_suburbs.sql`) and static TypeScript (`perth-suburbs.ts`)

### Meal Locations (implemented -- 25 locations seeded)
- Sources used for initial seed data:
  - [St Patrick's Community Support Centre](https://stpats.com.au)
  - [Uniting WA (Tranby Hub)](https://unitingwa.org.au)
  - [Salvation Army WA](https://www.salvationarmy.org.au)
  - [Australian Red Cross Soup Patrol](https://www.redcross.org.au)
  - [Seeds of Hope Perth](https://www.seedsofhopeservices.com)
  - [Ruah Community Services](https://ruah.org.au)
  - [St Vincent de Paul Society WA / Passages](https://passages.org.au)
  - [Foodbank WA](https://www.foodbank.org.au/wa)
  - [OzHarvest Perth](https://www.ozharvest.org/perth)
  - [Midland Meals Inc](https://www.midlandmealsinc.com.au)
  - [HavenWell](https://havenwellwebsite.wixsite.com/my-site-1)
  - [Grace Anglican Church Joondalup](https://www.joondalup.perth.anglican.org)
  - [The Pantry WA](https://thepantrywa.com.au)
  - [Anglicare WA](https://www.anglicarewa.org.au)
  - [Mission Australia](https://www.missionaustralia.com.au)
  - [No Limits Perth](https://www.nolimitsperth.org.au)
  - [55 Central](https://55central.asn.au)
- Data managed via Supabase dashboard (no custom admin UI)
- `last_verified_at` field tracks data freshness; flag entries not verified in 90+ days

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL (safe for client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anonymous key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=        # Server-only -- NEVER expose to client
```

Template file: `.env.local.example`

## Build Phases

### Phase 1 -- Foundation (COMPLETED)
- Initialised Next.js 16.1.6 with TypeScript 5.9.3, Tailwind CSS 4.1.18, pnpm 10.28.2
- Installed shadcn/ui 3.8.4 with neutral theme, default style (no `--style` flag in v3.8+)
- Installed shadcn components: button, card, dialog, input
- Created all page stubs: `/`, `/map`, `/search`, `/planner`, `/location/[id]`, `/about`
- Created API route stubs: `/api/locations`, `/api/suburbs`
- Built root layout with Geist Sans font, metadata, viewport, PWA manifest link
- Built `BottomNav` (mobile, 4 tabs with lucide icons, 44px touch targets, aria attributes)
- Built `Header` (desktop top nav with brand link + 4 nav tabs)
- Built `OfflineBanner` (yellow alert banner on `navigator.onLine` change)
- Built home page with 3 feature cards (Map, Search, Weekly Planner)
- Created type definitions: `MealLocation`, `OperatingSchedule`, `PlannerEntry`, `Suburb`
- Created constants: Perth coordinates, map zoom, day/meal enums
- Created PWA manifest (`public/manifest.json`)
- React Compiler: declined (not yet stable)

### Phase 2 -- Data Layer (COMPLETED)
- Created 4 SQL migrations: schema (locations + schedules + suburbs), suburb seed (409), location seed (25)
- PostGIS extension enabled, auto-geom trigger, auto-updated_at trigger
- Installed @supabase/supabase-js 2.95.3 and @supabase/ssr 0.8.0
- Created Supabase browser client (`createBrowserClient<Database>`)
- Created Supabase server client (`createServerClient<Database>` with Next.js cookie handling)
- Created manual `Database` type interface with Row/Insert/Update for all tables
- Created `.env.local.example` template, added `!.env.local.example` exception to `.gitignore`
- Built static suburb data: 409 Perth metro suburbs as TypeScript array (offline fallback)
- Built `useLocations` hook: Supabase query with suburb/postcode/day/mealType filters
- Built `useSuburbs` hook: debounced search (300ms), Supabase-first with static fallback
- Built `useGeolocation` hook: browser geolocation wrapper
- Built `useOnlineStatus` hook: online/offline detection
- Built utility functions: Haversine distance, time formatting, address formatting, Google Maps directions URL
- Seeded 25 real Perth free meal locations from 17 different organisations
- TypeScript type-check passes cleanly

### Phase 3 -- Map View (COMPLETED)
- Installed leaflet 1.9.4, react-leaflet 5.0.0, react-leaflet-cluster 4.0.0, @types/leaflet 1.9.21
- Built `MapView` with `MapContainer`, `TileLayer`, clustered `Marker` components, and `Popup` with location details
- Built `DynamicMap` wrapper using `next/dynamic` with `ssr: false` and loading spinner
- Built `marker-icons.ts` with custom SVG pin `DivIcon` factories (green/blue/grey), user location dot, cluster circle icons, and `getMarkerStatus()` logic
- Built `MapLegend` collapsible overlay (green=serving now, blue=open today, grey=closed, blue dot=you)
- Built map page with `useLocations` data fetching, `useGeolocation` for locate-me button, loading/error states
- Marker popups show: name, organisation, address, today's schedule, status, Details link, Directions link
- `FlyToLocation` effect component flies map to user position (zoom 14) when geolocation completes
- TypeScript type-check passes cleanly

### Phase 4 -- Search and Filter (COMPLETED)
- Extracted `location-status.ts` from `marker-icons.ts` to avoid Leaflet dependency in search components
- Built `SearchBar` with combobox autocomplete (useSuburbs, keyboard nav, ARIA pattern, click-outside-close)
- Built `FilterBar` with native `<select>` for day/meal type, "Open now" toggle (`aria-pressed`), clear button
- Built `LocationCard` with status indicators, address, schedule summary, directions link
- Built `LocationList` with result count, loading/error/empty states, list semantics
- Built `/search` page wiring all components: SearchBar > FilterBar > LocationList, `useMemo` filters, suburb-only filtering via `ilike`
- Built `LocationDetail` client component: single-location Supabase fetch, full schedule by day, contact info, badges, "Get directions" CTA
- Updated `/location/[id]` page: server component passes ID to LocationDetail, static metadata
- "Open now" filtering done client-side via `getMarkerStatus() === "serving"` (reuses map status logic)
- TypeScript type-check passes cleanly

### Phase 5 -- Weekly Planner (COMPLETED)
- Installed Zustand 5.0.11 with persist middleware (localStorage, skipHydration for SSR safety)
- Built `usePlannerStore` with CRUD actions: addEntry, removeEntry, updateEntryNotes, clearDay, clearAll
- Built `WeekGrid` with responsive layout: day tabs on mobile (< lg), 7-column grid on desktop (lg+)
- Built `MealSlot` component: empty dashed add button, filled entry cards with remove, per-slot AddMealDialog
- Built `AddMealDialog` with two-step flow: search/browse locations > confirm with notes. Client-side text search over all locations. Conflict warnings for schedule mismatches
- Built `PlannerSummary` with stats (meals/days/locations), per-day Google Maps directions links, clear all
- Updated `/planner` page with hydration-safe rendering (rehydrate in useEffect, loading state until hydrated)
- TypeScript type-check passes cleanly

### Phase 6 -- PWA and Offline (COMPLETED)
- Installed @serwist/next 9.5.5, serwist 9.5.5 (devDep), idb 8.0.3
- Created service worker (`src/app/sw.ts`) with Serwist precaching + defaultCache runtime caching
- Added CacheFirst strategy for OpenStreetMap tiles (2000 entries, 30-day expiry)
- Created IndexedDB caching layer (`src/lib/cache/locations.ts`) with `cacheLocations()` and `getCachedLocations()`
- Updated `useLocations` hook: caches unfiltered Supabase results to IndexedDB, falls back to cached data on network failure with client-side filtering
- Wrapped `next.config.ts` with `withSerwistInit` (disabled in dev mode)
- Updated `tsconfig.json` with webworker lib, Serwist typings, and SW build exclusion
- Updated `.gitignore` for Serwist build artifacts (`public/sw*`)
- TypeScript type-check passes cleanly

### Phase 7 -- Polish and Deploy (IN PROGRESS)
- Built `/about` page: data warning, how-to-use guide, emergency contacts (Foodbank WA, Entrypoint Perth, Lifeline with `tel:` links), privacy statement, credits section. Server component with static metadata
- Added skip-to-content link in root layout (`<a href="#main-content">`) with `sr-only` + `focus:not-sr-only` pattern, plus `id="main-content"` on `<main>`
- Fixed AddMealDialog ARIA: replaced incorrect `role="listbox"` / `role="option"` / `aria-selected` with `role="list"` / `role="listitem"`, added `role="alert"` on schedule warning banner, `aria-hidden` on decorative AlertTriangle icons, `sr-only` conflict text for screen readers
- Added `aria-label` to PlannerSummary direction links describing destination and Google Maps intent, `aria-hidden` on decorative ExternalLink icons
- Added touch target padding (`-m-2 p-2`) to MealSlot `icon-xs` buttons (visual 24px, touch target 40px+), `aria-hidden` on decorative MapPin icon
- Generated PWA icons via `scripts/generate-icons.mjs` (pure Node.js, no deps): 192x192, 512x512, 180x180 apple-touch-icon, 32x32 favicon. Green circle with white "FN" text
- Updated `manifest.json` with maskable icon entry alongside `any` purpose entries
- Added favicon and apple-touch-icon metadata to layout via `metadata.icons`
- Fixed map locate button: replaced hardcoded `bg-white`/`text-gray-700` with theme-aware `bg-background`/`text-foreground`
- Fixed Zustand 5 + React 19 infinite loop in MealSlot and PlannerSummary: replaced `useShallow` selectors with stable reference selection + `useMemo` filtering
- Fixed Leaflet blank map: added wrapper div with `absolute inset-0`, inline style dimensions, and `InvalidateSize` component for dynamic import timing
- Built dark mode toggle (`ThemeToggle.tsx`): localStorage persistence, system preference fallback, inline FOUC-prevention script, sun/moon icons in Header
- Installed Playwright 1.58.2 with Chromium for E2E testing
- Created 5 smoke tests: home page, map tiles, planner (no infinite loop), dark mode toggle, search locations
- Installed `@axe-core/playwright` 4.11.1 for automated WCAG accessibility auditing
- Created 6 accessibility tests in `e2e/accessibility.spec.ts`: axe-core scan of all 5 pages + dark mode, WCAG 2.1 AA + best-practice tags, zero violations asserted
- Fixed map marker accessible names: `eventHandlers.add` sets `aria-label` on individual marker wrappers, `ClusterAccessibility` MutationObserver labels cluster markers
- Fixed heading order: changed LocationCard `<h3>` to `<h2>` (search page has `<h1>`, was skipping to `<h3>`)
- All 11 Playwright tests passing (5 smoke + 6 accessibility)
- TypeScript type-check passes cleanly
- Remaining: Vercel deployment

## Important Constraints

- **No user authentication** -- no sign-up friction for vulnerable users
- **All features must work offline** after first visit
- **Never store personal data** -- planner is local-only
- **Bundle size under 200KB** (excluding map tiles)
- **Search must accept both suburb names AND postcodes**
- **All location queries must filter** `is_active = true`
- **Leaflet never imported at top level** of server-rendered modules

## Testing

### E2E Tests (implemented)
- **Playwright** 1.58.2 with Chromium browser
- Config: `playwright.config.ts` -- testDir `./e2e`, baseURL `http://localhost:3000`, reuses existing dev server
- **5 smoke tests** in `e2e/smoke.spec.ts`:
  1. Home page loads (h1 contains "Feed Need")
  2. Map page renders tiles (leaflet-container visible with non-zero dimensions, tiles loaded)
  3. Planner loads without infinite loop (h1 visible, Monday heading visible, no getSnapshot/MaxUpdateDepth errors)
  4. Dark mode toggle works (click toggles `.dark` class on html, click again removes it)
  5. Search page shows locations (role="list" visible, at least one listitem)
- Run: `npx playwright test --reporter=list`

### Accessibility Tests (implemented)
- **@axe-core/playwright** 4.11.1 for WCAG auditing
- **6 accessibility tests** in `e2e/accessibility.spec.ts`:
  1. Home page (/) -- zero WCAG violations
  2. Map page (/map) -- zero WCAG violations (5s wait for tile/marker load)
  3. Search page (/search) -- zero WCAG violations
  4. Planner page (/planner) -- zero WCAG violations (2s hydration wait)
  5. About page (/about) -- zero WCAG violations
  6. Dark mode (home page) -- zero WCAG violations after theme toggle
- Tags checked: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`
- All tests assert `expect(results.violations).toHaveLength(0)` -- will fail on regressions

### Planned
- Unit tests: Vitest
- Offline: simulate service worker in tests
- Target: all critical user flows covered (search, filter, plan a meal, view map)
