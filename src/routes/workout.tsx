import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { z } from "zod";
import { getSkillBySlug } from "@/data/skills";
import { recordCompletion, recordSession } from "@/lib/profile";

const searchSchema = z.object({
  slug: z.string(),
  level: z.number().int().min(1).optional(),
});

export const Route = createFileRoute("/workout")({
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({ search }) => ({ slug: search.slug, level: search.level }),
  loader: ({ deps }) => {
    const skill = getSkillBySlug(deps.slug);
    if (!skill || skill.locked) throw notFound();
    const levelIdx = Math.min(
      Math.max((deps.level ?? skill.currentLevel) - 1, 0),
      skill.levels.length - 1,
    );
    return { skill, level: skill.levels[levelIdx], levelNumber: levelIdx + 1 };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.level.name ?? "Workout"} — SkillFlow` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkoutPlayer,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div>
        <h1 className="text-2xl font-black text-foreground">Workout not found</h1>
        <Link to="/skills" className="mt-4 inline-block text-primary">
          Back to Skills
        </Link>
      </div>
    </div>
  ),
});

const TIPS: Record<string, string[]> = {
  default: [
    "Brace your core and squeeze your glutes throughout the hold.",
    "Move slow and controlled — quality beats quantity.",
    "Breathe steadily; never hold your breath under tension.",
  ],
  "Tuck Planche": [
    "Protract your shoulders — push the floor away.",
    "Round your upper back into a hollow position.",
    "Knees tight to chest, ankles together.",
  ],
  "Muscle-Up": [
    "Pull explosively to the lower chest, not the chin.",
    "Lean forward as you transition over the bar.",
    "Keep wrists turned over the bar for the dip.",
  ],
};

function getTips(levelName: string): string[] {
  const key = Object.keys(TIPS).find((k) => levelName.includes(k));
  return TIPS[key ?? "default"];
}

/** Parse a reps string like "12", "8s", "30s" into { isTimed, value } */
function parseTarget(reps: string): { isTimed: boolean; value: number } {
  const trimmed = reps.trim();
  if (trimmed.endsWith("s")) {
    return { isTimed: true, value: parseInt(trimmed.slice(0, -1), 10) || 30 };
  }
  return { isTimed: false, value: parseInt(trimmed, 10) || 8 };
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const REST_SECONDS = 90;

function WorkoutPlayer() {
  const { skill, level, levelNumber } = Route.useLoaderData();
  const navigate = useNavigate();

  const target = useMemo(() => parseTarget(level.reps), [level.reps]);
  const totalSets = level.sets;

  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [tipsOpen, setTipsOpen] = useState(true);

  // Work timer (counts up for reps, counts down for timed)
  const [workSeconds, setWorkSeconds] = useState(target.isTimed ? target.value : 0);
  const [workRunning, setWorkRunning] = useState(false);

  // Rep counter
  const [reps, setReps] = useState(0);

  // Rest timer
  const [restSeconds, setRestSeconds] = useState(REST_SECONDS);

  // Track totals across sets
  const totalsRef = useRef({ reps: 0, seconds: 0, sessionStart: Date.now() });

  // Reset per-set state when entering work phase
  useEffect(() => {
    if (phase === "work") {
      setWorkSeconds(target.isTimed ? target.value : 0);
      setWorkRunning(false);
      setReps(0);
    } else {
      setRestSeconds(REST_SECONDS);
    }
  }, [phase, currentSet, target.isTimed, target.value]);

  // Work timer interval (only for timed exercises)
  useEffect(() => {
    if (phase !== "work" || !workRunning || !target.isTimed) return;
    const id = setInterval(() => {
      setWorkSeconds((s) => {
        if (s <= 1) {
          setWorkRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, workRunning, target.isTimed]);

  // Rest timer interval (auto-runs)
  useEffect(() => {
    if (phase !== "rest") return;
    const id = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          // auto-advance to next set's work phase
          setCurrentSet((c) => c + 1);
          setPhase("work");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const isLastSet = currentSet === totalSets;

  function recordSet() {
    const secondsThisSet = target.isTimed ? target.value - workSeconds : 0;
    const repsThisSet = target.isTimed ? 0 : reps;
    totalsRef.current.reps += repsThisSet;
    totalsRef.current.seconds += secondsThisSet;
  }

  function handleNext() {
    recordSet();
    if (isLastSet) {
      finishWorkout();
    } else {
      setPhase("rest");
    }
  }

  function handlePrev() {
    if (phase === "rest") {
      setPhase("work");
      return;
    }
    if (currentSet > 1) {
      setCurrentSet((c) => c - 1);
      setPhase("work");
    }
  }

  function skipRest() {
    setRestSeconds(0);
    setCurrentSet((c) => c + 1);
    setPhase("work");
  }

  function finishWorkout() {
    recordCompletion();
    const elapsed = Math.round((Date.now() - totalsRef.current.sessionStart) / 1000);
    recordSession({
      slug: skill.slug,
      level: levelNumber,
      sets: totalSets,
      reps: totalsRef.current.reps,
      seconds: elapsed,
    });
    navigate({
      to: "/workout/summary",
      search: {
        slug: skill.slug,
        level: levelNumber,
        sets: totalSets,
        reps: totalsRef.current.reps,
        seconds: elapsed,
      },
    });
  }

  const tips = getTips(level.name);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6">
          <Link
            to="/skills/$slug"
            params={{ slug: skill.slug }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
            aria-label="Exit workout"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {skill.name}
            </p>
            <p className="text-sm font-bold text-foreground">Level {levelNumber}</p>
          </div>
          <div className="h-10 w-10" />
        </div>

        {phase === "work" ? (
          <WorkPhase
            level={level}
            currentSet={currentSet}
            totalSets={totalSets}
            target={target}
            workSeconds={workSeconds}
            workRunning={workRunning}
            setWorkRunning={setWorkRunning}
            reps={reps}
            setReps={setReps}
            tipsOpen={tipsOpen}
            setTipsOpen={setTipsOpen}
            tips={tips}
            onPrev={handlePrev}
            onNext={handleNext}
            isLastSet={isLastSet}
            canGoPrev={currentSet > 1}
          />
        ) : (
          <RestPhase
            restSeconds={restSeconds}
            nextSet={currentSet + 1}
            totalSets={totalSets}
            onSkip={skipRest}
            onBack={() => setPhase("work")}
          />
        )}
      </div>
    </div>
  );
}

function WorkPhase(props: {
  level: { name: string; sets: number; reps: string };
  currentSet: number;
  totalSets: number;
  target: { isTimed: boolean; value: number };
  workSeconds: number;
  workRunning: boolean;
  setWorkRunning: (b: boolean) => void;
  reps: number;
  setReps: (n: number) => void;
  tipsOpen: boolean;
  setTipsOpen: (b: boolean) => void;
  tips: string[];
  onPrev: () => void;
  onNext: () => void;
  isLastSet: boolean;
  canGoPrev: boolean;
}) {
  const {
    level,
    currentSet,
    totalSets,
    target,
    workSeconds,
    workRunning,
    setWorkRunning,
    reps,
    setReps,
    tipsOpen,
    setTipsOpen,
    tips,
    onPrev,
    onNext,
    isLastSet,
    canGoPrev,
  } = props;

  // Ring progress
  const ringSize = 240;
  const stroke = 12;
  const r = (ringSize - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = target.isTimed
    ? (target.value - workSeconds) / target.value
    : Math.min(reps / target.value, 1);
  const offset = C * (1 - pct);

  return (
    <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
      {/* Set tracker */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSets }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i + 1 < currentSet
                ? "w-6 bg-primary"
                : i + 1 === currentSet
                  ? "w-10 bg-primary"
                  : "w-6 bg-secondary"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Set {currentSet} of {totalSets}
      </p>

      {/* Exercise name */}
      <h1 className="mt-6 text-center text-3xl font-black leading-tight tracking-tight text-foreground">
        {level.name}
      </h1>
      <p className="mt-1 text-center text-sm font-semibold text-muted-foreground">
        Target: {level.reps} {target.isTimed ? "hold" : "reps"}
      </p>

      {/* Timer / counter ring */}
      <div className="relative mx-auto mt-8 flex items-center justify-center">
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={stroke}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {target.isTimed ? (
            <>
              <p className="font-mono text-6xl font-black tabular-nums text-foreground">
                {formatTime(workSeconds)}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {workRunning ? "Hold steady" : workSeconds === 0 ? "Done" : "Tap play"}
              </p>
            </>
          ) : (
            <>
              <p className="text-7xl font-black tabular-nums text-foreground">{reps}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                of {target.value} reps
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action button under ring */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {target.isTimed ? (
          <>
            <button
              type="button"
              onClick={() => setWorkRunning(!workRunning)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
              aria-label={workRunning ? "Pause" : "Start"}
            >
              {workRunning ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 translate-x-0.5 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkRunning(false);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
              aria-label="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setReps(Math.max(0, reps - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground text-2xl font-bold"
              aria-label="Decrease reps"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setReps(reps + 1)}
              className="flex h-16 min-w-[140px] items-center justify-center rounded-full bg-primary px-6 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
            >
              + Add Rep
            </button>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setTipsOpen(!tipsOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          aria-expanded={tipsOpen}
        >
          <span className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Technique Tips</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              tipsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {tipsOpen && (
          <ul className="space-y-2 px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground animate-fade-in">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-auto flex gap-3 pt-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-bold text-foreground transition-colors hover:bg-card-elevated disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className={`flex h-14 flex-[1.5] items-center justify-center gap-1.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
            isLastSet
              ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isLastSet ? "Complete Workout" : "Next Set"}
          {!isLastSet && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function RestPhase(props: {
  restSeconds: number;
  nextSet: number;
  totalSets: number;
  onSkip: () => void;
  onBack: () => void;
}) {
  const { restSeconds, nextSet, totalSets, onSkip, onBack } = props;
  const pct = (REST_SECONDS - restSeconds) / REST_SECONDS;

  const ringSize = 280;
  const stroke = 14;
  const r = (ringSize - stroke) / 2;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - pct);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Rest</p>
      <h2 className="mt-2 text-2xl font-black text-foreground">Catch your breath</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Set {nextSet} of {totalSets} starts in
      </p>

      <div className="relative mt-8 flex items-center justify-center">
        <div className="absolute h-[260px] w-[260px] rounded-full bg-primary/10 animate-pulse-glow" />
        <svg width={ringSize} height={ringSize} className="relative -rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={stroke}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-7xl font-black tabular-nums text-foreground">
            {restSeconds}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            seconds
          </p>
        </div>
      </div>

      <div className="mt-10 flex w-full gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-bold text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Set
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Skip Rest
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}