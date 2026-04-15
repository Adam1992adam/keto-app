# CLAUDE.md — Keto Journey App — Complete Project Reference
> Last updated: 2026-04-16 | Astro 4 + Supabase + Vercel | Payment: LemonSqueezy

---

## 0. IMPROVEMENT ROADMAP
> Working through these in order. Update status as each is completed.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Browser Push Notifications | ✅ Done | web-push + VAPID + SW + PushPermission component |
| 2 | Food Database (Open Food Facts API) | ✅ Done | Real-time search + barcode scanner (BarcodeDetector API) + fallback manual barcode input |
| 3 | Email Automation | ✅ Done | Resend SDK + 5 templates (welcome, weekly, milestone, streak warning, win-back) + 2 crons |
| 4 | Before/After Photo Comparison | ✅ Done | Draggable split-view slider on photos.astro + keyboard + touch support |
| 5 | Recipe Personalization | ✅ Done | "You might also like" similar recipes on recipe detail; recipe_favorites table; star rating REMOVED |
| 6 | Keto Calculator Tool | ✅ Done | TDEE + macro calculator at /dashboard/keto-calculator — Mifflin-St Jeor, macro rings, tips, water |
| 7 | Social Sharing Cards | ✅ Done | Canvas milestone cards at /dashboard/share — 4 templates, 4 themes, square/story format, download + Web Share API |
| 8 | Offline Mode (finish PWA) | ✅ Done | sw.js v3: Cache First/Network First/SWR strategies + IndexedDB offline queue + background sync + manifest + offline.html |
| 9 | Smart Upsell Triggers | ✅ Done | UpsellModal component: 4 triggers (journey_ending/streak/weight_win/milestone) + feature-locked nav buttons + localStorage cooldowns |
| 10 | Subscription Portal | ✅ Done | LemonSqueezy billing portal at /dashboard/billing + /api/lemonsqueezy/portal |
| 11 | Referral System | ✅ Done | referral_codes + referrals tables · /dashboard/referrals · 3 APIs · ?ref= capture on signup · 150 XP per referral |
| 12 | Multi-Language Support | ✅ Done | EN/FR/DE/ES/PT via getTranslator() + t() — all 26 dashboard pages wired |
| 13 | Food Photo Analyzer | ✅ Done | /dashboard/food-photo + /api/food/analyze-photo — Gemini 1.5 Flash, structured JSON output |
| 14 | Meal Swap Suggestions | ✅ Done | ⇄ button on food-log rows → macro-similar recipe suggestions → replace entry |
| 15 | Weight Projection Chart | ✅ Done | SVG projection on progress.astro: historical line + dashed goal trajectory + "at current pace" |
| 16 | Onboarding Improvements | ✅ Done | welcome.astro: weight goal timeline, milestone track, fasting protocol card, dietary restrictions |
| 17 | Mobile Recipe Photo Gallery | ✅ Done | Fullscreen lightbox on recipe/[id].astro; swipe-down + Esc to close |
| 18 | Proactive Insight Engine | ✅ Done | 14 pattern detectors → auto-generated coaching insights |
| 19 | Community Moderation | ✅ Done | Admin moderation tools for community posts |
| 20 | Daily Steps Tracker | ✅ Done | /dashboard/steps with chart and manual entry |

### Hardening Sprint (2026-04-15) — all ✅ Done
| # | Fix | Notes |
|---|-----|-------|
| H1 | Rate limiting | login (5/15min), forgot-password (3/15min), signup (5/10min), admin (5/15min) via `src/lib/rateLimit.ts` |
| H2 | Food log entry editing | PATCH /api/food-log/update — ownership check + upper-bound validation |
| H3 | Parallel DB queries | checkin.astro + profile.astro converted to Promise.allSettled |
| H4 | Fasting race condition | 60s idempotency window in /api/fasting/start.ts |
| H5 | Community ban on reactions | /api/community/posts/[id]/react.ts now checks community_banned |
| H6 | Numeric bounds | food-log/add.ts: calories≤9999, macros≤500g, meal_type allowlist; profile/update.ts: weight 20–500kg, height 50–300cm |
| H7 | Removed dead endpoint | /api/recipes/rate.ts deleted (star rating removed from UI) |
| H8 | Error UI | guide, keto-calculator, welcome, habits — try-catch + 503 fallback pages |
| H9 | Weight chart range selector | 30d/60d/90d toggle buttons, client-side JS redraw, DB fetch expanded to 90 entries |

### Security Hardening Sprint 2 (2026-04-16) — all ✅ Done
| # | Fix | Notes |
|---|-----|-------|
| S01 | Webhook replay attacks | `processed_webhooks` table; unique constraint on HMAC signature; 23505 → idempotent 200 |
| S02 | Admin timing attack | `crypto.timingSafeEqual()` with equal-length padded Uint8Array buffers |
| S03 | Food photo analyzer bounds | `clampCal`/`clampMacro` helpers; string fields capped; user context in error logs |
| S04 | Progress photo daily rate limit | 5 uploads/day cap alongside existing 50 lifetime cap (parallel count queries) |
| S05 | Habit future-day validation | Fetches `user_journey.current_day`; rejects `day_number > current_day` with 403 |
| S06 | meals/complete.ts silent fail | Already had `parsedDay > currentDay → 400` guard — confirmed working |
| S07 | Error log user context | All 13 API files updated: `let userId = 'unknown'` pattern; `console.error('[endpoint] user:', userId, err)` |
| S08 | AI Coach UTC boundary | Confirmed UTC-consistent; added comment in gemini.ts |
| S10 | HTML strip in community | posts.ts + comments.ts: `replace(/<[^>]*>/g, '')` before insert |

