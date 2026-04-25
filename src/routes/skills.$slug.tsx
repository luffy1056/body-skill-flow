import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { getSkillBySlug } from "@/data/skills";

export const Route = createFileRoute("/skills/$slug")({
  loader: ({ params }) => {
    const skill = getSkillBySlug(params.slug);
    if (!skill || skill.locked) throw notFound();
    return { skill };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.skill.name ?? "Skill"} — SkillFlow` },
      {
        name: "description",
        content: `Progression levels for ${loaderData?.skill.name ?? "this skill"}.`,
      },
    ],
  }),
  component: SkillDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-black">Skill not found</h1>
        <Link to="/skills" className="mt-4 inline-block text-primary">
          Back to Skills
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="p-6 text-center">
        <p className="text-destructive">{error.message}</p>
        <button onClick={reset} className="mt-4 text-primary">
          Retry
        </button>
      </div>
    </AppShell>
  ),
});

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-primary/15 text-primary",
  Intermediate: "bg-amber-500/15 text-amber-400",
  Advanced: "bg-rose-500/15 text-rose-400",
};

function SkillDetailPage() {
  const { skill } = Route.useLoaderData();
  const total = skill.levels.length;
  const progressPct = Math.round((skill.currentLevel / total) * 100);

  return (
    <AppShell>
      {/* Header */}
      <header className="relative overflow-hidden px-6 pb-6 pt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-[-15%] h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <Link
          to="/skills"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-card-elevated"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="relative mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl">
            <span aria-hidden>{skill.emoji}</span>
          </div>
          <div className="min-w-0 flex-1">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                difficultyStyles[skill.difficulty]
              }`}
            >
              {skill.difficulty}
            </span>
            <h1 className="mt-1 text-2xl font-black leading-tight tracking-tight text-foreground">
              {skill.name}
            </h1>
          </div>
        </div>

        <div className="relative mt-5 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-muted-foreground">
              Level {skill.currentLevel} of {total}
            </span>
            <span className="tabular-nums text-primary">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="mt-2 h-2 bg-secondary" />
        </div>
      </header>

      {/* Stepper */}
      <section className="px-6 pb-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">Progression Path</h2>
        <ol className="relative">
          {skill.levels.map((level, i) => {
            const num = i + 1;
            const completed = level.completed;
            const isCurrent = num === skill.currentLevel;
            const isLocked = num > skill.currentLevel;
            const isLast = i === skill.levels.length - 1;

            return (
              <li key={level.name} className="relative flex gap-4 pb-5">
                {/* Connector line */}
                {!isLast && (
                  <span
                    aria-hidden
                    className={`absolute left-5 top-11 h-[calc(100%-2.75rem)] w-0.5 ${
                      completed ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
                    completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-card text-primary shadow-[var(--shadow-glow)]"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    num
                  )}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-2xl border p-4 transition-all ${
                    isCurrent
                      ? "border-primary/40 bg-card shadow-[var(--shadow-glow)]"
                      : isLocked
                        ? "border-border bg-card/50 opacity-60"
                        : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Level {num}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-foreground">
                        {level.name}
                      </h3>
                    </div>
                    {completed && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        Done
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Stat label="Sets" value={String(level.sets)} />
                    <Stat label="Reps" value={level.reps} />
                  </div>

                  {!isLocked && !completed && (
                    <Link
                      to="/workout"
                      search={{ slug: skill.slug, level: num }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-glow active:scale-[0.98]"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Level
                    </Link>
                  )}
                  {completed && (
                    <Link
                      to="/workout"
                      search={{ slug: skill.slug, level: num }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-bold text-foreground transition-colors hover:bg-card-elevated"
                    >
                      Repeat Level
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-lg bg-secondary/60 px-3 py-2 text-center">
      <p className="text-base font-black text-foreground">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}