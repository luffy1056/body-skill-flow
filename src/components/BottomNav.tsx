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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-xl">
      <ul className="grid grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" strokeWidth={2.25} />
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