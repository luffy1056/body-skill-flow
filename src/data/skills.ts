export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ProgressionLevel {
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
}

export interface SkillData {
  slug: string;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  currentLevel: number;
  levels: ProgressionLevel[];
  locked?: boolean;
}

function buildLevels(
  names: string[],
  reps: string[],
  sets: number[],
  currentLevel: number,
): ProgressionLevel[] {
  return names.map((name, i) => ({
    name,
    sets: sets[i] ?? 3,
    reps: reps[i] ?? "8",
    completed: i + 1 < currentLevel,
  }));
}

export const freeSkills: SkillData[] = [
  {
    slug: "muscle-up",
    name: "Muscle Up",
    emoji: "💪",
    difficulty: "Intermediate",
    currentLevel: 5,
    levels: buildLevels(
      [
        "Australian Pull-Ups",
        "Negative Pull-Ups",
        "Full Pull-Ups",
        "Explosive Pull-Ups",
        "Chest-to-Bar Pull-Ups",
        "Assisted Muscle-Up",
        "Strict Muscle-Up",
      ],
      ["12", "5", "8", "5", "5", "3", "3"],
      [3, 4, 4, 4, 4, 3, 3],
      5,
    ),
  },
  {
    slug: "planche",
    name: "Planche",
    emoji: "🤸",
    difficulty: "Advanced",
    currentLevel: 2,
    levels: buildLevels(
      [
        "Planche Lean",
        "Tuck Planche",
        "Advanced Tuck Planche",
        "Straddle Planche",
        "Half Lay Planche",
        "Full Planche",
      ],
      ["30s", "20s", "15s", "10s", "8s", "5s"],
      [4, 4, 4, 3, 3, 3],
      2,
    ),
  },
  {
    slug: "front-lever",
    name: "Front Lever",
    emoji: "🦅",
    difficulty: "Intermediate",
    currentLevel: 3,
    levels: buildLevels(
      [
        "Tuck Front Lever",
        "Advanced Tuck Front Lever",
        "Single Leg Front Lever",
        "Straddle Front Lever",
        "Full Front Lever",
      ],
      ["20s", "15s", "12s", "10s", "8s"],
      [4, 4, 3, 3, 3],
      3,
    ),
  },
  {
    slug: "back-lever",
    name: "Back Lever",
    emoji: "🪽",
    difficulty: "Intermediate",
    currentLevel: 4,
    levels: buildLevels(
      [
        "Skin the Cat",
        "Tuck Back Lever",
        "Advanced Tuck Back Lever",
        "Straddle Back Lever",
        "Full Back Lever",
      ],
      ["8", "20s", "15s", "10s", "8s"],
      [3, 4, 4, 3, 3],
      4,
    ),
  },
  {
    slug: "pistol-squat",
    name: "Pistol Squat",
    emoji: "🦵",
    difficulty: "Beginner",
    currentLevel: 5,
    levels: buildLevels(
      [
        "Assisted Squats",
        "Bulgarian Split Squat",
        "Box Pistol Squat",
        "Assisted Pistol Squat",
        "Full Pistol Squat",
      ],
      ["15", "10", "8", "6", "5"],
      [3, 3, 4, 4, 4],
      5,
    ),
  },
  {
    slug: "handstand-push-up",
    name: "Handstand Push-Up",
    emoji: "🙃",
    difficulty: "Advanced",
    currentLevel: 2,
    levels: buildLevels(
      [
        "Pike Push-Up",
        "Elevated Pike Push-Up",
        "Wall Handstand Hold",
        "Negative HSPU",
        "Full HSPU",
      ],
      ["10", "8", "30s", "5", "5"],
      [3, 3, 4, 4, 4],
      2,
    ),
  },
  {
    slug: "v-sit",
    name: "V-Sit",
    emoji: "🧘",
    difficulty: "Advanced",
    currentLevel: 1,
    levels: buildLevels(
      [
        "L-Sit Tucked",
        "Full L-Sit",
        "Advanced L-Sit",
        "V-Sit Hold",
        "Full V-Sit",
      ],
      ["15s", "10s", "10s", "5s", "5s"],
      [4, 4, 3, 3, 3],
      1,
    ),
  },
];

export const proSkills: SkillData[] = [
  {
    slug: "one-arm-pull-up",
    name: "One Arm Pull-Up",
    emoji: "🏋️",
    difficulty: "Advanced",
    currentLevel: 0,
    locked: true,
    levels: [],
  },
  {
    slug: "human-flag",
    name: "Human Flag",
    emoji: "🚩",
    difficulty: "Advanced",
    currentLevel: 0,
    locked: true,
    levels: [],
  },
  {
    slug: "one-arm-push-up",
    name: "One Arm Push-Up",
    emoji: "👊",
    difficulty: "Intermediate",
    currentLevel: 0,
    locked: true,
    levels: [],
  },
  {
    slug: "dragon-flag",
    name: "Dragon Flag",
    emoji: "🐉",
    difficulty: "Advanced",
    currentLevel: 0,
    locked: true,
    levels: [],
  },
  {
    slug: "hefesto",
    name: "Hefesto",
    emoji: "⚒️",
    difficulty: "Advanced",
    currentLevel: 0,
    locked: true,
    levels: [],
  },
];

export const allSkills = [...freeSkills, ...proSkills];

export function getSkillBySlug(slug: string): SkillData | undefined {
  return allSkills.find((s) => s.slug === slug);
}