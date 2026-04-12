import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal } from "lucide-react";

interface LeaderEntry {
  user_id: string;
  display_name: string;
  total_quizzes: number;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Get quiz completion counts per user
      const { data: completions } = await supabase
        .from("quiz_completions")
        .select("user_id");

      if (!completions || completions.length === 0) {
        setLoading(false);
        return;
      }

      // Count per user
      const counts: Record<string, number> = {};
      completions.forEach((c) => {
        counts[c.user_id] = (counts[c.user_id] || 0) + 1;
      });

      // Get top 3 user_ids
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const userIds = sorted.map(([id]) => id);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string> = {};
      profiles?.forEach((p) => {
        profileMap[p.user_id] = p.display_name || "Anônimo";
      });

      const result: LeaderEntry[] = sorted.map(([id, count]) => ({
        user_id: id,
        display_name: profileMap[id] || "Anônimo",
        total_quizzes: count,
      }));

      setLeaders(result);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return (
      <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-center text-muted-foreground">
        Carregando ranking...
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="w-full rounded-2xl border-2 border-border bg-card p-4 text-center text-muted-foreground">
        <Trophy className="mx-auto mb-2 h-6 w-6" />
        Nenhuma lição completada ainda. Seja o primeiro!
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border-2 border-primary/20 bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
        <Trophy className="h-5 w-5 text-primary" /> Top 3 Jogadores
      </h2>
      <div className="flex flex-col gap-2">
        {leaders.map((entry, i) => (
          <div
            key={entry.user_id}
            className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3"
          >
            <span className="text-2xl">{medals[i]}</span>
            <span className="flex-1 font-heading font-bold text-foreground">
              {entry.display_name}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              {entry.total_quizzes} {entry.total_quizzes === 1 ? "lição" : "lições"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
