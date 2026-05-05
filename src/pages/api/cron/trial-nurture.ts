// GET /api/cron/trial-nurture
// Runs daily — sends post-trial emails to users whose trial expired without subscribing.
// Schedule (days after subscription_end_date):
//   step 0 → 1  on day 1
//   step 1 → 2  on day 4
//   step 2 → 3  on day 8
//   step 3 → 4  on day 14
//   step 4       done

import type { APIRoute } from 'astro';

const STEPS: Array<{ minDays: number; fn: string }> = [
  { minDays: 1,  fn: 'sendTrialNurture1' },
  { minDays: 4,  fn: 'sendTrialNurture2' },
  { minDays: 8,  fn: 'sendTrialNurture3' },
  { minDays: 14, fn: 'sendTrialNurture4' },
];

export const GET: APIRoute = async ({ request, locals }) => {
  const authHeader = request.headers.get('authorization');
  const env = (locals as any)?.runtime?.env || {};
  const CRON_SECRET = process.env.CRON_SECRET || import.meta.env.CRON_SECRET || env.CRON_SECRET;

  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: 'Forbidden' }, 403);
  }

  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Config error' }, 500);

  const { createClient } = await import('@supabase/supabase-js');
  const db = createClient(SUPABASE_URL, SERVICE_KEY);
  const emailLib = await import('../../../lib/email');
  const now = new Date();
  let sent = 0;
  let errors = 0;

  for (let step = 0; step < STEPS.length; step++) {
    const { minDays, fn } = STEPS[step];
    const cutoff = new Date(now.getTime() - minDays * 86400000).toISOString();

    // Find expired trial users at this nurture step
    const { data: users } = await db
      .from('profiles')
      .select('id, email, full_name')
      .eq('subscription_status', 'expired')
      .eq('is_trial', true)
      .eq('trial_nurture_step', step)
      .lte('subscription_end_date', cutoff);

    if (!users?.length) continue;

    const sendFn = (emailLib as any)[fn] as (email: string, name: string) => Promise<unknown>;

    for (const user of users) {
      try {
        await sendFn(user.email, user.full_name || 'there');
        await db.from('profiles')
          .update({ trial_nurture_step: step + 1 })
          .eq('id', user.id);
        sent++;
      } catch (err) {
        console.error(`[trial-nurture] step=${step} user=${user.id}`, err);
        errors++;
      }
    }
  }

  console.log(`[trial-nurture] sent=${sent} errors=${errors}`);
  return json({ success: true, sent, errors });
};

export const POST: APIRoute = GET;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
