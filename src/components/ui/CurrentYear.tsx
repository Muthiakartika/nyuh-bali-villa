"use client";

import { useSyncExternalStore } from "react";

/*
 * The footer's copyright year, resolved in the browser.
 *
 * **Why this isn't just `new Date().getFullYear()` in the footer.** Every route
 * here is statically generated, so anything a Server Component computes is
 * frozen into the HTML at *build* time. A plain call would therefore behave
 * exactly like the hardcoded "2026" it replaces — correct until the next 1
 * January, and then quietly wrong until somebody happens to redeploy. The year
 * has to be read on the visitor's machine.
 *
 * `useSyncExternalStore` is the tool for that, and it is the same one
 * `BookingSearchBar` uses for its check-in dates: it exists to describe a value
 * that legitimately differs between server and client, and it re-renders once
 * after hydration without a `setState` inside an effect (which React's lint
 * rules flag, fairly, as a cascading render).
 *
 * The server snapshot is the build year, so the pre-hydration HTML still shows
 * a sensible year to a crawler or to anyone with JavaScript off — it is never
 * blank, and it is only ever stale by the same amount the old hardcoded value
 * would have been.
 *
 * Unlike the dates case, `getSnapshot` may allocate freely here: it returns a
 * number, and `useSyncExternalStore` compares snapshots with `Object.is`, so a
 * primitive is stable by value. The referential-stability rule that forces
 * `BookingSearchBar` to memoise its object does not apply.
 */
const BUILD_YEAR = new Date().getFullYear();

// Nothing to subscribe to: the year cannot change in a way worth re-rendering
// for, so this returns a no-op unsubscribe and never notifies.
function subscribe() {
  return () => {};
}

function getClientYear() {
  return new Date().getFullYear();
}

function getServerYear() {
  return BUILD_YEAR;
}

/** The current year as plain text — renders no element of its own. */
export function CurrentYear() {
  return <>{useSyncExternalStore(subscribe, getClientYear, getServerYear)}</>;
}
