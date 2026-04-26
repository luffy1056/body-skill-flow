import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { SkillData } from "@/data/skills";

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-primary/15 text-primary",
  Intermediate: "bg-amber-500/15 text-amber-400",
  Advanced: "bg-rose-500/15 text-rose-400",
};

export function SkillGridCard({ skill }: { skill: SkillData }) {
  const totalLevels = skill.locked ? 7 : skill.levels.length;
  const progressPct = skill.locked
    ? 0
    : Math.round((skill.currentLevel / totalLevels) * 100);

  const inner = (
    <article
      className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-all ${
        skill.locked
          ? "cursor-not-allowed"
          : "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card-elevated active:scale-[0.98]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
          <span aria-hidden>{skill.emoji}</span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            difficultyStyles[skill.difficulty]
          }`}
        >
          {skill.difficulty.slice(0, 3)}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold leading-tight text-foreground">{skill.name}</h3>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {totalLevels} Levels
        </p>
      </div>

      <div className="mt-auto">
        <Progress value={progressPct} className="h-1 bg-secondary" />
        <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-muted-foreground">
            {skill.locked ? "—" : `Lvl ${skill.currentLevel}/${totalLevels}`}
          </span>
          <span className="tabular-nums text-primary">{progressPct}%</span>
        </div>
      </div>

      {skill.locked && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 backdrop-blur-[3px]"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.196 0 0 / 0.4), oklch(0.145 0 0 / 0.7))",
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card shadow-[var(--shadow-glow)]">
              <Lock className="h-5 w-5 text-primary" strokeWidth={2.5} />
            </div>
          </div>
        </>
      )}
    </article>
  );

  if (skill.locked) {
    return (
      <Link to="/pro" className="block">
        {inner}
      </Link>
    );
  }

  return (
    <Link to="/skills/$slug" params={{ slug: skill.slug }} className="block">
      {inner}
    </Link>
  );
}