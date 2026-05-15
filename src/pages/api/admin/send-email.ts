import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  try {
    const { to, subject, htmlBody, audience } = await request.json() as {
      to?: string | string[];
      subject?: string;
      htmlBody?: string;
      audience?: 'all_leads' | 'unconverted_leads' | 'active_subscribers';
    };

    if (!subject?.trim())   return json({ error: 'Subject is required' }, 400);
    if (!htmlBody?.trim())  return json({ error: 'Body is required' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL  || env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_KEY   = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || env.RESEND_API_KEY;

    if (!RESEND_KEY) return json({ error: 'RESEND_API_KEY not configured' }, 500);

    const FROM    = import.meta.env.EMAIL_FROM  || 'Keto Journey <onboarding@resend.dev>';
    const APP_URL = import.meta.env.PUBLIC_APP_URL || 'https://ketojourney.fun';

    let recipients: string[] = [];

    if (audience) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(SUPABASE_URL, SERVICE_KEY);

      if (audience === 'all_leads') {
        const { data } = await db.from('leads').select('email');
        recipients = (data || []).map((l: any) => l.email).filter(Boolean);
      } else if (audience === 'unconverted_leads') {
        const { data } = await db.from('leads').select('email').eq('converted', false);
        recipients = (data || []).map((l: any) => l.email).filter(Boolean);
      } else if (audience === 'active_subscribers') {
        const { data } = await db.from('profiles').select('email').eq('subscription_status', 'active');
        recipients = (data || []).map((p: any) => p.email).filter(Boolean);
      }
    } else if (to) {
      recipients = Array.isArray(to) ? to : [to];
    }

    if (!recipients.length) return json({ error: 'No recipients found' }, 400);

    const wrappedHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Keto Journey</title></head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding-bottom:20px;text-align:center;">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
    <td style="background:#FF5C7A;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;"><span style="font-size:18px;line-height:36px;">🌿</span></td>
    <td style="padding-left:10px;vertical-align:middle;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#16110F;letter-spacing:-.4px;">Keto Journey</span></td>
  </tr></table>
</td></tr>
<tr><td style="background:#FFFFFF;border:1px solid #E5DED2;border-radius:20px;padding:36px 32px;">${htmlBody}</td></tr>
<tr><td style="padding:24px 0 8px;text-align:center;">
  <p style="margin:0;font-size:12px;color:#8A8077;">
    © Keto Journey &nbsp;·&nbsp;
    <a href="${APP_URL}" style="color:#FF5C7A;text-decoration:none;">ketojourney.fun</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_KEY);

    const CHUNK = 100;
    let sent = 0;
    let errors = 0;

    for (let i = 0; i < recipients.length; i += CHUNK) {
      const chunk = recipients.slice(i, i + CHUNK);
      try {
        const messages = chunk.map(email => ({
          from: FROM,
          to: email,
          subject: subject.trim(),
          html: wrappedHtml,
        }));
        const result = await resend.batch.send(messages);
        const batchErrors = (result.data?.data || []).filter((r: any) => r.error).length;
        sent   += chunk.length - batchErrors;
        errors += batchErrors;
      } catch (err) {
        console.error('[admin/send-email] batch chunk', i, err);
        errors += chunk.length;
      }
    }

    return json({ success: true, sent, errors, total: recipients.length });
  } catch (err) {
    console.error('[admin/send-email]', err);
    return json({ error: 'Something went wrong' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
