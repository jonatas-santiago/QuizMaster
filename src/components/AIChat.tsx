import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/data/quizQuestions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIChatProps {
  question: Question;
  onClose: () => void;
}

type Msg = { role: "user" | "assistant"; content: string };

export const AIChat = ({ question, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Oi! 👋 Sou seu tutor IA. Pode me perguntar qualquer dúvida sobre essa questão!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          question: question.question,
          options: question.options,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
          userMessage: userMsg.content,
          history: messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0),
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setMessages(m => [...m, { role: "assistant", content: data.reply || "..." }]);
    } catch (e: any) {
      toast.error("Erro ao falar com a IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="flex h-[85vh] sm:h-[70vh] w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl bg-card border-2 border-primary/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-black text-foreground">Tutor IA</h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={cn("max-w-[85%] rounded-2xl px-4 py-2 text-sm", m.role === "user" ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted text-foreground")}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-2xl bg-muted px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Digite sua dúvida..."
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
