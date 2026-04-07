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
import type { AstroCookies } from 'astro';
import type { User, SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// API route auth helper
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiAuthOk {
  ok: true;
  user: User;
  db: SupabaseClient;
  accessToken: string;
}

export interface ApiAuthFail {
  ok: false;
  response: Response;
}

export type ApiAuthResult = ApiAuthOk | ApiAuthFail;

/**
 * Auth helper for API routes. Validates the session cookie and returns a
 * user-scoped Supabase client (so RLS auth.uid() resolves correctly).
 * Automatically refreshes an expired access token using the refresh token cookie.
 *
 * Usage:
 *   const auth = await requireApiAuth(cookies);
 *   if (!auth.ok) return auth.response;
 *   const { user, db } = auth;
 */
export async function requireApiAuth(cookies: AstroCookies): Promise<ApiAuthResult> {
  let accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return _apiUnauthorized();

  let { data: { user }, error } = await supabase.auth.getUser(accessToken);

  // Access token expired — try to refresh using the refresh token cookie
  if (error || !user) {
    const refreshToken = cookies.get('sb-refresh-token')?.value;
    if (!refreshToken) return _apiUnauthorized();

    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (refreshError || !refreshData.session) return _apiUnauthorized();

    accessToken = refreshData.session.access_token;
    user = refreshData.user!;
    _setSessionCookies(cookies, refreshData.session.access_token, refreshData.session.refresh_token);
  }

  return { ok: true, user: user!, db: getUserClient(accessToken), accessToken };
}

function _apiUnauthorized(): ApiAuthFail {
  return {
    ok: false,
    response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }),
  };
}

function _setSessionCookies(cookies: AstroCookies, accessToken: string, refreshToken: string) {
  cookies.set('sb-access-token', accessToken, {
    path: '/', httpOnly: true, secure: true, sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  });
  cookies.set('sb-refresh-token', refreshToken, {
    path: '/', httpOnly: true, secure: true, sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard page auth helpers
// ─────────────────────────────────────────────────────────────────────────────

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
 * Automatically refreshes an expired access token using the refresh token cookie.
 */
export async function requireAuth(Astro: any): Promise<AuthResult> {
  let accessToken = Astro.cookies.get('sb-access-token')?.value;
  if (!accessToken) return { redirect: '/login' };

  let { data: { user }, error } = await supabase.auth.getUser(accessToken);

  // Access token expired — try to refresh using the refresh token cookie
  if (error || !user) {
    const refreshToken = Astro.cookies.get('sb-refresh-token')?.value;
    if (!refreshToken) return { redirect: '/login' };

    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (refreshError || !refreshData.session) return { redirect: '/login' };

    accessToken = refreshData.session.access_token;
    user = refreshData.user!;
    _setSessionCookies(Astro.cookies, refreshData.session.access_token, refreshData.session.refresh_token);
  }

  // Use user-scoped client for all DB operations so RLS passes
  const db = getUserClient(accessToken);

  const profile = await getProfile(user!.id, db);
  if (!profile) return { redirect: '/login' };

  if (!isSubscriptionActive(profile)) return { redirect: '/dashboard/expired' };

  // Advance journey day + update streak on every protected page load
  await updateCurrentDay(user!.id, db);

  return { user: user!, profile, accessToken, db };
}

/**
 * Like requireAuth but skips the subscription check.
 * Use on pages that must be accessible to expired/unsubscribed users
 * (e.g. /dashboard/upgrade, /dashboard/expired).
 */
export async function requireLogin(Astro: any): Promise<AuthResult> {
  let accessToken = Astro.cookies.get('sb-access-token')?.value;
  if (!accessToken) return { redirect: '/login' };

  let { data: { user }, error } = await supabase.auth.getUser(accessToken);

  // Access token expired — try to refresh using the refresh token cookie
  if (error || !user) {
    const refreshToken = Astro.cookies.get('sb-refresh-token')?.value;
    if (!refreshToken) return { redirect: '/login' };

    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (refreshError || !refreshData.session) return { redirect: '/login' };

    accessToken = refreshData.session.access_token;
    user = refreshData.user!;
    _setSessionCookies(Astro.cookies, refreshData.session.access_token, refreshData.session.refresh_token);
  }

  const db = getUserClient(accessToken);
  const profile = await getProfile(user!.id, db);
  if (!profile) return { redirect: '/login' };

  // Initialize journey with user-scoped client so RLS passes
  await updateCurrentDay(user!.id, db);

  return { user: user!, profile, accessToken, db };
}
