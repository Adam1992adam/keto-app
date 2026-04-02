/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { b as $$Home, d as $$Moon, c as $$Activity, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$, a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$BarChart3 } from '../../chunks/BarChart3_BX3FTjqm.mjs';
import { $ as $$AlertTriangle } from '../../chunks/AlertTriangle_CZmKUJtJ.mjs';
import { $ as $$BookOpen } from '../../chunks/BookOpen_CQB9IXtW.mjs';
import { $ as $$Star } from '../../chunks/Star_D1SG2E9R.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Edit3 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Edit3;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "pen-line", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M13 21h8"></path> <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Edit3.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Checkin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Checkin;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const journey = await getUserJourney(user.id);
  const currentDay = journey?.current_day || 1;
  const isFirstWeek = currentDay <= 7;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { data: existingCheckin } = await supabase.from("daily_checkins").select("*").eq("user_id", user.id).eq("checkin_date", today).maybeSingle();
  const { data: macroGoals } = await supabase.from("macro_goals").select("*").eq("user_id", user.id).maybeSingle();
  const { data: onboarding } = await supabase.from("onboarding_data").select("fasting_protocol, goal, feature_electrolytes").eq("user_id", user.id).maybeSingle();
  const { data: recentCheckins } = await supabase.from("daily_checkins").select("checkin_date, energy_level, mood_level, followed_meals").eq("user_id", user.id).order("checkin_date", { ascending: false }).limit(7);
  const userName = profile.full_name?.split(" ")[0] || "there";
  const fastingProtocol = onboarding?.fasting_protocol || "none";
  const hasFasting = fastingProtocol !== "none";
  const alreadyDone = !!existingCheckin;
  const prefill = {
    energy: existingCheckin?.energy_level || 3,
    mood: existingCheckin?.mood_level || 3,
    hunger: existingCheckin?.hunger_level || 3,
    water: existingCheckin?.water_glasses || 0,
    brain_fog: existingCheckin?.brain_fog || false,
    had_headache: existingCheckin?.had_headache || false,
    had_fatigue: existingCheckin?.had_fatigue || false,
    had_cravings: existingCheckin?.had_cravings || false,
    followed_meals: existingCheckin?.followed_meals ?? true,
    fasted_today: existingCheckin?.fasted_today || false,
    sleep_hours: existingCheckin?.sleep_hours || null,
    sleep_quality: existingCheckin?.sleep_quality || null,
    note: existingCheckin?.note || ""
  };
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  recentCheckins?.length || 0;
  recentCheckins?.slice(0, 3).reduce((s, c) => s + (c.energy_level || 3), 0) / Math.min(3, recentCheckins?.length || 1) || 3;
  const energyEmojis = ["\u{1F634}", "\u{1F614}", "\u{1F610}", "\u{1F60A}", "\u{1F680}"];
  const moodEmojis = ["\u{1F61E}", "\u{1F615}", "\u{1F610}", "\u{1F642}", "\u{1F604}"];
  const hungerEmojis = ["\u2705", "\u{1F642}", "\u{1F610}", "\u{1F37D}\uFE0F", "\u{1F37D}\uFE0F"];
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-kuyasrws> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daily Check-in \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ const t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();
  <\/script>`, '</head> <body data-astro-cid-kuyasrws> <div class="bg-wrap" data-astro-cid-kuyasrws><div class="orb o1" data-astro-cid-kuyasrws></div><div class="orb o2" data-astro-cid-kuyasrws></div><div class="orb o3" data-astro-cid-kuyasrws></div></div> <!-- NAV --> ', ' <!-- PAGE --> <div class="page" data-astro-cid-kuyasrws>  ', '  <div class="ci-hero" data-astro-cid-kuyasrws> <div class="ci-hero-top" data-astro-cid-kuyasrws> <div data-astro-cid-kuyasrws> <h1 class="ci-hero-title" data-astro-cid-kuyasrws>', ' <em data-astro-cid-kuyasrws>Check-in</em></h1> <p class="ci-hero-sub" data-astro-cid-kuyasrws>', '</p> </div> <div class="ci-badges" data-astro-cid-kuyasrws> <span class="ci-badge-day" data-astro-cid-kuyasrws>', " Day ", "</span> ", " ", ' </div> </div>  <div class="ci-steps" id="ciSteps" data-astro-cid-kuyasrws> <div class="ci-step active" data-step="0" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-0" data-astro-cid-kuyasrws>1</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Energy</span> </div> <div class="ci-step" data-step="1" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-1" data-astro-cid-kuyasrws>2</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Mood</span> </div> <div class="ci-step" data-step="2" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-2" data-astro-cid-kuyasrws>3</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Body</span> </div> <div class="ci-step" data-step="3" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-3" data-astro-cid-kuyasrws>4</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Meals</span> </div> <div class="ci-step" data-step="4" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-4" data-astro-cid-kuyasrws>5</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Submit</span> </div> </div> </div>  ', '  <div class="slider-section" style="animation-delay:.05s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.25);" data-astro-cid-kuyasrws>', '</div> <div class="sh-title" data-astro-cid-kuyasrws>How do you feel today?</div> <div class="sh-chip" data-astro-cid-kuyasrws>Slide to rate</div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="energyEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Energy Level</div> <div class="slider-sub" data-astro-cid-kuyasrws>How energetic do you feel?</div> </div> </div> <div class="slider-val-badge" id="energyValBadge" style="color:var(--green);" data-astro-cid-kuyasrws>', '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="energySlider" min="1" max="5" step="1"', ` oninput="window.onSlider('energy', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Very Low</span> <span data-astro-cid-kuyasrws>3 = Average</span> <span data-astro-cid-kuyasrws>5 = Excellent</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="moodEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Mood</div> <div class="slider-sub" data-astro-cid-kuyasrws>Mental and emotional state</div> </div> </div> <div class="slider-val-badge" id="moodValBadge" style="color:var(--green);" data-astro-cid-kuyasrws>`, '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="moodSlider" min="1" max="5" step="1"', ` oninput="window.onSlider('mood', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Low</span> <span data-astro-cid-kuyasrws>3 = Neutral</span> <span data-astro-cid-kuyasrws>5 = Great</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="hungerEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Hunger Level</div> <div class="slider-sub" data-astro-cid-kuyasrws>How hungry are you? (5 = very hungry)</div> </div> </div> <div class="slider-val-badge" id="hungerValBadge" style="color:var(--red);" data-astro-cid-kuyasrws>`, '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="hungerSlider" min="1" max="5" step="1"', ` style="accent-color:var(--red);" oninput="window.onSlider('hunger', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Not at all</span> <span data-astro-cid-kuyasrws>3 = Moderate</span> <span data-astro-cid-kuyasrws>5 = Very hungry</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="brainEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Mental Clarity</div> <div class="slider-sub" data-astro-cid-kuyasrws>Focus and brain clarity today</div> </div> </div> <div class="slider-val-badge" id="brainValBadge" style="color:var(--purple);" data-astro-cid-kuyasrws>3</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="brainSlider" min="1" max="5" step="1" value="3" style="accent-color:var(--purple);" oninput="window.onSlider('brain', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Very foggy</span> <span data-astro-cid-kuyasrws>3 = Average</span> <span data-astro-cid-kuyasrws>5 = Crystal clear</span> </div> </div> </div>  `, '  <div class="section" style="animation-delay:.15s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Today's Compliance</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div class="compliance-grid" data-astro-cid-kuyasrws> <div class="comp-card" id="comp-meals" onclick="toggleComp(this,'meals')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F37D}\uFE0F</div> <div class="cc-label" data-astro-cid-kuyasrws>Followed Meals</div> <div class="cc-sub" data-astro-cid-kuyasrws>Ate according to plan</div> </div> <div class="comp-card" id="comp-carbs" onclick="toggleComp(this,'carbs')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F966}</div> <div class="cc-label" data-astro-cid-kuyasrws>Stayed Under Carbs</div> <div class="cc-sub" data-astro-cid-kuyasrws>Kept net carbs low</div> </div> `, ` <div class="comp-card" id="comp-sleep" onclick="toggleComp(this,'sleep')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F634}</div> <div class="cc-label" data-astro-cid-kuyasrws>Good Sleep</div> <div class="cc-sub" data-astro-cid-kuyasrws>7+ hours last night</div> </div> </div> </div> </div>  <div class="section" style="animation-delay:.2s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#06b6d4,#0891b2);box-shadow:0 4px 10px rgba(6,182,212,.25);" data-astro-cid-kuyasrws>`, '</div> <div class="sh-title" data-astro-cid-kuyasrws>Water Intake</div> <div class="sh-chip" style="background:rgba(6,182,212,.1);border-color:rgba(6,182,212,.2);color:var(--cyan);" id="waterChip" data-astro-cid-kuyasrws>0 / 8 glasses</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div class="water-visual-row" data-astro-cid-kuyasrws> <div class="water-glasses-row" id="waterGlasses" data-astro-cid-kuyasrws> ', ' </div> <div class="water-stat" data-astro-cid-kuyasrws> <div class="water-big" id="waterCount" data-astro-cid-kuyasrws>0</div> <div class="water-lbl-sm" data-astro-cid-kuyasrws>glasses</div> <div style="font-size:.62rem;color:var(--soft);margin-top:.2rem;" id="waterLiters" data-astro-cid-kuyasrws>0 oz</div> </div> </div> <div style="margin-top:.875rem;font-size:.75rem;color:var(--soft);line-height:1.5;" data-astro-cid-kuyasrws> ', ' Goal: <strong style="color:var(--cyan);" data-astro-cid-kuyasrws>', "</strong> \u2014 ", ' </div> </div> </div>  <div class="section" style="animation-delay:.25s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 4px 10px rgba(139,92,246,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Electrolytes Today</div> <div class="sh-chip" style="background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.2);color:var(--purple);" data-astro-cid-kuyasrws>Essential</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <p style="font-size:.75rem;color:var(--soft);margin-bottom:1rem;line-height:1.5;" data-astro-cid-kuyasrws>
