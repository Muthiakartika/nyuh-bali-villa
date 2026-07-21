"use client";

import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClassName } from "@/components/ui/Button";

/**
 * The "Please fill in the form below" contact form.
 *
 * The live site posts this to a WPForms backend that emails the property's
 * reservations inbox. This project has no server to receive it and no captcha
 * keys to configure, so `handleSubmit` prevents the native reload and swaps the
 * form for a confirmation — the part of the interaction a visitor actually
 * sees. A real deployment replaces the handler body with a Server Action.
 *
 * Fields use `{rounded.md}` (8px), which DESIGN.md documents for inputs, with
 * the flat hairline border of elevation level 0.
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  // Shared so the heading is identical in the form and in the confirmation
  // that replaces it in place.
  const heading = <SectionHeading title="Please fill in the form below" />;

  if (isSubmitted) {
    return (
      <div>
        {heading}
        <p className="mt-8 text-body text-slate">
          Thank you for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-body text-ink outline-none transition-colors duration-200 focus:border-accent-dark";
  const labelClassName = "text-caption font-medium text-slate";

  return (
    <form onSubmit={handleSubmit}>
      {heading}

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className={labelClassName}>
            Name <span className="text-error">*</span>
          </label>
          <input id="contact-name" type="text" required className={inputClassName} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClassName}>
            Email <span className="text-error">*</span>
          </label>
          <input id="contact-email" type="email" required className={inputClassName} />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={labelClassName}>
            Do you already have the reservation with us?
          </legend>
          <div className="mt-3 flex gap-8 text-body text-ink">
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
            Your Booking Number (optional)
          </label>
          <input id="contact-booking-number" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={labelClassName}>
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            className={`${inputClassName} resize-y`}
          />
        </div>

        {/* Uses the shared button classes rather than a hand-rolled copy, so the
            form's primary action can never drift from the booking CTAs. */}
        <button type="submit" className={buttonClassName("primary", "mt-2 w-fit")}>
          Send
        </button>
      </div>
    </form>
  );
}
