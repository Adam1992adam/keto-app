/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, r as renderComponent, g as addAttribute, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { b as $$Home, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$Timer } from '../../chunks/Timer_ceHoeydv.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
import { a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Clock } from '../../chunks/Clock_jKl9HRKB.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$Award } from '../../chunks/Award_DmLGcvZ_.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$AlertTriangle } from '../../chunks/AlertTriangle_CZmKUJtJ.mjs';
import { $ as $$Brain } from '../../chunks/Brain_CVL5l-1N.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Fasting = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Fasting;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const journey = await getUserJourney(user.id);
  journey?.current_day || 1;
  const { data: onboarding } = await supabase.from("onboarding_data").select("fasting_protocol, goal").eq("user_id", user.id).single();
  const { data: activeSession } = await supabase.from("fasting_sessions").select("*").eq("user_id", user.id).is("ended_at", null).order("started_at", { ascending: false }).limit(1).maybeSingle();
  const { data: pastSessions } = await supabase.from("fasting_sessions").select("*").eq("user_id", user.id).not("ended_at", "is", null).order("started_at", { ascending: false }).limit(5);
  const totalFasts = pastSessions?.length || 0;
  const completedFasts = pastSessions?.filter((s) => s.completed).length || 0;
  const avgFastHours = pastSessions && pastSessions.length > 0 ? (pastSessions.reduce((s, f) => s + (f.actual_hours || 0), 0) / pastSessions.length).toFixed(1) : "0";
  const totalFastHours = pastSessions?.reduce((s, f) => s + (f.actual_hours || 0), 0) || 0;
  const userName = profile.full_name?.split(" ")[0] || "there";
  const defaultProtocol = onboarding?.fasting_protocol || "16_8";
  const activeSessionData = activeSession ? {
    id: activeSession.id,
    started_at: activeSession.started_at,
    protocol: activeSession.protocol,
    target_hours: activeSession.target_hours
  } : null;
  const historyRows = (pastSessions || []).map((s) => {
    const started = new Date(s.started_at);
    const dateStr = started.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
    const timeStr = started.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    const hrs = s.actual_hours || 0;
    const target = s.target_hours || 16;
    const pct = Math.min(Math.round(hrs / target * 100), 100);
    const protoName = s.protocol ? s.protocol.replace("_", ":") : "\u2014";
    const done = s.completed;
    const barColor = pct >= 100 ? "var(--green)" : pct >= 60 ? "var(--gold)" : "var(--red)";
    const checkClass = done ? "done" : "partial";
    const checkIcon = done ? "\u2713" : "~";
    return { dateStr, timeStr, hrs, target, pct, protoName, done, barColor, checkClass, checkIcon };
  });
  const hasHistory = historyRows.length > 0;
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-nrceh35d> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Fasting Timer \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ var t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();
  <\/script>`, '</head> <body data-astro-cid-nrceh35d> <div class="bg-wrap" data-astro-cid-nrceh35d><div class="orb o1" data-astro-cid-nrceh35d></div><div class="orb o2" data-astro-cid-nrceh35d></div><div class="orb o3" data-astro-cid-nrceh35d></div></div> <!-- NAV --> ', ' <div class="page" data-astro-cid-nrceh35d> <!-- \u2500\u2500 TIMER HERO \u2500\u2500 --> <div class="timer-hero" id="timerHero" data-astro-cid-nrceh35d> <!-- Active badge --> <div class="active-badge" data-astro-cid-nrceh35d> <span class="active-dot" data-astro-cid-nrceh35d></span> <span data-astro-cid-nrceh35d>Fast Active</span> </div> <!-- Stage Pill --> <div class="stage-pill" id="stagePill" style="color:var(--soft);background:rgba(77,112,85,.08);" data-astro-cid-nrceh35d> <span class="stage-dot" data-astro-cid-nrceh35d></span> <span id="stagePillText" data-astro-cid-nrceh35d>Ready to fast</span> </div> <!-- Ring Timer \u2014 240\xD7240 SVG --> <div class="ring-wrap" id="ringWrap" data-astro-cid-nrceh35d> <svg class="ring-svg" viewBox="0 0 240 240" aria-hidden="true" data-astro-cid-nrceh35d> <!-- Outer pulse ring (r=113 \u2014 slightly outside track) --> <circle class="ring-outer-pulse" cx="120" cy="120" r="113" data-astro-cid-nrceh35d></circle> <!-- Track --> <circle class="ring-track" cx="120" cy="120" r="105" data-astro-cid-nrceh35d></circle> <!-- Glow layer --> <circle class="ring-glow" id="ringGlow" cx="120" cy="120" r="105" stroke="var(--soft)" data-astro-cid-nrceh35d></circle> <!-- Progress arc --> <circle class="ring-progress" id="ringProgress" cx="120" cy="120" r="105" stroke="var(--green)" data-astro-cid-nrceh35d></circle> </svg> <div class="ring-center" data-astro-cid-nrceh35d> <div class="timer-display" id="timerDisplay" style="color:var(--soft);" data-astro-cid-nrceh35d>00:00:00</div> <div class="timer-of" id="timerOf" data-astro-cid-nrceh35d>Start your fast</div> <div class="timer-pct" id="timerPct" data-astro-cid-nrceh35d></div> </div> </div> <!-- Stage status text --> <p class="stage-status" id="stageStatus" data-astro-cid-nrceh35d>\nChoose your fasting protocol below, then tap <strong data-astro-cid-nrceh35d>Start Fast</strong> to begin.\n</p> <!-- 4-Stage Fat-Burning Strip (shown when active) --> <div class="burn-strip" id="burnStrip" data-astro-cid-nrceh35d> <div class="burn-stage" id="bs0" data-min="0" data-max="4" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Glycogen<br data-astro-cid-nrceh35d>Depleting</span> </div> <div class="burn-stage" id="bs1" data-min="4" data-max="8" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Fat Burning<br data-astro-cid-nrceh35d>Begins</span> </div> <div class="burn-stage" id="bs2" data-min="8" data-max="16" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Deep<br data-astro-cid-nrceh35d>Fat Burn</span> </div> <div class="burn-stage" id="bs3" data-min="16" data-max="999" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Autophagy<br data-astro-cid-nrceh35d>Zone</span> </div> </div> <!-- Start Time Picker (hidden when active) --> <div class="start-picker" id="startPicker" data-astro-cid-nrceh35d> <span class="sp-label" data-astro-cid-nrceh35d>Fast started:</span> <div class="sp-btns" data-astro-cid-nrceh35d> <button class="sp-btn active" data-offset="0" onclick="setStartOffset(this,0)" data-astro-cid-nrceh35d>Now</button> <button class="sp-btn" data-offset="1" onclick="setStartOffset(this,1)" data-astro-cid-nrceh35d>1h ago</button> <button class="sp-btn" data-offset="2" onclick="setStartOffset(this,2)" data-astro-cid-nrceh35d>2h ago</button> <button class="sp-btn" data-offset="4" onclick="setStartOffset(this,4)" data-astro-cid-nrceh35d>4h ago</button> <button class="sp-btn" data-offset="8" onclick="setStartOffset(this,8)" data-astro-cid-nrceh35d>8h ago</button> </div> <input type="time" class="sp-time-input" id="customStartTime" title="Custom start time" data-astro-cid-nrceh35d> </div> <!-- Actions --> <div class="timer-actions" data-astro-cid-nrceh35d> <button class="btn-start" id="startBtn" onclick="startFast()" data-astro-cid-nrceh35d> ', ' Start Fast\n</button> <button class="btn-end" id="endBtn" style="display:none;" onclick="endFast()" data-astro-cid-nrceh35d> ', ' End Fast\n</button> <button class="btn-ghost" id="resetBtn" style="display:none;" onclick="resetFast()" data-astro-cid-nrceh35d>\n\u21BA Reset\n</button> </div> </div> <!-- \u2500\u2500 PROTOCOL CARDS (2\xD72 grid, shown when not fasting) \u2500\u2500 --> <div class="protocol-section" id="protocolSection" data-astro-cid-nrceh35d> <div class="sec-label" data-astro-cid-nrceh35d>Choose Your Protocol</div> <div class="protocol-grid" data-astro-cid-nrceh35d> ', ' </div> <div class="proto-start-wrap" data-astro-cid-nrceh35d> <button class="btn-start" onclick="startFast()" style="margin:0 auto;" data-astro-cid-nrceh35d> ', ' Start Fast\n</button> </div> </div> <!-- \u2500\u2500 FASTING STAGES SCIENCE \u2500\u2500 --> <div class="stages-section" data-astro-cid-nrceh35d> <div class="stages-head" data-astro-cid-nrceh35d> <div class="sh-icon2" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.3);" data-astro-cid-nrceh35d>', '</div> <div class="sh-title2" data-astro-cid-nrceh35d>What Happens to Your Body</div> </div> ', ' </div> <!-- \u2500\u2500 STATS \u2500\u2500 --> <div class="stats-row" data-astro-cid-nrceh35d> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--gold);" data-astro-cid-nrceh35d>', '</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Total Fasts</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--green);" data-astro-cid-nrceh35d>', '</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Completed</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--blue);" data-astro-cid-nrceh35d>', 'h</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Avg Duration</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--purple);" data-astro-cid-nrceh35d>', 'h</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Total Hours</div> </div> </div> <!-- \u2500\u2500 HISTORY TIMELINE \u2500\u2500 --> ', ' <!-- \u2500\u2500 SCIENCE PANELS \u2500\u2500 --> <div class="science-grid" data-astro-cid-nrceh35d> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>Fasting + Keto = Supercharged</div> <div class="sci-text" data-astro-cid-nrceh35d>Combining intermittent fasting with a keto diet creates a <strong data-astro-cid-nrceh35d>dual metabolic advantage</strong>. Keto primes your body to burn fat, while fasting depletes glycogen stores faster \u2014 meaning you reach deep ketosis in hours, not days.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>Why 16+ Hours Matters</div> <div class="sci-text" data-astro-cid-nrceh35d>The most significant metabolic benefits \u2014 <strong data-astro-cid-nrceh35d>autophagy, growth hormone release, and deep fat oxidation</strong> \u2014 only kick in after 16 hours. The first 12 hours are just clearing the runway. Push past 16h for the real magic.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>What to Consume While Fasting</div> <div class="sci-text" data-astro-cid-nrceh35d><strong data-astro-cid-nrceh35d>Water, black coffee, plain tea, and electrolytes</strong> are fasting-safe. Salt + potassium + magnesium prevent the energy crashes that make people break their fast early. Avoid anything with calories or sweeteners.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>When to Break Your Fast</div> <div class="sci-text" data-astro-cid-nrceh35d><strong data-astro-cid-nrceh35d>Extreme dizziness, heart palpitations, or fainting</strong> are signals to eat. If you feel this, break your fast with something small \u2014 a few nuts or an egg. These symptoms usually mean electrolyte imbalance, not weakness.</div> </div> </div> </div><!-- /page --> <!-- COMPLETE OVERLAY --> <div class="complete-overlay" id="completeOverlay" data-astro-cid-nrceh35d> <div class="co-ring" data-astro-cid-nrceh35d> <svg width="160" height="160" viewBox="0 0 160 160" data-astro-cid-nrceh35d> <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(16,185,129,.2)" stroke-width="10" data-astro-cid-nrceh35d></circle> <circle cx="80" cy="80" r="68" fill="none" stroke="url(#cg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="427" stroke-dashoffset="0" data-astro-cid-nrceh35d></circle> <defs data-astro-cid-nrceh35d><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%" data-astro-cid-nrceh35d><stop offset="0%" stop-color="#10b981" data-astro-cid-nrceh35d></stop><stop offset="100%" stop-color="#34d399" data-astro-cid-nrceh35d></stop></linearGradient></defs> </svg> <div class="co-ring-label" data-astro-cid-nrceh35d>', '</div> </div> <h2 class="co-title" data-astro-cid-nrceh35d>Fast <em data-astro-cid-nrceh35d>complete</em>!</h2> <p style="color:var(--soft);font-size:.9rem;max-width:380px;line-height:1.6;margin-bottom:1rem;" id="coMessage" data-astro-cid-nrceh35d>You crushed it. Your body just unlocked deep fat-burning mode.</p> <div class="co-stats" data-astro-cid-nrceh35d> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coHours" data-astro-cid-nrceh35d>\u2014</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>Hours Fasted</div></div> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coStage" data-astro-cid-nrceh35d>\u2014</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>Stage Reached</div></div> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coXP" data-astro-cid-nrceh35d>+50</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>XP Earned</div></div> </div> <div class="co-btns" data-astro-cid-nrceh35d> <a href="/dashboard" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 1.75rem;border-radius:13px;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;font-weight:900;font-size:.9rem;text-decoration:none;box-shadow:0 4px 16px rgba(16,185,129,.4);" data-astro-cid-nrceh35d> ', ` Back to Dashboard
