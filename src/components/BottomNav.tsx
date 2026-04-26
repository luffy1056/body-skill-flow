import { Link } from "@tanstack/react-router";
import { Home, Dumbbell, Flame, TrendingUp, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/skills", label: "Skills", icon: Flame, exact: false },
  { to: "/workouts", label: "Workouts", icon: Dumbbell, exact: false },
  { to: "/progress", label: "Progress", icon: TrendingUp, exact: false },
  { to: "/profile", label: "Profile", icon: User, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/90 backdrop-blur-xl md:max-w-2xl">
      <ul className="grid grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-muted-foreground transition-all duration-200
                data-[status=active]:text-primary
                data-[status=active]:bg-primary/10
                data-[status=active]:[&_.nav-dot]:scale-100
                data-[status=active]:[&_svg]:scale-110
                hover:text-foreground"
            >
              <span
                aria-hidden
                className="nav-dot absolute -top-[9px] h-1 w-8 origin-center scale-0 rounded-full bg-primary shadow-[0_0_10px_oklch(0.82_0.22_148/0.7)] transition-transform duration-300"
              />
              <Icon
                className="h-5 w-5 transition-transform duration-200"
                strokeWidth={2.25}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}