/**
 * Turns a submitted form into the two bodies SendGrid wants — plain text and
 * HTML — and nothing else. No environment, no network, no `server-only`: it is
 * a pure function precisely so it can be run and checked on its own, which
 * matters here because the one thing it must never get wrong is invisible in
 * the browser. Every value in these bodies was typed by a stranger.
 */

/** One answer, as it will appear in the email. */
export type SubmittedField = { label: string; value: string };

export type InquiryEmail = { text: string; html: string };

/**
 * A single header value must never carry a line break — that is how a header
 * injection turns one recipient into several. Everything that reaches a header
 * (the subject, either display name) goes through this first.
 */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Deliberately conservative: anything carrying a space, a comma, a semicolon,
 * an angle bracket or a line break is not an address this will put in a
 * header. It guards the one header value a visitor controls — Reply-To, taken
 * from the form's own email field.
 */
export function isEmailAddress(value: string): boolean {
  return /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]{2,}$/.test(value);
}

/**
 * The comma-separated extra recipients from `CONTACT_CC`, cleaned into a list
 * SendGrid will accept.
 *
 * Two rules, both of which SendGrid enforces by rejecting the whole send with
 * a 400 rather than by ignoring the bad entry: **an address may appear only
 * once across to/cc/bcc in one personalization**, so anything equal to the
 * primary recipient is dropped, as is any repeat within the list itself; and
 * every entry must be a real address, so anything `isEmailAddress` refuses is
 * dropped rather than passed on. Comparison is case-insensitive — a mailbox
 * that differs only in case is the same mailbox to every provider that
 * matters, and to SendGrid's duplicate check.
 */
export function parseCopyList(raw: string | undefined, primary: string): string[] {
  if (!raw) return [];

  const seen = new Set([primary.trim().toLowerCase()]);
  const copies: string[] = [];

  for (const part of raw.split(",")) {
    const address = part.trim();
    if (!isEmailAddress(address)) continue;
    const key = address.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    copies.push(address);
  }

  return copies;
}

/**
 * The email is HTML that a visitor's text lands inside, so their text is
 * escaped before it gets there. `&` first, or it would double-escape the
 * entities the later replacements introduce.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The wordmark at the head of the message. Omitted renders the header
 * without it, which changes nothing else about the layout. */
export type EmailLogo = {
  src: string;
  width: number;
  height: number;
  /** What the header reads as when images are blocked — which is the default
   * in Outlook and in plenty of Gmail accounts, so this is not a fallback so
   * much as the other half of the design. */
  alt: string;
};

export function renderInquiryEmail({
  formName,
  propertyLabel,
  page,
  fields,
  logo,
}: {
  formName: string;
  propertyLabel: string;
  page: string;
  fields: SubmittedField[];
  logo?: EmailLogo;
}): InquiryEmail {
  return {
    text: plainBody(fields, formName, propertyLabel, page),
    html: htmlBody(fields, formName, propertyLabel, page, logo),
  };
}

function plainBody(
  fields: SubmittedField[],
  formName: string,
  propertyLabel: string,
  page: string,
): string {
  const lines = fields.map((field) => `${field.label}:\n${field.value}`);
  const footer = page ? `\n\nSubmitted from ${page}` : "";
  return `${formName} — ${propertyLabel}\n\n${lines.join("\n\n")}${footer}\n`;
}

function htmlBody(
  fields: SubmittedField[],
  formName: string,
  propertyLabel: string,
  page: string,
  logo?: EmailLogo,
): string {
  // Inline styles only, and a table for the rows: an email client is not a
  // browser, and plenty of them strip a <style> block outright. The palette is
  // the site's own (ink #261e13, gold #c7a259, the accessible gold #81693a for
  // the labels, sand #faf8f2) so the notification looks like it came from the
  // brand it is about. `white-space:pre-wrap` keeps the paragraph breaks a
  // guest typed into the message box.
  const rows = fields
    .map(
      (field) => `
      <tr>
        <td style="padding:12px 0 4px;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#81693a;">${escapeHtml(field.label)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 12px;border-bottom:1px solid #e8e0cf;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#261e13;white-space:pre-wrap;word-break:break-word;">${escapeHtml(field.value)}</td>
      </tr>`,
    )
    .join("");

  const footer = page
    ? `<p style="margin:24px 0 0;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#7a7a7a;">Submitted from ${escapeHtml(page)}</p>`
    : "";

  // The wordmark sits **on the dark band**, centred, with the eyebrow and
  // title centred under it — one centred block rather than a centred logo over
  // left-aligned type.
  //
  // It works there because of which artwork is used: the site's own
  // per-property mark, whose tagline is set in cream for exactly this
  // background. The library's other PNGs put that tagline in a dark olive that
  // vanishes against `ink` — compositing them over #261e13 and looking is what
  // settled it. See `emailLogos.ts` for why the file travels with the message
  // instead of being linked.
  //
  // `width`/`height` as attributes *and* in the style: Outlook reads the
  // attributes, everything else the style, and a missing pair makes Outlook
  // invent a size. `align="center"` on the cell is likewise for Outlook, which
  // does not honour `margin:0 auto`. The `color`/`font` style the alt text, so
  // a blocked image leaves a line of gold type rather than a broken box.
  const logoBlock = logo
    ? `<img src="${escapeHtml(logo.src)}" width="${logo.width}" height="${logo.height}" alt="${escapeHtml(logo.alt)}" style="display:block;margin:0 auto 18px;width:${logo.width}px;height:${logo.height}px;border:0;outline:none;text-decoration:none;color:#c7a259;font:600 14px/1.4 Arial,Helvetica,sans-serif;" />
        `
    : "";

  // A real `<head>`, and every line of it earns its place:
  //
  // - **viewport** — without it a phone mail client lays the message out at a
  //   980px desktop width and scales the whole thing down, which is how a
  //   notification ends up unreadable on the device it is most often read on.
  // - **charset** — the body carries em dashes and Indonesian copy.
  // - **x-apple-disable-message-reformatting** — stops iOS Mail resizing type
  //   on its own after the viewport has already settled it.
  // - **color-scheme: light** — this one guards the logo. The wordmark's
  //   background is *baked in* at #261e13 (see emailLogos.ts), so a client
  //   that force-inverts for dark mode would lighten the band around it and
  //   leave the logo sitting in a dark rectangle. Declaring the message
  //   light-only is what stops Apple Mail and Outlook doing that.
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>:root{color-scheme:light;supported-color-schemes:light;}</style>
</head>
<body style="margin:0;padding:24px;background:#faf8f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;">
    <tr>
      <td align="center" style="padding:30px 28px 26px;background:#261e13;text-align:center;">
        ${logoBlock}<p style="margin:0;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#c7a259;">${escapeHtml(propertyLabel)}</p>
        <p style="margin:6px 0 0;font:300 22px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;">${escapeHtml(formName)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${rows}</table>
        ${footer}
      </td>
    </tr>
  </table>
</body></html>`;
}
