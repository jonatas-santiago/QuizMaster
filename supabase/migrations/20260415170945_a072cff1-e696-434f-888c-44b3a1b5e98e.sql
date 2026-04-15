
-- Create matches table for 1v1 mode
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  player1_id UUID NOT NULL,
  player2_id UUID,
  subject TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'waiting',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  player1_score INTEGER NOT NULL DEFAULT 0,
  player2_score INTEGER NOT NULL DEFAULT 0,
  player1_current INTEGER NOT NULL DEFAULT 0,
  player2_current INTEGER NOT NULL DEFAULT 0,
  player1_finished BOOLEAN NOT NULL DEFAULT false,
  player2_finished BOOLEAN NOT NULL DEFAULT false,
  player1_time INTEGER NOT NULL DEFAULT 0,
  player2_time INTEGER NOT NULL DEFAULT 0,
  hard_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view matches (needed for joining)
CREATE POLICY "Authenticated users can view matches"
ON public.matches FOR SELECT TO authenticated
USING (true);

-- Authenticated users can create matches
CREATE POLICY "Authenticated users can create matches"
ON public.matches FOR INSERT TO authenticated
WITH CHECK (auth.uid() = player1_id);

-- Players can update their match
CREATE POLICY "Players can update their match"
ON public.matches FOR UPDATE TO authenticated
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
