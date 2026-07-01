// The date the current /now content was posted. Bump this whenever you
// rewrite page.mdx — there is no archive, so this is just the timestamp on
// "what you see". Format: YYYY-MM-DD.
export const POSTED = "2026-06-29";

// Display stamp shared by /now (entrance + corner) and the homepage nav.
// UTC so the day never shifts by timezone. Format: DD.MM.YYYY.
export const POSTED_STAMP = (() => {
  const d = new Date(POSTED);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getUTCFullYear()}`;
})();
