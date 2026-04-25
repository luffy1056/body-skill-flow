import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

export interface Skill {
  name: string;
  level: string;
  progress: number;
  emoji: string;
}

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-all hover:border-primary/40 hover:bg-card-elevated active:scale-[0.98]"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        <span aria-hidden>{skill.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold text-foreground">{skill.name}</h3>
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {skill.level}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={skill.progress} className="h-1.5 flex-1 bg-secondary" />
          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
            {skill.progress}%
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}