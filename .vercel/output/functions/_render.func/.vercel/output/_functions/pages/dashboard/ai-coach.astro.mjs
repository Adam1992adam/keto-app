/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, g as addAttribute, F as Fragment, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, s as supabase, a as getMealCycleDays } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { e as $$User, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, c as $$Sparkles, b as $$Utensils, a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$BarChart2 } from '../../chunks/BarChart2_CbUm7GhP.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
import { $ as $$Star } from '../../chunks/Star_D1SG2E9R.mjs';
import { $ as $$TrendingDown } from '../../chunks/TrendingDown_CfPDZzhp.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$Timer } from '../../chunks/Timer_ceHoeydv.mjs';
import { $ as $$MessageCircle } from '../../chunks/MessageCircle_ByI6Dj0C.mjs';
import { $ as $$Brain } from '../../chunks/Brain_CVL5l-1N.mjs';
import { $ as $$Camera } from '../../chunks/Camera_BGE67eLB.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Bot = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Bot;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "bot", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12 8V4H8"></path> <rect width="16" height="12" x="4" y="8" rx="2"></rect> <path d="M2 14h2"></path> <path d="M20 14h2"></path> <path d="M15 13v2"></path> <path d="M9 13v2"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Bot.astro", void 0);

const $$Astro$1 = createAstro();
const $$Trash2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Trash2;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "trash-2", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M10 11v6"></path> <path d="M14 11v6"></path> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path> <path d="M3 6h18"></path> <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Trash2.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$AiCoach = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AiCoach;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  if (profile.subscription_tier !== "elite_12") return Astro2.redirect("/dashboard/upgrade");
  const planType = profile.subscription_tier;
  const tierLabel = "\u{1F451} Elite";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const nowHour = (/* @__PURE__ */ new Date()).getHours();
  const journey = await getUserJourney(user.id);
  const currentDay = journey?.current_day || 1;
  const streak = journey?.streak_days || 0;
  const totalXp = journey?.total_xp || 0;
  const level = journey?.level || 1;
  const weekNum = Math.ceil(currentDay / 7);
  const cycledDay = (currentDay - 1) % getMealCycleDays(planType) + 1;
  const results = await Promise.all([
    supabase.from("onboarding_data").select("current_weight,target_weight,dietary_restrictions,fasting_protocol").eq("user_id", user.id).single(),
    supabase.from("daily_checkins").select("energy_level,water_glasses,had_headache,had_fatigue").eq("user_id", user.id).eq("checkin_date", today).maybeSingle(),
    supabase.from("daily_tasks").select("task_title,completed").eq("user_id", user.id).eq("day_number", currentDay),
    supabase.from("weight_logs").select("weight,logged_date").eq("user_id", user.id).order("logged_date", { ascending: false }).limit(3),
    supabase.from("fasting_sessions").select("started_at,target_hours").eq("user_id", user.id).is("ended_at", null).order("started_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("macro_goals").select("daily_calories,protein_g,fat_g,carbs_g").eq("user_id", user.id).single(),
    supabase.from("meal_completions").select("meal_type").eq("user_id", user.id).eq("day_number", currentDay),
    supabase.from("chat_messages").select("role,content,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(40)
  ]);
  const onboarding = results[0].data;
  const todayCheckin = results[1].data;
  const todayTasks = results[2].data || [];
  const weightLogs = results[3].data || [];
  const activeFast = results[4].data;
  const macroGoals = results[5].data;
  const mealComps = results[6].data || [];
  const chatHistory = (results[7].data || []).reverse();
  const { data: mealPlanDirect } = await supabase.from("meal_plans").select("meal_type, recipe:recipes(id,title,calories,protein,fat,net_carbs)").eq("plan_type", planType).eq("day_number", cycledDay).order("meal_type");
  const { data: mealPlanFallback } = mealPlanDirect?.length ? { data: null } : await supabase.from("meal_plans").select("meal_type, recipe:recipes(id,title,calories,protein,fat,net_carbs)").eq("plan_type", "basic_30").eq("day_number", cycledDay).order("meal_type");
  const mealPlan = (mealPlanDirect?.length ? mealPlanDirect : mealPlanFallback) || [];
  const historyByDate = chatHistory.reduce((acc, msg) => {
    const d = new Date(msg.created_at).toISOString().split("T")[0];
    if (!acc[d]) acc[d] = { date: d, msgs: [] };
    acc[d].msgs.push(msg);
    return acc;
  }, {});
  const historyDates = Object.values(historyByDate).sort((a, b) => b.date.localeCompare(a.date));
  const startWeight = onboarding?.current_weight || 0;
  const goalWeight = onboarding?.target_weight || 0;
  const latestWeight = weightLogs[0]?.weight || startWeight;
  const weightLost = Math.max(0, startWeight - latestWeight);
  const toGoal = Math.max(0.1, startWeight - goalWeight);
  const goalPct = Math.min(100, Math.round(weightLost / toGoal * 100));
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;
  const eatenCount = mealComps.length;
  const totalMeals = mealPlan.length || 4;
  const taskPct = todayTasks.length > 0 ? Math.round(completedTasksCount / todayTasks.length * 100) : 0;
  const mealPct = Math.round(eatenCount / totalMeals * 100);
  const waterCount = todayCheckin?.water_glasses || 0;
  const waterPct = Math.round(waterCount / 8 * 100);
  const fastingActive = !!activeFast;
  const fastHours = activeFast ? Math.floor((Date.now() - new Date(activeFast.started_at).getTime()) / 36e5) : 0;
  const eatenSet = new Set(mealComps.map((c) => c.meal_type));
  const consumed = mealPlan.filter((m) => eatenSet.has(m.meal_type) && m.recipe).reduce((acc, m) => {
    const r = m.recipe;
    return { cal: acc.cal + (r.calories || 0), prot: acc.prot + parseFloat(r.protein || 0), fat: acc.fat + parseFloat(r.fat || 0), carbs: acc.carbs + parseFloat(r.net_carbs || 0) };
  }, { cal: 0, prot: 0, fat: 0, carbs: 0 });
  const calPct = macroGoals?.daily_calories ? Math.min(100, Math.round(consumed.cal / macroGoals.daily_calories * 100)) : 0;
  const protPct = macroGoals?.protein_g ? Math.min(100, Math.round(consumed.prot / macroGoals.protein_g * 100)) : 0;
  const restrictions = onboarding?.dietary_restrictions || [];
  const showLowWater = !!todayCheckin && waterCount < 4;
  const showBreakfast = nowHour < 11;
  const showLunch = nowHour >= 11 && nowHour < 15;
  const showSnack = nowHour >= 15 && nowHour < 19;
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-yk3h76bc> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Coach \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-yk3h76bc> ", ' <div class="ai-layout" data-astro-cid-yk3h76bc> <!-- \u2500\u2500 SIDEBAR \u2500\u2500 --> <aside class="ai-sidebar" data-astro-cid-yk3h76bc> <!-- Coach info --> <div class="ai-coach-card" data-astro-cid-yk3h76bc> <div class="ai-coach-top" data-astro-cid-yk3h76bc> <div class="ai-coach-avatar" data-astro-cid-yk3h76bc> ', ' <div class="ai-coach-dot" data-astro-cid-yk3h76bc></div> </div> <div data-astro-cid-yk3h76bc> <div class="ai-coach-name" data-astro-cid-yk3h76bc>Keto AI Coach</div> <div class="ai-coach-sub" data-astro-cid-yk3h76bc>\u2726 Elite Exclusive</div> </div> </div> <div class="ai-user-chip" data-astro-cid-yk3h76bc> <div class="ai-user-avatar" data-astro-cid-yk3h76bc>', '</div> <div class="ai-user-info" data-astro-cid-yk3h76bc> <div class="ai-user-name" data-astro-cid-yk3h76bc>', '</div> <div class="ai-user-meta" data-astro-cid-yk3h76bc>Day ', " \xB7 Week ", " \xB7 Lv.", '</div> </div> </div> </div> <!-- Journey stats --> <div class="ai-stats-block" data-astro-cid-yk3h76bc> <div class="ai-stats-title" data-astro-cid-yk3h76bc>', ' Journey Stats</div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Streak</span> <span class="ai-stat-val" style="color:var(--gold)" data-astro-cid-yk3h76bc>', ' days</span> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' XP</span> <span class="ai-stat-val" style="color:var(--purple)" data-astro-cid-yk3h76bc>', "</span> </div> ", " ", " ", ` </div> <!-- Today's status --> <div class="ai-today-block" data-astro-cid-yk3h76bc> <div class="ai-stats-title" data-astro-cid-yk3h76bc>`, ' Today</div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Tasks</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', "/", '</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', ' data-astro-cid-yk3h76bc></div> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Meals</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', "/", '</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', ' data-astro-cid-yk3h76bc></div> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Water</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', '/8 gl</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', " data-astro-cid-yk3h76bc></div> </div> ", " ", " </div> <!-- Chat History panel --> ", ' <!-- Dynamic suggestions --> <div class="ai-sug-block" data-astro-cid-yk3h76bc> <div class="ai-sug-title" data-astro-cid-yk3h76bc>', " Ask me</div> ", " ", " ", " ", " ", " ", " ", " ", " ", ' <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", ' Full progress review</button> <button class="ai-sug-btn" data-msg="What are the best keto foods to improve fat burning and stay in deep ketosis?" data-astro-cid-yk3h76bc>', ' Maximize fat burn</button> <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", " Hit protein goal</button> ", ' <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", " Day ", ' tip</button> </div> </aside> <!-- \u2500\u2500 MAIN CHAT \u2500\u2500 --> <main class="ai-main" data-astro-cid-yk3h76bc> <!-- Chat header --> <div class="ai-chat-header" data-astro-cid-yk3h76bc> <div class="ai-chat-header-left" data-astro-cid-yk3h76bc> <div style="width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);flex-shrink:0;" data-astro-cid-yk3h76bc></div> <div data-astro-cid-yk3h76bc> <div class="ai-chat-title" data-astro-cid-yk3h76bc>Chat with your AI Coach</div> <div class="ai-chat-sub" data-astro-cid-yk3h76bc>Day ', " \xB7 ", "-day streak \xB7 ", " XP \xB7 Level ", '</div> </div> </div> <div style="display:flex;gap:.4rem;" data-astro-cid-yk3h76bc> <button class="ai-hbtn" id="clearBtn" data-astro-cid-yk3h76bc>', ' Clear chat</button> </div> </div> <!-- Messages --> <div class="ai-messages" id="aiMessages" data-astro-cid-yk3h76bc> <!-- Welcome --> <div class="ai-msg bot ai-welcome" data-astro-cid-yk3h76bc> <div class="ai-msg-avatar" data-astro-cid-yk3h76bc>', '</div> <div class="ai-msg-bubble" data-astro-cid-yk3h76bc>\nHey <strong data-astro-cid-yk3h76bc>', "</strong>! I'm your personal Keto AI Coach \u2014 I have full access to your journey data.<br data-astro-cid-yk3h76bc><br data-astro-cid-yk3h76bc>\nYou're on <strong data-astro-cid-yk3h76bc>Day ", "</strong> with a <strong data-astro-cid-yk3h76bc>", "-day streak</strong> and <strong data-astro-cid-yk3h76bc>", " XP</strong> at <strong data-astro-cid-yk3h76bc>Level ", "</strong>.\n", ' <br data-astro-cid-yk3h76bc><br data-astro-cid-yk3h76bc> <span style="opacity:.7;font-size:.75rem;" data-astro-cid-yk3h76bc>', " Send a food photo for instant macro analysis \xB7 Send a fridge photo for recipe ideas \xB7 Ask me anything about keto!</span> </div> </div> <!-- Pre-rendered history --> ", ' </div> <!-- Image preview --> <div class="ai-img-preview" id="aiImgPreview" data-astro-cid-yk3h76bc> <img id="aiImgThumb" src="" alt="" data-astro-cid-yk3h76bc> <div class="ai-img-preview-info" data-astro-cid-yk3h76bc>Image ready to send<br data-astro-cid-yk3h76bc><span style="font-size:.65rem;opacity:.6;" data-astro-cid-yk3h76bc>Tap send or add a message</span></div> <button class="ai-img-remove" id="aiImgRemove" data-astro-cid-yk3h76bc>\xD7</button> </div> <!-- Input --> <div class="ai-input-area" data-astro-cid-yk3h76bc> <div class="ai-input-row" data-astro-cid-yk3h76bc> <label class="ai-img-btn" for="aiImgInput" title="Send a food photo" data-astro-cid-yk3h76bc> ', ` <input type="file" id="aiImgInput" accept="image/*" style="display:none;" data-astro-cid-yk3h76bc> </label> <textarea class="ai-input" id="aiInput" placeholder="Ask me anything \u2014 recipes, progress, symptoms, meal ideas\u2026" rows="1" data-astro-cid-yk3h76bc></textarea> <button class="ai-send" id="aiSend" data-astro-cid-yk3h76bc> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-yk3h76bc> <line x1="22" y1="2" x2="11" y2="13" data-astro-cid-yk3h76bc></line><polygon points="22 2 15 22 11 13 2 9 22 2" data-astro-cid-yk3h76bc></polygon> </svg> </button> </div> <div class="ai-input-hint" data-astro-cid-yk3h76bc>Enter to send \xB7 Shift+Enter for new line \xB7 Powered by Gemini 1.5</div> </div> </main> </div> <script>
// \u2500\u2500 Markdown renderer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function md(raw) {
  if (!raw) return '';
  var s = raw;
  // Preserve code blocks
  var codeBlocks = [];
  s = s.replace(/\`\`\`[\\w]*\\n?([\\s\\S]*?)\`\`\`/g, function(_, code) {
    var i = codeBlocks.length;
    codeBlocks.push(code.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    return '\\x00CB'+i+'\\x00';
  });
  // Inline code
  var inlineCodes = [];
  s = s.replace(/\`([^\`\\n]+)\`/g, function(_, code) {
    var i = inlineCodes.length;
    inlineCodes.push(code.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    return '\\x00IC'+i+'\\x00';
  });
  // Bold italic
  s = s.replace(/\\*\\*\\*(.+?)\\*\\*\\*/g, '<strong><em>$1</em></strong>');
  // Bold
  s = s.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
  // Italic
  s = s.replace(/\\*([^\\*\\n]+?)\\*/g, '<em>$1</em>');
  // Headings
  s = s.replace(/^### (.+)$/gm, '<div class="ai-h3">$1</div>');
  s = s.replace(/^## (.+)$/gm,  '<div class="ai-h2">$1</div>');
  // Numbered list
  s = s.replace(/^(\\d+)\\. (.+)$/gm, '<div class="ai-li-num"><span class="ai-num">$1.</span> $2</div>');
  // Bullet list
  s = s.replace(/^[-*\u2022] (.+)$/gm, '<div class="ai-li">$1</div>');
  // Avocado rating
  s = s.replace(/(\u{1F951}+)\\/5/g, '<span class="ai-avocado">$1</span>/5');
  // Line breaks
  s = s.replace(/\\n\\n/g, '<br/><br/>');
  s = s.replace(/\\n/g, '<br/>');
  // Restore code blocks
  codeBlocks.forEach(function(code, i) {
    s = s.replace('\\x00CB'+i+'\\x00', '<pre><code>'+code+'</code></pre>');
  });
  inlineCodes.forEach(function(code, i) {
    s = s.replace('\\x00IC'+i+'\\x00', '<code>'+code+'</code>');
  });
  return s;
}

// Render pre-rendered history bot messages
document.querySelectorAll('.ai-msg.bot .ai-msg-bubble[data-raw]').forEach(function(el) {
  var raw = el.getAttribute('data-raw');
  if (raw) el.innerHTML = md(raw);
  el.removeAttribute('data-raw');
});

// \u2500\u2500 Elements \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var messages = document.getElementById('aiMessages');
var input    = document.getElementById('aiInput');
var sendBtn  = document.getElementById('aiSend');
var imgInput = document.getElementById('aiImgInput');
var imgPrev  = document.getElementById('aiImgPreview');
var imgThumb = document.getElementById('aiImgThumb');
var imgRem   = document.getElementById('aiImgRemove');
var clearBtn = document.getElementById('clearBtn');

var pendingImg = null;
var isLoading  = false;

// Auto-scroll to bottom on load
scrollBottom();

// \u2500\u2500 Suggestions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
document.querySelectorAll('.ai-sug-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var msg = btn.getAttribute('data-msg');
    if (msg && input) {
      input.value = msg;
      autoResize();
      sendMsg();
    }
  });
});

