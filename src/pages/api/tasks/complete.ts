// src/pages/api/tasks/complete.ts
// POST /api/tasks/complete
//
// Accepts TWO calling patterns:
//   Pattern A (from dashboard):  { taskId: "uuid", completed: true }
//   Pattern B (from recipe page): { taskType: "breakfast", dayNumber: 19, completed: true }

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { checkAchievements } from '../../../lib/autoTask';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase, accessToken } = auth;

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  // Accept both camelCase and snake_case
  const taskId     = body.taskId     || body.task_id;
  const taskType   = body.taskType   || body.task_type;
  const dayNumber  = body.dayNumber  || body.day_number;
  const completed  = body.completed !== undefined ? body.completed : true;

  // Must have at least one identifier
  if (!taskId && !taskType) {
    return json({ error: 'Provide taskId or taskType+dayNumber', received: JSON.stringify(body) }, 400);
  }

  // ── Find the task ──
  let query = supabase
    .from('daily_tasks')
    .select('id, task_title, task_type, completed, xp_earned, day_number, user_id')
    .eq('user_id', user.id);

  if (taskId) {
    query = query.eq('id', taskId);
  } else {
    // Pattern B: find by type + day
    const { data: journey } = await supabase
      .from('user_journey')
      .select('current_day')
      .eq('user_id', user.id)
      .maybeSingle();

    const targetDay = dayNumber || journey?.current_day || 1;
    query = query.eq('task_type', taskType).eq('day_number', targetDay);
  }

  const { data: task, error: taskErr } = await query.maybeSingle();

  if (taskErr) return json({ error: 'DB error: ' + taskErr.message }, 500);
  if (!task)   return json({ error: 'Task not found', taskId, taskType, dayNumber }, 404);

  const newCompleted = completed !== undefined ? completed : true;

  // No change needed
  if (task.completed === newCompleted) {
    return json({ success: true, xpAwarded: 0, completed: newCompleted, alreadyDone: true });
  }

  if (newCompleted) {
    // ── Try complete_task RPC first ──
    const { error: rpcErr } = await supabase.rpc('complete_task', {
      user_id_param:    user.id,
      day_number_param: task.day_number,
      task_type_param:  task.task_type,
    });

    if (rpcErr) {
      // RPC failed → direct update + award_xp
      console.warn('complete_task RPC failed:', rpcErr.message);

      const { error: upErr } = await supabase
        .from('daily_tasks')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', task.id)
        .eq('user_id', user.id);

      if (upErr) return json({ error: 'Update failed: ' + upErr.message }, 500);

      if (task.xp_earned) {
        // Try award_xp RPC
        const { error: xpErr } = await supabase.rpc('award_xp', {
          user_id_param:     user.id,
          action_type_param: 'task_complete',
          xp_amount_param:   task.xp_earned,
          description_param: `Completed: ${task.task_title}`,
          day_number_param:  task.day_number,
        });

        if (xpErr) {
          // Final fallback: update user_journey directly
          console.warn('award_xp RPC failed:', xpErr.message);
          const { data: j } = await supabase
            .from('user_journey')
            .select('total_xp, level')
            .eq('user_id', user.id)
            .maybeSingle();

          if (j) {
            const newXP  = (j.total_xp || 0) + task.xp_earned;
            const newLvl = Math.floor(newXP / 500) + 1;
            await supabase
              .from('user_journey')
              .update({ total_xp: newXP, level: newLvl })
              .eq('user_id', user.id);
          }
        }
      }
    }

    checkAchievements(user.id, accessToken); // fire-and-forget
    return json({ success: true, xpAwarded: task.xp_earned || 0, completed: true });

  } else {
    // ── Uncomplete ──
    const { error: upErr } = await supabase
      .from('daily_tasks')
      .update({ completed: false, completed_at: null })
      .eq('id', task.id)
      .eq('user_id', user.id);

    if (upErr) return json({ error: 'Update failed: ' + upErr.message }, 500);
    return json({ success: true, xpAwarded: 0, completed: false });
  }
};

