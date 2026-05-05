// GET /api/cron/lead-nurture
// Runs daily — sends the next nurture email to leads who haven't signed up yet.
// Schedule:
//   step 0 → 1  on day 2  after created_at
//   step 1 → 2  on day 5
//   step 2 → 3  on day 8
//   step 3 → 4  on day 12
//   step 4       done — no more emails

import type { APIRoute } from 'astro';

const STEPS: Array<{ minDays: number; fn: string }> = [
  { minDays: 2,  fn: 'sendLeadNurture1' },
  { minDays: 5,  fn: 'sendLeadNurture2' },
  { minDays: 8,  fn: 'sendLeadNurture3' },
  { minDays: 12, fn: 'sendLeadNurture4' },
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

    // Find leads at this step whose created_at is old enough and haven't converted
    const { data: leads } = await db
      .from('leads')
      .select('id, email')
      .eq('nurture_step', step)
      .eq('converted', false)
      .lte('created_at', cutoff);

    if (!leads?.length) continue;

    const sendFn = (emailLib as any)[fn] as (email: string) => Promise<unknown>;

    for (const lead of leads) {
      try {
        await sendFn(lead.email);
        await db.from('leads')
          .update({ nurture_step: step + 1, last_email_sent_at: now.toISOString() })
          .eq('id', lead.id);
        sent++;
      } catch (err) {
        console.error(`[lead-nurture] step=${step} email=${lead.email}`, err);
        errors++;
      }
    }
  }

  console.log(`[lead-nurture] sent=${sent} errors=${errors}`);
  return json({ success: true, sent, errors });
};

export const POST: APIRoute = GET;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
