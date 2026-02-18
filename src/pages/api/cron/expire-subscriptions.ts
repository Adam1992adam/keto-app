import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ request, locals }) => {
try {
// 1. جلب المتغيرات من نظام كلوفلار Runtime
// @ts-ignore
const env = locals.runtime?.env;

} catch (error: any) {
return new Response(JSON.stringify({
success: false,
error: error.message
}), { status: 500, headers: { 'Content-Type': 'application/json' } });
}
};

export const POST: APIRoute = GET;