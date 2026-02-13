import type { Metadata } from "next";
import {
  Phone,
  Globe,
  ShieldCheck,
  MapPin,
  Search,
  CalendarDays,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold">About Feed Need</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        by{" "}
        <a
          href="https://beneaththesurface.au"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Beneath the Surface AU
        </a>
      </p>
      <p className="mt-3 text-muted-foreground">
        Feed Need helps you find free meals in the Perth metro area. Search by
        suburb, view locations on a map, and plan your week.
      </p>

      {/* Data warning */}
      <section className="mt-6 rounded-lg border border-yellow-500/50 bg-yellow-50 p-4 dark:bg-yellow-950/20">
        <h2 className="font-semibold">Check before you go</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Meal times and availability can change without notice. We recommend
          calling ahead to confirm. Information was last updated from public
          sources and may not be current.
        </p>
      </section>

      {/* How to use */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">How to use</h2>
        <ul className="mt-3 space-y-3">
          <li className="flex gap-3">
            <MapPin
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Map</p>
              <p className="text-sm text-muted-foreground">
                See all free meal locations on a map. Green pins are serving
                now, blue are open today, grey are closed.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Search
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Search</p>
              <p className="text-sm text-muted-foreground">
                Find locations by suburb name or postcode. Filter by day, meal
                type, or what is open right now.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <CalendarDays
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Weekly Planner</p>
              <p className="text-sm text-muted-foreground">
                Plan your meals for the week. Add locations to breakfast, lunch,
                and dinner slots, then get directions.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Emergency resources */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Need help now?</h2>
        <ul className="mt-3 space-y-3">
          <li className="flex gap-3">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Foodbank WA</p>
              <p className="text-sm text-muted-foreground">
                Food relief across Western Australia
              </p>
              <a
                href="tel:+61894828700"
                className="text-sm font-medium text-primary hover:underline"
              >
                (08) 9482 8700
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Entrypoint Perth</p>
              <p className="text-sm text-muted-foreground">
                Homelessness support, referrals, and services
              </p>
              <a
                href="tel:1800124684"
                className="text-sm font-medium text-primary hover:underline"
              >
                1800 124 684
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Lifeline</p>
              <p className="text-sm text-muted-foreground">
                24/7 crisis support and suicide prevention
              </p>
              <a
                href="tel:131114"
                className="text-sm font-medium text-primary hover:underline"
              >
                13 11 14
              </a>
            </div>
          </li>
        </ul>
      </section>

      {/* Privacy */}
      <section className="mt-6 flex gap-3">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-lg font-semibold">Your privacy</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Feed Need does not collect any personal information. Your weekly
            meal plan is saved only on your device and is never sent to a
            server. No sign-up or account is needed.
          </p>
        </div>
      </section>

      {/* Open source / credits */}
      <section className="mt-6 flex gap-3">
        <Globe
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-lg font-semibold">Credits</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://beneaththesurface.au"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Beneath the Surface AU
            </a>
            . Location data sourced from publicly available community service
            directories. Map tiles provided by OpenStreetMap contributors.
          </p>
        </div>
      </section>

      <p className="mt-8 pb-4 text-center text-xs text-muted-foreground">
        Feed Need is not affiliated with any listed organisation.
      </p>
    </div>
  );
}
