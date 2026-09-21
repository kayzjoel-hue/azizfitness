import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { publicEnquirySlugs, programmeBySlug } from '../../data/registry';

const allowedProgrammes = new Set<string>(publicEnquirySlugs);

const json = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Expected a JSON request.' }, 415);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Expected valid JSON.' }, 400);
  }
  const programme = typeof body.programmeSlug === 'string' ? body.programmeSlug.trim() : '';
  const coachSlug = typeof body.coachSlug === 'string' ? body.coachSlug.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const clientName = typeof body.clientName === 'string' ? body.clientName.trim() : '';
  const clientEmail = typeof body.clientEmail === 'string' ? body.clientEmail.trim() : '';
  const clientPhone = typeof body.clientPhone === 'string' ? body.clientPhone.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const consent = body.consent === true;
  const idempotencyKey = typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '';

  if (!allowedProgrammes.has(programme) || (programme === 'basketball-development' && !programmeBySlug(programme)) || !clientName || !clientEmail || !message || !consent) {
    return json({ error: 'Programme, name, email, message, and consent are required.' }, 400);
  }
  const coaches = await getCollection('coaches_public');
  const coach = coachSlug ? coaches.find(({ data }) => data.slug === coachSlug && data.is_published && !['SUSPENDED', 'ARCHIVED'].includes(data.verification_status)) : null;
  if (coachSlug && !coach) return json({ error: 'That coach is not available for enquiries.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }
  if (clientName.length > 120 || clientEmail.length > 320 || clientPhone.length > 40 || location.length > 120 || message.length > 4000 || idempotencyKey.length > 100) {
    return json({ error: 'One or more fields are too long.' }, 413);
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Enquiry service is not configured.' }, 503);
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
      body: JSON.stringify({
        programme_slug: programme,
        coach_slug: coach?.data.slug || null,
        location: location || null,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        message,
        idempotency_key: idempotencyKey || null,
        consent_version: 'v1',
      }),
    });
  } catch {
    return json({ error: 'Unable to reach the enquiry service right now.' }, 502);
  }

  if (!response.ok) {
    if (response.status === 409) return json({ error: 'This enquiry has already been submitted.' }, 409);
    return json({ error: 'Unable to submit enquiry right now.' }, 502);
  }
  return json({ message: 'Enquiry received. The AziziFitness team will be in touch.' });
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
