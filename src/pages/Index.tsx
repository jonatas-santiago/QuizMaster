import { useState, useCallback } from "react";
import { Subject } from "@/data/quizQuestions";
import { LandingPage } from "@/components/LandingPage";
import { SubjectSelect } from "@/components/SubjectSelect";
import { QuizScreen } from "@/components/QuizScreen";
import { AchievementsPage } from "@/components/AchievementsPage";
import { useAchievements } from "@/hooks/useAchievements";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Screen = "landing" | "subjects" | "quiz" | "achievements";

type Stats = Record<Subject, { correct: number; total: number; streak: number }>;

const initialStats: Stats = {
  matematica: { correct: 0, total: 0, streak: 0 },
  historia: { correct: 0, total: 0, streak: 0 },
  geografia: { correct: 0, total: 0, streak: 0 },
  ciencias: { correct: 0, total: 0, streak: 0 },
  portugues: { correct: 0, total: 0, streak: 0 },
};

const subjectAchievementMap: Record<Subject, string> = {
  matematica: "math_master",
  historia: "history_buff",
  geografia: "geo_expert",
  ciencias: "science_whiz",
  portugues: "portuguese_pro",
};

const Index = () => {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const { unlockedKeys, unlock } = useAchievements();

  const getDifficulty = (subject: Subject) => {
    const s = stats[subject];
    if (s.total === 0) return 1;
    const pct = s.correct / s.total;
    if (pct >= 0.8 && s.total >= 5) return 3;
    if (pct >= 0.6 && s.total >= 3) return 2;
    return 1;
  };

  const handleSelectSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setScreen("quiz");
  };

  const handleFinish = useCallback((correct: number, total: number, maxStreak: number, livesLost: number, timeSeconds: number) => {
    if (!currentSubject) return;

    const newStats = {
      ...stats,
      [currentSubject]: {
        correct: stats[currentSubject].correct + correct,
        total: stats[currentSubject].total + total,
        streak: correct === total ? stats[currentSubject].streak + correct : correct,
      },
    };
    setStats(newStats);
    const quizCount = totalQuizzes + 1;
    setTotalQuizzes(quizCount);

    if (!user) return;

    // Save quiz completion to DB
    supabase.from("quiz_completions").insert({
      user_id: user.id,
      subject: currentSubject,
      score: correct,
      total_questions: total,
      time_seconds: timeSeconds,
    }).then();

    // Check achievements
    unlock("first_quiz");

    if (correct === total) unlock("perfect_round");
    if (livesLost === 0) unlock("no_lives_lost");
    if (maxStreak >= 5) unlock("streak_5");
    if (maxStreak >= 10) unlock("streak_10");
    if (quizCount >= 10) unlock("ten_quizzes");

    // Subject mastery
    const subjectCorrect = newStats[currentSubject].correct;
    if (subjectCorrect >= 10) unlock(subjectAchievementMap[currentSubject]);

    // All subjects played
    const allPlayed = (Object.keys(newStats) as Subject[]).every(s => newStats[s].total > 0);
    if (allPlayed) unlock("all_subjects");
  }, [currentSubject, stats, totalQuizzes, user, unlock]);

  if (screen === "landing") {
    return <LandingPage onStart={() => setScreen("subjects")} />;
  }

  if (screen === "achievements") {
    return <AchievementsPage unlockedKeys={unlockedKeys} onBack={() => setScreen("subjects")} />;
  }

  if (screen === "subjects" || !currentSubject) {
    return (
      <SubjectSelect
        onSelect={handleSelectSubject}
        stats={stats}
        onShowAchievements={user ? () => setScreen("achievements") : undefined}
      />
    );
  }

  return (
    <QuizScreen
      subject={currentSubject}
      difficulty={getDifficulty(currentSubject)}
      onBack={() => {
        setCurrentSubject(null);
        setScreen("subjects");
      }}
      onFinish={handleFinish}
    />
  );
};

export default Index;