Tap each one after you've taken it. These prevent keto flu and keep your energy high.
</p> <div class="elec-grid" data-astro-cid-kuyasrws> `, ' </div> </div> </div>  <div class="section" style="animation-delay:.3s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 10px rgba(59,130,246,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Today's Note</div> <div class="sh-chip" style="background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.2);color:var(--blue);" data-astro-cid-kuyasrws>Optional</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <textarea class="note-area" id="noteArea" placeholder="How was your day? Any challenges? What did you eat? Write anything you want to remember..." maxlength="500" data-astro-cid-kuyasrws></textarea> <div style="text-align:right;font-size:.68rem;color:var(--muted);margin-top:.35rem;" id="noteCount" data-astro-cid-kuyasrws>0/500</div> </div> </div>  <div class="section" style="animation-delay:.32s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 10px rgba(99,102,241,.25);" data-astro-cid-kuyasrws>`, `</div> <div class="sh-title" data-astro-cid-kuyasrws>Last Night's Sleep</div> <div class="sh-chip" style="background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.2);color:#a5b4fc;" data-astro-cid-kuyasrws>Optional</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" data-astro-cid-kuyasrws> <div data-astro-cid-kuyasrws> <div style="font-size:.75rem;font-weight:700;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-kuyasrws>Hours Slept</div> <div style="display:flex;align-items:center;gap:.75rem;" data-astro-cid-kuyasrws> <input type="range" id="sleepSlider" min="0" max="12" step="0.5" value="7" style="flex:1;accent-color:#6366f1;" oninput="window.updateSleepHours(this.value)" data-astro-cid-kuyasrws> <span id="sleepHoursDisplay" style="font-size:1rem;font-weight:800;color:#a5b4fc;min-width:2.5rem;text-align:right;" data-astro-cid-kuyasrws>7h</span> </div> </div> <div data-astro-cid-kuyasrws> <div style="font-size:.75rem;font-weight:700;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-kuyasrws>Sleep Quality</div> <div style="display:flex;gap:.4rem;" id="sleepStars" data-astro-cid-kuyasrws> `, ' </div> </div> </div> <div id="sleepMsg" style="margin-top:.75rem;font-size:.75rem;color:var(--soft);padding:.5rem .75rem;background:var(--card2);border-radius:10px;border-left:3px solid #6366f1;" data-astro-cid-kuyasrws>\n7 hours \u2014 Ideal for keto adaptation \u{1F44D}\n</div> </div> </div>  <div class="save-wrap" data-astro-cid-kuyasrws> <div class="save-info" data-astro-cid-kuyasrws> <div class="save-title" data-astro-cid-kuyasrws>Ready to submit?</div> <div class="save-sub" data-astro-cid-kuyasrws>Takes 2 minutes \xB7 builds your streak</div> </div> <button class="btn-save-big" id="saveBtn" onclick="saveCheckin()" style="flex-shrink:0;max-width:260px;" data-astro-cid-kuyasrws> <div class="btn-spin" id="saveSpin" data-astro-cid-kuyasrws></div> <span id="saveTxt" data-astro-cid-kuyasrws>', '</span> </button> </div> </div><!-- /page --> <!-- SUCCESS OVERLAY --> <div class="success-overlay" id="successOverlay" data-astro-cid-kuyasrws> <div class="so-icon" data-astro-cid-kuyasrws>', '</div> <h2 class="so-title" data-astro-cid-kuyasrws>Day <em id="soDay" data-astro-cid-kuyasrws>', '</em> complete!</h2> <div class="so-xp" data-astro-cid-kuyasrws>', ' +<span id="soXP" data-astro-cid-kuyasrws>30</span> XP earned</div> <p class="so-sub" id="soSub" data-astro-cid-kuyasrws>Great work staying consistent. Every check-in is one step closer to your goal.</p> <div class="so-insights" data-astro-cid-kuyasrws> <div class="so-insight-title" data-astro-cid-kuyasrws>', ` Tonight's Analysis</div> <div id="soInsightsList" data-astro-cid-kuyasrws></div> </div> <a href="/dashboard" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;border-radius:13px;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;font-weight:800;font-size:.9rem;text-decoration:none;box-shadow:0 4px 16px rgba(16,185,129,.3);" data-astro-cid-kuyasrws> `, ' Back to Dashboard\n</a> </div> <div class="toast" id="toast" data-astro-cid-kuyasrws></div> <script>(function(){', `

/* \u2500\u2500 STATE (pre-filled if editing today's check-in) \u2500\u2500 */
var state = {
  energy: prefill.energy, mood: prefill.mood, hunger: prefill.hunger, brain: 3,
  symptoms: [],
  followed_meals: prefill.followed_meals, stayed_carbs: false,
  completed_fast: prefill.fasted_today, good_sleep: false,
  water: prefill.water,
  sodium: prefill.took_sodium || false,
  potassium: prefill.took_potassium || false,
  magnesium: prefill.took_magnesium || false,
  sleep_hours: prefill.sleep_hours || 7,
  sleep_quality: prefill.sleep_quality || 0,
  note: prefill.note || '',
};

/* \u2500\u2500 SLIDER HANDLER \u2500\u2500 */
var brainEmojis = ['\u{1F32B}\uFE0F','\u{1F615}','\u{1F610}','\u{1F9E0}','\u{1F4A1}'];

function updateSliderTrack(el, pct, color) {
  el.style.background = 'linear-gradient(to right,' + color + ' 0%,' + color + ' ' + pct + '%,var(--muted) ' + pct + '%)';
}

window.onSlider = function(field, rawVal) {
  var val = parseInt(rawVal);
  state[field] = val;
  var idx = val - 1;
  var pct = (val - 1) / 4 * 100;

  if (field === 'energy') {
    var el = document.getElementById('energySlider');
    updateSliderTrack(el, pct, '#10b981');
    document.getElementById('energyEmoji').textContent = energyEmojis[idx] || '\u{1F610}';
    document.getElementById('energyValBadge').textContent = val;
  } else if (field === 'mood') {
    var el2 = document.getElementById('moodSlider');
    updateSliderTrack(el2, pct, '#10b981');
    document.getElementById('moodEmoji').textContent = moodEmojis[idx] || '\u{1F610}';
    document.getElementById('moodValBadge').textContent = val;
  } else if (field === 'hunger') {
    var el3 = document.getElementById('hungerSlider');
    updateSliderTrack(el3, pct, '#ef4444');
    document.getElementById('hungerEmoji').textContent = hungerEmojis[idx] || '\u{1F610}';
    document.getElementById('hungerValBadge').textContent = val;
  } else if (field === 'brain') {
    var el4 = document.getElementById('brainSlider');
    updateSliderTrack(el4, pct, '#8b5cf6');
    document.getElementById('brainEmoji').textContent = brainEmojis[idx] || '\u{1F610}';
    document.getElementById('brainValBadge').textContent = val;
  }

  // Update step indicator
  updateSteps();
};

/* \u2500\u2500 STEP INDICATOR \u2500\u2500 */
function updateSteps() {
  var steps = document.querySelectorAll('.ci-step');
  var hasEnergy = state.energy > 0 && document.getElementById('energySlider') && true;
  var hasMood   = state.mood   > 0;
  var hasBody   = state.water > 0 || state.symptoms.length > 0;
  var hasMeals  = state.followed_meals || state.stayed_carbs;
  var doneArr   = [hasEnergy, hasMood, hasBody, hasMeals, false];
  var firstPending = doneArr.indexOf(false);

  steps.forEach(function(step, i) {
    step.classList.remove('done','active');
    var dot = step.querySelector('.ci-step-dot');
    if (doneArr[i]) {
      step.classList.add('done');
      if (dot) dot.textContent = '\u2713';
    } else if (i === firstPending) {
      step.classList.add('active');
      if (dot) dot.textContent = i + 1;
    } else {
      if (dot) dot.textContent = i + 1;
    }
  });
}

// Init slider tracks on load (use actual state values for correct fill)
(function() {
  var fieldMap = {
    energy: { id: 'energySlider', color: '#10b981', emojis: energyEmojis, badgeId: 'energyValBadge', emojiId: 'energyEmoji' },
    mood:   { id: 'moodSlider',   color: '#10b981', emojis: moodEmojis,   badgeId: 'moodValBadge',   emojiId: 'moodEmoji' },
    hunger: { id: 'hungerSlider', color: '#ef4444', emojis: hungerEmojis, badgeId: 'hungerValBadge', emojiId: 'hungerEmoji' },
    brain:  { id: 'brainSlider',  color: '#8b5cf6', emojis: null,         badgeId: null,             emojiId: null },
  };
  Object.keys(fieldMap).forEach(function(f) {
    var cfg = fieldMap[f];
    var el = document.getElementById(cfg.id);
    if (!el) return;
    var val = state[f] || 3;
    var pct = ((val - 1) / 4) * 100;
    updateSliderTrack(el, pct, cfg.color);
    if (cfg.badgeId) document.getElementById(cfg.badgeId).textContent = val;
    if (cfg.emojiId && cfg.emojis) document.getElementById(cfg.emojiId).textContent = cfg.emojis[val - 1] || '\u{1F610}';
  });

  // Pre-fill water glasses UI
  if (state.water > 0) {
    document.querySelectorAll('.wglass-btn').forEach(function(g) {
      if (parseInt(g.dataset.n) <= state.water) g.classList.add('wfull');
    });
    var wcEl = document.getElementById('waterCount');
    if (wcEl) wcEl.textContent = state.water;
    var wlEl = document.getElementById('waterLiters');
    if (wlEl) wlEl.textContent = (state.water * 8) + ' oz';
    var chip = document.getElementById('waterChip');
    if (chip) chip.textContent = state.water + ' / 8 glasses';
  }

  // Pre-fill note
  if (state.note) {
    var noteEl = document.getElementById('noteArea');
    if (noteEl) {
      noteEl.value = state.note;
      var cntEl = document.getElementById('noteCount');
      if (cntEl) cntEl.textContent = state.note.length + '/500';
    }
  }

  updateSteps();
})();

/* \u2500\u2500 STAR RATING (kept for compatibility) \u2500\u2500 */
function rateStar(el) {
  var field = el.dataset.field;
  var val   = parseInt(el.dataset.val);
  var type  = el.dataset.type;
  state[field] = val;
  var stars = document.querySelectorAll('[data-field="' + field + '"]');
  stars.forEach(function(s) {
    s.classList.remove('active','active-green','active-red');
    if (parseInt(s.dataset.val) <= val) {
      s.classList.add(type === 'red' ? 'active-red' : 'active-green');
    }
  });
}

/* \u2500\u2500 SYMPTOMS \u2500\u2500 */
var symptomsSelected = new Set();
var fluAdviceMap = {
  headache: { icon:'\u{1F9C2}', text:'<strong>Take salt immediately.</strong> Add \xBD tsp salt to 500ml water. Sodium deficiency is the #1 cause of keto headaches.' },
  fatigue:  { icon:'\u{1F951}', text:'<strong>Eat more fat.</strong> Your body is adapting to fat fuel. Have avocado, nuts, or MCT oil to boost energy fast.' },
  brain_fog:{ icon:'\u2615', text:'<strong>Try bulletproof coffee.</strong> MCT oil or coconut oil in black coffee gives your brain instant ketone fuel.' },
  nausea:   { icon:'\u{1FADA}', text:'<strong>Reduce fat intake slightly</strong> for 1-2 days. Start with smaller portions. Ginger tea can help settle your stomach.' },
  dizziness:{ icon:'\u{1F4A7}', text:'<strong>Drink water + electrolytes NOW.</strong> Lie down if needed. Add salt + potassium (banana substitute: avocado).' },
  irritable:{ icon:'\u{1F634}', text:'<strong>Low blood sugar adjustment.</strong> Ensure you\\'re eating enough calories. Rest more. This passes by day 5.' },
  cramps:   { icon:'\u{1F9B5}', text:'<strong>Magnesium deficiency.</strong> Take 300mg magnesium glycinate before sleep tonight. Also increase potassium.' },
};

function toggleSymptom(el) {
  var val = el.dataset.val;
  var color = el.dataset.color || 'red';
  if (val === 'none') {
    symptomsSelected.clear();
    document.querySelectorAll('.pill-toggle').forEach(function(c) {
      c.classList.remove('on-red','on-green');
    });
    el.classList.add('on-green');
    symptomsSelected.add('none');
    state.symptoms = ['none'];
    updateFluAdvice();
    updateSteps();
    return;
  }
  var noneCard = document.querySelector('.pill-toggle[data-val="none"]');
  if (noneCard) noneCard.classList.remove('on-green');
  symptomsSelected.delete('none');
  var onClass = color === 'green' ? 'on-green' : 'on-red';
  var wasOn = el.classList.contains(onClass);
  el.classList.remove('on-red','on-green');
  if (!wasOn) {
    el.classList.add(onClass);
    symptomsSelected.add(val);
  } else {
    symptomsSelected.delete(val);
  }
  state.symptoms = Array.from(symptomsSelected);
  updateFluAdvice();
  updateSteps();
}

function updateFluAdvice() {
  var box = document.getElementById('fluAdvice');
  if (!box) return;
  var active = Array.from(symptomsSelected).filter(function(s) { return s !== 'none' && fluAdviceMap[s]; });
  if (active.length === 0) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  var rows = active.map(function(s) {
    return '<div style="display:flex;gap:.65rem;align-items:flex-start;margin-bottom:.6rem;font-size:.8rem;line-height:1.5;"><span style="font-size:1.1rem;flex-shrink:0;">' + fluAdviceMap[s].icon + '</span><span>' + fluAdviceMap[s].text + '</span></div>';
  }).join('');
  box.innerHTML = '<div style="background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:14px;padding:1.1rem 1.25rem;"><div style="font-weight:900;font-size:.82rem;color:var(--gold);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.07em;">\u26A1 Your Relief Protocol</div>' + rows + '</div>';
}

/* \u2500\u2500 COMPLIANCE \u2500\u2500 */
function toggleComp(el, key) {
  var isOn = el.classList.contains('yes');
  el.classList.remove('yes','no');
  var stateKey = key === 'meals' ? 'followed_meals' : key === 'carbs' ? 'stayed_carbs' : key === 'fast' ? 'completed_fast' : 'good_sleep';
  if (!isOn) { el.classList.add('yes');  state[stateKey] = true; }
  else        { el.classList.add('no');   state[stateKey] = false; }
  updateSteps();
}

/* \u2500\u2500 WATER \u2500\u2500 */
window.setWater = function(el) {
  var n = parseInt(el.dataset.n);
  state.water = n;
  document.querySelectorAll('.wglass-btn').forEach(function(g) {
    if (parseInt(g.dataset.n) <= n) g.classList.add('wfull');
    else g.classList.remove('wfull');
  });
  document.getElementById('waterCount').textContent = n;
  document.getElementById('waterLiters').textContent = (n * 0.25).toFixed(2) + 'L';
  var chip = document.getElementById('waterChip');
  if (chip) chip.textContent = n + ' / 8 glasses';
  updateSteps();
};

/* \u2500\u2500 ELECTROLYTES \u2500\u2500 */
function toggleElec(el) {
  var val = el.dataset.val;
  el.classList.toggle('done');
  state[val] = el.classList.contains('done');
}

/* \u2500\u2500 NOTE \u2500\u2500 */
var noteAreaEl = document.getElementById('noteArea');
if (noteAreaEl) noteAreaEl.addEventListener('input', function() {
  state.note = this.value;
  document.getElementById('noteCount').textContent = this.value.length + '/500';
});

/* \u2500\u2500 CALCULATE XP \u2500\u2500 */
function calcXP() {
  var xp = 30;
  if (state.followed_meals) xp += 20;
  if (state.stayed_carbs)   xp += 15;
  if (state.completed_fast && hasFasting) xp += 25;
  if (state.water >= 8)     xp += 10;
  if (state.sodium && state.potassium && state.magnesium) xp += 10;
  if (state.note.length > 20) xp += 5;
  return xp;
}

/* \u2500\u2500 GENERATE INSIGHTS \u2500\u2500 */
function buildInsights() {
  var items = [];

  if (state.energy >= 4) items.push({ c:'#10b981', t:'Your energy is high \u2014 your body is adapting well to fat fuel. Great sign!' });
  else if (state.energy <= 2) items.push({ c:'#f59e0b', t:'Low energy is normal in the first days. Increase fat intake and stay hydrated.' });

  if (state.symptoms.includes('headache') || state.symptoms.includes('dizziness')) {
    items.push({ c:'#ef4444', t: 'Electrolyte deficiency detected. Add salt to water and eat potassium-rich foods today.' });
  }

  if (state.followed_meals && state.stayed_carbs) {
    items.push({ c:'#10b981', t:'Perfect compliance today! Consistent days like this build ketosis momentum.' });
  } else if (!state.followed_meals) {
    items.push({ c:'#f97316', t:"Missed meals break ketosis. Tomorrow, prep your breakfast the night before so there's no excuse." });
  }

  if (state.water < 6) items.push({ c:'#06b6d4', t:'Only ' + state.water + ' glasses today. Aim for 8+ tomorrow \u2014 dehydration amplifies every keto symptom.' });
  else if (state.water >= 10) items.push({ c:'#06b6d4', t:'Excellent hydration! Proper water intake accelerates fat burning.' });

  if (items.length === 0) items.push({ c:'#10b981', t:"Great check-in! You're building the habits that will transform your body." });

  return items.slice(0,4);
}

/* \u2500\u2500 SAVE \u2500\u2500 */
function saveCheckin() {
  var btn = document.getElementById('saveBtn');
  var spin = document.getElementById('saveSpin');
  var txt = document.getElementById('saveTxt');
  btn.disabled = true;
  spin.style.display = 'block';
  txt.textContent = 'Saving\u2026';

  var xp = calcXP();

  var payload = {
    energy_level:   state.energy   || 3,
    mood_level:     state.mood     || 3,
    hunger_level:   state.hunger   || 3,
    brain_fog:      state.symptoms.includes('brain_fog'),
    had_headache:   state.symptoms.includes('headache'),
    had_fatigue:    state.symptoms.includes('fatigue'),
    had_cravings:   state.symptoms.includes('irritable'),
    followed_meals: state.followed_meals,
    water_glasses:  state.water || 0,
    fasted_today:   state.completed_fast,
    note:           state.note,
    xp_earned:      xp,
    symptoms:       Array.from(symptomsSelected),
    sleep_hours:    state.sleep_hours || null,
    sleep_quality:  state.sleep_quality || null,
    took_sodium:    state.sodium,
    took_potassium: state.potassium,
    took_magnesium: state.magnesium,
    electrolytes: {
      sodium:    state.sodium,
      potassium: state.potassium,
      magnesium: state.magnesium,
    },
    client_date: new Date().toLocaleDateString('en-CA'),
  };

  fetch('/api/checkin/save', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload),
  }).then(function(res) {
    if (!res.ok) throw new Error('Failed');

    document.getElementById('soDay').textContent = currentDay;
    document.getElementById('soXP').textContent = xp;

    var insights = buildInsights();
    document.getElementById('soInsightsList').innerHTML = insights.map(function(ins) {
      return '<div class="so-insight-item"><div class="soi-dot" style="background:' + ins.c + ';box-shadow:0 0 6px ' + ins.c + '88;"></div><div>' + ins.t + '</div></div>';
    }).join('');

    if (state.symptoms.includes('none') || state.symptoms.length === 0) {
      document.getElementById('soSub').textContent = "You're feeling great! Keep this momentum going. Your body is adapting beautifully.";
    } else if (state.followed_meals && state.water >= 8) {
      document.getElementById('soSub').textContent = "Strong compliance today despite some symptoms. Your consistency is what makes the difference.";
    }

    document.getElementById('successOverlay').classList.add('show');

    fetch('/api/achievements/check', { method: 'POST' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach(function(a) { showAchievementToast(a.icon, a.name, a.desc); });
        }
      }).catch(function() {});
  }).catch(function() {
    btn.disabled = false; spin.style.display='none'; txt.textContent = alreadyDone ? 'Update Check-in \u270F\uFE0F' : 'Complete Check-in \xB7 +50 XP \u26A1';
    showToast('\u274C Failed to save. Try again.','error');
  });
}

/* \u2500\u2500 ACHIEVEMENT TOAST \u2500\u2500 */
function showAchievementToast(icon, name, desc) {
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:5rem;right:1.25rem;z-index:9999;background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(139,92,246,.12));border:1.5px solid rgba(245,158,11,.45);border-radius:16px;padding:.875rem 1.1rem;max-width:280px;box-shadow:0 12px 40px rgba(0,0,0,.4);animation:achIn .4s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(16px);';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:.6rem;"><span style="font-size:1.6rem;">' + icon + '</span><div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:rgba(245,158,11,.9);margin-bottom:.1rem;">Achievement Unlocked!</div><div style="font-size:.85rem;font-weight:800;color:#fde68a;">' + name + '</div><div style="font-size:.72rem;color:rgba(255,255,255,.6);margin-top:.1rem;">' + desc + '</div></div></div>';
  if (!document.getElementById('achKf')) {
    var s = document.createElement('style'); s.id='achKf';
    s.textContent = '@keyframes achIn{from{opacity:0;transform:translateY(20px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(function() {
    el.style.transition='all .4s ease'; el.style.opacity='0'; el.style.transform='translateY(10px)';
    setTimeout(function() { el.remove(); }, 400);
  }, 4000);
}

/* \u2500\u2500 TOAST \u2500\u2500 */
function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast toast-' + (type || 'success') + ' show';
  setTimeout(function() { t.classList.remove('show'); }, 3200);
}

/* \u2500\u2500 SLEEP \u2500\u2500 */
var sleepMessages = {
  0:'No sleep logged',2:'Very little sleep \u2014 rest more tonight',4:'Below average \u2014 aim for 7\u20138h',
  5:'Below average \u2014 aim for 7\u20138h',6:'Good \u2014 keto adaptation benefits from 7+ hours',
  7:'Ideal for keto adaptation \u{1F44D}',8:'Great sleep! Optimal for fat burning',
  9:'Excellent! Deep sleep boosts ketone production',10:'Plenty of rest',
  11:'A lot of sleep \u2014 normal if recovering',12:'Full 12h sleep logged',
};
window.updateSleepHours = function(val) {
  state.sleep_hours = parseFloat(val);
  var el = document.getElementById('sleepHoursDisplay');
  if (el) el.textContent = val + 'h';
  var msg = document.getElementById('sleepMsg');
  if (msg) {
    var key = Math.round(parseFloat(val));
    var txt = sleepMessages[key] || (val + ' hours logged');
    msg.textContent = val + ' hours \u2014 ' + txt.replace(/^\\d+[^\u2014]*\u2014 ?/, '');
  }
};
window.setSleepQuality = function(n) {
  state.sleep_quality = n;
  document.querySelectorAll('.sleep-star').forEach(function(btn) {
    var bn = parseInt(btn.getAttribute('data-n'));
    btn.style.background = bn <= n ? 'rgba(99,102,241,.2)' : 'var(--card2)';
    btn.style.borderColor = bn <= n ? 'rgba(99,102,241,.5)' : 'var(--border)';
    btn.style.transform = bn === n ? 'scale(1.15)' : 'scale(1)';
  });
};

window.rateStar     = rateStar;
window.toggleSymptom= toggleSymptom;
window.toggleComp   = toggleComp;
window.toggleElec   = toggleElec;
window.saveCheckin  = saveCheckin;
})();<\/script> </body> </html>`], [`<html lang="en" data-astro-cid-kuyasrws> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daily Check-in \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ const t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();
  <\/script>`, '</head> <body data-astro-cid-kuyasrws> <div class="bg-wrap" data-astro-cid-kuyasrws><div class="orb o1" data-astro-cid-kuyasrws></div><div class="orb o2" data-astro-cid-kuyasrws></div><div class="orb o3" data-astro-cid-kuyasrws></div></div> <!-- NAV --> ', ' <!-- PAGE --> <div class="page" data-astro-cid-kuyasrws>  ', '  <div class="ci-hero" data-astro-cid-kuyasrws> <div class="ci-hero-top" data-astro-cid-kuyasrws> <div data-astro-cid-kuyasrws> <h1 class="ci-hero-title" data-astro-cid-kuyasrws>', ' <em data-astro-cid-kuyasrws>Check-in</em></h1> <p class="ci-hero-sub" data-astro-cid-kuyasrws>', '</p> </div> <div class="ci-badges" data-astro-cid-kuyasrws> <span class="ci-badge-day" data-astro-cid-kuyasrws>', " Day ", "</span> ", " ", ' </div> </div>  <div class="ci-steps" id="ciSteps" data-astro-cid-kuyasrws> <div class="ci-step active" data-step="0" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-0" data-astro-cid-kuyasrws>1</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Energy</span> </div> <div class="ci-step" data-step="1" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-1" data-astro-cid-kuyasrws>2</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Mood</span> </div> <div class="ci-step" data-step="2" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-2" data-astro-cid-kuyasrws>3</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Body</span> </div> <div class="ci-step" data-step="3" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-3" data-astro-cid-kuyasrws>4</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Meals</span> </div> <div class="ci-step" data-step="4" data-astro-cid-kuyasrws> <div class="ci-step-dot" id="dot-4" data-astro-cid-kuyasrws>5</div> <span class="ci-step-lbl" data-astro-cid-kuyasrws>Submit</span> </div> </div> </div>  ', '  <div class="slider-section" style="animation-delay:.05s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.25);" data-astro-cid-kuyasrws>', '</div> <div class="sh-title" data-astro-cid-kuyasrws>How do you feel today?</div> <div class="sh-chip" data-astro-cid-kuyasrws>Slide to rate</div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="energyEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Energy Level</div> <div class="slider-sub" data-astro-cid-kuyasrws>How energetic do you feel?</div> </div> </div> <div class="slider-val-badge" id="energyValBadge" style="color:var(--green);" data-astro-cid-kuyasrws>', '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="energySlider" min="1" max="5" step="1"', ` oninput="window.onSlider('energy', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Very Low</span> <span data-astro-cid-kuyasrws>3 = Average</span> <span data-astro-cid-kuyasrws>5 = Excellent</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="moodEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Mood</div> <div class="slider-sub" data-astro-cid-kuyasrws>Mental and emotional state</div> </div> </div> <div class="slider-val-badge" id="moodValBadge" style="color:var(--green);" data-astro-cid-kuyasrws>`, '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="moodSlider" min="1" max="5" step="1"', ` oninput="window.onSlider('mood', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Low</span> <span data-astro-cid-kuyasrws>3 = Neutral</span> <span data-astro-cid-kuyasrws>5 = Great</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="hungerEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Hunger Level</div> <div class="slider-sub" data-astro-cid-kuyasrws>How hungry are you? (5 = very hungry)</div> </div> </div> <div class="slider-val-badge" id="hungerValBadge" style="color:var(--red);" data-astro-cid-kuyasrws>`, '</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="hungerSlider" min="1" max="5" step="1"', ` style="accent-color:var(--red);" oninput="window.onSlider('hunger', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Not at all</span> <span data-astro-cid-kuyasrws>3 = Moderate</span> <span data-astro-cid-kuyasrws>5 = Very hungry</span> </div> </div>  <div class="slider-card" data-astro-cid-kuyasrws> <div class="slider-top" data-astro-cid-kuyasrws> <div class="slider-left" data-astro-cid-kuyasrws> <span class="slider-big-emoji" id="brainEmoji" data-astro-cid-kuyasrws>\u{1F610}</span> <div data-astro-cid-kuyasrws> <div class="slider-label" data-astro-cid-kuyasrws>Mental Clarity</div> <div class="slider-sub" data-astro-cid-kuyasrws>Focus and brain clarity today</div> </div> </div> <div class="slider-val-badge" id="brainValBadge" style="color:var(--purple);" data-astro-cid-kuyasrws>3</div> </div> <div class="slider-track-wrap" data-astro-cid-kuyasrws> <input type="range" class="ci-range" id="brainSlider" min="1" max="5" step="1" value="3" style="accent-color:var(--purple);" oninput="window.onSlider('brain', this.value)" data-astro-cid-kuyasrws> </div> <div class="slider-labels" data-astro-cid-kuyasrws> <span data-astro-cid-kuyasrws>1 = Very foggy</span> <span data-astro-cid-kuyasrws>3 = Average</span> <span data-astro-cid-kuyasrws>5 = Crystal clear</span> </div> </div> </div>  `, '  <div class="section" style="animation-delay:.15s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Today's Compliance</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div class="compliance-grid" data-astro-cid-kuyasrws> <div class="comp-card" id="comp-meals" onclick="toggleComp(this,'meals')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F37D}\uFE0F</div> <div class="cc-label" data-astro-cid-kuyasrws>Followed Meals</div> <div class="cc-sub" data-astro-cid-kuyasrws>Ate according to plan</div> </div> <div class="comp-card" id="comp-carbs" onclick="toggleComp(this,'carbs')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F966}</div> <div class="cc-label" data-astro-cid-kuyasrws>Stayed Under Carbs</div> <div class="cc-sub" data-astro-cid-kuyasrws>Kept net carbs low</div> </div> `, ` <div class="comp-card" id="comp-sleep" onclick="toggleComp(this,'sleep')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>\u{1F634}</div> <div class="cc-label" data-astro-cid-kuyasrws>Good Sleep</div> <div class="cc-sub" data-astro-cid-kuyasrws>7+ hours last night</div> </div> </div> </div> </div>  <div class="section" style="animation-delay:.2s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#06b6d4,#0891b2);box-shadow:0 4px 10px rgba(6,182,212,.25);" data-astro-cid-kuyasrws>`, '</div> <div class="sh-title" data-astro-cid-kuyasrws>Water Intake</div> <div class="sh-chip" style="background:rgba(6,182,212,.1);border-color:rgba(6,182,212,.2);color:var(--cyan);" id="waterChip" data-astro-cid-kuyasrws>0 / 8 glasses</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div class="water-visual-row" data-astro-cid-kuyasrws> <div class="water-glasses-row" id="waterGlasses" data-astro-cid-kuyasrws> ', ' </div> <div class="water-stat" data-astro-cid-kuyasrws> <div class="water-big" id="waterCount" data-astro-cid-kuyasrws>0</div> <div class="water-lbl-sm" data-astro-cid-kuyasrws>glasses</div> <div style="font-size:.62rem;color:var(--soft);margin-top:.2rem;" id="waterLiters" data-astro-cid-kuyasrws>0 oz</div> </div> </div> <div style="margin-top:.875rem;font-size:.75rem;color:var(--soft);line-height:1.5;" data-astro-cid-kuyasrws> ', ' Goal: <strong style="color:var(--cyan);" data-astro-cid-kuyasrws>', "</strong> \u2014 ", ' </div> </div> </div>  <div class="section" style="animation-delay:.25s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 4px 10px rgba(139,92,246,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Electrolytes Today</div> <div class="sh-chip" style="background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.2);color:var(--purple);" data-astro-cid-kuyasrws>Essential</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <p style="font-size:.75rem;color:var(--soft);margin-bottom:1rem;line-height:1.5;" data-astro-cid-kuyasrws>
