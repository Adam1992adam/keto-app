# CLAUDE.md — Keto Journey App — Complete Project Reference
> Last updated: 2026-04-01 | Astro 4 + Supabase + Vercel

---

## 0. IMPROVEMENT ROADMAP
> Working through these in order. Update status as each is completed.
> ⏸ = blocked on Stripe setup (user will notify when ready)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Browser Push Notifications | ✅ Done | web-push + VAPID + SW + PushPermission component |
| 2 | Food Database (Open Food Facts API) | ✅ Done | Real-time search + barcode scanner (BarcodeDetector API) + fallback manual barcode input |
| 3 | Email Automation | ⬜ Todo | Needs Resend API key — prepare templates + triggers |
| 4 | Before/After Photo Comparison | ⬜ Todo | Split-view comparison UI on photos.astro |
| 5 | Recipe Ratings & Personalization | ⬜ Todo | DB table + star-rating UI + recommendation logic |
| 6 | Keto Calculator Tool | ⬜ Todo | TDEE + macro calculator page |
| 7 | Social Sharing Cards | ⬜ Todo | Canvas milestone cards (Day 7/30/etc.) |
| 8 | Offline Mode (finish PWA) | ⬜ Todo | sw.js cache strategy for recipes + meals |
| 9 | Smart Upsell Triggers | ⬜ Todo | Context-aware upgrade prompts at key moments |
| 10 | ⏸ Subscription Portal | ⏸ Stripe | Stripe Customer Portal for self-service billing |
| 11 | Referral System | ⬜ Todo | Invite codes + tracking + reward XP |

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

**Keto Journey** — A 30/180/365-day structured keto diet coaching app.
Users buy a plan (Basic/Pro/Elite), onboard, then follow daily tasks, meals, check-ins, fasting, and progress tracking.

**Stack:** Astro 4 (SSR) · Supabase (Postgres + Auth) · Cloudflare Pages · TypeScript

---

## 2. DIRECTORY STRUCTURE

