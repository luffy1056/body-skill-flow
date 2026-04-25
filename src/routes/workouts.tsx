import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ChevronRight, Clock, Dumbbell, Play, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { freeSkills } from "@/data/skills";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workouts — SkillFlow" },
      {
        name: "description",
        content:
          "Your daily calisthenics workouts, weekly plan, and recent training history.",
      },
      { property: "og:title", content: "Workouts — SkillFlow" },
      {
        property: "og:description",
        content: "Plan, train, and review your calisthenics sessions.",
      },
    ],
  }),
  component: WorkoutsPage,
});

const weekPlan = [
  { day: "Mon", focus: "Pull", skill: "muscle-up", level: 5, label: "Muscle Up", done: true },
  { day: "Tue", focus: "Push", skill: "handstand-push-up", level: 2, label: "HSPU", done: true },
  { day: "Wed", focus: "Core", skill: "front-lever", level: 3, label: "Front Lever", done: true },
  { day: "Thu", focus: "Legs", skill: "pistol-squat", level: 5, label: "Pistol", done: false, today: true },
  { day: "Fri", focus: "Pull", skill: "back-lever", level: 4, label: "Back Lever", done: false },
  { day: "Sat", focus: "Static", skill: "planche", level: 2, label: "Planche", done: false },
  { day: "Sun", focus: "Rest", skill: null, level: null, label: "Rest", done: false },
];

const recentSessions = [
  { skill: "Front Lever", level: 3, sets: 4, duration: "18m", when: "Yesterday", emoji: "🦅" },
  { skill: "Handstand Push-Up", level: 2, sets: 3, duration: "14m", when: "2 days ago", emoji: "🙃" },
  { skill: "Muscle Up", level: 5, sets: 4, duration: "22m", when: "3 days ago", emoji: "💪" },
];

function WorkoutsPage() {
  const today = weekPlan.find((d) => d.today);
  const todaySkill = today?.skill ? freeSkills.find((s) => s.slug === today.skill) : undefined;

  return (
    <AppShell>
      {/* Header */}
      <header className="px-6 pb-6 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Training
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-foreground">
          Workouts
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your weekly plan and recent sessions.
        </p>
      </header>

      {/* Today's Session */}
      {today && todaySkill && (
        <section className="px-6">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Today's Session</h2>
          </div>
          <article
            className="relative overflow-hidden rounded-3xl border border-primary/30 p-6 shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {today.focus} Day
              </span>
              <h3 className="mt-3 text-2xl font-black text-foreground">
                {todaySkill.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Level {today.level} · {todaySkill.levels[today.level - 1]?.name}
              </p>
              <Link
                to="/workout"
                search={{ slug: todaySkill.slug, level: today.level }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary-glow active:scale-[0.98]"
              >
                <Play className="h-5 w-5 fill-current" />
                Start Today's Workout
              </Link>
            </div>
          </article>
        </section>
      )}

      {/* Weekly Plan */}
      <section className="px-6 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">This Week</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            3 of 6 done
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekPlan.map((d) => (
            <div
              key={d.day}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors ${
                d.today
                  ? "border-primary/40 bg-primary/10"
                  : d.done
                    ? "border-border bg-card"
                    : "border-border bg-card/50"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {d.day}
              </span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                  d.done
                    ? "bg-primary text-primary-foreground"
                    : d.today
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {d.done ? "✓" : d.focus[0]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-6 pt-8">
        <div className="mb-3 flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Quick Start</h2>
        </div>
        <div className="space-y-2">
          {freeSkills.slice(0, 4).map((skill) => (
            <Link
              key={skill.slug}
              to="/workout"
              search={{ slug: skill.slug, level: skill.currentLevel }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:bg-card-elevated active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                <span aria-hidden>{skill.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {skill.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lvl {skill.currentLevel} · {skill.levels[skill.currentLevel - 1]?.sets ?? 3} sets
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Play className="h-4 w-4 translate-x-px fill-current" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent History */}
      <section className="px-6 pb-4 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Recent Sessions</h2>
          </div>
          <button className="text-xs font-bold uppercase tracking-wider text-primary">
            See all
          </button>
        </div>
        <div className="space-y-2">
          {recentSessions.map((s, i) => (
            <article
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                <span aria-hidden>{s.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {s.skill}
                  <span className="ml-1.5 text-xs font-semibold text-muted-foreground">
                    Lvl {s.level}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.sets} sets · {s.duration} · {s.when}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}