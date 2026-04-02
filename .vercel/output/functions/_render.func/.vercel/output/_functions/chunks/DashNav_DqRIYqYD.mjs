import { c as createComponent, d as renderTemplate, m as maybeRenderHead, e as createAstro, r as renderComponent, g as addAttribute } from './astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */
import { $ as $$, b as $$Utensils, a as $$Zap, c as $$Sparkles } from './Utensils_DbwmzDI-.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$a = createAstro();
const $$NotificationsBell = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$NotificationsBell;
  const { userId } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<!-- BELL BUTTON -->", `<div class="nb-wrap" id="nbWrap"> <button class="nb-btn" id="nbBtn" title="Notifications" aria-label="Notifications"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path> <path d="M13.73 21a2 2 0 0 1-3.46 0"></path> </svg> <span class="nb-badge" id="nbBadge" style="display:none;">0</span> </button> <!-- PANEL --> <div class="nb-panel" id="nbPanel"> <!-- Header --> <div class="nb-header"> <div class="nb-header-left"> <span class="nb-title">Notifications</span> <span class="nb-count" id="nbCountLabel">0 new</span> </div> <div class="nb-header-right"> <button class="nb-hbtn" id="nbMarkAll" title="Mark all as read">\u2713 All read</button> <button class="nb-hbtn nb-hbtn-dismiss" id="nbClearAll" title="Clear all">\u{1F5D1}\uFE0F</button> </div> </div> <!-- Push permission banner --> <div id="nbPushBtn" style="display:none;align-items:center;gap:.7rem;padding:.75rem 1.2rem;margin:.6rem .6rem .2rem;border-radius:14px;background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.06));border:1px solid rgba(16,185,129,.2);cursor:pointer;transition:all .2s;"> <div style="width:34px;height:34px;border-radius:10px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.25);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">\u{1F514}</div> <div style="flex:1;"> <div style="font-size:.75rem;font-weight:700;color:#10b981;margin-bottom:.1rem;">Enable Meal Reminders</div> <div style="font-size:.67rem;color:#4d7055;line-height:1.4;">Get notified at breakfast, lunch &amp; dinner time</div> </div> <span style="font-size:.65rem;font-weight:800;color:#10b981;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.25);padding:.25rem .6rem;border-radius:99px;white-space:nowrap;">Enable \u2192</span> </div> <!-- Loading state --> <div class="nb-loading" id="nbLoading"> <div class="nb-spinner"></div> <span>Loading notifications\u2026</span> </div> <!-- Empty state --> <div class="nb-empty" id="nbEmpty" style="display:none;"> <div class="nb-empty-icon">\u{1F389}</div> <div class="nb-empty-title">All caught up!</div> <div class="nb-empty-sub">No new notifications</div> </div> <!-- Notifications list --> <div class="nb-list" id="nbList" style="display:none;"></div> <!-- Footer --> <div class="nb-footer" id="nbFooter" style="display:none;"> <button class="nb-refresh" id="nbRefresh">\u{1F504} Refresh</button> </div> </div> </div>  <script>
