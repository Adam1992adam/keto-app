import { s as supabase, g as getProfile, i as isSubscriptionActive, u as updateCurrentDay } from './supabase_D4h9lf_Y.mjs';

async function requireAuth(Astro) {
  const accessToken = Astro.cookies.get("sb-access-token")?.value;
  if (!accessToken) return { redirect: "/login" };
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return { redirect: "/login" };
  const profile = await getProfile(user.id);
  if (!profile) return { redirect: "/login" };
  if (!isSubscriptionActive(profile)) return { redirect: "/dashboard/expired" };
  await updateCurrentDay(user.id);
  return { user, profile };
}
async function requireLogin(Astro) {
  const accessToken = Astro.cookies.get("sb-access-token")?.value;
  if (!accessToken) return { redirect: "/login" };
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return { redirect: "/login" };
  const profile = await getProfile(user.id);
  if (!profile) return { redirect: "/login" };
  return { user, profile };
}

export { requireLogin as a, requireAuth as r };
