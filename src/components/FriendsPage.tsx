import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Check, X, Swords, Search, Trophy, Users, Eye } from "lucide-react";
import { toast } from "sonner";
import { Subject, subjectConfig } from "@/data/quizQuestions";

interface FriendsPageProps {
  onBack: () => void;
  onChallenge: (roomCode: string, subject: Subject) => void;
}

interface Profile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
}

interface FriendStats {
  total_quizzes: number;
  total_points: number;
  avg_score: number;
  achievements: number;
}

export const FriendsPage = ({ onBack, onChallenge }: FriendsPageProps) => {
  const { user } = useAuth();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [stats, setStats] = useState<Map<string, FriendStats>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [tab, setTab] = useState<"friends" | "requests" | "search" | "ranking">("friends");
  const [challengeOpen, setChallengeOpen] = useState<{ friendId: string; friendName: string } | null>(null);

  const loadData = async () => {
    if (!user) return;

    const { data: fs } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (!fs) {
      setFriendships([]);
      setProfiles(new Map());
      setStats(new Map());
      return;
    }
    setFriendships(fs);

    const otherIds = [...new Set(fs.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id))];
    const idsToLoad = [...new Set([...otherIds, user.id])];
    if (idsToLoad.length === 0) {
      setProfiles(new Map());
      setStats(new Map());
      return;
    }

    const { data: profs } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", idsToLoad);

    const profMap = new Map<string, Profile>();
    profs?.forEach(p => profMap.set(p.user_id, p));
    setProfiles(profMap);

    // Stats dos amigos aceitos
    const acceptedIds = otherIds.filter(id => 
      fs.some(f => f.status === "accepted" && (f.requester_id === id || f.addressee_id === id))
    );
    const statsIds = [...new Set([...acceptedIds, user.id])];
    if (statsIds.length > 0) {
      const { data: comps } = await supabase
        .from("quiz_completions")
        .select("user_id, score, total_questions, points")
        .in("user_id", statsIds);
      const { data: achs } = await supabase
        .from("user_achievements")
        .select("user_id")
        .in("user_id", statsIds);

      const statMap = new Map<string, FriendStats>();
      statsIds.forEach(id => {
        const userComps = comps?.filter(c => c.user_id === id) || [];
        const totalQ = userComps.reduce((s, c) => s + (c.total_questions || 0), 0);
        const totalS = userComps.reduce((s, c) => s + (c.score || 0), 0);
        statMap.set(id, {
          total_quizzes: userComps.length,
          total_points: userComps.reduce((s, c) => s + (c.points || 10), 0),
          avg_score: totalQ > 0 ? Math.round((totalS / totalQ) * 100) : 0,
          achievements: achs?.filter(a => a.user_id === id).length || 0,
        });
      });
      setStats(statMap);
    } else {
      setStats(new Map());
    }
  };

  useEffect(() => {
    loadData();
    if (!user) return;
    const channel = supabase
      .channel(`friends-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .ilike("display_name", `%${searchTerm.trim()}%`)
      .neq("user_id", user.id)
      .limit(20);
    setSearchResults(data || []);
  };

  const sendRequest = async (addresseeId: string) => {
    if (!user) return;
    // Verificar se já existe
    const existing = friendships.find(f =>
      (f.requester_id === user.id && f.addressee_id === addresseeId) ||
      (f.requester_id === addresseeId && f.addressee_id === user.id)
    );
    if (existing) {
      toast.error("Já existe uma conexão com este usuário");
      return;
    }
    const { error } = await supabase.from("friendships").insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      status: "pending",
    });
    if (error) {
      toast.error("Erro ao enviar pedido");
    } else {
      toast.success("Pedido enviado!");
      loadData();
    }
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("friendships").update({ status }).eq("id", id);
    if (error) {
      toast.error("Erro ao responder pedido");
      return;
    }
    toast.success(status === "accepted" ? "Amigo adicionado! 🎉" : "Pedido recusado");
    loadData();
  };

  const removeFriend = async (id: string) => {
    await supabase.from("friendships").delete().eq("id", id);
    toast.success("Amizade removida");
    loadData();
  };

  const challenge = async (friendId: string, friendName: string, subject: Subject) => {
    if (!user) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const qs = (await import("@/data/quizQuestions")).getQuestionsForSubject(subject, 1);
    const shuffled = (await import("@/data/quizQuestions")).shuffleArray(qs).slice(0, 5);

    const { data: match, error: matchErr } = await supabase.from("matches").insert({
      room_code: code,
      player1_id: user.id,
      subject,
      difficulty: 1,
      questions: shuffled as any,
      status: "waiting",
    }).select().single();

    if (matchErr || !match) {
      toast.error("Erro ao criar partida");
      return;
    }

    await supabase.from("match_invites").insert({
      from_user_id: user.id,
      to_user_id: friendId,
      room_code: code,
      subject,
      difficulty: 1,
    });

    toast.success(`Convite enviado para ${friendName}!`);
    setChallengeOpen(null);
    // Entra como host na sala criada — Index navegará para a tela 1v1
    onChallenge(code, subject);
  };

  if (!user) return null;

  const accepted = friendships.filter(f => f.status === "accepted");
  const pendingIncoming = friendships.filter(f => f.status === "pending" && f.addressee_id === user.id);
  const pendingOutgoing = friendships.filter(f => f.status === "pending" && f.requester_id === user.id);

  // Ranking entre amigos (incluindo o próprio user)
  const rankingList = accepted.map(f => {
    const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
    return { id: otherId, name: profiles.get(otherId)?.display_name || "Amigo", stats: stats.get(otherId) };
  });

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-xl p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-2xl font-black text-foreground">👥 Amigos</h1>
      </div>

      {/* Tabs */}
      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-muted p-1">
        {[
          { k: "friends" as const, l: "Amigos", icon: Users },
          { k: "requests" as const, l: `Pedidos${pendingIncoming.length ? ` (${pendingIncoming.length})` : ""}`, icon: UserPlus },
          { k: "search" as const, l: "Buscar", icon: Search },
          { k: "ranking" as const, l: "Ranking", icon: Trophy },
        ].map(({ k, l, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 font-heading text-xs font-bold transition-all ${
              tab === k ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{l}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {tab === "friends" && (
          accepted.length === 0 ? (
            <p className="py-12 text-center font-body text-muted-foreground">
              Nenhum amigo ainda. Use a aba <strong>Buscar</strong> para encontrar pessoas!
            </p>
          ) : accepted.map(f => {
            const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
            const prof = profiles.get(otherId);
            const st = stats.get(otherId);
            return (
              <div key={f.id} className="rounded-2xl border-2 border-quiz-option-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-bold text-primary">
                    {prof?.display_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-foreground">{prof?.display_name || "Amigo"}</p>
                    {st && (
                      <p className="text-xs text-muted-foreground">
                        {st.total_points} pts • {st.total_quizzes} quizzes • {st.avg_score}% acerto • {st.achievements} 🏆
                      </p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => setChallengeOpen({ friendId: otherId, friendName: prof?.display_name || "Amigo" })} className="rounded-xl">
                    <Swords className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeFriend(f.id)} className="rounded-xl text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}

        {tab === "requests" && (
          <>
            {pendingIncoming.length === 0 && pendingOutgoing.length === 0 && (
              <p className="py-12 text-center font-body text-muted-foreground">Nenhum pedido pendente</p>
            )}
            {pendingIncoming.length > 0 && (
              <>
                <h3 className="font-heading text-sm font-bold uppercase text-muted-foreground">Recebidos</h3>
                {pendingIncoming.map(f => {
                  const prof = profiles.get(f.requester_id);
                  return (
                    <div key={f.id} className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                        {prof?.display_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <p className="flex-1 font-heading font-bold text-foreground">{prof?.display_name || "Usuário"}</p>
                      <Button size="sm" onClick={() => respond(f.id, "accepted")} className="rounded-xl">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => respond(f.id, "declined")} className="rounded-xl">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
            {pendingOutgoing.length > 0 && (
              <>
                <h3 className="mt-4 font-heading text-sm font-bold uppercase text-muted-foreground">Enviados</h3>
                {pendingOutgoing.map(f => {
                  const prof = profiles.get(f.addressee_id);
                  return (
                    <div key={f.id} className="flex items-center gap-3 rounded-2xl border-2 border-quiz-option-border bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                        {prof?.display_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <p className="flex-1 font-heading font-bold text-foreground">{prof?.display_name || "Usuário"}</p>
                      <span className="text-xs font-semibold text-muted-foreground">Aguardando...</span>
                      <Button size="sm" variant="ghost" onClick={() => removeFriend(f.id)} className="rounded-xl text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {tab === "search" && (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="rounded-xl"
              />
              <Button onClick={handleSearch} className="rounded-xl">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searchResults.map(p => {
              const existing = friendships.find(f =>
                f.requester_id === p.user_id || f.addressee_id === p.user_id
              );
              return (
                <div key={p.user_id} className="flex items-center gap-3 rounded-2xl border-2 border-quiz-option-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {p.display_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <p className="flex-1 font-heading font-bold text-foreground">{p.display_name}</p>
                  {existing ? (
                    existing.status === "pending" && existing.addressee_id === user.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => respond(existing.id, "accepted")} className="rounded-xl">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => respond(existing.id, "declined")} className="rounded-xl">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {existing.status === "accepted" ? "✅ Amigos" : "⏳ Pendente"}
                      </span>
                    )
                  ) : (
                    <Button size="sm" onClick={() => sendRequest(p.user_id)} className="rounded-xl">
                      <UserPlus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tab === "ranking" && (
          rankingList.length === 0 ? (
            <p className="py-12 text-center font-body text-muted-foreground">Adicione amigos para ver o ranking!</p>
          ) : (
            [
              { id: user.id, name: profiles.get(user.id)?.display_name || "Você", stats: stats.get(user.id), isMe: true },
              ...rankingList.map(r => ({ ...r, isMe: false })),
            ]
              .filter(r => r.stats)
              .sort((a, b) => (b.stats?.total_points || 0) - (a.stats?.total_points || 0) || (b.stats?.avg_score || 0) - (a.stats?.avg_score || 0))
              .map((r, i) => (
                <div key={r.id} className={`flex items-center gap-3 rounded-2xl border-2 p-4 ${
                  i < 3 ? "border-primary/30 bg-primary/5" : "border-quiz-option-border bg-card"
                }`}>
                  <span className="font-heading text-2xl font-black w-8">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-foreground">{r.name}{r.isMe ? " (você)" : ""}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.stats?.total_quizzes} quizzes • {r.stats?.avg_score}% acerto • {r.stats?.achievements} 🏆
                    </p>
                  </div>
                  <span className="font-heading text-xl font-black text-primary">{r.stats?.total_points} pts</span>
                </div>
              ))
          )
        )}
      </div>

      {/* Modal de desafio */}
      {challengeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setChallengeOpen(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-xl font-black text-foreground">⚔️ Desafiar {challengeOpen.friendName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Escolha a matéria do desafio:</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(Object.entries(subjectConfig) as [Subject, typeof subjectConfig[Subject]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => challenge(challengeOpen.friendId, challengeOpen.friendName, key)}
                  className="flex items-center gap-2 rounded-xl border-2 border-quiz-option-border bg-card p-3 transition-all hover:border-primary"
                >
                  <span className="text-xl">{cfg.emoji}</span>
                  <span className="font-heading text-sm font-bold text-foreground">{cfg.label}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full rounded-xl" onClick={() => setChallengeOpen(null)}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  );
};