Tap each one after you've taken it. These prevent keto flu and keep your energy high.
</p> <div class="elec-grid" data-astro-cid-kuyasrws> `, ' </div> </div> </div>  <div class="section" style="animation-delay:.3s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 10px rgba(59,130,246,.25);" data-astro-cid-kuyasrws>', `</div> <div class="sh-title" data-astro-cid-kuyasrws>Today's Note</div> <div class="sh-chip" style="background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.2);color:var(--blue);" data-astro-cid-kuyasrws>Optional</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <textarea class="note-area" id="noteArea" placeholder="How was your day? Any challenges? What did you eat? Write anything you want to remember..." maxlength="500" data-astro-cid-kuyasrws></textarea> <div style="text-align:right;font-size:.68rem;color:var(--muted);margin-top:.35rem;" id="noteCount" data-astro-cid-kuyasrws>0/500</div> </div> </div>  <div class="section" style="animation-delay:.32s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 10px rgba(99,102,241,.25);" data-astro-cid-kuyasrws>`, `</div> <div class="sh-title" data-astro-cid-kuyasrws>Last Night's Sleep</div> <div class="sh-chip" style="background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.2);color:#a5b4fc;" data-astro-cid-kuyasrws>Optional</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" data-astro-cid-kuyasrws> <div data-astro-cid-kuyasrws> <div style="font-size:.75rem;font-weight:700;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-kuyasrws>Hours Slept</div> <div style="display:flex;align-items:center;gap:.75rem;" data-astro-cid-kuyasrws> <input type="range" id="sleepSlider" min="0" max="12" step="0.5" value="7" style="flex:1;accent-color:#6366f1;" oninput="window.updateSleepHours(this.value)" data-astro-cid-kuyasrws> <span id="sleepHoursDisplay" style="font-size:1rem;font-weight:800;color:#a5b4fc;min-width:2.5rem;text-align:right;" data-astro-cid-kuyasrws>7h</span> </div> </div> <div data-astro-cid-kuyasrws> <div style="font-size:.75rem;font-weight:700;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-kuyasrws>Sleep Quality</div> <div style="display:flex;gap:.4rem;" id="sleepStars" data-astro-cid-kuyasrws> `, ' </div> </div> </div> <div id="sleepMsg" style="margin-top:.75rem;font-size:.75rem;color:var(--soft);padding:.5rem .75rem;background:var(--card2);border-radius:10px;border-left:3px solid #6366f1;" data-astro-cid-kuyasrws>\n7 hours \u2014 Ideal for keto adaptation \u{1F44D}\n</div> </div> </div>  <div class="save-wrap" data-astro-cid-kuyasrws> <div class="save-info" data-astro-cid-kuyasrws> <div class="save-title" data-astro-cid-kuyasrws>Ready to submit?</div> <div class="save-sub" data-astro-cid-kuyasrws>Takes 2 minutes \xB7 builds your streak</div> </div> <button class="btn-save-big" id="saveBtn" onclick="saveCheckin()" style="flex-shrink:0;max-width:260px;" data-astro-cid-kuyasrws> <div class="btn-spin" id="saveSpin" data-astro-cid-kuyasrws></div> <span id="saveTxt" data-astro-cid-kuyasrws>', '</span> </button> </div> </div><!-- /page --> <!-- SUCCESS OVERLAY --> <div class="success-overlay" id="successOverlay" data-astro-cid-kuyasrws> <div class="so-icon" data-astro-cid-kuyasrws>', '</div> <h2 class="so-title" data-astro-cid-kuyasrws>Day <em id="soDay" data-astro-cid-kuyasrws>', '</em> complete!</h2> <div class="so-xp" data-astro-cid-kuyasrws>', ' +<span id="soXP" data-astro-cid-kuyasrws>30</span> XP earned</div> <p class="so-sub" id="soSub" data-astro-cid-kuyasrws>Great work staying consistent. Every check-in is one step closer to your goal.</p> <div class="so-insights" data-astro-cid-kuyasrws> <div class="so-insight-title" data-astro-cid-kuyasrws>', ` Tonight's Analysis</div> <div id="soInsightsList" data-astro-cid-kuyasrws></div> </div> <a href="/dashboard" style="display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;border-radius:13px;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;font-weight:800;font-size:.9rem;text-decoration:none;box-shadow:0 4px 16px rgba(16,185,129,.3);" data-astro-cid-kuyasrws> `, ' Back to Dashboard\n</a> </div> <div class="toast" id="toast" data-astro-cid-kuyasrws></div> <script>(function(){', `

