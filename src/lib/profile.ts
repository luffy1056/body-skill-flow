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