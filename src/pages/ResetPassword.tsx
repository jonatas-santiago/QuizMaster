import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Senha atualizada! ✅", description: "Você já pode fazer login." });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-muted-foreground">Link inválido ou expirado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
        <GraduationCap className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-heading text-3xl font-black text-foreground">Nova senha 🔐</h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="font-heading font-bold">Nova senha</Label>
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
        <Button type="submit" disabled={loading} className="w-full rounded-2xl py-6 font-heading text-lg font-bold">
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Salvar nova senha
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