</a> <button onclick="newFast()" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 1.75rem;border-radius:13px;background:var(--card);border:1.5px solid var(--border);color:var(--soft);font-weight:800;font-size:.875rem;cursor:pointer;transition:all .2s;" onmouseover="this.style.borderColor='var(--green)'" onmouseout="this.style.borderColor='var(--border)'" data-astro-cid-nrceh35d> `, ' Fast Again\n</button> </div> </div> <div class="toast" id="toast" data-astro-cid-nrceh35d></div> <!-- \u2500\u2500 SCRIPT \u2500\u2500 --> <script>(function(){', `

/* \u2500\u2500 FASTING STAGES CONFIG \u2500\u2500 */
var STAGES = [
  { key:'fed',      h:0,  color:'#6b7280', name:'Fed State',          emoji:'\u{1F37D}\uFE0F' },
  { key:'insulin',  h:4,  color:'#10b981', name:'Insulin Drops',      emoji:'\u{1F4C9}' },
  { key:'glycogen', h:8,  color:'#3b82f6', name:'Glycogen Depletion', emoji:'\u26A1' },
  { key:'burning',  h:12, color:'#f59e0b', name:'Fat Burning',        emoji:'\u{1F525}' },
  { key:'ketosis',  h:16, color:'#f97316', name:'Deep Ketosis',       emoji:'\u{1F506}' },
  { key:'autophagy',h:18, color:'#ef4444', name:'Autophagy',          emoji:'\u{1F9F9}' },
  { key:'deep',     h:24, color:'#8b5cf6', name:'Deep Autophagy',     emoji:'\u{1F30C}' },
];

/* 4-stage burn strip config (maps to ids bs0\u2013bs3) */
var BURN_STAGES = [
  { id:'bs0', min:0,  max:4   },
  { id:'bs1', min:4,  max:8   },
  { id:'bs2', min:8,  max:16  },
  { id:'bs3', min:16, max:999 },
];

var RING_CIRC = 2 * Math.PI * 105; /* 659.73 */

/* \u2500\u2500 STATE \u2500\u2500 */
var state = {
  active:      false,
  startTime:   null,
  targetHours: 16,
  protocol:    defaultProtocol || '16_8',
  startOffset: 0,
  sessionId:   null,
};
window.fastTimer = null;

/* \u2500\u2500 RESTORE ACTIVE SESSION \u2500\u2500 */
if (activeSessionData) {
  state.active      = true;
  state.startTime   = new Date(activeSessionData.started_at);
  state.targetHours = activeSessionData.target_hours || 16;
  state.protocol    = activeSessionData.protocol || '16_8';
  state.sessionId   = activeSessionData.id;
  selectProtocol(document.querySelector('[data-protocol="' + state.protocol + '"]'), false);
  showRunningUI();
  startTicking();
}

/* \u2500\u2500 PROTOCOL SELECT \u2500\u2500 */
function selectProtocol(el, updateState) {
  if (!el) return;
  if (typeof updateState === 'undefined') updateState = true;
  document.querySelectorAll('.proto-card').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  if (updateState) {
    state.protocol    = el.dataset.protocol;
    state.targetHours = parseInt(el.dataset.hours) || 16;
    /* Update "of X hours" label if timer is idle */
    var ofEl = document.getElementById('timerOf');
    if (ofEl && !state.active) {
      ofEl.textContent = 'of ' + state.targetHours + ' hours';
    }
  }
}
window.selectProtocol = selectProtocol;

