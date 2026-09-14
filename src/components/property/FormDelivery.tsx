"use client";

import { useState, type ReactNode } from "react";
import { turnstileAction, useTurnstileGate } from "@/components/property/Turnstile";
import type { PropertySlug } from "@/data/properties";

/**
 * Everything the site's two form components do between "the visitor pressed
 * Send" and "show the confirmation": hold the Turnstile token, post the
 * submission to `/api/contact`, and say what went wrong when something does.
 *
 * It exists because `ContactForm` and `InquiryForm` differ in exactly one
 * respect — which fields they collect — and were otherwise about to grow two
 * copies of the same submit logic, error copy and pending state. The seam is
 * `send(fields)`: each form builds its own label/value list, and nothing else
 * about delivery lives in either file.
 *
 * **The confirmation now means something.** Before SendGrid these forms swapped
 * themselves for a thank-you the moment they were submitted, whatever happened
 * next, because nothing happened next. `send` resolves `false` on every
 * failure, and the form stays on screen with its answers intact — a visitor is
 * never told their enquiry was received when it was not.
 */

/** One answer, as it will appear in the email. */
export type SubmittedField = { label: string; value: string };

export type FormDelivery = {
  /** The Turnstile widget and any message about the submission. Render it
   * directly above the submit button. */
  field: ReactNode;
  /** True while the request is in flight — the button's `disabled` state, so
   * one press cannot become two enquiries. */
  isSending: boolean;
  /** Resolves true only when the property has actually been emailed. */
  send: (fields: SubmittedField[]) => Promise<boolean>;
};

const CHALLENGE_FAILED_MESSAGE =
  "That security check did not go through. Please try again.";
const SEND_FAILED_MESSAGE =
  "We could not send your message just now. Please try again in a moment.";

export function useFormDelivery({
  formName,
  property,
}: {
  /** The form's own heading. Used as the email's subject and, slugified, as
   * the Turnstile action — so Cloudflare's dashboard separates the wedding
   * form from the tour form instead of reporting one undifferentiated total. */
  formName: string;
  /** Which resort's inbox this belongs to. The server maps the slug to an
   * address it already knows; a form that could name its own recipient would
   * be an open relay. */
  property: PropertySlug;
}): FormDelivery {
  const action = turnstileAction(formName);
  const gate = useTurnstileGate(action);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function send(fields: SubmittedField[]): Promise<boolean> {
    setError(null);

    const token = gate.take();
    // `null` means the challenge is outstanding and the gate has already said
    // so on screen. `""` means Turnstile is not configured at all, which the
    // server understands as "there is nothing to check".
    if (token === null) return false;

    setIsSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action,
          property,
          form: formName,
          page: window.location.pathname,
          fields,
        }),
      });

      if (!response.ok) {
        // A checked token is a spent token, so whatever went wrong, the next
        // attempt needs a new challenge.
        gate.reset();
        setError(
          response.status === 403 ? CHALLENGE_FAILED_MESSAGE : SEND_FAILED_MESSAGE,
        );
        return false;
      }

      return true;
    } catch {
      gate.reset();
      setError(SEND_FAILED_MESSAGE);
      return false;
    } finally {
      setIsSending(false);
    }
  }

  const field = (
    <>
      {gate.field}
      {error ? (
        <p role="alert" className="text-[14px] leading-relaxed text-error">
          {error}
        </p>
      ) : null}
    </>
  );

  return { field, isSending, send };
}