// \u2500\u2500 Image handling \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
imgInput.addEventListener('change', function() {
  var file = this.files && this.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) { alert('Max image size: 4MB'); return; }
  var reader = new FileReader();
  reader.onload = function(ev) {
    var result = ev.target.result;
    var base64 = result.split(',')[1];
    pendingImg = { base64: base64, type: file.type };
    imgThumb.src = result;
    imgPrev.classList.add('show');
  };
  reader.readAsDataURL(file);
});

imgRem.addEventListener('click', clearImage);
function clearImage() {
  pendingImg = null;
  imgInput.value = '';
  imgPrev.classList.remove('show');
  imgThumb.src = '';
}

// \u2500\u2500 Clear chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
clearBtn.addEventListener('click', function() {
  if (!confirm('Clear all chat history?')) return;
  fetch('/api/chat/history', { method: 'DELETE' }).then(function() {
    messages.innerHTML = '';
    addWelcome();
  });
});

function addWelcome() {
  var w = document.createElement('div');
  w.className = 'ai-msg bot ai-welcome';
  w.innerHTML = '<div class="ai-msg-avatar">\u{1F916}</div><div class="ai-msg-bubble"><strong>Chat cleared!</strong> Ready for a fresh start. Ask me anything \u{1F4AA}</div>';
  messages.appendChild(w);
  scrollBottom();
}

