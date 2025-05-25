
import { createClient } from '@supabase/supabase-js';
import type { ExtendedDatabase } from '@/types/supabase';

// The Supabase URL and anon key are provided via environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a singleton instance of the Supabase client with proper configuration
export const supabase = createClient<ExtendedDatabase>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Type-safe wrapper functions for common operations
export async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, profileData: Partial<{
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  street: string;
  postal_code: string;
  country: string;
  birth_date: string;
}>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Helper for checking if a user has a valid subscription
export async function checkSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!data) return { hasSubscription: false };
  
  const now = new Date();
  const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const periodEndsAt = data.current_period_ends_at ? new Date(data.current_period_ends_at) : null;
  
  const isActive = data.status === 'active';
  const isTrial = data.status === 'trial' && trialEndsAt && trialEndsAt > now;
  const isPeriodValid = periodEndsAt && periodEndsAt > now;
  
  return {
    hasSubscription: isActive || isTrial || isPeriodValid,
    subscription: data,
    isActive,
    isTrial,
    isPeriodValid,
    trialEndsAt,
    periodEndsAt
  };
}
