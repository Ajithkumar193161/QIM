-- ============================================================
-- QIM System — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL DEFAULT 'viewer'
                  CHECK (role IN ('admin', 'manager', 'analyst', 'viewer')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Allow anon key to SELECT (needed for login check)
--    Restrict in production to specific roles as needed
CREATE POLICY "Allow anon read" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Allow anon insert" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon update" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "Allow anon delete" ON public.users
  FOR DELETE USING (true);

-- 4. Seed a default admin user (password: admin123)
--    CHANGE THIS PASSWORD after first login!
INSERT INTO public.users (username, full_name, email, role, is_active, password_hash)
VALUES ('admin', 'System Administrator', 'admin@company.com', 'admin', true, 'admin123')
ON CONFLICT (username) DO NOTHING;
