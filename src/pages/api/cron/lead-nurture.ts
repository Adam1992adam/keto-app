// GET /api/cron/lead-nurture
// Runs daily — sends the next nurture email to leads who are due.
// Email series is configured in the lead_email_series table (editable via /admin/email-series).
// Fallback: if the table is empty, uses hardcoded functions from email.ts.

import type { APIRoute } from 'astro';

const APP_URL = process.env.PUBLIC_APP_URL || import.meta.env.PUBLIC_APP_URL || 'https://ketojourney.fun';

const NURTURE_LAYOUT = (content: string, preheader = '') => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Keto Journey</title></head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding-bottom:20px;text-align:center;">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
    <td style="background:#FF5C7A;border-radius:10px;width:32px;height:32px;text-align:center;vertical-align:middle;"><span style="font-size:16px;line-height:32px;">🌿</span></td>
    <td style="padding-left:9px;vertical-align:middle;"><span style="font-family:Georgia,serif;font-size:19px;font-weight:900;color:#16110F;letter-spacing:-.4px;">Keto Journey</span></td>
  </tr></table>
</td></tr>
<tr><td style="background:#FFFFFF;border:1px solid #E5DED2;border-radius:20px;padding:36px 32px;">${content}</td></tr>
<tr><td style="padding:20px 0 8px;text-align:center;">
  <p style="margin:0;font-size:11px;color:#8A8077;">You requested our free recipe book · <a href="${APP_URL}/free-book" style="color:#FF5C7A;text-decoration:none;">Unsubscribe</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

// Hardcoded fallback steps (used only if DB table is empty)
const FALLBACK_STEPS: Array<{ minDays: number; fn: string }> = [
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

  const { data: series } = await db
    .from('lead_email_series')
    .select('*')
    .eq('is_active', true)
    .order('step_order');

  const now = new Date();
  let sent = 0;
  let errors = 0;

  if (series && series.length > 0) {
    // DB-driven mode: each row is one step (0-indexed by step_order)
    for (let idx = 0; idx < series.length; idx++) {
      const row = series[idx];
      const cutoff = new Date(now.getTime() - row.delay_days * 86400000).toISOString();

      const { data: leads } = await db
        .from('leads')
        .select('id, email')
        .eq('nurture_step', idx)
        .eq('converted', false)
        .lte('created_at', cutoff);

      if (!leads?.length) continue;

      const { Resend } = await import('resend');
      const resendKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || env.RESEND_API_KEY;
      const FROM = process.env.EMAIL_FROM || import.meta.env.EMAIL_FROM || env.EMAIL_FROM || 'Keto Journey <onboarding@resend.dev>';
      const resend = new Resend(resendKey);

      const htmlBody = (row.html_body || '').replace(/\{\{APP_URL\}\}/g, APP_URL);
      const html = NURTURE_LAYOUT(htmlBody, row.preheader || '');

      for (const lead of leads) {
        try {
          await resend.emails.send({
            from: FROM,
            to: lead.email,
            subject: row.subject,
            html,
            headers: {
              'List-Unsubscribe': `<${APP_URL}/free-book>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          });
          await db.from('leads')
            .update({ nurture_step: idx + 1, last_email_sent_at: now.toISOString() })
            .eq('id', lead.id);
          sent++;
        } catch (err) {
          console.error(`[lead-nurture] step=${idx} email=${lead.email}`, err);
          errors++;
        }
      }
    }
  } else {
    // Fallback: use hardcoded email functions
    const emailLib = await import('../../../lib/email');
    for (let step = 0; step < FALLBACK_STEPS.length; step++) {
      const { minDays, fn } = FALLBACK_STEPS[step];
      const cutoff = new Date(now.getTime() - minDays * 86400000).toISOString();
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
          console.error(`[lead-nurture] fallback step=${step} email=${lead.email}`, err);
          errors++;
        }
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