/* \u2500\u2500 STATE (pre-filled if editing today's check-in) \u2500\u2500 */
var state = {
  energy: prefill.energy, mood: prefill.mood, hunger: prefill.hunger, brain: 3,
  symptoms: [],
  followed_meals: prefill.followed_meals, stayed_carbs: false,
  completed_fast: prefill.fasted_today, good_sleep: false,
  water: prefill.water,
  sodium: prefill.took_sodium || false,
  potassium: prefill.took_potassium || false,
  magnesium: prefill.took_magnesium || false,
  sleep_hours: prefill.sleep_hours || 7,
  sleep_quality: prefill.sleep_quality || 0,
  note: prefill.note || '',
};

/* \u2500\u2500 SLIDER HANDLER \u2500\u2500 */
var brainEmojis = ['\u{1F32B}\uFE0F','\u{1F615}','\u{1F610}','\u{1F9E0}','\u{1F4A1}'];

function updateSliderTrack(el, pct, color) {
  el.style.background = 'linear-gradient(to right,' + color + ' 0%,' + color + ' ' + pct + '%,var(--muted) ' + pct + '%)';
}

window.onSlider = function(field, rawVal) {
  var val = parseInt(rawVal);
  state[field] = val;
  var idx = val - 1;
  var pct = (val - 1) / 4 * 100;

  if (field === 'energy') {
    var el = document.getElementById('energySlider');
    updateSliderTrack(el, pct, '#10b981');
    document.getElementById('energyEmoji').textContent = energyEmojis[idx] || '\u{1F610}';
    document.getElementById('energyValBadge').textContent = val;
  } else if (field === 'mood') {
    var el2 = document.getElementById('moodSlider');
    updateSliderTrack(el2, pct, '#10b981');
    document.getElementById('moodEmoji').textContent = moodEmojis[idx] || '\u{1F610}';
    document.getElementById('moodValBadge').textContent = val;
  } else if (field === 'hunger') {
    var el3 = document.getElementById('hungerSlider');
    updateSliderTrack(el3, pct, '#ef4444');
    document.getElementById('hungerEmoji').textContent = hungerEmojis[idx] || '\u{1F610}';
    document.getElementById('hungerValBadge').textContent = val;
  } else if (field === 'brain') {
    var el4 = document.getElementById('brainSlider');
    updateSliderTrack(el4, pct, '#8b5cf6');
    document.getElementById('brainEmoji').textContent = brainEmojis[idx] || '\u{1F610}';
    document.getElementById('brainValBadge').textContent = val;
  }

  // Update step indicator
  updateSteps();
};

