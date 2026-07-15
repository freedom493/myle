-- ============================================================
-- MYLE: AI Deck/Quiz Builder — Database Schema Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. USER CREDITS
-- Tracks each user's generation credits and 30-day cycle
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_balance INTEGER NOT NULL DEFAULT 15,
  free_credits_used INTEGER NOT NULL DEFAULT 0,
  cycle_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_credits_user_unique UNIQUE (user_id)
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 2. GENERATIONS
-- Stores AI-generated flashcard decks and quizzes
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('flashcard', 'quiz')),
  title TEXT NOT NULL,
  description TEXT,
  source_filename TEXT,
  json_data JSONB NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_visibility ON generations(visibility);
CREATE INDEX idx_generations_type ON generations(type);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Owner can do anything with their own generations
CREATE POLICY "Users can read own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read public generations"
  ON generations FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  USING (auth.uid() = user_id);


-- 3. REFERRAL CODES
-- Each user gets one unique referral code
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT referral_codes_user_unique UNIQUE (user_id),
  CONSTRAINT referral_codes_code_unique UNIQUE (code)
);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referral code"
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral code"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow anyone to look up a code (for applying referrals)
CREATE POLICY "Anyone can lookup referral codes"
  ON referral_codes FOR SELECT
  USING (true);


-- 4. REFERRALS
-- Tracks who referred whom
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_awarded INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT referrals_referred_unique UNIQUE (referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals as referrer"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can read own referrals as referred"
  ON referrals FOR SELECT
  USING (auth.uid() = referred_id);

CREATE POLICY "Users can insert referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_id);


-- 5. TASKS
-- Defines available tasks users can complete for credits
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  credits_reward INTEGER NOT NULL DEFAULT 1,
  icon TEXT DEFAULT 'gift',
  max_completions INTEGER DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Everyone can read tasks
CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT
  USING (true);

-- Seed the initial task
INSERT INTO tasks (slug, title, description, credits_reward, icon, max_completions)
VALUES (
  'invite_friend',
  'Invite a Friend',
  'Share your referral link with a friend. When they sign up, you both earn 4 creation credits!',
  4,
  'users',
  100
) ON CONFLICT (slug) DO NOTHING;


-- 6. TASK COMPLETIONS
-- Tracks which tasks a user has completed
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_completions_user ON task_completions(user_id);

ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own task completions"
  ON task_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task completions"
  ON task_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 7. AUTO-CREATE user_credits ROW ON SIGNUP
-- Trigger function to auto-initialize credits when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_balance, free_credits_used, cycle_start)
  VALUES (NEW.id, 15, 0, now())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();


-- 8. AUTO-GENERATE REFERRAL CODE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER AS $$
DECLARE
  new_code VARCHAR(10);
BEGIN
  -- Generate a unique MYLE-XXXX code
  LOOP
    new_code := 'MYLE-' || upper(substr(md5(random()::text), 1, 4));
    BEGIN
      INSERT INTO public.referral_codes (user_id, code)
      VALUES (NEW.id, new_code);
      EXIT; -- success, exit loop
    EXCEPTION WHEN unique_violation THEN
      -- code already exists, try again
      CONTINUE;
    END;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_referral();
