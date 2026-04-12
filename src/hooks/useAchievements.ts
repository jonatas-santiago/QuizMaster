import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getAchievement } from "@/data/achievements";

export const useAchievements = () => {
  const { user } = useAuth();
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setUnlockedKeys(new Set());
      return;
    }
    supabase
      .from("user_achievements")
      .select("achievement_key")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setUnlockedKeys(new Set(data.map(r => r.achievement_key)));
      });
  }, [user]);

  const unlock = useCallback(async (key: string) => {
    if (!user || unlockedKeys.has(key)) return;
    const { error } = await supabase
      .from("user_achievements")
      .insert({ user_id: user.id, achievement_key: key });
    if (!error) {
      setUnlockedKeys(prev => new Set(prev).add(key));
      const a = getAchievement(key);
      if (a) {
        toast.success(`${a.emoji} Conquista desbloqueada!`, {
          description: a.title,
        });
      }
    }
  }, [user, unlockedKeys]);

  return { unlockedKeys, unlock };
};
