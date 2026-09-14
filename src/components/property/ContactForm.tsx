"use client";

import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClassName } from "@/components/ui/Button";
import { useFormDelivery } from "@/components/property/FormDelivery";
import type { PropertySlug } from "@/data/properties";

/** The five labels, written once: the visible `<label>` and the row that
 * reaches the property's inbox are the same string by construction, so an
 * email can never disagree with the form it came from. */
const LABELS = {
  name: "Name",
  email: "Email",
  hasReservation: "Do you already have the reservation with us?",
  bookingNumber: "Your Booking Number",
  message: "Message",
} as const;

/**
 * The "Please fill in the form below" contact form.
 *
 * The live site submits this to WPForms behind a captcha, and WPForms emails
 * the property's reservations inbox. **Both halves are real here**: Cloudflare
 * Turnstile, and SendGrid — `useFormDelivery` posts to `/api/contact`, which
 * checks the token and sends the mail in one request. The confirmation appears
 * only once that request has succeeded.
 *
 * Redesign note: fields were boxed inputs with a hard outline on white. They're
 * now underlined — a single hairline that turns gold on focus. Boxes draw the
 * eye to the container; underlines draw it to the line you're writing on, and
 * on a warm surface they leave the form looking like stationery rather than
 * like a web form. No copy or field changed.
 */
export function ContactForm({ property }: { property: PropertySlug }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const delivery = useFormDelivery({ formName: "Contact Us", property });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = data.get(name);
      return typeof entry === "string" ? entry : "";
    };

    const sent = await delivery.send([
      { label: LABELS.name, value: value("name") },
      { label: LABELS.email, value: value("email") },
      { label: LABELS.hasReservation, value: value("hasReservation") },
      { label: LABELS.bookingNumber, value: value("bookingNumber") },
      { label: LABELS.message, value: value("message") },
    ]);

    if (sent) setIsSubmitted(true);
  }

  // Shared so the heading is identical in the form and in the confirmation
  // that replaces it in place.
  const heading = (
    <SectionHeading title="Please fill in the form below" />
  );

  if (isSubmitted) {
    return (
      <div>
        {heading}
        <p className="mt-8 text-[17px] leading-relaxed font-light text-text">
          Thank you for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClassName =
    "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-[16px] text-ink transition-colors duration-300 outline-none focus:border-primary";
  const labelClassName = "text-eyebrow font-body text-primary-deep uppercase";

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      {heading}

      <div className="mt-9 flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className={labelClassName}>
            {LABELS.name} <span className="text-error">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClassName}>
            {LABELS.email} <span className="text-error">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={labelClassName}>{LABELS.hasReservation}</legend>
          <div className="mt-3 flex gap-8 text-[16px] text-ink">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="hasReservation"
                value="Yes"
                className="h-4 w-4 accent-primary"
              />
              Yes
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="hasReservation"
                value="No"
                className="h-4 w-4 accent-primary"
              />
              No
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-booking-number" className={labelClassName}>
            {LABELS.bookingNumber} (optional)
          </label>
          <input
            id="contact-booking-number"
            name="bookingNumber"
            type="text"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={labelClassName}>
            {LABELS.message} <span className="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            className={`${inputClassName} resize-y`}
          />
        </div>

        {/* The bot check and any delivery message, directly above the action
            they guard. The widget renders nothing at all when Turnstile has no
            site key configured. */}
        {delivery.field}

        {/* Uses the shared button classes rather than a hand-rolled copy, so
            the form's primary action can never drift away from the booking
            CTAs it sits alongside.

            `disabled:opacity-60` is the one place opacity is the right answer:
            the CTA's hover was deliberately moved off opacity because a dimmed
            button reads as disabled — which is exactly what it is while the
            enquiry is in flight. */}
        <button
          type="submit"
          disabled={delivery.isSending}
          aria-busy={delivery.isSending}
          className={buttonClassName(
            "solid",
            "md",
            "mt-2 w-fit disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          Send
        </button>
      </div>
    </form>
  );
}
