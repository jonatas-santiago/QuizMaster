import { useState, useCallback, useEffect } from "react";
import { Question, Subject, subjectConfig, getQuestionsForSubject, shuffleArray } from "@/data/quizQuestions";
import { QuizOption } from "./QuizOption";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Trophy, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizScreenProps {
  subject: Subject;
  difficulty: number;
  onBack: () => void;
  onFinish: (correct: number, total: number, maxStreak: number, livesLost: number) => void;
}

const QUESTIONS_PER_ROUND = 5;
const MAX_LIVES = 3;

export const QuizScreen = ({ subject, difficulty, onBack, onFinish }: QuizScreenProps) => {
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

  useEffect(() => {
    const available = getQuestionsForSubject(subject, difficulty);
    const shuffled = shuffleArray(available).slice(0, QUESTIONS_PER_ROUND);
    setQuizQuestions(shuffled);
  }, [subject, difficulty]);

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
      const finalCorrect = correctCount;
      setFinished(true);
      onFinish(finalCorrect, quizQuestions.length, maxStreak, livesLost);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setRevealed(false);
  }, [lives, currentIndex, quizQuestions.length, correctCount, onFinish]);

  if (quizQuestions.length === 0) return null;

  if (finished || lives <= 0) {
    const isWin = correctCount >= Math.ceil(quizQuestions.length * 0.6);
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <div className={cn("text-7xl", isWin ? "animate-bounce" : "")}>
          {isWin ? "🎉" : "😢"}
        </div>
        <h2 className="font-heading text-3xl font-black text-foreground">
          {isWin ? "Parabéns!" : "Quase lá!"}
        </h2>
        <p className="font-body text-lg text-muted-foreground">
          Você acertou <span className="font-bold text-primary">{correctCount}</span> de{" "}
          <span className="font-bold">{quizQuestions.length}</span> perguntas de {config.label}
        </p>
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
