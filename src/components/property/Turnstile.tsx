"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Cloudflare Turnstile — the bot check in front of every form on the site.
 *
 * The live site's WPForms setup runs a captcha before it will email a
 * property; this is that check, rebuilt for this stack. It is one hook rather
 * than a component because a captcha is two halves that have to stay together:
 * the widget the visitor sees, and the "may this submit proceed?" question the
 * submit handler asks. `useTurnstileGate` returns both, so `ContactForm` and
 * `InquiryForm` each gain three lines and no logic of their own.
 *
 * **The token is verified on the server, never here.** A token that only the
 * browser has looked at proves nothing — anything can post a made-up string.
 * `take()` hands the token to the caller, which sends it with the submission
 * to `/api/contact`; that route checks it with the secret key and sends the
 * mail in the same request. There is no verify-only endpoint on purpose:
 * Cloudflare spends a token the first time it is checked, so verifying in one
 * request and sending in another would fail the second one every time.
 *
 * **Unconfigured means invisible.** With no `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * the hook renders nothing and `take()` returns `""` — "no check to make" —
 * so the forms behave exactly as they did before Turnstile existed. That is
 * what keeps a build without keys — a preview deploy, a fresh clone — from
 * shipping forms nobody can submit.
 */

/* ── The vendor's global, typed to the four calls this file makes ────────── */

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  /** Labels the form in Cloudflare's analytics — see `turnstileAction`. */
  action?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (element: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * `render=explicit` so the script does not go hunting the document for
 * `.cf-turnstile` elements of its own accord — the widget is mounted into a
 * ref'd div below, at the moment React has actually committed it.
 */
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Inlined at build time, like every `NEXT_PUBLIC_` value. A site key is public
 * by design (it sits in the page's HTML on every Turnstile deployment there
 * is); the secret is the half that must never come near this file.
 *
 * Because it is inlined, adding the key to an existing deployment needs a
 * rebuild — these routes are all statically generated.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Whether a site key is configured at all. */
export const isTurnstileConfigured = SITE_KEY.length > 0;

const CHALLENGE_MESSAGE = "Please complete the security check above.";
const UNAVAILABLE_MESSAGE =
  "The security check could not load. Please refresh the page and try again.";

/**
 * Loads the vendor script once per page, whatever the number of forms on it.
 *
 * The promise is module-level rather than per-hook precisely because two forms
 * can share a route, and two copies of the script would fight over the same
 * global.
 */
let scriptPromise: Promise<TurnstileApi | null> | null = null;

function loadTurnstile(): Promise<TurnstileApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);

  scriptPromise ??= new Promise<TurnstileApi | null>((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(window.turnstile ?? null));
    // A blocked or failed script resolves null rather than rejecting: the
    // caller's job is to tell the visitor the check is unavailable, and an
    // unhandled rejection would be a console error on top of that.
    script.addEventListener("error", () => resolve(null));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Turns a form heading into a Turnstile `action` — Cloudflare's per-form label
 * in its own dashboard, which is what makes "the wedding form is being
 * hammered" a thing you can see rather than guess at. It accepts
 * `[a-zA-Z0-9_-]` up to 32 characters, so anything else becomes a hyphen.
 */
export function turnstileAction(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 32)
    .replace(/-+$/, "");
}

export type TurnstileGate = {
  /** The widget and its error line. `null` when no site key is configured. */
  field: ReactNode;
  /**
   * The token to send with the submission: `""` when Turnstile is not
   * configured (there is no check to make), the solved token when there is
   * one, and `null` when the challenge is still outstanding — in which case
   * the gate has already put the reason on screen and the caller should
   * simply stop.
   */
  take: () => string | null;
  /** Issues a fresh challenge. A token is spent the moment the server checks
   * it, so anything that fails after `take()` needs a new one. */
  reset: () => void;
};

export function useTurnstileGate(action?: string): TurnstileGate {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  // The action is a literal at every call site; a ref keeps it out of the
  // effect's dependencies so a parent re-render can never re-mount the widget.
  const actionRef = useRef(action);

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isTurnstileConfigured) return;

    let cancelled = false;

    void loadTurnstile().then((api) => {
      if (cancelled) return;

      const container = containerRef.current;
      if (!api || !container) {
        setError(UNAVAILABLE_MESSAGE);
        return;
      }

      widgetIdRef.current = api.render(container, {
        sitekey: SITE_KEY,
        // The forms sit on `sand`/`sand-deep`, never on a dark band, so the
        // widget is pinned light rather than left on `auto` — `auto` follows
        // the visitor's OS theme and would drop a dark grey card into the
        // middle of a light form.
        theme: "light",
        action: actionRef.current,
        callback: (value) => {
          setToken(value);
          setError(null);
        },
        // A token is good for 300 seconds. A long form outlives that easily,
        // so the widget re-challenges itself and the stale token is dropped.
        "expired-callback": () => setToken(null),
        // Fires for a failed challenge and for the transient network trouble
        // the widget retries on its own. Dropping the token is the whole
        // response: a red line appearing under a form nobody has touched yet
        // is noise, and the widget shows its own error state anyway. The
        // message belongs on the submit the visitor actually makes, which
        // `take()` covers.
        "error-callback": () => setToken(null),
      });
    });

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = undefined;
      if (widgetId && window.turnstile) {
        // Removing a widget whose container React has already detached throws
        // inside the vendor script. There is nothing to recover — the DOM it
        // wanted is gone either way.
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  function reset() {
    setToken(null);
    const widgetId = widgetIdRef.current;
    if (widgetId && window.turnstile) {
      try {
        window.turnstile.reset(widgetId);
      } catch {
        /* already gone */
      }
    }
  }

  function take(): string | null {
    if (!isTurnstileConfigured) return "";

    if (!token) {
      // `current ?? …` because the script failing to load has already put a
      // more specific message on screen, and replacing it with "complete the
      // check" would point at a widget that never appeared.
      setError((current) => current ?? CHALLENGE_MESSAGE);
      return null;
    }

    setError(null);
    return token;
  }

  const field = isTurnstileConfigured ? (
    <div className="flex flex-col gap-2">
      {/* Cloudflare renders its own iframe in here; nothing of ours goes
          inside. `min-h` reserves the widget's 65px so the Send button does
          not jump down the page as the script arrives — the same reservation
          `BookingWidget` makes for the booking engine. */}
      <div ref={containerRef} className="min-h-[65px]" />
      {error ? (
        <p role="alert" className="text-[14px] leading-relaxed text-error">
          {error}
        </p>
      ) : null}
    </div>
  ) : null;

  return { field, take, reset };
}
