import "server-only";

/**
 * SendGrid delivery, over SendGrid's v3 REST API.
 *
 * **No `@sendgrid/mail` dependency.** That package is a thin wrapper around
 * the single POST below, and this repo pays for dependencies deliberately —
 * it hand-draws its icons rather than install an icon set, and it has already
 * lost a Vercel deployment to a dependency that installed fine locally (see
 * the `github:` note in CLAUDE.md). One `fetch` against a documented, stable
 * endpoint is less to go wrong and runs on any runtime.
 *
 * The API key is read per request rather than at module load, so rotating it
 * in the host's dashboard takes effect on the next request instead of the next
 * deploy.
 */

import { headerSafe } from "@/server/inquiryEmail";

const MAIL_SEND_URL = "https://api.sendgrid.com/v3/mail/send";

export type MailAddress = { email: string; name?: string };

/**
 * A file carried inside the message. `contentId` makes it an *inline* part the
 * HTML can reference as `src="cid:<contentId>"` rather than a paperclip
 * attachment — which is how an image reaches a reader whose client blocks
 * remote images, the default in Outlook and much of Gmail.
 */
export type MailAttachment = {
  /** Base64, without a `data:` prefix. */
  content: string;
  filename: string;
  type: string;
  contentId: string;
};

export type MailMessage = {
  to: MailAddress;
  attachments?: MailAttachment[];
  /** Extra recipients, already de-duplicated against `to` — see
   * `parseCopyList`. SendGrid rejects the whole send if one address appears
   * twice across to/cc/bcc. */
  cc?: MailAddress[];
  from: MailAddress;
  replyTo?: MailAddress;
  subject: string;
  text: string;
  html: string;
};

export type MailOutcome =
  | { ok: true; delivered: true }
  /** No API key configured — nothing was sent, and the caller decides what
   * that means. Kept distinct from a failure so a keyless preview deployment
   * is not reported as a broken one. */
  | { ok: true; delivered: false; reason: "not-configured" }
  | { ok: false; reason: "rejected" | "unreachable"; detail: string };

export async function sendMail(message: MailMessage): Promise<MailOutcome> {
  // Trimmed, because the usual way this variable arrives is a paste — into a
  // dashboard field or a .env line — and a trailing space or newline rides
  // along invisibly. Untrimmed it goes straight into an Authorization header
  // and SendGrid answers the same opaque 401 it gives a genuinely wrong key.
  const apiKey = process.env.SENDGRID_API_KEY?.trim();

  if (!apiKey) {
    return { ok: true, delivered: false, reason: "not-configured" };
  }

  // Every SendGrid key is `SG.<id>.<secret>`. Anything else is almost always
  // one of two paste mistakes — the key's *name* instead of the key, or a
  // truncated copy — so name that in the log rather than leave a 401 to be
  // read as "the key was revoked". Still attempted: a format assumption is
  // not a good enough reason to refuse to send.
  if (!apiKey.startsWith("SG.")) {
    console.error(
      "[sendgrid] SENDGRID_API_KEY does not look like a SendGrid key (expected it to start with \"SG.\"). Sending anyway.",
    );
  }

  const payload = {
    personalizations: [
      {
        to: [address(message.to)],
        ...(message.cc?.length ? { cc: message.cc.map(address) } : {}),
      },
    ],
    from: address(message.from),
    ...(message.replyTo ? { reply_to: address(message.replyTo) } : {}),
    subject: headerSafe(message.subject),
    // Order matters to SendGrid: text/plain must precede text/html, and the
    // last part is what a modern client displays.
    content: [
      { type: "text/plain", value: message.text },
      { type: "text/html", value: message.html },
    ],
    ...(message.attachments?.length
      ? {
          attachments: message.attachments.map((file) => ({
            content: file.content,
            filename: file.filename,
            type: file.type,
            // "inline" plus a content_id is what keeps this out of the
            // attachment list and inside the message body.
            disposition: "inline",
            content_id: file.contentId,
          })),
        }
      : {}),
  };

  let response: Response;
  try {
    response = await fetch(MAIL_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[sendgrid] request failed:", error);
    return { ok: false, reason: "unreachable", detail: String(error) };
  }

  // A successful send is 202 with an empty body. Anything else carries a JSON
  // `errors` array naming the cause, and the causes are nearly always
  // configuration rather than content: 401 is a bad key, and 403 with
  // "does not match a verified Sender Identity" is the one every new SendGrid
  // account hits — SENDGRID_FROM_EMAIL has to be an address or domain verified
  // in SendGrid itself, never the visitor's own address.
  if (response.status !== 202) {
    const detail = await response.text().catch(() => "");
    console.error(`[sendgrid] ${response.status}:`, detail.slice(0, 500));
    return { ok: false, reason: "rejected", detail: `${response.status} ${detail.slice(0, 200)}` };
  }

  return { ok: true, delivered: true };
}

function address({ email, name }: MailAddress) {
  return name ? { email, name: headerSafe(name) } : { email };
}
