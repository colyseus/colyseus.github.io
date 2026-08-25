/**
 * Single source of truth for the "become a supporter / unlock" funnel.
 *
 * Today every unlock CTA points straight at the GitHub Sponsors funnel, since
 * there's no way yet to tell a supporter from a visitor on a static site.
 *
 * Next session, when the gated supporter area + auth ship, flip
 * SUPPORTERS_ENTRY_URL to the authenticated entry point that forks
 * supporters → vault, everyone else → funnel. Nothing else needs to change.
 */

/** Unlock / become-a-supporter action target (the funnel). */
export const SUPPORTERS_ENTRY_URL = "https://github.com/sponsors/endel";