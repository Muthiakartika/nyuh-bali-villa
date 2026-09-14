import { NextResponse } from "next/server";
import { PROPERTY_SITES, type PropertySlug } from "@/data/properties";
import { verifyTurnstile } from "@/server/turnstile";
import { sendMail } from "@/server/sendgrid";
import { EMAIL_LOGOS } from "@/server/emailLogos";
import {
  isEmailAddress,
  parseCopyList,
  renderInquiryEmail,
  type SubmittedField,
} from "@/server/inquiryEmail";

/**
 * Every form on the site posts here: the two Contact pages, Wedding, the
 * Explore Bali tour booking, the three standalone form pages and the six
 * retreat programmes' Inquiry. One endpoint, because all of them do the same
 * two things in the same order — prove a human filled it in, then email the
 * property.
 *
 * **The order is the security property.** Turnstile is checked first and the
 * mail is sent in the same request, so a token cannot be spent proving
 * humanity to one endpoint and the message posted to another. If the check
 * fails, nothing is sent and nothing is logged beyond the rejection.
 *
 * **The recipient is never taken from the request.** The browser sends a
 * property slug and the server maps it to an address it already knows. A form
 * that could name its own recipient is an open relay with a nice typeface —
 * anyone could post the site's own SendGrid credit to arbitrary strangers.
 */

/** Where each property's enquiries land. The env vars exist so a staging
 * deploy can send to a developer instead of to the resort; unset, the real
 * published addresses are used, which is what the live site does — and those
 * two already sit on different domains (nyuhbalivillas.com for Seminyak,
 * ubudnyuhbali.com for Ubud). */
const RECIPIENTS: Record<PropertySlug, string | undefined> = {
  seminyak: process.env.CONTACT_TO_SEMINYAK,
  ubud: process.env.CONTACT_TO_UBUD,
};

function recipientFor(property: PropertySlug): string {
  return RECIPIENTS[property] || PROPERTY_SITES[property].contact.email;
}

/**
 * Who each property's enquiries are sent *as* — a separate question from who
 * receives them, and the one SendGrid is strict about: the From address has to
 * be an identity verified in SendGrid, and its domain is what SPF/DKIM are
 * checked against.
 *
 * Per property, because this business runs two domains. With both
 * authenticated in SendGrid, Ubud's mail should leave from an
 * `ubudnyuhbali.com` address rather than borrowing Seminyak's — a From domain
 * that does not match the brand the message is about is exactly the shape spam
 * filters score against. With only one domain authenticated, leave these empty
 * and set the single `SENDGRID_FROM_EMAIL` instead.
 */
const SENDERS: Record<PropertySlug, string | undefined> = {
  seminyak: process.env.SENDGRID_FROM_SEMINYAK,
  ubud: process.env.SENDGRID_FROM_UBUD,
};

function senderFor(property: PropertySlug): string | undefined {
  return SENDERS[property] || process.env.SENDGRID_FROM_EMAIL;
}

/** Caps, so a malformed or hostile payload cannot become a megabyte of email.
 * The wedding form is the largest real one at 20 fields. */
const MAX_FIELDS = 60;
const MAX_LABEL = 120;
const MAX_VALUE = 5000;

type ContactRequest = {
  token?: unknown;
  action?: unknown;
  property?: unknown;
  form?: unknown;
  page?: unknown;
  fields?: unknown;
};

function isPropertySlug(value: unknown): value is PropertySlug {
  return value === "seminyak" || value === "ubud";
}

/** Keeps only well-formed, non-empty entries and trims each to its cap. An
 * optional field left blank is dropped rather than emailed as an empty row. */
function cleanFields(input: unknown): SubmittedField[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (entry): entry is SubmittedField =>
        !!entry &&
        typeof entry === "object" &&
        typeof (entry as SubmittedField).label === "string" &&
        typeof (entry as SubmittedField).value === "string",
    )
    .map((entry) => ({
      label: entry.label.slice(0, MAX_LABEL).trim(),
      value: entry.value.slice(0, MAX_VALUE).trim(),
    }))
    .filter((entry) => entry.label.length > 0 && entry.value.length > 0)
    .slice(0, MAX_FIELDS);
}

/** The address the property should hit Reply to reach. Taken from the
 * submission's own fields rather than from a dedicated parameter, so there is
 * no field a caller can use to set a header we did not already validate. */
