import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Flame,
  Trophy,
  Target,
  Dumbbell,
  Scale,
  Wind,
} from "lucide-react";
import { freeSkills } from "@/data/skills";
import { saveProfile, type FitnessLevel } from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to SkillFlow" },
      { name: "description", content: "Set up your calisthenics training profile." },
    ],
  }),
  component: OnboardingPage,
});

const fitnessLevels: {
  value: FitnessLevel;
  title: string;
  description: string;
  icon: typeof Sparkles;
}[] = [
  {
    value: "Beginner",
    title: "Beginner",
    description: "New to calisthenics or returning after a long break.",
    icon: Sparkles,
  },
  {
    value: "Intermediate",
    title: "Intermediate",
    description: "Can do pull-ups, dips, and basic holds with control.",
    icon: Flame,
  },
  {
    value: "Advanced",
    title: "Advanced",
    description: "Working on muscle-ups, levers, or planche progressions.",
    icon: Trophy,
  },
];

const goalOptions: { value: string; title: string; icon: typeof Target }[] = [
  { value: "skills", title: "Learn Skills", icon: Target },
  { value: "strength", title: "Build Strength", icon: Dumbbell },
  { value: "weight", title: "Lose Weight", icon: Scale },
  { value: "flexibility", title: "Improve Flexibility", icon: Wind },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [primarySkill, setPrimarySkill] = useState<string | null>(null);

  const totalSteps = 4;

  const canContinue = (() => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return fitnessLevel !== null;
    if (step === 3) return goals.length > 0;
    if (step === 4) return primarySkill !== null;
    return false;
  })();

  const handleNext = () => {
    if (!canContinue) return;
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    // Finish
    saveProfile({
      name: name.trim(),
      fitnessLevel: fitnessLevel!,
      goals,
      primarySkill: primarySkill!,
      onboardedAt: new Date().toISOString(),
    });
    navigate({ to: "/" });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleGoal = (g: string) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-10 pb-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Step {step} of {totalSteps}
        </p>

        {/* Content */}
        <div className="mt-6 flex-1">
          {step === 1 && (
            <StepName name={name} onChange={setName} />
          )}
          {step === 2 && (
            <StepFitness selected={fitnessLevel} onSelect={setFitnessLevel} />
          )}
          {step === 3 && (
            <StepGoals selected={goals} onToggle={toggleGoal} />
          )}
          {step === 4 && (
            <StepSkill selected={primarySkill} onSelect={setPrimarySkill} />
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-6 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 font-bold text-foreground transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue}
            className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl font-bold transition-all active:scale-[0.98] ${
              canContinue
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary-glow"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {step === totalSteps ? "Start Training" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function StepName({ name, onChange }: { name: string; onChange: (v: string) => void }) {
  return (
    <div>
      <StepHeader
        eyebrow="Welcome"
        title="What's your name?"
        subtitle="We'll use it to personalize your training experience."
      />
      <div className="mt-8">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
          maxLength={32}
          className="w-full rounded-2xl border border-border bg-card px-5 py-5 text-2xl font-bold text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}

function StepFitness({
  selected,
  onSelect,
}: {
  selected: FitnessLevel | null;
  onSelect: (v: FitnessLevel) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Profile"
        title="What's your fitness level?"
        subtitle="We'll calibrate your starting progressions."
      />
      <div className="mt-6 space-y-3">
        {fitnessLevels.map((lvl) => {
          const Icon = lvl.icon;
          const isSelected = selected === lvl.value;
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onSelect(lvl.value)}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">{lvl.title}</h3>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary" strokeWidth={3} />
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {lvl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepGoals({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Goals"
        title="Choose your goals"
        subtitle="Pick one or more — you can update these any time."
      />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {goalOptions.map((g) => {
          const Icon = g.icon;
          const isSelected = selected.includes(g.value);
          return (
            <button
              key={g.value}
              type="button"
              onClick={() => onToggle(g.value)}
              className={`relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition-all active:scale-[0.97] ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-foreground">
                {g.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSkill({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="First Skill"
        title="Pick your first skill"
        subtitle="This becomes the focus of your daily workout."
      />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {freeSkills.map((s) => {
          const isSelected = selected === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => onSelect(s.slug)}
              className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all active:scale-[0.97] ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-sm font-black leading-tight text-foreground">
                {s.name}
              </span>
              <span
                className={`mt-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  s.difficulty === "Beginner"
                    ? "bg-primary/15 text-primary"
                    : s.difficulty === "Intermediate"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {s.difficulty}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}