### Community Upgrade (2026-04-16) ✅ Done
- **3 post types**: `text`, `photo`, `progress` (results card)
- **Photo sharing**: FileReader → base64 → `/api/community/upload-photo` → Supabase Storage `community-photos` bucket
- **Progress cards**: Pre-filled with user's streak/day/level/weight-lost stats; rendered as gradient card in feed
- **Recipe templates**: "Recipes" category auto-fills post body with structured recipe template
- **New API**: `POST /api/community/upload-photo` — base64 decode, 2 MB cap, JPEG/PNG/WebP, 5/day rate limit
- **DB columns added**: `community_posts.post_type text`, `community_posts.image_url text`, `community_posts.result_data jsonb`
- **Storage bucket**: `community-photos` (public) with RLS — users upload to own folder, public read

### Push Notifications — Setup Notes (Step 1)
```
VAPID_PUBLIC_KEY  = BIxMNga4pWzvQDMQgv0ZjwGLiyR_g34K9l1MfTB23W3Xsjwj7FkRk0p1pgA0EL2Xo-azzanTApqMPEhz1Pjo-0I
VAPID_PRIVATE_KEY = IJSR7jvQLTa5BaX4kM7qLr0c7N8sG_KhNgnQfU_qSbg  ← keep private, in .env only
VAPID_EMAIL       = mailto:your@email.com
```
DB table required: `push_subscriptions` (see Section 20 below)
New files: `src/lib/push.ts`, `src/components/PushPermission.astro`
New APIs: `/api/notifications/push-subscribe`, `/api/notifications/push-unsubscribe`, `/api/notifications/push-send`

---

## 1. PROJECT OVERVIEW

**Keto Journey** — A 30/90/360-day structured keto diet coaching app.
Users buy a plan (Basic/Pro/Elite), onboard, then follow daily tasks, meals, check-ins, fasting, and progress tracking.

**Stack:** Astro 4 (SSR) · Supabase (Postgres + Auth) · Vercel (serverless) · TypeScript
**Payment:** LemonSqueezy (NOT Stripe) — webhook + checkout URLs + billing portal
**AI:** Gemini 1.5 Flash for AI Coach (chat) + Food Photo Analyzer

---

## 2. DIRECTORY STRUCTURE

```
src/
├── lib/
│   ├── supabase.ts              ← Supabase client + all helper functions + PLANS config
│   ├── auth.ts                  ← requireAuth() + requireLogin() + requireApiAuth() helpers
│   ├── rateLimit.ts             ← In-process sliding-window rate limiter (Map-based, Vercel-safe)
│   ├── push.ts                  ← sendPushToUser() + sendPushToAll()
│   └── smartMeals.ts            ← Smart Meal Intelligence Engine
├── components/
│   ├── DashNav.astro            ← Shared nav (all dashboard pages)
│   ├── NotificationsBell.astro  ← Standalone bell component
│   └── PushPermission.astro     ← Web Push permission request UI
├── pages/
│   ├── index.astro              ← Landing page
│   ├── login.astro / signup.astro
│   ├── dashboard/
│   │   ├── index.astro          ← Main dashboard ✅ WORKING
│   │   ├── checkin.astro        ← Daily check-in form ✅
│   │   ├── recipes.astro        ← Recipe browser ✅
│   │   ├── recipe/[id].astro    ← Recipe detail (ingredients fix: string+object format; lightbox) ✅
│   │   ├── recipes/[bookId].astro ← Recipe book detail ✅
│   │   ├── browse.astro         ← All recipes browser ✅
│   │   ├── favorites.astro      ← Saved favorite recipes ✅
│   │   ├── food-photo.astro     ← AI food photo analyzer ✅
│   │   ├── food-log.astro       ← Daily food log + meal swap + edit entry ✅
│   │   ├── progress.astro       ← Charts, weight logs, body measurements, projections ✅
│   │   ├── shopping.astro       ← Shopping list (dynamic per tier) ✅
│   │   ├── fasting.astro        ← Fasting timer ✅
│   │   ├── weekly.astro         ← Weekly report ✅
│   │   ├── profile.astro        ← User profile + achievements + language + avatar ✅
│   │   ├── ai-coach.astro       ← Elite only — Gemini chat ✅
│   │   ├── keto-calculator.astro← TDEE + macro calculator ✅
│   │   ├── habits.astro         ← Habit tracking ✅
│   │   ├── ketones.astro        ← Ketone tracker + chart ✅
│   │   ├── steps.astro          ← Daily steps tracker ✅
│   │   ├── share.astro          ← Canvas milestone sharing cards ✅
│   │   ├── photos.astro         ← Before/after split-view slider ✅
│   │   ├── community.astro      ← Community feed + moderation ✅
│   │   ├── reflections.astro    ← Daily mood/note reflections ✅
│   │   ├── meal-prep.astro      ← Meal prep guide ✅
│   │   ├── scanner.astro        ← Barcode scanner ✅
│   │   ├── referrals.astro      ← Referral system ✅
│   │   ├── export.astro         ← Data export ✅
│   │   ├── guide.astro          ← Keto guide ✅
│   │   ├── learn.astro          ← Educational content ✅
│   │   ├── billing.astro        ← LemonSqueezy billing portal ✅
│   │   ├── notifications.astro  ← Notifications list ✅
│   │   ├── notification-preferences.astro ← Push + email preferences ✅
│   │   ├── onboarding.astro     ← First-time setup ✅
│   │   ├── welcome.astro        ← Post-onboarding welcome + goal timeline ✅
│   │   ├── upgrade.astro        ← Plan upgrade (requireLogin — no subscription check) ✅
│   │   └── expired.astro        ← Expired subscription (requireLogin + buildCheckoutUrl) ✅
│   └── api/
│       ├── auth/                ← signup, login, logout, refresh, change-email/password, delete-account
│       ├── checkin/save.ts      ← POST /api/checkin/save ✅ XP via award_xp RPC
│       ├── tasks/complete.ts    ← POST /api/tasks/complete ✅ complete_task RPC + fallback chain
│       ├── notifications/       ← index, generate, save, push-subscribe/unsubscribe/send, preferences
│       ├── fasting/             ← start.ts (idempotent), end.ts (XP via award_xp RPC)
│       ├── meals/               ← today.ts, swap.ts, complete.ts
│       ├── food/                ← analyze-photo.ts (Gemini), suggest-swaps.ts
│       ├── food-log/            ← add.ts, update.ts (PATCH), delete.ts, entries.ts
│       ├── measurements/save.ts ← POST /api/measurements/save ✅
│       ├── profile/             ← update.ts, add-weight.ts, update-avatar.ts, update-language.ts, update-units.ts
│       ├── weekly/save.ts       ← XP via award_xp RPC
│       ├── recipes/             ← favorite.ts  (rate.ts DELETED — star rating removed)
│       ├── community/           ← posts.ts + [id]/comments.ts + [id]/react.ts + moderation
│       ├── lemonsqueezy/        ← webhook.ts, portal.ts, verify-purchase.ts
│       ├── referrals/           ← 3 endpoints
│       ├── admin/               ← verify, activate-pending, delete-pending, update-user
│       ├── cron/                ← daily-push.ts, weekly-email.ts
│       └── chat/gemini.ts       ← POST /api/chat/gemini ✅ correct table/field names
```