function findReplyTo(fields: SubmittedField[]): { email: string; name?: string } | undefined {
  const email = fields.find(
    (field) => /e-?mail/i.test(field.label) && isEmailAddress(field.value),
  )?.value;
  if (!email) return undefined;
  const name = fields.find((field) => /name/i.test(field.label))?.value;
  return name ? { email, name } : { email };
}

export async function POST(request: Request) {
  let body: ContactRequest;
  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  if (!isPropertySlug(body.property)) {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const fields = cleanFields(body.fields);
  if (fields.length === 0) {
    return NextResponse.json({ ok: false, reason: "empty" }, { status: 400 });
  }

  // Humanity first: nothing below this line runs for a failed challenge.
  const check = await verifyTurnstile(request, body.token, body.action);
  if (!check.ok) {
    const status = check.reason === "not-configured" ? 503 : 403;
    return NextResponse.json({ ok: false, reason: check.reason }, { status });
  }

  const property = body.property;
  const site = PROPERTY_SITES[property];
  const formName =
    typeof body.form === "string" && body.form.trim().length > 0
      ? body.form.slice(0, MAX_LABEL).trim()
      : "Website enquiry";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "";

  const from = senderFor(property);
  if (!from) {
    // Distinct from a missing API key: a key with no verified sender cannot
    // send at all, and SendGrid answers 403 rather than telling the visitor.
    console.error(
      `[contact] no sender configured for ${property} — set SENDGRID_FROM_${property.toUpperCase()} or SENDGRID_FROM_EMAIL.`,
    );
  }

  // Copied to whoever `CONTACT_CC` names — a comma-separated list, the same
  // for both properties. It exists for the period when someone needs to watch
  // real submissions arrive without taking them away from the resort, so it is
  // a **server** setting: the browser has no say in who gets a copy, for the
  // same reason it has no say in the recipient.
  const to = recipientFor(property);
  const copies = parseCopyList(process.env.CONTACT_CC, to);

  // "Nyuh Bali Seminyak" / "Nyuh Bali Ubud" — the same wording the site's own
  // social links use, so the name in the inbox is one the business already
  // calls itself rather than a bare "Seminyak". `SENDGRID_FROM_NAME` overrides
  // both at once, which is why it is left empty unless one name is wanted for
  // the two properties.
  const senderName = process.env.SENDGRID_FROM_NAME || `Nyuh Bali ${site.label}`;

  // The wordmark rides along inside the message rather than being fetched —
  // see emailLogos.ts. One id, referenced from the HTML as `cid:`.
  const logo = EMAIL_LOGOS[property];
  const logoCid = `nyuh-bali-${property}-logo`;

  const outcome = await sendMail({
    to: { email: to, name: site.label },
    cc: copies.map((email) => ({ email })),
    attachments: [
      {
        content: logo.data,
        filename: `nyuh-bali-${property}.png`,
        type: "image/png",
        contentId: logoCid,
      },
    ],
    from: { email: from ?? "no-reply@example.invalid", name: senderName },
    replyTo: findReplyTo(fields),
    subject: `${formName} — ${site.label}`,
    ...renderInquiryEmail({
      formName,
      propertyLabel: site.label,
      page,
      fields,
      // `Nyuh Bali <label>` again, matching the sender name above — so the
      // blocked-image fallback reads as the same brand the message is from.
      logo: {
        src: `cid:${logoCid}`,
        width: logo.width,
        height: logo.height,
        alt: senderName,
      },
    }),
  });

  if (!outcome.ok) {
    return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
  }

  if (outcome.delivered) {
    // One line per delivery, naming both ends. Business addresses only —
    // never the visitor's, which belongs in the message rather than in a log
    // the host retains. The sender is in it because the sender is the half
    // SendGrid refuses over: seeing which identity was actually used turns a
    // 403 from a guess into a reading.
    console.log(
      `[contact] sent "${formName}" (${property}) from ${senderName} <${from}> → ${to}` +
        (copies.length ? ` cc ${copies.length}` : ""),
    );
  }

  if (!outcome.delivered) {
    // No API key: the check passed and the form has behaved correctly, but
    // nobody received anything. The visitor still gets their confirmation —
    // the same thing this project did before SendGrid existed — while the log
    // and `delivered: false` say plainly that the message went nowhere.
    console.error(
      `[contact] SENDGRID_API_KEY is not set — "${formName}" (${property}) was NOT delivered.`,
    );
  }

  return NextResponse.json({ ok: true, delivered: outcome.delivered });
}
