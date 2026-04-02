/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$Camera } from '../../chunks/Camera_BGE67eLB.mjs';
import { $ as $$ } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$BarChart2 } from '../../chunks/BarChart2_CbUm7GhP.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro$3 = createAstro();
const $$Image = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Image;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "image", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect> <circle cx="9" cy="9" r="2"></circle> <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Image.astro", void 0);

const $$Astro$2 = createAstro();
const $$Plus = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Plus;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "plus", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M5 12h14"></path> <path d="M12 5v14"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Plus.astro", void 0);

const $$Astro$1 = createAstro();
const $$Upload = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Upload;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "upload", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12 3v12"></path> <path d="m17 8-5-5-5 5"></path> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Upload.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Photos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Photos;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const journey = await getUserJourney(user.id);
  const startDate = journey?.start_date ? new Date(journey.start_date) : /* @__PURE__ */ new Date();
  journey?.current_day || 1;
  const { data: photosAsc } = await supabase.from("progress_photos").select("id, photo_data, taken_date, notes, created_at").eq("user_id", user.id).order("taken_date", { ascending: true });
  const photos = photosAsc || [];
  const photosDesc = [...photos].reverse();
  const startMs = startDate.getTime();
  const photosWithDay = photosDesc.map((p) => {
    const takenMs = new Date(p.taken_date).getTime();
    const dayNum = Math.max(1, Math.floor((takenMs - startMs) / 864e5) + 1);
    return { ...p, dayNum };
  });
  const photosTimeline = [...photosWithDay].reverse();
  const totalPhotos = photos.length;
  const today = /* @__PURE__ */ new Date();
  const lastPhotoDate = photosDesc[0] ? new Date(photosDesc[0].taken_date) : null;
  const daysSinceLast = lastPhotoDate ? Math.floor((today.getTime() - lastPhotoDate.getTime()) / 864e5) : null;
  const firstPhotoDate = photos[0] ? new Date(photos[0].taken_date) : null;
  const spanDays = firstPhotoDate ? Math.floor((today.getTime() - firstPhotoDate.getTime()) / 864e5) + 1 : 0;
  const todayStr = today.toISOString().split("T")[0];
  const MILESTONES = [1, 7, 14, 21, 30, 60, 90, 180, 365];
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-theme="dark" data-astro-cid-h442ufdo> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Progress Photos \u2014 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">', "</head> <body data-astro-cid-h442ufdo> ", ' <div class="page-wrap" data-astro-cid-h442ufdo> <!-- Page Header --> <div class="page-header" data-astro-cid-h442ufdo> <div data-astro-cid-h442ufdo> <h1 class="page-title" data-astro-cid-h442ufdo>Progress <span data-astro-cid-h442ufdo>Photos</span></h1> <p style="font-size:.83rem;color:var(--soft);margin-top:.2rem;" data-astro-cid-h442ufdo>\nVisual proof of your keto transformation\n</p> </div> <div class="header-actions" data-astro-cid-h442ufdo> <button class="btn btn-ghost" id="btnCompare" onclick="window.toggleCompareMode()" data-astro-cid-h442ufdo> ', ' Compare\n</button> <button class="btn btn-ghost" id="btnUploadToggle" onclick="window.toggleUpload()" data-astro-cid-h442ufdo> ', " Upload\n</button> </div> </div> <!-- Insights Banner (2+ photos) --> ", ' <!-- Upload Section (hidden by default) --> <div class="upload-section" id="uploadSection" style="display:none;" data-astro-cid-h442ufdo> <div class="upload-title" data-astro-cid-h442ufdo>', ' Upload a Progress Photo</div> <div class="upload-grid" data-astro-cid-h442ufdo> <!-- Drop Zone --> <div data-astro-cid-h442ufdo> <div class="drop-zone" id="dropZone" data-astro-cid-h442ufdo> <input type="file" id="fileInput" accept="image/*" data-astro-cid-h442ufdo> <div id="dropZoneContent" data-astro-cid-h442ufdo> <div class="drop-icon" data-astro-cid-h442ufdo>', '</div> <div class="drop-label" data-astro-cid-h442ufdo>Drop image here or click to select</div> <div class="drop-sub" data-astro-cid-h442ufdo>Images only \xB7 Max 5MB \xB7 Auto-compressed</div> </div> <img id="previewImg" class="preview-img" alt="Preview" data-astro-cid-h442ufdo> </div> </div> <!-- Fields --> <div class="upload-fields" data-astro-cid-h442ufdo> <div data-astro-cid-h442ufdo> <label class="field-label" for="photoDate" data-astro-cid-h442ufdo>Date taken</label> <input class="field-input" type="date" id="photoDate"', ' data-astro-cid-h442ufdo> </div> <div data-astro-cid-h442ufdo> <label class="field-label" for="photoNotes" data-astro-cid-h442ufdo>Notes (optional)</label> <textarea class="field-input" id="photoNotes" placeholder="How are you feeling? Any measurements? Milestones?" data-astro-cid-h442ufdo></textarea> </div> <div class="upload-actions" data-astro-cid-h442ufdo> <button class="btn btn-primary" id="uploadBtn" onclick="window.doUpload()" data-astro-cid-h442ufdo>\nUpload Photo\n</button> <span class="upload-status" id="uploadStatus" data-astro-cid-h442ufdo></span> </div> </div> </div> </div> <!-- Gallery Header --> <div class="gallery-header" data-astro-cid-h442ufdo> <div class="gallery-title" data-astro-cid-h442ufdo> ', ` </div> <div class="view-toggles" data-astro-cid-h442ufdo> <button class="btn btn-active" id="btnGrid" onclick="window.switchView('grid')" data-astro-cid-h442ufdo>
\u229E Grid
</button> <button class="btn btn-ghost" id="btnTimeline" onclick="window.switchView('timeline')" data-astro-cid-h442ufdo> `, ' Timeline\n</button> </div> </div> <!-- Grid View --> <div id="gridView" data-astro-cid-h442ufdo> ', " ", ' </div> <!-- Timeline View --> <div id="timelineView" class="timeline-view" data-astro-cid-h442ufdo> ', " ", ' </div> </div><!-- /page-wrap --> <!-- Comparison Panel --> <div class="compare-panel" id="comparePanel" data-astro-cid-h442ufdo> <div class="compare-inner" data-astro-cid-h442ufdo> <div class="compare-header" data-astro-cid-h442ufdo> <span class="compare-heading" data-astro-cid-h442ufdo>', ' Side-by-Side Comparison</span> <div style="display:flex;gap:.5rem;" data-astro-cid-h442ufdo> <button class="btn btn-active" id="btnSlider" onclick="window.openSlider()" style="display:none;" data-astro-cid-h442ufdo>\n\u27FA Slider View\n</button> <button class="btn btn-ghost" onclick="window.clearComparison()" data-astro-cid-h442ufdo>Clear</button> </div> </div> <div class="compare-photos" data-astro-cid-h442ufdo> <div class="compare-slot" id="compareSlot1" data-astro-cid-h442ufdo> <div class="compare-placeholder" data-astro-cid-h442ufdo>Select first photo</div> </div> <div class="compare-slot" id="compareSlot2" data-astro-cid-h442ufdo> <div class="compare-placeholder" data-astro-cid-h442ufdo>Select second photo</div> </div> </div> </div> </div> <!-- Before/After Slider Overlay --> <div class="slider-overlay" id="sliderOverlay" data-astro-cid-h442ufdo> <button class="slider-close" onclick="window.closeSlider()" data-astro-cid-h442ufdo>\u2715</button> <div class="slider-wrap" id="sliderWrap" data-astro-cid-h442ufdo> <img class="slider-img-after" id="sliderImgAfter" src="" alt="After" data-astro-cid-h442ufdo> <img class="slider-img-before" id="sliderImgBefore" src="" alt="Before" data-astro-cid-h442ufdo> <div class="slider-divider" id="sliderDivider" data-astro-cid-h442ufdo></div> <div class="slider-handle" id="sliderHandle" data-astro-cid-h442ufdo>\u27FA</div> <div class="slider-label slider-label-before" data-astro-cid-h442ufdo>Before</div> <div class="slider-label slider-label-after" data-astro-cid-h442ufdo>After</div> </div> <div class="slider-info" data-astro-cid-h442ufdo> <div class="slider-info-side" id="sliderInfoLeft" data-astro-cid-h442ufdo>\u2014</div> <div class="slider-info-side" style="text-align:right;" id="sliderInfoRight" data-astro-cid-h442ufdo>\u2014</div> </div> <p class="slider-hint" data-astro-cid-h442ufdo>Drag the handle \xB7 \u2190 \u2192 arrow keys</p> </div> <!-- Lightbox --> <div class="lightbox" id="lightbox" onclick="window.closeLightbox()" data-astro-cid-h442ufdo> <div class="lightbox-inner" onclick="event.stopPropagation()" data-astro-cid-h442ufdo> <button class="lightbox-close" onclick="window.closeLightbox()" data-astro-cid-h442ufdo>\u2715</button> <img class="lightbox-img" id="lightboxImg" src="" alt="Progress photo" data-astro-cid-h442ufdo> <div class="lightbox-info" data-astro-cid-h442ufdo> <div data-astro-cid-h442ufdo> <div class="lightbox-date" id="lightboxDate" data-astro-cid-h442ufdo></div> <div class="lightbox-notes" id="lightboxNotes" data-astro-cid-h442ufdo></div> </div> <span class="day-badge" id="lightboxDay" style="font-size:.78rem;" data-astro-cid-h442ufdo></span> </div> </div> </div> <script>(function(){', `
  (function () {
    /* \u2500\u2500 State \u2500\u2500 */
    var compareMode     = false;
    var selectedIds     = [];
    var selectedData    = {};
    var uploadVisible   = false;
    var currentView     = 'grid';
    var selectedFile    = null;

    /* \u2500\u2500 Init date input \u2500\u2500 */
    var dateInput = document.getElementById('photoDate');
    if (dateInput) dateInput.value = todayStr;

    /* \u2500\u2500 Upload toggle \u2500\u2500 */
    window.toggleUpload = function () {
      uploadVisible = !uploadVisible;
      var sec = document.getElementById('uploadSection');
      var btn = document.getElementById('btnUploadToggle');
      if (sec) sec.style.display = uploadVisible ? 'block' : 'none';
      if (btn) btn.className = uploadVisible ? 'btn btn-active' : 'btn btn-ghost';
      if (uploadVisible && sec) sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    /* \u2500\u2500 View toggle \u2500\u2500 */
    window.switchView = function (v) {
      currentView = v;
      var grid     = document.getElementById('gridView');
      var timeline = document.getElementById('timelineView');
      var btnGrid  = document.getElementById('btnGrid');
      var btnTl    = document.getElementById('btnTimeline');
      if (v === 'grid') {
        if (grid)     grid.style.display     = '';
        if (timeline) timeline.style.display = 'none';
        if (btnGrid)  btnGrid.className = 'btn btn-active';
        if (btnTl)    btnTl.className   = 'btn btn-ghost';
      } else {
        if (grid)     grid.style.display     = 'none';
        if (timeline) timeline.style.display = 'block';
        if (btnGrid)  btnGrid.className = 'btn btn-ghost';
        if (btnTl)    btnTl.className   = 'btn btn-active';
      }
    };

    /* \u2500\u2500 Compare mode \u2500\u2500 */
    window.toggleCompareMode = function () {
      compareMode = !compareMode;
      var btn = document.getElementById('btnCompare');
      if (btn) btn.className = compareMode ? 'btn btn-active' : 'btn btn-ghost';
      if (!compareMode) window.clearComparison();
    };

    window.clearComparison = function () {
      selectedIds  = [];
      selectedData = {};
      compareMode  = false;
      var btn = document.getElementById('btnCompare');
      if (btn) btn.className = 'btn btn-ghost';
      // Remove selected class from all cards
      var cards = document.querySelectorAll('.photo-card');
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove('selected');
      }
      var panel = document.getElementById('comparePanel');
      if (panel) panel.classList.remove('open');
    };

    function updateComparePanel() {
      var slot1 = document.getElementById('compareSlot1');
      var slot2 = document.getElementById('compareSlot2');
      var panel = document.getElementById('comparePanel');

      function renderSlot(slot, id) {
        var d = selectedData[id];
        if (!d) {
          slot.innerHTML = '<div class="compare-placeholder">' + (slot === slot1 ? 'Select first photo' : 'Select second photo') + '</div>';
          return;
        }
        slot.innerHTML =
          '<img src="' + d.src + '" alt="Compare" />' +
          '<div class="compare-slot-info">' +
            '<div class="compare-slot-date">' + d.date + '</div>' +
            '<div class="compare-slot-day">Day ' + d.day + '</div>' +
            (d.notes ? '<div class="compare-slot-notes">' + d.notes.slice(0, 80) + '</div>' : '') +
          '</div>';
      }

      renderSlot(slot1, selectedIds[0]);
      renderSlot(slot2, selectedIds[1]);

      if (panel) {
        if (selectedIds.length > 0) panel.classList.add('open');
        else panel.classList.remove('open');
      }
    }

    /* \u2500\u2500 Card click handler \u2500\u2500 */
    window.handleCardClick = function (id) {
      if (compareMode) {
        var card = document.getElementById('card-' + id);
        var idx  = selectedIds.indexOf(id);

        if (idx !== -1) {
          // Deselect
          selectedIds.splice(idx, 1);
          delete selectedData[id];
          if (card) card.classList.remove('selected');
          var badges = document.querySelectorAll('.compare-badge');
          // Reindex badges
          document.querySelectorAll('.photo-card.selected').forEach(function (c, i) {
            var b = c.querySelector('.compare-badge');
            if (b) b.textContent = i === 0 ? '1' : '2';
          });
        } else {
          if (selectedIds.length >= 2) return; // max 2
          selectedIds.push(id);
          if (card) {
            var d = {
              src:   card.getAttribute('data-src'),
              date:  card.getAttribute('data-date'),
              day:   card.getAttribute('data-day'),
              notes: card.getAttribute('data-notes'),
            };
            selectedData[id] = d;
            card.classList.add('selected');
            var badge = document.getElementById('badge-' + id);
            if (badge) badge.textContent = selectedIds.length === 1 ? '1' : '2';
          }
        }
        updateComparePanel();
      } else {
        // Open lightbox
        var card = document.getElementById('card-' + id);
        if (!card) return;
        var src   = card.getAttribute('data-src');
        var date  = card.getAttribute('data-date');
        var day   = card.getAttribute('data-day');
        var notes = card.getAttribute('data-notes');
        window.openLightbox(src, date, day, notes);
      }
    };

    /* \u2500\u2500 Lightbox \u2500\u2500 */
    window.openLightbox = function (src, date, day, notes) {
      var lb     = document.getElementById('lightbox');
      var lbImg  = document.getElementById('lightboxImg');
      var lbDate = document.getElementById('lightboxDate');
      var lbDay  = document.getElementById('lightboxDay');
      var lbNotes = document.getElementById('lightboxNotes');
      if (!lb) return;
      if (lbImg)   lbImg.src           = src;
      if (lbDate)  lbDate.textContent  = date;
      if (lbDay)   lbDay.textContent   = 'Day ' + day;
      if (lbNotes) lbNotes.textContent = notes || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
      var lb = document.getElementById('lightbox');
      if (lb) lb.classList.remove('open');
      document.body.style.overflow = '';
    };

    // ESC key closes lightbox (slider ESC handled separately below)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closeLightbox();
      }
    });

    /* \u2500\u2500 Delete photo \u2500\u2500 */
    window.deletePhoto = function (id) {
      if (!confirm('Delete this photo? This cannot be undone.')) return;
      fetch('/api/photos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_id: id }),
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            var card = document.getElementById('card-' + id);
            if (card) card.remove();
          } else {
            alert('Could not delete photo: ' + (d.error || 'Unknown error'));
          }
        })
        .catch(function () {
          alert('Network error. Please try again.');
        });
    };

    /* \u2500\u2500 File input / drag-drop \u2500\u2500 */
    var fileInput  = document.getElementById('fileInput');
    var dropZone   = document.getElementById('dropZone');
    var previewImg = document.getElementById('previewImg');
    var dropContent = document.getElementById('dropZoneContent');

    function showPreview(file) {
      if (!file || !file.type.startsWith('image/')) return;
      selectedFile = file;
      var reader = new FileReader();
      reader.onload = function (e) {
        if (previewImg) {
          previewImg.src    = e.target.result;
          previewImg.style.display = 'block';
        }
        if (dropContent) dropContent.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) showPreview(this.files[0]);
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('dragging');
      });
      dropZone.addEventListener('dragleave', function () {
        this.classList.remove('dragging');
      });
      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragging');
        var file = e.dataTransfer && e.dataTransfer.files[0];
        if (file) showPreview(file);
      });
    }

    /* \u2500\u2500 Canvas compression + upload \u2500\u2500 */
    window.doUpload = function () {
      if (!selectedFile) {
        setStatus('Please select an image first.', 'err');
        return;
      }

      var dateVal  = document.getElementById('photoDate') ? document.getElementById('photoDate').value : todayStr;
      var notesVal = document.getElementById('photoNotes') ? document.getElementById('photoNotes').value.trim() : '';
      var btn      = document.getElementById('uploadBtn');
      var MAX_SIZE = 5 * 1024 * 1024; // 5MB

      if (selectedFile.size > MAX_SIZE) {
        setStatus('File too large (max 5MB).', 'err');
        return;
      }

      setStatus('Compressing\u2026', '');
      if (btn) { btn.disabled = true; btn.textContent = 'Uploading\u2026'; }

      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var MAX_DIM = 800;
          var w = img.width;
          var h = img.height;
          if (w > MAX_DIM || h > MAX_DIM) {
            if (w > h) { h = Math.round(h * MAX_DIM / w); w = MAX_DIM; }
            else        { w = Math.round(w * MAX_DIM / h); h = MAX_DIM; }
          }
          var canvas = document.createElement('canvas');
          canvas.width  = w;
          canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          var b64 = canvas.toDataURL('image/jpeg', 0.7);

          setStatus('Uploading\u2026', '');
          fetch('/api/photos/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              photo_data: b64,
              taken_date: dateVal,
              notes: notesVal || null,
            }),
          })
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (d.success) {
                setStatus('Photo uploaded!', 'ok');
                if (btn) { btn.disabled = false; btn.textContent = 'Upload Photo'; }
                setTimeout(function () { window.location.reload(); }, 900);
              } else {
                setStatus(d.error || 'Upload failed.', 'err');
                if (btn) { btn.disabled = false; btn.textContent = 'Upload Photo'; }
              }
            })
            .catch(function () {
              setStatus('Network error. Try again.', 'err');
              if (btn) { btn.disabled = false; btn.textContent = 'Upload Photo'; }
            });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    };

    function setStatus(msg, type) {
      var el = document.getElementById('uploadStatus');
      if (!el) return;
      el.textContent  = msg;
      el.className = 'upload-status' + (type ? ' ' + type : '');
    }

    /* \u2500\u2500 Show/hide Slider button when 2 photos selected \u2500\u2500 */
    var _origUpdateCompare = updateComparePanel;
    updateComparePanel = function() {
      _origUpdateCompare();
      var btn = document.getElementById('btnSlider');
      if (btn) btn.style.display = selectedIds.length === 2 ? 'inline-flex' : 'none';
    };

    /* \u2500\u2500 Before/After Slider \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    var sliderPos = 50; // percentage
    var sliderDragging = false;

    window.openSlider = function() {
      if (selectedIds.length < 2) return;

      // Photo 1 = before (first selected), Photo 2 = after (second selected)
      var d1 = selectedData[selectedIds[0]];
      var d2 = selectedData[selectedIds[1]];
      if (!d1 || !d2) return;

      var before = document.getElementById('sliderImgBefore');
      var after  = document.getElementById('sliderImgAfter');
      var infoL  = document.getElementById('sliderInfoLeft');
      var infoR  = document.getElementById('sliderInfoRight');

      if (before) before.src = d1.src;
      if (after)  after.src  = d2.src;
      if (infoL) {
        infoL.innerHTML = d1.date + '<span>Day ' + d1.day + ' \xB7 Before</span>';
      }
      if (infoR) {
        infoR.innerHTML = d2.date + '<span>Day ' + d2.day + ' \xB7 After</span>';
      }

      sliderPos = 50;
      applySliderPos();

      var overlay = document.getElementById('sliderOverlay');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    window.closeSlider = function() {
      var overlay = document.getElementById('sliderOverlay');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    function applySliderPos() {
      var before   = document.getElementById('sliderImgBefore');
      var divider  = document.getElementById('sliderDivider');
      var handle   = document.getElementById('sliderHandle');
      var pct = sliderPos + '%';
      if (before)  before.style.clipPath  = 'inset(0 ' + (100 - sliderPos) + '% 0 0)';
      if (divider) divider.style.left     = pct;
      if (handle)  handle.style.left      = pct;
    }

    function getSliderPct(clientX) {
      var wrap = document.getElementById('sliderWrap');
      if (!wrap) return 50;
      var rect = wrap.getBoundingClientRect();
      var x    = Math.max(0, Math.min(clientX - rect.left, rect.width));
      return Math.round((x / rect.width) * 100);
    }

    // Mouse events
    var sliderWrap = document.getElementById('sliderWrap');
    if (sliderWrap) {
      sliderWrap.addEventListener('mousedown', function(e) {
        sliderDragging = true;
        sliderPos = getSliderPct(e.clientX);
        applySliderPos();
      });
      document.addEventListener('mousemove', function(e) {
        if (!sliderDragging) return;
        sliderPos = getSliderPct(e.clientX);
        applySliderPos();
      });
      document.addEventListener('mouseup', function() { sliderDragging = false; });

      // Touch events
      sliderWrap.addEventListener('touchstart', function(e) {
        sliderDragging = true;
        sliderPos = getSliderPct(e.touches[0].clientX);
        applySliderPos();
      }, { passive: true });
      sliderWrap.addEventListener('touchmove', function(e) {
        if (!sliderDragging) return;
        sliderPos = getSliderPct(e.touches[0].clientX);
        applySliderPos();
      }, { passive: true });
      sliderWrap.addEventListener('touchend', function() { sliderDragging = false; });
    }

    // Keyboard control for slider
    document.addEventListener('keydown', function(e) {
      var overlay = document.getElementById('sliderOverlay');
      if (!overlay || !overlay.classList.contains('open')) return;
      if (e.key === 'Escape') { window.closeSlider(); return; }
      if (e.key === 'ArrowLeft')  { sliderPos = Math.max(0,   sliderPos - 2); applySliderPos(); }
      if (e.key === 'ArrowRight') { sliderPos = Math.min(100, sliderPos + 2); applySliderPos(); }
    });

  })();
  })();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "photos", "data-astro-cid-h442ufdo": true }), renderComponent($$result, "Image", $$Image, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-h442ufdo": true }), renderComponent($$result, "Upload", $$Upload, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-h442ufdo": true }), totalPhotos >= 2 && renderTemplate`<div class="insights-banner" data-astro-cid-h442ufdo> <div class="insight-pill" data-astro-cid-h442ufdo>${renderComponent($$result, "Camera", $$Camera, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-h442ufdo": true })} ${totalPhotos} photo${totalPhotos === 1 ? "" : "s"}</div> ${spanDays > 0 && renderTemplate`<div class="insight-pill" data-astro-cid-h442ufdo>${renderComponent($$result, "Calendar", $$Calendar, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-h442ufdo": true })} Over ${spanDays} days</div>`} ${daysSinceLast !== null && daysSinceLast > 7 && renderTemplate`<div class="insight-pill warn" data-astro-cid-h442ufdo>${renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-h442ufdo": true })} Last photo ${daysSinceLast} days ago — time for an update!</div>`} ${daysSinceLast !== null && daysSinceLast <= 7 && renderTemplate`<div class="insight-pill" data-astro-cid-h442ufdo>${renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-h442ufdo": true })} Last photo ${daysSinceLast === 0 ? "today" : daysSinceLast + "d ago"}</div>`} <p class="insight-tip" data-astro-cid-h442ufdo>${renderComponent($$result, "Plus", $$Plus, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-h442ufdo": true })} Take photos weekly on the same day for best comparison</p> </div>`, renderComponent($$result, "Camera", $$Camera, { "size": 18, "style": "vertical-align:middle;margin-right:.4rem;", "data-astro-cid-h442ufdo": true }), renderComponent($$result, "Camera", $$Camera, { "size": 36, "data-astro-cid-h442ufdo": true }), addAttribute(todayStr, "max"), totalPhotos > 0 ? `${totalPhotos} Photo${totalPhotos === 1 ? "" : "s"}` : "Your Gallery", renderComponent($$result, "Calendar", $$Calendar, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-h442ufdo": true }), photosWithDay.length === 0 && renderTemplate`<div class="empty-state" data-astro-cid-h442ufdo> <div class="empty-icon" data-astro-cid-h442ufdo>${renderComponent($$result, "Camera", $$Camera, { "size": 42, "data-astro-cid-h442ufdo": true })}</div> <div class="empty-title" data-astro-cid-h442ufdo>Your gallery is empty</div> <p class="empty-sub" data-astro-cid-h442ufdo>
Upload your first progress photo to start tracking your transformation.<br data-astro-cid-h442ufdo>
Seeing is believing — every photo tells your story.
</p> <button class="btn btn-primary" style="margin-top:1.25rem;" onclick="window.toggleUpload()" data-astro-cid-h442ufdo> ${renderComponent($$result, "Upload", $$Upload, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-h442ufdo": true })} Upload First Photo
</button> </div>`, photosWithDay.length > 0 && renderTemplate`<div class="photo-grid" id="photoGrid" data-astro-cid-h442ufdo> ${photosWithDay.map((photo) => {
    const dateFormatted = (/* @__PURE__ */ new Date(photo.taken_date + "T12:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const notesSnippet = photo.notes ? photo.notes.slice(0, 60) + (photo.notes.length > 60 ? "\u2026" : "") : "";
    return renderTemplate`<div class="photo-card"${addAttribute(`card-${photo.id}`, "id")}${addAttribute(photo.id, "data-id")}${addAttribute(photo.photo_data, "data-src")}${addAttribute(dateFormatted, "data-date")}${addAttribute(photo.dayNum, "data-day")}${addAttribute(photo.notes || "", "data-notes")}${addAttribute(`window.handleCardClick('${photo.id}')`, "onclick")} data-astro-cid-h442ufdo> <div class="compare-badge"${addAttribute(`badge-${photo.id}`, "id")} data-astro-cid-h442ufdo>✓</div> <img${addAttribute(photo.photo_data, "src")}${addAttribute(`Progress photo ${dateFormatted}`, "alt")} loading="lazy" data-astro-cid-h442ufdo> <div class="photo-info" data-astro-cid-h442ufdo> <div class="photo-date" data-astro-cid-h442ufdo>${dateFormatted}</div> ${notesSnippet && renderTemplate`<div class="photo-notes" data-astro-cid-h442ufdo>${notesSnippet}</div>`} <div class="photo-meta" data-astro-cid-h442ufdo> <span class="day-badge" data-astro-cid-h442ufdo>Day ${photo.dayNum}</span> <button class="delete-btn" title="Delete photo"${addAttribute(`event.stopPropagation(); window.deletePhoto('${photo.id}')`, "onclick")} data-astro-cid-h442ufdo>×</button> </div> </div> </div>`;
  })} </div>`, photosTimeline.length === 0 && renderTemplate`<div class="empty-state" data-astro-cid-h442ufdo> <div class="empty-icon" data-astro-cid-h442ufdo>${renderComponent($$result, "Calendar", $$Calendar, { "size": 42, "data-astro-cid-h442ufdo": true })}</div> <div class="empty-title" data-astro-cid-h442ufdo>No photos yet</div> <p class="empty-sub" data-astro-cid-h442ufdo>Upload photos to see your timeline.</p> </div>`, photosTimeline.length > 0 && renderTemplate`<div class="timeline-line" data-astro-cid-h442ufdo> ${photosTimeline.map((photo) => {
    const dateFormatted = (/* @__PURE__ */ new Date(photo.taken_date + "T12:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const isMilestone = MILESTONES.includes(photo.dayNum);
    return renderTemplate`<div${addAttribute(`timeline-item${isMilestone ? " timeline-milestone" : ""}`, "class")} data-astro-cid-h442ufdo> <div class="timeline-dot" data-astro-cid-h442ufdo></div> <div class="timeline-date-marker" data-astro-cid-h442ufdo> ${dateFormatted} ${isMilestone && renderTemplate`<span class="milestone-tag" data-astro-cid-h442ufdo>Day ${photo.dayNum}</span>`} </div> <div class="timeline-card"${addAttribute(`window.openLightbox('${photo.photo_data}', '${dateFormatted}', ${photo.dayNum}, \`${(photo.notes || "").replace(/`/g, "'")}\`)`, "onclick")} data-astro-cid-h442ufdo> <img${addAttribute(photo.photo_data, "src")}${addAttribute(`Day ${photo.dayNum}`, "alt")} loading="lazy" data-astro-cid-h442ufdo> <div class="timeline-card-info" data-astro-cid-h442ufdo> <div class="timeline-card-date" data-astro-cid-h442ufdo>${dateFormatted}</div> ${photo.notes && renderTemplate`<div class="timeline-card-notes" data-astro-cid-h442ufdo> ${photo.notes.slice(0, 120)}${photo.notes.length > 120 ? "\u2026" : ""} </div>`} <span class="timeline-card-day" data-astro-cid-h442ufdo>Day ${photo.dayNum}</span> </div> </div> </div>`;
  })} </div>`, renderComponent($$result, "BarChart2", $$BarChart2, { "size": 16, "style": "vertical-align:middle;margin-right:.4rem;", "data-astro-cid-h442ufdo": true }), defineScriptVars({ todayStr }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/photos.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/photos.astro";
const $$url = "/dashboard/photos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Photos,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
