import { useState, useCallback, useEffect, useRef } from "react";
import { Question, Subject, subjectConfig, getQuestionsForSubject, shuffleArray } from "@/data/quizQuestions";
import { QuizOption } from "./QuizOption";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Trophy, Heart, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizScreenProps {
  subject: Subject;
  difficulty: number;
  hardMode?: boolean;
  onBack: () => void;
  onFinish: (correct: number, total: number, maxStreak: number, livesLost: number, timeSeconds: number) => void;
}

const QUESTIONS_PER_ROUND = 5;
const MAX_LIVES = 3;
const HARD_MODE_SECONDS = 30;

function getPercentageMessage(pct: number): { emoji: string; message: string; color: string } {
  if (pct === 100) return { emoji: "🏆", message: "Albert Einstein 🧠✨", color: "text-yellow-400" };
  if (pct >= 90) return { emoji: "🟣", message: "Muito bom 🔥", color: "text-purple-500" };
  if (pct >= 80) return { emoji: "🟣", message: "Bom 👏", color: "text-purple-400" };
  if (pct >= 70) return { emoji: "🔵", message: "Normal 👍", color: "text-blue-500" };
  if (pct >= 60) return { emoji: "🔵", message: "Mais ou menos", color: "text-blue-400" };
  if (pct >= 50) return { emoji: "🟢", message: "Ruim", color: "text-green-500" };
  if (pct >= 40) return { emoji: "🟢", message: "Muito ruim", color: "text-green-400" };
  if (pct >= 30) return { emoji: "🟡", message: "Estude bastante 📚", color: "text-yellow-500" };
  if (pct >= 20) return { emoji: "🟡", message: "Procure a ajuda de um professor 👨‍🏫", color: "text-yellow-400" };
  if (pct >= 10) return { emoji: "🟠", message: "Ainda está no primeiro ano?", color: "text-orange-500" };
  return { emoji: "🔴", message: "Você errou de propósito? 😅", color: "text-red-500" };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export const QuizScreen = ({ subject, difficulty, hardMode = false, onBack, onFinish }: QuizScreenProps) => {
  const config = subjectConfig[subject];

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [livesLost, setLivesLost] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(HARD_MODE_SECONDS);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const questionTimerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const available = getQuestionsForSubject(subject, difficulty);
    const shuffled = shuffleArray(available).slice(0, QUESTIONS_PER_ROUND);
    setQuizQuestions(shuffled);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(questionTimerRef.current);
    };
  }, [subject, difficulty]);

  // Hard mode question timer
  useEffect(() => {
    if (!hardMode || revealed || finished) {
      clearInterval(questionTimerRef.current);
      return;
    }
    setQuestionTimer(HARD_MODE_SECONDS);
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) {
          clearInterval(questionTimerRef.current);
          // Time's up - auto wrong answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(questionTimerRef.current);
  }, [hardMode, currentIndex, revealed, finished]);

  // Handle time's up in hard mode
  useEffect(() => {
    if (hardMode && questionTimer === 0 && !revealed && !finished) {
      setRevealed(true);
      setLives(l => l - 1);
      setLivesLost(l => l + 1);
      setStreak(0);
    }
  }, [questionTimer, hardMode, revealed, finished]);

  const currentQuestion = quizQuestions[currentIndex];
  const progress = quizQuestions.length > 0 ? ((currentIndex) / quizQuestions.length) * 100 : 0;

  const handleSelect = useCallback((index: number) => {
    if (revealed) return;
    setSelectedOption(index);
  }, [revealed]);

  const handleCheck = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;
    setRevealed(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setCorrectCount(c => c + 1);
      setStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setLives(l => l - 1);
      setLivesLost(l => l + 1);
      setStreak(0);
    }
  }, [selectedOption, currentQuestion]);

  const handleNext = useCallback(() => {
    if (lives <= 0 || currentIndex >= quizQuestions.length - 1) {
      clearInterval(timerRef.current);
      const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(finalTime);
      setFinished(true);
      onFinish(correctCount, quizQuestions.length, maxStreak, livesLost, finalTime);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setRevealed(false);
  }, [lives, currentIndex, quizQuestions.length, correctCount, onFinish, maxStreak, livesLost]);

  if (quizQuestions.length === 0) return null;

  if (finished || lives <= 0) {
    const pct = quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 0;
    const msg = getPercentageMessage(pct);

    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <div className={cn("text-7xl", pct === 100 ? "animate-bounce" : "")}>
          {msg.emoji}
        </div>
        <h2 className={cn("font-heading text-3xl font-black", msg.color)}>
          {msg.message}
        </h2>
        <p className="font-body text-lg text-muted-foreground">
          Você acertou <span className="font-bold text-primary">{correctCount}</span> de{" "}
          <span className="font-bold">{quizQuestions.length}</span> perguntas de {config.label}
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1 text-sm font-semibold">
            <Clock className="h-4 w-4" /> {formatTime(elapsed)}
          </span>
          <span className="text-2xl font-black text-primary">{pct}%</span>
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="rounded-xl font-heading font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button onClick={() => {
            setCurrentIndex(0);
            setSelectedOption(null);
            setRevealed(false);
            setCorrectCount(0);
            setLives(MAX_LIVES);
            setFinished(false);
            setStreak(0);
            setMaxStreak(0);
            setLivesLost(0);
            setElapsed(0);
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
              setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
            const available = getQuestionsForSubject(subject, difficulty);
            setQuizQuestions(shuffleArray(available).slice(0, QUESTIONS_PER_ROUND));
          }} className="rounded-xl font-heading font-bold">
            Jogar novamente
          </Button>
        </div>
      </div>
    );
  }

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
            <Heart
              key={i}
              className={cn("h-5 w-5 transition-all", i < lives ? "fill-destructive text-destructive" : "text-muted")}
            />
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
        </span>
      </div>

      {/* Streak */}
      {streak >= 2 && (
        <div className="mt-3 flex items-center justify-center gap-1 text-accent">
          <Zap className="h-4 w-4 fill-accent" />
          <span className="font-heading text-sm font-bold">{streak} seguidas!</span>
        </div>
      )}

      {/* Subject badge */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-xl">{config.emoji}</span>
        <span className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {config.label} • Nível {currentQuestion.difficulty}
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
            {currentIndex >= quizQuestions.length - 1 ? (
              <>Resultado <Trophy className="ml-2 h-5 w-5" /></>
            ) : (
              <>Continuar <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
