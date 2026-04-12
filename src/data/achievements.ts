export interface Achievement {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export const achievements: Achievement[] = [
  { key: "first_quiz", title: "Primeiro Passo", description: "Complete seu primeiro quiz", emoji: "🎯" },
  { key: "perfect_round", title: "Perfeição", description: "Acerte todas as perguntas de um quiz", emoji: "⭐" },
  { key: "streak_5", title: "Em Chamas!", description: "Acerte 5 perguntas seguidas", emoji: "🔥" },
  { key: "streak_10", title: "Imparável!", description: "Acerte 10 perguntas seguidas", emoji: "💥" },
  { key: "all_subjects", title: "Explorador", description: "Jogue pelo menos uma vez cada matéria", emoji: "🌍" },
  { key: "math_master", title: "Gênio da Matemática", description: "Acerte 10 questões de Matemática", emoji: "🔢" },
  { key: "history_buff", title: "Historiador", description: "Acerte 10 questões de História", emoji: "📜" },
  { key: "geo_expert", title: "Geógrafo", description: "Acerte 10 questões de Geografia", emoji: "🗺️" },
  { key: "science_whiz", title: "Cientista", description: "Acerte 10 questões de Ciências", emoji: "🔬" },
  { key: "portuguese_pro", title: "Mestre do Português", description: "Acerte 10 questões de Português", emoji: "📝" },
  { key: "no_lives_lost", title: "Invencível", description: "Complete um quiz sem perder nenhuma vida", emoji: "💎" },
  { key: "ten_quizzes", title: "Dedicado", description: "Complete 10 quizzes", emoji: "🏅" },
];

export const getAchievement = (key: string) => achievements.find(a => a.key === key);