/* \u2500\u2500 STEP INDICATOR \u2500\u2500 */
function updateSteps() {
  var steps = document.querySelectorAll('.ci-step');
  var hasEnergy = state.energy > 0 && document.getElementById('energySlider') && true;
  var hasMood   = state.mood   > 0;
  var hasBody   = state.water > 0 || state.symptoms.length > 0;
  var hasMeals  = state.followed_meals || state.stayed_carbs;
  var doneArr   = [hasEnergy, hasMood, hasBody, hasMeals, false];
  var firstPending = doneArr.indexOf(false);

  steps.forEach(function(step, i) {
    step.classList.remove('done','active');
    var dot = step.querySelector('.ci-step-dot');
    if (doneArr[i]) {
      step.classList.add('done');
      if (dot) dot.textContent = '\u2713';
    } else if (i === firstPending) {
      step.classList.add('active');
      if (dot) dot.textContent = i + 1;
    } else {
      if (dot) dot.textContent = i + 1;
    }
  });
}

// Init slider tracks on load (use actual state values for correct fill)
(function() {
  var fieldMap = {
    energy: { id: 'energySlider', color: '#10b981', emojis: energyEmojis, badgeId: 'energyValBadge', emojiId: 'energyEmoji' },
    mood:   { id: 'moodSlider',   color: '#10b981', emojis: moodEmojis,   badgeId: 'moodValBadge',   emojiId: 'moodEmoji' },
    hunger: { id: 'hungerSlider', color: '#ef4444', emojis: hungerEmojis, badgeId: 'hungerValBadge', emojiId: 'hungerEmoji' },
    brain:  { id: 'brainSlider',  color: '#8b5cf6', emojis: null,         badgeId: null,             emojiId: null },
  };
  Object.keys(fieldMap).forEach(function(f) {
    var cfg = fieldMap[f];
    var el = document.getElementById(cfg.id);
    if (!el) return;
    var val = state[f] || 3;
    var pct = ((val - 1) / 4) * 100;
    updateSliderTrack(el, pct, cfg.color);
    if (cfg.badgeId) document.getElementById(cfg.badgeId).textContent = val;
    if (cfg.emojiId && cfg.emojis) document.getElementById(cfg.emojiId).textContent = cfg.emojis[val - 1] || '\u{1F610}';
  });

  // Pre-fill water glasses UI
  if (state.water > 0) {
    document.querySelectorAll('.wglass-btn').forEach(function(g) {
      if (parseInt(g.dataset.n) <= state.water) g.classList.add('wfull');
    });
    var wcEl = document.getElementById('waterCount');
    if (wcEl) wcEl.textContent = state.water;
    var wlEl = document.getElementById('waterLiters');
    if (wlEl) wlEl.textContent = (state.water * 8) + ' oz';
    var chip = document.getElementById('waterChip');
    if (chip) chip.textContent = state.water + ' / 8 glasses';
  }

  // Pre-fill note
  if (state.note) {
    var noteEl = document.getElementById('noteArea');
    if (noteEl) {
      noteEl.value = state.note;
      var cntEl = document.getElementById('noteCount');
      if (cntEl) cntEl.textContent = state.note.length + '/500';
    }
  }

  updateSteps();
})();