(function() {
  const btn      = document.getElementById('nbBtn');
  const panel    = document.getElementById('nbPanel');
  const badge    = document.getElementById('nbBadge');
  const list     = document.getElementById('nbList');
  const loading  = document.getElementById('nbLoading');
  const empty    = document.getElementById('nbEmpty');
  const footer   = document.getElementById('nbFooter');
  const countLbl = document.getElementById('nbCountLabel');
  const markAll  = document.getElementById('nbMarkAll');
  const clearAll = document.getElementById('nbClearAll');
  const refresh  = document.getElementById('nbRefresh');

  let loaded = false;
  let notifications = [];

  // \u2500\u2500 Open / Close \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel?.classList.toggle('open');
    if (panel?.classList.contains('open') && !loaded) {
      generateAndLoad();
    }
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('nbWrap')?.contains(e.target)) {
      panel?.classList.remove('open');
    }
  });

  // \u2500\u2500 Generate then Load \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function generateAndLoad() {
    showLoading(true);
    try {
      // Generate smart notifications first
      await fetch('/api/notifications/generate', { method: 'POST' });
    } catch {}
    await loadNotifications();
  }

  // \u2500\u2500 Load notifications \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function loadNotifications() {
    showLoading(true);
    loaded = true;
    try {
      const res  = await fetch('/api/notifications?limit=25');
      const data = await res.json();
      notifications = data.notifications || [];
      renderNotifications();
      updateBadge(data.unreadCount || 0);
    } catch {
      showLoading(false);
      if (list) { list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--soft);font-size:.82rem;">Failed to load. Try refreshing.</div>'; list.style.display = 'block'; }
    }
  }

  // \u2500\u2500 Type \u2192 color theme \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function typeTheme(type, priority) {
    var T = {
      red:    { c:'#ef4444', card:'rgba(239,68,68,.09)',   card2:'rgba(239,68,68,.14)',  border:'rgba(239,68,68,.22)',  ac:'rgba(239,68,68,.15)',  ab:'rgba(239,68,68,.3)',  aColor:'#f87171' },
      gold:   { c:'#f59e0b', card:'rgba(245,158,11,.09)',  card2:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.22)', ac:'rgba(245,158,11,.14)', ab:'rgba(245,158,11,.3)', aColor:'#fbbf24' },
      purple: { c:'#8b5cf6', card:'rgba(139,92,246,.09)',  card2:'rgba(139,92,246,.14)', border:'rgba(139,92,246,.22)', ac:'rgba(139,92,246,.14)', ab:'rgba(139,92,246,.3)', aColor:'#a78bfa' },
      blue:   { c:'#3b82f6', card:'rgba(59,130,246,.09)',  card2:'rgba(59,130,246,.14)', border:'rgba(59,130,246,.22)', ac:'rgba(59,130,246,.14)', ab:'rgba(59,130,246,.3)', aColor:'#60a5fa' },
      cyan:   { c:'#06b6d4', card:'rgba(6,182,212,.09)',   card2:'rgba(6,182,212,.14)',  border:'rgba(6,182,212,.22)',  ac:'rgba(6,182,212,.14)',  ab:'rgba(6,182,212,.3)',  aColor:'#22d3ee' },
      green:  { c:'#10b981', card:'rgba(16,185,129,.09)',  card2:'rgba(16,185,129,.14)', border:'rgba(16,185,129,.2)',  ac:'rgba(16,185,129,.13)', ab:'rgba(16,185,129,.28)',aColor:'#34d399' },
    };
    if (priority === 'urgent' || type === 'streak_warning') return T.red;
    if (type.startsWith('streak_') || type.startsWith('milestone_')) return T.gold;
    if (type.startsWith('level_up_')) return T.purple;
    if (type === 'incomplete_tasks') return T.blue;
    if (type === 'fasting_active' || type === 'energy_trend') return T.purple;
    if (type === 'low_water' || type === 'weekly_review' || type === 'weight_reminder') return T.cyan;
    return T.green; // checkin, welcome, day1, weight_progress, meal_*
  }

  // \u2500\u2500 Render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function renderNotifications() {
    showLoading(false);
    if (!list) return;

    const active = notifications.filter(n => !n.is_dismissed);
    if (active.length === 0) {
      if (empty) empty.style.display = 'block';
      list.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (countLbl) countLbl.textContent = '0 new';
      return;
    }

    if (empty) empty.style.display = 'none';
    list.style.display = 'block';
    if (footer) footer.style.display = 'flex';

    const unread = active.filter(n => !n.is_read).length;
    if (countLbl) countLbl.textContent = unread > 0 ? \`\${unread} new\` : 'All read';

    list.innerHTML = active.map(n => {
      var t = typeTheme(n.type, n.priority);
      var isUnread = !n.is_read;
      return \`
      <div class="nb-item \${isUnread ? 'unread' : ''}"
           data-id="\${n.id}"
           style="--nb-bg:\${t.card};--nb-bg2:\${t.card2};--nb-border:\${t.border};"
           onclick="handleNotifClick('\${n.id}', '\${n.action_url || ''}')">
        <div class="nb-ico">\${n.icon || '\u{1F514}'}</div>
        <div class="nb-content">
          <div class="nb-item-title">\${escapeHtml(n.title)}</div>
          <div class="nb-item-body">\${escapeHtml(n.body)}</div>
          <div class="nb-item-meta">
            <span class="nb-item-time">\${timeAgo(n.created_at)}</span>
            \${n.action_label && n.action_url
              ? \`<a class="nb-item-action" href="\${n.action_url}"
                    style="background:\${t.ac};border:1px solid \${t.ab};color:\${t.aColor};"
                    onclick="event.stopPropagation();">\${escapeHtml(n.action_label)} \u2192</a>\`
              : ''}
            \${n.priority === 'urgent' ? '<span class="nb-urgent-tag">Urgent</span>' : ''}
          </div>
        </div>
        <button class="nb-dismiss" onclick="event.stopPropagation();dismissNotif('\${n.id}')" title="Dismiss">\xD7</button>
      </div>\`
    }).join('');
  }

  // \u2500\u2500 Handlers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  window.handleNotifClick = async function(id, url) {
    // Mark as read
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', notificationId: id }),
    });
    // Update local state
    const n = notifications.find(x => x.id === id);
    if (n) n.is_read = true;
    renderNotifications();
    updateBadge(notifications.filter(x => !x.is_read && !x.is_dismissed).length);
    // Navigate
    if (url && url !== '') window.location.href = url;
  };

  window.dismissNotif = async function(id) {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dismiss', notificationId: id }),
    });
    notifications = notifications.map(n => n.id === id ? { ...n, is_dismissed: true } : n);
    renderNotifications();
    updateBadge(notifications.filter(x => !x.is_read && !x.is_dismissed).length);
  };

  markAll?.addEventListener('click', async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', all: true }),
    });
    notifications = notifications.map(n => ({ ...n, is_read: true }));
    renderNotifications();
    updateBadge(0);
  });

  clearAll?.addEventListener('click', async () => {
    if (!confirm('Clear all notifications?')) return;
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dismiss_all' }),
    });
    notifications = [];
    renderNotifications();
    updateBadge(0);
  });

  refresh?.addEventListener('click', () => {
    loaded = false;
    generateAndLoad();
  });

  // \u2500\u2500 Badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateBadge(count) {
    if (!badge || !btn) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.style.display = 'flex';
      btn.classList.add('has-unread');
    } else {
      badge.style.display = 'none';
      btn.classList.remove('has-unread');
    }
  }

  // \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function showLoading(show) {
    if (loading) loading.style.display = show ? 'flex' : 'none';
    if (list)    list.style.display    = show ? 'none' : '';
    if (empty)   empty.style.display   = show ? 'none' : '';
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return \`\${Math.floor(diff/60)}m ago\`;
    if (diff < 86400) return \`\${Math.floor(diff/3600)}h ago\`;
    return \`\${Math.floor(diff/86400)}d ago\`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // \u2500\u2500 Auto-load badge count on page load \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function quickBadgeCheck() {
    try {
      const res  = await fetch('/api/notifications?limit=1');
      const data = await res.json();
      updateBadge(data.unreadCount || 0);
    } catch {}
  }
  quickBadgeCheck();

  // \u2500\u2500 Auto-refresh every 5 minutes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  setInterval(() => {
    if (!panel?.classList.contains('open')) {
      loaded = false;
      quickBadgeCheck();
    }
  }, 5 * 60 * 1000);

  // \u2500\u2500 Browser Push Permission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      return reg;
    } catch { return null; }
  }

  async function requestPushPermission() {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      await registerServiceWorker();
      showPushBtn(false);
      showInlineNotif('\u{1F514} Notifications enabled!');
      scheduleMealNotifs();
    }
  }

  function showPushBtn(show) {
    const pb = document.getElementById('nbPushBtn');
    if (pb) pb.style.display = show ? 'flex' : 'none';
  }

  function showInlineNotif(msg) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:4.5rem;right:1.5rem;z-index:9999;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;padding:.75rem 1.25rem;border-radius:12px;font-size:.82rem;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.3);';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 3000);
  }

  if ('Notification' in window && Notification.permission === 'default') {
    showPushBtn(true);
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    registerServiceWorker();
  }

  document.getElementById('nbPushBtn')?.addEventListener('click', function(e) {
    e.stopPropagation();
    requestPushPermission();
  });

  // \u2500\u2500 Meal-time browser notifications (tab-based) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function scheduleMealNotifs() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var LAST_KEY = 'keto-meal-notif-date';
    var todayStr = new Date().toISOString().split('T')[0];
    if (localStorage.getItem(LAST_KEY) === todayStr) return;
    var now = new Date();
    var meals = [
      { h: 8,  title: '\u{1F373} Time for Breakfast!',  body: 'Start your keto morning right \u2014 log your breakfast.' },
      { h: 13, title: '\u{1F957} Lunch Time!',           body: "Midday keto boost \u2014 don't forget to log your lunch." },
      { h: 16, title: '\u{1F95C} Afternoon Snack',       body: 'A keto snack keeps cravings away. Log it in the app!' },
      { h: 19, title: '\u{1F37D}\uFE0F Dinner is Ready!',     body: 'Complete your macros with a satisfying keto dinner.' },
    ];
    meals.forEach(function(meal) {
      var mealTime = new Date(); mealTime.setHours(meal.h, 0, 0, 0);
      var ms = mealTime.getTime() - now.getTime();
      if (ms > 0) {
        setTimeout(function() {
          if (Notification.permission === 'granted') {
            new Notification(meal.title, { body: meal.body, icon: '/icon-192.png', tag: 'keto-meal-' + meal.h });
          }
        }, ms);
      }
    });
    localStorage.setItem(LAST_KEY, todayStr);
  }
  scheduleMealNotifs();

})();
<\/script>`], ["<!-- BELL BUTTON -->", `<div class="nb-wrap" id="nbWrap"> <button class="nb-btn" id="nbBtn" title="Notifications" aria-label="Notifications"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path> <path d="M13.73 21a2 2 0 0 1-3.46 0"></path> </svg> <span class="nb-badge" id="nbBadge" style="display:none;">0</span> </button> <!-- PANEL --> <div class="nb-panel" id="nbPanel"> <!-- Header --> <div class="nb-header"> <div class="nb-header-left"> <span class="nb-title">Notifications</span> <span class="nb-count" id="nbCountLabel">0 new</span> </div> <div class="nb-header-right"> <button class="nb-hbtn" id="nbMarkAll" title="Mark all as read">\u2713 All read</button> <button class="nb-hbtn nb-hbtn-dismiss" id="nbClearAll" title="Clear all">\u{1F5D1}\uFE0F</button> </div> </div> <!-- Push permission banner --> <div id="nbPushBtn" style="display:none;align-items:center;gap:.7rem;padding:.75rem 1.2rem;margin:.6rem .6rem .2rem;border-radius:14px;background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.06));border:1px solid rgba(16,185,129,.2);cursor:pointer;transition:all .2s;"> <div style="width:34px;height:34px;border-radius:10px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.25);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">\u{1F514}</div> <div style="flex:1;"> <div style="font-size:.75rem;font-weight:700;color:#10b981;margin-bottom:.1rem;">Enable Meal Reminders</div> <div style="font-size:.67rem;color:#4d7055;line-height:1.4;">Get notified at breakfast, lunch &amp; dinner time</div> </div> <span style="font-size:.65rem;font-weight:800;color:#10b981;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.25);padding:.25rem .6rem;border-radius:99px;white-space:nowrap;">Enable \u2192</span> </div> <!-- Loading state --> <div class="nb-loading" id="nbLoading"> <div class="nb-spinner"></div> <span>Loading notifications\u2026</span> </div> <!-- Empty state --> <div class="nb-empty" id="nbEmpty" style="display:none;"> <div class="nb-empty-icon">\u{1F389}</div> <div class="nb-empty-title">All caught up!</div> <div class="nb-empty-sub">No new notifications</div> </div> <!-- Notifications list --> <div class="nb-list" id="nbList" style="display:none;"></div> <!-- Footer --> <div class="nb-footer" id="nbFooter" style="display:none;"> <button class="nb-refresh" id="nbRefresh">\u{1F504} Refresh</button> </div> </div> </div>  <script>
(function() {
  const btn      = document.getElementById('nbBtn');
  const panel    = document.getElementById('nbPanel');
  const badge    = document.getElementById('nbBadge');
  const list     = document.getElementById('nbList');
  const loading  = document.getElementById('nbLoading');
  const empty    = document.getElementById('nbEmpty');
  const footer   = document.getElementById('nbFooter');
  const countLbl = document.getElementById('nbCountLabel');
  const markAll  = document.getElementById('nbMarkAll');
  const clearAll = document.getElementById('nbClearAll');
  const refresh  = document.getElementById('nbRefresh');

  let loaded = false;
  let notifications = [];

  // \u2500\u2500 Open / Close \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel?.classList.toggle('open');
    if (panel?.classList.contains('open') && !loaded) {
      generateAndLoad();
    }
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('nbWrap')?.contains(e.target)) {
      panel?.classList.remove('open');
    }
  });

  // \u2500\u2500 Generate then Load \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function generateAndLoad() {
    showLoading(true);
    try {
      // Generate smart notifications first
      await fetch('/api/notifications/generate', { method: 'POST' });
    } catch {}
    await loadNotifications();
  }

  // \u2500\u2500 Load notifications \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function loadNotifications() {
    showLoading(true);
    loaded = true;
    try {
      const res  = await fetch('/api/notifications?limit=25');
      const data = await res.json();
      notifications = data.notifications || [];
      renderNotifications();
      updateBadge(data.unreadCount || 0);
    } catch {
      showLoading(false);
      if (list) { list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--soft);font-size:.82rem;">Failed to load. Try refreshing.</div>'; list.style.display = 'block'; }
    }
  }

  // \u2500\u2500 Type \u2192 color theme \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function typeTheme(type, priority) {
    var T = {
      red:    { c:'#ef4444', card:'rgba(239,68,68,.09)',   card2:'rgba(239,68,68,.14)',  border:'rgba(239,68,68,.22)',  ac:'rgba(239,68,68,.15)',  ab:'rgba(239,68,68,.3)',  aColor:'#f87171' },
      gold:   { c:'#f59e0b', card:'rgba(245,158,11,.09)',  card2:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.22)', ac:'rgba(245,158,11,.14)', ab:'rgba(245,158,11,.3)', aColor:'#fbbf24' },
      purple: { c:'#8b5cf6', card:'rgba(139,92,246,.09)',  card2:'rgba(139,92,246,.14)', border:'rgba(139,92,246,.22)', ac:'rgba(139,92,246,.14)', ab:'rgba(139,92,246,.3)', aColor:'#a78bfa' },
      blue:   { c:'#3b82f6', card:'rgba(59,130,246,.09)',  card2:'rgba(59,130,246,.14)', border:'rgba(59,130,246,.22)', ac:'rgba(59,130,246,.14)', ab:'rgba(59,130,246,.3)', aColor:'#60a5fa' },
      cyan:   { c:'#06b6d4', card:'rgba(6,182,212,.09)',   card2:'rgba(6,182,212,.14)',  border:'rgba(6,182,212,.22)',  ac:'rgba(6,182,212,.14)',  ab:'rgba(6,182,212,.3)',  aColor:'#22d3ee' },
      green:  { c:'#10b981', card:'rgba(16,185,129,.09)',  card2:'rgba(16,185,129,.14)', border:'rgba(16,185,129,.2)',  ac:'rgba(16,185,129,.13)', ab:'rgba(16,185,129,.28)',aColor:'#34d399' },
    };
    if (priority === 'urgent' || type === 'streak_warning') return T.red;
    if (type.startsWith('streak_') || type.startsWith('milestone_')) return T.gold;
    if (type.startsWith('level_up_')) return T.purple;
    if (type === 'incomplete_tasks') return T.blue;
    if (type === 'fasting_active' || type === 'energy_trend') return T.purple;
    if (type === 'low_water' || type === 'weekly_review' || type === 'weight_reminder') return T.cyan;
    return T.green; // checkin, welcome, day1, weight_progress, meal_*
  }

  // \u2500\u2500 Render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function renderNotifications() {
    showLoading(false);
    if (!list) return;

    const active = notifications.filter(n => !n.is_dismissed);
    if (active.length === 0) {
      if (empty) empty.style.display = 'block';
      list.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (countLbl) countLbl.textContent = '0 new';
      return;
    }

    if (empty) empty.style.display = 'none';
    list.style.display = 'block';
    if (footer) footer.style.display = 'flex';

    const unread = active.filter(n => !n.is_read).length;
    if (countLbl) countLbl.textContent = unread > 0 ? \\\`\\\${unread} new\\\` : 'All read';

    list.innerHTML = active.map(n => {
      var t = typeTheme(n.type, n.priority);
      var isUnread = !n.is_read;
      return \\\`
      <div class="nb-item \\\${isUnread ? 'unread' : ''}"
           data-id="\\\${n.id}"
           style="--nb-bg:\\\${t.card};--nb-bg2:\\\${t.card2};--nb-border:\\\${t.border};"
           onclick="handleNotifClick('\\\${n.id}', '\\\${n.action_url || ''}')">
        <div class="nb-ico">\\\${n.icon || '\u{1F514}'}</div>
        <div class="nb-content">
          <div class="nb-item-title">\\\${escapeHtml(n.title)}</div>
          <div class="nb-item-body">\\\${escapeHtml(n.body)}</div>
          <div class="nb-item-meta">
            <span class="nb-item-time">\\\${timeAgo(n.created_at)}</span>
            \\\${n.action_label && n.action_url
              ? \\\`<a class="nb-item-action" href="\\\${n.action_url}"
                    style="background:\\\${t.ac};border:1px solid \\\${t.ab};color:\\\${t.aColor};"
                    onclick="event.stopPropagation();">\\\${escapeHtml(n.action_label)} \u2192</a>\\\`
              : ''}
            \\\${n.priority === 'urgent' ? '<span class="nb-urgent-tag">Urgent</span>' : ''}
          </div>
        </div>
        <button class="nb-dismiss" onclick="event.stopPropagation();dismissNotif('\\\${n.id}')" title="Dismiss">\xD7</button>
      </div>\\\`
    }).join('');
  }

  // \u2500\u2500 Handlers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  window.handleNotifClick = async function(id, url) {
    // Mark as read
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', notificationId: id }),
    });
    // Update local state
    const n = notifications.find(x => x.id === id);
    if (n) n.is_read = true;
    renderNotifications();
    updateBadge(notifications.filter(x => !x.is_read && !x.is_dismissed).length);
    // Navigate
    if (url && url !== '') window.location.href = url;
  };

  window.dismissNotif = async function(id) {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dismiss', notificationId: id }),
    });
    notifications = notifications.map(n => n.id === id ? { ...n, is_dismissed: true } : n);
    renderNotifications();
    updateBadge(notifications.filter(x => !x.is_read && !x.is_dismissed).length);
  };

  markAll?.addEventListener('click', async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', all: true }),
    });
    notifications = notifications.map(n => ({ ...n, is_read: true }));
    renderNotifications();
    updateBadge(0);
  });

  clearAll?.addEventListener('click', async () => {
    if (!confirm('Clear all notifications?')) return;
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dismiss_all' }),
    });
    notifications = [];
    renderNotifications();
    updateBadge(0);
  });

  refresh?.addEventListener('click', () => {
    loaded = false;
    generateAndLoad();
  });

  // \u2500\u2500 Badge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateBadge(count) {
    if (!badge || !btn) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.style.display = 'flex';
      btn.classList.add('has-unread');
    } else {
      badge.style.display = 'none';
      btn.classList.remove('has-unread');
    }
  }

  // \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function showLoading(show) {
    if (loading) loading.style.display = show ? 'flex' : 'none';
    if (list)    list.style.display    = show ? 'none' : '';
    if (empty)   empty.style.display   = show ? 'none' : '';
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return \\\`\\\${Math.floor(diff/60)}m ago\\\`;
    if (diff < 86400) return \\\`\\\${Math.floor(diff/3600)}h ago\\\`;
    return \\\`\\\${Math.floor(diff/86400)}d ago\\\`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // \u2500\u2500 Auto-load badge count on page load \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function quickBadgeCheck() {
    try {
      const res  = await fetch('/api/notifications?limit=1');
      const data = await res.json();
      updateBadge(data.unreadCount || 0);
    } catch {}
  }
  quickBadgeCheck();

  // \u2500\u2500 Auto-refresh every 5 minutes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  setInterval(() => {
    if (!panel?.classList.contains('open')) {
      loaded = false;
      quickBadgeCheck();
    }
  }, 5 * 60 * 1000);

  // \u2500\u2500 Browser Push Permission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      return reg;
    } catch { return null; }
  }

  async function requestPushPermission() {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      await registerServiceWorker();
      showPushBtn(false);
      showInlineNotif('\u{1F514} Notifications enabled!');
      scheduleMealNotifs();
    }
  }

  function showPushBtn(show) {
    const pb = document.getElementById('nbPushBtn');
    if (pb) pb.style.display = show ? 'flex' : 'none';
  }

  function showInlineNotif(msg) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:4.5rem;right:1.5rem;z-index:9999;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;padding:.75rem 1.25rem;border-radius:12px;font-size:.82rem;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.3);';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 3000);
  }

  if ('Notification' in window && Notification.permission === 'default') {
    showPushBtn(true);
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    registerServiceWorker();
  }

  document.getElementById('nbPushBtn')?.addEventListener('click', function(e) {
    e.stopPropagation();
    requestPushPermission();
  });

  // \u2500\u2500 Meal-time browser notifications (tab-based) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function scheduleMealNotifs() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var LAST_KEY = 'keto-meal-notif-date';
    var todayStr = new Date().toISOString().split('T')[0];
    if (localStorage.getItem(LAST_KEY) === todayStr) return;
    var now = new Date();
    var meals = [
      { h: 8,  title: '\u{1F373} Time for Breakfast!',  body: 'Start your keto morning right \u2014 log your breakfast.' },
      { h: 13, title: '\u{1F957} Lunch Time!',           body: "Midday keto boost \u2014 don't forget to log your lunch." },
      { h: 16, title: '\u{1F95C} Afternoon Snack',       body: 'A keto snack keeps cravings away. Log it in the app!' },
      { h: 19, title: '\u{1F37D}\uFE0F Dinner is Ready!',     body: 'Complete your macros with a satisfying keto dinner.' },
    ];
    meals.forEach(function(meal) {
      var mealTime = new Date(); mealTime.setHours(meal.h, 0, 0, 0);
      var ms = mealTime.getTime() - now.getTime();
      if (ms > 0) {
        setTimeout(function() {
          if (Notification.permission === 'granted') {
            new Notification(meal.title, { body: meal.body, icon: '/icon-192.png', tag: 'keto-meal-' + meal.h });
          }
        }, ms);
      }
    });
    localStorage.setItem(LAST_KEY, todayStr);
  }
  scheduleMealNotifs();

})();
<\/script>`])), maybeRenderHead());
}, "C:/Users/abdellatif/Videos/keto-app/src/components/NotificationsBell.astro", void 0);

