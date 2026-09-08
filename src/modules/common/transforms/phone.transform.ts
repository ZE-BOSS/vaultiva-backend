/**
 * Normalises a Nigerian phone number to E.164.
 *
 * Nobody types `+2349113378646`. They type `09113378646`, which is how the
 * number is printed on every bill and said out loud. `@IsPhoneNumber` rejects
 * that outright, so signing up with a phone number failed validation before it
 * reached the service — the user saw "Invalid phone number" for a number that is
 * perfectly valid.
 *
 * Accepted, all yielding `+2349113378646`:
 *
 *   09113378646        national, trunk prefix
 *   9113378646         national, no trunk prefix
 *   2349113378646      country code, no plus
 *   +234 911 337 8646  spaced or hyphenated
 *
 * Anything else is returned untouched so `@IsPhoneNumber` can reject it with the
 * normal message — this transform never decides validity, only formatting.
 */
const NIGERIA = '+234';

export function normaliseNigerianPhone(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  // Strip spaces, hyphens, brackets and dots; keep a leading plus.
  const cleaned = value.trim().replace(/[\s\-().]/g, '');
  if (!cleaned) return value;

  const digits = cleaned.replace(/^\+/, '');
  if (!/^\d+$/.test(digits)) return value;

  // Already +234…
  if (cleaned.startsWith('+234')) return cleaned;
  // 234… without the plus
  if (digits.startsWith('234') && digits.length === 13) return `+${digits}`;
  // 0XXXXXXXXXX — national format with the trunk prefix
  if (digits.startsWith('0') && digits.length === 11) return `${NIGERIA}${digits.slice(1)}`;
  // XXXXXXXXXX — national format without it
  if (digits.length === 10) return `${NIGERIA}${digits}`;

  // Some other country's number, or malformed: leave it for the validator.
  return cleaned.startsWith('+') ? cleaned : value;
}
