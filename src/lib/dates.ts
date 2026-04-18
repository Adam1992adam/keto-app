/**
 * Timezone-aware date helpers.
 * All functions take an IANA timezone string (e.g. "America/New_York", "Europe/Paris").
 * Falls back to UTC when timezone is empty or invalid.
 */

/** Returns the user's current local date as YYYY-MM-DD */
export function localDate(tz: string): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: tz || 'UTC' });
}

/**
 * Returns the UTC ISO timestamp for the START of today in the user's timezone.
 * Use for gte queries to scope DB results to the user's local calendar day.
 *
 * e.g. for UTC+5:30 at 20:00 local → returns "2026-04-18T18:30:00.000Z"
 */
export function localDayStartISO(tz: string): string {
  const today = localDate(tz);
  const now = new Date();
  const utcDate = now.toISOString().slice(0, 10);

  // sv-SE locale gives "YYYY-MM-DD HH:mm:ss" — stable for string slicing
  const localTime = now.toLocaleString('sv-SE', { timeZone: tz || 'UTC' }).slice(11, 16);
  const utcTime   = now.toISOString().slice(11, 16);
  const [lh, lm] = localTime.split(':').map(Number);
  const [uh, um] = utcTime.split(':').map(Number);
  let offsetMin = (lh * 60 + lm) - (uh * 60 + um);

  // Correct for day-boundary wrapping (handles UTC-12 through UTC+14)
  if (today > utcDate && offsetMin < 0) offsetMin += 1440;
  if (today < utcDate && offsetMin > 0) offsetMin -= 1440;

  const midnight = new Date(today + 'T00:00:00Z');
  midnight.setUTCMinutes(midnight.getUTCMinutes() - offsetMin);
  return midnight.toISOString();
}
