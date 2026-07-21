"use client";

import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClassName } from "@/components/ui/Button";

/**
 * The "Please fill in the form below" contact form.
 *
 * The live site submits this to a real backend (WPForms, plus a captcha bot
 * check) that emails the property's reservations inbox. This project has no
 * server to receive that submission and no captcha keys to configure, so
 * `handleSubmit` doesn't send anywhere — it prevents the native page reload
 * and swaps the form for a confirmation, which is the part of the interaction
 * a visitor actually sees. A real deployment would replace `handleSubmit`'s
 * body with a call to a Server Action that sends the email.
 *
 * Redesign note: fields were boxed inputs with a hard outline on white. They're
 * now underlined — a single hairline that turns gold on focus. Boxes draw the
 * eye to the container; underlines draw it to the line you're writing on, and
 * on a warm surface they leave the form looking like stationery rather than
 * like a web form. No copy or field changed.
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
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
    <form onSubmit={handleSubmit}>
      {heading}

      <div className="mt-9 flex flex-col gap-7">
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

        {/* Uses the shared button classes rather than a hand-rolled copy, so
            the form's primary action can never drift away from the booking
            CTAs it sits alongside. */}
        <button type="submit" className={buttonClassName("solid", "md", "mt-2 w-fit")}>
          Send
        </button>
      </div>
    </form>
  );
}