```
src/
├── lib/
│   ├── supabase.ts              ← Supabase client + all helper functions + PLANS config
│   ├── auth.ts                  ← requireAuth() shared helper ✅ NEW
│   └── smartMeals.ts            ← Smart Meal Intelligence Engine ✅ NEW
├── components/
│   ├── DashNav.astro            ← Shared nav (all dashboard pages)
│   └── NotificationsBell.astro  ← Standalone bell component ✅ NEW
├── pages/
│   ├── index.astro              ← Landing page
│   ├── login.astro
│   ├── signup.astro
│   ├── dashboard/
│   │   ├── index.astro          ← Main dashboard ✅ WORKING
│   │   ├── checkin.astro        ← Daily check-in form ✅ WORKING
│   │   ├── recipes.astro        ← Recipe browser ✅
│   │   ├── recipe/[id].astro    ← Recipe detail ✅
│   │   ├── progress.astro       ← Charts, weight logs, body measurements, achievements ✅
│   │   ├── shopping.astro       ← Shopping list (dynamic per tier) ✅
│   │   ├── fasting.astro        ← Fasting timer ✅
│   │   ├── weekly.astro         ← Weekly report ✅
│   │   ├── profile.astro        ← User profile + achievements ✅
│   │   ├── ai-coach.astro       ← Elite only ✅
│   │   ├── onboarding.astro     ← First-time setup ✅
│   │   ├── upgrade.astro        ← Plan upgrade page
│   │   └── notifications.astro  ← Notifications page
│   └── api/
│       ├── checkin/
│       │   └── save.ts          ← POST /api/checkin/save ✅ XP fix applied
│       ├── tasks/
│       │   └── complete.ts      ← POST /api/tasks/complete ✅ NEW — full RPC implementation
│       ├── notifications/
│       │   ├── index.ts         ← GET/POST /api/notifications ✅
│       │   ├── generate.ts      ← POST /api/notifications/generate ✅ "All caught up" bug fixed
│       │   └── save.ts          ← POST /api/notifications/save ✅ fixed shared client
│       ├── fasting/
│       │   ├── start.ts         ← POST /api/fasting/start ✅
│       │   └── end.ts           ← POST /api/fasting/end ✅ XP fix applied
│       ├── meals/
│       │   ├── today.ts         ← GET /api/meals/today
│       │   └── swap.ts          ← POST /api/meals/swap ✅ complete rewrite (correct fields)
│       ├── measurements/
│       │   └── save.ts          ← POST /api/measurements/save ✅ NEW
│       ├── profile/
│       │   ├── update.ts        ← POST /api/profile/update
│       │   └── add-weight.ts    ← POST /api/profile/add-weight ✅ field names fixed
│       ├── weekly/
│       │   └── save.ts          ← POST /api/weekly/save ✅ XP fix applied
│       ├── onboarding/
│       └── chat/
│           └── gemini.ts        ← POST /api/chat/gemini ✅ table name + field names fixed
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
| `recipes` | `id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags[]` |
| `weight_logs` | `user_id, weight, logged_date` ← fields are `weight` + `logged_date` (NOT `weight_kg`/`date`) |
| `weekly_reports` | `user_id, week_number` |
| `notifications` | `user_id, type, title, body, icon, action_url, action_label, priority, is_read, is_dismissed, expires_at` |
| `notification_preferences` | Per-user notification settings |
| `onboarding_data` | `user_id, current_weight, target_weight, dietary_restrictions[], fasting_protocol, goal, feature_electrolytes` |
| `xp_transactions` | `user_id, action_type, xp_amount, description, day_number` ← fields are `action_type` + `xp_amount` |
| `achievements` | Earned achievements per user |
| `macro_goals` | `user_id, daily_calories, protein_g, fat_g, carbs_g` |
| `water_intake` | `user_id, day_number, date, glasses_count, target_glasses` |
| `body_measurements` | `user_id, logged_date, neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm, notes` |
| `completed_days` | Days marked as fully complete |
| `chat_messages` | AI Coach chat history |
| `pending_activations` | Payment activation queue |

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
This is already applied in: `checkin/save.ts`, `fasting/end.ts`, `weekly/save.ts`, `tasks/complete.ts`.

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

### Shared helper (preferred)
```typescript
import { requireAuth } from '../../lib/auth';
const auth = await requireAuth(Astro);
if ('redirect' in auth) return Astro.redirect(auth.redirect);
const { user, profile } = auth;
```

### Manual pattern (legacy — still in some pages)
```typescript
const accessToken = Astro.cookies.get('sb-access-token')?.value;
if (!accessToken) return Astro.redirect('/login');
const { data: { user } } = await supabase.auth.getUser(accessToken);
if (!user) return Astro.redirect('/login');
const profile = await getProfile(user.id);
if (!profile) return Astro.redirect('/login');
if (!isSubscriptionActive(profile)) return Astro.redirect('/dashboard/upgrade');
```

---

## 7. SUBSCRIPTION TIERS

| Tier | ID | Days | Features |
|------|----|------|---------|
| Basic | `basic_30` | 30 | 30 recipes, basic tracking |
| Pro | `pro_6` | 180 | 87+ recipes, analytics |
| Elite | `elite_12` | 365 | All + AI Coach |

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

## 9. NOTIFICATIONS SYSTEM ✅ BUG FIXED

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

### Notification types
- `checkin_reminder` — if no checkin today
- `streak_warning` — if has streak + no checkin today
- `incomplete_tasks` — if pending tasks
- `weight_reminder` — if 2+ days since last weigh-in
- `milestone_N` — day milestones (1,3,7,10,14,21,30)
- `streak_N` — streak milestones (3,7,14,21,30)
- `level_up_N` — level up celebration
- `weight_progress` — 25/50/75% to goal
- `fasting_active` — fasting tip while active
- `low_water` — if checked in with < 6 glasses
- `weekly_review` — last 2 days of week
- `energy_trend` — 3 days of low energy
- `welcome` — first time only

---

## 10. MEAL SWAP SYSTEM ✅ FIXED

### `/api/meals/swap.ts` — correct field names
```typescript
// Recipe fields: protein, fat, net_carbs, tags  (NOT protein_g/fat_g/carbs_g/category)
// Dietary filtering via tags array + title keyword matching (NOT boolean columns)
// Category derived from tags: tags.find(t => mealCategories.includes(t))
// Macro scoring: Math.abs(candidate.protein - original.protein)
// Records in meal_swaps: { user_id, original_recipe_id, swap_recipe_id, reason, swap_date }
```

### Dietary restriction checks (tag/title based)
```typescript
no_pork:    tags.includes('pork') || title contains bacon/ham/prosciutto/chorizo/sausage
vegetarian: title contains chicken/beef/steak/lamb/duck/pork
no_seafood: tags include seafood/omega-3/pescatarian OR title contains salmon/tuna/shrimp/etc.
```

---

## 11. BODY MEASUREMENTS ✅ NEW

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

## 12. WEIGHT LOGS PATTERN ✅ CORRECTED

```typescript
// Fields are: weight (NOT weight_kg) and logged_date (NOT date)
const { data: weightLogs } = await supabase
  .from('weight_logs')
  .select('weight, logged_date')
  .eq('user_id', userId)
  .order('logged_date', { ascending: false })
  .limit(8);

const latestWeight = weightLogs?.[0]?.weight || startWeight;
// Start weight from onboarding_data.current_weight (NOT profiles.weight_kg)
const startWeight = onboarding?.current_weight || profile.weight_kg || 0;