---

## 3. SUPABASE DATABASE TABLES

| Table | Purpose |
|-------|---------|
| `profiles` | User profile, subscription, XP (⚠️ has `xp_total` but dashboard reads `user_journey`) |
| `user_journey` | **PRIMARY XP source**: `total_xp`, `level`, `streak_days`, `current_day`, `status`, `start_date` |
| `daily_tasks` | `id, user_id, day_number, task_type, task_title, completed, completed_at, xp_earned` |
| `daily_checkins` | `user_id, checkin_date, energy_level, mood_level, hunger_level, brain_fog, had_headache, had_fatigue, had_cravings, followed_meals, water_glasses, fasted_today, note, xp_earned` |
| `daily_progress` | Daily progress summary |
| `daily_reflections` | Mood/notes per day |
| `fasting_sessions` | `started_at, ended_at, target_hours, protocol`. Active = `ended_at IS NULL` |
| `meal_plans` | `plan_type, day_number, meal_type, recipe_id` — joined with recipes |
| `meal_swaps` | `user_id, original_recipe_id, swap_recipe_id, reason, swap_date` |
| `recipes` | `id, title, description, calories, protein, fat, carbs, fiber, net_carbs, image_url, prep_time, cook_time, servings, difficulty, ingredients(jsonb), instructions(jsonb), tips(jsonb), tags[], book_id` |
| `recipe_favorites` | `user_id, recipe_id` — user-saved favorites |
| `weight_logs` | `user_id, weight, logged_date` ← fields are `weight` + `logged_date` (NOT `weight_kg`/`date`) |
| `weekly_reports` | `user_id, week_number` |
| `notifications` | `user_id, type, title, body, icon, action_url, action_label, priority, is_read, is_dismissed, expires_at` |
| `notification_preferences` | Per-user notification settings |
| `push_subscriptions` | Web Push endpoint, p256dh, auth_key, user_agent |
| `onboarding_data` | `user_id, current_weight, target_weight, dietary_restrictions[], fasting_protocol, goal, feature_electrolytes` |
| `xp_transactions` | `user_id, action_type, xp_amount, description, day_number` ← fields are `action_type` + `xp_amount` |
| `achievements` | Earned achievements per user |
| `macro_goals` | `user_id, daily_calories, protein_g, fat_g, carbs_g` |
| `water_intake` | `user_id, day_number, date, glasses_count, target_glasses` |
| `body_measurements` | `user_id, logged_date, neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm, notes` |
| `completed_days` | Days marked as fully complete |
| `chat_messages` | AI Coach chat history |
| `pending_activations` | LemonSqueezy payment activation queue |
| `referral_codes` | `user_id, code, uses_count` |
| `referrals` | `referrer_id, referred_id, code, created_at` |
| `habits` | User habit tracking |
| `ketone_logs` | Ketone measurements |
| `steps_logs` | Daily step counts |

### recipes.ingredients format — MIXED (handle both)
```typescript
// Some recipes store as objects:  { item: "almond flour", amount: "120", unit: "g", category: "..." }
// Some recipes store as strings:  "180g almond flour"
// ALWAYS normalize in frontmatter before rendering:
const ingredients = rawIngredients.map((ing: any) =>
  typeof ing === 'string'
    ? { amount: '', unit: '', item: ing, isString: true }
    : { amount: ing.amount || '', unit: ing.unit || '', item: ing.item || '', isString: false }
);
```

---

## 4. CRITICAL DATA FLOW

### XP System — always use `user_journey`, never `profiles.xp_total`

```
user_journey.total_xp  ← Dashboard READS from here ✅
user_journey.level     ← Dashboard READS from here ✅
user_journey.streak_days ← Dashboard READS from here ✅

profiles.xp_total      ← STALE — do NOT write here, do NOT read here
xp_transactions        ← Log only (action_type, xp_amount fields)
```

**Rule**: All XP updates go through `supabase.rpc('award_xp', {...})`.
Applied in: `checkin/save.ts`, `fasting/end.ts`, `weekly/save.ts`, `tasks/complete.ts`.

### Task Completion Flow ✅ FIXED

```
User clicks task in dashboard
  → fetch('/api/tasks/complete', { taskId, completed })
  → tries supabase.rpc('complete_task', { user_id_param, day_number_param, task_type_param })
  → if RPC fails: direct update + supabase.rpc('award_xp', {...})
  → if award_xp fails: direct update to user_journey.total_xp
  → UI updates optimistically
```

### Current Day Advancement ✅ FIXED

```
Dashboard load
  → await updateCurrentDay(user.id)   ← MUST be called before getUserJourney()
  → await getUserJourney(user.id)
  → currentDay = journey.current_day
```

**Without `updateCurrentDay()`, currentDay stays at 1 forever.**

### Meal Plans — fallback pattern ✅ FIXED

