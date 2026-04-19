export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Accept "monday", "MONDAY", etc. → canonical ENUM value, or null. */
export function normalizeWeekday(value) {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  const cap = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return WEEKDAYS.includes(cap) ? cap : null;
}
