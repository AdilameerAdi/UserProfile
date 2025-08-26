-- Complete Supabase Schema Setup
-- This file contains all SQL needed to set up the database

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  profile_picture TEXT, -- URL or data URL for profile picture
  coins INTEGER DEFAULT 0, -- Users start with 0 coins, earn through purchases
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
-- ADMIN CREDENTIALS TABLE
-- ============================================================

-- Create admin credentials table for secure admin login
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- Store hashed password for security
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_login TIMESTAMPTZ
);

-- Disable RLS for admin table (handled by application logic)
ALTER TABLE public.admin_credentials DISABLE ROW LEVEL SECURITY;

-- Insert default admin credentials (password will be hashed)
INSERT INTO public.admin_credentials (username, password_hash, is_active)
VALUES ('Adil', 'Adil', TRUE) -- Note: In production, this should be properly hashed
ON CONFLICT (username) DO NOTHING;

-- Function to verify admin login
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  input_username TEXT,
  input_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Find admin by username
  SELECT id, username, password_hash, is_active, last_login
  INTO admin_record
  FROM public.admin_credentials
  WHERE username = input_username AND is_active = TRUE
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid username or password'
    );
  END IF;
  
  -- For now, do simple comparison (in production, use proper hashing)
  -- TODO: Replace with proper password hashing verification
  IF admin_record.password_hash != input_password THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid username or password'
    );
  END IF;
  
  -- Update last login
  UPDATE public.admin_credentials 
  SET last_login = NOW(), updated_at = NOW()
  WHERE id = admin_record.id;
  
  -- Return success with admin info
  RETURN json_build_object(
    'success', true,
    'admin', json_build_object(
      'id', admin_record.id,
      'username', admin_record.username,
      'last_login', admin_record.last_login
    )
  );
END;
$$;

-- Function to update admin credentials
CREATE OR REPLACE FUNCTION public.update_admin_credentials(
  current_username TEXT,
  current_password TEXT,
  new_username TEXT DEFAULT NULL,
  new_password TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
  final_username TEXT;
  final_password_hash TEXT;
BEGIN
  -- Verify current credentials first
  SELECT id, username, password_hash, is_active
  INTO admin_record
  FROM public.admin_credentials
  WHERE username = current_username AND is_active = TRUE
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Current credentials are invalid'
    );
  END IF;
  
  -- Verify current password
  IF admin_record.password_hash != current_password THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Current password is incorrect'
    );
  END IF;
  
  -- Prepare new values
  final_username := COALESCE(new_username, admin_record.username);
  final_password_hash := COALESCE(new_password, admin_record.password_hash);
  
  -- Check if new username is already taken (if different)
  IF final_username != admin_record.username THEN
    IF EXISTS (SELECT 1 FROM public.admin_credentials WHERE username = final_username AND id != admin_record.id) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Username is already taken'
      );
    END IF;
  END IF;
  
  -- Update credentials
  UPDATE public.admin_credentials
  SET 
    username = final_username,
    password_hash = final_password_hash,
    updated_at = NOW()
  WHERE id = admin_record.id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Credentials updated successfully'
  );
END;
$$;

-- Function to get admin info by username
CREATE OR REPLACE FUNCTION public.get_admin_info(input_username TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  SELECT id, username, is_active, created_at, last_login
  INTO admin_record
  FROM public.admin_credentials
  WHERE username = input_username AND is_active = TRUE
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Admin not found'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'admin', json_build_object(
      'id', admin_record.id,
      'username', admin_record.username,
      'is_active', admin_record.is_active,
      'created_at', admin_record.created_at,
      'last_login', admin_record.last_login
    )
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.verify_admin_login TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_login TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_credentials TO anon;
GRANT EXECUTE ON FUNCTION public.update_admin_credentials TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_info TO anon;
GRANT EXECUTE ON FUNCTION public.get_admin_info TO authenticated;

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

-- ============================================================
-- ADMIN FEATURES TABLES
-- ============================================================

-- Characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for admin tables (since admin access is handled by application logic)
-- Characters table - no RLS needed for admin functionality
ALTER TABLE public.characters DISABLE ROW LEVEL SECURITY;

-- OC Packages table
CREATE TABLE IF NOT EXISTS public.oc_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coins INTEGER NOT NULL CHECK (coins > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  offer BOOLEAN DEFAULT FALSE,
  offer_end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OC Packages table - no RLS needed for admin functionality
ALTER TABLE public.oc_packages DISABLE ROW LEVEL SECURITY;

-- Shop Items table
CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  color TEXT DEFAULT 'bg-blue-500',
  offer BOOLEAN DEFAULT FALSE,
  offer_end_at TIMESTAMPTZ,
  icon TEXT DEFAULT '🛒',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shop Items table - no RLS needed for admin functionality
ALTER TABLE public.shop_items DISABLE ROW LEVEL SECURITY;

-- Wheel Rewards table
CREATE TABLE IF NOT EXISTS public.wheel_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT 'bg-yellow-500',
  icon TEXT DEFAULT '🎁',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wheel Rewards table - no RLS needed for admin functionality  
ALTER TABLE public.wheel_rewards DISABLE ROW LEVEL SECURITY;

-- Enable the remaining admin tables for immediate use
ALTER TABLE public.oc_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- ADMIN NOTIFICATIONS SYSTEM
-- ============================================================

-- User registrations tracking for admin notifications
CREATE TABLE IF NOT EXISTS public.user_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  read_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  read_at TIMESTAMPTZ
);

-- Disable RLS for admin access
ALTER TABLE public.user_registrations DISABLE ROW LEVEL SECURITY;

-- Function to automatically create notification when user registers
CREATE OR REPLACE FUNCTION public.handle_user_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for new user registration
  INSERT INTO public.user_registrations (user_id, user_email, user_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification on user registration
DROP TRIGGER IF EXISTS on_user_registration_notification ON auth.users;
CREATE TRIGGER on_user_registration_notification
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_registration_notification();

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(notification_ids UUID[])
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_registrations 
  SET is_read = true, read_by = auth.uid(), read_at = NOW()
  WHERE id = ANY(notification_ids) AND is_read = false;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.user_registrations 
    WHERE is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_characters_updated_at 
BEFORE UPDATE ON public.characters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oc_packages_updated_at 
BEFORE UPDATE ON public.oc_packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shop_items_updated_at 
BEFORE UPDATE ON public.shop_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wheel_rewards_updated_at 
BEFORE UPDATE ON public.wheel_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PROFILE PICTURE FEATURE
-- ============================================================

-- Add profile_picture column if it doesn't exist (for existing databases)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add coins column if it doesn't exist (for existing databases)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;

-- ============================================================
-- COIN MANAGEMENT FUNCTIONS
-- ============================================================

-- Function to add coins to user account (when purchasing OC packages)
CREATE OR REPLACE FUNCTION public.add_user_coins(user_id UUID, coin_amount INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles 
  SET coins = COALESCE(coins, 0) + coin_amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to subtract coins from user account (when purchasing shop items)
CREATE OR REPLACE FUNCTION public.subtract_user_coins(user_id UUID, coin_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT coins INTO current_balance 
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Check if user has enough coins
  IF current_balance IS NULL OR current_balance < coin_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Subtract coins
  UPDATE public.profiles 
  SET coins = coins - coin_amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user coin balance
CREATE OR REPLACE FUNCTION public.get_user_coins(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_coins INTEGER;
BEGIN
  SELECT coins INTO user_coins 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN COALESCE(user_coins, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;