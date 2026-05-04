// GET /api/tasks/today — returns today's incomplete tasks for the notification dropdown
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { getUserJourney, updateCurrentDay } from '../../../lib/supabase';
import { json } from '../../../lib/apiResponse';

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  await updateCurrentDay(user.id, db);
  const journey = await getUserJourney(user.id, db);
  const currentDay = journey?.current_day || 1;

  const { data: tasks } = await db
    .from('daily_tasks')
    .select('id, task_title, task_type, completed, xp_earned')
    .eq('user_id', user.id)
    .eq('day_number', currentDay)
    .eq('completed', false)
    .order('task_type');

  return json({ tasks: tasks || [], currentDay });
};
