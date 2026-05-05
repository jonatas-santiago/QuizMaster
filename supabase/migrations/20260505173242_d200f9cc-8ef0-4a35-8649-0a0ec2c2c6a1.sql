ALTER TABLE public.quiz_completions
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 10;

UPDATE public.quiz_completions
SET mode = COALESCE(NULLIF(mode, ''), 'normal'),
    points = CASE WHEN COALESCE(NULLIF(mode, ''), 'normal') = 'hard' THEN 20 ELSE 10 END
WHERE points IS NULL OR points NOT IN (10, 20) OR mode IS NULL OR mode = '';

CREATE INDEX IF NOT EXISTS idx_quiz_completions_points_user ON public.quiz_completions (user_id, points);

DROP POLICY IF EXISTS "Players can update their match" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can join waiting matches" ON public.matches;

CREATE POLICY "Players can update match progress"
ON public.matches
FOR UPDATE
TO authenticated
USING ((auth.uid() = player1_id) OR (auth.uid() = player2_id))
WITH CHECK ((auth.uid() = player1_id) OR (auth.uid() = player2_id));

CREATE POLICY "Authenticated users can join waiting matches"
ON public.matches
FOR UPDATE
TO authenticated
USING ((status = 'waiting') AND (player2_id IS NULL) AND (auth.uid() <> player1_id))
WITH CHECK ((status = 'playing') AND (player2_id = auth.uid()) AND (auth.uid() <> player1_id));

CREATE OR REPLACE FUNCTION public.validate_friendship_status_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.requester_id <> OLD.requester_id OR NEW.addressee_id <> OLD.addressee_id THEN
    RAISE EXCEPTION 'Cannot change friendship users';
  END IF;

  IF OLD.status <> 'pending' AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'Only pending friend requests can change status';
  END IF;

  IF NEW.status NOT IN ('pending', 'accepted', 'declined') THEN
    RAISE EXCEPTION 'Invalid friendship status';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_friendship_status_update ON public.friendships;
CREATE TRIGGER validate_friendship_status_update
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.validate_friendship_status_update();

DROP POLICY IF EXISTS "Addressee or requester can update" ON public.friendships;
DROP POLICY IF EXISTS "Request receiver can answer friend requests" ON public.friendships;

CREATE POLICY "Request receiver can answer friend requests"
ON public.friendships
FOR UPDATE
TO authenticated
USING ((auth.uid() = addressee_id) AND (status = 'pending'))
WITH CHECK ((auth.uid() = addressee_id) AND (status IN ('accepted', 'declined')));