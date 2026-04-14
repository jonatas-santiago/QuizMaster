import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Subject, subjectConfig } from "@/data/quizQuestions";
import { ArrowLeft, Camera, Trophy, Clock, BookOpen, Star, LogOut } from "lucide-react";
import { toast } from "sonner";

interface CompletionRow {
  subject: string;
  score: number;
  total_questions: number;
  time_seconds: number | null;
  completed_at: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function getPercentLabel(pct: number) {
  if (pct >= 100) return "Albert Einstein 🧠✨";
  if (pct >= 90) return "Muito bom 🔥";
  if (pct >= 80) return "Bom 👏";
  if (pct >= 70) return "Normal 👍";
  if (pct >= 60) return "Mais ou menos";
  if (pct >= 50) return "Ruim";
  if (pct >= 40) return "Muito ruim";
  if (pct >= 30) return "Estude bastante 📚";
  if (pct >= 20) return "Procure um professor 👨‍🏫";
  if (pct >= 10) return "Ainda está no primeiro ano?";
  return "Você errou de propósito? 😅";
}

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage = ({ onBack }: ProfilePageProps) => {
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [completions, setCompletions] = useState<CompletionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, completionsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("user_id", user.id).single(),
        supabase.from("quiz_completions").select("subject, score, total_questions, time_seconds, completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setDisplayName(profileRes.data.display_name || "Anônimo");
        setAvatarUrl(profileRes.data.avatar_url);
      }
      if (completionsRes.data) {
        setCompletions(completionsRes.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error("Erro ao enviar foto.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const url = urlData.publicUrl + "?t=" + Date.now();

    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    setAvatarUrl(url);
    setUploading(false);
    toast.success("Foto atualizada!");
  };

  // Stats calculations
  const totalQuizzes = completions.length;
  const totalCorrect = completions.reduce((s, c) => s + c.score, 0);
  const totalQuestions = completions.reduce((s, c) => s + c.total_questions, 0);
  const avgPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalTime = completions.reduce((s, c) => s + (c.time_seconds || 0), 0);

  // Favorite subject
  const subjectCounts: Record<string, number> = {};
  completions.forEach(c => {
    subjectCounts[c.subject] = (subjectCounts[c.subject] || 0) + 1;
  });
  const favoriteSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0];
  const favConfig = favoriteSubject ? subjectConfig[favoriteSubject[0] as Subject] : null;

  // Per-subject stats
  const subjectStats = Object.entries(subjectConfig).map(([key, cfg]) => {
    const subComps = completions.filter(c => c.subject === key);
    const correct = subComps.reduce((s, c) => s + c.score, 0);
    const total = subComps.reduce((s, c) => s + c.total_questions, 0);
    const pct = total > 0 ? Math.round((correct / total) * 100) : -1;
    return { key, cfg, count: subComps.length, pct };
  }).filter(s => s.count > 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-xl bg-muted p-2 text-foreground transition hover:bg-muted/80">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 font-heading text-xl font-bold text-foreground">Meu Perfil</h1>
        <button
          onClick={async () => { await signOut(); onBack(); }}
          className="flex items-center gap-1 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive transition hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/30 bg-muted">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">
                {displayName.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition hover:bg-primary/90"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
        </div>
        <h2 className="font-heading text-2xl font-black text-foreground">{displayName}</h2>
        <p className="text-sm text-muted-foreground">{getPercentLabel(avgPercent)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-primary/20 bg-card p-4">
          <Trophy className="h-5 w-5 text-primary" />
          <span className="text-2xl font-black text-foreground">{totalQuizzes}</span>
          <span className="text-xs text-muted-foreground">Lições feitas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-primary/20 bg-card p-4">
          <Star className="h-5 w-5 text-primary" />
          <span className="text-2xl font-black text-foreground">{avgPercent}%</span>
          <span className="text-xs text-muted-foreground">Média geral</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-primary/20 bg-card p-4">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-2xl font-black text-foreground">{formatTime(totalTime)}</span>
          <span className="text-xs text-muted-foreground">Tempo total</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-primary/20 bg-card p-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-2xl font-black text-foreground">
            {favConfig ? `${favConfig.emoji}` : "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {favConfig ? favConfig.label : "Nenhuma ainda"}
          </span>
        </div>
      </div>

      {/* Per-subject performance */}
      {subjectStats.length > 0 && (
        <div className="rounded-2xl border-2 border-primary/20 bg-card p-4">
          <h3 className="mb-3 font-heading font-bold text-foreground">Desempenho por Matéria</h3>
          <div className="flex flex-col gap-2">
            {subjectStats.map(s => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="text-lg">{s.cfg.emoji}</span>
                <span className="flex-1 text-sm font-semibold text-foreground">{s.cfg.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-muted-foreground">{s.pct}%</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent history */}
      <div className="rounded-2xl border-2 border-primary/20 bg-card p-4">
        <h3 className="mb-3 font-heading font-bold text-foreground">Histórico Recente</h3>
        {completions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Nenhuma lição feita ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {completions.slice(0, 10).map((c, i) => {
              const cfg = subjectConfig[c.subject as Subject];
              const pct = c.total_questions > 0 ? Math.round((c.score / c.total_questions) * 100) : 0;
              const date = new Date(c.completed_at);
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
                  <span className="text-lg">{cfg?.emoji || "📖"}</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground">{cfg?.label || c.subject}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {date.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {pct}%
                  </span>
                  {c.time_seconds != null && c.time_seconds > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {formatTime(c.time_seconds)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
