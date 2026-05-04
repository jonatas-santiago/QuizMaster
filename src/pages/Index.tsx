import { useState, useCallback, useEffect } from "react";
import { Subject } from "@/data/quizQuestions";
import { LandingPage } from "@/components/LandingPage";
import { SubjectSelect } from "@/components/SubjectSelect";
import { ModeSelect, GameMode } from "@/components/ModeSelect";
import { QuizScreen } from "@/components/QuizScreen";
import { Match1v1Screen } from "@/components/Match1v1Screen";
import { AchievementsPage } from "@/components/AchievementsPage";
import { ProfilePage } from "@/components/ProfilePage";
import { AdminPanel } from "@/components/AdminPanel";
import { FriendsPage } from "@/components/FriendsPage";
import { InviteToast } from "@/components/InviteToast";
import { useAchievements } from "@/hooks/useAchievements";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

type Screen = "landing" | "subjects" | "mode" | "quiz" | "1v1" | "achievements" | "profile" | "admin" | "friends";

type Stats = Record<Subject, { correct: number; total: number; streak: number }>;

const initialStats: Stats = {
  matematica: { correct: 0, total: 0, streak: 0 },
  historia: { correct: 0, total: 0, streak: 0 },
  geografia: { correct: 0, total: 0, streak: 0 },
  ciencias: { correct: 0, total: 0, streak: 0 },
  portugues: { correct: 0, total: 0, streak: 0 },
  ingles: { correct: 0, total: 0, streak: 0 },
  educacao_fisica: { correct: 0, total: 0, streak: 0 },
};

const subjectAchievementMap: Record<Subject, string> = {
  matematica: "math_master",
  historia: "history_buff",
  geografia: "geo_expert",
  ciencias: "science_whiz",
  portugues: "portuguese_pro",
  ingles: "english_ace",
  educacao_fisica: "pe_champion",
};

const Index = () => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [hostRoomCode, setHostRoomCode] = useState<string | null>(null);
  const [challengeSubject, setChallengeSubject] = useState<Subject | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const { unlockedKeys, unlock } = useAchievements();

  // Handle join link
  useEffect(() => {
    const code = searchParams.get("join");
    if (code && user) {
      setJoinCode(code);
      setScreen("1v1");
      setSearchParams({});
    }
  }, [searchParams, user, setSearchParams]);

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
    setScreen("mode");
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === "1v1") {
      setScreen("1v1");
    } else {
      setScreen("quiz");
    }
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

    supabase.from("quiz_completions").insert({
      user_id: user.id,
      subject: currentSubject,
      score: correct,
      total_questions: total,
      time_seconds: timeSeconds,
    }).then();

    unlock("first_quiz");
    if (correct === total) unlock("perfect_round");
    if (livesLost === 0) unlock("no_lives_lost");
    if (maxStreak >= 5) unlock("streak_5");
    if (maxStreak >= 10) unlock("streak_10");
    if (quizCount >= 10) unlock("ten_quizzes");

    const subjectCorrect = newStats[currentSubject].correct;
    if (subjectCorrect >= 10) unlock(subjectAchievementMap[currentSubject]);

    const allPlayed = (Object.keys(newStats) as Subject[]).every(s => newStats[s].total > 0);
    if (allPlayed) unlock("all_subjects");
  }, [currentSubject, stats, totalQuizzes, user, unlock]);

  const renderScreen = () => {
    if (screen === "landing") {
      return <LandingPage onStart={() => setScreen("subjects")} />;
    }

    if (screen === "profile") {
      return <ProfilePage onBack={() => setScreen("subjects")} />;
    }

    if (screen === "admin") {
      return <AdminPanel onBack={() => setScreen("subjects")} />;
    }

    if (screen === "friends") {
      return <FriendsPage
        onBack={() => setScreen("subjects")}
        onChallenge={() => {
          setJoinCode(null);
          setScreen("1v1");
        }}
      />;
    }

    if (screen === "achievements") {
      return <AchievementsPage unlockedKeys={unlockedKeys} onBack={() => setScreen("subjects")} />;
    }

    if (screen === "mode" && currentSubject) {
      return (
        <ModeSelect
          onSelect={handleSelectMode}
          onJoinWithCode={(code) => {
            setJoinCode(code);
            setGameMode("1v1");
            setScreen("1v1");
          }}
          onBack={() => { setCurrentSubject(null); setScreen("subjects"); }}
          isLoggedIn={!!user}
        />
      );
    }

    if (screen === "1v1" && (currentSubject || joinCode)) {
      return (
        <Match1v1Screen
          subject={currentSubject || "matematica"}
          difficulty={currentSubject ? getDifficulty(currentSubject) : 1}
          onBack={() => {
            setJoinCode(null);
            setCurrentSubject(null);
            setScreen("subjects");
          }}
          roomCode={joinCode || undefined}
        />
      );
    }

    if (screen === "subjects" || !currentSubject) {
      return (
        <SubjectSelect
          onSelect={handleSelectSubject}
          stats={stats}
          onShowAchievements={user ? () => setScreen("achievements") : undefined}
          onShowProfile={user ? () => setScreen("profile") : undefined}
          onShowFriends={user ? () => setScreen("friends") : undefined}
          onShowAdmin={isAdmin ? () => setScreen("admin") : undefined}
        />
      );
    }

    return (
      <QuizScreen
        subject={currentSubject}
        difficulty={getDifficulty(currentSubject)}
        hardMode={gameMode === "hard"}
        onBack={() => {
          setCurrentSubject(null);
          setScreen("subjects");
        }}
        onFinish={handleFinish}
      />
    );
  };

  return (
    <>
      {renderScreen()}
      {user && screen !== "1v1" && (
        <InviteToast onAccept={(invite) => {
          setJoinCode(invite.room_code);
          setScreen("1v1");
        }} />
      )}
    </>
  );
};

export default Index;
