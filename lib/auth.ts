import { supabase } from './supabase'

/**
 * PROPERTYFLOW AUTHENTICATION STRATEGY (SUPABASE)
 * 
 * To enable the features requested (Google Login, Email Verification):
 * 
 * 1. GOOGLE OAUTH SETUP:
 *    - Go to Supabase Project -> Authentication -> Providers -> Google.
 *    - Enable Google and enter your Client ID and Secret from Google Cloud Console.
 *    - Add your redirect URL: https://[your-project-id].supabase.co/auth/v1/callback
 * 
 * 2. EMAIL VERIFICATION (Magic Links):
 *    - Go to Supabase Project -> Authentication -> Email Templates.
 *    - Configure "Magic Link" template.
 *    - Supabase handles the verification email sending automatically.
 * 
 * 3. IMPLEMENTATION CODE:
 */

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  
  if (error) throw error
  return data
}

// Sign in with Magic Link (Email Verification)
export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })

  if (error) throw error
  return data
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.href = '/login'
}

// Get Session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
