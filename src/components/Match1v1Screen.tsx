import { useState, useCallback, useEffect, useRef } from "react";
import { Subject, subjectConfig, Question, shuffleArray, getQuestionsForSubject } from "@/data/quizQuestions";
import { QuizOption } from "./QuizOption";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Heart, Clock, Copy, Loader2, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const QUESTIONS_PER_ROUND = 5;
const MAX_LIVES = 3;

interface Match1v1ScreenProps {
  subject: Subject;
  difficulty: number;
  onBack: () => void;
  roomCode?: string; // if joining existing room
}

type MatchStatus = "creating" | "waiting" | "playing" | "finished";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export const Match1v1Screen = ({ subject, difficulty, onBack, roomCode: joinCode }: Match1v1ScreenProps) => {
  const { user } = useAuth();
  const config = subjectConfig[subject];

  const [status, setStatus] = useState<MatchStatus>(joinCode ? "creating" : "creating");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState(joinCode || "");
  const [isPlayer1, setIsPlayer1] = useState(!joinCode);
  const [opponentName, setOpponentName] = useState("");

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Opponent progress
  const [opponentCurrent, setOpponentCurrent] = useState(0);
  const [opponentFinished, setOpponentFinished] = useState(false);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentTime, setOpponentTime] = useState(0);
  const [myFinished, setMyFinished] = useState(false);

  // Create or join room
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      if (joinCode) {
        // Join existing room
        const { data: match, error } = await supabase
          .from("matches")
          .select("*")
          .eq("room_code", joinCode)
          .eq("status", "waiting")
          .single();

        if (error || !match) {
          toast.error("Sala não encontrada ou já iniciada");
          onBack();
          return;
        }

        // Update match with player2
        await supabase.from("matches").update({
          player2_id: user.id,
          status: "playing",
        }).eq("id", match.id);

        setMatchId(match.id);
        setIsPlayer1(false);
        setRoomCode(joinCode);

        // Parse questions from match
        const matchQuestions = (match.questions as any[]).map((q: any) => q as Question);
        setQuestions(matchQuestions);

        // Get opponent name
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", match.player1_id)
          .single();
        setOpponentName(profile?.display_name || "Oponente");

        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
        setStatus("playing");
      } else {
        // Create new room
        const code = generateRoomCode();
        const qs = shuffleArray(getQuestionsForSubject(subject, difficulty)).slice(0, QUESTIONS_PER_ROUND);

        const { data, error } = await supabase.from("matches").insert({
          room_code: code,
          player1_id: user.id,
          subject,
          difficulty,
          questions: qs as any,
          status: "waiting",
        }).select().single();

        if (error) {
          toast.error("Erro ao criar sala");
          onBack();
          return;
        }

        setMatchId(data.id);
        setRoomCode(code);
        setQuestions(qs);
        setStatus("waiting");
      }
    };

    init();
    return () => clearInterval(timerRef.current);
  }, [user, joinCode, subject, difficulty, onBack]);

  // Subscribe to match changes
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`match-${matchId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "matches",
        filter: `id=eq.${matchId}`,
      }, async (payload) => {
        const match = payload.new as any;

        if (match.status === "playing" && status === "waiting") {
          // Opponent joined!
          const opponentId = isPlayer1 ? match.player2_id : match.player1_id;
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", opponentId)
            .single();
          setOpponentName(profile?.display_name || "Oponente");

          startTimeRef.current = Date.now();
          timerRef.current = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
          }, 1000);
          setStatus("playing");
        }

        // Update opponent progress
        if (isPlayer1) {
          setOpponentCurrent(match.player2_current);
          setOpponentFinished(match.player2_finished);
          setOpponentScore(match.player2_score);
          setOpponentTime(match.player2_time);
        } else {
          setOpponentCurrent(match.player1_current);
          setOpponentFinished(match.player1_finished);
          setOpponentScore(match.player1_score);
          setOpponentTime(match.player1_time);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, isPlayer1, status]);

  // Sync my progress to DB
  const syncProgress = useCallback(async (score: number, current: number, finished: boolean, time: number) => {
    if (!matchId) return;
    if (isPlayer1) {
      await supabase.from("matches").update({
        player1_score: score,
        player1_current: current,
        player1_finished: finished,
        player1_time: time,
      }).eq("id", matchId);
    } else {
      await supabase.from("matches").update({
        player2_score: score,
        player2_current: current,
        player2_finished: finished,
        player2_time: time,
      }).eq("id", matchId);
    }
  }, [matchId, isPlayer1]);

  const handleSelect = useCallback((index: number) => {
    if (revealed) return;
    setSelectedOption(index);
  }, [revealed]);

  const handleCheck = useCallback(() => {
    if (selectedOption === null || !questions[currentIndex]) return;
    setRevealed(true);
    const isCorrect = selectedOption === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setCorrectCount(c => c + 1);
    } else {
      setLives(l => l - 1);
    }
  }, [selectedOption, questions, currentIndex]);

  const handleNext = useCallback(() => {
    const isLast = currentIndex >= questions.length - 1 || lives <= 1 && selectedOption !== questions[currentIndex]?.correctIndex;
    const newCorrect = selectedOption === questions[currentIndex]?.correctIndex ? correctCount : correctCount;
    const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

    if (isLast || lives <= 0) {
      clearInterval(timerRef.current);
      setElapsed(finalTime);
      setMyFinished(true);
      syncProgress(correctCount, currentIndex + 1, true, finalTime);
      setStatus("finished");
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setRevealed(false);
    syncProgress(correctCount, nextIndex, false, finalTime);
  }, [currentIndex, questions.length, correctCount, lives, selectedOption, syncProgress, questions]);

  const copyLink = () => {
    const url = `${window.location.origin}?join=${roomCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  };

  // Waiting screen
  if (status === "creating") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-heading text-lg font-bold text-muted-foreground">
          {joinCode ? "Entrando na sala..." : "Criando sala..."}
        </p>
      </div>
    );
  }

  if (status === "waiting") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <Swords className="h-16 w-16 text-primary animate-pulse" />
        <h2 className="font-heading text-3xl font-black text-foreground">Sala Criada!</h2>
        <p className="font-body text-muted-foreground">
          Compartilhe o código com seu oponente:
        </p>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-4">
          <span className="font-heading text-3xl font-black tracking-widest text-primary">{roomCode}</span>
          <button onClick={copyLink} className="rounded-xl p-2 transition-colors hover:bg-primary/10">
            <Copy className="h-5 w-5 text-primary" />
          </button>
        </div>

        <Button onClick={copyLink} variant="outline" className="rounded-xl font-heading font-bold">
          <Copy className="mr-2 h-4 w-4" /> Copiar Link
        </Button>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-body text-sm">Aguardando oponente...</span>
        </div>

        <Button onClick={onBack} variant="ghost" className="rounded-xl font-heading font-bold text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
        </Button>
      </div>
    );
  }

  // Finished screen
  if (status === "finished") {
    const myPct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const oppPct = questions.length > 0 ? Math.round((opponentScore / questions.length) * 100) : 0;
    const iWin = myPct > oppPct || (myPct === oppPct && elapsed < opponentTime);
    const tie = myPct === oppPct && elapsed === opponentTime;

    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-6xl">{!opponentFinished ? "⏳" : iWin ? "🏆" : tie ? "🤝" : "😔"}</div>
        <h2 className="font-heading text-3xl font-black text-foreground">
          {!opponentFinished ? "Aguardando oponente..." : iWin ? "Você venceu!" : tie ? "Empate!" : "Você perdeu!"}
        </h2>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
            <p className="font-heading text-sm font-bold text-muted-foreground">Você</p>
            <p className="font-heading text-3xl font-black text-primary">{myPct}%</p>
            <p className="text-xs text-muted-foreground">{correctCount}/{questions.length} • {formatTime(elapsed)}</p>
          </div>
          <div className="rounded-2xl border-2 border-muted bg-muted/30 p-4">
            <p className="font-heading text-sm font-bold text-muted-foreground">{opponentName}</p>
            <p className="font-heading text-3xl font-black text-foreground">
              {opponentFinished ? `${oppPct}%` : "..."}
            </p>
            <p className="text-xs text-muted-foreground">
              {opponentFinished ? `${opponentScore}/${questions.length} • ${formatTime(opponentTime)}` : `Pergunta ${opponentCurrent + 1}`}
            </p>
          </div>
        </div>

        <Button onClick={onBack} variant="outline" className="rounded-xl font-heading font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    );
  }

  // Playing screen
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Progress value={progress} className="h-3 flex-1 rounded-full" />
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} className={cn("h-5 w-5 transition-all", i < lives ? "fill-destructive text-destructive" : "text-muted")} />
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
        </span>
      </div>

      {/* Opponent progress bar */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
        <Swords className="h-4 w-4 text-muted-foreground" />
        <span className="font-heading text-xs font-bold text-muted-foreground">{opponentName}</span>
        <Progress value={((opponentCurrent) / questions.length) * 100} className="h-2 flex-1 rounded-full" />
        {opponentFinished && <span className="text-xs font-bold text-primary">✅</span>}
      </div>

      {/* Subject badge */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xl">{config.emoji}</span>
        <span className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {config.label} • 1v1
        </span>
      </div>

      {/* Question */}
      <h2 className="mt-4 font-heading text-2xl font-black leading-tight text-foreground">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="mt-6 flex flex-1 flex-col gap-3">
        {currentQuestion.options.map((option, i) => (
          <QuizOption
            key={i}
            label={option}
            index={i}
            selected={selectedOption === i}
            revealed={revealed}
            isCorrect={i === currentQuestion.correctIndex}
            wasSelected={selectedOption === i}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={cn(
          "mt-4 rounded-2xl p-4 font-body text-sm",
          selectedOption === currentQuestion.correctIndex
            ? "bg-correct border-2 border-correct-border"
            : "bg-wrong border-2 border-wrong-border"
        )}>
          <p className="font-bold">
            {selectedOption === currentQuestion.correctIndex ? "✅ Correto!" : "❌ Resposta errada!"}
          </p>
          <p className="mt-1 text-foreground/80">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action button */}
      <div className="mt-6 pb-6">
        {!revealed ? (
          <Button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className="w-full rounded-2xl py-6 font-heading text-lg font-bold shadow-lg transition-all disabled:opacity-40"
          >
            Verificar
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full rounded-2xl py-6 font-heading text-lg font-bold shadow-lg"
          >
            {currentIndex >= questions.length - 1 ? (
              <>Resultado <Trophy className="ml-2 h-5 w-5" /></>
            ) : (
              <>Continuar</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