/* \u2500\u2500 START OFFSET \u2500\u2500 */
function setStartOffset(el, hours) {
  document.querySelectorAll('.sp-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  state.startOffset = hours;
  var d = new Date();
  d.setHours(d.getHours() - hours);
  document.getElementById('customStartTime').value =
    d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
window.setStartOffset = setStartOffset;

/* Custom time input */
document.getElementById('customStartTime').addEventListener('change', function() {
  var parts = this.value.split(':').map(Number);
  var h = parts[0];
  var m = parts[1];
  var now = new Date();
  var start = new Date();
  start.setHours(h, m, 0, 0);
  if (start > now) start.setDate(start.getDate() - 1);
  state.startOffset = (now - start) / 3600000;
  document.querySelectorAll('.sp-btn').forEach(function(b){ b.classList.remove('active'); });
});

/* Init custom time to now */
var initNow = new Date();
document.getElementById('customStartTime').value =
  initNow.getHours().toString().padStart(2,'0') + ':' + initNow.getMinutes().toString().padStart(2,'0');

/* \u2500\u2500 START FAST \u2500\u2500 */
function startFast() {
  var offsetMs = state.startOffset * 3600000;
  state.startTime = new Date(Date.now() - offsetMs);
  state.active    = true;

  fetch('/api/fasting/start', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      protocol:     state.protocol,
      target_hours: state.targetHours,
      started_at:   state.startTime.toISOString(),
    }),
  }).then(function(res){ return res.json(); }).then(function(data){
    if (data.id) state.sessionId = data.id;
  }).catch(function(e){ console.warn('Session save failed', e); });

  showRunningUI();
  startTicking();
  showToast('\u23F1\uFE0F Fast started! Stay strong, ' + userName + '.', 's');
}
window.startFast = startFast;

/* \u2500\u2500 END FAST \u2500\u2500 */
function endFast() {
  if (!state.active) return;
  clearInterval(window.fastTimer);
  window.fastTimer = null;

  var elapsed = getElapsedHours();
  var completed = elapsed >= state.targetHours;

  fetch('/api/fasting/end', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      session_id:   state.sessionId,
      ended_at:     new Date().toISOString(),
      actual_hours: elapsed,
      completed:    completed,
    }),
  }).catch(function(e){ console.warn('End session failed', e); });

  var stage = getCurrentStage(elapsed);
  document.getElementById('coHours').textContent = elapsed.toFixed(1) + 'h';
  document.getElementById('coStage').textContent = stage.emoji + ' ' + stage.name;
  var xp = completed ? 50 + Math.round(elapsed * 2) : 20;
  document.getElementById('coXP').textContent = '+' + xp;
  document.getElementById('coMessage').textContent = completed
    ? 'You hit your ' + state.targetHours + 'h goal! Your body just reached ' + stage.name + '. Incredible.'
    : elapsed.toFixed(1) + 'h is still a win. Every fast builds your metabolic flexibility.';
  document.getElementById('completeOverlay').classList.add('show');

  resetState();
}
window.endFast = endFast;

/* \u2500\u2500 RESET \u2500\u2500 */
function resetFast() {
  if (state.active && !confirm('Reset your current fast?')) return;
  clearInterval(window.fastTimer);
  window.fastTimer = null;
  resetState();
  showIdleUI();
  showToast('\u21BA Timer reset.', 's');
}
window.resetFast = resetFast;

function newFast() {
  document.getElementById('completeOverlay').classList.remove('show');
  resetState();
  showIdleUI();
}
window.newFast = newFast;

function resetState() {
  state.active      = false;
  state.startTime   = null;
  state.sessionId   = null;
  state.startOffset = 0;
}

/* \u2500\u2500 TICK \u2500\u2500 */
function startTicking() {
  clearInterval(window.fastTimer);
  tick();
  window.fastTimer = setInterval(tick, 1000);
}

function getElapsedHours() {
  if (!state.startTime) return 0;
  return (Date.now() - state.startTime.getTime()) / 3600000;
}

function getCurrentStage(hours) {
  var current = STAGES[0];
  for (var i = 0; i < STAGES.length; i++) {
    if (hours >= STAGES[i].h) current = STAGES[i];
    else break;
  }
  return current;
}

function tick() {
  if (!state.startTime) return;

  var elapsed   = getElapsedHours();
  var target    = state.targetHours;
  var pct       = Math.min(elapsed / target, 1);
  var stage     = getCurrentStage(elapsed);

  /* Timer display */
  var dispH = Math.floor(elapsed);
  var dispM = Math.floor((elapsed % 1) * 60);
  var dispS = Math.floor(((elapsed * 60) % 1) * 60);
  document.getElementById('timerDisplay').textContent =
    dispH.toString().padStart(2,'0') + ':' +
    dispM.toString().padStart(2,'0') + ':' +
    dispS.toString().padStart(2,'0');
  document.getElementById('timerDisplay').style.color = stage.color;

  /* "of X hours" / "Goal reached" */
  var ofEl = document.getElementById('timerOf');
  ofEl.textContent = elapsed >= target ? 'Goal reached! \u{1F389}' : 'of ' + target + ' hours';

  document.getElementById('timerPct').textContent = Math.round(pct * 100) + '% complete';

  /* Ring */
  var offset = RING_CIRC * (1 - pct);
  document.getElementById('ringProgress').style.strokeDashoffset = offset;
  document.getElementById('ringProgress').style.stroke = stage.color;
  document.getElementById('ringGlow').style.strokeDashoffset = offset;
  document.getElementById('ringGlow').style.stroke = stage.color;

  /* Stage pill */
  document.getElementById('stagePill').style.color = stage.color;
  document.getElementById('stagePill').style.background = stage.color + '18';
  document.getElementById('stagePillText').textContent = stage.emoji + ' ' + stage.name;

  /* Stage status text */
  var nextStage = null;
  for (var i = 0; i < STAGES.length; i++) {
    if (STAGES[i].h > elapsed) { nextStage = STAGES[i]; break; }
  }
  if (nextStage) {
    var hoursLeft = nextStage.h - elapsed;
    var minsLeft  = Math.round(hoursLeft * 60);
    var untilMsg = minsLeft > 60
      ? '<strong>' + Math.floor(hoursLeft) + 'h ' + (minsLeft % 60) + 'm</strong> until <strong>' + nextStage.emoji + ' ' + nextStage.name + '</strong>.'
      : 'Only <strong>' + minsLeft + ' minutes</strong> until <strong>' + nextStage.emoji + ' ' + nextStage.name + '</strong>!';
    document.getElementById('stageStatus').innerHTML =
      'You\\'re in <strong style="color:' + stage.color + '">' + stage.name + '</strong>. ' + untilMsg;
  } else {
    document.getElementById('stageStatus').innerHTML =
      '\u{1F30C} <strong>You\\'ve reached the pinnacle</strong> \u2014 Deep Autophagy. Maximum cellular repair is happening right now. Extraordinary.';
  }

  /* Update science stage list */
  for (var j = 0; j < STAGES.length; j++) {
    var s     = STAGES[j];
    var item  = document.getElementById('stage-' + s.key);
    var icon  = document.getElementById('sicon-' + s.key);
    var badge = document.getElementById('sbadge-' + s.key);
    if (!item) continue;
    item.classList.remove('current', 'past');
    if (s.key === stage.key) {
      item.classList.add('current');
      icon.style.borderColor = s.color;
      icon.style.boxShadow   = '0 0 0 4px ' + s.color + '22, 0 4px 14px ' + s.color + '44';
      badge.style.display    = 'inline-flex';
    } else if (elapsed >= s.h) {
      item.classList.add('past');
      icon.style.borderColor = s.color + '80';
      badge.style.display    = 'none';
    } else {
      icon.style.borderColor = 'transparent';
      icon.style.boxShadow   = 'none';
      badge.style.display    = 'none';
    }
  }

  /* 4-stage burn strip */
  for (var k = 0; k < BURN_STAGES.length; k++) {
    var bs   = BURN_STAGES[k];
    var bsEl = document.getElementById(bs.id);
    if (!bsEl) continue;
    bsEl.classList.remove('bs-active', 'bs-done');
    if (elapsed >= bs.min && elapsed < bs.max) {
      bsEl.classList.add('bs-active');
    } else if (elapsed >= bs.max) {
      bsEl.classList.add('bs-done');
    }
  }

  /* Auto-complete toast */
  if (pct >= 1 && !document.getElementById('completeOverlay').classList.contains('show')) {
    showToast('\u{1F3C6} You hit your fasting goal!', 'g');
  }
}

