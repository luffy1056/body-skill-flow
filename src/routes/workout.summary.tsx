import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Dumbbell, Flame, Repeat, Trophy } from "lucide-react";
import { z } from "zod";
import { getSkillBySlug } from "@/data/skills";

const searchSchema = z.object({
  slug: z.string(),
  level: z.number().int().min(1),
  sets: z.number().int().min(0),
  reps: z.number().int().min(0),
  seconds: z.number().int().min(0),
});

export const Route = createFileRoute("/workout/summary")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Workout Complete — SkillFlow" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SummaryPage,
});

const QUOTES = [
  "Discipline is choosing what you want most over what you want now.",
  "You don't grow when it's easy. You grow when it's hard.",
  "Strong is a habit. You just built it again.",
  "Today's reps are tomorrow's strength.",
  "Showing up is the hardest part. You did it.",
];

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec.toString().padStart(2, "0")}s`;
}

function SummaryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const skill = getSkillBySlug(search.slug);
  const quote = QUOTES[search.sets % QUOTES.length];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pb-8 pt-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 p-8 text-center shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 right-[-20%] h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Trophy className="h-10 w-10" strokeWidth={2.5} />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Workout Complete
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-foreground">
              Crushed it{skill ? `, ${skill.name}` : ""}
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
              "{quote}"
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatCard
            icon={<Dumbbell className="h-4 w-4" />}
            label="Sets"
            value={String(search.sets)}
          />
          <StatCard
            icon={<Repeat className="h-4 w-4" />}
            label={search.reps > 0 ? "Reps" : "Holds"}
            value={search.reps > 0 ? String(search.reps) : String(search.sets)}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={formatDuration(search.seconds)}
          />
        </div>

        {/* Streak chip */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Flame className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Streak extended
            </p>
            <p className="text-base font-bold text-foreground">13 days strong 🔥</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98]"
          >
            Log Workout
          </button>
          <Link
            to="/skills/$slug"
            params={{ slug: search.slug }}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-card text-sm font-bold text-foreground"
          >
            Back to Skill
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="mt-2 text-xl font-black text-foreground">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}