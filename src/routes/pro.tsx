import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Brain,
  Dumbbell,
  BarChart3,
  Infinity as InfinityIcon,
  Ban,
  Zap,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Go Pro — SkillFlow" },
      {
        name: "description",
        content:
          "Unlock SkillFlow Pro for AI-coached workouts, advanced analytics, and exclusive skills.",
      },
    ],
  }),
  component: ProPage,
});

type Plan = "monthly" | "yearly";

const comparisonRows: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  free: string;
  pro: string;
}[] = [
  { label: "Skills library", icon: Dumbbell, free: "7 free skills", pro: "14 skills (incl. pro)" },
  { label: "AI Coach", icon: Brain, free: "—", pro: "Unlimited" },
  { label: "Custom Workouts", icon: Sparkles, free: "Templates only", pro: "Fully custom" },
  { label: "Advanced Analytics", icon: BarChart3, free: "Basic charts", pro: "Deep insights" },
];

const benefits = [
  { icon: Crown, text: "7 extra pro skills (Human Flag, One Arm Pull-Up & more)" },
  { icon: Brain, text: "AI-generated personalized training plans" },
  { icon: InfinityIcon, text: "Unlimited workout history & exports" },
  { icon: Ban, text: "No ads, ever" },
];

function ProPage() {
  const [plan, setPlan] = useState<Plan>("yearly");

  return (
    <AppShell>
      <div className="pb-8">
        {/* Hero */}
        <section
          className="relative overflow-hidden px-6 pb-10 pt-8"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, oklch(0.85 0.18 95 / 0.18) 0%, transparent 60%), linear-gradient(160deg, oklch(0.196 0 0) 0%, oklch(0.145 0 0) 60%, oklch(0.82 0.22 148 / 0.12) 100%)",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-background"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.85 0.18 95), oklch(0.82 0.22 148))",
              }}
            >
              <Crown className="h-3 w-3" />
              SkillFlow Pro
            </span>
          </div>

          <h1
            className="text-4xl font-black leading-[1.05] tracking-tight"
            style={{
              backgroundImage:
                "linear-gradient(120deg, oklch(0.985 0 0) 0%, oklch(0.85 0.18 95) 55%, oklch(0.82 0.22 148) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Unlock Your
            <br />
            Full Potential.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Train smarter with AI coaching, master pro-level calisthenics skills, and
            track every rep with deep analytics built for serious athletes.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Stat value="14" label="Skills" />
            <Stat value="∞" label="Workouts" />
            <Stat value="AI" label="Coach" />
          </div>
        </section>

        {/* Comparison table */}
        <section className="px-6 pt-10">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Free vs Pro
          </h2>
          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-b border-border bg-secondary/40 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="flex items-center justify-center gap-1 text-primary">
                <Crown className="h-3 w-3" /> Pro
              </div>
            </div>
            {comparisonRows.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.4fr_1fr_1fr] items-center px-4 py-3.5 text-sm ${
                    i !== comparisonRows.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="font-semibold">{row.label}</span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    {row.free === "—" ? (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/60" />
                    ) : (
                      row.free
                    )}
                  </div>
                  <div className="text-center text-xs font-semibold text-primary">
                    {row.pro}
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Pricing */}
        <section className="px-6 pt-10">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Choose your plan
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <PlanCard
              selected={plan === "monthly"}
              onClick={() => setPlan("monthly")}
              title="Monthly"
              price="$4.99"
              cadence="/mo"
              sub="Billed monthly"
            />
            <PlanCard
              selected={plan === "yearly"}
              onClick={() => setPlan("yearly")}
              title="Yearly"
              price="$29.99"
              cadence="/yr"
              sub="Just $2.50/mo"
              badge="Best Value"
              highlight
            />
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 pt-10">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            What you get
          </h2>
          <ul className="space-y-2.5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.text}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.85 0.18 95 / 0.2), oklch(0.82 0.22 148 / 0.2))",
                    }}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground">{b.text}</span>
                  <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                </li>
              );
            })}
          </ul>
        </section>

        {/* CTA */}
        <section className="px-6 pt-10">
          <Button
            size="lg"
            className="animate-pulse-cta animate-shimmer-cta relative h-14 w-full overflow-hidden rounded-2xl text-base font-black tracking-wide text-background"
            style={{
              backgroundImage:
                "linear-gradient(90deg, oklch(0.88 0.18 95) 0%, oklch(0.85 0.22 130) 50%, oklch(0.82 0.22 148) 100%)",
            }}
          >
            <Zap className="h-5 w-5" strokeWidth={3} />
            Start 7-Day Free Trial
          </Button>
          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
            Then{" "}
            <span className="font-semibold text-foreground">
              {plan === "yearly" ? "$29.99/yr" : "$4.99/mo"}
            </span>
            . Cancel anytime.
          </p>

          <button
            type="button"
            className="mx-auto mt-6 block text-xs font-semibold text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Restore purchase
          </button>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur">
      <span className="text-sm font-black text-primary">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function PlanCard({
  selected,
  onClick,
  title,
  price,
  cadence,
  sub,
  badge,
  highlight,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  price: string;
  cadence: string;
  sub: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
        selected
          ? "border-primary bg-card-elevated shadow-[var(--shadow-glow)]"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {badge && (
        <span
          className="absolute -right-8 top-3 rotate-45 px-8 py-0.5 text-[9px] font-black uppercase tracking-widest text-background"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.85 0.18 95), oklch(0.82 0.22 148))",
          }}
        >
          {badge}
        </span>
      )}
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="mt-2 flex items-baseline gap-0.5">
        <span
          className={`text-2xl font-black tracking-tight ${highlight ? "text-primary" : "text-foreground"}`}
        >
          {price}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{cadence}</span>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
      <div
        className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
          selected ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={4} />}
      </div>
    </button>
  );
}
