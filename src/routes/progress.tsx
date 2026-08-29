import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Clock, Calendar, Activity, Sparkles, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TodayFab } from "@/components/TodayFab";
import { freeSkills } from "@/data/skills";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — SkillFlow" },
      { name: "description", content: "Track your skill progression." },
    ],
  }),
  component: ProgressPage,
});

// ---------- Real data builders (from logged sessions) ----------
import {
  dateKey,
  getSessions,
  getStreak,
  type WorkoutSession,
} from "@/lib/profile";

type HeatCell = { date: Date; intensity: number; minutes: number };

function minutesForCell(sessions: WorkoutSession[], key: string): number {
  return Math.round(
    sessions
      .filter((s) => s.date === key)
      .reduce((sum, s) => sum + s.seconds, 0) / 60,
  );
}

function intensityForMinutes(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 10) return 1;
  if (minutes < 20) return 2;
  if (minutes < 35) return 3;
  return 4;
}

function buildHeatmap(sessions: WorkoutSession[], weeks = 16): HeatCell[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1));

  const cells: HeatCell[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const minutes = d > today ? 0 : minutesForCell(sessions, dateKey(d));
    cells.push({ date: d, intensity: intensityForMinutes(minutes), minutes });
  }

  const columns: HeatCell[][] = [];
  for (let c = 0; c < weeks; c++) {
    columns.push(cells.slice(c * 7, c * 7 + 7));
  }
  return columns;
}

function buildSeries(sessions: WorkoutSession[], slug: string) {
  const points: { day: string; volume: number; sets: number; reps: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    const daySessions = sessions.filter((s) => s.slug === slug && s.date === key);
    const sets = daySessions.reduce((sum, s) => sum + s.sets, 0);
    const reps = daySessions.reduce((sum, s) => sum + s.reps, 0);
    points.push({
      day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      volume: reps > 0 ? reps : sets,
      sets,
      reps,
    });
  }
  return points;
}

