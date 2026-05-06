import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, User, Lock, ArrowLeft, Loader2, Eye, EyeOff, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CLASS_OPTIONS = [
  "6A", "6B", "6C", "6D",
  "7A", "7B", "7C", "7D",
  "8A", "8B",
  "9A", "9B", "9C",
];

type Mode = "login" | "signup";

const toFakeEmail = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}@quizapp.local`;

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    if (mode === "signup" && !classRoom) {
      toast({ title: "Selecione sua turma", description: "Escolha sua sala antes de continuar.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const fakeEmail = toFakeEmail(displayName.trim());

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: fakeEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim() },
          },
        });
        if (error) throw error;
        // Auto-confirm is on, so sign in immediately
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: fakeEmail,
          password,
        });
        if (loginErr) throw loginErr;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: fakeEmail,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      let msg = error.message || "Algo deu errado.";
      if (msg.includes("Invalid login")) msg = "Nome ou senha incorretos.";
      if (msg.includes("already been registered")) msg = "Esse nome já está em uso.";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-4 py-12">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted md:left-8 md:top-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>

        <div className="text-center">
          <h1 className="font-heading text-3xl font-black text-foreground">
            {mode === "login" ? "Bem-vindo de volta! 👋" : "Crie sua conta 🚀"}
          </h1>
          <p className="mt-2 font-body text-muted-foreground">
            {mode === "login" ? "Entre para continuar aprendendo" : "Comece sua jornada de conhecimento"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="font-heading font-bold">
              Nome / Apelido
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Seu nick"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={30}
                className="rounded-xl pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-heading font-bold">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-xl pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-6 font-heading text-lg font-bold shadow-lg shadow-primary/30"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 font-body text-sm text-muted-foreground">
          {mode === "login" ? (
            <span>
              Não tem conta?{" "}
              <button onClick={() => setMode("signup")} className="font-bold text-primary hover:underline">
                Cadastre-se
              </button>
            </span>
          ) : (
            <span>
              Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="font-bold text-primary hover:underline">
                Entrar
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
