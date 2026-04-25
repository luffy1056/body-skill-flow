import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — SkillFlow" },
      { name: "description", content: "Browse and master calisthenics skills." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-3xl font-black tracking-tight">Skills</h1>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </div>
    </AppShell>
  );
}