const $$Astro$9 = createAstro();
const $$Home = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Home;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "house", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path> <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Home.astro", void 0);

const $$Astro$8 = createAstro();
const $$ChevronDown = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$ChevronDown;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "chevron-down", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m6 9 6 6 6-6"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/ChevronDown.astro", void 0);

const $$Astro$7 = createAstro();
const $$Users = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Users;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "users", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path> <path d="M16 3.128a4 4 0 0 1 0 7.744"></path> <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path> <circle cx="9" cy="7" r="4"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Users.astro", void 0);

const $$Astro$6 = createAstro();
const $$Moon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Moon;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "moon", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Moon.astro", void 0);

const $$Astro$5 = createAstro();
const $$Sun = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Sun;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "sun", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="4"></circle> <path d="M12 2v2"></path> <path d="M12 20v2"></path> <path d="m4.93 4.93 1.41 1.41"></path> <path d="m17.66 17.66 1.41 1.41"></path> <path d="M2 12h2"></path> <path d="M20 12h2"></path> <path d="m6.34 17.66-1.41 1.41"></path> <path d="m19.07 4.93-1.41 1.41"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Sun.astro", void 0);

const $$Astro$4 = createAstro();
const $$Activity = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Activity;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "activity", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Activity.astro", void 0);

const $$Astro$3 = createAstro();
const $$ClipboardList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ClipboardList;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "clipboard-list", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect> <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path> <path d="M12 11h4"></path> <path d="M12 16h4"></path> <path d="M8 11h.01"></path> <path d="M8 16h.01"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/ClipboardList.astro", void 0);