```typescript
const mealDayTarget = ((currentDay - 1) % 30) + 1;  // cycle within 30-day DB data
// Try user's tier first, fall back to basic_30:
const rawMealsDirect = await supabase.from('meal_plans')...eq('plan_type', planType)...
const rawMeals = rawMealsDirect?.length > 0
  ? rawMealsDirect
  : await supabase.from('meal_plans')...eq('plan_type', 'basic_30')...
```

**Why**: DB may only have `basic_30` meal plan data. Pro/Elite users get `basic_30` meals as fallback.
**Cycling**: Day 31 shows day 1 meals, day 32 shows day 2, etc. (30-day rotation).

### Check-in Flow

```
User fills checkin.astro form
  → POST /api/checkin/save
  → upsert into daily_checkins
  → supabase.rpc('award_xp') updates user_journey ✅
  → Returns { success, xp_earned }
```

### Streak System

```
streak_days lives in user_journey
Updated by: supabase.rpc('update_current_day', { user_id_param })
Called on: every dashboard page load via updateCurrentDay(user.id)
```

---

## 5. SUPABASE RPC FUNCTIONS (exist in DB)

| RPC | Purpose |
|-----|---------|
| `complete_task(user_id_param, day_number_param, task_type_param)` | Mark task done + award XP |
| `award_xp(user_id_param, action_type_param, xp_amount_param, description_param, day_number_param)` | Award XP to user_journey |
| `initialize_daily_tasks(user_id_param, day_number_param)` | Create tasks for a new day |
| `update_current_day(user_id_param)` | Advance journey day + update streak based on start_date |

---

## 6. AUTH PATTERN

### Shared helper — use for ALL subscription-gated pages
```typescript
import { requireAuth } from '../../lib/auth';
const auth = await requireAuth(Astro);
if ('redirect' in auth) return Astro.redirect(auth.redirect);
const { user, profile, db } = auth;
```

### requireLogin — use for upgrade.astro and expired.astro ONLY
```typescript
// Skips subscription check — allows expired users to access
import { requireLogin } from '../../lib/auth';
const auth = await requireLogin(Astro);
if ('redirect' in auth) return Astro.redirect(auth.redirect);
const { user, profile, db } = auth;
```

### requireApiAuth — use in ALL API routes
```typescript
import { requireApiAuth } from '../../../lib/auth';
const auth = await requireApiAuth(cookies);
if (!auth.ok) return auth.response;
const { user, db } = auth;
```

---

## 7. SUBSCRIPTION TIERS

| Tier | ID | Days | Features |
|------|----|------|---------|
| Basic | `basic_30` | 30 | 30 recipes, basic tracking |
| Pro | `pro_6` | 90 | 87+ recipes, analytics |
| Elite | `elite_12` | 360 | All + AI Coach |

Check: `isSubscriptionActive(profile)` from `supabase.ts`
Tier: `profile.subscription_tier` → `'basic_30' | 'pro_6' | 'elite_12'`
Max days: `getMaxJourneyDays(planType)` → 30 / 180 / 365

---

## 8. ASTRO/ESBUILD RULES — CRITICAL

These cause compile errors if violated:

### ❌ NEVER in frontmatter (between `---`)
```typescript
let x = 5;                          // Use const instead
const map: Record<string,string>    // Remove TS type annotations
(item: string) =>                   // Remove param type annotations
```

### ❌ NEVER in JSX template
```astro
// Nested ternary with < NUMBER — causes Fragment error
{currentDay <= 14 ? <span>...</span> : <span>...</span>}
//             ^^^^ Astro reads < 14 as JSX tag opening!

// const inside .map() callbacks at 6+ indent
{items.map((t) => {
      const x = ...  // ← ERROR if 6+ spaces indent
})}
```

### ✅ CORRECT patterns
```astro
---
// Pre-compute in frontmatter to avoid JSX ternary issues
const weekPhase = currentDay <= 7 ? 'adapt' : currentDay <= 14 ? 'burn' : 'thrive';
const progressMsg = pct === 0 ? 'Start!' : pct < 50 ? 'Keep going!' : 'Almost there!';
---

// In JSX — use && instead of ternary with JSX elements
{weekPhase === 'adapt' && <span class="badge">Week 1</span>}
{weekPhase === 'burn'  && <span class="badge">Week 2</span>}
{weekPhase === 'thrive'&& <span class="badge">Week 3+</span>}
```

### ✅ Script rules
```astro
<!-- Use var instead of let/const in is:inline scripts when passing define:vars -->
<script is:inline define:vars={{ myVar }}>
var x = myVar;  // OK
</script>
```

---

## 9. NOTIFICATIONS SYSTEM ✅

### Table: `notifications`
```sql
id uuid, user_id uuid, type text, title text, body text,
icon text, action_url text, action_label text,
priority text (low|normal|urgent),
is_read bool, is_dismissed bool,
expires_at timestamptz, created_at timestamptz
```

### How it works
1. User opens Bell → JS calls `POST /api/notifications/generate`
2. Generate API deletes stale daily notifications (unread+undismissed)
3. `done` set only blocks milestone/one-time types (not daily dynamic ones)
4. Generates new notifications based on current user state
5. JS calls `GET /api/notifications?limit=25` → renders list

### "All caught up" fix (generate.ts)
- **MILESTONE_TYPES** (blocked once generated): `welcome`, `day1_start`, `weight_progress`, `milestone_*`, `streak_*`, `level_up_*`
- **DAILY_TYPES** (deleted before regenerating): `checkin_reminder`, `streak_warning`, `incomplete_tasks`, `weight_reminder`, `fasting_active`, `low_water`, `weekly_review`, `energy_trend`

---

## 10. MEAL SWAP SYSTEM ✅

### `/api/meals/swap.ts` — correct field names
```typescript
// Recipe fields: protein, fat, net_carbs, tags  (NOT protein_g/fat_g/carbs_g/category)
// Dietary filtering via tags array + title keyword matching (NOT boolean columns)
// Category derived from tags: tags.find(t => mealCategories.includes(t))
// Macro scoring: Math.abs(candidate.protein - original.protein)
// Records in meal_swaps: { user_id, original_recipe_id, swap_recipe_id, reason, swap_date }
```