/* \u2500\u2500 UI STATES \u2500\u2500 */
function showRunningUI() {
  document.getElementById('timerHero').classList.add('is-active');
  document.getElementById('startBtn').style.display    = 'none';
  document.getElementById('endBtn').style.display      = 'flex';
  document.getElementById('resetBtn').style.display    = 'flex';
  document.getElementById('startPicker').style.display = 'none';
  document.getElementById('protocolSection').style.opacity = '.45';
  document.getElementById('protocolSection').style.pointerEvents = 'none';
  /* Show burn strip, hide second start btn in protocol section */
  document.getElementById('burnStrip').style.display = 'flex';
}

function showIdleUI() {
  document.getElementById('timerHero').classList.remove('is-active');
  document.getElementById('startBtn').style.display    = 'flex';
  document.getElementById('endBtn').style.display      = 'none';
  document.getElementById('resetBtn').style.display    = 'none';
  document.getElementById('startPicker').style.display = 'flex';
  document.getElementById('burnStrip').style.display   = 'none';

  document.getElementById('timerDisplay').textContent  = '00:00:00';
  document.getElementById('timerDisplay').style.color  = 'var(--soft)';
  document.getElementById('timerOf').textContent       = 'of ' + state.targetHours + ' hours';
  document.getElementById('timerPct').textContent      = '';
  document.getElementById('stagePillText').textContent = 'Ready to fast';
  document.getElementById('stagePill').style.color     = 'var(--soft)';
  document.getElementById('stagePill').style.background= 'rgba(77,112,85,.08)';
  document.getElementById('stageStatus').innerHTML     = 'Choose your protocol below, then tap <strong>Start Fast</strong> to begin.';
  document.getElementById('ringProgress').style.strokeDashoffset = RING_CIRC;
  document.getElementById('ringGlow').style.strokeDashoffset     = RING_CIRC;
  document.getElementById('ringProgress').style.stroke = 'var(--green)';
  document.getElementById('ringGlow').style.stroke     = 'var(--green)';
  document.getElementById('protocolSection').style.opacity = '1';
  document.getElementById('protocolSection').style.pointerEvents = 'auto';

  /* Reset science stages */
  for (var i = 0; i < STAGES.length; i++) {
    var s    = STAGES[i];
    var item = document.getElementById('stage-' + s.key);
    var icon = document.getElementById('sicon-' + s.key);
    var bdg  = document.getElementById('sbadge-' + s.key);
    if (item) item.classList.remove('current', 'past');
    if (icon) { icon.style.borderColor = 'transparent'; icon.style.boxShadow = 'none'; }
    if (bdg)  bdg.style.display = 'none';
  }

  /* Reset burn strip */
  for (var j = 0; j < BURN_STAGES.length; j++) {
    var bsEl = document.getElementById(BURN_STAGES[j].id);
    if (bsEl) bsEl.classList.remove('bs-active', 'bs-done');
  }
}

/* \u2500\u2500 TOAST \u2500\u2500 */
function showToast(msg, type) {
  if (!type) type = 's';
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast toast-' + type + ' show';
  setTimeout(function(){ t.classList.remove('show'); }, 3500);
}

/* \u2500\u2500 INIT RING \u2500\u2500 */
document.getElementById('ringProgress').style.strokeDashoffset = RING_CIRC;
document.getElementById('ringGlow').style.strokeDashoffset     = RING_CIRC;
/* Init "of X hours" label */
document.getElementById('timerOf').textContent = 'of ' + state.targetHours + ' hours';
/* Burn strip hidden on load */
document.getElementById('burnStrip').style.display = 'none';

/* \u2500\u2500 CLEANUP ON UNLOAD \u2500\u2500 */
window.addEventListener('beforeunload', function() {
  clearInterval(window.fastTimer);
  window.fastTimer = null;
});