const $$Astro$2 = createAstro();
const $$User = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$User;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "user", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path> <circle cx="12" cy="7" r="4"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/User.astro", void 0);

const $$Astro$1 = createAstro();
const $$HelpCircle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HelpCircle;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "circle-question-mark", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path> <path d="M12 17h.01"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/HelpCircle.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$DashNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashNav;
  const { userId, userName, tierLabel, planType, activePage = "" } = Astro2.props;
  const initials = (userName[0] || "U").toUpperCase();
  const tierText = planType === "elite_12" ? "Elite" : planType === "pro_6" ? "Pro" : "Basic";
  const progressPages = ["progress", "photos", "checkin", "reflections", "ketones"];
  const mealPages = ["recipes", "food-log", "favorites", "meal-prep"];
  const planPages = ["shopping", "habits", "weekly", "fasting"];
  const morePages = ["learn", "notifications", "export"];
  const activeGroup = activePage === "dashboard" ? "today" : progressPages.includes(activePage) ? "progress" : mealPages.includes(activePage) ? "meals" : planPages.includes(activePage) ? "plan" : morePages.includes(activePage) ? "more" : activePage === "profile" ? "profile" : activePage === "ai-coach" ? "ai-coach" : activePage === "community" ? "community" : "";
  const groups = [
    {
      key: "progress",
      label: "Progress",
      links: [
        { href: "/dashboard/progress", key: "progress", label: "Progress" },
        { href: "/dashboard/photos", key: "photos", label: "Photos" },
        { href: "/dashboard/checkin", key: "checkin", label: "Check-in" },
        { href: "/dashboard/reflections", key: "reflections", label: "Journal" },
        { href: "/dashboard/ketones", key: "ketones", label: "Ketones" }
      ]
    },
    {
      key: "meals",
      label: "Meals",
      links: [
        { href: "/dashboard/recipes", key: "recipes", label: "Recipes" },
        { href: "/dashboard/food-log", key: "food-log", label: "Food Log" },
        { href: "/dashboard/favorites", key: "favorites", label: "Favorites" },
        { href: "/dashboard/meal-prep", key: "meal-prep", label: "Meal Prep" }
      ]
    },
    {
      key: "plan",
      label: "Plan",
      links: [
        { href: "/dashboard/shopping", key: "shopping", label: "Shopping" },
        { href: "/dashboard/habits", key: "habits", label: "Habits" },
        { href: "/dashboard/weekly", key: "weekly", label: "Weekly" },
        { href: "/dashboard/fasting", key: "fasting", label: "Fasting" }
      ]
    },
    {
      key: "more",
      label: "More",
      links: [
        { href: "/dashboard/learn", key: "learn", label: "Learn" },
        { href: "/dashboard/notifications", key: "notifications", label: "Notifications" },
        { href: "/dashboard/export", key: "export", label: "Export" }
      ]
    }
  ];
  return renderTemplate(_a || (_a = __template(["<!-- \u2550\u2550 ANTI-FLASH: apply stored theme before first paint \u2550\u2550 --><script>\n(function(){\n  var t = localStorage.getItem('keto-theme') || 'light';\n  document.documentElement.setAttribute('data-theme', t);\n})();\n<\/script> <!-- \u2550\u2550 TOP NAV \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->", '<nav class="dash-nav" data-astro-cid-6erhhmze> <!-- Logo --> <a href="/dashboard" class="dn-logo" data-astro-cid-6erhhmze> <div class="dn-logo-mark" data-astro-cid-6erhhmze> <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-6erhhmze> <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" data-astro-cid-6erhhmze></path> <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" data-astro-cid-6erhhmze></path> </svg> </div> <span class="dn-logo-text" data-astro-cid-6erhhmze>Keto<strong data-astro-cid-6erhhmze>Journey</strong></span> </a> <!-- \u2500\u2500 Desktop pill tabs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <ul class="dn-tabs" id="dnLinks" data-astro-cid-6erhhmze> <!-- Today (direct link) --> <li data-astro-cid-6erhhmze> <a href="/dashboard"', " data-astro-cid-6erhhmze> ", "\nToday\n</a> </li> <!-- Dropdown groups --> ", " <!-- AI Coach + Community (Elite only) --> ", " ", " <!-- Upgrade (non-Elite) --> ", ' </ul> <div class="dn-sp" data-astro-cid-6erhhmze></div> <!-- \u2500\u2500 Right controls \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="dn-right" data-astro-cid-6erhhmze> <span class="dn-tier" data-astro-cid-6erhhmze>', '</span> <button class="dn-icon-btn" id="dnThemeBtn" title="Toggle theme" aria-label="Toggle theme" data-astro-cid-6erhhmze> ', " ", " </button> ", ' <a href="/dashboard/learn" class="dn-icon-btn dn-help" title="Learn & Help" aria-label="Help & tutorials" data-astro-cid-6erhhmze> ', ' </a> <a href="/dashboard/profile" class="dn-avatar"', " data-astro-cid-6erhhmze> ", ' </a> </div> </nav> <!-- \u2550\u2550 MOBILE BOTTOM NAV \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 --> <nav class="dn-bottom" aria-label="Mobile navigation" data-astro-cid-6erhhmze> <a href="/dashboard"', " data-astro-cid-6erhhmze> ", '<span data-astro-cid-6erhhmze>Today</span> </a> <a href="/dashboard/progress"', " data-astro-cid-6erhhmze> ", '<span data-astro-cid-6erhhmze>Progress</span> </a> <a href="/dashboard/recipes"', " data-astro-cid-6erhhmze> ", '<span data-astro-cid-6erhhmze>Meals</span> </a> <a href="/dashboard/shopping"', " data-astro-cid-6erhhmze> ", '<span data-astro-cid-6erhhmze>Plan</span> </a> <a href="/dashboard/profile"', " data-astro-cid-6erhhmze> ", "<span data-astro-cid-6erhhmze>Me</span> </a> </nav> <!-- \u2550\u2550 STYLES \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->  <!-- \u2550\u2550 SCRIPT \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 --> <script>\n(function () {\n\n  /* \u2500\u2500 Theme toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n  function applyTheme(t) {\n    document.documentElement.setAttribute('data-theme', t);\n    localStorage.setItem('keto-theme', t);\n  }\n\n  var themeBtn = document.getElementById('dnThemeBtn');\n  if (themeBtn) {\n    // Ensure current theme is applied\n    var stored = localStorage.getItem('keto-theme') || 'light';\n    applyTheme(stored);\n\n    themeBtn.addEventListener('click', function () {\n      var cur = document.documentElement.getAttribute('data-theme') || 'light';\n      applyTheme(cur === 'dark' ? 'light' : 'dark');\n    });\n  }\n\n  /* \u2500\u2500 Dropdown toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n  window.dnToggle = function (groupKey, btn) {\n    var allGroups   = document.querySelectorAll('.dn-group');\n    var clickedGrp  = btn ? btn.closest('.dn-group') : null;\n\n    allGroups.forEach(function (g) {\n      if (g !== clickedGrp) {\n        g.classList.remove('open');\n        var b = g.querySelector('.dn-tab');\n        if (b) b.setAttribute('aria-expanded', 'false');\n      }\n    });\n\n    if (!clickedGrp) return;\n    var isOpen = clickedGrp.classList.contains('open');\n    if (isOpen) {\n      clickedGrp.classList.remove('open');\n      if (btn) btn.setAttribute('aria-expanded', 'false');\n    } else {\n      clickedGrp.classList.add('open');\n      if (btn) btn.setAttribute('aria-expanded', 'true');\n    }\n  };\n\n  /* \u2500\u2500 Close on click outside \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n  document.addEventListener('click', function (e) {\n    var el = e.target, inside = false;\n    while (el) {\n      if (el.classList && el.classList.contains('dn-group')) { inside = true; break; }\n      el = el.parentElement;\n    }\n    if (!inside) {\n      document.querySelectorAll('.dn-group').forEach(function (g) {\n        g.classList.remove('open');\n        var b = g.querySelector('.dn-tab');\n        if (b) b.setAttribute('aria-expanded', 'false');\n      });\n    }\n  });\n\n  /* \u2500\u2500 Close on Escape \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n  document.addEventListener('keydown', function (e) {\n    if (e.key === 'Escape') {\n      document.querySelectorAll('.dn-group').forEach(function (g) {\n        g.classList.remove('open');\n        var b = g.querySelector('.dn-tab');\n        if (b) b.setAttribute('aria-expanded', 'false');\n      });\n    }\n  });\n\n  /* \u2500\u2500 Global fetch interceptor \u2014 auto-refresh expired tokens */\n  (function () {\n    var _fetch = window.fetch.bind(window);\n    var _refreshing = false;\n\n    window.fetch = function (input, init) {\n      var url = typeof input === 'string' ? input\n        : (input instanceof Request ? input.url : '');\n      if (url.indexOf('/api/auth/') !== -1) return _fetch(input, init);\n\n      return _fetch(input, init).then(function (res) {\n        if (res.status !== 401) return res;\n        if (_refreshing) { window.location.href = '/login'; return res; }\n        _refreshing = true;\n        return _fetch('/api/auth/refresh', { method: 'POST' })\n          .then(function (ref) {\n            _refreshing = false;\n            if (!ref.ok) { window.location.href = '/login'; return res; }\n            return _fetch(input, init);\n          })\n          .catch(function () {\n            _refreshing = false;\n            window.location.href = '/login';\n            return res;\n          });\n      });\n    };\n  })();\n\n})();\n<\/script>"])), maybeRenderHead(), addAttribute(`dn-tab${activeGroup === "today" ? " active" : ""}`, "class"), renderComponent($$result, "Home", $$Home, { "size": 13, "data-astro-cid-6erhhmze": true }), groups.map((group) => renderTemplate`<li class="dn-group"${addAttribute(group.key, "data-group")} data-astro-cid-6erhhmze> <button${addAttribute(`dn-tab${activeGroup === group.key ? " active" : ""}`, "class")}${addAttribute(`window.dnToggle('${group.key}', this)`, "onclick")} aria-expanded="false" aria-haspopup="true" data-astro-cid-6erhhmze> ${group.label} ${renderComponent($$result, "ChevronDown", $$ChevronDown, { "size": 12, "class": "dn-caret", "data-astro-cid-6erhhmze": true })} </button> <div class="dn-drop"${addAttribute(`dn-drop-${group.key}`, "id")} role="menu" data-astro-cid-6erhhmze> ${group.links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(`dn-drop-link${activePage === link.key ? " active" : ""}`, "class")} role="menuitem" data-astro-cid-6erhhmze> ${link.label} </a>`)} </div> </li>`), planType === "elite_12" && renderTemplate`<li data-astro-cid-6erhhmze> <a href="/dashboard/ai-coach"${addAttribute(`dn-tab dn-elite${activePage === "ai-coach" ? " active" : ""}`, "class")} data-astro-cid-6erhhmze> ${renderComponent($$result, "Sparkles", $$Sparkles, { "size": 13, "data-astro-cid-6erhhmze": true })}
