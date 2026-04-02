/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, m as maybeRenderHead, e as createAstro, g as addAttribute, r as renderComponent, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import 'clsx';
/* empty css                                                       */
import { $ as $$Bell } from '../../chunks/Bell_ecy3JKOD.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$PushPermission = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PushPermission;
  const { compact = false } = Astro2.props;
  const vapidPublicKey = "BIxMNga4pWzvQDMQgv0ZjwGLiyR_g34K9l1MfTB23W3Xsjwj7FkRk0p1pgA0EL2Xo-azzanTApqMPEhz1Pjo-0I";
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", "<script>(function(){", "\n(function() {\n  // ── Helpers ────────────────────────────────────────────────\n  function urlBase64ToUint8Array(base64String) {\n    var padding = '='.repeat((4 - base64String.length % 4) % 4);\n    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');\n    var rawData = atob(base64);\n    var outputArray = new Uint8Array(rawData.length);\n    for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);\n    return outputArray;\n  }\n\n  function setUI(state) {\n    // state: 'default' | 'active' | 'blocked' | 'unsupported' | 'loading'\n    var enableBtn    = document.getElementById('pushEnableBtn');\n    var disableBtn   = document.getElementById('pushDisableBtn');\n    var blockedBadge = document.getElementById('pushBlockedBadge');\n    var activeBadge  = document.getElementById('pushActiveBadge');\n    var unsupBadge   = document.getElementById('pushUnsupportedBadge');\n    var desc         = document.getElementById('pushDesc');\n    var card         = document.getElementById('pushPermCard');\n\n    if (!enableBtn) return; // compact mode or not rendered\n\n    enableBtn.style.display    = state === 'default'  ? '' : 'none';\n    disableBtn.style.display   = state === 'active'   ? '' : 'none';\n    blockedBadge.style.display = state === 'blocked'  ? '' : 'none';\n    activeBadge.style.display  = state === 'active'   ? '' : 'none';\n    unsupBadge.style.display   = state === 'unsupported' ? '' : 'none';\n\n    if (state === 'loading') {\n      enableBtn.style.display = '';\n      enableBtn.disabled = true;\n      enableBtn.textContent = 'Enabling…';\n    }\n\n    if (card) {\n      card.classList.toggle('push-card-active', state === 'active');\n    }\n\n    if (desc) {\n      if (state === 'active') desc.textContent = 'Push notifications are active on this device. You\\'ll receive check-in reminders, streak warnings, and milestone alerts.';\n      if (state === 'blocked') desc.textContent = 'Notifications are blocked in your browser. Open browser settings and allow notifications for this site, then refresh the page.';\n      if (state === 'unsupported') desc.textContent = 'Your browser does not support push notifications. Try Chrome, Edge, or Firefox.';\n    }\n\n    // Compact button\n    var compactBtn = document.getElementById('pushCompactBtn');\n    if (compactBtn) {\n      compactBtn.style.opacity = state === 'active' ? '1' : '0.5';\n      compactBtn.title = state === 'active' ? 'Push notifications active' : 'Enable push notifications';\n      compactBtn.style.color = state === 'active' ? 'var(--green, #10b981)' : '';\n    }\n  }\n\n  async function checkStatus() {\n    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {\n      setUI('unsupported'); return;\n    }\n    var perm = Notification.permission;\n    if (perm === 'denied') { setUI('blocked'); return; }\n\n    var reg = await navigator.serviceWorker.ready;\n    var sub = await reg.pushManager.getSubscription();\n    setUI(sub ? 'active' : 'default');\n  }\n\n  async function requestPermission() {\n    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {\n      setUI('unsupported'); return;\n    }\n    if (!vapidPublicKey) {\n      alert('Push notifications not configured. Add VAPID keys to your .env file.');\n      return;\n    }\n\n    setUI('loading');\n\n    try {\n      var perm = await Notification.requestPermission();\n      if (perm !== 'granted') { setUI('blocked'); return; }\n\n      var reg = await navigator.serviceWorker.ready;\n      var sub = await reg.pushManager.subscribe({\n        userVisibleOnly: true,\n        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),\n      });\n\n      var res = await fetch('/api/notifications/push-subscribe', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(sub.toJSON()),\n      });\n\n      if (res.ok) {\n        setUI('active');\n        localStorage.setItem('keto-push-enabled', 'true');\n      } else {\n        setUI('default');\n        console.error('Failed to save push subscription');\n      }\n    } catch (err) {\n      console.error('Push subscribe error:', err);\n      setUI(Notification.permission === 'denied' ? 'blocked' : 'default');\n    }\n  }\n\n  async function disablePush() {\n    try {\n      var reg = await navigator.serviceWorker.ready;\n      var sub = await reg.pushManager.getSubscription();\n      if (sub) {\n        // Tell server to remove it\n        await fetch('/api/notifications/push-unsubscribe', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ endpoint: sub.endpoint }),\n        });\n        await sub.unsubscribe();\n      }\n      localStorage.removeItem('keto-push-enabled');\n      setUI('default');\n    } catch (err) {\n      console.error('Push unsubscribe error:', err);\n    }\n  }\n\n  // Expose globally\n  window.__pushRequest = requestPermission;\n  window.__pushDisable = disablePush;\n\n  // Check status on load\n  checkStatus();\n})();\n})();</script>"], ["", "<script>(function(){", "\n(function() {\n  // ── Helpers ────────────────────────────────────────────────\n  function urlBase64ToUint8Array(base64String) {\n    var padding = '='.repeat((4 - base64String.length % 4) % 4);\n    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');\n    var rawData = atob(base64);\n    var outputArray = new Uint8Array(rawData.length);\n    for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);\n    return outputArray;\n  }\n\n  function setUI(state) {\n    // state: 'default' | 'active' | 'blocked' | 'unsupported' | 'loading'\n    var enableBtn    = document.getElementById('pushEnableBtn');\n    var disableBtn   = document.getElementById('pushDisableBtn');\n    var blockedBadge = document.getElementById('pushBlockedBadge');\n    var activeBadge  = document.getElementById('pushActiveBadge');\n    var unsupBadge   = document.getElementById('pushUnsupportedBadge');\n    var desc         = document.getElementById('pushDesc');\n    var card         = document.getElementById('pushPermCard');\n\n    if (!enableBtn) return; // compact mode or not rendered\n\n    enableBtn.style.display    = state === 'default'  ? '' : 'none';\n    disableBtn.style.display   = state === 'active'   ? '' : 'none';\n    blockedBadge.style.display = state === 'blocked'  ? '' : 'none';\n    activeBadge.style.display  = state === 'active'   ? '' : 'none';\n    unsupBadge.style.display   = state === 'unsupported' ? '' : 'none';\n\n    if (state === 'loading') {\n      enableBtn.style.display = '';\n      enableBtn.disabled = true;\n      enableBtn.textContent = 'Enabling…';\n    }\n\n    if (card) {\n      card.classList.toggle('push-card-active', state === 'active');\n    }\n\n    if (desc) {\n      if (state === 'active') desc.textContent = 'Push notifications are active on this device. You\\\\'ll receive check-in reminders, streak warnings, and milestone alerts.';\n      if (state === 'blocked') desc.textContent = 'Notifications are blocked in your browser. Open browser settings and allow notifications for this site, then refresh the page.';\n      if (state === 'unsupported') desc.textContent = 'Your browser does not support push notifications. Try Chrome, Edge, or Firefox.';\n    }\n\n    // Compact button\n    var compactBtn = document.getElementById('pushCompactBtn');\n    if (compactBtn) {\n      compactBtn.style.opacity = state === 'active' ? '1' : '0.5';\n      compactBtn.title = state === 'active' ? 'Push notifications active' : 'Enable push notifications';\n      compactBtn.style.color = state === 'active' ? 'var(--green, #10b981)' : '';\n    }\n  }\n\n  async function checkStatus() {\n    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {\n      setUI('unsupported'); return;\n    }\n    var perm = Notification.permission;\n    if (perm === 'denied') { setUI('blocked'); return; }\n\n    var reg = await navigator.serviceWorker.ready;\n    var sub = await reg.pushManager.getSubscription();\n    setUI(sub ? 'active' : 'default');\n  }\n\n  async function requestPermission() {\n    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {\n      setUI('unsupported'); return;\n    }\n    if (!vapidPublicKey) {\n      alert('Push notifications not configured. Add VAPID keys to your .env file.');\n      return;\n    }\n\n    setUI('loading');\n\n    try {\n      var perm = await Notification.requestPermission();\n      if (perm !== 'granted') { setUI('blocked'); return; }\n\n      var reg = await navigator.serviceWorker.ready;\n      var sub = await reg.pushManager.subscribe({\n        userVisibleOnly: true,\n        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),\n      });\n\n      var res = await fetch('/api/notifications/push-subscribe', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(sub.toJSON()),\n      });\n\n      if (res.ok) {\n        setUI('active');\n        localStorage.setItem('keto-push-enabled', 'true');\n      } else {\n        setUI('default');\n        console.error('Failed to save push subscription');\n      }\n    } catch (err) {\n      console.error('Push subscribe error:', err);\n      setUI(Notification.permission === 'denied' ? 'blocked' : 'default');\n    }\n  }\n\n  async function disablePush() {\n    try {\n      var reg = await navigator.serviceWorker.ready;\n      var sub = await reg.pushManager.getSubscription();\n      if (sub) {\n        // Tell server to remove it\n        await fetch('/api/notifications/push-unsubscribe', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ endpoint: sub.endpoint }),\n        });\n        await sub.unsubscribe();\n      }\n      localStorage.removeItem('keto-push-enabled');\n      setUI('default');\n    } catch (err) {\n      console.error('Push unsubscribe error:', err);\n    }\n  }\n\n  // Expose globally\n  window.__pushRequest = requestPermission;\n  window.__pushDisable = disablePush;\n\n  // Check status on load\n  checkStatus();\n})();\n})();</script>"])), !compact ? renderTemplate`<!-- Full card (used in notification-preferences page) -->
  ${maybeRenderHead()}<div class="push-card" id="pushPermCard" data-astro-cid-dsy7y24q><div class="push-card-icon" id="pushIcon" data-astro-cid-dsy7y24q><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-dsy7y24q><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" data-astro-cid-dsy7y24q></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" data-astro-cid-dsy7y24q></path></svg></div><div class="push-card-body" data-astro-cid-dsy7y24q><div class="push-card-title" data-astro-cid-dsy7y24q>Push Notifications</div><div class="push-card-desc" id="pushDesc" data-astro-cid-dsy7y24q>Get reminders for check-ins, streak warnings, and milestone alerts — even when the app is closed.</div></div><div class="push-card-action" data-astro-cid-dsy7y24q><button class="push-btn push-btn-enable" id="pushEnableBtn" onclick="window.__pushRequest()" data-astro-cid-dsy7y24q>
Enable
</button><button class="push-btn push-btn-disable" id="pushDisableBtn" onclick="window.__pushDisable()" style="display:none" data-astro-cid-dsy7y24q>
Turn off
</button><span class="push-status push-status-blocked" id="pushBlockedBadge" style="display:none" data-astro-cid-dsy7y24q>
Blocked in browser
</span><span class="push-status push-status-on" id="pushActiveBadge" style="display:none" data-astro-cid-dsy7y24q>
Active
</span><span class="push-status push-status-unsupported" id="pushUnsupportedBadge" style="display:none" data-astro-cid-dsy7y24q>
Not supported
</span></div></div>` : renderTemplate`<!-- Compact toggle (used inline) -->
  <button class="push-compact-btn" id="pushCompactBtn" onclick="window.__pushRequest()" title="Enable push notifications" data-astro-cid-dsy7y24q><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-dsy7y24q><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" data-astro-cid-dsy7y24q></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" data-astro-cid-dsy7y24q></path></svg></button>`, defineScriptVars({ vapidPublicKey }));
}, "C:/Users/abdellatif/Videos/keto-app/src/components/PushPermission.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$NotificationPreferences = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NotificationPreferences;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const { data: existingPrefs } = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle();
  const prefs = existingPrefs || {
    checkin_reminder: true,
    streak_warning: true,
    incomplete_tasks: true,
    weight_reminder: true,
    fasting_active: true,
    weekly_review: true,
    milestone: true,
    level_up: true
  };
  const toggleItems = [
    {
      key: "checkin_reminder",
      icon: "\u{1F4CB}",
      label: "Daily Check-in Reminder",
      desc: "Get reminded to complete your daily check-in",
      value: prefs.checkin_reminder !== false
    },
    {
      key: "streak_warning",
      icon: "\u{1F525}",
      label: "Streak at Risk Warning",
      desc: "Alert when your streak is about to break",
      value: prefs.streak_warning !== false
    },
    {
      key: "incomplete_tasks",
      icon: "\u2705",
      label: "Incomplete Tasks Reminder",
      desc: "Nudge when you have tasks left for the day",
      value: prefs.incomplete_tasks !== false
    },
    {
      key: "weight_reminder",
      icon: "\u2696\uFE0F",
      label: "Weight Log Reminder",
      desc: "Prompt to log your weight if it has been a few days",
      value: prefs.weight_reminder !== false
    },
    {
      key: "fasting_active",
      icon: "\u23F1\uFE0F",
      label: "Fasting Tips",
      desc: "Receive tips and encouragement during active fasts",
      value: prefs.fasting_active !== false
    },
    {
      key: "weekly_review",
      icon: "\u{1F4CA}",
      label: "Weekly Review Prompt",
      desc: "Reminder to complete your weekly reflection",
      value: prefs.weekly_review !== false
    },
    {
      key: "milestone",
      icon: "\u{1F3C5}",
      label: "Day Milestones",
      desc: "Celebrate reaching key journey milestones",
      value: prefs.milestone !== false
    },
    {
      key: "level_up",
      icon: "\u2B50",
      label: "Level Up Celebrations",
      desc: "Notification when you gain a new XP level",
      value: prefs.level_up !== false
    }
  ];
  const enabledCount = toggleItems.filter((t) => t.value).length;
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-slvijxak> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Notification Preferences \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ var t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();
  <\/script>`, "</head> <body data-astro-cid-slvijxak> ", ' <div class="page-wrap" data-astro-cid-slvijxak> <!-- Back --> <a href="/dashboard/notifications" class="back-link fade-up" data-astro-cid-slvijxak>\n\u2190 Back to Notifications\n</a> <!-- Header --> <div class="page-header fade-up delay-1" data-astro-cid-slvijxak> <h1 data-astro-cid-slvijxak>Notification <em data-astro-cid-slvijxak>Preferences</em></h1> <p data-astro-cid-slvijxak>Choose which alerts you want to receive on your keto journey.</p> <div class="summary-badge" id="summaryBadge" data-astro-cid-slvijxak> ', " ", " of ", ' types enabled\n</div> </div> <!-- Push permission card --> <div style="margin-bottom:1.25rem;" class="fade-up delay-2" data-astro-cid-slvijxak> ', ' </div> <!-- Toggle card --> <div class="pref-card fade-up delay-2" id="prefCard" data-astro-cid-slvijxak> ', ` </div> <!-- Actions --> <div class="actions fade-up delay-3" data-astro-cid-slvijxak> <button class="btn-all" id="btnEnableAll" onclick="window.enableAll()" data-astro-cid-slvijxak>Enable All</button> <button class="btn-all" id="btnDisableAll" onclick="window.disableAll()" data-astro-cid-slvijxak>Disable All</button> <button class="btn-save" id="btnSave" onclick="window.savePrefs()" data-astro-cid-slvijxak>Save Preferences</button> </div> </div> <!-- Toast --> <div class="toast" id="toast" data-astro-cid-slvijxak></div> <script>
(function () {
  /* \u2500\u2500 helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function getAllToggles() {
    return document.querySelectorAll('.pref-toggle');
  }

  function getEnabledCount() {
    var count = 0;
    getAllToggles().forEach(function(t) { if (t.checked) count++; });
    return count;
  }

  function updateBadge() {
    var badge = document.getElementById('summaryBadge');
    var total = getAllToggles().length;
    var enabled = getEnabledCount();
    if (badge) badge.textContent = '\u{1F514} ' + enabled + ' of ' + total + ' types enabled';
  }

  /* \u2500\u2500 listen to toggles \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  getAllToggles().forEach(function(t) {
    t.addEventListener('change', function() {
      updateBadge();
    });
  });

  /* \u2500\u2500 enable / disable all \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.enableAll = function() {
    getAllToggles().forEach(function(t) { t.checked = true; });
    updateBadge();
  };

  window.disableAll = function() {
    getAllToggles().forEach(function(t) { t.checked = false; });
    updateBadge();
  };

  /* \u2500\u2500 toast \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.showToast = function(msg, type) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + (type || '');
    requestAnimationFrame(function() {
      el.classList.add('show');
    });
    setTimeout(function() {
      el.classList.remove('show');
    }, 3000);
  };

  /* \u2500\u2500 save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.savePrefs = function() {
    var btn = document.getElementById('btnSave');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving\u2026'; }

    var payload = {};
    getAllToggles().forEach(function(t) {
      payload[t.dataset.key] = t.checked;
    });

    fetch('/api/notifications/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          window.showToast('\u2705 Preferences saved!', 'success');
        } else {
          window.showToast('\u274C ' + (data.error || 'Failed to save'), 'error');
        }
      })
      .catch(function() {
        window.showToast('\u274C Network error \u2014 please retry', 'error');
      })
      .finally(function() {
        if (btn) { btn.disabled = false; btn.textContent = 'Save Preferences'; }
      });
  };
})();
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "notifications", "data-astro-cid-slvijxak": true }), renderComponent($$result, "Bell", $$Bell, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-slvijxak": true }), enabledCount, toggleItems.length, renderComponent($$result, "PushPermission", $$PushPermission, { "data-astro-cid-slvijxak": true }), toggleItems.map((item) => renderTemplate`<div class="toggle-row" data-astro-cid-slvijxak> <span class="row-icon" data-astro-cid-slvijxak>${item.icon}</span> <div class="row-text" data-astro-cid-slvijxak> <div class="row-label" data-astro-cid-slvijxak>${item.label}</div> <div class="row-desc" data-astro-cid-slvijxak>${item.desc}</div> </div> <div class="toggle-wrap" data-astro-cid-slvijxak> <input type="checkbox" class="toggle-input pref-toggle"${addAttribute(`toggle-${item.key}`, "id")}${addAttribute(item.key, "data-key")}${addAttribute(item.value, "checked")} data-astro-cid-slvijxak> <label class="toggle-track"${addAttribute(`toggle-${item.key}`, "for")} data-astro-cid-slvijxak></label> </div> </div>`));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/notification-preferences.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/notification-preferences.astro";
const $$url = "/dashboard/notification-preferences";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$NotificationPreferences,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
