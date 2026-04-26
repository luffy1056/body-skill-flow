import { toast } from "sonner";

const baseStyle = {
  background: "oklch(0.196 0 0)",
  border: "1px solid oklch(0.82 0.22 148 / 0.4)",
  color: "oklch(0.985 0 0)",
};

export function toastWorkoutLogged(detail?: string) {
  toast.success("Workout Logged!", {
    description: detail ?? "Nice work — your session is saved.",
    style: baseStyle,
  });
}

export function toastLevelUp(skillName: string, level: number) {
  toast("Level Up! 🎉", {
    description: `${skillName} → Level ${level}. Keep climbing.`,
    style: {
      ...baseStyle,
      border: "1px solid oklch(0.85 0.18 95 / 0.5)",
    },
  });
}

export function toastStreakExtended(days: number) {
  toast("Streak Extended! 🔥", {
    description: `${days} day${days === 1 ? "" : "s"} strong. Don't break the chain.`,
    style: baseStyle,
  });
}