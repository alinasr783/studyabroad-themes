-- Add deployment fields to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS vercel_url TEXT,
ADD COLUMN IF NOT EXISTS deployment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;