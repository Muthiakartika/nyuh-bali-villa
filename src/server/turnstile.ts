import "server-only";

/**
 * The server half of the Cloudflare Turnstile check — see
 * `src/components/property/Turnstile.tsx` for the widget it verifies.
 *
 * A captcha verified in the browser is not a captcha: the widget hands the
 * page a token, and anything at all can post a string that looks like one. The
 * token only means something once Cloudflare has been asked about it with the
 * **secret** key, which lives here and only here — `server-only` makes the
 * mistake of importing this from a component a build error rather than a leak.
 *
 * **There is deliberately no `/api/turnstile/verify` route.** Cloudflare spends
 * a token the first time it is checked, so a verify-then-send pair would burn
 * the token on the first request and fail the second with
 * `timeout-or-duplicate`. Verification happens inside the one request that
 * also sends the mail — see `src/app/api/contact/route.ts`.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  action?: string;
  hostname?: string;
};

export type TurnstileOutcome =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "missing-token" | "failed" | "unreachable" };

/**
 * The address Cloudflare should expect the challenge to have been solved from.
 *
 * Optional in the API, and skipped rather than guessed: behind a proxy chain
 * the header can be absent or loopback, and sending a wrong address turns a
 * legitimate submission into a rejected one.
 */
function solverAddress(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim();
  if (!address || address === "::1" || address === "127.0.0.1") return null;
  return address;
}

export async function verifyTurnstile(
  request: Request,
  token: unknown,
  action: unknown,
): Promise<TurnstileOutcome> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // The widget cannot appear without a site key, so reaching this means the
    // two keys disagree about whether Turnstile is switched on — half a
    // deployment. Refusing is the only safe answer: passing would let anyone
    // turn the check off by deleting one environment variable.
    console.error(
      "[turnstile] TURNSTILE_SECRET_KEY is not set; refusing to verify.",
    );
    return { ok: false, reason: "not-configured" };
  }

  if (typeof token !== "string" || token.length === 0) {
    return { ok: false, reason: "missing-token" };
  }

  // Cloudflare accepts form-encoded or JSON; form-encoded is what their own
  // documentation leads with and what their examples are written against.
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  const address = solverAddress(request);
  if (address) body.append("remoteip", address);

  let result: SiteverifyResponse;
  try {
    const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
    result = (await response.json()) as SiteverifyResponse;
  } catch (error) {
    console.error("[turnstile] siteverify request failed:", error);
    return { ok: false, reason: "unreachable" };
  }

  if (result.success !== true) {
    // The codes name the misconfiguration precisely (`invalid-input-secret`,
    // `timeout-or-duplicate`, …) and belong in the server log, not in a
    // response — telling a caller which key is wrong is telling an attacker.
    console.error("[turnstile] rejected:", result["error-codes"]);
    return { ok: false, reason: "failed" };
  }

  // A token solved for one form must not be replayed against another, so the
  // action the browser claims has to match the one Cloudflare recorded when
  // the challenge was issued.
  //
  // Checked only when Cloudflare actually reports an action. It omits the
  // field entirely for tokens minted by the published testing keys — which is
  // what .env.local runs on — and comparing a claimed action against an absent
  // one would turn every local submission into a rejection. A token issued by
  // a real widget always carries the action it was rendered with, so the
  // protection is intact wherever it can apply.
  if (
    typeof action === "string" &&
    action.length > 0 &&
    typeof result.action === "string" &&
    result.action.length > 0 &&
    result.action !== action
  ) {
    console.error(
      `[turnstile] action mismatch: expected ${action}, got ${result.action}`,
    );
    return { ok: false, reason: "failed" };
  }

  return { ok: true };
}
