import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame, Play, Quote, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillCard, type Skill } from "@/components/SkillCard";
import { freeSkills } from "@/data/skills";
import {
  getLast7Days,
  getProfile,
  getPrimarySkill,
  getStreak,
  getTotalDays,
  type UserProfile,
} from "@/lib/profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillFlow — Master Calisthenics Skills" },
      {
        name: "description",
        content:
          "Train calisthenics skills like Muscle Up, Planche, and Front Lever with daily workouts and progress tracking.",
      },
      { property: "og:title", content: "SkillFlow — Master Calisthenics Skills" },
      {
        property: "og:description",
        content: "Daily skill workouts. Track progress. Build streaks.",
      },
    ],
  }),
  component: HomePage,
});

const defaultSkills: Skill[] = [
  { name: "Muscle Up", level: "Intermediate", progress: 68, emoji: "💪" },
  { name: "Planche", level: "Beginner", progress: 24, emoji: "🤸" },
  { name: "Front Lever", level: "Intermediate", progress: 52, emoji: "🦅" },
  { name: "Handstand", level: "Advanced", progress: 81, emoji: "🙃" },
];

function HomePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [week, setWeek] = useState<boolean[]>(Array(7).fill(false));

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate({ to: "/onboarding" });
      return;
    }
    setProfile(p);
    setStreak(getStreak());
    setTotalDays(getTotalDays());
    setWeek(getLast7Days());
    setHydrated(true);
  }, [navigate]);

  if (!hydrated || !profile) {
    return (
      <AppShell>
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      </AppShell>
    );
  }

  const userName = profile.name;
  const primarySkill = getPrimarySkill(profile.primarySkill);

  // Featured skills: primary first, then a few others
  const featuredSkills: Skill[] = [
    {
      name: primarySkill.name,
      level: primarySkill.difficulty,
      progress: Math.round((primarySkill.currentLevel / primarySkill.levels.length) * 100),
      emoji: primarySkill.emoji,
    },
    ...freeSkills
      .filter((s) => s.slug !== primarySkill.slug)
      .slice(0, 3)
      .map((s) => ({
        name: s.name,
        level: s.difficulty,
        progress: Math.round((s.currentLevel / s.levels.length) * 100),
        emoji: s.emoji,
      })),
  ];
  const skillsToShow = featuredSkills.length ? featuredSkills : defaultSkills;

  return (
    <AppShell>
      {/* Welcome banner */}
      <header className="relative overflow-hidden px-6 pb-8 pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-20%] h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            SkillFlow
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-foreground">
            Hey, {userName}<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Ready for today's <span className="text-foreground">{primarySkill.name}</span> session?
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              "Strength does not come from winning. It comes from the struggles you choose to face."
            </p>
          </div>
        </div>
      </header>

      {/* Streak counter */}
      <section className="px-6">
        <div
          className="flex items-center justify-between rounded-2xl border border-primary/30 p-5 shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Streak
              </p>
              <p className="text-2xl font-black text-foreground">
                {streak} <span className="text-base font-bold text-muted-foreground">days</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {week.map((trained, i) => (
              <div
                key={i}
                className={`h-8 w-1.5 rounded-full ${
                  trained ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Today's Workout */}
      <section className="px-6 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Today's Workout</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Day {totalDays + 1}
          </span>
        </div>
        <article
          className="relative overflow-hidden rounded-3xl border border-border p-6 shadow-[var(--shadow-elevated)]"
          style={{ background: "var(--gradient-card)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Zap className="h-3 w-3" /> Pull Focus
            </span>
            <h3 className="mt-3 text-2xl font-black text-foreground">{primarySkill.name} Progression</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Sets" value="4" />
              <Stat label="Reps" value="6" />
              <Stat label="Rest" value="90s" />
            </div>
            <Link
              to="/workout"
              search={{ slug: primarySkill.slug, level: primarySkill.currentLevel }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:bg-primary-glow active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-current" />
              Start Workout
            </Link>
          </div>
        </article>
      </section>

      {/* Your Skills */}
      <section className="px-6 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Your Skills</h2>
          <Link
            to="/skills"
            className="text-xs font-bold uppercase tracking-wider text-primary"
          >
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {skillsToShow.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </section>

      {/* AI Coach entry */}
      <section className="px-6 pt-8">
        <Link
          to="/coach"
          className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/30 p-4 transition-all hover:border-primary/60 active:scale-[0.99]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-black tracking-tight">Ask AI Coach</div>
            <div className="text-xs text-muted-foreground">
              Personalized training advice, anytime.
            </div>
          </div>
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            New
          </span>
        </Link>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-3 py-2.5 text-center">
      <p className="text-xl font-black text-foreground">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
