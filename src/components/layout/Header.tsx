"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Map, Search, CalendarDays, Info } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/search", label: "Search", icon: Search },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/about", label: "About", icon: Info },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Feed Need home">
          <span className="text-xl font-bold text-primary">Feed Need</span>
        </Link>

        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