/* \u2500\u2500 PAUSE TIMER WHEN TAB IS HIDDEN, RESUME WHEN VISIBLE \u2500\u2500 */
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    clearInterval(window.fastTimer);
    window.fastTimer = null;
  } else if (state.active) {
    startTicking();
  }
});

})();<\/script> </body> </html>`], [`<html lang="en" data-astro-cid-nrceh35d> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Fasting Timer \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ var t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();
  <\/script>`, '</head> <body data-astro-cid-nrceh35d> <div class="bg-wrap" data-astro-cid-nrceh35d><div class="orb o1" data-astro-cid-nrceh35d></div><div class="orb o2" data-astro-cid-nrceh35d></div><div class="orb o3" data-astro-cid-nrceh35d></div></div> <!-- NAV --> ', ' <div class="page" data-astro-cid-nrceh35d> <!-- \u2500\u2500 TIMER HERO \u2500\u2500 --> <div class="timer-hero" id="timerHero" data-astro-cid-nrceh35d> <!-- Active badge --> <div class="active-badge" data-astro-cid-nrceh35d> <span class="active-dot" data-astro-cid-nrceh35d></span> <span data-astro-cid-nrceh35d>Fast Active</span> </div> <!-- Stage Pill --> <div class="stage-pill" id="stagePill" style="color:var(--soft);background:rgba(77,112,85,.08);" data-astro-cid-nrceh35d> <span class="stage-dot" data-astro-cid-nrceh35d></span> <span id="stagePillText" data-astro-cid-nrceh35d>Ready to fast</span> </div> <!-- Ring Timer \u2014 240\xD7240 SVG --> <div class="ring-wrap" id="ringWrap" data-astro-cid-nrceh35d> <svg class="ring-svg" viewBox="0 0 240 240" aria-hidden="true" data-astro-cid-nrceh35d> <!-- Outer pulse ring (r=113 \u2014 slightly outside track) --> <circle class="ring-outer-pulse" cx="120" cy="120" r="113" data-astro-cid-nrceh35d></circle> <!-- Track --> <circle class="ring-track" cx="120" cy="120" r="105" data-astro-cid-nrceh35d></circle> <!-- Glow layer --> <circle class="ring-glow" id="ringGlow" cx="120" cy="120" r="105" stroke="var(--soft)" data-astro-cid-nrceh35d></circle> <!-- Progress arc --> <circle class="ring-progress" id="ringProgress" cx="120" cy="120" r="105" stroke="var(--green)" data-astro-cid-nrceh35d></circle> </svg> <div class="ring-center" data-astro-cid-nrceh35d> <div class="timer-display" id="timerDisplay" style="color:var(--soft);" data-astro-cid-nrceh35d>00:00:00</div> <div class="timer-of" id="timerOf" data-astro-cid-nrceh35d>Start your fast</div> <div class="timer-pct" id="timerPct" data-astro-cid-nrceh35d></div> </div> </div> <!-- Stage status text --> <p class="stage-status" id="stageStatus" data-astro-cid-nrceh35d>\nChoose your fasting protocol below, then tap <strong data-astro-cid-nrceh35d>Start Fast</strong> to begin.\n</p> <!-- 4-Stage Fat-Burning Strip (shown when active) --> <div class="burn-strip" id="burnStrip" data-astro-cid-nrceh35d> <div class="burn-stage" id="bs0" data-min="0" data-max="4" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Glycogen<br data-astro-cid-nrceh35d>Depleting</span> </div> <div class="burn-stage" id="bs1" data-min="4" data-max="8" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Fat Burning<br data-astro-cid-nrceh35d>Begins</span> </div> <div class="burn-stage" id="bs2" data-min="8" data-max="16" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Deep<br data-astro-cid-nrceh35d>Fat Burn</span> </div> <div class="burn-stage" id="bs3" data-min="16" data-max="999" data-astro-cid-nrceh35d> <span class="bs-emoji" data-astro-cid-nrceh35d>', '</span> <span class="bs-name" data-astro-cid-nrceh35d>Autophagy<br data-astro-cid-nrceh35d>Zone</span> </div> </div> <!-- Start Time Picker (hidden when active) --> <div class="start-picker" id="startPicker" data-astro-cid-nrceh35d> <span class="sp-label" data-astro-cid-nrceh35d>Fast started:</span> <div class="sp-btns" data-astro-cid-nrceh35d> <button class="sp-btn active" data-offset="0" onclick="setStartOffset(this,0)" data-astro-cid-nrceh35d>Now</button> <button class="sp-btn" data-offset="1" onclick="setStartOffset(this,1)" data-astro-cid-nrceh35d>1h ago</button> <button class="sp-btn" data-offset="2" onclick="setStartOffset(this,2)" data-astro-cid-nrceh35d>2h ago</button> <button class="sp-btn" data-offset="4" onclick="setStartOffset(this,4)" data-astro-cid-nrceh35d>4h ago</button> <button class="sp-btn" data-offset="8" onclick="setStartOffset(this,8)" data-astro-cid-nrceh35d>8h ago</button> </div> <input type="time" class="sp-time-input" id="customStartTime" title="Custom start time" data-astro-cid-nrceh35d> </div> <!-- Actions --> <div class="timer-actions" data-astro-cid-nrceh35d> <button class="btn-start" id="startBtn" onclick="startFast()" data-astro-cid-nrceh35d> ', ' Start Fast\n</button> <button class="btn-end" id="endBtn" style="display:none;" onclick="endFast()" data-astro-cid-nrceh35d> ', ' End Fast\n</button> <button class="btn-ghost" id="resetBtn" style="display:none;" onclick="resetFast()" data-astro-cid-nrceh35d>\n\u21BA Reset\n</button> </div> </div> <!-- \u2500\u2500 PROTOCOL CARDS (2\xD72 grid, shown when not fasting) \u2500\u2500 --> <div class="protocol-section" id="protocolSection" data-astro-cid-nrceh35d> <div class="sec-label" data-astro-cid-nrceh35d>Choose Your Protocol</div> <div class="protocol-grid" data-astro-cid-nrceh35d> ', ' </div> <div class="proto-start-wrap" data-astro-cid-nrceh35d> <button class="btn-start" onclick="startFast()" style="margin:0 auto;" data-astro-cid-nrceh35d> ', ' Start Fast\n</button> </div> </div> <!-- \u2500\u2500 FASTING STAGES SCIENCE \u2500\u2500 --> <div class="stages-section" data-astro-cid-nrceh35d> <div class="stages-head" data-astro-cid-nrceh35d> <div class="sh-icon2" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.3);" data-astro-cid-nrceh35d>', '</div> <div class="sh-title2" data-astro-cid-nrceh35d>What Happens to Your Body</div> </div> ', ' </div> <!-- \u2500\u2500 STATS \u2500\u2500 --> <div class="stats-row" data-astro-cid-nrceh35d> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--gold);" data-astro-cid-nrceh35d>', '</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Total Fasts</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--green);" data-astro-cid-nrceh35d>', '</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Completed</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--blue);" data-astro-cid-nrceh35d>', 'h</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Avg Duration</div> </div> <div class="stat-card" data-astro-cid-nrceh35d> <div class="sc-icon" data-astro-cid-nrceh35d>', '</div> <div class="sc-val" style="color:var(--purple);" data-astro-cid-nrceh35d>', 'h</div> <div class="sc-lbl" data-astro-cid-nrceh35d>Total Hours</div> </div> </div> <!-- \u2500\u2500 HISTORY TIMELINE \u2500\u2500 --> ', ' <!-- \u2500\u2500 SCIENCE PANELS \u2500\u2500 --> <div class="science-grid" data-astro-cid-nrceh35d> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>Fasting + Keto = Supercharged</div> <div class="sci-text" data-astro-cid-nrceh35d>Combining intermittent fasting with a keto diet creates a <strong data-astro-cid-nrceh35d>dual metabolic advantage</strong>. Keto primes your body to burn fat, while fasting depletes glycogen stores faster \u2014 meaning you reach deep ketosis in hours, not days.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>Why 16+ Hours Matters</div> <div class="sci-text" data-astro-cid-nrceh35d>The most significant metabolic benefits \u2014 <strong data-astro-cid-nrceh35d>autophagy, growth hormone release, and deep fat oxidation</strong> \u2014 only kick in after 16 hours. The first 12 hours are just clearing the runway. Push past 16h for the real magic.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>What to Consume While Fasting</div> <div class="sci-text" data-astro-cid-nrceh35d><strong data-astro-cid-nrceh35d>Water, black coffee, plain tea, and electrolytes</strong> are fasting-safe. Salt + potassium + magnesium prevent the energy crashes that make people break their fast early. Avoid anything with calories or sweeteners.</div> </div> <div class="sci-card" data-astro-cid-nrceh35d> <div class="sci-icon" data-astro-cid-nrceh35d>', '</div> <div class="sci-title" data-astro-cid-nrceh35d>When to Break Your Fast</div> <div class="sci-text" data-astro-cid-nrceh35d><strong data-astro-cid-nrceh35d>Extreme dizziness, heart palpitations, or fainting</strong> are signals to eat. If you feel this, break your fast with something small \u2014 a few nuts or an egg. These symptoms usually mean electrolyte imbalance, not weakness.</div> </div> </div> </div><!-- /page --> <!-- COMPLETE OVERLAY --> <div class="complete-overlay" id="completeOverlay" data-astro-cid-nrceh35d> <div class="co-ring" data-astro-cid-nrceh35d> <svg width="160" height="160" viewBox="0 0 160 160" data-astro-cid-nrceh35d> <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(16,185,129,.2)" stroke-width="10" data-astro-cid-nrceh35d></circle> <circle cx="80" cy="80" r="68" fill="none" stroke="url(#cg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="427" stroke-dashoffset="0" data-astro-cid-nrceh35d></circle> <defs data-astro-cid-nrceh35d><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%" data-astro-cid-nrceh35d><stop offset="0%" stop-color="#10b981" data-astro-cid-nrceh35d></stop><stop offset="100%" stop-color="#34d399" data-astro-cid-nrceh35d></stop></linearGradient></defs> </svg> <div class="co-ring-label" data-astro-cid-nrceh35d>', '</div> </div> <h2 class="co-title" data-astro-cid-nrceh35d>Fast <em data-astro-cid-nrceh35d>complete</em>!</h2> <p style="color:var(--soft);font-size:.9rem;max-width:380px;line-height:1.6;margin-bottom:1rem;" id="coMessage" data-astro-cid-nrceh35d>You crushed it. Your body just unlocked deep fat-burning mode.</p> <div class="co-stats" data-astro-cid-nrceh35d> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coHours" data-astro-cid-nrceh35d>\u2014</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>Hours Fasted</div></div> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coStage" data-astro-cid-nrceh35d>\u2014</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>Stage Reached</div></div> <div class="co-stat" data-astro-cid-nrceh35d><div class="co-stat-val" id="coXP" data-astro-cid-nrceh35d>+50</div><div class="co-stat-lbl" data-astro-cid-nrceh35d>XP Earned</div></div> </div> <div class="co-btns" data-astro-cid-nrceh35d> <a href="/dashboard" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 1.75rem;border-radius:13px;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;font-weight:900;font-size:.9rem;text-decoration:none;box-shadow:0 4px 16px rgba(16,185,129,.4);" data-astro-cid-nrceh35d> ', ` Back to Dashboard
</a> <button onclick="newFast()" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 1.75rem;border-radius:13px;background:var(--card);border:1.5px solid var(--border);color:var(--soft);font-weight:800;font-size:.875rem;cursor:pointer;transition:all .2s;" onmouseover="this.style.borderColor='var(--green)'" onmouseout="this.style.borderColor='var(--border)'" data-astro-cid-nrceh35d> `, ' Fast Again\n</button> </div> </div> <div class="toast" id="toast" data-astro-cid-nrceh35d></div> <!-- \u2500\u2500 SCRIPT \u2500\u2500 --> <script>(function(){', `

