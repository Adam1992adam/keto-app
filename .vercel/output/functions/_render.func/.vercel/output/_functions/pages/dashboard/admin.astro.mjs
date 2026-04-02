/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, g as addAttribute, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import 'clsx';
import { s as supabase, g as getProfile, f as getPlan, h as formatHeight, j as formatWeight } from '../../chunks/supabase_D4h9lf_Y.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const accessToken = Astro2.cookies.get("sb-access-token")?.value;
  if (!accessToken) return Astro2.redirect("/login");
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return Astro2.redirect("/login");
  const profile = await getProfile(user.id);
  if (!profile?.is_admin) return Astro2.redirect("/dashboard");
  const adminSession = Astro2.cookies.get("admin-session")?.value;
  if (adminSession !== "authenticated") {
    return Astro2.redirect("/admin-login");
  }
  const { data: allUsers } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  const { data: allJourneys } = await supabase.from("user_journey").select("*");
  const journeyMap = new Map(allJourneys?.map((j) => [j.user_id, j]) || []);
  const totalUsers = allUsers?.length || 0;
  const activeSubscribers = allUsers?.filter((u) => u.subscription_status === "active").length || 0;
  const expiredSubscribers = allUsers?.filter((u) => u.subscription_status === "expired").length || 0;
  const allDays = allJourneys?.map((j) => j.current_day || 1) || [];
  const avgDay = allDays.length > 0 ? Math.round(allDays.reduce((a, b) => a + b, 0) / allDays.length) : 0;
  const completed30 = allJourneys?.filter((j) => (j.current_day || 0) >= 30).length || 0;
  const monthlySignups = Array.from({ length: 6 }, (_, idx) => {
    const date = /* @__PURE__ */ new Date();
    date.setMonth(date.getMonth() - (5 - idx));
    const month = date.toLocaleString("en-US", { month: "short" });
    const count = allUsers?.filter((u) => {
      const created = new Date(u.created_at);
      return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear();
    }).length || 0;
    return { month, count };
  });
  const dayDistribution = Array.from({ length: 30 }, (_, idx) => {
    const day = idx + 1;
    const count = allJourneys?.filter((j) => (j.current_day || 0) === day).length || 0;
    return { day, count };
  });
  const planCounts = {
    basic_30: allUsers?.filter((u) => u.subscription_tier === "basic_30" && u.subscription_status === "active").length || 0,
    pro_6: allUsers?.filter((u) => u.subscription_tier === "pro_6" && u.subscription_status === "active").length || 0,
    elite_12: allUsers?.filter((u) => u.subscription_tier === "elite_12" && u.subscription_status === "active").length || 0,
    none: allUsers?.filter((u) => !u.subscription_status || u.subscription_status === "none").length || 0
  };
  const usersData = allUsers?.map((u) => {
    const journey = journeyMap.get(u.id);
    const plan = getPlan(u.subscription_tier);
    return {
      ...u,
      journey,
      plan,
      displayWeight: u.weight_kg ? formatWeight(u.weight_kg, u.preferred_units || "imperial") : "\u2014",
      displayHeight: u.height_cm ? formatHeight(u.height_cm, u.preferred_units || "imperial") : "\u2014"
    };
  }) || [];
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-hdqf4o2r> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin \u2013 Keto Journey</title>', '</head> <body data-astro-cid-hdqf4o2r> <nav data-astro-cid-hdqf4o2r> <div class="container" data-astro-cid-hdqf4o2r> <div class="flex-between" data-astro-cid-hdqf4o2r> <div class="flex gap-2" data-astro-cid-hdqf4o2r> <span style="font-size:2.5rem;" data-astro-cid-hdqf4o2r>\u{1F510}</span> <div data-astro-cid-hdqf4o2r> <h1 style="font-size:1.375rem;font-weight:800;background:linear-gradient(135deg,#ef4444,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-hdqf4o2r>Admin</h1> <p style="font-size:.8125rem;color:var(--text-secondary);font-weight:600;" data-astro-cid-hdqf4o2r>Control Panel</p> </div> </div> <div class="flex gap-2" data-astro-cid-hdqf4o2r> <a href="/dashboard/" data-astro-cid-hdqf4o2r>Dashboard</a> <a href="/dashboard/profile" data-astro-cid-hdqf4o2r>Profile</a> <a href="/dashboard/admin" class="active" data-astro-cid-hdqf4o2r>Admin</a> <button onclick="adminLogout()" class="logout-btn" data-astro-cid-hdqf4o2r>\u{1F6AA} Logout</button> <div class="flex gap-2" style="padding-left:1rem;border-left:1px solid var(--border-color);" data-astro-cid-hdqf4o2r> <div class="theme-toggle" id="themeToggle" data-astro-cid-hdqf4o2r><div class="theme-toggle-slider" data-astro-cid-hdqf4o2r><span id="themeIcon" data-astro-cid-hdqf4o2r>\u2600\uFE0F</span></div></div> </div> </div> </div> </div> </nav> <div class="container" style="padding:2rem 1.5rem 4rem;" data-astro-cid-hdqf4o2r> <div class="hero" data-astro-cid-hdqf4o2r> <h1 data-astro-cid-hdqf4o2r>\u{1F468}\u200D\u{1F4BC} Admin Control Panel</h1> <p style="font-size:1.125rem;opacity:.95;position:relative;z-index:1;margin-top:.5rem;" data-astro-cid-hdqf4o2r>Monitor all users, subscriptions, and progress</p> </div> <div class="stats-grid" data-astro-cid-hdqf4o2r> <div class="stat-card" data-astro-cid-hdqf4o2r><div class="stat-icon" data-astro-cid-hdqf4o2r>\u{1F465}</div><div class="stat-label" data-astro-cid-hdqf4o2r>Total Users</div><div class="stat-value" data-astro-cid-hdqf4o2r>', '</div></div> <div class="stat-card" data-astro-cid-hdqf4o2r><div class="stat-icon" data-astro-cid-hdqf4o2r>\u2705</div><div class="stat-label" data-astro-cid-hdqf4o2r>Active</div><div class="stat-value" data-astro-cid-hdqf4o2r>', '</div></div> <div class="stat-card" data-astro-cid-hdqf4o2r><div class="stat-icon" data-astro-cid-hdqf4o2r>\u{1F4C5}</div><div class="stat-label" data-astro-cid-hdqf4o2r>Avg Day</div><div class="stat-value" data-astro-cid-hdqf4o2r>', '</div></div> <div class="stat-card" data-astro-cid-hdqf4o2r><div class="stat-icon" data-astro-cid-hdqf4o2r>\u{1F3C6}</div><div class="stat-label" data-astro-cid-hdqf4o2r>Completed</div><div class="stat-value" data-astro-cid-hdqf4o2r>', '</div></div> <div class="stat-card" data-astro-cid-hdqf4o2r><div class="stat-icon" data-astro-cid-hdqf4o2r>\u274C</div><div class="stat-label" data-astro-cid-hdqf4o2r>Expired</div><div class="stat-value" data-astro-cid-hdqf4o2r>', '</div></div> </div> <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:2rem;margin:2rem 0;" data-astro-cid-hdqf4o2r> <div class="card" data-astro-cid-hdqf4o2r><h2 data-astro-cid-hdqf4o2r>\u{1F4CA} Plans</h2><div style="position:relative;height:300px;" data-astro-cid-hdqf4o2r><canvas id="planChart" data-astro-cid-hdqf4o2r></canvas></div></div> <div class="card" data-astro-cid-hdqf4o2r><h2 data-astro-cid-hdqf4o2r>\u{1F4C8} Signups</h2><div style="position:relative;height:300px;" data-astro-cid-hdqf4o2r><canvas id="signupChart" data-astro-cid-hdqf4o2r></canvas></div></div> <div class="card" data-astro-cid-hdqf4o2r><h2 data-astro-cid-hdqf4o2r>\u{1F4CA} Days</h2><div style="position:relative;height:300px;" data-astro-cid-hdqf4o2r><canvas id="dayChart" data-astro-cid-hdqf4o2r></canvas></div></div> </div> <div class="card" data-astro-cid-hdqf4o2r> <h2 data-astro-cid-hdqf4o2r>\u{1F465} All Users (', ')</h2> <input type="text" id="searchInput" class="search-box" placeholder="\u{1F50D} Search..." data-astro-cid-hdqf4o2r> <div style="overflow-x:auto;" data-astro-cid-hdqf4o2r> <table id="usersTable" data-astro-cid-hdqf4o2r> <thead data-astro-cid-hdqf4o2r><tr data-astro-cid-hdqf4o2r><th data-astro-cid-hdqf4o2r>Name</th><th data-astro-cid-hdqf4o2r>Email</th><th data-astro-cid-hdqf4o2r>Plan</th><th data-astro-cid-hdqf4o2r>Status</th><th data-astro-cid-hdqf4o2r>Day</th><th data-astro-cid-hdqf4o2r>Progress</th><th data-astro-cid-hdqf4o2r>XP</th><th data-astro-cid-hdqf4o2r>Weight</th><th data-astro-cid-hdqf4o2r>Height</th><th data-astro-cid-hdqf4o2r>Joined</th></tr></thead> <tbody data-astro-cid-hdqf4o2r> ', " </tbody> </table> </div> </div> </div> <script>(function(){", "\n  const html=document.documentElement;\n  const themeIcon=document.getElementById('themeIcon');\n  const saved=localStorage.getItem('theme')||'light';\n  html.setAttribute('data-theme',saved);\n  if(themeIcon)themeIcon.textContent=saved==='dark'?'\u{1F319}':'\u2600\uFE0F';\n  document.getElementById('themeToggle')?.addEventListener('click',function(){\n    const next=html.getAttribute('data-theme')==='dark'?'light':'dark';\n    html.setAttribute('data-theme',next);\n    if(themeIcon)themeIcon.textContent=next==='dark'?'\u{1F319}':'\u2600\uFE0F';\n    localStorage.setItem('theme',next);\n  });\n\n  // Admin Logout\n  function adminLogout() {\n    if (confirm('\u{1F6AA} Logout from admin panel?')) {\n      document.cookie = 'admin-session=; path=/; max-age=0';\n      window.location.href = '/admin-login';\n    }\n  }\n  window.adminLogout = adminLogout;\n\n  const searchInput=document.getElementById('searchInput');\n  const table=document.getElementById('usersTable');\n  if(searchInput&&table){\n    searchInput.addEventListener('input',function(){\n      const q=this.value.toLowerCase();\n      const rows=table.querySelectorAll('tbody tr');\n      rows.forEach(row=>{row.style.display=row.textContent.toLowerCase().includes(q)?'':'none';});\n    });\n  }\n\n  window.addEventListener('load',function(){\n    if(typeof Chart==='undefined')return;\n    const isDark=html.getAttribute('data-theme')==='dark';\n    const tc=isDark?'#eaeaea':'#374151';\n    const gc=isDark?'rgba(255,255,255,.1)':'rgba(0,0,0,.05)';\n\n    const planData=JSON.parse(planCounts);\n    new Chart(document.getElementById('planChart'),{type:'doughnut',data:{labels:['\u{1F949} Basic','\u{1F948} Pro','\u{1F947} Elite','\u26AA None'],datasets:[{data:[planData.basic_30,planData.pro_6,planData.elite_12,planData.none],backgroundColor:['#6366f1','#10b981','#f59e0b','#6b7280']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:tc,font:{size:12,weight:'bold'}}}}}});\n\n    const signupData=JSON.parse(monthlySignups);\n    new Chart(document.getElementById('signupChart'),{type:'line',data:{labels:signupData.map(d=>d.month),datasets:[{label:'Signups',data:signupData.map(d=>d.count),borderColor:'#10b981',backgroundColor:'rgba(16,185,129,.1)',fill:true,tension:.4,borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gc},ticks:{color:tc}},x:{grid:{display:false},ticks:{color:tc}}}}});\n\n    const dayData=JSON.parse(dayDistribution);\n    new Chart(document.getElementById('dayChart'),{type:'bar',data:{labels:dayData.map(d=>'D'+d.day),datasets:[{data:dayData.map(d=>d.count),backgroundColor:'#10b981',borderRadius:8}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gc},ticks:{color:tc}},x:{grid:{display:false},ticks:{color:tc,font:{size:9}}}}}});\n  });\n})();<\/script> </body> </html>"])), renderHead(), totalUsers, activeSubscribers, avgDay, completed30, expiredSubscribers, totalUsers, usersData.map((u) => {
    const progress = u.journey ? Math.round((u.journey.current_day || 1) / u.plan.durationDays * 100) : 0;
    return renderTemplate`<tr data-astro-cid-hdqf4o2r> <td style="font-weight:700;" data-astro-cid-hdqf4o2r>${u.full_name}</td> <td style="color:var(--text-secondary);" data-astro-cid-hdqf4o2r>${u.email}</td> <td data-astro-cid-hdqf4o2r><span style="font-size:1.25rem;" data-astro-cid-hdqf4o2r>${u.plan.emoji}</span> <span style="font-weight:600;" data-astro-cid-hdqf4o2r>${u.plan.name}</span></td> <td data-astro-cid-hdqf4o2r> ${u.subscription_status === "active" ? renderTemplate`<span class="badge badge-active" data-astro-cid-hdqf4o2r>✅ Active</span>` : u.subscription_status === "expired" ? renderTemplate`<span class="badge badge-expired" data-astro-cid-hdqf4o2r>❌ Expired</span>` : renderTemplate`<span class="badge badge-none" data-astro-cid-hdqf4o2r>⚪ None</span>`} </td> <td style="font-weight:700;font-size:1.125rem;" data-astro-cid-hdqf4o2r>${u.journey?.current_day || 1}</td> <td style="min-width:120px;" data-astro-cid-hdqf4o2r> <div class="progress-bar" data-astro-cid-hdqf4o2r><div class="progress-fill"${addAttribute(`width:${progress}%`, "style")} data-astro-cid-hdqf4o2r></div></div> <div style="font-size:.75rem;color:var(--text-secondary);margin-top:.25rem;" data-astro-cid-hdqf4o2r>${progress}%</div> </td> <td style="font-weight:700;" data-astro-cid-hdqf4o2r>${u.journey?.total_xp || 0}</td> <td data-astro-cid-hdqf4o2r>${u.displayWeight}</td> <td data-astro-cid-hdqf4o2r>${u.displayHeight}</td> <td style="color:var(--text-secondary);font-size:.875rem;" data-astro-cid-hdqf4o2r>${new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td> </tr>`;
  }), defineScriptVars({ planCounts: JSON.stringify(planCounts), monthlySignups: JSON.stringify(monthlySignups), dayDistribution: JSON.stringify(dayDistribution) }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/admin.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/admin.astro";
const $$url = "/dashboard/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
