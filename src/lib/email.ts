// src/lib/email.ts
// Resend email client + all transactional email templates
// Templates use inline styles for maximum email client compatibility

import { Resend } from 'resend';

function getResend() {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

const FROM = import.meta.env.EMAIL_FROM || 'Keto Journey <onboarding@resend.dev>';
const APP_URL = import.meta.env.PUBLIC_APP_URL || 'https://keto-app-iota.vercel.app';

// ── Shared layout wrapper ────────────────────────────────────────────────────
function layout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Keto Journey</title>
<style>
  @media only screen and (max-width:600px){
    .email-body{padding:16px!important;}
    .email-card{padding:28px 20px!important;border-radius:16px!important;}
    .stat-cell{display:block!important;width:100%!important;padding:10px 0!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#0a0f0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f0b;">
  <tr><td align="center" class="email-body" style="padding:32px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

      <!-- Logo header -->
      <tr><td style="padding-bottom:24px;text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:8px;">
          <span style="font-size:28px;">🥑</span>
          <span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#10b981;letter-spacing:-.5px;">Keto Journey</span>
        </div>
      </td></tr>

      <!-- Card -->
      <tr><td class="email-card" style="background:#0d1a0f;border:1px solid rgba(16,185,129,.2);border-radius:20px;padding:36px 32px;">
        ${content}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:24px 0 8px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#2e4a32;line-height:1.6;">
          You're receiving this because you have an active Keto Journey subscription.<br/>
          <a href="${APP_URL}/dashboard/notification-preferences" style="color:#10b981;text-decoration:none;">Manage email preferences</a>
          &nbsp;·&nbsp;
          <a href="${APP_URL}/dashboard" style="color:#10b981;text-decoration:none;">Open dashboard</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Green CTA button ─────────────────────────────────────────────────────────
function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;font-weight:800;font-size:15px;border-radius:12px;text-decoration:none;letter-spacing:-.2px;">${label}</a>`;
}

// ── Heading style shortcut ───────────────────────────────────────────────────
function h1(text: string) {
  return `<h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;font-weight:900;color:#dfeedd;line-height:1.2;">${text}</h1>`;
}

function p(text: string, style = '') {
  return `<p style="margin:0 0 16px;font-size:15px;color:#4d7055;line-height:1.7;${style}">${text}</p>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WELCOME EMAIL — sent right after account creation
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string, tier: string) {
  const firstName = name.split(' ')[0];
  const tierLabel = tier === 'elite_12' ? '👑 Elite (365 days)' : tier === 'pro_6' ? '⚡ Pro (180 days)' : '🥑 Basic (30 days)';

  const content = `
    ${h1(`Welcome, ${firstName}! 🎉`)}
    ${p(`Your <strong style="color:#dfeedd;">${tierLabel}</strong> plan is now active. You're about to transform your health with the ketogenic diet — and we'll be with you every step of the way.`)}

    <!-- Steps -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      ${step('1', '🧭', 'Complete Onboarding', 'Set your starting weight, goal, and dietary preferences so we can personalise your plan.', `${APP_URL}/dashboard/onboarding`)}
      ${step('2', '✏️', 'Do Your First Check-in', 'Track your energy, water, and meals to earn your first 30 XP and start your streak.', `${APP_URL}/dashboard/checkin`)}
      ${step('3', '🍽️', 'Explore Your Meal Plan', 'Browse keto-friendly recipes tailored to your plan and log your first meal.', `${APP_URL}/dashboard/recipes`)}
    </table>

    <div style="text-align:center;margin-top:28px;">
      ${btn(`${APP_URL}/dashboard`, 'Start Your Journey →')}
    </div>

    <div style="margin-top:28px;padding:16px;background:rgba(16,185,129,.08);border-radius:12px;border:1px solid rgba(16,185,129,.15);">
      <p style="margin:0;font-size:13px;color:#4d7055;line-height:1.6;">
        💡 <strong style="color:#dfeedd;">Keto Tip:</strong> In the first 3–5 days you may experience the "keto flu" (fatigue, headaches).
        Stay hydrated, add electrolytes, and keep your carbs under 20g. It passes quickly!
      </p>
    </div>`;

  const html = layout(content, `Your ${tierLabel} plan is active — let's start your keto journey!`);

  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to Keto Journey, ${firstName}! Your plan is ready 🥑`,
    html,
  });
}

function step(num: string, icon: string, title: string, desc: string, link: string) {
  return `<tr><td style="padding:10px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,.06);border-radius:12px;border:1px solid rgba(16,185,129,.12);">
      <tr>
        <td style="padding:14px 16px;width:36px;vertical-align:top;">
          <div style="width:28px;height:28px;background:linear-gradient(135deg,#10b981,#34d399);border-radius:8px;text-align:center;line-height:28px;font-size:14px;font-weight:900;color:#fff;">${num}</div>
        </td>
        <td style="padding:14px 16px 14px 4px;vertical-align:top;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#dfeedd;">${icon} ${title}</p>
          <p style="margin:0;font-size:13px;color:#4d7055;line-height:1.5;">${desc}</p>
        </td>
        <td style="padding:14px 16px;vertical-align:middle;width:24px;text-align:right;">
          <a href="${link}" style="color:#10b981;font-size:18px;text-decoration:none;">→</a>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. WEEKLY SUMMARY — sent every Monday with last week's stats
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWeeklySummaryEmail(to: string, name: string, stats: {
  weekNum: number;
  currentDay: number;
  streak: number;
  checkins: number;
  xpEarned: number;
  totalXp: number;
  level: number;
  weightLost: number;
  avgEnergy: number;
}) {
  const firstName = name.split(' ')[0];
  const { weekNum, currentDay, streak, checkins, xpEarned, totalXp, level, weightLost, avgEnergy } = stats;

  const energyLabel = avgEnergy >= 4 ? '🔥 High' : avgEnergy >= 3 ? '⚡ Good' : avgEnergy >= 2 ? '😐 Moderate' : '😴 Low';
  const checkinsLabel = checkins >= 7 ? '7/7 Perfect!' : `${checkins}/7`;
  const nextWeek = weekNum + 1;

  const content = `
    ${h1(`Week ${weekNum} Summary 📊`)}
    ${p(`Great work this week, <strong style="color:#dfeedd;">${firstName}</strong>! Here's how you did:`)}

    <!-- Stats grid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        ${statCell('🔥', streak > 0 ? `${streak}-Day` : '0', 'Current Streak', '#f59e0b')}
        ${statCell('✏️', checkinsLabel, 'Check-ins', '#10b981')}
        ${statCell('⭐', `+${xpEarned}`, 'XP Earned', '#8b5cf6')}
        ${statCell('⚡', energyLabel, 'Avg Energy', '#3b82f6')}
      </tr>
    </table>

    ${weightLost > 0 ? `<div style="padding:14px 16px;background:rgba(16,185,129,.08);border-radius:12px;border:1px solid rgba(16,185,129,.15);margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#10b981;font-weight:700;">🎯 ${(weightLost * 2.20462).toFixed(1)} lbs lost so far — keep going!</p>
    </div>` : ''}

    ${p(`You're on <strong style="color:#dfeedd;">Day ${currentDay}</strong> of your journey and <strong style="color:#8b5cf6;">Level ${level}</strong> with ${totalXp.toLocaleString()} total XP. Week ${nextWeek} starts now — make it count!`)}

    <div style="text-align:center;margin:24px 0;">
      ${btn(`${APP_URL}/dashboard/weekly`, `View Week ${weekNum} Report →`)}
    </div>

    <div style="padding:16px;background:rgba(16,185,129,.06);border-radius:12px;border:1px solid rgba(16,185,129,.12);">
      <p style="margin:0;font-size:13px;color:#4d7055;line-height:1.6;">
        💡 <strong style="color:#dfeedd;">Week ${nextWeek} Focus:</strong> ${weekFocus(weekNum)}
      </p>
    </div>`;

  const html = layout(content, `Your Week ${weekNum} keto summary is ready — ${streak} day streak!`);

  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Week ${weekNum} complete — ${streak > 0 ? `${streak}-day streak! 🔥` : 'keep going! 💪'}`,
    html,
  });
}

function statCell(icon: string, value: string, label: string, color: string) {
  return `<td class="stat-cell" style="padding:6px;text-align:center;width:25%;">
    <div style="background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.12);border-radius:12px;padding:14px 8px;">
      <div style="font-size:20px;margin-bottom:4px;">${icon}</div>
      <div style="font-size:16px;font-weight:900;color:${color};line-height:1;">${value}</div>
      <div style="font-size:11px;color:#2e4a32;margin-top:3px;font-weight:600;">${label}</div>
    </div>
  </td>`;
}

function weekFocus(weekNum: number) {
  const tips: Record<number, string> = {
    1: 'Survive the keto flu! Drink plenty of water, add salt to your meals, and focus on hitting your fat macros.',
    2: 'Your body is adapting. Push through any cravings — your fat-burning engine is firing up!',
    3: 'You should be feeling the "keto glow" — more energy, clearer thinking, better sleep. Log everything!',
    4: 'Final week! Focus on consistency and celebrate how far you\'ve come. You\'re almost a keto master!',
  };
  return tips[weekNum] || `Stay consistent with your meals, hit your macros, and keep that streak alive!`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MILESTONE EMAIL — day 7, 14, 21, 30 reached
// ─────────────────────────────────────────────────────────────────────────────
export async function sendMilestoneEmail(to: string, name: string, day: number, streak: number, totalXp: number) {
  const firstName = name.split(' ')[0];

  const milestones: Record<number, { icon: string; title: string; msg: string; badge: string }> = {
    7:  { icon: '🎉', title: 'One Full Week!', badge: '7-Day Badge', msg: `You've completed your first full week on keto! Your body is adapting and the fat-burning is kicking in. The hardest part is behind you.` },
    14: { icon: '🏆', title: '2-Week Champion!', badge: '14-Day Badge', msg: `Two weeks of consistent keto! Your metabolism has shifted into fat-burning mode. You're not just on a diet — you're building a lifestyle.` },
    21: { icon: '🧠', title: '21-Day Habit Formed!', badge: '21-Day Badge', msg: `Science says it takes 21 days to form a habit. You've done it. Keto is now a natural part of your life. You should feel sharper, stronger, and more focused.` },
    30: { icon: '👑', title: '30-Day Keto Hero!', badge: 'Champion Badge', msg: `YOU DID IT! A full 30-day keto challenge completed. You're now a certified keto champion. Whether you continue or take a break, you've proven what you're capable of.` },
    60: { icon: '⚡', title: '60 Days Strong!', badge: '60-Day Badge', msg: `Two months of keto consistency. Your body is now a fat-burning machine. At this point, keto isn't a diet — it's your lifestyle.` },
    90: { icon: '🌟', title: '90-Day Legend!', badge: 'Legend Badge', msg: `90 days! You're in the top 1% of people who commit to a keto lifestyle this long. The results speak for themselves.` },
  };

  const m = milestones[day] || { icon: '🎯', title: `Day ${day} Complete!`, badge: `Day ${day} Badge`, msg: `Another milestone reached! Keep up the incredible consistency.` };

  const content = `
    <!-- Big milestone badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;padding:20px 32px;background:linear-gradient(135deg,rgba(16,185,129,.15),rgba(52,211,153,.1));border:2px solid rgba(16,185,129,.3);border-radius:20px;">
        <div style="font-size:48px;margin-bottom:8px;">${m.icon}</div>
        <div style="font-family:Georgia,serif;font-size:22px;font-weight:900;color:#10b981;">Day ${day}</div>
        <div style="font-size:12px;color:#4d7055;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:1px;">${m.badge} Unlocked</div>
      </div>
    </div>

    ${h1(`${m.title}`)}
    ${p(`Congratulations <strong style="color:#dfeedd;">${firstName}</strong>! ${m.msg}`)}

    <!-- Stats row -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        ${statCell('🔥', `${streak}`, 'Day Streak', '#f59e0b')}
        ${statCell('⭐', totalXp.toLocaleString(), 'Total XP', '#8b5cf6')}
        ${statCell('📅', `Day ${day}`, 'Journey Day', '#10b981')}
      </tr>
    </table>

    <div style="text-align:center;margin:24px 0;">
      ${btn(`${APP_URL}/dashboard/progress`, 'View Your Progress →')}
    </div>`;

  const html = layout(content, `🎉 Day ${day} complete — ${m.title}`);

  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${m.icon} Day ${day} milestone unlocked — ${m.title}`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STREAK WARNING EMAIL — sent in evening if streak at risk
// ─────────────────────────────────────────────────────────────────────────────
export async function sendStreakWarningEmail(to: string, name: string, streak: number) {
  const firstName = name.split(' ')[0];

  const content = `
    <!-- Warning header -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">🔥</div>
      <div style="font-family:Georgia,serif;font-size:22px;font-weight:900;color:#f59e0b;margin-top:8px;">${streak}-Day Streak at Risk!</div>
    </div>

    ${h1(`Don't lose it, ${firstName}!`)}
    ${p(`You've built an impressive <strong style="color:#f59e0b;">${streak}-day streak</strong> — and it expires at midnight tonight if you don't check in.`)}
    ${p(`It only takes 2 minutes. Log your energy level, water intake, and meals to keep your streak alive and earn your daily XP.`)}

    <div style="text-align:center;margin:28px 0;">
      ${btn(`${APP_URL}/dashboard/checkin`, '✏️ Check In Now — Save My Streak')}
    </div>

    <div style="padding:14px 16px;background:rgba(245,158,11,.08);border-radius:12px;border:1px solid rgba(245,158,11,.2);">
      <p style="margin:0;font-size:13px;color:#7a5b1a;line-height:1.6;">
        ⏰ <strong style="color:#f59e0b;">Reminder:</strong> Streaks reset at midnight.
        You have until then to log today's check-in and protect your ${streak}-day record.
      </p>
    </div>`;

  const html = layout(content, `Your ${streak}-day streak expires tonight — check in to protect it!`);

  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `⚠️ Your ${streak}-day streak expires at midnight — check in now!`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. WIN-BACK EMAIL — sent after 3 days no check-in
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWinbackEmail(to: string, name: string, daysMissed: number, currentDay: number) {
  const firstName = name.split(' ')[0];

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">👋</div>
    </div>

    ${h1(`We miss you, ${firstName}!`)}
    ${p(`It's been <strong style="color:#dfeedd;">${daysMissed} days</strong> since your last check-in. Life gets busy — we totally get it.`)}
    ${p(`But here's the thing: you've already made it to <strong style="color:#10b981;">Day ${currentDay}</strong> of your keto journey. That's real progress. Don't let it slip away.`)}

    <!-- What they're missing -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr><td style="padding:6px 0;">
        <div style="background:rgba(16,185,129,.06);border-radius:12px;border:1px solid rgba(16,185,129,.12);padding:16px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#dfeedd;">While you were away, you missed out on:</p>
          <p style="margin:0 0 6px;font-size:13px;color:#4d7055;">🔥 <strong style="color:#f59e0b;">${daysMissed * 30} XP</strong> from daily check-ins</p>
          <p style="margin:0 0 6px;font-size:13px;color:#4d7055;">📅 <strong style="color:#10b981;">${daysMissed}</strong> streak day${daysMissed !== 1 ? 's' : ''} that would have counted</p>
          <p style="margin:0;font-size:13px;color:#4d7055;">🍽️ Fresh meal suggestions and recipes ready for you</p>
        </div>
      </td></tr>
    </table>

    ${p(`Coming back is the hardest part — but you've already done the hard work of getting to Day ${currentDay}. Just one check-in gets you back on track.`)}

    <div style="text-align:center;margin:28px 0;">
      ${btn(`${APP_URL}/dashboard/checkin`, '🚀 Get Back on Track →')}
    </div>

    <p style="font-size:13px;color:#2e4a32;text-align:center;margin:0;">
      Your journey is waiting. No judgment — just progress. 💚
    </p>`;

  const html = layout(content, `${daysMissed} days missed — your keto journey is waiting for you`);

  const resend = getResend();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, your keto journey misses you 👋`,
    html,
  });
}