/* \u2500\u2500 FASTING STAGES CONFIG \u2500\u2500 */
var STAGES = [
  { key:'fed',      h:0,  color:'#6b7280', name:'Fed State',          emoji:'\u{1F37D}\uFE0F' },
  { key:'insulin',  h:4,  color:'#10b981', name:'Insulin Drops',      emoji:'\u{1F4C9}' },
  { key:'glycogen', h:8,  color:'#3b82f6', name:'Glycogen Depletion', emoji:'\u26A1' },
  { key:'burning',  h:12, color:'#f59e0b', name:'Fat Burning',        emoji:'\u{1F525}' },
  { key:'ketosis',  h:16, color:'#f97316', name:'Deep Ketosis',       emoji:'\u{1F506}' },
  { key:'autophagy',h:18, color:'#ef4444', name:'Autophagy',          emoji:'\u{1F9F9}' },
  { key:'deep',     h:24, color:'#8b5cf6', name:'Deep Autophagy',     emoji:'\u{1F30C}' },
];

/* 4-stage burn strip config (maps to ids bs0\u2013bs3) */
var BURN_STAGES = [
  { id:'bs0', min:0,  max:4   },
  { id:'bs1', min:4,  max:8   },
  { id:'bs2', min:8,  max:16  },
  { id:'bs3', min:16, max:999 },
];

var RING_CIRC = 2 * Math.PI * 105; /* 659.73 */

/* \u2500\u2500 STATE \u2500\u2500 */
var state = {
  active:      false,
  startTime:   null,
  targetHours: 16,
  protocol:    defaultProtocol || '16_8',
  startOffset: 0,
  sessionId:   null,
};
window.fastTimer = null;

/* \u2500\u2500 RESTORE ACTIVE SESSION \u2500\u2500 */
if (activeSessionData) {
  state.active      = true;
  state.startTime   = new Date(activeSessionData.started_at);
  state.targetHours = activeSessionData.target_hours || 16;
  state.protocol    = activeSessionData.protocol || '16_8';
  state.sessionId   = activeSessionData.id;
  selectProtocol(document.querySelector('[data-protocol="' + state.protocol + '"]'), false);
  showRunningUI();
  startTicking();
}

/* \u2500\u2500 PROTOCOL SELECT \u2500\u2500 */
function selectProtocol(el, updateState) {
  if (!el) return;
  if (typeof updateState === 'undefined') updateState = true;
  document.querySelectorAll('.proto-card').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  if (updateState) {
    state.protocol    = el.dataset.protocol;
    state.targetHours = parseInt(el.dataset.hours) || 16;
    /* Update "of X hours" label if timer is idle */
    var ofEl = document.getElementById('timerOf');
    if (ofEl && !state.active) {
      ofEl.textContent = 'of ' + state.targetHours + ' hours';
    }
  }
}
window.selectProtocol = selectProtocol;

/* \u2500\u2500 START OFFSET \u2500\u2500 */
function setStartOffset(el, hours) {
  document.querySelectorAll('.sp-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  state.startOffset = hours;
  var d = new Date();
  d.setHours(d.getHours() - hours);
  document.getElementById('customStartTime').value =
    d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
window.setStartOffset = setStartOffset;

/* Custom time input */
document.getElementById('customStartTime').addEventListener('change', function() {
  var parts = this.value.split(':').map(Number);
  var h = parts[0];
  var m = parts[1];
  var now = new Date();
  var start = new Date();
  start.setHours(h, m, 0, 0);
  if (start > now) start.setDate(start.getDate() - 1);
  state.startOffset = (now - start) / 3600000;
  document.querySelectorAll('.sp-btn').forEach(function(b){ b.classList.remove('active'); });
});

/* Init custom time to now */
var initNow = new Date();
document.getElementById('customStartTime').value =
  initNow.getHours().toString().padStart(2,'0') + ':' + initNow.getMinutes().toString().padStart(2,'0');

/* \u2500\u2500 START FAST \u2500\u2500 */
function startFast() {
  var offsetMs = state.startOffset * 3600000;
  state.startTime = new Date(Date.now() - offsetMs);
  state.active    = true;

  fetch('/api/fasting/start', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      protocol:     state.protocol,
      target_hours: state.targetHours,
      started_at:   state.startTime.toISOString(),
    }),
  }).then(function(res){ return res.json(); }).then(function(data){
    if (data.id) state.sessionId = data.id;
  }).catch(function(e){ console.warn('Session save failed', e); });

  showRunningUI();
  startTicking();
  showToast('\u23F1\uFE0F Fast started! Stay strong, ' + userName + '.', 's');
}
window.startFast = startFast;

/* \u2500\u2500 END FAST \u2500\u2500 */
function endFast() {
  if (!state.active) return;
  clearInterval(window.fastTimer);
  window.fastTimer = null;

  var elapsed = getElapsedHours();
  var completed = elapsed >= state.targetHours;

  fetch('/api/fasting/end', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      session_id:   state.sessionId,
      ended_at:     new Date().toISOString(),
      actual_hours: elapsed,
      completed:    completed,
    }),
  }).catch(function(e){ console.warn('End session failed', e); });

  var stage = getCurrentStage(elapsed);
  document.getElementById('coHours').textContent = elapsed.toFixed(1) + 'h';
  document.getElementById('coStage').textContent = stage.emoji + ' ' + stage.name;
  var xp = completed ? 50 + Math.round(elapsed * 2) : 20;
  document.getElementById('coXP').textContent = '+' + xp;
  document.getElementById('coMessage').textContent = completed
    ? 'You hit your ' + state.targetHours + 'h goal! Your body just reached ' + stage.name + '. Incredible.'
    : elapsed.toFixed(1) + 'h is still a win. Every fast builds your metabolic flexibility.';
  document.getElementById('completeOverlay').classList.add('show');

  resetState();
}
window.endFast = endFast;

/* \u2500\u2500 RESET \u2500\u2500 */
function resetFast() {
  if (state.active && !confirm('Reset your current fast?')) return;
  clearInterval(window.fastTimer);
  window.fastTimer = null;
  resetState();
  showIdleUI();
  showToast('\u21BA Timer reset.', 's');
}
window.resetFast = resetFast;

function newFast() {
  document.getElementById('completeOverlay').classList.remove('show');
  resetState();
  showIdleUI();
}
window.newFast = newFast;

function resetState() {
  state.active      = false;
  state.startTime   = null;
  state.sessionId   = null;
  state.startOffset = 0;
}

/* \u2500\u2500 TICK \u2500\u2500 */
function startTicking() {
  clearInterval(window.fastTimer);
  tick();
  window.fastTimer = setInterval(tick, 1000);
}

function getElapsedHours() {
  if (!state.startTime) return 0;
  return (Date.now() - state.startTime.getTime()) / 3600000;
}

function getCurrentStage(hours) {
  var current = STAGES[0];
  for (var i = 0; i < STAGES.length; i++) {
    if (hours >= STAGES[i].h) current = STAGES[i];
    else break;
  }
  return current;
}

