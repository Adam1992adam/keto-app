/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, r as renderComponent, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { $ as $$Users, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$MessageCircle } from '../../chunks/MessageCircle_ByI6Dj0C.mjs';
import { $ as $$Lock } from '../../chunks/Lock_qAq--S7c.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$Trophy } from '../../chunks/Trophy_B5AXSz5D.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Community = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Community;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  if (profile.subscription_tier !== "elite_12") {
    return Astro2.redirect("/dashboard/upgrade");
  }
  const planType = profile.subscription_tier;
  const userName = profile.full_name || "Member";
  const tierLabel = "\u{1F451} Elite";
  const { count: memberCount } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_tier", "elite_12");
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Community \xB7 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "</head> <body> ", ' <!-- GROUP COVER BANNER --> <div id="comCover"> <div id="comCoverBg"></div> <div id="comCoverContent"> <div id="comGroupIcon">', '</div> <div id="comGroupInfo"> <h1 id="comGroupName">Elite Keto <em>Community</em></h1> <p id="comGroupDesc">Private group \xB7 ', ' Elite members \xB7 Share your journey, recipes &amp; wins</p> <div id="comGroupMeta"> <span class="com-badge">', ' Elite members only</span> <span class="com-badge">', ' 365-day journey</span> <span class="com-badge">', ' Global community</span> </div> </div> <button id="openPostBtn" class="com-post-btn"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>\nCreate Post\n</button> </div> </div> <!-- MAIN LAYOUT --> <div id="comLayout"> <!-- LEFT SIDEBAR --> <aside id="comSidebar"> <div class="com-side-card"> <div class="com-side-title">About this group</div> <p class="com-side-body">A private space for Elite Keto Journey members to share progress, recipes, tips and motivation on the 12-month program.</p> <div class="com-side-stat"><span>', "</span><span>", ' members</span></div> <div class="com-side-stat"><span>', '</span><span>Private \xB7 Elite only</span></div> <div class="com-side-stat"><span>', '</span><span>12-month program</span></div> </div> <div class="com-side-card"> <div class="com-side-title">Categories</div> <div id="sidebarCats"> <button class="com-cat-pill active" data-cat="all">All Posts</button> <button class="com-cat-pill" data-cat="progress">', ' Progress</button> <button class="com-cat-pill" data-cat="recipes">Recipes</button> <button class="com-cat-pill" data-cat="tips">Tips</button> <button class="com-cat-pill" data-cat="motivation">', ' Motivation</button> <button class="com-cat-pill" data-cat="general">', ' General</button> </div> </div> </aside> <!-- FEED --> <main id="comFeed"> <!-- Write post shortcut --> <div id="comWriteBar"> <div id="comWriteAvatar">', `</div> <button id="comWriteBtn">What's on your mind, `, '?</button> </div> <!-- Category tabs (mobile) --> <div id="comMobileCats"> <button class="com-tab active" data-cat="all">All</button> <button class="com-tab" data-cat="progress">Progress</button> <button class="com-tab" data-cat="recipes">Recipes</button> <button class="com-tab" data-cat="tips">Tips</button> <button class="com-tab" data-cat="motivation">Motivation</button> <button class="com-tab" data-cat="general">General</button> </div> <!-- Posts list --> <div id="postsList"> <div class="com-loading"><div class="com-spinner"></div></div> </div> <button id="loadMoreBtn" style="display:none">Load more</button> </main> </div> <!-- CREATE POST MODAL --> <div id="postModal" class="com-modal-overlay"> <div class="com-modal"> <div class="com-modal-head"> <h2>Create Post</h2> <button id="closeModal" class="com-modal-close">&times;</button> </div> <div class="com-modal-author"> <div class="com-av com-av-lg">', '</div> <div> <div class="com-author-name">', '</div> <select id="postCategory" class="com-cat-select"> <option value="general">\u{1F4AC} General</option> <option value="progress">\u{1F4C8} Progress Update</option> <option value="recipes">\u{1F373} Recipe Share</option> <option value="tips">\u{1F4A1} Tips &amp; Tricks</option> <option value="motivation">\u{1F525} Motivation</option> </select> </div> </div> <textarea id="postContent" class="com-textarea" placeholder="Share your progress, a recipe, tip or win..."></textarea> <div class="com-char-row"> <span id="postError" class="com-err"></span> <span id="charCount">0 / 2000</span> </div> <div class="com-modal-footer"> <button id="cancelPost" class="com-btn-ghost">Cancel</button> <button id="submitPost" class="com-btn-primary">Post</button> </div> </div> </div>  <script>(function(){', `
  (function() {
    // \u2500\u2500 State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var state = { cat: 'all', page: 1, hasMore: false };
    var myInitial = userName.charAt(0).toUpperCase();
    var avatarColors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];

    function colorFor(name) {
      var code = 0;
      for (var i = 0; i < name.length; i++) code += name.charCodeAt(i);
      return avatarColors[code % avatarColors.length];
    }

    function timeAgo(d) {
      var diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
      if (diff < 60)   return 'just now';
      if (diff < 3600) return Math.floor(diff/60) + 'm';
      if (diff < 86400)return Math.floor(diff/3600) + 'h';
      if (diff < 604800) return Math.floor(diff/86400) + 'd';
      return new Date(d).toLocaleDateString('en', { month:'short', day:'numeric' });
    }

    function esc(s) {
      return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // \u2500\u2500 Render post card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderPost(p) {
      var col = colorFor(p.author_name || 'M');
      var isLong = (p.content || '').length > 400;
      var myLike = p.my_reactions && p.my_reactions.indexOf('like')  !== -1;
      var myFire = p.my_reactions && p.my_reactions.indexOf('fire')  !== -1;
      var myClap = p.my_reactions && p.my_reactions.indexOf('clap')  !== -1;

      var el = document.createElement('article');
      el.className = 'com-post';
      el.dataset.id = p.id;

      var html = '';

      // Pinned bar
      if (p.is_pinned) {
        html += '<div class="com-pinned-bar">\u{1F4CC} Pinned post</div>';
      }

      // Header
      html += '<div class="com-post-head">';
      html += '<div class="com-av" style="background:linear-gradient(135deg,' + col + ',rgba(52,211,153,.7))">' + esc((p.author_name||'M').charAt(0).toUpperCase()) + '</div>';
      html += '<div class="com-post-meta">';
      html += '<div class="com-post-author">';
      html += esc(p.author_name || 'Member');
      html += ' <span class="com-tier-badge">\u{1F451} Elite</span>';
      html += ' <span class="com-cat-tag ' + esc(p.category) + '">' + esc(p.category) + '</span>';
      html += '</div>';
      html += '<div class="com-post-time">' + timeAgo(p.created_at) + '</div>';
      html += '</div>';
      // Menu
      html += '<div class="com-post-menu">';
      html += '<button class="com-menu-btn" onclick="toggleMenu(this)">\xB7\xB7\xB7</button>';
      html += '<div class="com-dropdown">';
      if (p.is_own) {
        html += '<div class="com-drop-item danger" onclick="deletePost(\\'' + esc(p.id) + '\\', this)">\u{1F5D1} Delete</div>';
      }
      html += '<div class="com-drop-item" onclick="copyLink(\\'' + esc(p.id) + '\\')">\u{1F517} Copy link</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>'; // post-head

      // Body
      html += '<div class="com-post-body">';
      if (isLong) {
        html += '<div class="com-post-text collapsed" id="pt-' + esc(p.id) + '">' + esc(p.content) + '</div>';
        html += '<button class="com-see-more" onclick="expandPost(\\'' + esc(p.id) + '\\', this)">See more</button>';
      } else {
        html += '<div class="com-post-text">' + esc(p.content) + '</div>';
      }
      html += '</div>';

      // Reaction counts (only show if > 0)
      var hasCounts = (p.like_count||0) + (p.fire_count||0) + (p.clap_count||0) > 0 || (p.comment_count||0) > 0;
      if (hasCounts) {
        html += '<div class="com-reaction-counts">';
        if ((p.like_count||0) > 0) html += '<span class="com-rc-item">\u2764\uFE0F <span id="lc-' + esc(p.id) + '">' + (p.like_count||0) + '</span></span>';
        if ((p.fire_count||0) > 0) html += '<span class="com-rc-item">\u{1F525} <span id="fc-' + esc(p.id) + '">' + (p.fire_count||0) + '</span></span>';
        if ((p.clap_count||0) > 0) html += '<span class="com-rc-item">\u{1F44F} <span id="cc-' + esc(p.id) + '">' + (p.clap_count||0) + '</span></span>';
        if ((p.comment_count||0) > 0) html += '<span class="com-rc-item" style="margin-left:auto">\u{1F4AC} ' + (p.comment_count||0) + ' comment' + ((p.comment_count||0) !== 1 ? 's':'') + '</span>';
        html += '</div>';
      }

      // Action bar
      html += '<div class="com-post-actions">';
      html += '<button class="com-react' + (myLike ? ' active-like':'') + '" data-type="like" onclick="react(\\'' + esc(p.id) + '\\',\\'like\\',this)">\u2764\uFE0F Like</button>';
      html += '<button class="com-react' + (myFire ? ' active-fire':'') + '" data-type="fire" onclick="react(\\'' + esc(p.id) + '\\',\\'fire\\',this)">\u{1F525} Fire</button>';
      html += '<button class="com-react' + (myClap ? ' active-clap':'') + '" data-type="clap" onclick="react(\\'' + esc(p.id) + '\\',\\'clap\\',this)">\u{1F44F} Clap</button>';
      html += '<button class="com-react" onclick="toggleComments(\\'' + esc(p.id) + '\\',this)">\u{1F4AC} Comment</button>';
      html += '</div>';

      // Comments panel (lazy loaded)
      html += '<div class="com-comments" id="cmts-' + esc(p.id) + '">';
      html += '<div class="com-comment-input-row">';
      html += '<div class="com-comment-av" style="background:linear-gradient(135deg,' + colorFor(userName) + ',rgba(52,211,153,.6))">' + myInitial + '</div>';
      html += '<textarea class="com-comment-input" placeholder="Write a comment..." rows="1" id="ci-' + esc(p.id) + '"></textarea>';
      html += '<button class="com-comment-send" onclick="sendComment(\\'' + esc(p.id) + '\\')" id="cs-' + esc(p.id) + '">';
      html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      html += '</button>';
      html += '</div>';
      html += '<div class="com-comments-inner" id="cl-' + esc(p.id) + '"></div>';
      html += '</div>';

      el.innerHTML = html;
      return el;
    }

    // \u2500\u2500 Load posts \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function loadPosts(append) {
      var feed = document.getElementById('postsList');
      if (!append) feed.innerHTML = '<div class="com-loading"><div class="com-spinner"></div></div>';

      fetch('/api/community/posts?category=' + state.cat + '&page=' + state.page)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!append) feed.innerHTML = '';
          var posts = data.posts || [];
          if (!posts.length && !append) {
            feed.innerHTML = '<div class="com-empty"><div class="com-empty-icon">\u{1F33F}</div><div class="com-empty-title">No posts yet</div><div class="com-empty-sub">Be the first to share something with the community!</div></div>';
          }
          posts.forEach(function(p) { feed.appendChild(renderPost(p)); });
          state.hasMore = data.has_more;
          document.getElementById('loadMoreBtn').style.display = state.hasMore ? '' : 'none';
        }).catch(function() {
          if (!append) feed.innerHTML = '<div class="com-empty"><div class="com-empty-icon">\u26A0\uFE0F</div><div class="com-empty-title">Failed to load posts</div><div class="com-empty-sub">Please refresh the page.</div></div>';
        });
    }

    // \u2500\u2500 Category switching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function setCategory(cat) {
      state.cat = cat;
      state.page = 1;
      // Update all tab/pill UI
      document.querySelectorAll('.com-tab, .com-cat-pill').forEach(function(b) {
        b.classList.toggle('active', b.dataset.cat === cat);
      });
      loadPosts(false);
    }

    document.getElementById('sidebarCats').addEventListener('click', function(e) {
      var b = e.target.closest('.com-cat-pill');
      if (b) setCategory(b.dataset.cat);
    });
    document.getElementById('comMobileCats').addEventListener('click', function(e) {
      var b = e.target.closest('.com-tab');
      if (b) setCategory(b.dataset.cat);
    });

    document.getElementById('loadMoreBtn').addEventListener('click', function() {
      state.page++;
      loadPosts(true);
    });

    // \u2500\u2500 Reactions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.react = function(postId, type, btn) {
      fetch('/api/community/posts/' + postId + '/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction_type: type }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.error) return;
        var activeClass = 'active-' + type;
        var added = data.action === 'added';
        btn.classList.toggle(activeClass, added);
        // Update count display in reaction bar
        var fieldMap = { like: 'lc', fire: 'fc', clap: 'cc' };
        var countEl = document.getElementById(fieldMap[type] + '-' + postId);
        if (countEl) {
          var cur = parseInt(countEl.textContent) || 0;
          countEl.textContent = added ? cur + 1 : Math.max(0, cur - 1);
          // Show/hide reaction counts bar based on totals
        }
      });
    };

    // \u2500\u2500 Comments \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.toggleComments = function(postId, btn) {
      var panel = document.getElementById('cmts-' + postId);
      var isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      btn.classList.toggle('active-comment', !isOpen);
      if (!isOpen) {
        loadComments(postId);
        setTimeout(function() {
          var inp = document.getElementById('ci-' + postId);
          if (inp) inp.focus();
        }, 150);
      }
    };

    function loadComments(postId) {
      var list = document.getElementById('cl-' + postId);
      if (!list || list.dataset.loaded === 'true') return;
      list.innerHTML = '<div style="text-align:center;padding:.5rem;color:var(--soft);font-size:.78rem">Loading\u2026</div>';
      fetch('/api/community/posts/' + postId + '/comments')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          list.innerHTML = '';
          list.dataset.loaded = 'true';
          (data.comments || []).forEach(function(c) { list.appendChild(renderComment(c)); });
        });
    }

    function renderComment(c) {
      var col = colorFor(c.author_name || 'M');
      var el = document.createElement('div');
      el.className = 'com-comment';
      el.innerHTML =
        '<div class="com-comment-av" style="background:linear-gradient(135deg,' + col + ',rgba(52,211,153,.6))">' + esc((c.author_name||'M').charAt(0).toUpperCase()) + '</div>' +
        '<div class="com-comment-bubble">' +
          '<div class="com-comment-author">' + esc(c.author_name || 'Member') + '</div>' +
          '<div class="com-comment-text">' + esc(c.content) + '</div>' +
          '<div class="com-comment-time">' + timeAgo(c.created_at) + '</div>' +
        '</div>';
      return el;
    }

    window.sendComment = function(postId) {
      var inp = document.getElementById('ci-' + postId);
      var btn = document.getElementById('cs-' + postId);
      var text = inp ? inp.value.trim() : '';
      if (!text) return;
      btn.disabled = true;
      fetch('/api/community/posts/' + postId + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        btn.disabled = false;
        if (data.error) return;
        inp.value = '';
        var list = document.getElementById('cl-' + postId);
        if (list) {
          list.dataset.loaded = 'true';
          var newC = { author_name: userName, content: text, created_at: new Date().toISOString() };
          list.appendChild(renderComment(newC));
          // Scroll to new comment
          list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        // Update comment count
        var card = document.querySelector('[data-id="' + postId + '"]');
        if (card) {
          var cBtn = card.querySelector('.com-react:last-child');
          // Increment comment count in reaction bar if present
          var existing = card.querySelector('.com-reaction-counts');
          // Simple approach: update button text isn't trivial here; let full reload handle accurate count
        }
      });
    };

    // Enter to submit comment (Shift+Enter for newline)
    document.getElementById('postsList').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && e.target.classList.contains('com-comment-input')) {
        e.preventDefault();
        var postId = e.target.id.replace('ci-', '');
        window.sendComment(postId);
      }
    });

    // \u2500\u2500 Post creation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var modal = document.getElementById('postModal');
    function openModal() { modal.classList.add('open'); document.getElementById('postContent').focus(); }
    function closeModal() { modal.classList.remove('open'); }

    document.getElementById('openPostBtn').addEventListener('click', openModal);
    document.getElementById('comWriteBtn').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelPost').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

    var contentEl = document.getElementById('postContent');
    contentEl.addEventListener('input', function() {
      document.getElementById('charCount').textContent = contentEl.value.length + ' / 2000';
    });

    document.getElementById('submitPost').addEventListener('click', function() {
      var content = contentEl.value.trim();
      var category = document.getElementById('postCategory').value;
      var errEl = document.getElementById('postError');
      errEl.textContent = '';
      if (content.length < 3) { errEl.textContent = 'Post too short.'; return; }
      var btn = document.getElementById('submitPost');
      btn.disabled = true; btn.textContent = 'Posting\u2026';
      fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content, category: category }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        btn.disabled = false; btn.textContent = 'Post';
        if (data.error) { errEl.textContent = data.error; return; }
        closeModal();
        contentEl.value = '';
        document.getElementById('charCount').textContent = '0 / 2000';
        state.page = 1;
        loadPosts(false);
      }).catch(function() {
        btn.disabled = false; btn.textContent = 'Post';
        errEl.textContent = 'Network error.';
      });
    });

    // \u2500\u2500 Misc actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.toggleMenu = function(btn) {
      var dd = btn.nextElementSibling;
      var wasOpen = dd.classList.contains('open');
      // Close all other dropdowns first
      document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      if (!wasOpen) dd.classList.add('open');
    };
    // Close menus on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.com-post-menu')) {
        document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      }
    });

    window.deletePost = function(postId, el) {
      if (!confirm('Delete this post?')) return;
      fetch('/api/community/posts/' + postId + '/delete', { method: 'POST' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.error) return;
          var card = document.querySelector('[data-id="' + postId + '"]');
          if (card) card.remove();
        });
    };

    window.expandPost = function(postId, btn) {
      var textEl = document.getElementById('pt-' + postId);
      if (textEl) { textEl.classList.remove('collapsed'); btn.remove(); }
    };

    window.copyLink = function(postId) {
      navigator.clipboard && navigator.clipboard.writeText(window.location.origin + '/dashboard/community#' + postId);
      document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
    };

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    loadPosts(false);
  })();
  })();<\/script> </body> </html>`], ['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Community \xB7 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "</head> <body> ", ' <!-- GROUP COVER BANNER --> <div id="comCover"> <div id="comCoverBg"></div> <div id="comCoverContent"> <div id="comGroupIcon">', '</div> <div id="comGroupInfo"> <h1 id="comGroupName">Elite Keto <em>Community</em></h1> <p id="comGroupDesc">Private group \xB7 ', ' Elite members \xB7 Share your journey, recipes &amp; wins</p> <div id="comGroupMeta"> <span class="com-badge">', ' Elite members only</span> <span class="com-badge">', ' 365-day journey</span> <span class="com-badge">', ' Global community</span> </div> </div> <button id="openPostBtn" class="com-post-btn"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>\nCreate Post\n</button> </div> </div> <!-- MAIN LAYOUT --> <div id="comLayout"> <!-- LEFT SIDEBAR --> <aside id="comSidebar"> <div class="com-side-card"> <div class="com-side-title">About this group</div> <p class="com-side-body">A private space for Elite Keto Journey members to share progress, recipes, tips and motivation on the 12-month program.</p> <div class="com-side-stat"><span>', "</span><span>", ' members</span></div> <div class="com-side-stat"><span>', '</span><span>Private \xB7 Elite only</span></div> <div class="com-side-stat"><span>', '</span><span>12-month program</span></div> </div> <div class="com-side-card"> <div class="com-side-title">Categories</div> <div id="sidebarCats"> <button class="com-cat-pill active" data-cat="all">All Posts</button> <button class="com-cat-pill" data-cat="progress">', ' Progress</button> <button class="com-cat-pill" data-cat="recipes">Recipes</button> <button class="com-cat-pill" data-cat="tips">Tips</button> <button class="com-cat-pill" data-cat="motivation">', ' Motivation</button> <button class="com-cat-pill" data-cat="general">', ' General</button> </div> </div> </aside> <!-- FEED --> <main id="comFeed"> <!-- Write post shortcut --> <div id="comWriteBar"> <div id="comWriteAvatar">', `</div> <button id="comWriteBtn">What's on your mind, `, '?</button> </div> <!-- Category tabs (mobile) --> <div id="comMobileCats"> <button class="com-tab active" data-cat="all">All</button> <button class="com-tab" data-cat="progress">Progress</button> <button class="com-tab" data-cat="recipes">Recipes</button> <button class="com-tab" data-cat="tips">Tips</button> <button class="com-tab" data-cat="motivation">Motivation</button> <button class="com-tab" data-cat="general">General</button> </div> <!-- Posts list --> <div id="postsList"> <div class="com-loading"><div class="com-spinner"></div></div> </div> <button id="loadMoreBtn" style="display:none">Load more</button> </main> </div> <!-- CREATE POST MODAL --> <div id="postModal" class="com-modal-overlay"> <div class="com-modal"> <div class="com-modal-head"> <h2>Create Post</h2> <button id="closeModal" class="com-modal-close">&times;</button> </div> <div class="com-modal-author"> <div class="com-av com-av-lg">', '</div> <div> <div class="com-author-name">', '</div> <select id="postCategory" class="com-cat-select"> <option value="general">\u{1F4AC} General</option> <option value="progress">\u{1F4C8} Progress Update</option> <option value="recipes">\u{1F373} Recipe Share</option> <option value="tips">\u{1F4A1} Tips &amp; Tricks</option> <option value="motivation">\u{1F525} Motivation</option> </select> </div> </div> <textarea id="postContent" class="com-textarea" placeholder="Share your progress, a recipe, tip or win..."></textarea> <div class="com-char-row"> <span id="postError" class="com-err"></span> <span id="charCount">0 / 2000</span> </div> <div class="com-modal-footer"> <button id="cancelPost" class="com-btn-ghost">Cancel</button> <button id="submitPost" class="com-btn-primary">Post</button> </div> </div> </div>  <script>(function(){', `
  (function() {
    // \u2500\u2500 State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var state = { cat: 'all', page: 1, hasMore: false };
    var myInitial = userName.charAt(0).toUpperCase();
    var avatarColors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];

    function colorFor(name) {
      var code = 0;
      for (var i = 0; i < name.length; i++) code += name.charCodeAt(i);
      return avatarColors[code % avatarColors.length];
    }

    function timeAgo(d) {
      var diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
      if (diff < 60)   return 'just now';
      if (diff < 3600) return Math.floor(diff/60) + 'm';
      if (diff < 86400)return Math.floor(diff/3600) + 'h';
      if (diff < 604800) return Math.floor(diff/86400) + 'd';
      return new Date(d).toLocaleDateString('en', { month:'short', day:'numeric' });
    }

    function esc(s) {
      return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // \u2500\u2500 Render post card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderPost(p) {
      var col = colorFor(p.author_name || 'M');
      var isLong = (p.content || '').length > 400;
      var myLike = p.my_reactions && p.my_reactions.indexOf('like')  !== -1;
      var myFire = p.my_reactions && p.my_reactions.indexOf('fire')  !== -1;
      var myClap = p.my_reactions && p.my_reactions.indexOf('clap')  !== -1;

      var el = document.createElement('article');
      el.className = 'com-post';
      el.dataset.id = p.id;

      var html = '';

      // Pinned bar
      if (p.is_pinned) {
        html += '<div class="com-pinned-bar">\u{1F4CC} Pinned post</div>';
      }

      // Header
      html += '<div class="com-post-head">';
      html += '<div class="com-av" style="background:linear-gradient(135deg,' + col + ',rgba(52,211,153,.7))">' + esc((p.author_name||'M').charAt(0).toUpperCase()) + '</div>';
      html += '<div class="com-post-meta">';
      html += '<div class="com-post-author">';
      html += esc(p.author_name || 'Member');
      html += ' <span class="com-tier-badge">\u{1F451} Elite</span>';
      html += ' <span class="com-cat-tag ' + esc(p.category) + '">' + esc(p.category) + '</span>';
      html += '</div>';
      html += '<div class="com-post-time">' + timeAgo(p.created_at) + '</div>';
      html += '</div>';
      // Menu
      html += '<div class="com-post-menu">';
      html += '<button class="com-menu-btn" onclick="toggleMenu(this)">\xB7\xB7\xB7</button>';
      html += '<div class="com-dropdown">';
      if (p.is_own) {
        html += '<div class="com-drop-item danger" onclick="deletePost(\\\\'' + esc(p.id) + '\\\\', this)">\u{1F5D1} Delete</div>';
      }
      html += '<div class="com-drop-item" onclick="copyLink(\\\\'' + esc(p.id) + '\\\\')">\u{1F517} Copy link</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>'; // post-head

      // Body
      html += '<div class="com-post-body">';
      if (isLong) {
        html += '<div class="com-post-text collapsed" id="pt-' + esc(p.id) + '">' + esc(p.content) + '</div>';
        html += '<button class="com-see-more" onclick="expandPost(\\\\'' + esc(p.id) + '\\\\', this)">See more</button>';
      } else {
        html += '<div class="com-post-text">' + esc(p.content) + '</div>';
      }
      html += '</div>';

      // Reaction counts (only show if > 0)
      var hasCounts = (p.like_count||0) + (p.fire_count||0) + (p.clap_count||0) > 0 || (p.comment_count||0) > 0;
      if (hasCounts) {
        html += '<div class="com-reaction-counts">';
        if ((p.like_count||0) > 0) html += '<span class="com-rc-item">\u2764\uFE0F <span id="lc-' + esc(p.id) + '">' + (p.like_count||0) + '</span></span>';
        if ((p.fire_count||0) > 0) html += '<span class="com-rc-item">\u{1F525} <span id="fc-' + esc(p.id) + '">' + (p.fire_count||0) + '</span></span>';
        if ((p.clap_count||0) > 0) html += '<span class="com-rc-item">\u{1F44F} <span id="cc-' + esc(p.id) + '">' + (p.clap_count||0) + '</span></span>';
        if ((p.comment_count||0) > 0) html += '<span class="com-rc-item" style="margin-left:auto">\u{1F4AC} ' + (p.comment_count||0) + ' comment' + ((p.comment_count||0) !== 1 ? 's':'') + '</span>';
        html += '</div>';
      }

      // Action bar
      html += '<div class="com-post-actions">';
      html += '<button class="com-react' + (myLike ? ' active-like':'') + '" data-type="like" onclick="react(\\\\'' + esc(p.id) + '\\\\',\\\\'like\\\\',this)">\u2764\uFE0F Like</button>';
      html += '<button class="com-react' + (myFire ? ' active-fire':'') + '" data-type="fire" onclick="react(\\\\'' + esc(p.id) + '\\\\',\\\\'fire\\\\',this)">\u{1F525} Fire</button>';
      html += '<button class="com-react' + (myClap ? ' active-clap':'') + '" data-type="clap" onclick="react(\\\\'' + esc(p.id) + '\\\\',\\\\'clap\\\\',this)">\u{1F44F} Clap</button>';
      html += '<button class="com-react" onclick="toggleComments(\\\\'' + esc(p.id) + '\\\\',this)">\u{1F4AC} Comment</button>';
      html += '</div>';

      // Comments panel (lazy loaded)
      html += '<div class="com-comments" id="cmts-' + esc(p.id) + '">';
      html += '<div class="com-comment-input-row">';
      html += '<div class="com-comment-av" style="background:linear-gradient(135deg,' + colorFor(userName) + ',rgba(52,211,153,.6))">' + myInitial + '</div>';
      html += '<textarea class="com-comment-input" placeholder="Write a comment..." rows="1" id="ci-' + esc(p.id) + '"></textarea>';
      html += '<button class="com-comment-send" onclick="sendComment(\\\\'' + esc(p.id) + '\\\\')" id="cs-' + esc(p.id) + '">';
      html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      html += '</button>';
      html += '</div>';
      html += '<div class="com-comments-inner" id="cl-' + esc(p.id) + '"></div>';
      html += '</div>';

      el.innerHTML = html;
      return el;
    }

    // \u2500\u2500 Load posts \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function loadPosts(append) {
      var feed = document.getElementById('postsList');
      if (!append) feed.innerHTML = '<div class="com-loading"><div class="com-spinner"></div></div>';

      fetch('/api/community/posts?category=' + state.cat + '&page=' + state.page)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!append) feed.innerHTML = '';
          var posts = data.posts || [];
          if (!posts.length && !append) {
            feed.innerHTML = '<div class="com-empty"><div class="com-empty-icon">\u{1F33F}</div><div class="com-empty-title">No posts yet</div><div class="com-empty-sub">Be the first to share something with the community!</div></div>';
          }
          posts.forEach(function(p) { feed.appendChild(renderPost(p)); });
          state.hasMore = data.has_more;
          document.getElementById('loadMoreBtn').style.display = state.hasMore ? '' : 'none';
        }).catch(function() {
          if (!append) feed.innerHTML = '<div class="com-empty"><div class="com-empty-icon">\u26A0\uFE0F</div><div class="com-empty-title">Failed to load posts</div><div class="com-empty-sub">Please refresh the page.</div></div>';
        });
    }

    // \u2500\u2500 Category switching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function setCategory(cat) {
      state.cat = cat;
      state.page = 1;
      // Update all tab/pill UI
      document.querySelectorAll('.com-tab, .com-cat-pill').forEach(function(b) {
        b.classList.toggle('active', b.dataset.cat === cat);
      });
      loadPosts(false);
    }

    document.getElementById('sidebarCats').addEventListener('click', function(e) {
      var b = e.target.closest('.com-cat-pill');
      if (b) setCategory(b.dataset.cat);
    });
    document.getElementById('comMobileCats').addEventListener('click', function(e) {
      var b = e.target.closest('.com-tab');
      if (b) setCategory(b.dataset.cat);
    });

    document.getElementById('loadMoreBtn').addEventListener('click', function() {
      state.page++;
      loadPosts(true);
    });

    // \u2500\u2500 Reactions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.react = function(postId, type, btn) {
      fetch('/api/community/posts/' + postId + '/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction_type: type }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.error) return;
        var activeClass = 'active-' + type;
        var added = data.action === 'added';
        btn.classList.toggle(activeClass, added);
        // Update count display in reaction bar
        var fieldMap = { like: 'lc', fire: 'fc', clap: 'cc' };
        var countEl = document.getElementById(fieldMap[type] + '-' + postId);
        if (countEl) {
          var cur = parseInt(countEl.textContent) || 0;
          countEl.textContent = added ? cur + 1 : Math.max(0, cur - 1);
          // Show/hide reaction counts bar based on totals
        }
      });
    };

    // \u2500\u2500 Comments \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.toggleComments = function(postId, btn) {
      var panel = document.getElementById('cmts-' + postId);
      var isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      btn.classList.toggle('active-comment', !isOpen);
      if (!isOpen) {
        loadComments(postId);
        setTimeout(function() {
          var inp = document.getElementById('ci-' + postId);
          if (inp) inp.focus();
        }, 150);
      }
    };

    function loadComments(postId) {
      var list = document.getElementById('cl-' + postId);
      if (!list || list.dataset.loaded === 'true') return;
      list.innerHTML = '<div style="text-align:center;padding:.5rem;color:var(--soft);font-size:.78rem">Loading\u2026</div>';
      fetch('/api/community/posts/' + postId + '/comments')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          list.innerHTML = '';
          list.dataset.loaded = 'true';
          (data.comments || []).forEach(function(c) { list.appendChild(renderComment(c)); });
        });
    }

    function renderComment(c) {
      var col = colorFor(c.author_name || 'M');
      var el = document.createElement('div');
      el.className = 'com-comment';
      el.innerHTML =
        '<div class="com-comment-av" style="background:linear-gradient(135deg,' + col + ',rgba(52,211,153,.6))">' + esc((c.author_name||'M').charAt(0).toUpperCase()) + '</div>' +
        '<div class="com-comment-bubble">' +
          '<div class="com-comment-author">' + esc(c.author_name || 'Member') + '</div>' +
          '<div class="com-comment-text">' + esc(c.content) + '</div>' +
          '<div class="com-comment-time">' + timeAgo(c.created_at) + '</div>' +
        '</div>';
      return el;
    }

    window.sendComment = function(postId) {
      var inp = document.getElementById('ci-' + postId);
      var btn = document.getElementById('cs-' + postId);
      var text = inp ? inp.value.trim() : '';
      if (!text) return;
      btn.disabled = true;
      fetch('/api/community/posts/' + postId + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        btn.disabled = false;
        if (data.error) return;
        inp.value = '';
        var list = document.getElementById('cl-' + postId);
        if (list) {
          list.dataset.loaded = 'true';
          var newC = { author_name: userName, content: text, created_at: new Date().toISOString() };
          list.appendChild(renderComment(newC));
          // Scroll to new comment
          list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        // Update comment count
        var card = document.querySelector('[data-id="' + postId + '"]');
        if (card) {
          var cBtn = card.querySelector('.com-react:last-child');
          // Increment comment count in reaction bar if present
          var existing = card.querySelector('.com-reaction-counts');
          // Simple approach: update button text isn't trivial here; let full reload handle accurate count
        }
      });
    };

    // Enter to submit comment (Shift+Enter for newline)
    document.getElementById('postsList').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && e.target.classList.contains('com-comment-input')) {
        e.preventDefault();
        var postId = e.target.id.replace('ci-', '');
        window.sendComment(postId);
      }
    });

    // \u2500\u2500 Post creation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var modal = document.getElementById('postModal');
    function openModal() { modal.classList.add('open'); document.getElementById('postContent').focus(); }
    function closeModal() { modal.classList.remove('open'); }

    document.getElementById('openPostBtn').addEventListener('click', openModal);
    document.getElementById('comWriteBtn').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelPost').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

    var contentEl = document.getElementById('postContent');
    contentEl.addEventListener('input', function() {
      document.getElementById('charCount').textContent = contentEl.value.length + ' / 2000';
    });

    document.getElementById('submitPost').addEventListener('click', function() {
      var content = contentEl.value.trim();
      var category = document.getElementById('postCategory').value;
      var errEl = document.getElementById('postError');
      errEl.textContent = '';
      if (content.length < 3) { errEl.textContent = 'Post too short.'; return; }
      var btn = document.getElementById('submitPost');
      btn.disabled = true; btn.textContent = 'Posting\u2026';
      fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content, category: category }),
      }).then(function(r) { return r.json(); }).then(function(data) {
        btn.disabled = false; btn.textContent = 'Post';
        if (data.error) { errEl.textContent = data.error; return; }
        closeModal();
        contentEl.value = '';
        document.getElementById('charCount').textContent = '0 / 2000';
        state.page = 1;
        loadPosts(false);
      }).catch(function() {
        btn.disabled = false; btn.textContent = 'Post';
        errEl.textContent = 'Network error.';
      });
    });

    // \u2500\u2500 Misc actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    window.toggleMenu = function(btn) {
      var dd = btn.nextElementSibling;
      var wasOpen = dd.classList.contains('open');
      // Close all other dropdowns first
      document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      if (!wasOpen) dd.classList.add('open');
    };
    // Close menus on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.com-post-menu')) {
        document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      }
    });

    window.deletePost = function(postId, el) {
      if (!confirm('Delete this post?')) return;
      fetch('/api/community/posts/' + postId + '/delete', { method: 'POST' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.error) return;
          var card = document.querySelector('[data-id="' + postId + '"]');
          if (card) card.remove();
        });
    };

    window.expandPost = function(postId, btn) {
      var textEl = document.getElementById('pt-' + postId);
      if (textEl) { textEl.classList.remove('collapsed'); btn.remove(); }
    };

    window.copyLink = function(postId) {
      navigator.clipboard && navigator.clipboard.writeText(window.location.origin + '/dashboard/community#' + postId);
      document.querySelectorAll('.com-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
    };

    // \u2500\u2500 Init \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    loadPosts(false);
  })();
  })();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "community" }), renderComponent($$result, "Users", $$Users, { "size": 32 }), memberCount || 0, renderComponent($$result, "Lock", $$Lock, { "size": 12, "style": "display:inline;vertical-align:middle;" }), renderComponent($$result, "Calendar", $$Calendar, { "size": 12, "style": "display:inline;vertical-align:middle;" }), renderComponent($$result, "Users", $$Users, { "size": 12, "style": "display:inline;vertical-align:middle;" }), renderComponent($$result, "Trophy", $$Trophy, { "size": 14 }), memberCount || 0, renderComponent($$result, "Lock", $$Lock, { "size": 14 }), renderComponent($$result, "Users", $$Users, { "size": 14 }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 12, "style": "display:inline;vertical-align:middle;" }), renderComponent($$result, "Flame", $$Flame, { "size": 12, "style": "display:inline;vertical-align:middle;" }), renderComponent($$result, "MessageCircle", $$MessageCircle, { "size": 12, "style": "display:inline;vertical-align:middle;" }), userName.charAt(0).toUpperCase(), userName.split(" ")[0], userName.charAt(0).toUpperCase(), userName, defineScriptVars({ userName, planType }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/community.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/community.astro";
const $$url = "/dashboard/community";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Community,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
