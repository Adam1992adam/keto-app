/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { f as getPlan, d as getUserJourney, k as getDailyTasks } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { a as requireLogin } from '../../chunks/auth_DxNH3rhr.mjs';
import { $ as $$Users, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Lock } from '../../chunks/Lock_qAq--S7c.mjs';
import { $ as $$Award } from '../../chunks/Award_DmLGcvZ_.mjs';
import { $ as $$ChevronRight } from '../../chunks/ChevronRight_CcdluzLT.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Share2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Share2;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "share-2", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="18" cy="5" r="3"></circle> <circle cx="6" cy="12" r="3"></circle> <circle cx="18" cy="19" r="3"></circle> <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line> <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Share2.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Upgrade = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Upgrade;
  const auth = await requireLogin(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const currentPlan = getPlan(profile.subscription_tier);
  const isSubscribed = profile?.subscription_status === "active";
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "👑 Elite" : planType === "pro_6" ? "⚡ Pro" : "🥑 Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const journey = await getUserJourney(user.id);
  const currentDay = journey?.current_day || 1;
  const dailyTasks = await getDailyTasks(user.id, currentDay);
  dailyTasks?.filter((t) => t.task_type !== "reflection" && t.task_type !== "weight" && !t.completed) || [];
  const LS_URL = "https://new-keto-plan.lemonsqueezy.com/checkout/buy/b975765f-a640-4cec-b3ef-44112acc9f75";
  const plans = [
    {
      id: "basic_30",
      name: "Basic",
      emoji: "🥑",
      tagline: "Perfect Start",
      price: 29.99,
      duration: "30 Days",
      perMonth: null,
      gradient: "linear-gradient(135deg,#10b981,#059669)",
      glow: "rgba(16,185,129,.35)",
      border: "rgba(16,185,129,.3)",
      accent: "#10b981",
      popular: false,
      features: [
        { text: "30-day meal plan", included: true },
        { text: "30 keto recipes", included: true },
        { text: "4 free eBooks", included: true },
        { text: "Dashboard & tracking", included: true },
        { text: "Water & macros tracker", included: true },
        { text: "Basic analytics", included: true },
        { text: "87+ recipes library", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
        { text: "AI Keto Coach", included: false }
      ]
    },
    {
      id: "pro_6",
      name: "Pro",
      emoji: "⚡",
      tagline: "Most Popular",
      price: 99.99,
      duration: "6 Months",
      perMonth: 16.67,
      gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      glow: "rgba(99,102,241,.35)",
      border: "rgba(99,102,241,.4)",
      accent: "#6366f1",
      popular: true,
      features: [
        { text: "6-month meal plan", included: true },
        { text: "87+ keto recipes", included: true },
        { text: "8 free eBooks", included: true },
        { text: "Dashboard & tracking", included: true },
        { text: "Water & macros tracker", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority support", included: true },
        { text: "Weekly progress reports", included: true },
        { text: "Community access", included: false },
        { text: "AI Keto Coach", included: false }
      ]
    },
    {
      id: "elite_12",
      name: "Elite",
      emoji: "👑",
      tagline: "Best Value",
      price: 199.99,
      duration: "12 Months",
      perMonth: 16.67,
      gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
      glow: "rgba(245,158,11,.35)",
      border: "rgba(245,158,11,.35)",
      accent: "#f59e0b",
      popular: false,
      features: [
        { text: "12-month meal plan", included: true },
        { text: "Unlimited recipes", included: true },
        { text: "12 free eBooks", included: true },
        { text: "Dashboard & tracking", included: true },
        { text: "Water & macros tracker", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Weekly progress reports", included: true },
        { text: "Community access", included: true },
        { text: "AI Keto Coach 🤖", included: true }
      ]
    }
  ];
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-birseqst> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Upgrade — Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet"><script>
    (function(){
      const t = localStorage.getItem('keto-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>`, '</head> <body data-astro-cid-birseqst> <div class="bg-mesh" aria-hidden="true" data-astro-cid-birseqst> <div class="orb o1" data-astro-cid-birseqst></div><div class="orb o2" data-astro-cid-birseqst></div><div class="orb o3" data-astro-cid-birseqst></div> </div> <!-- NAV --> ', ' <!-- PAGE --> <div class="page" data-astro-cid-birseqst> <!-- HERO --> <div class="hero" data-astro-cid-birseqst> <div class="hero-badge" data-astro-cid-birseqst>', ' Level Up Your Journey</div> <h1 class="hero-title" data-astro-cid-birseqst>\nChoose Your<br data-astro-cid-birseqst><span class="hl" data-astro-cid-birseqst>Keto Plan</span> </h1> <p class="hero-sub" data-astro-cid-birseqst>One-time payment. Lifetime access. Cancel-free — results guaranteed or your money back.</p> </div> <!-- TRUST BADGES --> <div class="trust-row" data-astro-cid-birseqst> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>30-Day Guarantee</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>Secure Checkout</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>Instant Access</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', "</div> <span data-astro-cid-birseqst>10,000+ Users</span> </div> </div> <!-- CURRENT PLAN --> ", ' <!-- PLANS --> <div class="plans-grid" data-astro-cid-birseqst> ', ' </div> <!-- COMPARISON TABLE --> <div class="compare-section" data-astro-cid-birseqst> <div class="compare-title" data-astro-cid-birseqst>Full Comparison</div> <div class="compare-row header" data-astro-cid-birseqst> <div class="compare-cell header-cell" data-astro-cid-birseqst>Feature</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Basic</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Pro</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Elite</div> </div> ', ' </div> <!-- FAQ --> <div class="faq-section" data-astro-cid-birseqst> <div class="faq-title" data-astro-cid-birseqst>Frequently Asked Questions</div> <div class="faq-grid" data-astro-cid-birseqst> ', ' </div> </div> <!-- GUARANTEE --> <div class="guarantee" data-astro-cid-birseqst> <div class="guarantee-icon" data-astro-cid-birseqst>', '</div> <div class="guarantee-title" data-astro-cid-birseqst>30-Day Money-Back Guarantee</div> <p class="guarantee-sub" data-astro-cid-birseqst>Not satisfied with your results? Contact us within 30 days for a full refund — no questions asked. We stand behind every plan.</p> </div> </div><!-- /page --> <!-- MODAL --> <div class="modal-overlay" id="modalOverlay" data-astro-cid-birseqst> <div class="modal" data-astro-cid-birseqst> <button class="modal-close" onclick="closeModal()" data-astro-cid-birseqst>×</button> <div class="modal-title" data-astro-cid-birseqst>Confirm Upgrade ', `</div> <p class="modal-sub" data-astro-cid-birseqst>You'll be redirected to our secure checkout to complete your payment instantly.</p> <div class="modal-plan-box" data-astro-cid-birseqst> <div class="modal-plan-emoji" id="modalEmoji" data-astro-cid-birseqst></div> <div data-astro-cid-birseqst> <div class="modal-plan-name" id="modalName" data-astro-cid-birseqst></div> <div class="modal-plan-price" id="modalPrice" data-astro-cid-birseqst></div> </div> </div> <div class="modal-actions" data-astro-cid-birseqst> <button class="modal-confirm" id="modalConfirm" data-astro-cid-birseqst>Continue to Secure Checkout →</button> <button class="modal-cancel" onclick="closeModal()" data-astro-cid-birseqst>Cancel</button> </div> </div> </div> <div class="toast" id="toast" data-astro-cid-birseqst></div> <script>(function(){`, "\n\n// ── THEME ──\nconst html = document.documentElement;\nconst themeBtn = document.getElementById('themeBtn');\nfunction applyTheme(t) {\n  html.setAttribute('data-theme', t);\n  localStorage.setItem('keto-theme', t);\n  if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';\n}\napplyTheme(localStorage.getItem('keto-theme') || 'dark');\nthemeBtn?.addEventListener('click', () => {\n  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');\n});\n\n// ── NOTIFS ──\nconst notifBtn  = document.getElementById('notifBtn');\nconst notifDrop = document.getElementById('notifDropdown');\nnotifBtn?.addEventListener('click', e => { e.stopPropagation(); notifDrop?.classList.toggle('open'); });\ndocument.addEventListener('click', e => { if (notifDrop && !notifDrop.contains(e.target) && e.target !== notifBtn) notifDrop.classList.remove('open'); });\n\n// ── MODAL ──\nlet checkoutUrl = LS_URL;\n\nfunction openModal(btn) {\n  document.getElementById('modalEmoji').textContent = btn.dataset.planEmoji;\n  document.getElementById('modalName').textContent  = `${btn.dataset.planName} Plan — ${btn.dataset.planDuration}`;\n  document.getElementById('modalPrice').textContent = `$${btn.dataset.planPrice} one-time payment`;\n  checkoutUrl = LS_URL;\n  document.getElementById('modalOverlay').classList.add('show');\n}\n\nfunction closeModal() {\n  document.getElementById('modalOverlay').classList.remove('show');\n}\n\ndocument.getElementById('modalOverlay').addEventListener('click', e => {\n  if (e.target === document.getElementById('modalOverlay')) closeModal();\n});\n\ndocument.getElementById('modalConfirm').addEventListener('click', () => {\n  closeModal();\n  window.open(checkoutUrl, '_blank');\n  showToast('🚀 Redirecting to checkout...');\n});\n\nfunction showToast(msg) {\n  const t = document.getElementById('toast');\n  if (!t) return;\n  t.textContent = msg;\n  t.className = 'toast show';\n  setTimeout(() => t.classList.remove('show'), 2800);\n}\n\nwindow.openModal  = openModal;\nwindow.closeModal = closeModal;\n\n})();</script> </body> </html>"], [`<html lang="en" data-astro-cid-birseqst> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Upgrade — Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet"><script>
    (function(){
      const t = localStorage.getItem('keto-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>`, '</head> <body data-astro-cid-birseqst> <div class="bg-mesh" aria-hidden="true" data-astro-cid-birseqst> <div class="orb o1" data-astro-cid-birseqst></div><div class="orb o2" data-astro-cid-birseqst></div><div class="orb o3" data-astro-cid-birseqst></div> </div> <!-- NAV --> ', ' <!-- PAGE --> <div class="page" data-astro-cid-birseqst> <!-- HERO --> <div class="hero" data-astro-cid-birseqst> <div class="hero-badge" data-astro-cid-birseqst>', ' Level Up Your Journey</div> <h1 class="hero-title" data-astro-cid-birseqst>\nChoose Your<br data-astro-cid-birseqst><span class="hl" data-astro-cid-birseqst>Keto Plan</span> </h1> <p class="hero-sub" data-astro-cid-birseqst>One-time payment. Lifetime access. Cancel-free — results guaranteed or your money back.</p> </div> <!-- TRUST BADGES --> <div class="trust-row" data-astro-cid-birseqst> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>30-Day Guarantee</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>Secure Checkout</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', '</div> <span data-astro-cid-birseqst>Instant Access</span> </div> <div class="trust-item" data-astro-cid-birseqst> <div class="trust-icon" data-astro-cid-birseqst>', "</div> <span data-astro-cid-birseqst>10,000+ Users</span> </div> </div> <!-- CURRENT PLAN --> ", ' <!-- PLANS --> <div class="plans-grid" data-astro-cid-birseqst> ', ' </div> <!-- COMPARISON TABLE --> <div class="compare-section" data-astro-cid-birseqst> <div class="compare-title" data-astro-cid-birseqst>Full Comparison</div> <div class="compare-row header" data-astro-cid-birseqst> <div class="compare-cell header-cell" data-astro-cid-birseqst>Feature</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Basic</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Pro</div> <div class="compare-cell header-cell center" data-astro-cid-birseqst>Elite</div> </div> ', ' </div> <!-- FAQ --> <div class="faq-section" data-astro-cid-birseqst> <div class="faq-title" data-astro-cid-birseqst>Frequently Asked Questions</div> <div class="faq-grid" data-astro-cid-birseqst> ', ' </div> </div> <!-- GUARANTEE --> <div class="guarantee" data-astro-cid-birseqst> <div class="guarantee-icon" data-astro-cid-birseqst>', '</div> <div class="guarantee-title" data-astro-cid-birseqst>30-Day Money-Back Guarantee</div> <p class="guarantee-sub" data-astro-cid-birseqst>Not satisfied with your results? Contact us within 30 days for a full refund — no questions asked. We stand behind every plan.</p> </div> </div><!-- /page --> <!-- MODAL --> <div class="modal-overlay" id="modalOverlay" data-astro-cid-birseqst> <div class="modal" data-astro-cid-birseqst> <button class="modal-close" onclick="closeModal()" data-astro-cid-birseqst>×</button> <div class="modal-title" data-astro-cid-birseqst>Confirm Upgrade ', `</div> <p class="modal-sub" data-astro-cid-birseqst>You'll be redirected to our secure checkout to complete your payment instantly.</p> <div class="modal-plan-box" data-astro-cid-birseqst> <div class="modal-plan-emoji" id="modalEmoji" data-astro-cid-birseqst></div> <div data-astro-cid-birseqst> <div class="modal-plan-name" id="modalName" data-astro-cid-birseqst></div> <div class="modal-plan-price" id="modalPrice" data-astro-cid-birseqst></div> </div> </div> <div class="modal-actions" data-astro-cid-birseqst> <button class="modal-confirm" id="modalConfirm" data-astro-cid-birseqst>Continue to Secure Checkout →</button> <button class="modal-cancel" onclick="closeModal()" data-astro-cid-birseqst>Cancel</button> </div> </div> </div> <div class="toast" id="toast" data-astro-cid-birseqst></div> <script>(function(){`, "\n\n// ── THEME ──\nconst html = document.documentElement;\nconst themeBtn = document.getElementById('themeBtn');\nfunction applyTheme(t) {\n  html.setAttribute('data-theme', t);\n  localStorage.setItem('keto-theme', t);\n  if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';\n}\napplyTheme(localStorage.getItem('keto-theme') || 'dark');\nthemeBtn?.addEventListener('click', () => {\n  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');\n});\n\n// ── NOTIFS ──\nconst notifBtn  = document.getElementById('notifBtn');\nconst notifDrop = document.getElementById('notifDropdown');\nnotifBtn?.addEventListener('click', e => { e.stopPropagation(); notifDrop?.classList.toggle('open'); });\ndocument.addEventListener('click', e => { if (notifDrop && !notifDrop.contains(e.target) && e.target !== notifBtn) notifDrop.classList.remove('open'); });\n\n// ── MODAL ──\nlet checkoutUrl = LS_URL;\n\nfunction openModal(btn) {\n  document.getElementById('modalEmoji').textContent = btn.dataset.planEmoji;\n  document.getElementById('modalName').textContent  = \\`\\${btn.dataset.planName} Plan — \\${btn.dataset.planDuration}\\`;\n  document.getElementById('modalPrice').textContent = \\`$\\${btn.dataset.planPrice} one-time payment\\`;\n  checkoutUrl = LS_URL;\n  document.getElementById('modalOverlay').classList.add('show');\n}\n\nfunction closeModal() {\n  document.getElementById('modalOverlay').classList.remove('show');\n}\n\ndocument.getElementById('modalOverlay').addEventListener('click', e => {\n  if (e.target === document.getElementById('modalOverlay')) closeModal();\n});\n\ndocument.getElementById('modalConfirm').addEventListener('click', () => {\n  closeModal();\n  window.open(checkoutUrl, '_blank');\n  showToast('🚀 Redirecting to checkout...');\n});\n\nfunction showToast(msg) {\n  const t = document.getElementById('toast');\n  if (!t) return;\n  t.textContent = msg;\n  t.className = 'toast show';\n  setTimeout(() => t.classList.remove('show'), 2800);\n}\n\nwindow.openModal  = openModal;\nwindow.closeModal = closeModal;\n\n})();</script> </body> </html>"])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "upgrade", "data-astro-cid-birseqst": true }), renderComponent($$result, "Zap", $$Zap, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-birseqst": true }), renderComponent($$result, "Award", $$Award, { "size": 20, "data-astro-cid-birseqst": true }), renderComponent($$result, "Lock", $$Lock, { "size": 20, "data-astro-cid-birseqst": true }), renderComponent($$result, "Zap", $$Zap, { "size": 20, "data-astro-cid-birseqst": true }), renderComponent($$result, "Users", $$Users, { "size": 20, "data-astro-cid-birseqst": true }), isSubscribed && currentPlan && renderTemplate`<div class="current-banner" data-astro-cid-birseqst> <div class="banner-left" data-astro-cid-birseqst> <div class="banner-icon" data-astro-cid-birseqst>${currentPlan.emoji}</div> <div data-astro-cid-birseqst> <div class="banner-title" data-astro-cid-birseqst>You're on the <strong data-astro-cid-birseqst>${currentPlan.name} Plan</strong></div> <div class="banner-sub" data-astro-cid-birseqst>Upgrade anytime to unlock more powerful features</div> </div> </div> <span class="badge-active" data-astro-cid-birseqst>✓ Active</span> </div>`, plans.map((plan) => renderTemplate`<div${addAttribute(`plan-card ${plan.popular ? "popular" : ""}`, "class")}${addAttribute(plan.popular ? `box-shadow:0 0 0 1px ${plan.border},0 20px 50px ${plan.glow.replace(".35", ".12")}` : "", "style")} data-astro-cid-birseqst> ${plan.popular && renderTemplate`<div class="popular-badge" data-astro-cid-birseqst>Most Popular</div>`} <!-- Header --> <div class="plan-header"${addAttribute(`background:linear-gradient(135deg,${plan.accent}08,transparent)`, "style")} data-astro-cid-birseqst> <div class="plan-header::before"${addAttribute(`background:${plan.accent}`, "style")} data-astro-cid-birseqst></div> <div class="plan-emoji-wrap"${addAttribute(`background:${plan.gradient};box-shadow:0 6px 20px ${plan.glow}`, "style")} data-astro-cid-birseqst> ${plan.emoji} </div> <div class="plan-name" data-astro-cid-birseqst>${plan.name}</div> <div class="plan-tagline" data-astro-cid-birseqst>${plan.tagline}</div> <div class="plan-price-block" data-astro-cid-birseqst> <div class="plan-price"${addAttribute(`background:${plan.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;`, "style")} data-astro-cid-birseqst> <sup data-astro-cid-birseqst>$</sup>${plan.price} </div> <div class="plan-duration" data-astro-cid-birseqst>for ${plan.duration}</div> ${plan.perMonth && renderTemplate`<div class="plan-per-month" data-astro-cid-birseqst> <span data-astro-cid-birseqst>${renderComponent($$result, "Share2", $$Share2, { "size": 13, "data-astro-cid-birseqst": true })}</span> <span data-astro-cid-birseqst>$${plan.perMonth.toFixed(2)} / month</span> </div>`} </div> </div> <div class="plan-divider" data-astro-cid-birseqst></div> <!-- Features --> <div class="plan-features" data-astro-cid-birseqst> ${plan.features.map((f) => renderTemplate`<div${addAttribute(`feature-item ${!f.included ? "off" : ""}`, "class")} data-astro-cid-birseqst> <div${addAttribute(`feat-check ${f.included ? "yes" : "no"}`, "class")}${addAttribute(f.included ? `background:${plan.accent}20;color:${plan.accent}` : "", "style")} data-astro-cid-birseqst> ${f.included ? "✓" : "✕"} </div> <span class="feat-text" data-astro-cid-birseqst>${f.text}</span> </div>`)} </div> <!-- CTA --> <div class="plan-footer" data-astro-cid-birseqst> ${currentPlan?.id === plan.id ? renderTemplate`<div class="btn-current" data-astro-cid-birseqst>✓ Current Plan</div>` : renderTemplate`<button${addAttribute(`btn-upgrade ${plan.id === "basic_30" ? "green" : plan.id === "pro_6" ? "indigo" : "gold"}`, "class")}${addAttribute(plan.id, "data-plan-id")}${addAttribute(plan.name, "data-plan-name")}${addAttribute(plan.price, "data-plan-price")}${addAttribute(plan.emoji, "data-plan-emoji")}${addAttribute(plan.duration, "data-plan-duration")} onclick="openModal(this)" data-astro-cid-birseqst> <span data-astro-cid-birseqst>${renderComponent($$result, "ChevronRight", $$ChevronRight, { "size": 16, "data-astro-cid-birseqst": true })}</span> <span data-astro-cid-birseqst>Get ${plan.name} — $${plan.price}</span> </button>`} </div> </div>`), [
    ["Meal Plan", "30 days", "6 months", "12 months"],
    ["Recipes", "30", "87+", "Unlimited"],
    ["Free eBooks", "4", "8", "12"],
    ["Dashboard & Tracking", "✓", "✓", "✓"],
    ["Macros Tracker", "✓", "✓", "✓"],
    ["Advanced Analytics", "—", "✓", "✓"],
    ["Priority Support", "—", "✓", "✓"],
    ["Community Access", "—", "—", "✓"],
    ["AI Keto Coach 🤖", "—", "—", "✓"],
    ["Lifetime Updates", "—", "—", "✓"]
  ].map((row) => renderTemplate`<div class="compare-row" data-astro-cid-birseqst> <div class="compare-cell feat-name" data-astro-cid-birseqst>${row[0]}</div> ${[row[1], row[2], row[3]].map((val, i) => renderTemplate`<div class="compare-cell center"${addAttribute(val === "✓" ? `color:${i === 0 ? "#10b981" : i === 1 ? "#6366f1" : "#f59e0b"}` : val === "—" ? "color:var(--muted);opacity:.4" : `font-weight:700;color:${i === 0 ? "#10b981" : i === 1 ? "#6366f1" : "#f59e0b"}`, "style")} data-astro-cid-birseqst> ${val} </div>`)} </div>`), [
    { q: "Is this a one-time payment?", a: "Yes! No subscriptions, no hidden fees. Pay once and keep access forever." },
    { q: "Can I upgrade later?", a: "Absolutely. You can upgrade from Basic to Pro or Elite at any time from this page." },
    { q: "What's the money-back guarantee?", a: "If you're not happy within 30 days, we'll give you a full refund. No questions asked." },
    { q: "What is the AI Keto Coach?", a: "Elite members get access to our AI-powered coach that gives personalized keto advice, recipe ideas, and progress analysis." },
    { q: "How do I access my plan?", a: "After payment, your account is instantly upgraded. Just log in to access all features." },
    { q: "Is my payment secure?", a: "Yes. All payments are processed securely through LemonSqueezy with industry-standard encryption." }
  ].map((faq) => renderTemplate`<div class="faq-item" data-astro-cid-birseqst> <div class="faq-q" data-astro-cid-birseqst>❓ ${faq.q}</div> <div class="faq-a" data-astro-cid-birseqst>${faq.a}</div> </div>`), renderComponent($$result, "Award", $$Award, { "size": 36, "data-astro-cid-birseqst": true }), renderComponent($$result, "Zap", $$Zap, { "size": 18, "style": "vertical-align:middle;margin-left:.3rem;", "data-astro-cid-birseqst": true }), defineScriptVars({ LS_URL }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/upgrade.astro", void 0);
const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/upgrade.astro";
const $$url = "/dashboard/upgrade";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Upgrade,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