function tick() {
  if (!state.startTime) return;

  var elapsed   = getElapsedHours();
  var target    = state.targetHours;
  var pct       = Math.min(elapsed / target, 1);
  var stage     = getCurrentStage(elapsed);

  /* Timer display */
  var dispH = Math.floor(elapsed);
  var dispM = Math.floor((elapsed % 1) * 60);
  var dispS = Math.floor(((elapsed * 60) % 1) * 60);
  document.getElementById('timerDisplay').textContent =
    dispH.toString().padStart(2,'0') + ':' +
    dispM.toString().padStart(2,'0') + ':' +
    dispS.toString().padStart(2,'0');
  document.getElementById('timerDisplay').style.color = stage.color;

  /* "of X hours" / "Goal reached" */
  var ofEl = document.getElementById('timerOf');
  ofEl.textContent = elapsed >= target ? 'Goal reached! \u{1F389}' : 'of ' + target + ' hours';

  document.getElementById('timerPct').textContent = Math.round(pct * 100) + '% complete';

  /* Ring */
  var offset = RING_CIRC * (1 - pct);
  document.getElementById('ringProgress').style.strokeDashoffset = offset;
  document.getElementById('ringProgress').style.stroke = stage.color;
  document.getElementById('ringGlow').style.strokeDashoffset = offset;
  document.getElementById('ringGlow').style.stroke = stage.color;

  /* Stage pill */
  document.getElementById('stagePill').style.color = stage.color;
  document.getElementById('stagePill').style.background = stage.color + '18';
  document.getElementById('stagePillText').textContent = stage.emoji + ' ' + stage.name;

  /* Stage status text */
  var nextStage = null;
  for (var i = 0; i < STAGES.length; i++) {
    if (STAGES[i].h > elapsed) { nextStage = STAGES[i]; break; }
  }
  if (nextStage) {
    var hoursLeft = nextStage.h - elapsed;
    var minsLeft  = Math.round(hoursLeft * 60);
    var untilMsg = minsLeft > 60
      ? '<strong>' + Math.floor(hoursLeft) + 'h ' + (minsLeft % 60) + 'm</strong> until <strong>' + nextStage.emoji + ' ' + nextStage.name + '</strong>.'
      : 'Only <strong>' + minsLeft + ' minutes</strong> until <strong>' + nextStage.emoji + ' ' + nextStage.name + '</strong>!';
    document.getElementById('stageStatus').innerHTML =
      'You\\\\'re in <strong style="color:' + stage.color + '">' + stage.name + '</strong>. ' + untilMsg;
  } else {
    document.getElementById('stageStatus').innerHTML =
      '\u{1F30C} <strong>You\\\\'ve reached the pinnacle</strong> \u2014 Deep Autophagy. Maximum cellular repair is happening right now. Extraordinary.';
  }

  /* Update science stage list */
  for (var j = 0; j < STAGES.length; j++) {
    var s     = STAGES[j];
    var item  = document.getElementById('stage-' + s.key);
    var icon  = document.getElementById('sicon-' + s.key);
    var badge = document.getElementById('sbadge-' + s.key);
    if (!item) continue;
    item.classList.remove('current', 'past');
    if (s.key === stage.key) {
      item.classList.add('current');
      icon.style.borderColor = s.color;
      icon.style.boxShadow   = '0 0 0 4px ' + s.color + '22, 0 4px 14px ' + s.color + '44';
      badge.style.display    = 'inline-flex';
    } else if (elapsed >= s.h) {
      item.classList.add('past');
      icon.style.borderColor = s.color + '80';
      badge.style.display    = 'none';
    } else {
      icon.style.borderColor = 'transparent';
      icon.style.boxShadow   = 'none';
      badge.style.display    = 'none';
    }
  }

  /* 4-stage burn strip */
  for (var k = 0; k < BURN_STAGES.length; k++) {
    var bs   = BURN_STAGES[k];
    var bsEl = document.getElementById(bs.id);
    if (!bsEl) continue;
    bsEl.classList.remove('bs-active', 'bs-done');
    if (elapsed >= bs.min && elapsed < bs.max) {
      bsEl.classList.add('bs-active');
    } else if (elapsed >= bs.max) {
      bsEl.classList.add('bs-done');
    }
  }

  /* Auto-complete toast */
  if (pct >= 1 && !document.getElementById('completeOverlay').classList.contains('show')) {
    showToast('\u{1F3C6} You hit your fasting goal!', 'g');
  }
}

/* \u2500\u2500 UI STATES \u2500\u2500 */
function showRunningUI() {
  document.getElementById('timerHero').classList.add('is-active');
  document.getElementById('startBtn').style.display    = 'none';
  document.getElementById('endBtn').style.display      = 'flex';
  document.getElementById('resetBtn').style.display    = 'flex';
  document.getElementById('startPicker').style.display = 'none';
  document.getElementById('protocolSection').style.opacity = '.45';
  document.getElementById('protocolSection').style.pointerEvents = 'none';
  /* Show burn strip, hide second start btn in protocol section */
  document.getElementById('burnStrip').style.display = 'flex';
}

function showIdleUI() {
  document.getElementById('timerHero').classList.remove('is-active');
  document.getElementById('startBtn').style.display    = 'flex';
  document.getElementById('endBtn').style.display      = 'none';
  document.getElementById('resetBtn').style.display    = 'none';
  document.getElementById('startPicker').style.display = 'flex';
  document.getElementById('burnStrip').style.display   = 'none';

  document.getElementById('timerDisplay').textContent  = '00:00:00';
  document.getElementById('timerDisplay').style.color  = 'var(--soft)';
  document.getElementById('timerOf').textContent       = 'of ' + state.targetHours + ' hours';
  document.getElementById('timerPct').textContent      = '';
  document.getElementById('stagePillText').textContent = 'Ready to fast';
  document.getElementById('stagePill').style.color     = 'var(--soft)';
  document.getElementById('stagePill').style.background= 'rgba(77,112,85,.08)';
  document.getElementById('stageStatus').innerHTML     = 'Choose your protocol below, then tap <strong>Start Fast</strong> to begin.';
  document.getElementById('ringProgress').style.strokeDashoffset = RING_CIRC;
  document.getElementById('ringGlow').style.strokeDashoffset     = RING_CIRC;
  document.getElementById('ringProgress').style.stroke = 'var(--green)';
  document.getElementById('ringGlow').style.stroke     = 'var(--green)';
  document.getElementById('protocolSection').style.opacity = '1';
  document.getElementById('protocolSection').style.pointerEvents = 'auto';

  /* Reset science stages */
  for (var i = 0; i < STAGES.length; i++) {
    var s    = STAGES[i];
    var item = document.getElementById('stage-' + s.key);
    var icon = document.getElementById('sicon-' + s.key);
    var bdg  = document.getElementById('sbadge-' + s.key);
    if (item) item.classList.remove('current', 'past');
    if (icon) { icon.style.borderColor = 'transparent'; icon.style.boxShadow = 'none'; }
    if (bdg)  bdg.style.display = 'none';
  }

  /* Reset burn strip */
  for (var j = 0; j < BURN_STAGES.length; j++) {
    var bsEl = document.getElementById(BURN_STAGES[j].id);
    if (bsEl) bsEl.classList.remove('bs-active', 'bs-done');
  }
}

/* \u2500\u2500 TOAST \u2500\u2500 */
function showToast(msg, type) {
  if (!type) type = 's';
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast toast-' + type + ' show';
  setTimeout(function(){ t.classList.remove('show'); }, 3500);
}

/* \u2500\u2500 INIT RING \u2500\u2500 */
document.getElementById('ringProgress').style.strokeDashoffset = RING_CIRC;
document.getElementById('ringGlow').style.strokeDashoffset     = RING_CIRC;
/* Init "of X hours" label */
document.getElementById('timerOf').textContent = 'of ' + state.targetHours + ' hours';
/* Burn strip hidden on load */
document.getElementById('burnStrip').style.display = 'none';

/* \u2500\u2500 CLEANUP ON UNLOAD \u2500\u2500 */
window.addEventListener('beforeunload', function() {
  clearInterval(window.fastTimer);
  window.fastTimer = null;
});

