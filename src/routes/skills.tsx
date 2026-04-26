import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Crown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SkillGridCard } from "@/components/SkillGridCard";
import { TodayFab } from "@/components/TodayFab";
import { freeSkills, proSkills } from "@/data/skills";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — SkillFlow" },
      {
        name: "description",
        content:
          "Browse calisthenics skills: Muscle Up, Planche, Front Lever, Human Flag and more.",
      },
      { property: "og:title", content: "Skills — SkillFlow" },
      {
        property: "og:description",
        content: "Master 12+ calisthenics skills with structured progressions.",
      },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <AppShell>
      <header className="px-6 pb-6 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Library
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-foreground">
          Skills
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a skill, follow the progression, level up.
        </p>
      </header>

      {/* Free Skills */}
      <section className="px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Free Skills</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {freeSkills.length} skills
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {freeSkills.map((skill) => (
            <SkillGridCard key={skill.slug} skill={skill} />
          ))}
        </div>
      </section>

      {/* Pro Skills */}
      <section className="px-6 pt-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">Pro Skills</h2>
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
              Locked
            </span>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Unlock elite progressions with SkillFlow Pro.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {proSkills.map((skill) => (
            <SkillGridCard key={skill.slug} skill={skill} />
          ))}
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 py-4 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-400/15"
        >
          <Crown className="h-4 w-4" />
          Upgrade to Pro
        </button>
      </section>
      <TodayFab />
    </AppShell>
  );
}