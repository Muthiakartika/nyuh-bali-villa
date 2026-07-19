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
 * `useState` here holds two purely client-side things — whether the
 * "reservation" radio is Yes/No-relevant enough to matter, and whether the
 * form has been submitted — neither of which has any reason to live on a
 * server, so this is a Client Component.
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-[32px] font-extralight text-primary">
          Please fill in the form below
        </h2>
        <p className="text-base text-text">
          Thank you for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClassName =
    "w-full max-w-xs rounded-[2px] border border-[#cccccc] bg-white px-[10px] py-[6px] text-base";
  const labelClassName = "text-base font-bold text-text";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="font-heading text-[32px] font-extralight text-primary">
        Please fill in the form below
      </h2>

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
        <div className="flex gap-6 text-base text-text">
          <label className="flex items-center gap-2">
            <input type="radio" name="hasReservation" value="Yes" className="accent-primary" />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="hasReservation" value="No" className="accent-primary" />
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
          className="w-full rounded-[2px] border border-[#cccccc] bg-white px-[10px] py-[6px] text-base"
        />
      </div>

      <button
        type="submit"
        className="w-fit bg-ink px-[15px] py-[10px] text-base text-white"
      >
        Send
      </button>
    </form>
  );
}