### Food-log Swap Suggestions (`/api/food/suggest-swaps.ts`) ✅
```typescript
// GET /api/food/suggest-swaps?calories=X&protein_g=Y&fat_g=Z&carbs_g=W
// Macro similarity: dCal*2 + dProt*1 + dFat*1 + dCarb*1.5 (lower = better match)
// Calorie range: 0.4x – 2.5x target
// Returns top 5 recipe suggestions
// food-log.astro: ⇄ button per row → modal → "Use" button replaces entry
```

### Food Log Entry Editing ✅ NEW
```typescript
// PATCH /api/food-log/update — edit existing entry
// Validates: id required, food_name required, cal≤9999, macros≤500g, meal_type allowlist
// Ownership enforced: .eq('id', id).eq('user_id', user.id)
// UI: ✏ button per row → reuses Add modal in edit-mode → Save Changes button
```

---

## 11. BODY MEASUREMENTS ✅

### `/api/measurements/save.ts`
- POST endpoint, auth required
- Fields: `neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm, notes, logged_date`
- Upsert on `user_id, logged_date`
- Numeric fields parsed with `parseFloat()`

### `progress.astro` — measurements card
- Shows latest 2 measurements with comparison delta
- Modal with 6-field grid + date picker
- Submits to `POST /api/measurements/save` → page reload

---

## 12. WEIGHT LOGS PATTERN ✅

```typescript
// Fields are: weight (NOT weight_kg) and logged_date (NOT date)
const { data: weightLogs } = await supabase
  .from('weight_logs')
  .select('weight, logged_date')
  .eq('user_id', userId)
  .gte('logged_date', ninetyDaysAgo)   // progress.astro fetches 90 days for range selector
  .order('logged_date', { ascending: true })
  .limit(90);

const latestWeight = weightLogs?.[weightLogs.length - 1]?.weight || startWeight;
// Start weight from onboarding_data.current_weight (NOT profiles.weight_kg)
const startWeight = onboarding?.current_weight || profile.weight_kg || 0;

// Upsert pattern:
await supabase.from('weight_logs').upsert(
  { user_id, weight, logged_date },
  { onConflict: 'user_id,logged_date' }  // NOT 'user_id,date'
);
```

### Weight Chart Range Selector ✅ NEW (progress.astro)
- DB fetches last 90 days (limit 90, gte ninetyDaysAgo)
- Three toggle buttons: `30d / 60d / 90d` — rendered above the SVG chart
- Client-side JS (`define:vars={{ wRaw, wUnit, wImperial }}`) redraws SVG on click
- Same bezier path algorithm as SSR — smooth curves, tooltips, axis ticks
- Default: 30d (or 90d if fewer than 5 entries)

---

## 13. FASTING SESSIONS PATTERN

```typescript
// Active fast = ended_at IS NULL
const { data: activeFast } = await supabase
  .from('fasting_sessions')
  .select('*')
  .eq('user_id', userId)
  .is('ended_at', null)           // ← CORRECT (not .eq('is_active', true))
  .order('started_at', { ascending: false })
  .limit(1)
  .maybeSingle();
```

### Fasting Start Idempotency ✅ FIXED
```typescript
// /api/fasting/start.ts — prevents duplicate sessions on double-click
// If active session was started within last 60s → return it (idempotent)
// If active session is older than 60s → close it, then insert new one (intentional restart)
// end.ts already had idempotency: if ended_at !== null → return previously awarded XP
```

---

## 14. AI COACH (gemini.ts) ✅

- Table name: `user_journey` (NOT `user_journeys` — no 's')
- Weight fields: `weight` + `logged_date` (NOT `weight_kg`/`date`)
- Use `.maybeSingle()` on weight query (not `.single()` — crashes if no logs)
- System prompt uses `recentWeight?.weight` (not `.weight_kg`)
- Chat history limited to last 14 messages (context window management)
- Rate limit: 20 messages per day per user

---

## 15. LEMONSQUEEZY PAYMENT SYSTEM ✅

### Env vars required
```
LEMONSQUEEZY_WEBHOOK_SECRET=...    ← HMAC signing secret
LEMONSQUEEZY_API_KEY=...           ← LS API key (for portal lookup)
LEMONSQUEEZY_STORE_ID=335391
LEMONSQUEEZY_BASIC_URL=https://keto-12.lemonsqueezy.com/buy/...
LEMONSQUEEZY_PRO_URL=https://keto-12.lemonsqueezy.com/buy/...
LEMONSQUEEZY_ELITE_URL=https://keto-12.lemonsqueezy.com/buy/...
PUBLIC_APP_URL=https://ketojourney.fun
```

### Checkout URL builder (upgrade.astro + expired.astro)
```javascript
function buildCheckoutUrl(baseUrl) {
  var url = new URL(baseUrl);
  url.searchParams.set('checkout[email]', userEmail);
  url.searchParams.set('checkout[name]',  userFullName);
  if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
  url.searchParams.set('checkout[redirect_url]', appUrl + '/dashboard/billing');
  return url.toString();
}
```
**Critical**: `checkout[custom][user_id]` MUST be set for existing users. Without it, webhook uses Path C (creates pending_activation requiring re-registration) instead of Path A (direct profile update).

### Webhook paths
```
Path A: custom_data.user_id present → direct profile update by user ID ✅
Path B: no user_id, but email matches existing profile → update by email ✅
Path C: neither → pending_activations row for verify-purchase flow ✅
```

### Webhook events handled
`order_created`, `order_refunded`, `subscription_created`, `subscription_updated`,
`subscription_cancelled`, `subscription_expired`, `subscription_payment_success`,
`subscription_payment_failed`, `subscription_payment_recovered`, `subscription_resumed`

---

## 16. DESIGN SYSTEM

