import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Crown, ChevronRight, Settings, Bell, HelpCircle, LogOut } from "lucide-react";

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
      <div className="p-6 pb-8">
        <h1 className="text-3xl font-black tracking-tight">Profile</h1>

        <Link to="/pro" className="mt-6 block">
          <Card
            className="relative overflow-hidden border-0 p-5"
            style={{
              background:
                "radial-gradient(120% 100% at 100% 0%, oklch(0.85 0.18 95 / 0.25) 0%, transparent 60%), linear-gradient(135deg, oklch(0.235 0 0) 0%, oklch(0.196 0 0) 100%)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.85 0.18 95), oklch(0.82 0.22 148))",
                }}
              >
                <Crown className="h-6 w-6 text-background" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="text-base font-black tracking-tight">Upgrade to Pro</div>
                <div className="text-xs text-muted-foreground">
                  Unlock AI coaching & 7 pro skills
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>

        <div className="mt-6 space-y-2">
          <ProfileRow icon={Settings} label="Settings" />
          <ProfileRow icon={Bell} label="Notifications" />
          <ProfileRow icon={HelpCircle} label="Help & Support" />
          <ProfileRow icon={LogOut} label="Sign out" />
        </div>
      </div>
    </AppShell>
  );
}

function ProfileRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition hover:bg-card-elevated"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
