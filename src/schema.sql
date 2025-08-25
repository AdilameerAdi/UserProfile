-- Complete Supabase Schema Setup
-- This file contains all SQL needed to set up the database

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RECOVERY EMAIL FEATURE
-- ============================================================

-- Add recovery_email column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS recovery_email TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_recovery_email 
ON public.profiles(recovery_email) 
WHERE recovery_email IS NOT NULL;

-- Update RLS policies to allow users to update their own recovery email
CREATE POLICY "Users can update own recovery email" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure recovery_email is valid
ALTER TABLE public.profiles 
ADD CONSTRAINT check_recovery_email_format 
CHECK (recovery_email IS NULL OR is_valid_email(recovery_email));

-- Function to find user by email (primary or recovery)
CREATE OR REPLACE FUNCTION public.find_user_by_email(input_email TEXT)
RETURNS TABLE(user_id UUID, email TEXT, is_recovery BOOLEAN) AS $$
BEGIN
  -- First check auth.users table for primary email
  RETURN QUERY
  SELECT id, email::TEXT, FALSE as is_recovery
  FROM auth.users
  WHERE email = input_email
  LIMIT 1;
  
  -- If not found, check profiles table for recovery email
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT p.id, p.recovery_email, TRUE as is_recovery
    FROM public.profiles p
    WHERE p.recovery_email = input_email
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to enable login with recovery email
-- This function validates the recovery email and password, then returns the user's primary email
-- so the frontend can login with the primary email
CREATE OR REPLACE FUNCTION public.login_with_recovery_email(
  recovery_email TEXT,
  password_input TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  primary_email TEXT;
  password_hash TEXT;
BEGIN
  -- Find user by recovery email
  SELECT id INTO user_id
  FROM public.profiles
  WHERE profiles.recovery_email = login_with_recovery_email.recovery_email
  LIMIT 1;
  
  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Recovery email not found'
    );
  END IF;
  
  -- Get the user's primary email from auth.users
  SELECT email, encrypted_password INTO primary_email, password_hash
  FROM auth.users
  WHERE id = user_id
  LIMIT 1;
  
  IF primary_email IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;
  
  -- Verify the password using Supabase's crypt function
  IF NOT (password_hash = crypt(password_input, password_hash)) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid password'
    );
  END IF;
  
  -- Return success with the primary email so frontend can login
  RETURN json_build_object(
    'success', true,
    'primary_email', primary_email,
    'user_id', user_id::TEXT
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.login_with_recovery_email TO authenticated;
GRANT EXECUTE ON FUNCTION public.login_with_recovery_email TO anon;