### CSS Variables
```css
--bg: #060d09          /* dark background */
--card: #0d1a0f        /* card background */
--card2: #111f13       /* nested card */
--border: rgba(16,185,129,.1)
--border2: rgba(16,185,129,.22)
--text: #dfeedd
--soft: #4d7055        /* secondary text */
--muted: #233328       /* disabled/empty */
--green: #10b981       /* primary accent */
--green2: #34d399      /* lighter green */
--gold: #f59e0b        /* XP/streak */
--purple: #8b5cf6      /* level/XP bar */
--blue: #3b82f6        /* days counter */
--red: #ef4444         /* danger/urgent */
```

### Fonts
- Headers: `Fraunces` (serif, italic for emphasis)
- Body: `DM Sans` (sans-serif)

### Key Design Patterns
- Cards: `border-radius: 20px`, `border: 1px solid var(--border)`
- Hover: `translateY(-3px)` + `border-color: var(--border2)` + `box-shadow`
- Animations: `fadeUp` on page load (staggered with `animation-delay`)
- Rings: SVG circles with `stroke-dashoffset` for progress
- Mobile: bottom nav at `max-width: 900px`; body padding-bottom 5.5rem on mobile

---

## 17. API RESPONSE PATTERNS

### Success
```json
{ "success": true, "data": {...} }
```

### Error
```json
{ "error": "Message here" }
```

### All API files end with:
```typescript
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### Rate Limiting Pattern (src/lib/rateLimit.ts)
```typescript
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
const ip = getClientIp(request);
const { allowed, retryAfterSec } = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
if (!allowed) return json({ error: `Too many requests. Try again in ${retryAfterSec}s.` }, 429);
```
- Applied to: login (5/15min), forgot-password (3/15min), signup (5/10min), admin verify (5/15min)
- In-process Map — survives within a warm Vercel instance; Supabase auth throttles as second layer

---

## 18. SHOPPING LIST PATTERN ✅

```typescript
import { getMaxJourneyDays } from '../../lib/supabase';
const maxDays  = getMaxJourneyDays(planType);   // 30/180/365
const maxWeeks = Math.ceil(maxDays / 7);         // not hardcoded 4

// Week tabs: dynamic based on tier
Array.from({ length: maxWeeks }, (_, i) => i + 1)

