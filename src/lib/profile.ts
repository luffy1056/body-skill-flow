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