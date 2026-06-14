// POST /api/admin/delete-user  { userId: string }
// Permanently deletes a user and ALL their data from every table.
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json() as { userId?: string };
    const { userId } = body;
    if (!userId || typeof userId !== 'string') return json({ error: 'userId required' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const url = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminDb = createClient(url, key);

    // Delete from all user data tables before removing the auth user
    const tables = [
      'achievements',
      'body_measurements',
      'chat_messages',
      'community_comments',
      'community_posts',
      'community_reactions',
      'completed_days',
      'custom_shopping_items',
      'daily_checkins',
      'daily_progress',
      'daily_reflections',
      'daily_tasks',
      'fasting_sessions',
      'food_logs',
      'habit_completions',
      'habits',
      'ketone_logs',
      'macro_goals',
      'meal_completions',
      'meal_prep_plans',
      'meal_swaps',
      'notification_preferences',
      'notifications',
      'onboarding_data',
      'progress_photos',
      'push_subscriptions',
      'quiz_responses',
      'recipe_collections',
      'recipe_favorites',
      'referral_codes',
      'shopping_checks',
      'step_logs',
      'user_meal_plan',
      'user_journey',
      'water_intake',
      'weekly_reports',
      'xp_transactions',
    ];

    for (const table of tables) {
      await adminDb.from(table).delete().eq('user_id', userId);
    }

    // referrals has two user columns
    await adminDb.from('referrals').delete().eq('referrer_id', userId);
    await adminDb.from('referrals').delete().eq('referred_user_id', userId);

    // community_reports uses reporter_id
    await adminDb.from('community_reports').delete().eq('reporter_id', userId);

    // recipe_collection_items links to recipe_collections — fetch collection IDs first
    const { data: collections } = await adminDb
      .from('recipe_collections')
      .select('id')
      .eq('user_id', userId);
    if (collections && collections.length > 0) {
      const colIds = collections.map(c => c.id);
      await adminDb.from('recipe_collection_items').delete().in('collection_id', colIds);
    }

    // pending_activations uses email — get it from profiles first
    const { data: profile } = await adminDb
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .maybeSingle();
    if (profile?.email) {
      await adminDb.from('pending_activations').delete().eq('email', profile.email);
    }

    // Finally delete the auth user (this also cascades to profiles)
    const { error } = await adminDb.auth.admin.deleteUser(userId);
    if (error) {
      console.error('[admin/delete-user]', userId, error);
      return json({ error: error.message }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('[admin/delete-user]', err);
    return json({ error: 'Server error' }, 500);
  }
};
