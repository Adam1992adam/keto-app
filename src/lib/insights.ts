// src/lib/insights.ts — Proactive Insight Engine
// Analyses the last 14 days of user data and returns actionable insights.
// Call generateInsights(userId, db) server-side; returns Insight[].

export interface Insight {
  id:     string;   // stable key (used for dismissal)
  type:   'energy' | 'hydration' | 'meals' | 'weight' | 'sleep' | 'macros' | 'adaptation' | 'streak' | 'fasting' | 'ketones';
  level:  'positive' | 'warning' | 'info';
  icon:   string;   // emoji
  title:  string;
  body:   string;
  action?: { label: string; url: string };
}

export async function generateInsights(
  userId: string,
  db: any,
  currentDay: number = 1,
  streakDays: number = 0,
): Promise<Insight[]> {
  const insights: Insight[] = [];

  const today      = new Date().toISOString().split('T')[0];
  const fourteenAgo = new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0];
  const sevenAgo    = new Date(Date.now() - 6  * 86400000).toISOString().split('T')[0];
  const threeAgo    = new Date(Date.now() - 2  * 86400000).toISOString().split('T')[0];

  // ── Fetch all data in parallel ────────────────────────────────────────────
  const [
    { data: checkins },
    { data: weightLogs },
    { data: foodLogs },
    { data: fastingSessions },
    { data: ketoneLogs },
    { data: macroGoals },
  ] = await Promise.all([
    db.from('daily_checkins')
      .select('checkin_date, energy_level, mood_level, water_glasses, followed_meals, had_headache, had_fatigue, had_cravings, fasted_today, brain_fog, sleep_hours')
      .eq('user_id', userId)
      .gte('checkin_date', fourteenAgo)
      .order('checkin_date', { ascending: false }),
    db.from('weight_logs')
      .select('weight, logged_date')
      .eq('user_id', userId)
      .gte('logged_date', fourteenAgo)
      .order('logged_date', { ascending: true }),
    db.from('food_logs')
      .select('logged_date, calories, protein_g, fat_g, carbs_g')
      .eq('user_id', userId)
      .gte('logged_date', sevenAgo)
      .order('logged_date', { ascending: true }),
    db.from('fasting_sessions')
      .select('started_at, ended_at, target_hours')
      .eq('user_id', userId)
      .gte('started_at', fourteenAgo + 'T00:00:00Z'),
    db.from('ketone_logs')
      .select('ketone_mmol, logged_date')
      .eq('user_id', userId)
      .gte('logged_date', sevenAgo)
      .order('logged_date', { ascending: false })
      .limit(7),
    db.from('macro_goals')
      .select('daily_calories, protein_g, fat_g, carbs_g')
      .eq('user_id', userId)
      .maybeSingle(),
  ]);

  const c14 = checkins || [];   // last 14 check-ins
  const c7  = c14.filter(c => c.checkin_date >= sevenAgo);
  const c3  = c14.filter(c => c.checkin_date >= threeAgo);
  const wl  = weightLogs || [];
  const fl  = foodLogs   || [];

  // Helper: average a numeric field over an array of check-ins
  const avg = (arr: any[], field: string) => {
    const vals = arr.map(c => c[field]).filter(v => v != null && !isNaN(v));
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  // ── 1. LOW ENERGY TREND (3+ consecutive days energy ≤ 2) ────────────────
  if (c3.length >= 3) {
    const allLow = c3.every(c => (c.energy_level || 3) <= 2);
    if (allLow) {
      const avgE = avg(c3, 'energy_level');
      insights.push({
        id: 'low-energy-3d',
        type: 'energy',
        level: 'warning',
        icon: '⚡',
        title: 'Low energy 3 days in a row',
        body: `Your average energy has been ${avgE?.toFixed(1)}/5 for the past 3 days. This is common during keto adaptation — try adding electrolytes (sodium, magnesium, potassium) and make sure you're hitting your fat targets.`,
        action: { label: 'Check macros', url: '/dashboard/food-log' },
      });
    }
  }

  // ── 2. HIGH ENERGY STREAK (3+ days energy ≥ 4) ──────────────────────────
  if (c3.length >= 3 && !insights.find(i => i.id === 'low-energy-3d')) {
    const allHigh = c3.every(c => (c.energy_level || 3) >= 4);
    if (allHigh) {
      insights.push({
        id: 'high-energy-3d',
        type: 'energy',
        level: 'positive',
        icon: '🔥',
        title: `${c3.length}-day energy streak`,
        body: `You've rated your energy 4 or higher for ${c3.length} days straight. Your body is adapting well to keto — keep your current routine going.`,
      });
    }
  }

  // ── 3. DEHYDRATION PATTERN (last 3 days avg water < 5 glasses) ──────────
  if (c3.length >= 2) {
    const avgWater = avg(c3, 'water_glasses');
    if (avgWater !== null && avgWater < 5) {
      insights.push({
        id: 'low-water-3d',
        type: 'hydration',
        level: 'warning',
        icon: '💧',
        title: 'Low water intake this week',
        body: `You've averaged ${avgWater.toFixed(1)} glasses/day over the past ${c3.length} days (target: 8+). Dehydration worsens keto fatigue, headaches, and cravings. Aim for at least 8 glasses daily.`,
        action: { label: 'Log check-in', url: '/dashboard/checkin' },
      });
    }
  }

  // ── 4. MEAL ADHERENCE DROP (last 3+ check-ins, <50% followed meals) ──────
  if (c3.length >= 3) {
    const followed = c3.filter(c => c.followed_meals).length;
    const pct = followed / c3.length;
    if (pct < 0.5) {
      insights.push({
        id: 'low-meal-adherence',
        type: 'meals',
        level: 'warning',
        icon: '🍽',
        title: 'Meal plan adherence is low',
        body: `You followed your meal plan on only ${followed} of the last ${c3.length} days. Sticking to the plan is the #1 driver of results — consider swapping meals you're not enjoying.`,
        action: { label: 'Browse recipes', url: '/dashboard/recipes' },
      });
    }
  }

  // ── 5. MOOD-MEAL CORRELATION ─────────────────────────────────────────────
  if (c7.length >= 5) {
    const onMeal  = c7.filter(c => c.followed_meals);
    const offMeal = c7.filter(c => !c.followed_meals);
    const avgMoodOn  = avg(onMeal,  'mood_level');
    const avgMoodOff = avg(offMeal, 'mood_level');
    if (avgMoodOn !== null && avgMoodOff !== null && onMeal.length >= 2 && offMeal.length >= 2) {
      const diff = avgMoodOn - avgMoodOff;
      if (diff >= 1) {
        insights.push({
          id: 'mood-meal-correlation',
          type: 'meals',
          level: 'positive',
          icon: '😊',
          title: 'Better mood when you follow the plan',
          body: `Your mood averages ${avgMoodOn.toFixed(1)}/5 on days you follow your meal plan vs ${avgMoodOff.toFixed(1)}/5 on days you don't — a difference of ${diff.toFixed(1)} points. The plan is working for you.`,
        });
      }
    }
  }

  // ── 6. BRAIN FOG PATTERN (2+ brain fog days in last 7) ──────────────────
  if (c7.length >= 3) {
    const fogDays = c7.filter(c => c.brain_fog).length;
    if (fogDays >= 2 && currentDay <= 21) {
      insights.push({
        id: 'brain-fog-pattern',
        type: 'adaptation',
        level: 'info',
        icon: '🧠',
        title: `Brain fog on ${fogDays} days this week`,
        body: `Brain fog during the first 3 weeks is a normal part of keto adaptation. Electrolytes (especially sodium and magnesium), MCT oil, and staying hydrated usually resolve it by day 14–21.`,
        action: { label: 'Learn more', url: '/dashboard/learn' },
      });
    }
  }

  // ── 7. WEIGHT PLATEAU (7+ days, change ≤ 0.3 kg) ────────────────────────
  if (wl.length >= 4) {
    const last7wl  = wl.filter(w => w.logged_date >= sevenAgo);
    if (last7wl.length >= 3) {
      const weights = last7wl.map(w => w.weight);
      const minW = Math.min(...weights);
      const maxW = Math.max(...weights);
      if (maxW - minW <= 0.3 && currentDay > 14) {
        insights.push({
          id: 'weight-plateau',
          type: 'weight',
          level: 'info',
          icon: '⚖️',
          title: 'Weight plateau this week',
          body: `Your weight has stayed within ${((maxW - minW) * 2.205).toFixed(1)} lbs this week. Plateaus are normal — try adjusting your calorie intake by 100–150 cal, or add a 24h fast to break through.`,
          action: { label: 'View progress', url: '/dashboard/progress' },
        });
      }
    }
  }

  // ── 8. WEIGHT LOSS MOMENTUM (lost ≥ 0.5 kg in last 7 days) ─────────────
  if (wl.length >= 2 && !insights.find(i => i.id === 'weight-plateau')) {
    const oldest = wl[0]?.weight;
    const newest = wl[wl.length - 1]?.weight;
    if (oldest && newest && oldest - newest >= 0.5) {
      const lostLbs = ((oldest - newest) * 2.205).toFixed(1);
      insights.push({
        id: 'weight-momentum',
        type: 'weight',
        level: 'positive',
        icon: '📉',
        title: `Down ${lostLbs} lbs this week`,
        body: `You've lost ${lostLbs} lbs over the last 7 days — that's solid momentum. Keep your carbs under your goal and maintain your fasting protocol.`,
        action: { label: 'Log weight', url: '/dashboard/progress' },
      });
    }
  }

  // ── 9. SLEEP-ENERGY CORRELATION ──────────────────────────────────────────
  if (c7.length >= 5) {
    const withSleep = c7.filter(c => c.sleep_hours && c.sleep_hours > 0);
    if (withSleep.length >= 4) {
      const goodSleep = withSleep.filter(c => c.sleep_hours >= 7);
      const poorSleep = withSleep.filter(c => c.sleep_hours < 7);
      const avgEGood = avg(goodSleep, 'energy_level');
      const avgEPoor = avg(poorSleep, 'energy_level');
      if (avgEGood !== null && avgEPoor !== null && goodSleep.length >= 2 && poorSleep.length >= 2) {
        const diff = avgEGood - avgEPoor;
        if (diff >= 0.8) {
          insights.push({
            id: 'sleep-energy-correlation',
            type: 'sleep',
            level: 'info',
            icon: '🌙',
            title: 'Sleep affects your energy',
            body: `You rate your energy ${avgEGood.toFixed(1)}/5 after 7+ hours of sleep vs ${avgEPoor.toFixed(1)}/5 after less. Prioritising sleep is one of the highest-leverage things you can do on keto.`,
          });
        }
      }
    }
  }

  // ── 10. FASTING-ENERGY CORRELATION ────────────────────────────────────────
  if (c7.length >= 5) {
    const fastedDays   = c7.filter(c => c.fasted_today);
    const unfastedDays = c7.filter(c => !c.fasted_today);
    const avgEFasted   = avg(fastedDays,   'energy_level');
    const avgEUnfasted = avg(unfastedDays, 'energy_level');
    if (avgEFasted !== null && avgEUnfasted !== null && fastedDays.length >= 2 && unfastedDays.length >= 2) {
      const diff = avgEFasted - avgEUnfasted;
      if (Math.abs(diff) >= 0.8) {
        const better = diff > 0 ? 'higher' : 'lower';
        insights.push({
          id: 'fasting-energy-correlation',
          type: 'fasting',
          level: diff > 0 ? 'positive' : 'info',
          icon: '⏱',
          title: `Energy is ${better} on fasting days`,
          body: `Your energy averages ${avgEFasted.toFixed(1)}/5 on fasting days vs ${avgEUnfasted.toFixed(1)}/5 on non-fasting days. ${diff > 0 ? 'Your body thrives on fasted periods — consider adding more fasting days.' : 'You may need more time to adapt to fasting — make sure you\'re eating enough on feeding days.'}`,
          action: { label: 'Track fasting', url: '/dashboard/fasting' },
        });
      }
    }
  }

  // ── 11. PROTEIN UNDER-EATING (food logs, avg < 80% of goal) ──────────────
  if (fl.length >= 3 && macroGoals?.protein_g) {
    const dayMap: Record<string, number> = {};
    for (const f of fl) {
      dayMap[f.logged_date] = (dayMap[f.logged_date] || 0) + parseFloat(f.protein_g || 0);
    }
    const days = Object.values(dayMap);
    if (days.length >= 3) {
      const avgProt = days.reduce((a, b) => a + b, 0) / days.length;
      const pct = avgProt / macroGoals.protein_g;
      if (pct < 0.8) {
        insights.push({
          id: 'low-protein',
          type: 'macros',
          level: 'warning',
          icon: '🥩',
          title: `Protein averaging ${Math.round(pct * 100)}% of goal`,
          body: `You're averaging ${Math.round(avgProt)}g protein/day against a goal of ${macroGoals.protein_g}g. Adequate protein on keto is critical for muscle preservation — especially if you're in a calorie deficit.`,
          action: { label: 'Log food', url: '/dashboard/food-log' },
        });
      }
    }
  }

  // ── 12. CARB CREEP (food logs, avg net carbs > goal) ────────────────────
  if (fl.length >= 3 && macroGoals?.carbs_g) {
    const dayMap: Record<string, number> = {};
    for (const f of fl) {
      dayMap[f.logged_date] = (dayMap[f.logged_date] || 0) + parseFloat(f.carbs_g || 0);
    }
    const days = Object.values(dayMap);
    if (days.length >= 3) {
      const avgCarbs = days.reduce((a, b) => a + b, 0) / days.length;
      if (avgCarbs > macroGoals.carbs_g * 1.2) {
        insights.push({
          id: 'carb-creep',
          type: 'macros',
          level: 'warning',
          icon: '🚨',
          title: `Net carbs averaging ${Math.round(avgCarbs)}g/day`,
          body: `Your carb goal is ${macroGoals.carbs_g}g but you're averaging ${Math.round(avgCarbs)}g — ${Math.round(avgCarbs - macroGoals.carbs_g)}g over. This may be slowing ketosis. Review your recent food logs for hidden carbs.`,
          action: { label: 'Review food log', url: '/dashboard/food-log' },
        });
      }
    }
  }

  // ── 13. KETO ADAPTATION MILESTONE ────────────────────────────────────────
  if (currentDay >= 14 && currentDay <= 16) {
    const avgAdaptEnergy = avg(c7, 'energy_level');
    if (avgAdaptEnergy !== null && avgAdaptEnergy >= 3) {
      insights.push({
        id: 'keto-adaptation-milestone',
        type: 'adaptation',
        level: 'positive',
        icon: '🎯',
        title: 'Keto adaptation milestone — Day 14',
        body: `Most people complete the initial keto adaptation between days 14–21. Your energy is stabilising (avg ${avgAdaptEnergy.toFixed(1)}/5) — expect mental clarity, reduced cravings, and more consistent energy from here.`,
        action: { label: 'View progress', url: '/dashboard/progress' },
      });
    }
  }

  // ── 14. KETONE TREND ─────────────────────────────────────────────────────
  if ((ketoneLogs || []).length >= 3) {
    const kLogs = ketoneLogs!;
    const latest = kLogs[0]?.ketone_mmol;
    const oldest = kLogs[kLogs.length - 1]?.ketone_mmol;
    if (latest && oldest) {
      if (latest >= 1.5 && latest <= 3.0) {
        insights.push({
          id: 'ketone-optimal',
          type: 'ketones',
          level: 'positive',
          icon: '💚',
          title: `Ketones in optimal range (${latest} mmol/L)`,
          body: `A reading of ${latest} mmol/L places you in nutritional ketosis (1.5–3.0 mmol/L) — the sweet spot for fat burning and mental clarity. Keep doing what you're doing.`,
          action: { label: 'Track ketones', url: '/dashboard/ketones' },
        });
      } else if (latest < 0.5) {
        insights.push({
          id: 'ketone-low',
          type: 'ketones',
          level: 'warning',
          icon: '💛',
          title: `Ketones low (${latest} mmol/L)`,
          body: `Your latest reading of ${latest} mmol/L is below ketosis threshold (0.5 mmol/L). Common causes: hidden carbs, too much protein, or not enough dietary fat. Review your food log.`,
          action: { label: 'View food log', url: '/dashboard/food-log' },
        });
      }
    }
  }

  // Cap at 4 insights — prioritise warnings over positives, positives over info
  const order = { warning: 0, positive: 1, info: 2 };
  insights.sort((a, b) => order[a.level] - order[b.level]);
  return insights.slice(0, 4);
}
