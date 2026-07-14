-- BeforeYouSign Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- USERS & AUTHENTICATION
-- ==========================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
  company TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  
  -- Subscription & billing
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise')),
  subscription_status TEXT DEFAULT 'active',
  subscription_ends_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CONTRACTS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Contract details
  title TEXT NOT NULL,
  description TEXT,
  contract_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending-review', 'active', 'expired', 'terminated', 'archived')),
  
  -- File storage
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  
  -- Contract data
  content TEXT,
  content_hash TEXT,
  
  -- Parties involved
  parties JSONB DEFAULT '[]'::jsonb,
  
  -- Dates
  effective_date DATE,
  expiration_date DATE,
  
  -- Analysis results
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  ai_analysis JSONB,
  compliance_status JSONB,
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Collaboration
  shared_with UUID[],
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ,
  
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''))
  ) STORED
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS contracts_search_idx ON public.contracts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS contracts_user_id_idx ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON public.contracts(status);

-- ==========================================
-- CONTRACT VERSIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contract_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Version data
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  changes_summary TEXT,
  
  -- User who created version
  created_by UUID REFERENCES public.user_profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id, version_number)
);

CREATE INDEX IF NOT EXISTS contract_versions_contract_id_idx ON public.contract_versions(contract_id);

-- ==========================================
-- CLAUSES LIBRARY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.clauses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Clause details
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Classification
  clause_type TEXT,
  jurisdiction TEXT,
  industry TEXT,
  
  -- Risk & compliance
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  compliance_tags TEXT[],
  
  -- Usage
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  
  -- AI metadata
  ai_tags JSONB DEFAULT '[]'::jsonb,
  alternatives JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clauses_user_id_idx ON public.clauses(user_id);
CREATE INDEX IF NOT EXISTS clauses_category_idx ON public.clauses(category);

-- ==========================================
-- TEMPLATES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  
  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  
  -- Template content
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  sections JSONB DEFAULT '[]'::jsonb,
  
  -- Classification
  jurisdiction TEXT,
  industry TEXT,
  complexity TEXT CHECK (complexity IN ('simple', 'moderate', 'complex', 'expert')),
  
  -- Public templates
  is_public BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Usage stats
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS templates_category_idx ON public.templates(category);
CREATE INDEX IF NOT EXISTS templates_is_public_idx ON public.templates(is_public);

-- ==========================================
-- AI CHAT HISTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  
  -- Session details
  title TEXT,
  context TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  
  -- Message details
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- AI metadata
  model TEXT,
  tokens_used INTEGER,
  confidence DECIMAL(5,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON public.chat_messages(session_id);

-- ==========================================
-- ANALYTICS & TRACKING
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Activity details
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS user_activity_created_at_idx ON public.user_activity(created_at);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Link
  action_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Contracts Policies
CREATE POLICY "Users can view their own contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = ANY(shared_with) OR is_public = true);

CREATE POLICY "Users can insert their own contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
  ON public.contracts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts"
  ON public.contracts FOR DELETE
  USING (auth.uid() = user_id);

-- Contract Versions Policies
CREATE POLICY "Users can view versions of accessible contracts"
  ON public.contract_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = contract_versions.contract_id
      AND (contracts.user_id = auth.uid() OR auth.uid() = ANY(contracts.shared_with))
    )
  );

-- Clauses Policies
CREATE POLICY "Users can view their own and public clauses"
  ON public.clauses FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert their own clauses"
  ON public.clauses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clauses"
  ON public.clauses FOR UPDATE
  USING (auth.uid() = user_id);

-- Templates Policies
CREATE POLICY "Users can view their own and public templates"
  ON public.templates FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert their own templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Chat Sessions Policies
CREATE POLICY "Users can view their own chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users can view messages in their sessions"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- User Activity Policies
CREATE POLICY "Users can view their own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clauses_updated_at BEFORE UPDATE ON public.clauses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for contracts bucket
CREATE POLICY "Users can upload their own contracts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own contracts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own contracts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'contracts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage bucket for avatars (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
