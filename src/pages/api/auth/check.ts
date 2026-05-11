import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return new Response(null, { status: 401 });
  return new Response(null, { status: 200 });
};
