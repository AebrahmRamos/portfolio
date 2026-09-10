import { useEffect } from 'react';

const SITE = 'Aebrahm Ramos';

/**
 * Sets document.title for a route.
 *
 * Every route that can be reached by client-side navigation has to set its own
 * title. The post and series pages used to set one and then reset it to the
 * bare site name on unmount, while the blog index and the portfolio set none at
 * all, so navigating from a post back to /blog left the tab reading
 * "Aebrahm Ramos" instead of "Writing | Aebrahm Ramos". A hard load hid it,
 * because the Worker injects the right <title> server-side; only in-session
 * navigation showed the wrong one, in the tab, in history and in bookmarks.
 *
 * There is deliberately no cleanup: resetting on unmount is what produced the
 * stale title. The next route sets its own.
 *
 * @param {string|null|undefined} title Page title without the site suffix.
 *   Falsy is ignored, so a route can wait for data before naming itself.
 * @param {{ suffix?: boolean }} [options] Pass `suffix: false` for a title that
 *   already reads as a full document title.
 */
export function useDocumentTitle(title, { suffix = true } = {}) {
  useEffect(() => {
    if (!title) return;
    document.title = suffix ? `${title} | ${SITE}` : title;
  }, [title, suffix]);
}

export default useDocumentTitle;
