/* empty css                                       */
import { c as createComponent, d as renderTemplate, h as renderHead, e as createAstro } from '../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$AdminLogin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLogin;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-3uvcz35n> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Access \u2014 Keto Journey</title>', '</head> <body data-astro-cid-3uvcz35n> <div class="card" data-astro-cid-3uvcz35n> <div class="icon" data-astro-cid-3uvcz35n>\u{1F6E1}\uFE0F</div> <h1 data-astro-cid-3uvcz35n>Admin Access</h1> <p class="sub" data-astro-cid-3uvcz35n>Restricted area \u2014 authorized personnel only</p> ', " ", ` <div class="field" data-astro-cid-3uvcz35n> <label data-astro-cid-3uvcz35n>Admin Password</label> <input type="password" id="adminPass" placeholder="Enter admin password" autocomplete="current-password" data-astro-cid-3uvcz35n> </div> <button class="btn" id="btnLogin" data-astro-cid-3uvcz35n>\u{1F513} Access Admin Panel</button> <div class="loading" id="loading" data-astro-cid-3uvcz35n>Verifying...</div> <a href="/" class="back" data-astro-cid-3uvcz35n>\u2190 Back to site</a> </div> <script>
  document.getElementById('btnLogin').addEventListener('click', async () => {
    const pass = document.getElementById('adminPass').value.trim();
    if (!pass) return;

    document.getElementById('btnLogin').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = '/admin/';
      } else {
        window.location.href = '/admin-login?error=invalid';
      }
    } catch {
      window.location.href = '/admin-login?error=invalid';
    }
  });

  document.getElementById('adminPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btnLogin').click();
  });
<\/script> </body> </html>`])), renderHead(), error === "invalid" && renderTemplate`<div class="error-msg" data-astro-cid-3uvcz35n>❌ Invalid password. Access denied.</div>`, error === "session" && renderTemplate`<div class="error-msg" data-astro-cid-3uvcz35n>⚠️ Session expired. Please log in again.</div>`);
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/admin login.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/admin login.astro";
const $$url = "/admin login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminLogin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
