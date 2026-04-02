import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { c as checkAchievements } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const taskId = body.taskId || body.task_id;
  const taskType = body.taskType || body.task_type;
  const dayNumber = body.dayNumber || body.day_number;
  const completed = body.completed !== void 0 ? body.completed : true;
  if (!taskId && !taskType) {
    return json({ error: "Provide taskId or taskType+dayNumber", received: JSON.stringify(body) }, 400);
  }
  let query = supabase.from("daily_tasks").select("id, task_title, task_type, completed, xp_earned, day_number, user_id").eq("user_id", user.id);
  if (taskId) {
    query = query.eq("id", taskId);
  } else {
    const { data: journey } = await supabase.from("user_journey").select("current_day").eq("user_id", user.id).maybeSingle();
    const targetDay = dayNumber || journey?.current_day || 1;
    query = query.eq("task_type", taskType).eq("day_number", targetDay);
  }
  const { data: task, error: taskErr } = await query.maybeSingle();
  if (taskErr) return json({ error: "DB error: " + taskErr.message }, 500);
  if (!task) return json({ error: "Task not found", taskId, taskType, dayNumber }, 404);
  const newCompleted = completed !== void 0 ? completed : true;
  if (task.completed === newCompleted) {
    return json({ success: true, xpAwarded: 0, completed: newCompleted, alreadyDone: true });
  }
  if (newCompleted) {
    const { error: rpcErr } = await supabase.rpc("complete_task", {
      user_id_param: user.id,
      day_number_param: task.day_number,
      task_type_param: task.task_type
    });
    if (rpcErr) {
      console.warn("complete_task RPC failed:", rpcErr.message);
      const { error: upErr } = await supabase.from("daily_tasks").update({ completed: true, completed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", task.id).eq("user_id", user.id);
      if (upErr) return json({ error: "Update failed: " + upErr.message }, 500);
      if (task.xp_earned) {
        const { error: xpErr } = await supabase.rpc("award_xp", {
          user_id_param: user.id,
          action_type_param: "task_complete",
          xp_amount_param: task.xp_earned,
          description_param: `Completed: ${task.task_title}`,
          day_number_param: task.day_number
        });
        if (xpErr) {
          console.warn("award_xp RPC failed:", xpErr.message);
          const { data: j } = await supabase.from("user_journey").select("total_xp, level").eq("user_id", user.id).maybeSingle();
          if (j) {
            const newXP = (j.total_xp || 0) + task.xp_earned;
            const newLvl = Math.floor(newXP / 500) + 1;
            await supabase.from("user_journey").update({ total_xp: newXP, level: newLvl }).eq("user_id", user.id);
          }
        }
      }
    }
    checkAchievements(user.id, accessToken);
    return json({ success: true, xpAwarded: task.xp_earned || 0, completed: true });
  } else {
    const { error: upErr } = await supabase.from("daily_tasks").update({ completed: false, completed_at: null }).eq("id", task.id).eq("user_id", user.id);
    if (upErr) return json({ error: "Update failed: " + upErr.message }, 500);
    return json({ success: true, xpAwarded: 0, completed: false });
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
