import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Clock } from "lucide-react";
import { Subject, subjectConfig } from "@/data/quizQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderEntry {
  user_id: string;
  display_name: string;
  total_quizzes: number;
  avg_time: number;
  avg_percent: number;
}

function getPercentLabel(pct: number) {
  if (pct >= 100) return { text: "Albert Einstein 🧠✨", color: "text-yellow-500" };
  if (pct >= 90) return { text: "Muito bom 🔥", color: "text-purple-500" };
  if (pct >= 80) return { text: "Bom 👏", color: "text-purple-400" };
  if (pct >= 70) return { text: "Normal 👍", color: "text-blue-500" };
  if (pct >= 60) return { text: "Mais ou menos", color: "text-blue-400" };
  if (pct >= 50) return { text: "Ruim", color: "text-green-500" };
  if (pct >= 40) return { text: "Muito ruim", color: "text-green-400" };
  return { text: "Estudando… 📚", color: "text-orange-400" };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const medals = ["🥇", "🥈", "🥉"];

const LeaderList = ({ leaders, loading }: { leaders: LeaderEntry[]; loading: boolean }) => {
  if (loading) {
    return <p className="py-4 text-center text-sm text-muted-foreground">Carregando...</p>;
  }
  if (leaders.length === 0) {
    return (
      <p className="flex flex-col items-center gap-1 py-4 text-center text-sm text-muted-foreground">
        <Trophy className="h-5 w-5" />
        Nenhuma lição completada ainda.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {leaders.map((entry, i) => (
        <div key={entry.user_id} className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
          <span className="text-2xl">{medals[i]}</span>
          <span className="flex-1 font-heading font-bold text-foreground">{entry.display_name}</span>
          <div className="flex flex-col items-end gap-0.5">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {entry.total_quizzes} {entry.total_quizzes === 1 ? "lição" : "lições"}
            </span>
            {entry.avg_time > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" /> média {formatTime(Math.round(entry.avg_time))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Leaderboard = () => {
  const [tab, setTab] = useState("geral");
  const [data, setData] = useState<Record<string, LeaderEntry[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: completions } = await supabase
        .from("quiz_completions")
        .select("user_id, subject, time_seconds");

      if (!completions || completions.length === 0) {
        setLoading(false);
        return;
      }

      // Get all unique user ids
      const userIds = [...new Set(completions.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string> = {};
      profiles?.forEach(p => { profileMap[p.user_id] = p.display_name || "Anônimo"; });

      // Build per-subject + geral
      const buildTop3 = (entries: typeof completions): LeaderEntry[] => {
        const agg: Record<string, { count: number; totalTime: number }> = {};
        entries.forEach(c => {
          if (!agg[c.user_id]) agg[c.user_id] = { count: 0, totalTime: 0 };
          agg[c.user_id].count++;
          agg[c.user_id].totalTime += (c.time_seconds || 0);
        });
        return Object.entries(agg)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 3)
          .map(([uid, v]) => ({
            user_id: uid,
            display_name: profileMap[uid] || "Anônimo",
            total_quizzes: v.count,
            avg_time: v.count > 0 ? v.totalTime / v.count : 0,
          }));
      };

      const result: Record<string, LeaderEntry[]> = { geral: buildTop3(completions) };
      const subjects: Subject[] = ["matematica", "historia", "geografia", "ciencias", "portugues"];
      subjects.forEach(s => {
        result[s] = buildTop3(completions.filter(c => c.subject === s));
      });

      setData(result);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const tabs: { key: string; label: string }[] = [
    { key: "geral", label: "🏆 Geral" },
    ...Object.entries(subjectConfig).map(([key, cfg]) => ({ key, label: `${cfg.emoji} ${cfg.label}` })),
  ];

  return (
    <div className="w-full rounded-2xl border-2 border-primary/20 bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
        <Trophy className="h-5 w-5 text-primary" /> Ranking Top 3
      </h2>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-3 flex w-full flex-wrap gap-1 h-auto bg-transparent p-0">
          {tabs.map(t => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(t => (
          <TabsContent key={t.key} value={t.key}>
            <LeaderList leaders={data[t.key] || []} loading={loading} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
