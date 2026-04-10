import { BookOpen, Calculator, Globe, FlaskConical, PenTool, Sparkles, GraduationCap, Star, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const subjects = [
  { icon: Calculator, label: "Matemática", color: "from-[hsl(210,80%,55%)] to-[hsl(210,80%,40%)]" },
  { icon: BookOpen, label: "História", color: "from-[hsl(38,95%,55%)] to-[hsl(38,95%,40%)]" },
  { icon: Globe, label: "Geografia", color: "from-[hsl(145,63%,42%)] to-[hsl(145,63%,30%)]" },
  { icon: FlaskConical, label: "Ciências", color: "from-[hsl(270,60%,55%)] to-[hsl(270,60%,40%)]" },
  { icon: PenTool, label: "Português", color: "from-[hsl(0,72%,55%)] to-[hsl(0,72%,40%)]" },
];

const FloatingEmoji = ({ emoji, className }: { emoji: string; className: string }) => (
  <span className={`absolute text-2xl md:text-3xl select-none pointer-events-none ${className}`}>
    {emoji}
  </span>
);

export const LandingPage = ({ onStart, onLogin }: LandingPageProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Floating decorative emojis */}
      <FloatingEmoji emoji="📚" className="top-[8%] left-[5%] animate-bounce" />
      <FloatingEmoji emoji="✨" className="top-[12%] right-[8%] animate-pulse" />
      <FloatingEmoji emoji="🎯" className="top-[35%] left-[3%] animate-bounce [animation-delay:0.5s]" />
      <FloatingEmoji emoji="💡" className="top-[60%] right-[5%] animate-bounce [animation-delay:1s]" />
      <FloatingEmoji emoji="🏆" className="bottom-[15%] left-[8%] animate-pulse [animation-delay:0.3s]" />
      <FloatingEmoji emoji="🎓" className="bottom-[20%] right-[10%] animate-bounce [animation-delay:0.7s]" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Animated mascot area */}
          <div className="relative mb-2">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 shadow-lg shadow-primary/20 ring-4 ring-primary/20">
              <GraduationCap className="h-14 w-14 text-primary" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-md">
              <Star className="h-5 w-5 fill-accent-foreground text-accent-foreground" />
            </div>
            <div className="absolute -bottom-1 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(210,80%,55%)] shadow-md">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          <h1 className="font-heading text-5xl font-black tracking-tight text-foreground md:text-6xl">
            Quiz<span className="text-primary">Master</span>
          </h1>
          <p className="max-w-md font-body text-lg text-muted-foreground md:text-xl">
            Aprenda brincando! Teste seus conhecimentos com quizzes divertidos e interativos. 🚀
          </p>
        </div>

        {/* Subject Icons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {subjects.map((s) => (
            <div
              key={s.label}
              className="group flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-110"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg transition-shadow group-hover:shadow-xl md:h-16 md:w-16`}>
                <s.icon className="h-7 w-7 text-primary-foreground md:h-8 md:w-8" />
              </div>
              <span className="font-heading text-xs font-bold text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          {[
            { icon: "🎮", title: "Interativo", desc: "Aprenda jogando" },
            { icon: "📊", title: "Progresso", desc: "Acompanhe tudo" },
            { icon: "🧠", title: "Adaptativo", desc: "No seu ritmo" },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card p-4 text-center transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="font-heading text-sm font-bold text-foreground">{f.title}</span>
              <span className="font-body text-xs text-muted-foreground">{f.desc}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button
            onClick={onStart}
            className="w-full rounded-2xl py-7 font-heading text-lg font-black shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Começar Quiz
          </Button>
          <Button
            onClick={onLogin}
            variant="outline"
            className="w-full rounded-2xl py-6 font-heading text-base font-bold transition-all duration-200 hover:bg-muted active:scale-[0.98]"
          >
            Já tenho conta
          </Button>
        </div>

        {/* Bottom illustration strip */}
        <div className="mt-4 flex items-center gap-2 font-body text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Mais de <strong className="text-foreground">1.000</strong> perguntas para você!</span>
        </div>
      </div>
    </div>
  );
};
