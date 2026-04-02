/* empty css                                          */
import { c as createComponent, d as renderTemplate, g as addAttribute, r as renderComponent, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { c as $$Activity, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$BarChart2 } from '../../chunks/BarChart2_CbUm7GhP.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Ketones = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Ketones;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name || profile.email?.split("@")[0] || "User";
  const { data: logs } = await supabase.from("ketone_logs").select("*").eq("user_id", user.id).order("logged_date", { ascending: false }).limit(30);
  const entries = logs || [];
  const latest = entries[0] || null;
  const latestVal = latest ? parseFloat(latest.ketone_mmol) : null;
  const cutoff = /* @__PURE__ */ new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const weekEntries = entries.filter((e) => new Date(e.logged_date) >= cutoff);
  const weekAvg = weekEntries.length > 0 ? Math.round(weekEntries.reduce((s, e) => s + parseFloat(e.ketone_mmol), 0) / weekEntries.length * 10) / 10 : null;
  const bestVal = entries.length > 0 ? Math.max(...entries.map((e) => parseFloat(e.ketone_mmol))) : null;
  const zone = latestVal === null ? "none" : latestVal < 0.5 ? "below" : latestVal < 1.5 ? "light" : latestVal < 3 ? "nutritional" : latestVal < 5 ? "deep" : "therapeutic";
  const zoneLabel = zone === "none" ? "No reading yet" : zone === "below" ? "Below Ketosis" : zone === "light" ? "Light Ketosis" : zone === "nutritional" ? "Nutritional Ketosis" : zone === "deep" ? "Deep Ketosis" : "Therapeutic Ketosis";
  const zoneColor = zone === "none" ? "#4d7055" : zone === "below" ? "#6b7280" : zone === "light" ? "#3b82f6" : zone === "nutritional" ? "#10b981" : zone === "deep" ? "#8b5cf6" : "#f59e0b";
  const zoneTip = zone === "none" ? "Log your first reading to see your ketosis status." : zone === "below" ? "You are not yet in ketosis. Keep carbs under 20g/day." : zone === "light" ? "You are entering ketosis. Keep it up!" : zone === "nutritional" ? "Optimal fat-burning zone. Great work!" : zone === "deep" ? "Deep ketosis \u2014 excellent for mental clarity." : "Therapeutic range. Monitor closely.";
  const chartRaw = [...entries].slice(0, 14).reverse();
  const chartMax = Math.max(5, ...chartRaw.map((e) => parseFloat(e.ketone_mmol)));
  const CW = 560;
  const CH = 140;
  const chartPoints = chartRaw.map((e, i) => {
    const x = chartRaw.length > 1 ? i / (chartRaw.length - 1) * CW : CW / 2;
    const y = CH - parseFloat(e.ketone_mmol) / chartMax * CH * 0.9;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPoints = chartRaw.length > 0 ? `0,${CH} ${chartPoints} ${CW},${CH}` : "";
  const y_05 = (CH - 0.5 / chartMax * CH * 0.9).toFixed(1);
  const y_15 = (CH - 1.5 / chartMax * CH * 0.9).toFixed(1);
  const y_30 = (CH - 3 / chartMax * CH * 0.9).toFixed(1);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-poni5bi5> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ketone Tracker \xB7 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">', "</head> <body data-astro-cid-poni5bi5> ", ' <main class="page" data-astro-cid-poni5bi5> <!-- Header --> <div class="page-header" style="animation:fadeUp .5s ease both;" data-astro-cid-poni5bi5> <div data-astro-cid-poni5bi5> <h1 class="page-title" data-astro-cid-poni5bi5>', ' Ketone Tracker</h1> <p class="page-sub" data-astro-cid-poni5bi5>Monitor your ketosis level and fat-burning zone</p> </div> <button class="log-btn" id="openModal" data-astro-cid-poni5bi5>+ Log Reading</button> </div> <!-- Zone banner --> <div class="zone-banner"', ' data-astro-cid-poni5bi5> <div class="zone-dot" data-astro-cid-poni5bi5></div> <div class="zone-info" data-astro-cid-poni5bi5> <span class="zone-name" data-astro-cid-poni5bi5>', "</span> ", ' </div> <p class="zone-tip" data-astro-cid-poni5bi5>', '</p> </div> <!-- Stats row --> <div class="stats-row" style="animation:fadeUp .5s .12s ease both;" data-astro-cid-poni5bi5> <div class="stat-card" data-astro-cid-poni5bi5> <div class="stat-label" data-astro-cid-poni5bi5>Latest</div> <div class="stat-val"', " data-astro-cid-poni5bi5> ", ' </div> <div class="stat-unit" data-astro-cid-poni5bi5>mmol/L</div> </div> <div class="stat-card" data-astro-cid-poni5bi5> <div class="stat-label" data-astro-cid-poni5bi5>7-Day Avg</div> <div class="stat-val" style="color:var(--blue)" data-astro-cid-poni5bi5> ', ' </div> <div class="stat-unit" data-astro-cid-poni5bi5>mmol/L</div> </div> <div class="stat-card" data-astro-cid-poni5bi5> <div class="stat-label" data-astro-cid-poni5bi5>Best</div> <div class="stat-val" style="color:var(--purple)" data-astro-cid-poni5bi5> ', ' </div> <div class="stat-unit" data-astro-cid-poni5bi5>mmol/L</div> </div> <div class="stat-card" data-astro-cid-poni5bi5> <div class="stat-label" data-astro-cid-poni5bi5>Total Logs</div> <div class="stat-val" style="color:var(--green)" data-astro-cid-poni5bi5>', '</div> <div class="stat-unit" data-astro-cid-poni5bi5>readings</div> </div> </div> <!-- Chart card --> <div class="card chart-card" style="animation:fadeUp .5s .16s ease both;" data-astro-cid-poni5bi5> <div class="card-head" data-astro-cid-poni5bi5> <span class="card-title" data-astro-cid-poni5bi5>', ' Ketone Trend</span> <span class="card-sub" data-astro-cid-poni5bi5>Last ', " readings</span> </div> ", " ", ' </div> <!-- Ketone zones guide --> <div class="card" style="animation:fadeUp .5s .2s ease both;" data-astro-cid-poni5bi5> <div class="card-head" data-astro-cid-poni5bi5> <span class="card-title" data-astro-cid-poni5bi5>', ' Ketone Zones Guide</span> </div> <div class="zones-grid" data-astro-cid-poni5bi5> <div class="zone-item zi-gray" data-astro-cid-poni5bi5> <div class="zi-range" data-astro-cid-poni5bi5>Below 0.5</div> <div class="zi-name" data-astro-cid-poni5bi5>Not in Ketosis</div> <div class="zi-desc" data-astro-cid-poni5bi5>Glucose is still the primary fuel. Reduce carbs further.</div> </div> <div class="zone-item zi-blue" data-astro-cid-poni5bi5> <div class="zi-range" data-astro-cid-poni5bi5>0.5 \u2013 1.5</div> <div class="zi-name" data-astro-cid-poni5bi5>Light Ketosis</div> <div class="zi-desc" data-astro-cid-poni5bi5>Entering fat-burning mode. Good for weight loss beginners.</div> </div> <div class="zone-item zi-green" data-astro-cid-poni5bi5> <div class="zi-range" data-astro-cid-poni5bi5>1.5 \u2013 3.0</div> <div class="zi-name" data-astro-cid-poni5bi5>Nutritional Ketosis \u2713</div> <div class="zi-desc" data-astro-cid-poni5bi5>Optimal zone \u2014 steady energy, fat burning, mental clarity.</div> </div> <div class="zone-item zi-purple" data-astro-cid-poni5bi5> <div class="zi-range" data-astro-cid-poni5bi5>3.0 \u2013 5.0</div> <div class="zi-name" data-astro-cid-poni5bi5>Deep Ketosis</div> <div class="zi-desc" data-astro-cid-poni5bi5>High fat burning, enhanced focus. Common during fasting.</div> </div> <div class="zone-item zi-gold" data-astro-cid-poni5bi5> <div class="zi-range" data-astro-cid-poni5bi5>Above 5.0</div> <div class="zi-name" data-astro-cid-poni5bi5>Therapeutic Range</div> <div class="zi-desc" data-astro-cid-poni5bi5>Used in clinical protocols. Monitor under medical guidance.</div> </div> </div> </div> <!-- History --> <div class="card" style="animation:fadeUp .5s .24s ease both;" data-astro-cid-poni5bi5> <div class="card-head" data-astro-cid-poni5bi5> <span class="card-title" data-astro-cid-poni5bi5>', ' Reading History</span> <span class="card-sub" data-astro-cid-poni5bi5>', " total</span> </div> ", " ", ' </div> </main> <!-- Log Modal --> <div class="modal-overlay" id="modalOverlay" data-astro-cid-poni5bi5> <div class="modal" data-astro-cid-poni5bi5> <div class="modal-head" data-astro-cid-poni5bi5> <h3 data-astro-cid-poni5bi5>', ' Log Ketone Reading</h3> <button class="modal-close" id="closeModal" data-astro-cid-poni5bi5>\xD7</button> </div> <form id="ketoneForm" class="modal-body" data-astro-cid-poni5bi5> <div class="form-row" data-astro-cid-poni5bi5> <label class="form-label" data-astro-cid-poni5bi5>Ketone Level (mmol/L) *</label> <input type="number" id="ketoneVal" class="form-input" step="0.1" min="0" max="30" placeholder="e.g. 1.8" required data-astro-cid-poni5bi5> <div class="input-hint" data-astro-cid-poni5bi5>Normal range: 0.5 \u2013 5.0 mmol/L</div> </div> <div class="form-row" data-astro-cid-poni5bi5> <label class="form-label" data-astro-cid-poni5bi5>Measurement Type</label> <div class="type-btns" id="typeBtns" data-astro-cid-poni5bi5> <button type="button" class="type-btn active" data-type="blood" data-astro-cid-poni5bi5>', ' Blood</button> <button type="button" class="type-btn" data-type="urine" data-astro-cid-poni5bi5>', ' Urine</button> <button type="button" class="type-btn" data-type="breath" data-astro-cid-poni5bi5>', ' Breath</button> </div> </div> <div class="form-row" data-astro-cid-poni5bi5> <label class="form-label" data-astro-cid-poni5bi5>Date</label> <input type="date" id="logDate" class="form-input"', ` data-astro-cid-poni5bi5> </div> <div class="form-row" data-astro-cid-poni5bi5> <label class="form-label" data-astro-cid-poni5bi5>Notes (optional)</label> <input type="text" id="logNotes" class="form-input" placeholder="e.g. fasted 16h, post-workout\u2026" maxlength="200" data-astro-cid-poni5bi5> </div> <!-- Live zone preview --> <div class="zone-preview" id="zonePreview" style="display:none;" data-astro-cid-poni5bi5> <span id="previewDot" class="preview-dot" data-astro-cid-poni5bi5></span> <span id="previewLabel" data-astro-cid-poni5bi5>\u2014</span> </div> <div class="modal-actions" data-astro-cid-poni5bi5> <button type="button" class="btn-cancel" id="cancelBtn" data-astro-cid-poni5bi5>Cancel</button> <button type="submit" class="btn-save" id="saveBtn" data-astro-cid-poni5bi5>Save Reading</button> </div> </form> </div> </div>  <script>
(function () {
  var overlay    = document.getElementById('modalOverlay');
  var openBtn    = document.getElementById('openModal');
  var closeBtn   = document.getElementById('closeModal');
  var cancelBtn  = document.getElementById('cancelBtn');
  var form       = document.getElementById('ketoneForm');
  var valInput   = document.getElementById('ketoneVal');
  var dateInput  = document.getElementById('logDate');
  var notesInput = document.getElementById('logNotes');
  var saveBtn    = document.getElementById('saveBtn');
  var preview    = document.getElementById('zonePreview');
  var previewDot = document.getElementById('previewDot');
  var previewLbl = document.getElementById('previewLabel');
  var typeBtns   = document.getElementById('typeBtns');
  var selectedType = 'blood';

  // Open / close
  openBtn && openBtn.addEventListener('click', function () { overlay && overlay.classList.add('open'); });
  function closeModal() { overlay && overlay.classList.remove('open'); form && form.reset(); preview && (preview.style.display = 'none'); selectedType = 'blood'; resetTypeBtns(); }
  closeBtn  && closeBtn.addEventListener('click',  closeModal);
  cancelBtn && cancelBtn.addEventListener('click',  closeModal);
  overlay   && overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });

  // Measurement type selector
  function resetTypeBtns() {
    var btns = document.querySelectorAll('.type-btn');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-type') === 'blood');
    });
    selectedType = 'blood';
  }
  typeBtns && typeBtns.addEventListener('click', function (e) {
    var btn = e.target.closest('.type-btn');
    if (!btn) return;
    document.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    selectedType = btn.getAttribute('data-type');
  });

  // Live zone preview
  function getZone(val) {
    if (val < 0.5)  return { label:'Below Ketosis',       color:'#6b7280' };
    if (val < 1.5)  return { label:'Light Ketosis',        color:'#3b82f6' };
    if (val < 3.0)  return { label:'Nutritional Ketosis',  color:'#10b981' };
    if (val < 5.0)  return { label:'Deep Ketosis',         color:'#8b5cf6' };
    return                  { label:'Therapeutic Range',   color:'#f59e0b' };
  }
  valInput && valInput.addEventListener('input', function () {
    var val = parseFloat(valInput.value);
    if (isNaN(val) || val < 0) { preview.style.display = 'none'; return; }
    var z = getZone(val);
    preview.style.display = 'flex';
    preview.style.background = z.color + '12';
    preview.style.borderColor = z.color + '30';
    previewDot.style.background = z.color;
    previewLbl.style.color = z.color;
    previewLbl.textContent = val.toFixed(1) + ' mmol/L \u2014 ' + z.label;
  });

  // Submit
  form && form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var val = parseFloat(valInput.value);
    if (isNaN(val) || val < 0 || val > 30) { alert('Enter a value between 0 and 30 mmol/L'); return; }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving\u2026';

    try {
      var res = await fetch('/api/ketones/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ketone_mmol:      val,
          measurement_type: selectedType,
          logged_date:      dateInput.value,
          notes:            notesInput.value.trim() || null,
        }),
      });
      var data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert(data.error || 'Failed to save. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Reading';
      }
    } catch {
      alert('Network error. Please try again.');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Reading';
    }
  });
  // \u2500\u2500 Delete entry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  window.deleteEntry = async function(id) {
    if (!confirm('Delete this reading?')) return;
    try {
      var res = await fetch('/api/ketones/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      var data = await res.json();
      if (data.success) window.location.reload();
      else alert(data.error || 'Failed to delete.');
    } catch { alert('Network error.'); }
  };
})();
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "ketones", "data-astro-cid-poni5bi5": true }), renderComponent($$result, "Activity", $$Activity, { "size": 26, "style": "vertical-align:middle;margin-right:.5rem;", "data-astro-cid-poni5bi5": true }), addAttribute(`--zc:${zoneColor};animation:fadeUp .5s .08s ease both;`, "style"), zoneLabel, latestVal !== null && renderTemplate`<span class="zone-val" data-astro-cid-poni5bi5>${latestVal.toFixed(1)} mmol/L</span>`, zoneTip, addAttribute(`color:${zoneColor}`, "style"), latestVal !== null ? `${latestVal.toFixed(1)}` : "\u2014", weekAvg !== null ? weekAvg.toFixed(1) : "\u2014", bestVal !== null ? bestVal.toFixed(1) : "\u2014", entries.length, renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 16, "style": "vertical-align:middle;margin-right:.35rem;", "data-astro-cid-poni5bi5": true }), Math.min(14, entries.length), entries.length === 0 && renderTemplate`<div class="empty-chart" data-astro-cid-poni5bi5> <div class="empty-icon" data-astro-cid-poni5bi5>${renderComponent($$result, "Activity", $$Activity, { "size": 32, "data-astro-cid-poni5bi5": true })}</div> <p data-astro-cid-poni5bi5>Log your first ketone reading to see your trend chart.</p> </div>`, entries.length > 0 && renderTemplate`<div class="chart-wrap" data-astro-cid-poni5bi5> <svg${addAttribute(`0 0 ${CW} ${CH}`, "viewBox")} class="chart-svg" preserveAspectRatio="none" data-astro-cid-poni5bi5> <!-- Zone bands --> <rect x="0"${addAttribute(y_30, "y")}${addAttribute(CW, "width")}${addAttribute(parseFloat(y_15) - parseFloat(y_30), "height")} fill="rgba(139,92,246,.07)" data-astro-cid-poni5bi5></rect> <rect x="0"${addAttribute(y_15, "y")}${addAttribute(CW, "width")}${addAttribute(parseFloat(y_05) - parseFloat(y_15), "height")} fill="rgba(16,185,129,.07)" data-astro-cid-poni5bi5></rect> <rect x="0"${addAttribute(y_05, "y")}${addAttribute(CW, "width")}${addAttribute(CH - parseFloat(y_05), "height")} fill="rgba(107,114,128,.05)" data-astro-cid-poni5bi5></rect> <!-- Zone lines --> <line x1="0"${addAttribute(y_05, "y1")}${addAttribute(CW, "x2")}${addAttribute(y_05, "y2")} stroke="rgba(16,185,129,.2)" stroke-width="1" stroke-dasharray="4 3" data-astro-cid-poni5bi5></line> <line x1="0"${addAttribute(y_15, "y1")}${addAttribute(CW, "x2")}${addAttribute(y_15, "y2")} stroke="rgba(16,185,129,.3)" stroke-width="1" stroke-dasharray="4 3" data-astro-cid-poni5bi5></line> <line x1="0"${addAttribute(y_30, "y1")}${addAttribute(CW, "x2")}${addAttribute(y_30, "y2")} stroke="rgba(139,92,246,.25)" stroke-width="1" stroke-dasharray="4 3" data-astro-cid-poni5bi5></line> <!-- Area fill --> ${areaPoints && renderTemplate`<polygon${addAttribute(areaPoints, "points")}${addAttribute(`url(#kgrad)`, "fill")} opacity="0.35" data-astro-cid-poni5bi5></polygon>`} <!-- Line --> ${chartRaw.length > 1 && renderTemplate`<polyline${addAttribute(chartPoints, "points")} fill="none"${addAttribute(zoneColor, "stroke")} stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" data-astro-cid-poni5bi5></polyline>`} <!-- Dots --> ${chartRaw.map((e, i) => {
    const x = chartRaw.length > 1 ? i / (chartRaw.length - 1) * CW : CW / 2;
    const y = CH - parseFloat(e.ketone_mmol) / chartMax * CH * 0.9;
    return renderTemplate`<circle${addAttribute(x.toFixed(1), "cx")}${addAttribute(y.toFixed(1), "cy")} r="4"${addAttribute(zoneColor, "fill")} stroke="var(--bg)" stroke-width="2" data-astro-cid-poni5bi5></circle>`;
  })} <defs data-astro-cid-poni5bi5> <linearGradient id="kgrad" x1="0" y1="0" x2="0" y2="1" data-astro-cid-poni5bi5> <stop offset="0%"${addAttribute(zoneColor, "stop-color")} stop-opacity="0.5" data-astro-cid-poni5bi5></stop> <stop offset="100%"${addAttribute(zoneColor, "stop-color")} stop-opacity="0.02" data-astro-cid-poni5bi5></stop> </linearGradient> </defs> </svg> <!-- Zone labels --> <div class="chart-zones" data-astro-cid-poni5bi5> <span class="cz-label cz-purple" data-astro-cid-poni5bi5>Deep (3–5)</span> <span class="cz-label cz-green" data-astro-cid-poni5bi5>Optimal (1.5–3)</span> <span class="cz-label cz-blue" data-astro-cid-poni5bi5>Light (0.5–1.5)</span> </div> </div>`, renderComponent($$result, "Target", $$Target, { "size": 16, "style": "vertical-align:middle;margin-right:.35rem;", "data-astro-cid-poni5bi5": true }), renderComponent($$result, "Calendar", $$Calendar, { "size": 16, "style": "vertical-align:middle;margin-right:.35rem;", "data-astro-cid-poni5bi5": true }), entries.length, entries.length === 0 && renderTemplate`<div class="empty-state" data-astro-cid-poni5bi5> <div class="empty-icon" data-astro-cid-poni5bi5>${renderComponent($$result, "BarChart2", $$BarChart2, { "size": 32, "data-astro-cid-poni5bi5": true })}</div> <p data-astro-cid-poni5bi5>No readings yet. Log your first measurement above.</p> </div>`, entries.length > 0 && renderTemplate`<div class="history-list" data-astro-cid-poni5bi5> ${entries.slice(0, 15).map((e) => {
    const val = parseFloat(e.ketone_mmol);
    const eZone = val < 0.5 ? "below" : val < 1.5 ? "light" : val < 3 ? "nutritional" : val < 5 ? "deep" : "therapeutic";
    const eColor = eZone === "below" ? "#6b7280" : eZone === "light" ? "#3b82f6" : eZone === "nutritional" ? "#10b981" : eZone === "deep" ? "#8b5cf6" : "#f59e0b";
    const eLabel = eZone === "below" ? "Below" : eZone === "light" ? "Light" : eZone === "nutritional" ? "Nutritional" : eZone === "deep" ? "Deep" : "Therapeutic";
    const typeIsBlood = e.measurement_type === "blood";
    const typeIsUrine = e.measurement_type === "urine";
    const typeIsBreath = e.measurement_type === "breath";
    return renderTemplate`<div class="hist-row" data-astro-cid-poni5bi5> <span class="hist-icon" data-astro-cid-poni5bi5> ${typeIsBlood && renderTemplate`${renderComponent($$result, "Activity", $$Activity, { "size": 16, "data-astro-cid-poni5bi5": true })}`} ${typeIsUrine && renderTemplate`${renderComponent($$result, "Droplets", $$Droplets, { "size": 16, "data-astro-cid-poni5bi5": true })}`} ${typeIsBreath && renderTemplate`${renderComponent($$result, "Zap", $$Zap, { "size": 16, "data-astro-cid-poni5bi5": true })}`} </span> <div class="hist-info" data-astro-cid-poni5bi5> <span class="hist-date" data-astro-cid-poni5bi5>${(/* @__PURE__ */ new Date(e.logged_date + "T12:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span> ${e.notes && renderTemplate`<span class="hist-notes" data-astro-cid-poni5bi5>${e.notes}</span>`} </div> <div class="hist-right" data-astro-cid-poni5bi5> <span class="hist-val"${addAttribute(`color:${eColor}`, "style")} data-astro-cid-poni5bi5>${val.toFixed(1)}</span> <span class="hist-badge"${addAttribute(`background:${eColor}18;color:${eColor};border-color:${eColor}30;`, "style")} data-astro-cid-poni5bi5>${eLabel}</span> <button class="hist-del"${addAttribute(`deleteEntry('${e.id}')`, "onclick")} title="Delete" aria-label="Delete entry" data-astro-cid-poni5bi5>×</button> </div> </div>`;
  })} </div>`, renderComponent($$result, "Activity", $$Activity, { "size": 18, "style": "vertical-align:middle;margin-right:.4rem;", "data-astro-cid-poni5bi5": true }), renderComponent($$result, "Activity", $$Activity, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-poni5bi5": true }), renderComponent($$result, "Droplets", $$Droplets, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-poni5bi5": true }), renderComponent($$result, "Zap", $$Zap, { "size": 14, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-poni5bi5": true }), addAttribute(today, "value"));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/ketones.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/ketones.astro";
const $$url = "/dashboard/ketones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ketones,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
