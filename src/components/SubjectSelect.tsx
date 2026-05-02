import { Subject, subjectConfig } from "@/data/quizQuestions";
import { cn } from "@/lib/utils";
import { Leaderboard } from "./Leaderboard";

interface SubjectSelectProps {
  onSelect: (subject: Subject) => void;
  stats: Record<Subject, { correct: number; total: number; streak: number }>;
  onShowAchievements?: () => void;
  onShowProfile?: () => void;
  onShowAdmin?: () => void;
}

export const SubjectSelect = ({ onSelect, stats, onShowAchievements, onShowProfile, onShowAdmin }: SubjectSelectProps) => {
  const subjects = Object.entries(subjectConfig) as [Subject, typeof subjectConfig[Subject]][];

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-black tracking-tight text-foreground">
          🎓 QuizMaster
        </h1>
        <p className="mt-2 font-body text-lg text-muted-foreground">
          Escolha uma matéria e teste seus conhecimentos!
        </p>
      </div>

      <div className="grid w-full gap-3">
        {subjects.map(([key, config]) => {
          const s = stats[key];
          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;

          const isAvailable = true;

          return (
            <button
              key={key}
              onClick={() => isAvailable && onSelect(key)}
              disabled={!isAvailable}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border-2 border-quiz-option-border bg-card p-5",
                "transition-all duration-200",
                isAvailable
                  ? "hover:border-primary hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              <span className="text-3xl">{config.emoji}</span>
              <div className="flex-1 text-left">
                <span className="font-heading text-lg font-bold text-foreground">{config.label}</span>
                {!isAvailable && (
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    Em produção! 🚧
                  </span>
                )}
                {isAvailable && s.total > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                )}
              </div>
              {isAvailable && s.streak >= 3 && (
                <span className="rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                  🔥 {s.streak}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        {onShowProfile && (
          <button
            onClick={onShowProfile}
            className="flex items-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-3 font-heading font-bold text-primary transition-all hover:bg-primary/10 hover:shadow-lg"
          >
            👤 Perfil
          </button>
        )}
        {onShowAchievements && (
          <button
            onClick={onShowAchievements}
            className="flex items-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-3 font-heading font-bold text-primary transition-all hover:bg-primary/10 hover:shadow-lg"
          >
            🏆 Conquistas
          </button>
        )}
        {onShowAdmin && (
          <button
            onClick={onShowAdmin}
            className="flex items-center gap-2 rounded-2xl border-2 border-destructive/40 bg-destructive/5 px-6 py-3 font-heading font-bold text-destructive transition-all hover:bg-destructive/10 hover:shadow-lg"
          >
            🛡️ Admin
          </button>
        )}
      </div>

      <Leaderboard />
    </div>
  );
};
