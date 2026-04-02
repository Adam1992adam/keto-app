// src/lib/auth.ts
// Shared auth helper — use in every protected dashboard page
//
// Usage:
//   import { requireAuth } from '../../lib/auth';
//   const auth = await requireAuth(Astro);
//   if ('redirect' in auth) return Astro.redirect(auth.redirect);
//   const { user, profile } = auth;

import { supabase, getUserClient, getProfile, isSubscriptionActive, updateCurrentDay } from './supabase';
import type { Profile } from './supabase';
import type { User, SupabaseClient } from '@supabase/supabase-js';

export interface AuthOk {
  user: User;
  profile: Profile;
  accessToken: string;
  db: SupabaseClient;
}

export interface AuthRedirect {
  redirect: string;
}

export type AuthResult = AuthOk | AuthRedirect;

/**
 * Validates the session cookie, loads the profile, and checks subscription.
 * Returns { user, profile } on success, or { redirect: '/path' } on failure.
 */
export async function requireAuth(Astro: any): Promise<AuthResult> {
  const accessToken = Astro.cookies.get('sb-access-token')?.value;
  if (!accessToken) return { redirect: '/login' };

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return { redirect: '/login' };

  // Use user-scoped client for all DB operations so RLS passes
  const db = getUserClient(accessToken);

  const profile = await getProfile(user.id, db);
  if (!profile) return { redirect: '/login' };

  if (!isSubscriptionActive(profile)) return { redirect: '/dashboard/expired' };

  // Advance journey day + update streak on every protected page load
  await updateCurrentDay(user.id, db);

  return { user, profile, accessToken, db };
}

/**
 * Like requireAuth but skips the subscription check.
 * Use on pages that must be accessible to expired/unsubscribed users
 * (e.g. /dashboard/upgrade, /dashboard/expired).
 */
export async function requireLogin(Astro: any): Promise<AuthResult> {
  const accessToken = Astro.cookies.get('sb-access-token')?.value;
  if (!accessToken) return { redirect: '/login' };

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return { redirect: '/login' };

  const db = getUserClient(accessToken);
  const profile = await getProfile(user.id, db);
  if (!profile) return { redirect: '/login' };

  return { user, profile, accessToken, db };
}
