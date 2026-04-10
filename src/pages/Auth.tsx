import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({
          title: "Conta criada! 🎉",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: "Email enviado! 📧",
          description: "Verifique sua caixa de entrada para redefinir a senha.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Bem-vindo de volta! 👋",
    signup: "Crie sua conta 🚀",
    forgot: "Esqueceu a senha? 🔑",
  };

  const subtitles = {
    login: "Entre para continuar aprendendo",
    signup: "Comece sua jornada de conhecimento",
    forgot: "Enviaremos um link para redefinir",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-4 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted md:left-8 md:top-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>

        <div className="text-center">
          <h1 className="font-heading text-3xl font-black text-foreground">
            {titles[mode]}
          </h1>
          <p className="mt-2 font-body text-muted-foreground">{subtitles[mode]}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-heading font-bold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl pl-10"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="font-heading font-bold">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl pl-10"
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="self-end font-body text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-6 font-heading text-lg font-bold shadow-lg shadow-primary/30"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mode === "login" && "Entrar"}
            {mode === "signup" && "Criar conta"}
            {mode === "forgot" && "Enviar link"}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 font-body text-sm text-muted-foreground">
          {mode === "login" && (
            <>
              <span>
                Não tem conta?{" "}
                <button onClick={() => setMode("signup")} className="font-bold text-primary hover:underline">
                  Cadastre-se
                </button>
              </span>
            </>
          )}
          {mode === "signup" && (
            <span>
              Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="font-bold text-primary hover:underline">
                Entrar
              </button>
            </span>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="font-bold text-primary hover:underline">
              Voltar ao login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
