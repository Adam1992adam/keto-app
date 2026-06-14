// POST /api/auth/delete-account
// DISABLED — only admins can delete accounts via /api/admin/delete-user
import type { APIRoute } from 'astro';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async () => {
  return json({ error: 'Account deletion is disabled. Contact support.' }, 403);
};
