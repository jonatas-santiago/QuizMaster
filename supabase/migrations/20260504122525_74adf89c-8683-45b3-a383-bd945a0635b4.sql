-- Tabela de amizades
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships"
ON public.friendships FOR SELECT TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests"
ON public.friendships FOR INSERT TO authenticated
WITH CHECK (auth.uid() = requester_id AND requester_id <> addressee_id);

CREATE POLICY "Addressee or requester can update"
ON public.friendships FOR UPDATE TO authenticated
USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

CREATE POLICY "Users can delete their friendships"
ON public.friendships FOR DELETE TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);

-- Tabela de convites para partidas 1v1
CREATE TABLE public.match_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  room_code TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, expired
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.match_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_invites REPLICA IDENTITY FULL;

CREATE POLICY "Users can view their own invites"
ON public.match_invites FOR SELECT TO authenticated
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send invites"
ON public.match_invites FOR INSERT TO authenticated
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Recipient or sender can update invite"
ON public.match_invites FOR UPDATE TO authenticated
USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

CREATE POLICY "Users can delete their invites"
ON public.match_invites FOR DELETE TO authenticated
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE INDEX idx_match_invites_to_user ON public.match_invites(to_user_id);

-- Trigger para updated_at em friendships
CREATE OR REPLACE FUNCTION public.update_friendship_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW EXECUTE FUNCTION public.update_friendship_updated_at();

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_invites;