/* \u2500\u2500 STAR RATING (kept for compatibility) \u2500\u2500 */
function rateStar(el) {
  var field = el.dataset.field;
  var val   = parseInt(el.dataset.val);
  var type  = el.dataset.type;
  state[field] = val;
  var stars = document.querySelectorAll('[data-field="' + field + '"]');
  stars.forEach(function(s) {
    s.classList.remove('active','active-green','active-red');
    if (parseInt(s.dataset.val) <= val) {
      s.classList.add(type === 'red' ? 'active-red' : 'active-green');
    }
  });
}

/* \u2500\u2500 SYMPTOMS \u2500\u2500 */
var symptomsSelected = new Set();
var fluAdviceMap = {
  headache: { icon:'\u{1F9C2}', text:'<strong>Take salt immediately.</strong> Add \xBD tsp salt to 500ml water. Sodium deficiency is the #1 cause of keto headaches.' },
  fatigue:  { icon:'\u{1F951}', text:'<strong>Eat more fat.</strong> Your body is adapting to fat fuel. Have avocado, nuts, or MCT oil to boost energy fast.' },
  brain_fog:{ icon:'\u2615', text:'<strong>Try bulletproof coffee.</strong> MCT oil or coconut oil in black coffee gives your brain instant ketone fuel.' },
  nausea:   { icon:'\u{1FADA}', text:'<strong>Reduce fat intake slightly</strong> for 1-2 days. Start with smaller portions. Ginger tea can help settle your stomach.' },
  dizziness:{ icon:'\u{1F4A7}', text:'<strong>Drink water + electrolytes NOW.</strong> Lie down if needed. Add salt + potassium (banana substitute: avocado).' },
  irritable:{ icon:'\u{1F634}', text:'<strong>Low blood sugar adjustment.</strong> Ensure you\\\\'re eating enough calories. Rest more. This passes by day 5.' },
  cramps:   { icon:'\u{1F9B5}', text:'<strong>Magnesium deficiency.</strong> Take 300mg magnesium glycinate before sleep tonight. Also increase potassium.' },
};

function toggleSymptom(el) {
  var val = el.dataset.val;
  var color = el.dataset.color || 'red';
  if (val === 'none') {
    symptomsSelected.clear();
    document.querySelectorAll('.pill-toggle').forEach(function(c) {
      c.classList.remove('on-red','on-green');
    });
    el.classList.add('on-green');
    symptomsSelected.add('none');
    state.symptoms = ['none'];
    updateFluAdvice();
    updateSteps();
    return;
  }
  var noneCard = document.querySelector('.pill-toggle[data-val="none"]');
  if (noneCard) noneCard.classList.remove('on-green');
  symptomsSelected.delete('none');
  var onClass = color === 'green' ? 'on-green' : 'on-red';
  var wasOn = el.classList.contains(onClass);
  el.classList.remove('on-red','on-green');
  if (!wasOn) {
    el.classList.add(onClass);
    symptomsSelected.add(val);
  } else {
    symptomsSelected.delete(val);
  }
  state.symptoms = Array.from(symptomsSelected);
  updateFluAdvice();
  updateSteps();
}

function updateFluAdvice() {
  var box = document.getElementById('fluAdvice');
  if (!box) return;
  var active = Array.from(symptomsSelected).filter(function(s) { return s !== 'none' && fluAdviceMap[s]; });
  if (active.length === 0) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  var rows = active.map(function(s) {
    return '<div style="display:flex;gap:.65rem;align-items:flex-start;margin-bottom:.6rem;font-size:.8rem;line-height:1.5;"><span style="font-size:1.1rem;flex-shrink:0;">' + fluAdviceMap[s].icon + '</span><span>' + fluAdviceMap[s].text + '</span></div>';
  }).join('');
  box.innerHTML = '<div style="background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:14px;padding:1.1rem 1.25rem;"><div style="font-weight:900;font-size:.82rem;color:var(--gold);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.07em;">\u26A1 Your Relief Protocol</div>' + rows + '</div>';
}

/* \u2500\u2500 COMPLIANCE \u2500\u2500 */
function toggleComp(el, key) {
  var isOn = el.classList.contains('yes');
  el.classList.remove('yes','no');
  var stateKey = key === 'meals' ? 'followed_meals' : key === 'carbs' ? 'stayed_carbs' : key === 'fast' ? 'completed_fast' : 'good_sleep';
  if (!isOn) { el.classList.add('yes');  state[stateKey] = true; }
  else        { el.classList.add('no');   state[stateKey] = false; }
  updateSteps();
}

/* \u2500\u2500 WATER \u2500\u2500 */
window.setWater = function(el) {
  var n = parseInt(el.dataset.n);
  state.water = n;
  document.querySelectorAll('.wglass-btn').forEach(function(g) {
    if (parseInt(g.dataset.n) <= n) g.classList.add('wfull');
    else g.classList.remove('wfull');
  });
  document.getElementById('waterCount').textContent = n;
  document.getElementById('waterLiters').textContent = (n * 0.25).toFixed(2) + 'L';
  var chip = document.getElementById('waterChip');
  if (chip) chip.textContent = n + ' / 8 glasses';
  updateSteps();
};

/* \u2500\u2500 ELECTROLYTES \u2500\u2500 */
function toggleElec(el) {
  var val = el.dataset.val;
  el.classList.toggle('done');
  state[val] = el.classList.contains('done');
}

/* \u2500\u2500 NOTE \u2500\u2500 */
var noteAreaEl = document.getElementById('noteArea');
if (noteAreaEl) noteAreaEl.addEventListener('input', function() {
  state.note = this.value;
  document.getElementById('noteCount').textContent = this.value.length + '/500';
});

/* \u2500\u2500 CALCULATE XP \u2500\u2500 */
function calcXP() {
  var xp = 30;
  if (state.followed_meals) xp += 20;
  if (state.stayed_carbs)   xp += 15;
  if (state.completed_fast && hasFasting) xp += 25;
  if (state.water >= 8)     xp += 10;
  if (state.sodium && state.potassium && state.magnesium) xp += 10;
  if (state.note.length > 20) xp += 5;
  return xp;
}

/* \u2500\u2500 GENERATE INSIGHTS \u2500\u2500 */
function buildInsights() {
  var items = [];

  if (state.energy >= 4) items.push({ c:'#10b981', t:'Your energy is high \u2014 your body is adapting well to fat fuel. Great sign!' });
  else if (state.energy <= 2) items.push({ c:'#f59e0b', t:'Low energy is normal in the first days. Increase fat intake and stay hydrated.' });

  if (state.symptoms.includes('headache') || state.symptoms.includes('dizziness')) {
    items.push({ c:'#ef4444', t: 'Electrolyte deficiency detected. Add salt to water and eat potassium-rich foods today.' });
  }

  if (state.followed_meals && state.stayed_carbs) {
    items.push({ c:'#10b981', t:'Perfect compliance today! Consistent days like this build ketosis momentum.' });
  } else if (!state.followed_meals) {
    items.push({ c:'#f97316', t:"Missed meals break ketosis. Tomorrow, prep your breakfast the night before so there's no excuse." });
  }

  if (state.water < 6) items.push({ c:'#06b6d4', t:'Only ' + state.water + ' glasses today. Aim for 8+ tomorrow \u2014 dehydration amplifies every keto symptom.' });
  else if (state.water >= 10) items.push({ c:'#06b6d4', t:'Excellent hydration! Proper water intake accelerates fat burning.' });

  if (items.length === 0) items.push({ c:'#10b981', t:"Great check-in! You're building the habits that will transform your body." });

  return items.slice(0,4);
}

/* \u2500\u2500 SAVE \u2500\u2500 */
function saveCheckin() {
  var btn = document.getElementById('saveBtn');
  var spin = document.getElementById('saveSpin');
  var txt = document.getElementById('saveTxt');
  btn.disabled = true;
  spin.style.display = 'block';
  txt.textContent = 'Saving\u2026';

  var xp = calcXP();

  var payload = {
    energy_level:   state.energy   || 3,
    mood_level:     state.mood     || 3,
    hunger_level:   state.hunger   || 3,
    brain_fog:      state.symptoms.includes('brain_fog'),
    had_headache:   state.symptoms.includes('headache'),
    had_fatigue:    state.symptoms.includes('fatigue'),
    had_cravings:   state.symptoms.includes('irritable'),
    followed_meals: state.followed_meals,
    water_glasses:  state.water || 0,
    fasted_today:   state.completed_fast,
    note:           state.note,
    xp_earned:      xp,
    symptoms:       Array.from(symptomsSelected),
    sleep_hours:    state.sleep_hours || null,
    sleep_quality:  state.sleep_quality || null,
    took_sodium:    state.sodium,
    took_potassium: state.potassium,
    took_magnesium: state.magnesium,
    electrolytes: {
      sodium:    state.sodium,
      potassium: state.potassium,
      magnesium: state.magnesium,
    },
    client_date: new Date().toLocaleDateString('en-CA'),
  };

  fetch('/api/checkin/save', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload),
  }).then(function(res) {
    if (!res.ok) throw new Error('Failed');

    document.getElementById('soDay').textContent = currentDay;
    document.getElementById('soXP').textContent = xp;

    var insights = buildInsights();
    document.getElementById('soInsightsList').innerHTML = insights.map(function(ins) {
      return '<div class="so-insight-item"><div class="soi-dot" style="background:' + ins.c + ';box-shadow:0 0 6px ' + ins.c + '88;"></div><div>' + ins.t + '</div></div>';
    }).join('');

    if (state.symptoms.includes('none') || state.symptoms.length === 0) {
      document.getElementById('soSub').textContent = "You're feeling great! Keep this momentum going. Your body is adapting beautifully.";
    } else if (state.followed_meals && state.water >= 8) {
      document.getElementById('soSub').textContent = "Strong compliance today despite some symptoms. Your consistency is what makes the difference.";
    }

    document.getElementById('successOverlay').classList.add('show');

    fetch('/api/achievements/check', { method: 'POST' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach(function(a) { showAchievementToast(a.icon, a.name, a.desc); });
        }
      }).catch(function() {});
  }).catch(function() {
    btn.disabled = false; spin.style.display='none'; txt.textContent = alreadyDone ? 'Update Check-in \u270F\uFE0F' : 'Complete Check-in \xB7 +50 XP \u26A1';
    showToast('\u274C Failed to save. Try again.','error');
  });
}

