/* empty css                                       */
import { c as createComponent, d as renderTemplate, h as renderHead, e as createAstro } from '../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const error = Astro2.url.searchParams.get("error");
  const message = Astro2.url.searchParams.get("message");
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sgpqyurt> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome Back \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-sgpqyurt> <!-- LEFT: Image Panel --> <div class="panel-img" data-astro-cid-sgpqyurt> <div class="panel-img-bg" data-astro-cid-sgpqyurt></div> <div class="panel-img-overlay" data-astro-cid-sgpqyurt></div> <div class="panel-content" data-astro-cid-sgpqyurt> <a href="/" class="panel-logo" data-astro-cid-sgpqyurt>\u{1F951} Keto<span data-astro-cid-sgpqyurt>Journey</span></a> <div class="panel-headline" data-astro-cid-sgpqyurt> <div class="panel-eyebrow" data-astro-cid-sgpqyurt>\u{1F525} 30-Day Transformation</div> <h2 class="panel-title" data-astro-cid-sgpqyurt>\nWelcome<br data-astro-cid-sgpqyurt><em data-astro-cid-sgpqyurt>back</em> to<br data-astro-cid-sgpqyurt>your journey\n</h2> <p class="panel-sub" data-astro-cid-sgpqyurt>\nYour progress is waiting. Log in to continue building the habits that will transform your body.\n</p> </div> <div class="panel-stats" data-astro-cid-sgpqyurt> <div class="ps-item" data-astro-cid-sgpqyurt> <div class="ps-val" data-astro-cid-sgpqyurt>10K+</div> <div class="ps-lbl" data-astro-cid-sgpqyurt>Members</div> </div> <div class="ps-item" data-astro-cid-sgpqyurt> <div class="ps-val" data-astro-cid-sgpqyurt>4.9\u2605</div> <div class="ps-lbl" data-astro-cid-sgpqyurt>Rating</div> </div> <div class="ps-item" data-astro-cid-sgpqyurt> <div class="ps-val" data-astro-cid-sgpqyurt>87</div> <div class="ps-lbl" data-astro-cid-sgpqyurt>Recipes</div> </div> </div> </div> </div> <!-- RIGHT: Form Panel --> <div class="panel-form" data-astro-cid-sgpqyurt> <div class="form-header" data-astro-cid-sgpqyurt> <div class="form-tag" data-astro-cid-sgpqyurt>\u{1F44B} Welcome back</div> <h1 class="form-title" data-astro-cid-sgpqyurt>Log in to your<br data-astro-cid-sgpqyurt><em data-astro-cid-sgpqyurt>account</em></h1> <p class="form-sub" data-astro-cid-sgpqyurt>Continue your transformation journey</p> </div> ', " ", ` <form action="/api/auth/login" method="POST" id="loginForm" data-astro-cid-sgpqyurt> <div class="field" style="animation-delay:.05s;" data-astro-cid-sgpqyurt> <label class="field-label" for="email" data-astro-cid-sgpqyurt>Email Address</label> <div class="field-wrap" data-astro-cid-sgpqyurt> <span class="field-icon" data-astro-cid-sgpqyurt>\u2709\uFE0F</span> <input type="email" id="email" name="email" required class="field-input" placeholder="your@email.com" data-astro-cid-sgpqyurt> </div> </div> <div class="field" style="animation-delay:.1s;" data-astro-cid-sgpqyurt> <label class="field-label" for="password" data-astro-cid-sgpqyurt>Password</label> <div class="field-wrap" data-astro-cid-sgpqyurt> <span class="field-icon" data-astro-cid-sgpqyurt>\u{1F512}</span> <input type="password" id="password" name="password" required class="field-input" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" id="pwField" data-astro-cid-sgpqyurt> <button type="button" class="field-pw-toggle" id="pwToggle" aria-label="Show password" data-astro-cid-sgpqyurt>\u{1F441}\uFE0F</button> </div> </div> <div class="forgot-row" data-astro-cid-sgpqyurt> <a href="/forgot-password" class="forgot-link" data-astro-cid-sgpqyurt>Forgot password?</a> </div> <button type="submit" class="btn-submit" id="loginBtn" data-astro-cid-sgpqyurt> <div class="btn-spinner" id="spinner" data-astro-cid-sgpqyurt></div> <span id="btnText" data-astro-cid-sgpqyurt>Log In \u2192</span> </button> </form> <div class="divider" data-astro-cid-sgpqyurt> <div class="div-line" data-astro-cid-sgpqyurt></div> <div class="div-text" data-astro-cid-sgpqyurt>New to Keto Journey?</div> <div class="div-line" data-astro-cid-sgpqyurt></div> </div> <div class="signup-prompt" data-astro-cid-sgpqyurt>
Don't have an account yet?
<a href="/signup" data-astro-cid-sgpqyurt>Create one \u2192</a> </div> <div class="trust-row" data-astro-cid-sgpqyurt> <div class="trust-item" data-astro-cid-sgpqyurt><span data-astro-cid-sgpqyurt>\u{1F512}</span> Secure login</div> <div class="trust-item" data-astro-cid-sgpqyurt><span data-astro-cid-sgpqyurt>\u{1F6E1}\uFE0F</span> 30-day guarantee</div> <div class="trust-item" data-astro-cid-sgpqyurt><span data-astro-cid-sgpqyurt>\u26A1</span> Instant access</div> </div> </div> <script>
  // Password toggle
  const pwField = document.getElementById('password');
  const pwToggle = document.getElementById('pwToggle');
  if (pwField && pwToggle) {
    pwToggle.addEventListener('click', () => {
      const isText = pwField.type === 'text';
      pwField.type = isText ? 'password' : 'text';
      pwToggle.textContent = isText ? '\u{1F441}\uFE0F' : '\u{1F648}';
    });
  }

  // Loading state on submit
  const form = document.getElementById('loginForm');
  const btn  = document.getElementById('loginBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  if (form) {
    form.addEventListener('submit', () => {
      btn.disabled = true;
      spinner.style.display = 'block';
      btnText.textContent = 'Logging in\u2026';
    });
  }
<\/script> </body> </html>`])), renderHead(), error && renderTemplate`<div class="alert alert-error" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>⚠️</span> <span data-astro-cid-sgpqyurt> ${error === "invalid" && "Wrong email or password. Please try again."} ${error === "auth" && "Authentication error. Please try again."} ${error !== "invalid" && error !== "auth" && "Something went wrong. Please try again."} </span> </div>`, message && renderTemplate`<div class="alert alert-success" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>✅</span> <span data-astro-cid-sgpqyurt>${message}</span> </div>`);
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/login.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
