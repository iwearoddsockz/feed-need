import Link from "next/link";
import { Map, Search, CalendarDays, PlusCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    href: "/map",
    title: "Map",
    description: "See free meal locations on a map of Perth",
    icon: Map,
  },
  {
    href: "/search",
    title: "Search",
    description: "Find meals near you by suburb or postcode",
    icon: Search,
  },
  {
    href: "/planner",
    title: "Weekly Planner",
    description: "Plan your meals for the week ahead",
    icon: CalendarDays,
  },
  {
    href: "/submit",
    title: "Submit a Service",
    description: "Know a free meal location? Help us add it",
    icon: PlusCircle,
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Feed Need
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          by{" "}
          <a
            href="https://beneaththesurface.au"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            Beneath the Surface AU
          </a>
        </p>
        <p className="mt-3 text-lg text-muted-foreground">
          Find free meals in the Perth metro area
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader className="items-center text-center">
                <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
