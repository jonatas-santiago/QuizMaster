import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MatchInvite {
  id: string;
  from_user_id: string;
  to_user_id: string;
  room_code: string;
  subject: string;
  difficulty: number;
  status: string;
  created_at: string;
  from_name?: string;
}

export function useMatchInvites(onAccept?: (invite: MatchInvite) => void) {
  const { user } = useAuth();
  const [invites, setInvites] = useState<MatchInvite[]>([]);

  const fetchInvites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("match_invites")
      .select("*")
      .eq("to_user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (!data) return;

    const ids = [...new Set(data.map(i => i.from_user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", ids);
    const nameMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

    setInvites(data.map(i => ({ ...i, from_name: nameMap.get(i.from_user_id) || "Amigo" })));
  };

  useEffect(() => {
    if (!user) return;
    fetchInvites();
    const channel = supabase
      .channel(`invites-${user.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "match_invites",
        filter: `to_user_id=eq.${user.id}`,
      }, async (payload) => {
        const inv = payload.new as MatchInvite;
        const { data: prof } = await supabase
          .from("profiles").select("display_name").eq("user_id", inv.from_user_id).single();
        toast.info(`⚔️ ${prof?.display_name || "Alguém"} te desafiou para um 1v1!`, { duration: 6000 });
        fetchInvites();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const accept = async (invite: MatchInvite) => {
    await supabase.from("match_invites").update({ status: "accepted" }).eq("id", invite.id);
    onAccept?.(invite);
    fetchInvites();
  };

  const decline = async (id: string) => {
    await supabase.from("match_invites").update({ status: "declined" }).eq("id", id);
    fetchInvites();
  };

  return { invites, accept, decline, refresh: fetchInvites };
}
