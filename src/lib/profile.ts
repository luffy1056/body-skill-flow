import { freeSkills } from "@/data/skills";

export type FitnessLevel = "Beginner" | "Intermediate" | "Advanced";

export interface UserProfile {
  name: string;
  fitnessLevel: FitnessLevel;
  goals: string[];
  primarySkill: string; // slug
  onboardedAt: string;
}

const STORAGE_KEY = "skillflow.profile.v1";
const SETTINGS_KEY = "skillflow.settings.v1";

export interface UserSettings {
  workoutReminders: boolean;
  restTimerSound: boolean;
  darkMode: boolean;
  equipment: string[];
}

export const ALL_GOALS = [
  "Learn Skills",
  "Build Strength",
  "Lose Weight",
  "Improve Flexibility",
] as const;

export const ALL_EQUIPMENT = [
  "Pull-Up Bar",
  "Parallel Bars",
  "Rings",
  "No Equipment",
] as const;

const DEFAULT_SETTINGS: UserSettings = {
  workoutReminders: true,
  restTimerSound: true,
  darkMode: true,
  equipment: ["Pull-Up Bar"],
};

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.name || !parsed?.primarySkill) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getPrimarySkill(slug: string) {
  return freeSkills.find((s) => s.slug === slug) ?? freeSkills[0];
}

// --- Workout completions (streak tracking) ---

const COMPLETIONS_KEY = "skillflow.completions.v1";

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getCompletions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPLETIONS_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr.filter((d) => typeof d === "string") : [];
  } catch {
    return [];
  }
}

export function recordCompletion(date: Date = new Date()) {
  if (typeof window === "undefined") return;
  const key = dateKey(date);
  const set = new Set(getCompletions());
  set.add(key);
  window.localStorage.setItem(COMPLETIONS_KEY, JSON.stringify([...set].sort()));
}

/** Consecutive-day streak ending today (or yesterday if today not yet trained). */
export function getStreak(): number {
  const set = new Set(getCompletions());
  let streak = 0;
  const d = new Date();
  if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1); // today not done yet — count from yesterday
  while (set.has(dateKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** Total distinct days trained. */
export function getTotalDays(): number {
  return new Set(getCompletions()).size;
}

/** Boolean map of the last 7 days (oldest first): true = trained that day. */
export function getLast7Days(): boolean[] {
  const set = new Set(getCompletions());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return set.has(dateKey(d));
  });
}