// \u2500\u2500 Send \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
sendBtn.addEventListener('click', sendMsg);
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});

// Auto-resize textarea
input.addEventListener('input', autoResize);
function autoResize() {
  input.style.height = '40px';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

async function sendMsg() {
  var text = input.value.trim();
  if ((!text && !pendingImg) || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;

  // User bubble
  if (pendingImg) {
    addBubble('<img src="data:' + pendingImg.type + ';base64,' + pendingImg.base64 + '" style="max-width:200px;border-radius:10px;margin-bottom:.3rem;display:block;"/>' + (text ? escHtml(text) : '\u{1F4F8} Image sent'), 'user', true);
  } else {
    addBubble(escHtml(text), 'user', true);
  }

  input.value = '';
  input.style.height = '40px';

  var typing = addTyping();

  try {
    var res = await fetch('/api/chat/gemini', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: text || '', imageBase64: pendingImg ? pendingImg.base64 : null, imageType: pendingImg ? pendingImg.type : null }),
    });

    typing.remove();

    var data = await res.json();
    if (!res.ok || data.error) {
      addBubble('\u274C ' + (data.error || 'Something went wrong. Please try again.'), 'bot', true);
    } else {
      var bubble = addBubble('', 'bot', true);
      bubble.querySelector('.ai-msg-bubble').innerHTML = md(data.reply);
    }
  } catch (e) {
    typing.remove();
    addBubble('\u274C Connection error. Please check your network and try again.', 'bot', true);
  }

  clearImage();
  isLoading = false;
  sendBtn.disabled = false;
  input.focus();
}

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function addBubble(htmlContent, role, scroll) {
  var wrap   = document.createElement('div');
  wrap.className = 'ai-msg ' + role;
  var avatar = document.createElement('div');
  avatar.className = 'ai-msg-avatar';
  avatar.textContent = role === 'user' ? '\u{1F464}' : '\u{1F916}';
  var bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble';
  bubble.innerHTML = htmlContent;
  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  if (scroll) scrollBottom();
  return wrap;
}

