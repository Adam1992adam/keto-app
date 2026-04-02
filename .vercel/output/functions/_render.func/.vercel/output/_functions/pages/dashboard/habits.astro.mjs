/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, g as addAttribute, r as renderComponent, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Habits = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Habits;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { data: habitsRaw } = await supabase.from("habits").select("*").eq("user_id", user.id).eq("is_active", true).order("sort_order").order("created_at");
  const habits = habitsRaw || [];
  const thirtyAgo = new Date(Date.now() - 29 * 864e5).toISOString().split("T")[0];
  const { data: completionsRaw } = await supabase.from("habit_completions").select("habit_id, completed_date").eq("user_id", user.id).gte("completed_date", thirtyAgo);
  const completions = completionsRaw || [];
  const doneMap = {};
  for (const c of completions) {
    if (!doneMap[c.habit_id]) doneMap[c.habit_id] = /* @__PURE__ */ new Set();
    doneMap[c.habit_id].add(c.completed_date);
  }
  function computeStreak(habitId) {
    const done = doneMap[habitId] || /* @__PURE__ */ new Set();
    const idx = Array.from(
      { length: 365 },
      (_, i) => new Date((/* @__PURE__ */ new Date(today + "T12:00:00Z")).getTime() - i * 864e5).toISOString().split("T")[0]
    ).findIndex((date) => !done.has(date));
    return idx === -1 ? 365 : idx;
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(Date.now() - (6 - i) * 864e5);
    return {
      date: dd.toISOString().split("T")[0],
      label: dd.toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
      isToday: i === 6
    };
  });
  const doneToday = habits.filter((h) => doneMap[h.id]?.has(today)).length;
  const allDoneToday = habits.length > 0 && doneToday === habits.length;
  const catColor = {
    keto: "#10b981",
    nutrition: "#f59e0b",
    fitness: "#3b82f6",
    mindset: "#8b5cf6",
    general: "#6b7280"
  };
  const presets = [
    { icon: "\u{1F9C2}", title: "Take electrolytes", category: "keto", target_streak: 7 },
    { icon: "\u{1F4A7}", title: "Drink 8 glasses of water", category: "nutrition", target_streak: 7 },
    { icon: "\u{1F957}", title: "Stay under 20g carbs", category: "keto", target_streak: 7 },
    { icon: "\u{1F6B6}", title: "30-min walk or exercise", category: "fitness", target_streak: 7 },
    { icon: "\u{1F634}", title: "Sleep 7+ hours", category: "mindset", target_streak: 7 },
    { icon: "\u23F1\uFE0F", title: "Complete 16h fast", category: "keto", target_streak: 7 },
    { icon: "\u{1F9D8}", title: "5-min meditation", category: "mindset", target_streak: 7 },
    { icon: "\u{1F4D6}", title: "Read 10 pages", category: "mindset", target_streak: 7 }
  ];
  const existingTitles = new Set(habits.map((h) => h.title.toLowerCase()));
  const availablePresets = presets.filter((p) => !existingTitles.has(p.title.toLowerCase()));
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-dhgeahof> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Habit Tracker \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-dhgeahof> ", ' <div class="page" data-astro-cid-dhgeahof> <!-- HEADER --> <div class="pg-header" data-astro-cid-dhgeahof> <div class="pg-eyebrow" data-astro-cid-dhgeahof>Daily Routines</div> <h1 class="pg-title" data-astro-cid-dhgeahof>Habit <em data-astro-cid-dhgeahof>Tracker</em></h1> <div class="pg-sub" data-astro-cid-dhgeahof>Build streaks. Stack wins. Keto is a lifestyle.</div> </div> <!-- TODAY BANNER --> ', " <!-- HABITS LIST --> ", " <!-- PRESET SUGGESTIONS --> ", ' </div> <!-- FAB --> <button class="fab" onclick="window.openAdd()" title="New habit" data-astro-cid-dhgeahof>+</button> <!-- ADD MODAL --> <div class="modal-backdrop" id="addModal" data-astro-cid-dhgeahof> <div class="modal" data-astro-cid-dhgeahof> <div class="modal-title" data-astro-cid-dhgeahof>New Habit</div> <label class="fm-label" data-astro-cid-dhgeahof>Pick an icon</label> <div class="icon-grid" id="iconGrid" data-astro-cid-dhgeahof> ', ' </div> <label class="fm-label" data-astro-cid-dhgeahof>Habit title *</label> <input class="fm-input" id="hTitle" placeholder="e.g. Take electrolytes" autocomplete="off" data-astro-cid-dhgeahof> <label class="fm-label" data-astro-cid-dhgeahof>Category</label> <div class="cat-grid" data-astro-cid-dhgeahof> ', ' </div> <div class="fm-actions" data-astro-cid-dhgeahof> <button class="btn-cancel" onclick="window.closeAdd()" data-astro-cid-dhgeahof>Cancel</button> <button class="btn-save" id="hSaveBtn" onclick="window.saveHabit()" data-astro-cid-dhgeahof>Add Habit</button> </div> </div> </div> <div class="toast" id="toast" data-astro-cid-dhgeahof></div> <script>(function(){', "\nvar _done  = initDone;\nvar _total = totalHabits;\n\nfunction showToast(msg) {\n  var t = document.getElementById('toast');\n  t.textContent = msg; t.classList.add('show');\n  setTimeout(function(){ t.classList.remove('show'); }, 2600);\n}\n\nfunction updateBanner() {\n  var pct = _total > 0 ? Math.round((_done / _total) * 100) : 0;\n  var pctEl  = document.getElementById('todayPct');\n  var subEl  = document.getElementById('todaySub');\n  var ringEl = document.getElementById('ringCircle');\n  var lblEl  = document.getElementById('ringLbl');\n  if (pctEl) pctEl.textContent = pct + '%';\n  if (subEl) subEl.textContent = (_done === _total && _total > 0) ? '\u{1F389} All habits done today!' : _done + ' of ' + _total + ' habits done today';\n  if (ringEl) {\n    var circ = 2 * Math.PI * 22;\n    ringEl.setAttribute('stroke-dashoffset', circ * (1 - _done / Math.max(_total, 1)));\n  }\n  if (lblEl) lblEl.textContent = _done + '/' + _total;\n}\n\nwindow.toggleHabit = function(habitId, date) {\n  var card = document.getElementById('hc-' + habitId);\n  var chk  = document.getElementById('chk-' + habitId);\n  var wasDone = chk && chk.classList.contains('checked');\n  // Optimistic UI\n  if (wasDone) {\n    chk.classList.remove('checked');\n    if (card) card.classList.remove('done-today');\n    _done = Math.max(0, _done - 1);\n  } else {\n    chk.classList.add('checked');\n    if (card) card.classList.add('done-today');\n    _done = Math.min(_total, _done + 1);\n  }\n  updateBanner();\n  // Also update the dot for today\n  var dots = card ? card.querySelectorAll('.wg-dot.today') : [];\n  dots.forEach(function(d) {\n    if (wasDone) { d.classList.remove('done'); d.textContent = ''; }\n    else         { d.classList.add('done');    d.textContent = '\u2713'; }\n  });\n  fetch('/api/habits/toggle', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ habit_id: habitId, date: date }),\n  })\n  .then(function(r){ return r.json(); })\n  .then(function(d){\n    if (!d.success) {\n      // Revert\n      if (wasDone) { chk.classList.add('checked'); if(card) card.classList.add('done-today'); _done++; }\n      else         { chk.classList.remove('checked'); if(card) card.classList.remove('done-today'); _done--; }\n      updateBanner();\n      showToast('\u274C ' + (d.error || 'Error'));\n    } else {\n      // Update icon\n      var icon = chk ? chk.getAttribute('data-icon') || '\u2705' : '\u2705';\n      if (!wasDone) { if(chk) chk.textContent = '\u2713'; }\n      else          { /* restore emoji \u2014 need to reload for full accuracy */ }\n    }\n  })\n  .catch(function(){ showToast('\u274C Connection error'); });\n};\n\nwindow.deleteHabit = function(habitId) {\n  if (!confirm('Remove this habit?')) return;\n  fetch('/api/habits/delete', {\n    method: 'DELETE',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ habit_id: habitId }),\n  })\n  .then(function(r){ return r.json(); })\n  .then(function(d){\n    if (d.success) {\n      var card = document.getElementById('hc-' + habitId);\n      if (card) { card.style.opacity='0'; card.style.transform='translateX(20px)'; card.style.transition='all .3s'; setTimeout(function(){ card.remove(); _total--; updateBanner(); }, 300); }\n    } else { showToast('\u274C ' + (d.error || 'Error')); }\n  });\n};\n\n/* \u2500\u2500 ADD MODAL \u2500\u2500 */\nvar _selIcon = '\u2705';\nvar _selCat  = 'keto';\n\n// Init selection states\n(function(){\n  var firstIcon = document.querySelector('.icon-opt');\n  if (firstIcon) { firstIcon.classList.add('sel'); _selIcon = firstIcon.getAttribute('data-icon') || '\u2705'; }\n  var firstCat = document.querySelector('.cat-opt');\n  if (firstCat) { firstCat.classList.add('sel'); _selCat = firstCat.getAttribute('data-cat') || 'keto'; }\n})();\n\nwindow.openAdd = function() {\n  document.getElementById('addModal').classList.add('open');\n  setTimeout(function(){ document.getElementById('hTitle').focus(); }, 50);\n};\nwindow.closeAdd = function() {\n  document.getElementById('addModal').classList.remove('open');\n  document.getElementById('hTitle').value = '';\n};\nwindow.pickIcon = function(el) {\n  document.querySelectorAll('.icon-opt').forEach(function(e){ e.classList.remove('sel'); });\n  el.classList.add('sel');\n  _selIcon = el.getAttribute('data-icon') || '\u2705';\n};\nwindow.pickCat = function(el) {\n  document.querySelectorAll('.cat-opt').forEach(function(e){ e.classList.remove('sel'); });\n  el.classList.add('sel');\n  _selCat = el.getAttribute('data-cat') || 'general';\n};\n\nwindow.saveHabit = function() {\n  var title = document.getElementById('hTitle').value.trim();\n  if (!title) { document.getElementById('hTitle').focus(); return; }\n  var btn = document.getElementById('hSaveBtn');\n  btn.disabled = true; btn.textContent = 'Adding\u2026';\n  fetch('/api/habits', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title: title, icon: _selIcon, category: _selCat, target_streak: 7 }),\n  })\n  .then(function(r){ return r.json(); })\n  .then(function(d){\n    if (d.success) { showToast('\u2705 Habit added!'); setTimeout(function(){ window.location.reload(); }, 500); }\n    else { btn.disabled = false; btn.textContent = 'Add Habit'; showToast('\u274C ' + (d.error || 'Error')); }\n  })\n  .catch(function(){ btn.disabled = false; btn.textContent = 'Add Habit'; showToast('\u274C Error'); });\n};\n\nwindow.addPreset = function(jsonStr) {\n  var p = JSON.parse(jsonStr);\n  fetch('/api/habits', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title: p.title, icon: p.icon, category: p.category, target_streak: p.target_streak }),\n  })\n  .then(function(r){ return r.json(); })\n  .then(function(d){\n    if (d.success) { showToast('\u2705 ' + p.title + ' added!'); setTimeout(function(){ window.location.reload(); }, 500); }\n    else showToast('\u274C ' + (d.error || 'Error'));\n  });\n};\n\n// Close modal on backdrop click\ndocument.getElementById('addModal').addEventListener('click', function(e){\n  if (e.target === this) window.closeAdd();\n});\n})();<\/script> </body> </html>"])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "habits", "data-astro-cid-dhgeahof": true }), habits.length > 0 && renderTemplate`<div class="today-banner" data-astro-cid-dhgeahof> <div class="tb-left" data-astro-cid-dhgeahof> <div class="tb-pct" id="todayPct" data-astro-cid-dhgeahof>${habits.length > 0 ? Math.round(doneToday / habits.length * 100) : 0}%</div> <div class="tb-sub" id="todaySub" data-astro-cid-dhgeahof>${allDoneToday ? "All habits done today!" : `${doneToday} of ${habits.length} habits done today`}</div> </div> <div class="tb-ring" data-astro-cid-dhgeahof> <svg width="56" height="56" viewBox="0 0 56 56" data-astro-cid-dhgeahof> <circle cx="28" cy="28" r="22" fill="none" stroke="var(--muted)" stroke-width="5" data-astro-cid-dhgeahof></circle> <circle cx="28" cy="28" r="22" fill="none" stroke="var(--green)" stroke-width="5"${addAttribute(`${2 * Math.PI * 22}`, "stroke-dasharray")}${addAttribute(`${2 * Math.PI * 22 * (1 - doneToday / Math.max(habits.length, 1))}`, "stroke-dashoffset")} stroke-linecap="round" id="ringCircle" data-astro-cid-dhgeahof></circle> </svg> <div class="tb-ring-lbl" id="ringLbl" data-astro-cid-dhgeahof>${doneToday}/${habits.length}</div> </div> </div>`, habits.length > 0 ? renderTemplate`<div class="habits-list" id="habitsList" data-astro-cid-dhgeahof> ${habits.map((h, idx) => {
    const streak = computeStreak(h.id);
    const isDoneToday = !!doneMap[h.id]?.has(today);
    const cc = catColor[h.category] || "#6b7280";
    return renderTemplate`<div${addAttribute(`habit-card${isDoneToday ? " done-today" : ""}`, "class")}${addAttribute(`hc-${h.id}`, "id")}${addAttribute(`animation-delay:${idx * 0.04}s;`, "style")} data-astro-cid-dhgeahof> <div class="hc-top" data-astro-cid-dhgeahof> <button${addAttribute(`hc-check${isDoneToday ? " checked" : ""}`, "class")}${addAttribute(`chk-${h.id}`, "id")}${addAttribute(`window.toggleHabit('${h.id}','${today}')`, "onclick")} data-astro-cid-dhgeahof> ${isDoneToday ? "\u2713" : h.icon} </button> <div class="hc-info" data-astro-cid-dhgeahof> <div class="hc-title" data-astro-cid-dhgeahof>${h.title}</div> <div class="hc-meta" data-astro-cid-dhgeahof> <span class="hc-cat"${addAttribute(`background:${cc}18;color:${cc};border:1px solid ${cc}33;`, "style")} data-astro-cid-dhgeahof>${h.category}</span> ${streak > 0 && renderTemplate`<span class="hc-streak" data-astro-cid-dhgeahof>${renderComponent($$result, "Flame", $$Flame, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-dhgeahof": true })} ${streak}d streak</span>`} </div> </div> <button class="hc-del"${addAttribute(`window.deleteHabit('${h.id}')`, "onclick")} title="Remove habit" data-astro-cid-dhgeahof>🗑</button> </div> <!-- 7-day grid --> <div class="week-grid" data-astro-cid-dhgeahof> ${last7.map((day) => {
      const done = !!doneMap[h.id]?.has(day.date);
      return renderTemplate`<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;" data-astro-cid-dhgeahof> <div${addAttribute(`wg-dot${done ? " done" : ""}${day.isToday ? " today" : ""}`, "class")} data-astro-cid-dhgeahof> ${done ? "\u2713" : ""} </div> <div class="wg-day"${addAttribute(day.isToday ? "color:var(--green);font-weight:800;" : "", "style")} data-astro-cid-dhgeahof>${day.label}</div> </div>`;
    })} </div> </div>`;
  })} </div>` : renderTemplate`<div class="empty" data-astro-cid-dhgeahof> <div class="empty-icon" data-astro-cid-dhgeahof>${renderComponent($$result, "Target", $$Target, { "size": 48, "color": "var(--soft)", "data-astro-cid-dhgeahof": true })}</div> <div class="empty-txt" data-astro-cid-dhgeahof>No habits yet — add your first habit below or pick a preset.</div> </div>`, availablePresets.length > 0 && renderTemplate`<div data-astro-cid-dhgeahof> <div class="section-title" data-astro-cid-dhgeahof>Quick-add presets</div> <div class="presets-grid" data-astro-cid-dhgeahof> ${availablePresets.slice(0, 8).map((p) => renderTemplate`<button class="preset-btn"${addAttribute(`window.addPreset(${JSON.stringify(JSON.stringify(p))})`, "onclick")} data-astro-cid-dhgeahof> <div class="preset-icon" data-astro-cid-dhgeahof>${p.icon}</div> <div class="preset-label" data-astro-cid-dhgeahof>${p.title}</div> </button>`)} </div> </div>`, ["\u2705", "\u{1F3AF}", "\u{1F4AA}", "\u{1F9C2}", "\u{1F4A7}", "\u{1F957}", "\u{1F6B6}", "\u{1F634}", "\u23F1\uFE0F", "\u{1F9D8}", "\u{1F4D6}", "\u{1F3CB}\uFE0F", "\u{1F951}", "\u{1FA78}", "\u{1F33F}", "\u26A1"].map((ic) => renderTemplate`<div class="icon-opt"${addAttribute(ic, "data-icon")} onclick="window.pickIcon(this)" data-astro-cid-dhgeahof>${ic}</div>`), ["keto", "nutrition", "fitness", "mindset", "general"].map((c) => renderTemplate`<div class="cat-opt"${addAttribute(c, "data-cat")} onclick="window.pickCat(this)" data-astro-cid-dhgeahof>${c}</div>`), defineScriptVars({ todayStr: today, initDone: doneToday, totalHabits: habits.length }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/habits.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/habits.astro";
const $$url = "/dashboard/habits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Habits,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
