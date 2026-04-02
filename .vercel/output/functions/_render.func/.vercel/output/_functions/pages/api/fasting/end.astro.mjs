import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { a as autoCompleteTask, c as checkAchievements } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const { session_id, ended_at, actual_hours, completed } = await request.json();
    const xp = completed ? Math.round(50 + actual_hours * 2) : Math.round(actual_hours * 2);
    const { error: updateError } = await supabase.from("fasting_sessions").update({
      ended_at: ended_at || (/* @__PURE__ */ new Date()).toISOString(),
      actual_hours: parseFloat(actual_hours) || 0,
      completed: !!completed,
      xp_earned: xp
    }).eq("id", session_id).eq("user_id", user.id);
    if (updateError) throw updateError;
    const desc = `${parseFloat(actual_hours).toFixed(1)}h fast — ${completed ? "Goal reached!" : "Partial fast"}`;
    const { error: xpRpcErr } = await supabase.rpc("award_xp", {
      user_id_param: user.id,
      action_type_param: "fasting",
      xp_amount_param: xp,
      description_param: desc,
      day_number_param: null
    });
    if (xpRpcErr) {
      console.warn("award_xp RPC failed:", xpRpcErr.message);
      const { data: journey2 } = await supabase.from("user_journey").select("total_xp, level").eq("user_id", user.id).maybeSingle();
      if (journey2) {
        const newXP = (journey2.total_xp || 0) + xp;
        await supabase.from("user_journey").update({ total_xp: newXP, level: Math.floor(newXP / 500) + 1 }).eq("user_id", user.id);
      }
    }
    const { data: journey } = await supabase.from("user_journey").select("current_day").eq("user_id", user.id).maybeSingle();
    if (journey?.current_day) {
      await autoCompleteTask(user.id, "fasting", journey.current_day);
    }
    checkAchievements(user.id, accessToken);
    return new Response(JSON.stringify({ success: true, xp_earned: xp }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Fasting end error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