// DB query uses dynamic planType (not hardcoded 'basic_30'):
.eq('plan_type', planType)
.eq('day_number', dayNumber)  // where dayNumber is in range [startDay, endDay]
```

---

## 19. WHAT WORKS (verified 2026-04-15)

### ✅ Fully Working
- Auth flow (login/signup/cookies) via `requireAuth()` / `requireLogin()` / `requireApiAuth()`
- Rate limiting on login, forgot-password, signup, admin endpoints
- Dashboard: current day advances correctly on load
- Dashboard: meals load with plan-specific data + `basic_30` fallback
- Task completion with XP (RPC with fallback chain)
- Check-in form + save with XP; duplicate warning shown if already submitted
- Recipes browser + detail — ingredients display both string and object formats
- Recipe detail: fullscreen lightbox on hero image (swipe-down + Esc to close)
- Recipe favorites (heart button, /dashboard/favorites)
- Star rating REMOVED from recipe detail; /api/recipes/rate.ts DELETED
- Progress charts + weight log modal + projection SVG
- Weight chart: 30d/60d/90d range selector (client-side JS redraw)
- Body measurements tracking
- Shopping list (dynamic weeks per tier)
- Fasting timer (start/end with correct XP; idempotent start — 60s dedup)
- Notifications panel (daily types refresh; push notifications)
- Community feed + moderation; ban enforced on posts + comments + reactions
- Community photo sharing (upload-photo API → Supabase Storage → feed display + lightbox)
- Community progress cards (pre-filled stats, gradient rendering in feed)
- Community recipe templates (auto-fill on category select)
- LemonSqueezy webhook replay protection (processed_webhooks unique constraint)
- Admin constant-time password comparison (crypto.timingSafeEqual)
- Progress photo daily rate limit (5/day)
- Habit future-day protection (day_number ≤ current_day enforced)
- AI Coach (Gemini 1.5 Flash — Elite only)
- Weekly report with correct XP
- Profile: achievements, language selector (EN/FR/DE/ES/PT), avatar picker
- Ketone tracker + chart
- Daily steps tracker
- Food Photo Analyzer (Gemini)
- Food log: add + edit (PATCH) + delete + meal swap suggestions
- LemonSqueezy: all 10 webhook events, billing portal, verify-purchase
- Expired subscription: direct re-upgrade with user_id preserved
- Multi-language support (EN/FR/DE/ES/PT) via getTranslator() + t()
- Push notifications via VAPID
- Referral system (150 XP per referral)
- Error UI: guide, keto-calculator, welcome, habits all have try-catch + 503 fallback

### ⚠️ Known Gaps — Next Priorities
- ~~**Webhook replay attacks**~~ ✅ Fixed — `processed_webhooks` table deduplicates by HMAC signature (unique constraint).
- ~~**Admin timing attack**~~ ✅ Fixed — `crypto.timingSafeEqual()` with equal-length padded `Uint8Array` buffers.
- ~~**Food photo analyzer numeric validation**~~ ✅ Fixed — `clampCal`/`clampMacro` helpers cap all values before storage.
- ~~**Photo upload rate limit**~~ ✅ Fixed — 5 uploads/day cap added to `/api/photos/upload.ts`.
- ~~**Habit completion future days**~~ ✅ Fixed — rejects `day_number > current_day` with 403 in `/api/habits/toggle.ts`.
- **Community posts N+1**: posts.ts fetches posts then makes separate queries for profiles and reactions. Already batched with Promise.all, but could be a single JOIN query.
- **ai-coach.astro**: needs @media queries for narrow (<400px) viewports.

---

## 20. PUSH NOTIFICATIONS SYSTEM

### DB Table
```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint   text NOT NULL,
  p256dh     text NOT NULL,
  auth_key   text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_used  timestamptz DEFAULT now(),
  UNIQUE(endpoint)
);
CREATE INDEX IF NOT EXISTS push_subs_user_idx ON push_subscriptions(user_id);
```

### Env vars needed (.env + Vercel dashboard)
```
VAPID_PUBLIC_KEY=BIxMNga4pWzvQDMQgv0ZjwGLiyR_g34K9l1MfTB23W3Xsjwj7FkRk0p1pgA0EL2Xo-azzanTApqMPEhz1Pjo-0I
VAPID_PRIVATE_KEY=IJSR7jvQLTa5BaX4kM7qLr0c7N8sG_KhNgnQfU_qSbg
VAPID_EMAIL=mailto:your@email.com
```

### Architecture
- `src/lib/push.ts` — `sendPushToUser(userId, payload)` + `sendPushToAll(payload)`
- `src/components/PushPermission.astro` — permission request UI (shows in notification-preferences)
- `POST /api/notifications/push-subscribe` — saves Web Push subscription to DB
- `POST /api/notifications/push-unsubscribe` — removes subscription
- `POST /api/notifications/push-send` — internal: send push to a user (called by cron/generate)
- `src/pages/api/cron/daily-push.ts` — daily cron: sends morning reminder + streak warning
- `generate.ts` — sends push for urgent notifications (streak_warning, incomplete_tasks)

### getMealCycleDays()
- basic_30 → cycles 30 days
- pro_6    → cycles 90 days (DB has days 1–90)
- elite_12 → cycles 90 days (DB has days 1–90)

---

## 21. MULTI-LANGUAGE (i18n) ✅

```typescript
import { getTranslator } from '../../lib/i18n';
const lang = normaliseLang(Astro.cookies.get('keto-lang')?.value);
const t = getTranslator(lang);
// Usage: t('key') — fallback to 'en' if key missing
```
- Supported: `en`, `fr`, `de`, `es`, `pt`
- 120+ keys across all dashboard pages
- Language set in profile via /dashboard/profile → Settings tab → Language Selector
- Cookie: `keto-lang` (set by /api/profile/update-language.ts)

---

## 22. RECIPE PHOTO GALLERY (Mobile) ✅ DONE

### Current state
- `recipe/[id].astro` — hero image (420px height) is tappable
- Click/tap hero → fullscreen lightbox overlay
- Swipe down OR Esc key → close
- `touch-action: pan-y` prevents conflicts with page scroll

---

## 23. NUTRITIONAL VALUES DISPLAY

### Where macros are shown
| Page | Data source | Fields displayed |
|------|-------------|-----------------|
| dashboard/index.astro | macro_goals + food_logs | calories, protein_g, fat_g, carbs_g (ring chart) |
| food-log.astro | food_logs | calories, protein_g, fat_g, carbs_g per entry + daily totals + edit button |
| recipe/[id].astro | recipes | calories, protein, fat, net_carbs, fiber (full nutrition table) |
| recipes.astro / browse.astro | recipes | calories, net_carbs, protein, fat (4-col grid) |
| shopping.astro | meal_plans + recipes | per-meal macro breakdown |
| keto-calculator.astro | macro_goals | TDEE, protein_g, fat_g, carbs_g (macro rings + recommendations) |
| progress.astro | weight_logs + body_measurements | weight trend (30/60/90d), body metrics |

### Field name consistency
```
recipes table:   protein, fat, net_carbs, carbs, fiber  (NO _g suffix)
food_logs table: protein_g, fat_g, carbs_g, calories    (WITH _g suffix)
macro_goals:     protein_g, fat_g, carbs_g, daily_calories (WITH _g suffix)
```
Never mix suffixes. Always check which table you're querying.

---

## 24. SECURITY AUDIT — FINDINGS LOG (2026-04-15)

Full audit conducted 2026-04-15. Items marked ✅ are fixed; items marked ⚠️ are known and tracked.

### Fixed in Hardening Sprint
| ID | Issue | Fix |
|----|-------|-----|
| H1 | No rate limiting on auth endpoints | Added `src/lib/rateLimit.ts` — login/forgot/signup/admin all protected |
| H2 | Food log add had no upper bounds or meal_type validation | Capped cal≤9999, macros≤500g, allowlist for meal_type |
| H3 | Profile update accepted any weight/height value | weight 20–500kg, height 50–300cm range check; full_name truncated to 100 chars |
| H4 | Fasting start created duplicate sessions on double-click | 60s idempotency window — returns existing session if started within 60s |
| H5 | Banned community users could still react to posts | community_banned check added to react.ts |
| H6 | /api/recipes/rate.ts was a live endpoint writing to orphaned table | Endpoint deleted |

### Open — Medium/Low Priority
| ID | Severity | File | Issue | Recommended Fix |
|----|----------|------|-------|-----------------|
| S01 | ✅ FIXED | `api/lemonsqueezy/webhook.ts` | HMAC verified but no timestamp check — replay attacks possible | `processed_webhooks` table (UNIQUE on signature) — duplicate insert rejected with 23505 |
| S02 | ✅ FIXED | `api/admin/verify.ts` | Password compared with `===` (timing attack) | `crypto.timingSafeEqual()` with equal-length padded buffers |
| S03 | ✅ FIXED | `api/food/analyze-photo.ts` | AI-returned numeric values stored without bounds checking | `clampCal` (≤9999) + `clampMacro` (≤500g) applied to all numeric fields; strings sliced |
| S04 | ✅ FIXED | `api/photos/upload.ts` | 50-photo cap but no daily rate limit | DB daily count query (≥5 today → 429); runs in parallel with lifetime cap check |
| S05 | ✅ FIXED | `api/habits/toggle.ts` | Accepts arbitrary day_number from client | Fetches `user_journey.current_day`; rejects day_number > current_day with 403 |
| S06 | ✅ FIXED | `api/meals/complete.ts` | Fails silently instead of returning 400 when day > current | Already has `parsedDay > currentDay → 403` guard in code |
| S07 | ✅ FIXED | Multiple | Error logs lack user context (`console.error('error:', err)`) | `[file/name] user: <id>` prefix on all user-facing mutation endpoints (13 files) |
| S08 | ✅ VERIFIED | `api/chat/gemini.ts` | Daily rate limit window computed as `today + 'T00:00:00Z'` — correct UTC boundary, but verify timezone | Confirmed UTC-consistent: `toISOString()` + `T00:00:00Z` + Supabase `now()` all UTC. Comment added. |
| S09 | LOW | Multiple API files | `json()` helper duplicated in every file | Centralize in `src/lib/apiResponse.ts` |
| S10 | ✅ FIXED | `api/community/posts.ts` + `comments.ts` | Content stored as plain text — client must escape on render | `replace(/<[^>]*>/g, '')` strips all HTML tags before DB insert in both posts and comments |

### Security Strengths (Do Not Break)
- All API routes use `requireApiAuth(cookies)` — no unprotected mutations
- All user-scoped DB queries include `.eq('user_id', user.id)` — no IDOR vulnerabilities found
- LemonSqueezy webhooks verified with HMAC-SHA256 before processing
- Passwords handled entirely by Supabase Auth — never stored or logged by app
- `email_confirm: true` set for paid signups (admin createUser) — no email loop for paying customers
- RLS enforced at DB level as second layer of ownership control
- Webhook Path A/B/C handles all user_id/email/neither cases gracefully

---

## 25. PARALLEL QUERY PATTERN

Pages with multiple DB queries should use `Promise.allSettled()` so one failing query doesn't crash the whole page. Pattern used throughout:

```typescript
// Critical query first (if others depend on its result)
const journey = await getUserJourney(user.id, db).catch(() => null);
const currentDay = journey?.current_day || 1;

