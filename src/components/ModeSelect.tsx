import { Button } from "@/components/ui/button";
import { ArrowLeft, Skull, Swords, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type GameMode = "normal" | "hard" | "1v1";

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

const modes = [
  {
    key: "normal" as GameMode,
    icon: Zap,
    emoji: "🎮",
    title: "Modo Normal",
    desc: "Sem limite de tempo, perfeito para aprender no seu ritmo",
    color: "border-primary/40 hover:border-primary hover:shadow-primary/20",
    requiresAuth: false,
  },
  {
    key: "hard" as GameMode,
    icon: Skull,
    emoji: "💀",
    title: "Modo Difícil",
    desc: "30 segundos por pergunta! Mais pontos, mais pressão 🔥",
    color: "border-destructive/40 hover:border-destructive hover:shadow-destructive/20",
    requiresAuth: false,
  },
  {
    key: "1v1" as GameMode,
    icon: Swords,
    emoji: "⚔️",
    title: "Modo 1v1",
    desc: "Desafie um amigo em tempo real! Compartilhe o link e compita",
    color: "border-accent/40 hover:border-accent hover:shadow-accent/20",
    requiresAuth: true,
  },
];

export const ModeSelect = ({ onSelect, onBack, isLoggedIn }: ModeSelectProps) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-black tracking-tight text-foreground">
          🎯 Modo de Jogo
        </h1>
        <p className="mt-2 font-body text-lg text-muted-foreground">
          Escolha como quer jogar!
        </p>
      </div>

      <div className="grid w-full gap-4">
        {modes.map((mode) => {
          const disabled = mode.requiresAuth && !isLoggedIn;
          return (
            <button
              key={mode.key}
              onClick={() => !disabled && onSelect(mode.key)}
              disabled={disabled}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border-2 bg-card p-6 text-left transition-all duration-200",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : `cursor-pointer hover:shadow-lg active:scale-[0.98] ${mode.color}`
              )}
            >
              <span className="text-4xl">{mode.emoji}</span>
              <div className="flex-1">
                <span className="font-heading text-lg font-bold text-foreground">{mode.title}</span>
                <p className="mt-1 font-body text-sm text-muted-foreground">{mode.desc}</p>
                {disabled && (
                  <p className="mt-1 text-xs font-semibold text-destructive">
                    Faça login para jogar este modo
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button onClick={onBack} variant="outline" className="rounded-xl font-heading font-bold">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
    </div>
  );
};
