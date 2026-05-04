import { useMatchInvites, MatchInvite } from "@/hooks/useMatchInvites";
import { Button } from "@/components/ui/button";
import { Swords, X } from "lucide-react";

interface InviteToastProps {
  onAccept: (invite: MatchInvite) => void;
}

export const InviteToast = ({ onAccept }: InviteToastProps) => {
  const { invites, accept, decline } = useMatchInvites();

  if (invites.length === 0) return null;
  const inv = invites[0];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border-2 border-primary bg-card p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <Swords className="h-8 w-8 text-primary animate-pulse" />
        <div className="flex-1">
          <p className="font-heading text-sm font-black text-foreground">⚔️ Desafio recebido!</p>
          <p className="text-xs text-muted-foreground">
            <strong>{inv.from_name}</strong> te chamou para um 1v1
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className="flex-1 rounded-xl" onClick={() => { accept(inv); onAccept(inv); }}>
          Aceitar
        </Button>
        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => decline(inv.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