function addTyping() {
  var wrap = document.createElement('div');
  wrap.className = 'ai-msg bot';
  wrap.innerHTML = '<div class="ai-msg-avatar">\u{1F916}</div><div class="ai-msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
  messages.appendChild(wrap);
  scrollBottom();
  return wrap;
}

function scrollBottom() {
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// \u2500\u2500 History scroll \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.scrollToDate = function(date) {
  var msgs = messages.querySelectorAll('.ai-msg[data-date]');
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].getAttribute('data-date') === date) {
      msgs[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
};
<\/script> </body> </html>`], [`<html lang="en" data-astro-cid-yk3h76bc> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Coach \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-yk3h76bc> ", ' <div class="ai-layout" data-astro-cid-yk3h76bc> <!-- \u2500\u2500 SIDEBAR \u2500\u2500 --> <aside class="ai-sidebar" data-astro-cid-yk3h76bc> <!-- Coach info --> <div class="ai-coach-card" data-astro-cid-yk3h76bc> <div class="ai-coach-top" data-astro-cid-yk3h76bc> <div class="ai-coach-avatar" data-astro-cid-yk3h76bc> ', ' <div class="ai-coach-dot" data-astro-cid-yk3h76bc></div> </div> <div data-astro-cid-yk3h76bc> <div class="ai-coach-name" data-astro-cid-yk3h76bc>Keto AI Coach</div> <div class="ai-coach-sub" data-astro-cid-yk3h76bc>\u2726 Elite Exclusive</div> </div> </div> <div class="ai-user-chip" data-astro-cid-yk3h76bc> <div class="ai-user-avatar" data-astro-cid-yk3h76bc>', '</div> <div class="ai-user-info" data-astro-cid-yk3h76bc> <div class="ai-user-name" data-astro-cid-yk3h76bc>', '</div> <div class="ai-user-meta" data-astro-cid-yk3h76bc>Day ', " \xB7 Week ", " \xB7 Lv.", '</div> </div> </div> </div> <!-- Journey stats --> <div class="ai-stats-block" data-astro-cid-yk3h76bc> <div class="ai-stats-title" data-astro-cid-yk3h76bc>', ' Journey Stats</div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Streak</span> <span class="ai-stat-val" style="color:var(--gold)" data-astro-cid-yk3h76bc>', ' days</span> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' XP</span> <span class="ai-stat-val" style="color:var(--purple)" data-astro-cid-yk3h76bc>', "</span> </div> ", " ", " ", ` </div> <!-- Today's status --> <div class="ai-today-block" data-astro-cid-yk3h76bc> <div class="ai-stats-title" data-astro-cid-yk3h76bc>`, ' Today</div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Tasks</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', "/", '</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', ' data-astro-cid-yk3h76bc></div> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Meals</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', "/", '</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', ' data-astro-cid-yk3h76bc></div> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>', ' Water</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>', '/8 gl</span> </div> <div class="ai-mini-bar" style="margin-bottom:.55rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"', " data-astro-cid-yk3h76bc></div> </div> ", " ", " </div> <!-- Chat History panel --> ", ' <!-- Dynamic suggestions --> <div class="ai-sug-block" data-astro-cid-yk3h76bc> <div class="ai-sug-title" data-astro-cid-yk3h76bc>', " Ask me</div> ", " ", " ", " ", " ", " ", " ", " ", " ", ' <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", ' Full progress review</button> <button class="ai-sug-btn" data-msg="What are the best keto foods to improve fat burning and stay in deep ketosis?" data-astro-cid-yk3h76bc>', ' Maximize fat burn</button> <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", " Hit protein goal</button> ", ' <button class="ai-sug-btn"', " data-astro-cid-yk3h76bc>", " Day ", ' tip</button> </div> </aside> <!-- \u2500\u2500 MAIN CHAT \u2500\u2500 --> <main class="ai-main" data-astro-cid-yk3h76bc> <!-- Chat header --> <div class="ai-chat-header" data-astro-cid-yk3h76bc> <div class="ai-chat-header-left" data-astro-cid-yk3h76bc> <div style="width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);flex-shrink:0;" data-astro-cid-yk3h76bc></div> <div data-astro-cid-yk3h76bc> <div class="ai-chat-title" data-astro-cid-yk3h76bc>Chat with your AI Coach</div> <div class="ai-chat-sub" data-astro-cid-yk3h76bc>Day ', " \xB7 ", "-day streak \xB7 ", " XP \xB7 Level ", '</div> </div> </div> <div style="display:flex;gap:.4rem;" data-astro-cid-yk3h76bc> <button class="ai-hbtn" id="clearBtn" data-astro-cid-yk3h76bc>', ' Clear chat</button> </div> </div> <!-- Messages --> <div class="ai-messages" id="aiMessages" data-astro-cid-yk3h76bc> <!-- Welcome --> <div class="ai-msg bot ai-welcome" data-astro-cid-yk3h76bc> <div class="ai-msg-avatar" data-astro-cid-yk3h76bc>', '</div> <div class="ai-msg-bubble" data-astro-cid-yk3h76bc>\nHey <strong data-astro-cid-yk3h76bc>', "</strong>! I'm your personal Keto AI Coach \u2014 I have full access to your journey data.<br data-astro-cid-yk3h76bc><br data-astro-cid-yk3h76bc>\nYou're on <strong data-astro-cid-yk3h76bc>Day ", "</strong> with a <strong data-astro-cid-yk3h76bc>", "-day streak</strong> and <strong data-astro-cid-yk3h76bc>", " XP</strong> at <strong data-astro-cid-yk3h76bc>Level ", "</strong>.\n", ' <br data-astro-cid-yk3h76bc><br data-astro-cid-yk3h76bc> <span style="opacity:.7;font-size:.75rem;" data-astro-cid-yk3h76bc>', " Send a food photo for instant macro analysis \xB7 Send a fridge photo for recipe ideas \xB7 Ask me anything about keto!</span> </div> </div> <!-- Pre-rendered history --> ", ' </div> <!-- Image preview --> <div class="ai-img-preview" id="aiImgPreview" data-astro-cid-yk3h76bc> <img id="aiImgThumb" src="" alt="" data-astro-cid-yk3h76bc> <div class="ai-img-preview-info" data-astro-cid-yk3h76bc>Image ready to send<br data-astro-cid-yk3h76bc><span style="font-size:.65rem;opacity:.6;" data-astro-cid-yk3h76bc>Tap send or add a message</span></div> <button class="ai-img-remove" id="aiImgRemove" data-astro-cid-yk3h76bc>\xD7</button> </div> <!-- Input --> <div class="ai-input-area" data-astro-cid-yk3h76bc> <div class="ai-input-row" data-astro-cid-yk3h76bc> <label class="ai-img-btn" for="aiImgInput" title="Send a food photo" data-astro-cid-yk3h76bc> ', ` <input type="file" id="aiImgInput" accept="image/*" style="display:none;" data-astro-cid-yk3h76bc> </label> <textarea class="ai-input" id="aiInput" placeholder="Ask me anything \u2014 recipes, progress, symptoms, meal ideas\u2026" rows="1" data-astro-cid-yk3h76bc></textarea> <button class="ai-send" id="aiSend" data-astro-cid-yk3h76bc> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-yk3h76bc> <line x1="22" y1="2" x2="11" y2="13" data-astro-cid-yk3h76bc></line><polygon points="22 2 15 22 11 13 2 9 22 2" data-astro-cid-yk3h76bc></polygon> </svg> </button> </div> <div class="ai-input-hint" data-astro-cid-yk3h76bc>Enter to send \xB7 Shift+Enter for new line \xB7 Powered by Gemini 1.5</div> </div> </main> </div> <script>
// \u2500\u2500 Markdown renderer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function md(raw) {
  if (!raw) return '';
  var s = raw;
  // Preserve code blocks
  var codeBlocks = [];
  s = s.replace(/\\\`\\\`\\\`[\\\\w]*\\\\n?([\\\\s\\\\S]*?)\\\`\\\`\\\`/g, function(_, code) {
    var i = codeBlocks.length;
    codeBlocks.push(code.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    return '\\\\x00CB'+i+'\\\\x00';
  });
  // Inline code
  var inlineCodes = [];
  s = s.replace(/\\\`([^\\\`\\\\n]+)\\\`/g, function(_, code) {
    var i = inlineCodes.length;
    inlineCodes.push(code.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    return '\\\\x00IC'+i+'\\\\x00';
  });
  // Bold italic
  s = s.replace(/\\\\*\\\\*\\\\*(.+?)\\\\*\\\\*\\\\*/g, '<strong><em>$1</em></strong>');
  // Bold
  s = s.replace(/\\\\*\\\\*(.+?)\\\\*\\\\*/g, '<strong>$1</strong>');
  // Italic
  s = s.replace(/\\\\*([^\\\\*\\\\n]+?)\\\\*/g, '<em>$1</em>');
  // Headings
  s = s.replace(/^### (.+)$/gm, '<div class="ai-h3">$1</div>');
  s = s.replace(/^## (.+)$/gm,  '<div class="ai-h2">$1</div>');
  // Numbered list
  s = s.replace(/^(\\\\d+)\\\\. (.+)$/gm, '<div class="ai-li-num"><span class="ai-num">$1.</span> $2</div>');
  // Bullet list
  s = s.replace(/^[-*\u2022] (.+)$/gm, '<div class="ai-li">$1</div>');
  // Avocado rating
  s = s.replace(/(\u{1F951}+)\\\\/5/g, '<span class="ai-avocado">$1</span>/5');
  // Line breaks
  s = s.replace(/\\\\n\\\\n/g, '<br/><br/>');
  s = s.replace(/\\\\n/g, '<br/>');
  // Restore code blocks
  codeBlocks.forEach(function(code, i) {
    s = s.replace('\\\\x00CB'+i+'\\\\x00', '<pre><code>'+code+'</code></pre>');
  });
  inlineCodes.forEach(function(code, i) {
    s = s.replace('\\\\x00IC'+i+'\\\\x00', '<code>'+code+'</code>');
  });
  return s;
}

// Render pre-rendered history bot messages
document.querySelectorAll('.ai-msg.bot .ai-msg-bubble[data-raw]').forEach(function(el) {
  var raw = el.getAttribute('data-raw');
  if (raw) el.innerHTML = md(raw);
  el.removeAttribute('data-raw');
});

// \u2500\u2500 Elements \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var messages = document.getElementById('aiMessages');
var input    = document.getElementById('aiInput');
var sendBtn  = document.getElementById('aiSend');
var imgInput = document.getElementById('aiImgInput');
var imgPrev  = document.getElementById('aiImgPreview');
var imgThumb = document.getElementById('aiImgThumb');
var imgRem   = document.getElementById('aiImgRemove');
var clearBtn = document.getElementById('clearBtn');

var pendingImg = null;
var isLoading  = false;

// Auto-scroll to bottom on load
scrollBottom();

// \u2500\u2500 Suggestions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
document.querySelectorAll('.ai-sug-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var msg = btn.getAttribute('data-msg');
    if (msg && input) {
      input.value = msg;
      autoResize();
      sendMsg();
    }
  });
});

// \u2500\u2500 Image handling \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
imgInput.addEventListener('change', function() {
  var file = this.files && this.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) { alert('Max image size: 4MB'); return; }
  var reader = new FileReader();
  reader.onload = function(ev) {
    var result = ev.target.result;
    var base64 = result.split(',')[1];
    pendingImg = { base64: base64, type: file.type };
    imgThumb.src = result;
    imgPrev.classList.add('show');
  };
  reader.readAsDataURL(file);
});

imgRem.addEventListener('click', clearImage);
function clearImage() {
  pendingImg = null;
  imgInput.value = '';
  imgPrev.classList.remove('show');
  imgThumb.src = '';
}

// \u2500\u2500 Clear chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
clearBtn.addEventListener('click', function() {
  if (!confirm('Clear all chat history?')) return;
  fetch('/api/chat/history', { method: 'DELETE' }).then(function() {
    messages.innerHTML = '';
    addWelcome();
  });
});

function addWelcome() {
  var w = document.createElement('div');
  w.className = 'ai-msg bot ai-welcome';
  w.innerHTML = '<div class="ai-msg-avatar">\u{1F916}</div><div class="ai-msg-bubble"><strong>Chat cleared!</strong> Ready for a fresh start. Ask me anything \u{1F4AA}</div>';
  messages.appendChild(w);
  scrollBottom();
}

// \u2500\u2500 Send \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
sendBtn.addEventListener('click', sendMsg);
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});

// Auto-resize textarea
input.addEventListener('input', autoResize);
function autoResize() {
  input.style.height = '40px';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

async function sendMsg() {
  var text = input.value.trim();
  if ((!text && !pendingImg) || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;

  // User bubble
  if (pendingImg) {
    addBubble('<img src="data:' + pendingImg.type + ';base64,' + pendingImg.base64 + '" style="max-width:200px;border-radius:10px;margin-bottom:.3rem;display:block;"/>' + (text ? escHtml(text) : '\u{1F4F8} Image sent'), 'user', true);
  } else {
    addBubble(escHtml(text), 'user', true);
  }

  input.value = '';
  input.style.height = '40px';

  var typing = addTyping();

  try {
    var res = await fetch('/api/chat/gemini', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: text || '', imageBase64: pendingImg ? pendingImg.base64 : null, imageType: pendingImg ? pendingImg.type : null }),
    });

    typing.remove();

    var data = await res.json();
    if (!res.ok || data.error) {
      addBubble('\u274C ' + (data.error || 'Something went wrong. Please try again.'), 'bot', true);
    } else {
      var bubble = addBubble('', 'bot', true);
      bubble.querySelector('.ai-msg-bubble').innerHTML = md(data.reply);
    }
  } catch (e) {
    typing.remove();
    addBubble('\u274C Connection error. Please check your network and try again.', 'bot', true);
  }

  clearImage();
  isLoading = false;
  sendBtn.disabled = false;
  input.focus();
}

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function addBubble(htmlContent, role, scroll) {
  var wrap   = document.createElement('div');
  wrap.className = 'ai-msg ' + role;
  var avatar = document.createElement('div');
  avatar.className = 'ai-msg-avatar';
  avatar.textContent = role === 'user' ? '\u{1F464}' : '\u{1F916}';
  var bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble';
  bubble.innerHTML = htmlContent;
  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  if (scroll) scrollBottom();
  return wrap;
}

function addTyping() {
  var wrap = document.createElement('div');
  wrap.className = 'ai-msg bot';
  wrap.innerHTML = '<div class="ai-msg-avatar">\u{1F916}</div><div class="ai-msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
  messages.appendChild(wrap);
  scrollBottom();
  return wrap;
}

function scrollBottom() {
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// \u2500\u2500 History scroll \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.scrollToDate = function(date) {
  var msgs = messages.querySelectorAll('.ai-msg[data-date]');
  for (var i = 0; i < msgs.length; i++) {
    if (msgs[i].getAttribute('data-date') === date) {
      msgs[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
};
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "ai-coach", "data-astro-cid-yk3h76bc": true }), renderComponent($$result, "Bot", $$Bot, { "size": 22, "data-astro-cid-yk3h76bc": true }), userName.charAt(0).toUpperCase(), profile.full_name || userName, currentDay, weekNum, level, renderComponent($$result, "BarChart2", $$BarChart2, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), renderComponent($$result, "Flame", $$Flame, { "size": 13, "data-astro-cid-yk3h76bc": true }), streak, renderComponent($$result, "Star", $$Star, { "size": 13, "data-astro-cid-yk3h76bc": true }), totalXp, weightLost > 0 && renderTemplate`<div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>${renderComponent($$result, "TrendingDown", $$TrendingDown, { "size": 13, "data-astro-cid-yk3h76bc": true })} Lost</span> <span class="ai-stat-val" style="color:var(--green)" data-astro-cid-yk3h76bc>-${weightLost.toFixed(1)}kg</span> </div>`, latestWeight > 0 && renderTemplate`<div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>${renderComponent($$result, "Target", $$Target, { "size": 13, "data-astro-cid-yk3h76bc": true })} Current</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>${latestWeight}kg</span> </div>`, goalPct > 0 && renderTemplate`<div style="margin-top:.5rem;" data-astro-cid-yk3h76bc> <div style="display:flex;justify-content:space-between;font-size:.67rem;color:var(--soft);margin-bottom:.25rem;" data-astro-cid-yk3h76bc> <span data-astro-cid-yk3h76bc>Goal progress</span> <span style="color:var(--green);font-weight:800;" data-astro-cid-yk3h76bc>${goalPct}%</span> </div> <div class="ai-mini-bar" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"${addAttribute(`width:${goalPct}%;background:linear-gradient(90deg,var(--green),var(--green2));`, "style")} data-astro-cid-yk3h76bc></div> </div> </div>`, renderComponent($$result, "Calendar", $$Calendar, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 13, "data-astro-cid-yk3h76bc": true }), completedTasksCount, todayTasks.length, addAttribute(`width:${taskPct}%;background:linear-gradient(90deg,#3b82f6,#60a5fa);`, "style"), renderComponent($$result, "Utensils", $$Utensils, { "size": 13, "data-astro-cid-yk3h76bc": true }), eatenCount, totalMeals, addAttribute(`width:${mealPct}%;background:linear-gradient(90deg,var(--green),var(--green2));`, "style"), renderComponent($$result, "Droplets", $$Droplets, { "size": 13, "data-astro-cid-yk3h76bc": true }), waterCount, addAttribute(`width:${waterPct}%;background:linear-gradient(90deg,#06b6d4,#22d3ee);`, "style"), macroGoals && renderTemplate`<div data-astro-cid-yk3h76bc> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>${renderComponent($$result, "Flame", $$Flame, { "size": 13, "data-astro-cid-yk3h76bc": true })} Calories</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>${Math.round(consumed.cal)}/${macroGoals.daily_calories}</span> </div> <div class="ai-mini-bar" style="margin-bottom:.3rem;" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"${addAttribute(`width:${calPct}%;background:linear-gradient(90deg,var(--gold),#fbbf24);`, "style")} data-astro-cid-yk3h76bc></div> </div> <div class="ai-stat-row" data-astro-cid-yk3h76bc> <span class="ai-stat-label" data-astro-cid-yk3h76bc>${renderComponent($$result, "Zap", $$Zap, { "size": 13, "data-astro-cid-yk3h76bc": true })} Protein</span> <span class="ai-stat-val" data-astro-cid-yk3h76bc>${Math.round(consumed.prot)}g/${macroGoals.protein_g}g</span> </div> <div class="ai-mini-bar" data-astro-cid-yk3h76bc> <div class="ai-mini-fill"${addAttribute(`width:${protPct}%;background:linear-gradient(90deg,var(--purple),#a78bfa);`, "style")} data-astro-cid-yk3h76bc></div> </div> </div>`, fastingActive && renderTemplate`<div style="margin-top:.65rem;padding:.5rem .65rem;border-radius:10px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);font-size:.72rem;color:#a78bfa;font-weight:700;" data-astro-cid-yk3h76bc> ${renderComponent($$result, "Timer", $$Timer, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Fasting: ${fastHours}h active
</div>`, historyDates.length > 0 && renderTemplate`<div class="ai-stats-block" data-astro-cid-yk3h76bc> <div class="ai-stats-title" style="display:flex;align-items:center;justify-content:space-between;" data-astro-cid-yk3h76bc> ${renderComponent($$result, "MessageCircle", $$MessageCircle, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Chat History
<span style="color:var(--soft);font-size:.6rem;font-weight:600;" data-astro-cid-yk3h76bc>${chatHistory.length} messages</span> </div> <div style="display:flex;flex-direction:column;gap:.25rem;" data-astro-cid-yk3h76bc> ${historyDates.map((d) => {
    const label = (/* @__PURE__ */ new Date(d.date + "T12:00:00")).toLocaleDateString("en", { month: "short", day: "numeric" });
    const firstUser = d.msgs.find((m) => m.role === "user");
    const preview = firstUser ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? "\u2026" : "") : "";
    const userCount = d.msgs.filter((m) => m.role === "user").length;
    return renderTemplate`<button${addAttribute(`window.scrollToDate('${d.date}')`, "onclick")} style="text-align:left;background:var(--card2);border:1px solid var(--border);border-radius:9px;padding:.45rem .65rem;cursor:pointer;transition:all .18s;width:100%;" onmouseover="this.style.borderColor='rgba(16,185,129,.3)'" onmouseout="this.style.borderColor='var(--border)'" data-astro-cid-yk3h76bc> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.12rem;" data-astro-cid-yk3h76bc> <span style="font-size:.72rem;font-weight:800;color:var(--green);" data-astro-cid-yk3h76bc>${label}</span> <span style="font-size:.6rem;color:var(--soft);" data-astro-cid-yk3h76bc>${userCount} msg${userCount !== 1 ? "s" : ""}</span> </div> ${preview && renderTemplate`<div style="font-size:.65rem;color:var(--soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" data-astro-cid-yk3h76bc>${preview}</div>`} </button>`;
  })} </div> </div>`, renderComponent($$result, "Brain", $$Brain, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), !todayCheckin && renderTemplate`<button class="ai-sug-btn" data-msg="I haven't done my check-in yet. What should I focus on today based on my journey?" data-astro-cid-yk3h76bc>${renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Today's priorities</button>`, fastingActive && renderTemplate`<button class="ai-sug-btn"${addAttribute(`I've been fasting for ${fastHours} hours. Any tips to stay strong and break my fast correctly?`, "data-msg")} data-astro-cid-yk3h76bc>${renderComponent($$result, "Timer", $$Timer, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Fasting ${fastHours}h — tips</button>`, todayCheckin?.energy_level <= 2 && renderTemplate`<button class="ai-sug-btn" data-msg="My energy is very low today. What can I do to boost it on keto?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Zap", $$Zap, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Low energy fix</button>`, showLowWater && renderTemplate`<button class="ai-sug-btn" data-msg="I've only had a few glasses of water today. How important is hydration on keto and how do I drink more?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Droplets", $$Droplets, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Hydration help</button>`, todayCheckin?.had_headache && renderTemplate`<button class="ai-sug-btn" data-msg="I have a keto headache today. What are the best immediate remedies?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Brain", $$Brain, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Keto headache fix</button>`, showBreakfast && renderTemplate`<button class="ai-sug-btn" data-msg="What's a quick high-protein keto breakfast I can make in under 10 minutes?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Utensils", $$Utensils, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Quick keto breakfast</button>`, showLunch && renderTemplate`<button class="ai-sug-btn" data-msg="Suggest a keto lunch that's filling, easy to make, and keeps me in ketosis." data-astro-cid-yk3h76bc>${renderComponent($$result, "Utensils", $$Utensils, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Keto lunch ideas</button>`, showSnack && renderTemplate`<button class="ai-sug-btn" data-msg="What keto snacks can I have right now to avoid afternoon cravings?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Sparkles", $$Sparkles, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Afternoon snack ideas</button>`, nowHour >= 19 && renderTemplate`<button class="ai-sug-btn" data-msg="What's a satisfying and easy keto dinner I can cook tonight?" data-astro-cid-yk3h76bc>${renderComponent($$result, "Utensils", $$Utensils, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} Tonight's keto dinner</button>`, addAttribute(`I'm on Day ${currentDay} of my keto journey. Give me an honest assessment of how I'm doing and what to improve.`, "data-msg"), renderComponent($$result, "BarChart2", $$BarChart2, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), renderComponent($$result, "Flame", $$Flame, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), addAttribute(`I have ${Math.max(0, (macroGoals?.protein_g || 130) - Math.round(consumed.prot))}g protein left to hit my goal today. What foods should I eat?`, "data-msg"), renderComponent($$result, "Target", $$Target, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), restrictions.includes("no_pork") && renderTemplate`<button class="ai-sug-btn" data-msg="Give me a high-protein keto meal with no pork — chicken or beef based." data-astro-cid-yk3h76bc>${renderComponent($$result, "Utensils", $$Utensils, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true })} No-pork keto meal</button>`, addAttribute(`Give me the best single keto tip specifically for someone on Day ${currentDay} of their journey.`, "data-msg"), renderComponent($$result, "Sparkles", $$Sparkles, { "size": 13, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), currentDay, currentDay, streak, totalXp, level, renderComponent($$result, "Trash2", $$Trash2, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-yk3h76bc": true }), renderComponent($$result, "Bot", $$Bot, { "size": 18, "data-astro-cid-yk3h76bc": true }), userName, currentDay, streak, totalXp, level, weightLost > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-yk3h76bc": true }, { "default": async ($$result2) => renderTemplate` You've lost <strong data-astro-cid-yk3h76bc>${weightLost.toFixed(1)}kg</strong> — keep going! ${renderComponent($$result2, "Flame", $$Flame, { "size": 14, "style": "vertical-align:middle;", "data-astro-cid-yk3h76bc": true })}` })}`, renderComponent($$result, "Camera", $$Camera, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-yk3h76bc": true }), chatHistory.map((msg) => renderTemplate`<div${addAttribute(`ai-msg ${msg.role === "user" ? "user" : "bot"}`, "class")}${addAttribute(msg.created_at ? msg.created_at.split("T")[0] : "", "data-date")} data-astro-cid-yk3h76bc> <div class="ai-msg-avatar" data-astro-cid-yk3h76bc>${msg.role === "user" ? renderTemplate`${renderComponent($$result, "User", $$User, { "size": 16, "data-astro-cid-yk3h76bc": true })}` : renderTemplate`${renderComponent($$result, "Bot", $$Bot, { "size": 16, "data-astro-cid-yk3h76bc": true })}`}</div> <div class="ai-msg-bubble"${addAttribute(msg.role === "assistant" ? msg.content : void 0, "data-raw")} data-astro-cid-yk3h76bc> ${msg.role === "user" ? msg.content : ""} </div> </div>`), renderComponent($$result, "Camera", $$Camera, { "size": 18, "data-astro-cid-yk3h76bc": true }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/ai-coach.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/ai-coach.astro";
const $$url = "/dashboard/ai-coach";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$AiCoach,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
