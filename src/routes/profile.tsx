import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SkillFlow" },
      { name: "description", content: "Your SkillFlow profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-3xl font-black tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </div>
    </AppShell>
  );
}