import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Skull, Swords, Zap, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type GameMode = "normal" | "hard" | "1v1";

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void;
  onJoinWithCode: (code: string) => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

const modes = [
  {
    key: "normal" as GameMode,
    emoji: "🎮",
    title: "Modo Normal",
    desc: "Sem limite de tempo, perfeito para aprender no seu ritmo",
    color: "border-primary/40 hover:border-primary hover:shadow-primary/20",
    requiresAuth: false,
  },
  {
    key: "hard" as GameMode,
    emoji: "💀",
    title: "Modo Difícil",
    desc: "30 segundos por pergunta! Mais pontos, mais pressão 🔥",
    color: "border-destructive/40 hover:border-destructive hover:shadow-destructive/20",
    requiresAuth: false,
  },
  {
    key: "1v1" as GameMode,
    emoji: "⚔️",
    title: "Criar Sala 1v1",
    desc: "Crie uma sala e compartilhe o código com seu amigo",
    color: "border-accent/40 hover:border-accent hover:shadow-accent/20",
    requiresAuth: true,
  },
];

export const ModeSelect = ({ onSelect, onJoinWithCode, onBack, isLoggedIn }: ModeSelectProps) => {
  const [showJoin, setShowJoin] = useState(false);
  const [code, setCode] = useState("");

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length >= 4) onJoinWithCode(trimmed);
  };

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

        {/* Entrar com código */}
        {isLoggedIn && (
          <div className="rounded-2xl border-2 border-secondary/40 bg-card p-6 transition-all">
            {!showJoin ? (
              <button
                onClick={() => setShowJoin(true)}
                className="flex w-full items-center gap-4 text-left"
              >
                <span className="text-4xl">🔑</span>
                <div className="flex-1">
                  <span className="font-heading text-lg font-bold text-foreground">Entrar com Código</span>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    Tem um código de sala? Entre direto na partida 1v1
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-secondary" />
                  <span className="font-heading text-sm font-bold text-foreground">
                    Digite o código da sala
                  </span>
                </div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="EX: ABC123"
                  maxLength={8}
                  className="rounded-xl text-center font-heading text-xl font-black tracking-widest"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => { setShowJoin(false); setCode(""); }}
                    variant="outline"
                    className="flex-1 rounded-xl font-heading font-bold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleJoin}
                    disabled={code.trim().length < 4}
                    className="flex-1 rounded-xl font-heading font-bold"
                  >
                    Entrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={onBack} variant="outline" className="rounded-xl font-heading font-bold">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
    </div>
  );
};