/* \u2500\u2500 ACHIEVEMENT TOAST \u2500\u2500 */
function showAchievementToast(icon, name, desc) {
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:5rem;right:1.25rem;z-index:9999;background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(139,92,246,.12));border:1.5px solid rgba(245,158,11,.45);border-radius:16px;padding:.875rem 1.1rem;max-width:280px;box-shadow:0 12px 40px rgba(0,0,0,.4);animation:achIn .4s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(16px);';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:.6rem;"><span style="font-size:1.6rem;">' + icon + '</span><div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:rgba(245,158,11,.9);margin-bottom:.1rem;">Achievement Unlocked!</div><div style="font-size:.85rem;font-weight:800;color:#fde68a;">' + name + '</div><div style="font-size:.72rem;color:rgba(255,255,255,.6);margin-top:.1rem;">' + desc + '</div></div></div>';
  if (!document.getElementById('achKf')) {
    var s = document.createElement('style'); s.id='achKf';
    s.textContent = '@keyframes achIn{from{opacity:0;transform:translateY(20px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(function() {
    el.style.transition='all .4s ease'; el.style.opacity='0'; el.style.transform='translateY(10px)';
    setTimeout(function() { el.remove(); }, 400);
  }, 4000);
}

/* \u2500\u2500 TOAST \u2500\u2500 */
function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast toast-' + (type || 'success') + ' show';
  setTimeout(function() { t.classList.remove('show'); }, 3200);
}

/* \u2500\u2500 SLEEP \u2500\u2500 */
var sleepMessages = {
  0:'No sleep logged',2:'Very little sleep \u2014 rest more tonight',4:'Below average \u2014 aim for 7\u20138h',
  5:'Below average \u2014 aim for 7\u20138h',6:'Good \u2014 keto adaptation benefits from 7+ hours',
  7:'Ideal for keto adaptation \u{1F44D}',8:'Great sleep! Optimal for fat burning',
  9:'Excellent! Deep sleep boosts ketone production',10:'Plenty of rest',
  11:'A lot of sleep \u2014 normal if recovering',12:'Full 12h sleep logged',
};
window.updateSleepHours = function(val) {
  state.sleep_hours = parseFloat(val);
  var el = document.getElementById('sleepHoursDisplay');
  if (el) el.textContent = val + 'h';
  var msg = document.getElementById('sleepMsg');
  if (msg) {
    var key = Math.round(parseFloat(val));
    var txt = sleepMessages[key] || (val + ' hours logged');
    msg.textContent = val + ' hours \u2014 ' + txt.replace(/^\\\\d+[^\u2014]*\u2014 ?/, '');
  }
};
window.setSleepQuality = function(n) {
  state.sleep_quality = n;
  document.querySelectorAll('.sleep-star').forEach(function(btn) {
    var bn = parseInt(btn.getAttribute('data-n'));
    btn.style.background = bn <= n ? 'rgba(99,102,241,.2)' : 'var(--card2)';
    btn.style.borderColor = bn <= n ? 'rgba(99,102,241,.5)' : 'var(--border)';
    btn.style.transform = bn === n ? 'scale(1.15)' : 'scale(1)';
  });
};

