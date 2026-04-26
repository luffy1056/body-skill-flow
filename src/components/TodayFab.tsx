import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { freeSkills } from "@/data/skills";
import { getProfile, getPrimarySkill } from "@/lib/profile";

/**
 * Floating "Today's Workout" shortcut shown above the bottom nav.
 * Routes to /workout with the user's primary skill (or first free skill).
 */
export function TodayFab() {
  const [skillSlug, setSkillSlug] = useState<string>(freeSkills[0].slug);
  const [level, setLevel] = useState<number>(freeSkills[0].currentLevel || 1);
  const [name, setName] = useState<string>(freeSkills[0].name);

  useEffect(() => {
    const profile = getProfile();
    const skill = profile ? getPrimarySkill(profile.primarySkill) : freeSkills[0];
    setSkillSlug(skill.slug);
    setLevel(skill.currentLevel || 1);
    setName(skill.name);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-[80px] left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-5 md:max-w-2xl">
      <div className="pointer-events-auto flex justify-end">
        <Link
          to="/workout"
          search={{ slug: skillSlug, level }}
          className="animate-float-in group flex items-center gap-2.5 rounded-full bg-primary py-3 pl-4 pr-5 font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:bg-primary-glow active:scale-95"
          aria-label={`Start today's workout: ${name}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15">
            <Play className="h-3.5 w-3.5 translate-x-px fill-current" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider">
            Today's Workout
          </span>
        </Link>
      </div>
    </div>
  );
}