// Upsert pattern:
await supabase.from('weight_logs').upsert(
  { user_id, weight, logged_date },
  { onConflict: 'user_id,logged_date' }  // NOT 'user_id,date'
);
```

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

---

## 14. AI COACH (gemini.ts) ✅ FIXED

Fixed bugs:
- Table name: `user_journey` (NOT `user_journeys` — no 's')
- Weight fields: `weight` + `logged_date` (NOT `weight_kg`/`date`)
- Use `.maybeSingle()` on weight query (not `.single()` — crashes if no logs)
- System prompt uses `recentWeight?.weight` (not `.weight_kg`)

---

## 15. DESIGN SYSTEM

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
- Mobile: bottom nav at `max-width: 900px`

---

## 16. API RESPONSE PATTERNS

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

---

## 17. SHOPPING LIST PATTERN ✅ FIXED

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

## 18. COMPLETE LIST OF FIXES APPLIED (Session 2026-03-21 to 2026-03-24)

| File | Fix Applied |
|------|-------------|
| `shopping.astro` | Hardcoded `basic_30` → dynamic `planType`; week count dynamic via `getMaxJourneyDays` |
| `recipe/[id].astro` | Hardcoded `basic_30` → dynamic `planType`; `.single()` → `.maybeSingle()` |
| `api/profile/add-weight.ts` | Field names: `weight_kg`→`weight`, `date`→`logged_date`; onConflict fix |
| `profile.astro` | Weight field names fixed throughout; real DB achievements section added |
| `api/notifications/generate.ts` | "All caught up" bug fixed: daily types deleted before regen; only milestones blocked |
| `api/notifications/save.ts` | Was using direct `createClient` instead of shared `supabase` import |
| `progress.astro` | Weight log modal added; body measurements card + modal added; achievements card added |
| `api/measurements/save.ts` | **NEW FILE** — body measurements upsert endpoint |
| `api/fasting/end.ts` | XP now uses `award_xp` RPC (was writing to wrong table `profiles.xp_total`) |
| `api/weekly/save.ts` | XP now uses `award_xp` RPC (same bug as fasting/end.ts) |
| `api/chat/gemini.ts` | Table `user_journeys`→`user_journey`; weight fields fixed; `.single()`→`.maybeSingle()` |
| `api/meals/swap.ts` | **COMPLETE REWRITE** — wrong field names (`protein_g`→`protein`, etc.); tag-based dietary filtering |
| `api/tasks/complete.ts` | **NEW FILE** — full task completion with `complete_task` RPC + fallback chain |
| `dashboard/index.astro` | Calls `updateCurrentDay()` on load (fixes Day 1 stuck bug); meal plan fallback to `basic_30` |
| `lib/auth.ts` | **NEW FILE** — `requireAuth()` shared helper |
| `components/NotificationsBell.astro` | **NEW FILE** — standalone bell component |

---

## 19. WHAT WORKS vs WHAT NEEDS ATTENTION

### ✅ Working (all verified 2026-03-30)
- Auth flow (login/signup/cookies) via `requireAuth()`
- Dashboard: current day advances correctly on load
- Dashboard: meals load with plan-specific data (pro_6/elite_12 = 90 days, basic_30 = 30 days)
- Task completion with XP (API + RPC with fallback chain)
- Check-in form + save with correct XP to `user_journey`; duplicate warning shown if already submitted today
- Recipes browser + detail (dynamic plan_type)
- Progress charts + weight log modal
- Body measurements tracking (add, edit, delete — edit pre-fills existing modal via data-* attributes)
- Shopping list (dynamic weeks per tier; empty state shown if no items)
- Fasting timer (start/end with correct XP; setInterval cleanup on tab hide)
- Notifications panel (daily types refresh correctly; bell integrated via NotificationsBell.astro)
- Community feed with pagination (Load More button, state.page counter, has_more flag from API)
- All API files use getUserClient(token) for RLS-correct authenticated requests
- AI Coach (correct table/field names; JSX ternary patterns pre-computed)
- Weekly report with correct XP
- Profile with real DB achievements
- Ketone tracker (new page: /dashboard/ketones with chart, zones guide, log + delete)
- update_current_day RPC verified working (tested live — calculates days from start_date correctly)

### ⚠️ Known Limitations
- None

---

## 20. PUSH NOTIFICATIONS SYSTEM

### DB Table — run in Supabase SQL editor
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

### Env vars needed (.env + Cloudflare Pages dashboard)
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

### Notification triggers
| Trigger | When | Type |
|---------|------|------|
| Morning reminder | 8am if no check-in | `checkin_reminder` |
| Streak warning | 6pm if streak > 0 and no check-in | `streak_warning` |
| Fasting tip | When active fast passes 8h | `fasting_active` |
| Milestone | Day 7/14/21/30 reached | `milestone_N` |
| Level up | New level reached | `level_up_N` |

### 🔧 getMealCycleDays()
- basic_30 → cycles 30 days
- pro_6    → cycles 90 days (DB has days 1–90)
- elite_12 → cycles 90 days (DB has days 1–90)
