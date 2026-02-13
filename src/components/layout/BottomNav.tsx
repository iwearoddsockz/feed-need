"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Map, Search, CalendarDays, Info } from "lucide-react";

const NAV_ITEMS = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/search", label: "Search", icon: Search },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/about", label: "About", icon: Info },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden"
      aria-label="Main navigation"
    >
      <ul className="flex h-16 items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
