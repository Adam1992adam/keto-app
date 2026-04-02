/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, g as addAttribute, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import 'clsx';
import { a as requireLogin } from '../../chunks/auth_DxNH3rhr.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Expired = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Expired;
  const auth = await requireLogin(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { profile } = auth;
  if (profile.subscription_status === "active" && profile.subscription_end_date && new Date(profile.subscription_end_date) > /* @__PURE__ */ new Date()) {
    return Astro2.redirect("/dashboard/");
  }
  const currentTier = profile.subscription_tier;
  const userName = profile.full_name?.split(" ")[0] || "Friend";
  const endDate = profile.subscription_end_date ? new Date(profile.subscription_end_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "recently";
  const LS_URL = "https://new-keto-plan.lemonsqueezy.com/checkout/buy/b975765f-a640-4cec-b3ef-44112acc9f75";
  const allPlans = [
    {
      id: "basic_30",
      name: "Basic",
      emoji: "🥑",
      price: "29.99",
      period: "30 days",
      color: "#10b981",
      gradient: "linear-gradient(135deg,#10b981,#34d399)",
      perks: ["30-day meal plan", "30 keto recipes", "4 eBooks", "Basic tracking"],
      popular: false
    },
    {
      id: "pro_6",
      name: "Pro",
      emoji: "⚡",
      price: "99.99",
      period: "6 months",
      color: "#6366f1",
      gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      perks: ["6-month meal plan", "87+ recipes", "8 eBooks", "Advanced analytics", "Priority support"],
      popular: true
    },
    {
      id: "elite_12",
      name: "Elite",
      emoji: "👑",
      price: "199.99",
      period: "12 months",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)",
      perks: ["12-month meal plan", "Unlimited recipes", "12 eBooks", "AI Keto Coach", "24/7 support", "Community access"],
      popular: false
    }
  ];
  const suggestedPlans = currentTier === "basic_30" ? allPlans.filter((p) => p.id !== "basic_30") : currentTier === "pro_6" ? allPlans.filter((p) => p.id === "elite_12") : allPlans;
  const tierMeta = {
    basic_30: {
      badge: "30 Days ✓",
      badgeColor: "#10b981",
      badgeBg: "rgba(16,185,129,0.1)",
      icon: "🏅",
      iconBg: "rgba(16,185,129,0.1)",
      title: `You completed your 30-Day Keto Foundation!`,
      sub: `Your body has adapted to ketosis. Now it's time to go deeper.`,
      headline: `Your 30 Days Are Up — But Your Journey Isn't, ${userName}`,
      body: `You took the first step and proved you can do it. Your body is already adapting to keto. Now is the perfect time to lock in your results with a longer plan.`,
      sectionLabel: "⬆️ Keep the momentum going"
    },
    pro_6: {
      badge: "6 Months ✓",
      badgeColor: "#818cf8",
      badgeBg: "rgba(99,102,241,0.1)",
      icon: "🥈",
      iconBg: "rgba(99,102,241,0.1)",
      title: `6 months of consistent keto — incredible!`,
      sub: `You're in the top 5% of people who actually stick with it.`,
      headline: `6 Months Strong, ${userName} — Ready for the Next Level?`,
      body: `You've proven you can sustain keto for months. Imagine what a full year with unlimited recipes, an AI Keto Coach, and a community behind you could do.`,
      sectionLabel: "👑 Unlock the full experience"
    },
    elite_12: {
      badge: "12 Months ✓",
      badgeColor: "#fbbf24",
      badgeBg: "rgba(245,158,11,0.1)",
      icon: "👑",
      iconBg: "rgba(245,158,11,0.1)",
      title: `A full year of Elite Keto — you're a legend!`,
      sub: `Your commitment has been extraordinary. Ready for year two?`,
      headline: `One Year Done, ${userName}. Your Story Continues.`,
      body: `Your dedication over the past year has been remarkable. Your progress, your recipes, your community — all waiting for you. Let's keep writing this story together.`,
      sectionLabel: "🔄 Renew your elite access"
    }
  };
  const meta = tierMeta[currentTier] || tierMeta.basic_30;
  const plansJson = JSON.stringify(suggestedPlans);
  const defaultSelected = suggestedPlans.find((p) => p.popular)?.id || suggestedPlans[suggestedPlans.length - 1]?.id || "";
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-5nockxjy> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Continue Your Journey — Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-5nockxjy> <div class="bg-mesh" data-astro-cid-5nockxjy> <div class="orb o1" data-astro-cid-5nockxjy></div> <div class="orb o2" data-astro-cid-5nockxjy></div> <div class="orb o3" data-astro-cid-5nockxjy></div> </div> <div class="page" data-astro-cid-5nockxjy> <!-- Top Bar --> <nav class="topbar" data-astro-cid-5nockxjy> <div class="logo" data-astro-cid-5nockxjy>🥑 Keto Journey</div> <div class="tag-exp" data-astro-cid-5nockxjy>⏰ Plan Expired</div> </nav> <!-- Hero --> <div class="hero" data-astro-cid-5nockxjy> <p class="hero-meta" data-astro-cid-5nockxjy>Expired on ', "</p> <h1 data-astro-cid-5nockxjy> ", ' <span class="hl" data-astro-cid-5nockxjy>', "</span> ", " </h1> <p data-astro-cid-5nockxjy>", '</p> </div> <!-- Achievement --> <div class="achiev" data-astro-cid-5nockxjy> <div class="achiev-icon"', " data-astro-cid-5nockxjy>", '</div> <div class="achiev-text" data-astro-cid-5nockxjy> <h3 data-astro-cid-5nockxjy>', "</h3> <p data-astro-cid-5nockxjy>", '</p> </div> <div class="achiev-badge"', " data-astro-cid-5nockxjy>", '</div> </div> <!-- Plans --> <p class="slabel" data-astro-cid-5nockxjy>', '</p> <div class="plans" data-astro-cid-5nockxjy> ', ' </div> <!-- CTA --> <div class="cta" data-astro-cid-5nockxjy> <button class="btn-go" id="btnGo" data-astro-cid-5nockxjy> <span data-astro-cid-5nockxjy>🚀</span> <span id="ctaText" data-astro-cid-5nockxjy>', '</span> <span style="margin-left:auto;opacity:.7;font-size:.85rem;" data-astro-cid-5nockxjy>→</span> </button> <a href="/login" class="btn-back" data-astro-cid-5nockxjy>← Back to login</a> <div class="guarantee" data-astro-cid-5nockxjy> <div class="guarantee-ico" data-astro-cid-5nockxjy>🛡️</div> <div class="guarantee-txt" data-astro-cid-5nockxjy> <h4 data-astro-cid-5nockxjy>30-Day Money-Back Guarantee</h4> <p data-astro-cid-5nockxjy>Not happy? Full refund within 30 days — no questions, no hassle.</p> </div> </div> </div> </div> <script>(function(){', "\n  const plans = JSON.parse(plansJson);\n  let sel = defaultSelected;\n\n  const ctaLabels = {\n    basic_30: 'Continue with Basic — 30 Days',\n    pro_6:    'Unlock Pro — 6 Months',\n    elite_12: 'Go Elite — Full Year',\n  };\n\n  function pick(id) {\n    sel = id;\n    const plan = plans.find(p => p.id === id);\n\n    plans.forEach(p => {\n      const card = document.getElementById('pc-' + p.id);\n      if (!card) return;\n      card.classList.remove('sel');\n      const btn = card.querySelector('.psel-btn');\n      btn.textContent = 'Select';\n      btn.style = '';\n    });\n\n    const card = document.getElementById('pc-' + id);\n    if (card) {\n      card.classList.add('sel');\n      const btn = card.querySelector('.psel-btn');\n      btn.textContent = '✓ Selected';\n      btn.style = `background:${plan.gradient};border-color:transparent;`;\n    }\n\n    document.getElementById('ctaText').textContent = ctaLabels[id] || 'Continue Your Journey';\n  }\n  window.pick = pick;\n\n  document.getElementById('btnGo').addEventListener('click', () => {\n    window.location.href = LS_URL;\n  });\n\n  // Init\n  if (sel) pick(sel);\n})();</script> </body> </html>"], ['<html lang="en" data-astro-cid-5nockxjy> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Continue Your Journey — Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-5nockxjy> <div class="bg-mesh" data-astro-cid-5nockxjy> <div class="orb o1" data-astro-cid-5nockxjy></div> <div class="orb o2" data-astro-cid-5nockxjy></div> <div class="orb o3" data-astro-cid-5nockxjy></div> </div> <div class="page" data-astro-cid-5nockxjy> <!-- Top Bar --> <nav class="topbar" data-astro-cid-5nockxjy> <div class="logo" data-astro-cid-5nockxjy>🥑 Keto Journey</div> <div class="tag-exp" data-astro-cid-5nockxjy>⏰ Plan Expired</div> </nav> <!-- Hero --> <div class="hero" data-astro-cid-5nockxjy> <p class="hero-meta" data-astro-cid-5nockxjy>Expired on ', "</p> <h1 data-astro-cid-5nockxjy> ", ' <span class="hl" data-astro-cid-5nockxjy>', "</span> ", " </h1> <p data-astro-cid-5nockxjy>", '</p> </div> <!-- Achievement --> <div class="achiev" data-astro-cid-5nockxjy> <div class="achiev-icon"', " data-astro-cid-5nockxjy>", '</div> <div class="achiev-text" data-astro-cid-5nockxjy> <h3 data-astro-cid-5nockxjy>', "</h3> <p data-astro-cid-5nockxjy>", '</p> </div> <div class="achiev-badge"', " data-astro-cid-5nockxjy>", '</div> </div> <!-- Plans --> <p class="slabel" data-astro-cid-5nockxjy>', '</p> <div class="plans" data-astro-cid-5nockxjy> ', ' </div> <!-- CTA --> <div class="cta" data-astro-cid-5nockxjy> <button class="btn-go" id="btnGo" data-astro-cid-5nockxjy> <span data-astro-cid-5nockxjy>🚀</span> <span id="ctaText" data-astro-cid-5nockxjy>', '</span> <span style="margin-left:auto;opacity:.7;font-size:.85rem;" data-astro-cid-5nockxjy>→</span> </button> <a href="/login" class="btn-back" data-astro-cid-5nockxjy>← Back to login</a> <div class="guarantee" data-astro-cid-5nockxjy> <div class="guarantee-ico" data-astro-cid-5nockxjy>🛡️</div> <div class="guarantee-txt" data-astro-cid-5nockxjy> <h4 data-astro-cid-5nockxjy>30-Day Money-Back Guarantee</h4> <p data-astro-cid-5nockxjy>Not happy? Full refund within 30 days — no questions, no hassle.</p> </div> </div> </div> </div> <script>(function(){', "\n  const plans = JSON.parse(plansJson);\n  let sel = defaultSelected;\n\n  const ctaLabels = {\n    basic_30: 'Continue with Basic — 30 Days',\n    pro_6:    'Unlock Pro — 6 Months',\n    elite_12: 'Go Elite — Full Year',\n  };\n\n  function pick(id) {\n    sel = id;\n    const plan = plans.find(p => p.id === id);\n\n    plans.forEach(p => {\n      const card = document.getElementById('pc-' + p.id);\n      if (!card) return;\n      card.classList.remove('sel');\n      const btn = card.querySelector('.psel-btn');\n      btn.textContent = 'Select';\n      btn.style = '';\n    });\n\n    const card = document.getElementById('pc-' + id);\n    if (card) {\n      card.classList.add('sel');\n      const btn = card.querySelector('.psel-btn');\n      btn.textContent = '✓ Selected';\n      btn.style = \\`background:\\${plan.gradient};border-color:transparent;\\`;\n    }\n\n    document.getElementById('ctaText').textContent = ctaLabels[id] || 'Continue Your Journey';\n  }\n  window.pick = pick;\n\n  document.getElementById('btnGo').addEventListener('click', () => {\n    window.location.href = LS_URL;\n  });\n\n  // Init\n  if (sel) pick(sel);\n})();</script> </body> </html>"])), renderHead(), endDate, meta.headline.replace(userName, "___SPLIT___").split("___SPLIT___").map((part, i) => i === 0 ? part : null), userName, meta.headline.replace(userName, "___SPLIT___").split("___SPLIT___")[1], meta.body, addAttribute(`background:${meta.iconBg};`, "style"), meta.icon, meta.title, meta.sub, addAttribute(`background:${meta.badgeBg};color:${meta.badgeColor};`, "style"), meta.badge, meta.sectionLabel, suggestedPlans.map((plan) => renderTemplate`<div${addAttribute(`pcard ${plan.id === defaultSelected ? "sel" : ""}`, "class")}${addAttribute(`pc-${plan.id}`, "id")}${addAttribute(`pick('${plan.id}')`, "onclick")}${addAttribute(`--pc:${plan.color};`, "style")} data-astro-cid-5nockxjy> <div class="pglow"${addAttribute(`background:${plan.color};`, "style")} data-astro-cid-5nockxjy></div> ${plan.popular && suggestedPlans.length > 1 && renderTemplate`<div class="pop-tag" style="background:rgba(99,102,241,.15);color:#818cf8;border:1px solid rgba(99,102,241,.25);" data-astro-cid-5nockxjy>
Most Popular
</div>`} <span class="pemoji" data-astro-cid-5nockxjy>${plan.emoji}</span> <div class="pname"${addAttribute(`color:${plan.color};`, "style")} data-astro-cid-5nockxjy>${plan.name}</div> <div class="pperiod" data-astro-cid-5nockxjy>${plan.period}</div> <div class="pprice"${addAttribute(`background:${plan.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;`, "style")} data-astro-cid-5nockxjy>
$${plan.price} <small data-astro-cid-5nockxjy>one-time</small> </div> <ul class="pperks" data-astro-cid-5nockxjy> ${plan.perks.map((perk) => renderTemplate`<li data-astro-cid-5nockxjy><span class="ck"${addAttribute(`color:${plan.color};`, "style")} data-astro-cid-5nockxjy>✓</span> ${perk}</li>`)} </ul> <button class="psel-btn"${addAttribute(plan.id === defaultSelected ? `background:${plan.gradient};border-color:transparent;` : "", "style")} data-astro-cid-5nockxjy> ${plan.id === defaultSelected ? "✓ Selected" : "Select"} </button> </div>`), meta.sectionLabel.split(" ").slice(1).join(" "), defineScriptVars({ LS_URL, plansJson, defaultSelected }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/expired.astro", void 0);
const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/expired.astro";
const $$url = "/dashboard/expired";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Expired,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