AI Coach
</a> </li>`, planType === "elite_12" && renderTemplate`<li data-astro-cid-6erhhmze> <a href="/dashboard/community"${addAttribute(`dn-tab dn-elite${activePage === "community" ? " active" : ""}`, "class")} data-astro-cid-6erhhmze> ${renderComponent($$result, "Users", $$Users, { "size": 13, "data-astro-cid-6erhhmze": true })}
Community
</a> </li>`, planType !== "elite_12" && renderTemplate`<li data-astro-cid-6erhhmze> <a href="/dashboard/upgrade"${addAttribute(`dn-tab dn-upgrade${activePage === "upgrade" ? " active" : ""}`, "class")} data-astro-cid-6erhhmze> ${renderComponent($$result, "Zap", $$Zap, { "size": 13, "data-astro-cid-6erhhmze": true })}
Upgrade
</a> </li>`, tierText, renderComponent($$result, "Moon", $$Moon, { "size": 15, "class": "icon-moon", "data-astro-cid-6erhhmze": true }), renderComponent($$result, "Sun", $$Sun, { "size": 15, "class": "icon-sun", "data-astro-cid-6erhhmze": true }), renderComponent($$result, "NotificationsBell", $$NotificationsBell, { "userId": userId, "data-astro-cid-6erhhmze": true }), renderComponent($$result, "HelpCircle", $$HelpCircle, { "size": 15, "data-astro-cid-6erhhmze": true }), addAttribute(userName, "title"), initials, addAttribute(`dn-bn${activeGroup === "today" ? " active" : ""}`, "class"), renderComponent($$result, "Home", $$Home, { "size": 20, "data-astro-cid-6erhhmze": true }), addAttribute(`dn-bn${activeGroup === "progress" ? " active" : ""}`, "class"), renderComponent($$result, "Activity", $$Activity, { "size": 20, "data-astro-cid-6erhhmze": true }), addAttribute(`dn-bn${activeGroup === "meals" ? " active" : ""}`, "class"), renderComponent($$result, "Utensils", $$Utensils, { "size": 20, "data-astro-cid-6erhhmze": true }), addAttribute(`dn-bn${activeGroup === "plan" ? " active" : ""}`, "class"), renderComponent($$result, "ClipboardList", $$ClipboardList, { "size": 20, "data-astro-cid-6erhhmze": true }), addAttribute(`dn-bn${activeGroup === "profile" ? " active" : ""}`, "class"), renderComponent($$result, "User", $$User, { "size": 20, "data-astro-cid-6erhhmze": true }));
}, "C:/Users/abdellatif/Videos/keto-app/src/components/DashNav.astro", void 0);

export { $$Users as $, $$DashNav as a, $$Home as b, $$Activity as c, $$Moon as d, $$User as e, $$HelpCircle as f };
