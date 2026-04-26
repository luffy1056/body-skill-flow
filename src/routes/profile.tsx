import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Crown,
  Dumbbell,
  Edit3,
  Moon,
  Share2,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { freeSkills } from "@/data/skills";
import {
  ALL_EQUIPMENT,
  ALL_GOALS,
  getInitials,
  getProfile,
  getSettings,
  saveProfile,
  saveSettings,
  type UserProfile,
  type UserSettings,
} from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SkillFlow" },
      { name: "description", content: "Your SkillFlow profile, goals, and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [editingGoals, setEditingGoals] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setSettings(getSettings());
    setHydrated(true);
  }, []);

  const skillsUnlocked = useMemo(
    () => freeSkills.filter((s) => s.currentLevel > 0).length,
    [],
  );

  if (!hydrated) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      </AppShell>
    );
  }

  const name = profile?.name ?? "Athlete";
  const initials = getInitials(name);
  const joinedDate = profile?.onboardedAt
    ? new Date(profile.onboardedAt)
    : new Date();
  const joinedLabel = joinedDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const updateSettings = (patch: Partial<UserSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  const toggleGoal = (goal: string) => {
    if (!profile) return;
    const has = profile.goals.includes(goal);
    const goals = has
      ? profile.goals.filter((g) => g !== goal)
      : [...profile.goals, goal];
    const next = { ...profile, goals };
    setProfile(next);
    saveProfile(next);
  };

  const toggleEquipment = (item: string) => {
    if (!settings) return;
    const has = settings.equipment.includes(item);
    const equipment = has
      ? settings.equipment.filter((e) => e !== item)
      : [...settings.equipment, item];
    updateSettings({ equipment });
  };

  const handleShare = async () => {
    const text = `I'm training calisthenics on SkillFlow! 🔥 ${skillsUnlocked} skills unlocked. Join me!`;
    if (typeof navigator === "undefined") return;
    const nav = navigator as Navigator & {
      share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    };
    try {
      if (nav.share) {
        await nav.share({ title: "SkillFlow Progress", text });
      } else {
        await nav.clipboard.writeText(text);
        toast.success("Progress copied to clipboard");
      }
    } catch {
      // user cancelled or unsupported
    }
  };

  const totalWorkouts = 0;
  const currentStreak = 0;
  const isPro = false;

  return (
    <AppShell>
      <div className="p-6 pb-10">
        {/* Header */}
        <h1 className="text-3xl font-black tracking-tight">Profile</h1>

        {/* Identity */}
        <Card
          className="mt-5 overflow-hidden border-border/50 p-5"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xl font-black tracking-tight">{name}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {profile?.fitnessLevel ?? "Beginner"} · Joined {joinedLabel}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <StatTile label="Workouts" value={totalWorkouts} />
            <StatTile label="Day Streak" value={currentStreak} accent />
            <StatTile label="Skills" value={skillsUnlocked} />
          </div>
        </Card>

        {/* AI Coach quick link */}
        <Link to="/coach" className="mt-4 block">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:bg-card-elevated">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">AI Coach</div>
              <div className="text-[11px] text-muted-foreground">
                Chat about training & progress
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>

        {/* Settings */}
        <Section title="Settings">
          <Card className="divide-y divide-border/60 overflow-hidden p-0">
            <ToggleRow
              icon={Bell}
              label="Workout reminders"
              description="Daily push notifications"
              checked={settings?.workoutReminders ?? true}
              onCheckedChange={(v) => updateSettings({ workoutReminders: v })}
            />
            <ToggleRow
              icon={Volume2}
              label="Rest timer sound"
              description="Beep when rest ends"
              checked={settings?.restTimerSound ?? true}
              onCheckedChange={(v) => updateSettings({ restTimerSound: v })}
            />
            <ToggleRow
              icon={Moon}
              label="Dark mode"
              description="Easy on the eyes"
              checked={settings?.darkMode ?? true}
              onCheckedChange={(v) => updateSettings({ darkMode: v })}
            />
          </Card>
        </Section>

        {/* My Goals */}
        <Section
          title="My Goals"
          action={
            <button
              onClick={() => setEditingGoals((v) => !v)}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary"
            >
              {editingGoals ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              {editingGoals ? "Done" : "Edit"}
            </button>
          }
        >
          <Card className="p-4">
            {editingGoals ? (
              <div className="grid grid-cols-2 gap-2">
                {ALL_GOALS.map((goal) => {
                  const active = profile?.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-semibold transition ${
                        active
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{goal}</span>
                      {active && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            ) : profile?.goals.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
                  >
                    <Trophy className="mr-1 inline h-3 w-3" />
                    {g}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No goals selected yet. Tap Edit to add some.
              </p>
            )}
          </Card>
        </Section>

        {/* Equipment */}
        <Section title="Equipment">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {ALL_EQUIPMENT.map((item) => {
                const checked = settings?.equipment.includes(item) ?? false;
                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold transition ${
                      checked
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/40 hover:bg-secondary"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleEquipment(item)}
                    />
                    <span className="flex-1">{item}</span>
                  </label>
                );
              })}
            </div>
          </Card>
        </Section>

        {/* Share */}
        <div className="mt-6">
          <Button
            onClick={handleShare}
            className="h-12 w-full gap-2 rounded-2xl bg-secondary text-base font-bold text-foreground hover:bg-card-elevated"
          >
            <Share2 className="h-4 w-4" />
            Share Progress
          </Button>
        </div>

        {/* Pro upsell */}
        {!isPro && (
          <Link to="/pro" className="mt-6 block">
            <Card
              className="relative overflow-hidden border-0 p-5"
              style={{
                background:
                  "radial-gradient(120% 100% at 100% 0%, oklch(0.85 0.18 95 / 0.25) 0%, transparent 60%), linear-gradient(135deg, oklch(0.235 0 0) 0%, oklch(0.196 0 0) 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.85 0.18 95), oklch(0.82 0.22 148))",
                  }}
                >
                  <Crown className="h-6 w-6 text-background" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-black tracking-tight">Upgrade to Pro</div>
                  <div className="text-xs text-muted-foreground">
                    Unlock AI coaching & 7 pro skills
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        )}
      </div>
    </AppShell>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        accent
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-card-elevated/60"
      }`}
    >
      <p className={`text-2xl font-black ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// Suppress unused warning for Dumbbell import (kept for future equipment icon use)
void Dumbbell;