// All remaining queries in parallel
const [aRes, bRes, cRes] = await Promise.allSettled([
  db.from('table_a').select('*').eq('user_id', user.id),
  db.from('table_b').select('*').eq('user_id', user.id),
  db.from('table_c').select('*').eq('user_id', user.id),
]);
const a = aRes.status === 'fulfilled' ? aRes.value?.data : null;
const b = bRes.status === 'fulfilled' ? bRes.value?.data : null;
const c = cRes.status === 'fulfilled' ? cRes.value?.data : null;
```

### Pages with batch queries
| Page | Pattern | Notes |
|------|---------|-------|
| `dashboard/index.astro` | Batch 1 (critical) + Batch 2 (14 queries) | 503 on batch 1 failure |
| `dashboard/progress.astro` | journey first, then 12 parallel | 503 on journey failure |
| `dashboard/checkin.astro` | All 5 in one allSettled | No critical dependency |
| `dashboard/profile.astro` | journey first, then 7 parallel | journey needed for currentDay |
| `dashboard/guide.astro` | All 5 in one allSettled | No critical dependency |
| `dashboard/habits.astro` | 2 queries in allSettled | Empty state on failure |
| `dashboard/keto-calculator.astro` | 1 query with try-catch | Falls back to profile defaults |
| `dashboard/welcome.astro` | 1 critical query with try-catch | 503 on failure |
| `dashboard/community.astro` | journey + weight + onboarding in allSettled | Computes `myProgressData` for progress card pre-fill |

---

## 26. COMMUNITY FEATURE (2026-04-16) ✅

### Post Types
| post_type | Description | Required fields |
|-----------|-------------|-----------------|
| `text` | Plain text post (default) | `content` (3–2000 chars) |
| `photo` | Image post with optional caption | `image_url` (from upload-photo API) + optional `content` (≤500 chars) |
| `progress` | Results card with optional caption | `result_data` (JSON object) + optional `content` (≤500 chars) |

### DB Schema Additions (community_posts)
```sql
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS post_type  text    DEFAULT 'text';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS image_url  text;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS result_data jsonb;
```

### Storage Bucket: community-photos
```sql
-- Bucket: community-photos (public)
-- RLS policies:
-- 1. INSERT: auth.uid()::text = (storage.foldername(name))[1]  (own folder only)
-- 2. SELECT: true  (public read)
-- 3. DELETE: auth.uid()::text = (storage.foldername(name))[1]  (own files only)
```

### Upload Flow
```
User selects image (file input)
  → FileReader.readAsDataURL() → base64
  → POST /api/community/upload-photo { imageBase64, imageType }
  → Server: decode → check 2MB → check 5/day rate limit → upload to community-photos/{userId}/{ts}-{rand}.{ext}
  → Returns { url: string }  (stable public URL)
  → Stored in image_url column when post is created
```

### result_data Shape (progress post)
```typescript
interface ResultData {
  day:         number;   // current journey day
  streak:      number;   // streak_days
  level:       number;
  xp:          number;   // total_xp
  weightLost:  number;   // start - current (or 0)
  unit:        string;   // 'kg' or 'lbs'
}
```

### Feed Rendering
- `post_type === 'text'` — paragraphs split on `\n\n+`
- `post_type === 'photo'` — full-width `<img>` with `data-lightbox` attribute; caption below
- `post_type === 'progress'` — gradient card showing day/streak/level/xp/weight stats; caption below
- Lightbox: `#lightboxOverlay` + event delegation on `[data-lightbox]` → `open` class toggle; Esc closes

### API: POST /api/community/upload-photo
- Body: `{ imageBase64: string, imageType: 'image/jpeg'|'image/png'|'image/webp' }`
- Validates: type whitelist, 2 MB decoded size, 5 photo posts per UTC day
- Uploads to `community-photos/{user_id}/{timestamp}-{random}.{ext}`
- Returns: `{ url: string }` — stable public URL from `getPublicUrl()`
- On storage error: logs `[community/upload-photo] user: <id>` + error

### Access Control
- Community is available to Pro (`pro_6`) and Elite (`elite_12`) tiers only
- Basic tier users see an upgrade prompt instead of the feed
- community_banned users: 403 on posts, comments, reactions (checked server-side)
