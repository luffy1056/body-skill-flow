import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workouts — SkillFlow" },
      { name: "description", content: "Your daily calisthenics workouts." },
    ],
  }),
  component: WorkoutsPage,
});

function WorkoutsPage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-3xl font-black tracking-tight">Workouts</h1>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </div>
    </AppShell>
  );
}