/* \u2500\u2500 PAUSE TIMER WHEN TAB IS HIDDEN, RESUME WHEN VISIBLE \u2500\u2500 */
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    clearInterval(window.fastTimer);
    window.fastTimer = null;
  } else if (state.active) {
    startTicking();
  }
});

})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "fasting", "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Clock", $$Clock, { "size": 18, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Flame", $$Flame, { "size": 18, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Zap", $$Zap, { "size": 18, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Brain", $$Brain, { "size": 18, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Timer", $$Timer, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-nrceh35d": true }), renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-nrceh35d": true }), [
    {
      val: "16_8",
      hours: 16,
      icon: "\u23F0",
      name: "16:8",
      window: "Fast 16h \xB7 Eat in 8h window",
      desc: "The most popular keto fasting protocol. Effective for fat loss and easy to maintain long-term.",
      diff: "Easy",
      diffClass: "easy"
    },
    {
      val: "18_6",
      hours: 18,
      icon: "\u{1F525}",
      name: "18:6",
      window: "Fast 18h \xB7 Eat in 6h window",
      desc: "Faster ketosis and deeper fat oxidation. A natural step up from 16:8 once adapted.",
      diff: "Medium",
      diffClass: "medium"
    },
    {
      val: "20_4",
      hours: 20,
      icon: "\u{1F4AA}",
      name: "20:4",
      window: "Fast 20h \xB7 Eat in 4h window",
      desc: "Extended fat-burning window with strong autophagy benefits. Best for experienced fasters.",
      diff: "Hard",
      diffClass: "hard"
    },
    {
      val: "omad",
      hours: 23,
      icon: "\u26A1",
      name: "OMAD 23:1",
      window: "Fast 23h \xB7 One meal a day",
      desc: "Maximum metabolic impact. One eating window per day. Elite-level discipline required.",
      diff: "Extreme",
      diffClass: "extreme"
    }
  ].map((p) => renderTemplate`<div${addAttribute(`proto-card${p.val === defaultProtocol ? " active" : ""}`, "class")}${addAttribute(p.val, "data-protocol")}${addAttribute(p.hours, "data-hours")} onclick="selectProtocol(this)" data-astro-cid-nrceh35d> <div${addAttribute(`proto-diff-badge ${p.diffClass}`, "class")} data-astro-cid-nrceh35d>${p.diff}</div> <div class="proto-header" data-astro-cid-nrceh35d> <span class="proto-icon" data-astro-cid-nrceh35d>${p.icon}</span> <span class="proto-name" data-astro-cid-nrceh35d>${p.name}</span> </div> <div class="proto-window" data-astro-cid-nrceh35d>${p.window}</div> <div class="proto-desc" data-astro-cid-nrceh35d>${p.desc}</div> </div>`), renderComponent($$result, "Timer", $$Timer, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-nrceh35d": true }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 18, "data-astro-cid-nrceh35d": true }), [
    { h: 0, color: "#6b7280", icon: "\u{1F37D}\uFE0F", name: "Fed State", desc: "Insulin is elevated. Your body is digesting nutrients from your last meal. Fat burning is minimal.", key: "fed" },
    { h: 4, color: "#10b981", icon: "\u{1F4C9}", name: "Insulin Drops", desc: "Blood sugar normalizes. Insulin falls. Your body begins transitioning from glucose to fat as its primary fuel source.", key: "insulin" },
    { h: 8, color: "#3b82f6", icon: "\u26A1", name: "Glycogen Depletion", desc: "Liver glycogen (stored carbs) starts running out. Your body is forced to find alternative fuel \u2014 enter: fat burning.", key: "glycogen" },
    { h: 12, color: "#f59e0b", icon: "\u{1F525}", name: "Fat Burning Begins", desc: "Ketone production begins. Free fatty acids are released from fat cells. You enter a mild ketogenic state.", key: "burning" },
    { h: 16, color: "#f97316", icon: "\u{1F506}", name: "Ketosis Deepens", desc: "Full metabolic shift to fat. Brain switches to ketones for fuel. Mental clarity improves. This is the keto sweet spot.", key: "ketosis" },
    { h: 18, color: "#ef4444", icon: "\u{1F9F9}", name: "Autophagy Activates", desc: "Your cells begin cleaning house \u2014 breaking down damaged proteins and cellular waste. Anti-aging effects begin. This is powerful.", key: "autophagy" },
    { h: 24, color: "#8b5cf6", icon: "\u{1F30C}", name: "Deep Autophagy", desc: "Maximum cellular repair mode. Growth hormone spikes by up to 2000%. Stem cell regeneration increases. The deep healing zone.", key: "deep" }
  ].map((stage, idx) => renderTemplate`<div class="stage-item"${addAttribute(`stage-${stage.key}`, "id")} style="position:relative;" data-astro-cid-nrceh35d> ${idx < 6 && renderTemplate`<div class="stage-connector"${addAttribute(`background:${stage.color}33;`, "style")} data-astro-cid-nrceh35d></div>`} <div class="stage-icon-wrap"${addAttribute(`sicon-${stage.key}`, "id")}${addAttribute(`background:${stage.color}18;border-color:${stage.color}30;`, "style")} data-astro-cid-nrceh35d> ${stage.icon} </div> <div class="stage-time"${addAttribute(`color:${stage.color};`, "style")} data-astro-cid-nrceh35d>${stage.h}h</div> <div class="stage-content" data-astro-cid-nrceh35d> <div class="stage-name"${addAttribute(`sname-${stage.key}`, "id")} data-astro-cid-nrceh35d>${stage.name}</div> <div class="stage-desc" data-astro-cid-nrceh35d>${stage.desc}</div> <div class="stage-current-badge"${addAttribute(`sbadge-${stage.key}`, "id")} style="display:none;" data-astro-cid-nrceh35d> <span data-astro-cid-nrceh35d>●</span> You are here
</div> </div> </div>`), renderComponent($$result, "Flame", $$Flame, { "size": 20, "color": "var(--gold)", "data-astro-cid-nrceh35d": true }), totalFasts, renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 20, "color": "var(--green)", "data-astro-cid-nrceh35d": true }), completedFasts, renderComponent($$result, "Timer", $$Timer, { "size": 20, "color": "var(--blue)", "data-astro-cid-nrceh35d": true }), avgFastHours, renderComponent($$result, "Zap", $$Zap, { "size": 20, "color": "var(--purple)", "data-astro-cid-nrceh35d": true }), Math.round(totalFastHours), hasHistory && renderTemplate`<div class="history-section" data-astro-cid-nrceh35d> <div class="stages-head" data-astro-cid-nrceh35d> <div class="sh-icon2" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 4px 10px rgba(139,92,246,.3);" data-astro-cid-nrceh35d>${renderComponent($$result, "Calendar", $$Calendar, { "size": 18, "data-astro-cid-nrceh35d": true })}</div> <div class="sh-title2" data-astro-cid-nrceh35d>Recent Fasting Sessions</div> </div> <div class="hist-list" data-astro-cid-nrceh35d> ${historyRows.map((row) => renderTemplate`<div class="hist-item" data-astro-cid-nrceh35d> <div class="hist-proto" data-astro-cid-nrceh35d> <div class="hist-proto-name" data-astro-cid-nrceh35d>${row.protoName}</div> <div class="hist-proto-sub" data-astro-cid-nrceh35d>fast</div> </div> <div class="hist-info" data-astro-cid-nrceh35d> <div class="hist-date" data-astro-cid-nrceh35d>${row.dateStr} at ${row.timeStr}</div> <div class="hist-dur" data-astro-cid-nrceh35d>${row.hrs > 0 ? row.hrs.toFixed(1) + "h fasted of " + row.target + "h target" : "In progress"}</div> <div class="hist-bar-wrap" data-astro-cid-nrceh35d> <div class="hist-bar-track" data-astro-cid-nrceh35d> <div class="hist-bar-fill"${addAttribute(`width:${row.pct}%;background:${row.barColor};`, "style")} data-astro-cid-nrceh35d></div> </div> <span class="hist-bar-pct"${addAttribute(`color:${row.barColor};`, "style")} data-astro-cid-nrceh35d>${row.pct}%</span> </div> </div> <div class="hist-status" data-astro-cid-nrceh35d> <div${addAttribute(`hist-check ${row.checkClass}`, "class")} data-astro-cid-nrceh35d>${row.checkIcon}</div> </div> </div>`)} </div> </div>`, renderComponent($$result, "Brain", $$Brain, { "size": 24, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 24, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Droplets", $$Droplets, { "size": 24, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "AlertTriangle", $$AlertTriangle, { "size": 24, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Award", $$Award, { "size": 28, "color": "var(--gold)", "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Home", $$Home, { "size": 16, "data-astro-cid-nrceh35d": true }), renderComponent($$result, "Timer", $$Timer, { "size": 16, "data-astro-cid-nrceh35d": true }), defineScriptVars({ defaultProtocol, activeSessionData, userName }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/fasting.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/fasting.astro";
const $$url = "/dashboard/fasting";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Fasting,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
