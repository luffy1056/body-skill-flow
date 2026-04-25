import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — SkillFlow" },
      { name: "description", content: "Track your skill progression." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-3xl font-black tracking-tight">Progress</h1>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </div>
    </AppShell>
  );
}