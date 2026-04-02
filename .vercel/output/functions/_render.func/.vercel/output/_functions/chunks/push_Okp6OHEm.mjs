import webpush from 'web-push';

function getWebPush() {
  const publicKey = "BIxMNga4pWzvQDMQgv0ZjwGLiyR_g34K9l1MfTB23W3Xsjwj7FkRk0p1pgA0EL2Xo-azzanTApqMPEhz1Pjo-0I";
  const privateKey = "IJSR7jvQLTa5BaX4kM7qLr0c7N8sG_KhNgnQfU_qSbg";
  const email = "mailto:admin@ketojourney.app";
  webpush.setVapidDetails(email, publicKey, privateKey);
  return webpush;
}
function getServiceClient() {
  throw new Error("Supabase service role key not configured");
}
async function sendPushToUser(userId, payload) {
  const db = getServiceClient();
  const wp = getWebPush();
  const { data: subs, error } = await db.from("push_subscriptions").select("id, endpoint, p256dh, auth_key").eq("user_id", userId);
  if (error || !subs?.length) return { sent: 0, failed: 0 };
  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/icon-192.png",
    badge: payload.badge || "/icon-72.png",
    url: payload.url || "/dashboard",
    tag: payload.tag || "keto",
    priority: payload.priority || "normal"
  });
  const staleIds = [];
  let sent = 0;
  let failed = 0;
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await wp.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          message,
          { TTL: 86400, urgency: payload.priority === "urgent" ? "high" : "normal" }
        );
        sent++;
        await db.from("push_subscriptions").update({ last_used: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sub.id);
      } catch (err) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          staleIds.push(sub.id);
        }
        failed++;
      }
    })
  );
  if (staleIds.length > 0) {
    await db.from("push_subscriptions").delete().in("id", staleIds);
  }
  return { sent, failed };
}
async function sendPushToUsers(userIds, payload) {
  let total_sent = 0;
  let total_failed = 0;
  const batchSize = 10;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((uid) => sendPushToUser(uid, payload))
    );
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        total_sent += r.value.sent;
        total_failed += r.value.failed;
      }
    });
  }
  return { total_sent, total_failed };
}

export { sendPushToUser, sendPushToUsers };