window.rateStar     = rateStar;
window.toggleSymptom= toggleSymptom;
window.toggleComp   = toggleComp;
window.toggleElec   = toggleElec;
window.saveCheckin  = saveCheckin;
})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "checkin", "data-astro-cid-kuyasrws": true }), alreadyDone && renderTemplate`<div style="background:linear-gradient(135deg,rgba(16,185,129,.15),rgba(52,211,153,.08));border:1px solid rgba(16,185,129,.35);border-radius:16px;padding:1rem 1.25rem;display:flex;align-items:center;gap:.875rem;margin-bottom:1rem;" data-astro-cid-kuyasrws> ${renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 24, "color": "var(--green2)", "data-astro-cid-kuyasrws": true })} <div data-astro-cid-kuyasrws> <div style="font-weight:700;color:var(--green2);font-size:.9rem;" data-astro-cid-kuyasrws>Already checked in today</div> <div style="font-size:.8rem;color:var(--soft);" data-astro-cid-kuyasrws>You can update your check-in anytime — changes save instantly.</div> </div> </div>`, alreadyDone ? renderTemplate`${renderComponent($$result, "Edit3", $$Edit3, { "size": 22, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true })}` : renderTemplate`${renderComponent($$result, "BookOpen", $$BookOpen, { "size": 22, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true })}`, alreadyDone ? `Update today's check-in, ${userName}` : `${greeting}, ${userName} \u2014 share how you feel today and earn XP`, renderComponent($$result, "Calendar", $$Calendar, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true }), currentDay, !alreadyDone && renderTemplate`<span class="ci-badge-xp" data-astro-cid-kuyasrws>${renderComponent($$result, "Zap", $$Zap, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true })} Earn +50 XP</span>`, alreadyDone && renderTemplate`<span class="ci-badge-xp" style="background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.3);color:var(--green2);" data-astro-cid-kuyasrws>${renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true })} Updating</span>`, isFirstWeek && renderTemplate`<div class="flu-alert" id="fluAlert" data-astro-cid-kuyasrws> <div class="flu-head" data-astro-cid-kuyasrws> <div class="flu-icon" data-astro-cid-kuyasrws>${renderComponent($$result, "AlertTriangle", $$AlertTriangle, { "size": 20, "data-astro-cid-kuyasrws": true })}</div> <div data-astro-cid-kuyasrws> <div class="flu-title" data-astro-cid-kuyasrws>Week 1 — Watch for Keto Flu</div> <div class="flu-desc" data-astro-cid-kuyasrws>Days 2-5 are the hardest. Your body is switching from sugar to fat as fuel. These symptoms are normal and temporary.</div> </div> </div> <div class="flu-tips" data-astro-cid-kuyasrws> <div class="flu-tip" data-astro-cid-kuyasrws> <div class="flu-tip-icon" data-astro-cid-kuyasrws>💧</div> <div data-astro-cid-kuyasrws><strong data-astro-cid-kuyasrws>Drink 100+ oz water/day.</strong> Keto flushes water and electrolytes rapidly in week 1.</div> </div> <div class="flu-tip" data-astro-cid-kuyasrws> <div class="flu-tip-icon" data-astro-cid-kuyasrws>🧂</div> <div data-astro-cid-kuyasrws><strong data-astro-cid-kuyasrws>Add salt to everything.</strong> Sodium deficiency causes most keto flu symptoms. Add ½ tsp salt to water.</div> </div> <div class="flu-tip" data-astro-cid-kuyasrws> <div class="flu-tip-icon" data-astro-cid-kuyasrws>🥑</div> <div data-astro-cid-kuyasrws><strong data-astro-cid-kuyasrws>Eat enough fat.</strong> Don't restrict calories in week 1. Fat = fuel. Avocado, olive oil, nuts are your friends.</div> </div> <div class="flu-tip" data-astro-cid-kuyasrws> <div class="flu-tip-icon" data-astro-cid-kuyasrws>😴</div> <div data-astro-cid-kuyasrws><strong data-astro-cid-kuyasrws>Sleep 7-9 hours.</strong> Your body adapts faster when you rest. Avoid intense workouts in days 2-4.</div> </div> </div> </div>`, renderComponent($$result, "Activity", $$Activity, { "size": 18, "data-astro-cid-kuyasrws": true }), prefill.energy, addAttribute(prefill.energy, "value"), prefill.mood, addAttribute(prefill.mood, "value"), prefill.hunger, addAttribute(prefill.hunger, "value"), isFirstWeek && renderTemplate`<div class="section" style="animation-delay:.1s;" data-astro-cid-kuyasrws> <div class="section-head" data-astro-cid-kuyasrws> <div class="sh-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 10px rgba(239,68,68,.25);" data-astro-cid-kuyasrws>${renderComponent($$result, "Activity", $$Activity, { "size": 18, "data-astro-cid-kuyasrws": true })}</div> <div class="sh-title" data-astro-cid-kuyasrws>Any keto flu symptoms?</div> <div class="sh-chip" style="background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.2);color:var(--red2);" data-astro-cid-kuyasrws>Week 1</div> </div> <div class="section-body" data-astro-cid-kuyasrws> <p style="font-size:.78rem;color:var(--soft);margin-bottom:1rem;line-height:1.5;" data-astro-cid-kuyasrws>
Tap any symptoms you're experiencing today. We'll give you targeted advice to overcome them.
</p> <div class="pill-toggle-grid" data-astro-cid-kuyasrws> ${[
    { val: "headache", icon: "\u{1F915}", label: "Headache", color: "red" },
    { val: "fatigue", icon: "\u{1F634}", label: "Fatigue", color: "red" },
    { val: "brain_fog", icon: "\u{1F32B}\uFE0F", label: "Brain Fog", color: "red" },
    { val: "nausea", icon: "\u{1F922}", label: "Nausea", color: "red" },
    { val: "dizziness", icon: "\u{1F4AB}", label: "Dizziness", color: "red" },
    { val: "irritable", icon: "\u{1F624}", label: "Irritability", color: "red" },
    { val: "cramps", icon: "\u26A1", label: "Muscle Cramps", color: "red" },
    { val: "none", icon: "\u2705", label: "Feeling Great!", color: "green" }
  ].map((s) => renderTemplate`<div class="pill-toggle"${addAttribute(s.val, "data-val")}${addAttribute(s.color, "data-color")} onclick="toggleSymptom(this)" data-astro-cid-kuyasrws> <span class="pt-icon" data-astro-cid-kuyasrws>${s.icon}</span> <span class="pt-label" data-astro-cid-kuyasrws>${s.label}</span> <span class="pt-check" data-astro-cid-kuyasrws>✓</span> </div>`)} </div>  <div id="fluAdvice" style="display:none;margin-top:1rem;" data-astro-cid-kuyasrws></div> </div> </div>`, renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 18, "data-astro-cid-kuyasrws": true }), hasFasting && renderTemplate`<div class="comp-card" id="comp-fast" onclick="toggleComp(this,'fast')" data-astro-cid-kuyasrws> <div class="cc-icon" data-astro-cid-kuyasrws>⏰</div> <div class="cc-label" data-astro-cid-kuyasrws>Completed Fast</div> <div class="cc-sub" data-astro-cid-kuyasrws>${fastingProtocol.replace("_", ":")} protocol</div> </div>`, renderComponent($$result, "Droplets", $$Droplets, { "size": 18, "data-astro-cid-kuyasrws": true }), [1, 2, 3, 4, 5, 6, 7, 8].map((n) => renderTemplate`<button class="wglass-btn"${addAttribute(n, "data-n")} onclick="window.setWater(this)"${addAttribute(`${n} glass${n > 1 ? "es" : ""}`, "title")} data-astro-cid-kuyasrws>${renderComponent($$result, "Droplets", $$Droplets, { "size": 16, "data-astro-cid-kuyasrws": true })}</button>`), renderComponent($$result, "Target", $$Target, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true }), isFirstWeek ? "10\u201312 glasses" : "8\u201310 glasses", isFirstWeek ? "Extra water in week 1 flushes out adaptation toxins" : "Consistent hydration maintains ketosis efficiency", renderComponent($$result, "Zap", $$Zap, { "size": 18, "data-astro-cid-kuyasrws": true }), [
    { val: "sodium", icon: "\u{1F9C2}", label: "Sodium", sub: "Salt in food/water", amount: "2000-4000mg" },
    { val: "potassium", icon: "\u{1F34C}", label: "Potassium", sub: "Avocado, meat, nuts", amount: "3500-4700mg" },
    { val: "magnesium", icon: "\u{1F966}", label: "Magnesium", sub: "Supplement at night", amount: "300-500mg" }
  ].map((e) => renderTemplate`<div class="elec-card"${addAttribute(e.val, "data-val")} onclick="toggleElec(this)" data-astro-cid-kuyasrws> <div class="elec-icon" data-astro-cid-kuyasrws>${e.icon}</div> <div class="elec-label" data-astro-cid-kuyasrws>${e.label}</div> <div class="elec-sub" data-astro-cid-kuyasrws>${e.sub}</div> <div class="elec-amount" data-astro-cid-kuyasrws>${e.amount}</div> </div>`), renderComponent($$result, "Edit3", $$Edit3, { "size": 18, "data-astro-cid-kuyasrws": true }), renderComponent($$result, "Moon", $$Moon, { "size": 18, "data-astro-cid-kuyasrws": true }), [1, 2, 3, 4, 5].map((n) => renderTemplate`<button${addAttribute(`window.setSleepQuality(${n})`, "onclick")} style="width:32px;height:32px;border-radius:8px;border:1.5px solid var(--border);background:var(--card2);font-size:1rem;cursor:pointer;transition:all .2s;" class="sleep-star"${addAttribute(n, "data-n")} data-astro-cid-kuyasrws>⭐</button>`), alreadyDone ? "Update Check-in" : "Complete Check-in \xB7 +50 XP", renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 72, "color": "var(--green)", "data-astro-cid-kuyasrws": true }), currentDay, renderComponent($$result, "Star", $$Star, { "size": 18, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true }), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-kuyasrws": true }), renderComponent($$result, "Home", $$Home, { "size": 16, "data-astro-cid-kuyasrws": true }), defineScriptVars({ currentDay, isFirstWeek, hasFasting, fastingProtocol, macroGoals, energyEmojis, moodEmojis, hungerEmojis, prefill, alreadyDone }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/checkin.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/checkin.astro";
const $$url = "/dashboard/checkin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Checkin,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
