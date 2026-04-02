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
  const adminSession = Astro2.cookies.get("admin-session")?.value;
  if (adminSession === "verified") {
    return Astro2.redirect("/dashboard/admin");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-om443aeh> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login \u2013 Keto Journey</title>', `</head> <body data-astro-cid-om443aeh> <div class="theme-toggle" id="themeToggle" data-astro-cid-om443aeh> <span id="themeIcon" data-astro-cid-om443aeh>\u2600\uFE0F</span> </div> <div class="login-container" data-astro-cid-om443aeh> <div class="lock-icon" data-astro-cid-om443aeh>\u{1F510}</div> <h1 data-astro-cid-om443aeh>Admin Access</h1> <p data-astro-cid-om443aeh>Enter admin password to continue</p> <div id="errorMessage" class="error" data-astro-cid-om443aeh></div> <form id="loginForm" data-astro-cid-om443aeh> <div class="form-group" data-astro-cid-om443aeh> <label for="password" data-astro-cid-om443aeh>Admin Password</label> <input type="password" id="password" name="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required autofocus data-astro-cid-om443aeh> </div> <button type="submit" class="btn" id="submitBtn" data-astro-cid-om443aeh> <span data-astro-cid-om443aeh>\u{1F513}</span> <span data-astro-cid-om443aeh>Unlock Admin Panel</span> </button> </form> <div class="back-link" data-astro-cid-om443aeh> <a href="/dashboard/" data-astro-cid-om443aeh>\u2190 Back to Dashboard</a> </div> </div> <script>
  // Dark Mode
  const html=document.documentElement;
  const themeIcon=document.getElementById('themeIcon');
  const saved=localStorage.getItem('theme')||'light';
  html.setAttribute('data-theme',saved);
  if(themeIcon)themeIcon.textContent=saved==='dark'?'\u{1F319}':'\u2600\uFE0F';
  document.getElementById('themeToggle')?.addEventListener('click',function(){
    const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
    html.setAttribute('data-theme',next);
    if(themeIcon)themeIcon.textContent=next==='dark'?'\u{1F319}':'\u2600\uFE0F';
    localStorage.setItem('theme',next);
  });

  // Login Form
  const form = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = passwordInput.value;
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>\u23F3</span><span>Verifying...</span>';
    
    // Hide previous error
    errorMsg.classList.remove('show');
    
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success!
        submitBtn.innerHTML = '<span>\u2705</span><span>Access Granted!</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Redirect after brief delay
        setTimeout(() => {
          window.location.href = '/dashboard/admin';
        }, 800);
      } else {
        // Wrong password
        errorMsg.textContent = '\u274C ' + (result.error || 'Invalid password. Please try again.');
        errorMsg.classList.add('show');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>\u{1F513}</span><span>Unlock Admin Panel</span>';
        
        // Clear password field
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (error) {
      errorMsg.textContent = '\u274C Connection error. Please try again.';
      errorMsg.classList.add('show');
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>\u{1F513}</span><span>Unlock Admin Panel</span>';
    }
  });

  console.log('\u2705 Admin login page loaded');
<\/script> </body> </html>`])), renderHead());
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/admin-login.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/admin-login.astro";
const $$url = "/admin-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdminLogin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
