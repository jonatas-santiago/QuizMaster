import { useState, useCallback } from "react";
import { Subject } from "@/data/quizQuestions";
import { SubjectSelect } from "@/components/SubjectSelect";
import { QuizScreen } from "@/components/QuizScreen";

type Stats = Record<Subject, { correct: number; total: number; streak: number }>;

const initialStats: Stats = {
  matematica: { correct: 0, total: 0, streak: 0 },
  historia: { correct: 0, total: 0, streak: 0 },
  geografia: { correct: 0, total: 0, streak: 0 },
  ciencias: { correct: 0, total: 0, streak: 0 },
  portugues: { correct: 0, total: 0, streak: 0 },
};

const Index = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);

  const getDifficulty = (subject: Subject) => {
    const s = stats[subject];
    if (s.total === 0) return 1;
    const pct = s.correct / s.total;
    if (pct >= 0.8 && s.total >= 5) return 3;
    if (pct >= 0.6 && s.total >= 3) return 2;
    return 1;
  };

  const handleFinish = useCallback((correct: number, total: number) => {
    if (!currentSubject) return;
    setStats(prev => ({
      ...prev,
      [currentSubject]: {
        correct: prev[currentSubject].correct + correct,
        total: prev[currentSubject].total + total,
        streak: correct === total ? prev[currentSubject].streak + correct : correct,
      },
    }));
  }, [currentSubject]);

  if (!currentSubject) {
    return <SubjectSelect onSelect={setCurrentSubject} stats={stats} />;
  }

  return (
    <QuizScreen
      subject={currentSubject}
      difficulty={getDifficulty(currentSubject)}
      onBack={() => setCurrentSubject(null)}
      onFinish={handleFinish}
    />
  );
};

export default Index;