function buildPersonalBests(sessions: WorkoutSession[]) {
  const bySkill = new Map<string, WorkoutSession[]>();
  for (const s of sessions) {
    const list = bySkill.get(s.slug) ?? [];
    list.push(s);
    bySkill.set(s.slug, list);
  }
  const bests: { slug: string; record: string; date: string }[] = [];
  for (const [slug, list] of bySkill) {
    const best = list.reduce((a, b) =>
      b.reps > a.reps || (b.reps === a.reps && b.level > a.level) ? b : a,
    );
    bests.push({
      slug,
      record:
        best.reps > 0
          ? `Level ${best.level} · ${best.reps} reps`
          : `Level ${best.level} · ${best.sets} holds`,
      date: new Date(`${best.date}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });
  }
  return bests;
}

function formatDurationShort(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m < 1 ? "<1m" : `${m}m`;
}

function buildHistory(sessions: WorkoutSession[]) {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)
    .map((s) => {
      const d = new Date(`${s.date}T00:00:00`);
      const skill = freeSkills.find((f) => f.slug === s.slug);
      return {
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        skill: skill ? `${skill.emoji} ${skill.name}` : s.slug,
        duration: formatDurationShort(s.seconds),
        sets: s.sets,
      };
    });
}

function getIntensityClass(intensity: number) {
  switch (intensity) {
    case 0:
      return "bg-muted/40";
    case 1:
      return "bg-primary/20";
    case 2:
      return "bg-primary/40";
    case 3:
      return "bg-primary/70";
    case 4:
      return "bg-primary shadow-[0_0_8px_oklch(0.82_0.22_148/0.6)]";
    default:
      return "bg-muted/40";
  }
}

function ProgressPage() {
  const [selectedSkill, setSelectedSkill] = useState<string>(freeSkills[0].slug);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hasData = workoutHistory.length > 0;
  const heatmap = useMemo(
    () => (mounted && hasData ? buildHeatmap(16) : buildEmptyHeatmap(16)),
    [mounted, hasData],
  );
  const series = useMemo(
    () => (mounted && hasData ? buildSeries(selectedSkill) : []),
    [mounted, selectedSkill, hasData],
  );

  const totalSessions = workoutHistory.length;
  const totalMinutes = 0;
  const currentStreak = 0;

  const skill = freeSkills.find((s) => s.slug === selectedSkill);

  if (!hasData) {
    return (
      <AppShell>
        <div className="p-5 space-y-6">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your journey
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Progress</h1>
          </header>
          <ProgressEmptyState />
        </div>
        <TodayFab />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-5 space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Your journey
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Progress</h1>
        </header>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-card border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">
              <Flame className="h-3 w-3 text-primary" /> Streak
            </div>
            <div className="mt-1 text-2xl font-black">{currentStreak}d</div>
          </Card>
          <Card className="p-3 bg-card border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">
              <Calendar className="h-3 w-3 text-primary" /> Sessions
            </div>
            <div className="mt-1 text-2xl font-black">{totalSessions}</div>
          </Card>
          <Card className="p-3 bg-card border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">
              <Clock className="h-3 w-3 text-primary" /> Minutes
            </div>
            <div className="mt-1 text-2xl font-black">{totalMinutes}</div>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="p-4 bg-card border-border/50">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold">Activity</h2>
            <span className="text-[10px] text-muted-foreground">Last 16 weeks</span>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-[3px]">
                {heatmap.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((cell, di) => (
                      <button
                        key={di}
                        type="button"
                        title={`${cell.date.toLocaleDateString()} — ${cell.minutes} min`}
                        className={`h-3 w-3 rounded-[3px] transition-transform hover:scale-125 ${getIntensityClass(cell.intensity)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${getIntensityClass(i)}`} />
            ))}
            <span>More</span>
          </div>
        </Card>

        {/* Line chart */}
        <Card className="p-4 bg-card border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Volume over time</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Sets × reps · last 30 days
              </p>
            </div>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-[150px] h-9 bg-muted/40 border-border/50 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {freeSkills.map((s) => (
                  <SelectItem key={s.slug} value={s.slug} className="text-xs">
                    {s.emoji} {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 h-48 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.82 0.22 148)" />
                    <stop offset="100%" stopColor="oklch(0.88 0.22 158)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />
                <YAxis
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ stroke: "oklch(0.82 0.22 148 / 0.3)", strokeWidth: 1 }}
                  contentStyle={{
                    background: "oklch(0.196 0 0)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "oklch(0.985 0 0)",
                  }}
                  labelStyle={{ color: "oklch(0.65 0 0)", fontSize: 10 }}
                  formatter={(value: number, _name, item) => {
                    const p = item.payload as { sets: number; reps: number };
                    return [`${value} (${p.sets}×${p.reps})`, "Volume"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={(props: { cx?: number; cy?: number }) => (
                    <Dot
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill="oklch(0.82 0.22 148)"
                      stroke="oklch(0.145 0 0)"
                      strokeWidth={2}
                    />
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {skill && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Tap any point for exact sets × reps on that day.
            </p>
          )}
        </Card>

        {/* Personal bests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" /> Personal Bests
            </h2>
          </div>
          <Card className="bg-card border-border/50 divide-y divide-border/40 p-0 overflow-hidden">
            {personalBests.map((pb) => {
              const s = freeSkills.find((f) => f.slug === pb.slug);
              if (!s) return null;
              return (
                <div
                  key={pb.slug}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {pb.record}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-primary font-bold">
                    {pb.date}
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Workout history */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Workout History</h2>
            <span className="text-[10px] text-muted-foreground">
              {workoutHistory.length} sessions
            </span>
          </div>
          <div className="space-y-2">
            {workoutHistory.map((w, i) => (
              <Card
                key={i}
                className="flex items-center gap-3 p-3 bg-card border-border/50"
              >
                <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-[9px] uppercase text-muted-foreground leading-none">
                    {w.date.split(" ")[0]}
                  </span>
                  <span className="text-sm font-black leading-tight mt-0.5">
                    {w.date.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{w.skill}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {w.sets} sets
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <Clock className="h-3 w-3" /> {w.duration}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <TodayFab />
    </AppShell>
  );
}

function buildEmptyHeatmap(weeks: number): HeatCell[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1));
  const cells: HeatCell[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, intensity: 0, minutes: 0 });
  }
  const columns: HeatCell[][] = [];
  for (let c = 0; c < weeks; c++) {
    columns.push(cells.slice(c * 7, c * 7 + 7));
  }
  return columns;
}

function ProgressEmptyState() {
  return (
    <div className="flex flex-col items-center text-center pt-6 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6 h-44 w-44">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="relative h-full w-full rounded-full border border-primary/30 bg-card grid place-content-center shadow-[var(--shadow-glow)]">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 49 }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-[3px] ${
                  i === 24 || i === 17 || i === 31 || i === 32
                    ? "bg-primary/70"
                    : "bg-muted/40"
                }`}
              />
            ))}
          </div>
          <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)] animate-pulse-glow">
            <Activity className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-black tracking-tight">No workouts yet</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
        Complete your first session to start building your streak, heatmap, and personal bests.
      </p>

      <Link
        to="/workouts"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95 hover:bg-primary-glow"
      >
        <Play className="h-4 w-4 fill-current" />
        Start your first workout
      </Link>

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <EmptyHint icon={<Flame className="h-4 w-4" />} label="Streak" />
        <EmptyHint icon={<Trophy className="h-4 w-4" />} label="Records" />
        <EmptyHint icon={<Sparkles className="h-4 w-4" />} label="Insights" />
      </div>
    </div>
  );
}

function EmptyHint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}