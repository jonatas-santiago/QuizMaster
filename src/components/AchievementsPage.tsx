import { achievements } from "@/data/achievements";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsPageProps {
  unlockedKeys: Set<string>;
  onBack: () => void;
}

export const AchievementsPage = ({ unlockedKeys, onBack }: AchievementsPageProps) => {
  const unlocked = achievements.filter(a => unlockedKeys.has(a.key));
  const progress = Math.round((unlocked.length / achievements.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="rounded-xl p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-2xl font-black text-foreground">🏆 Conquistas</h1>
      </div>

      <div className="mb-6 rounded-2xl bg-primary/10 p-4 text-center">
        <p className="font-heading text-lg font-bold text-primary">
          {unlocked.length} / {achievements.length}
        </p>
        <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {achievements.map(a => {
          const isUnlocked = unlockedKeys.has(a.key);
          return (
            <div
              key={a.key}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 p-4 transition-all",
                isUnlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-muted bg-muted/30 opacity-60"
              )}
            >
              <span className="text-3xl">{isUnlocked ? a.emoji : "🔒"}</span>
              <div className="flex-1">
                <p className={cn("font-heading font-bold", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                  {a.title}
                </p>
                <p className="text-sm text-muted-foreground">{a.description}</p>
              </div>
              {isUnlocked && <span className="text-xs text-primary font-bold">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
