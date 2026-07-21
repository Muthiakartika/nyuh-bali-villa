"use client";

import { useState, type FormEvent } from "react";

/**
 * The "Please fill in the form below" contact form.
 *
 * The live site submits this to a real backend (WPForms, plus a
 * reCAPTCHA/hCaptcha bot check) that emails the property's reservations
 * inbox. This project has no server to receive that submission and no
 * captcha keys to configure, so `handleSubmit` doesn't send anywhere — it
 * just prevents the native page reload and swaps the form for a
 * confirmation message, which is the part of the interaction a visitor
 * actually sees. A real deployment would replace `handleSubmit`'s body with
 * a call to a Next.js Server Action (or an API route) that sends the email.
 *
 * Redesign note (see "Modern redesign" in CLAUDE.md): the fields used to be
 * capped at `max-w-xs` (320px), so they sat as a narrow ragged column inside
 * a much wider form — the single most obviously unfinished thing on the page.
 * They're now full width with a consistent rhythm. The hardcoded `#cccccc`
 * border was also replaced with the brand's own `ink` at low opacity, and
 * focus now moves the border to gold instead of relying on the browser's
 * default outline. Labels became small uppercase captions to match the
 * nav/button treatment used elsewhere. No copy changed.
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  // Shared so the heading looks identical in both the form and the
  // post-submit confirmation, which replaces it in place.
  const headingBlock = (
    <>
      <h2 className="font-heading text-[32px] font-extralight text-primary">
        Please fill in the form below
      </h2>
      <span aria-hidden className="mt-5 block h-px w-16 bg-primary/70" />
    </>
  );

  if (isSubmitted) {
    return (
      <div>
        {headingBlock}
        <p className="mt-8 text-lg font-light text-text">
          Thank you for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-[3px] border border-ink/15 bg-white px-4 py-3 text-base text-text transition-colors duration-200 outline-none focus:border-primary";
  const labelClassName =
    "text-xs font-semibold tracking-[2px] text-ink/70 uppercase";

  return (
    <form onSubmit={handleSubmit}>
      {headingBlock}

      <div className="mt-10 flex flex-col gap-7">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="contact-name" className={labelClassName}>
            Name <span className="text-error">*</span>
          </label>
          <input id="contact-name" type="text" required className={inputClassName} />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="contact-email" className={labelClassName}>
            Email <span className="text-error">*</span>
          </label>
          <input id="contact-email" type="email" required className={inputClassName} />
        </div>

        <fieldset className="flex flex-col gap-2.5">
          <legend className={labelClassName}>
            Do you already have the reservation with us?
          </legend>
          <div className="mt-1 flex gap-8 text-base text-text">
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

        <div className="flex flex-col gap-2.5">
          <label htmlFor="contact-booking-number" className={labelClassName}>
            Your Booking Number (optional)
          </label>
          <input id="contact-booking-number" type="text" className={inputClassName} />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="contact-message" className={labelClassName}>
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={6}
            className={`${inputClassName} resize-y`}
          />
        </div>

        {/* Same uppercase/tracking treatment as the booking CTA on the About
            pages, so the two primary actions on the site look related. */}
        <button
          type="submit"
          className="mt-2 w-fit rounded-[3px] bg-ink px-8 py-3.5 text-sm tracking-[2px] text-white uppercase transition-opacity duration-300 hover:opacity-90"
        >
          Send
        </button>
      </div>
    </form>
  );
}
