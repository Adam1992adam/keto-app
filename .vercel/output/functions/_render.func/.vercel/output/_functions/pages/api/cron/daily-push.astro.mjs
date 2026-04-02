import { createClient } from '@supabase/supabase-js';
import { sendPushToUser } from '../../../chunks/push_Okp6OHEm.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, locals }) => {
  const authHeader = request.headers.get("authorization");
  const env = locals?.runtime?.env || {};
  const CRON_SECRET = env.CRON_SECRET || "4a282bfba3717aaa347998c82c8d720963482573b28d459aa970329afbf9394c";
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: "Forbidden" }, 403);
  }
  const url = new URL(request.url);
  const morning = url.searchParams.get("morning") !== "false";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const supabaseUrl = "https://ltgxafioalbkjdfkkpxy.supabase.co";
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return json({ error: "Supabase not configured" }, 500);
  const db = createClient(supabaseUrl, serviceKey);
  const { data: subs } = await db.from("push_subscriptions").select("user_id").order("user_id");
  if (!subs?.length) return json({ success: true, sent: 0, note: "no subscribers" });
  const userIds = [...new Set(subs.map((s) => s.user_id))];
  let sent = 0;
  let skipped = 0;
  for (const userId of userIds) {
    try {
      const { data: checkin } = await db.from("daily_checkins").select("id").eq("user_id", userId).eq("checkin_date", today).maybeSingle();
      if (checkin) {
        skipped++;
        continue;
      }
      const { data: prefs } = await db.from("notification_preferences").select("push_enabled, checkin_reminders, streak_warnings").eq("user_id", userId).maybeSingle();
      const pushEnabled = prefs?.push_enabled !== false;
      const checkinEnabled = prefs?.checkin_reminders !== false;
      const streakEnabled = prefs?.streak_warnings !== false;
      if (!pushEnabled) {
        skipped++;
        continue;
      }
      if (morning && checkinEnabled) {
        const { data: journey } = await db.from("user_journey").select("current_day, streak_days").eq("user_id", userId).maybeSingle();
        const day = journey?.current_day || 1;
        const streak = journey?.streak_days || 0;
        const streakNote = streak > 1 ? ` You're on a ${streak}-day streak — keep it going!` : "";
        const result = await sendPushToUser(userId, {
          title: `Day ${day} Check-in ☀️`,
          body: `Good morning! Log your daily check-in to earn 30 XP.${streakNote}`,
          url: "/dashboard/checkin",
          tag: "checkin_reminder",
          priority: "normal"
        });
        if (result.sent > 0) sent++;
      } else if (!morning && streakEnabled) {
        const { data: journey } = await db.from("user_journey").select("streak_days").eq("user_id", userId).maybeSingle();
        const streak = journey?.streak_days || 0;
        if (streak > 0) {
          const result = await sendPushToUser(userId, {
            title: `⚠️ Streak at risk!`,
            body: `Your ${streak}-day streak expires at midnight. Check in now to protect it!`,
            url: "/dashboard/checkin",
            tag: "streak_warning",
            priority: "urgent"
          });
          if (result.sent > 0) sent++;
          try {
            const { data: userProfile } = await db.from("profiles").select("email, full_name").eq("id", userId).maybeSingle();
            if (userProfile?.email) {
              const { sendStreakWarningEmail } = await import('../../../chunks/email_CChWb1pC.mjs');
              await sendStreakWarningEmail(userProfile.email, userProfile.full_name || "there", streak).catch(() => {
              });
            }
          } catch {
          }
        } else {
          skipped++;
        }
      }
    } catch (err) {
      console.error(`Push cron error for user ${userId}:`, err?.message || err);
    }
  }
  return json({
    success: true,
    mode: morning ? "morning_reminder" : "evening_streak_warning",
    total_subscribers: userIds.length,
    sent,
    skipped
  });
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
