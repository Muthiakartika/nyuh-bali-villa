"use client";

import { useId, useState, type FormEvent } from "react";
import { SectionHeading, type HeadingLevel } from "@/components/ui/SectionHeading";
import { buttonClassName } from "@/components/ui/Button";
import { useFormDelivery } from "@/components/property/FormDelivery";
import type { PropertySlug } from "@/data/properties";

/**
 * One field on an inquiry form. Pages describe their form as data rather than
 * as markup, which is what lets the long Wedding form and the Explore Bali
 * booking form share this one component.
 */
export type InquiryField =
  | {
      kind: "text" | "email" | "date" | "tel" | "number";
      name: string;
      label: string;
      required?: boolean;
    }
  | { kind: "textarea"; name: string; label: string; required?: boolean }
  /** Single choice — "Yes / No", "Number of pax", cuisine. */
  | {
      kind: "radio";
      name: string;
      label: string;
      options: string[];
      required?: boolean;
    }
  /** Multiple choice — the wedding entertainment list. */
  | { kind: "checkbox"; name: string; label: string; options: string[]; required?: boolean };

type InquiryFormProps = {
  heading: string;
  /**
   * Which heading level the title takes. `h2` by default, because on the
   * wedding and tour pages this form is one band among several and the hero
   * already carries the page's `h1`.
   *
   * The three standalone form pages have no hero, so their form title *is* the
   * page title and must be the `h1` — a page with no `h1` gives a screen
   * reader nothing to announce it by. It changes the level only: the size and
   * the gold rule stay exactly as they are.
   */
  headingAs?: HeadingLevel;
  fields: InquiryField[];
  submitLabel?: string;
  /** Shown in place of the form once the property has been emailed. */
  confirmation?: string;
  /** Which resort's inbox this form's submissions belong to. Required rather
   * than defaulted: the standalone form pages sit at top-level slugs and the
   * retreat Inquiry appears on Ubud pages, so there is no path convention a
   * default could safely read the property from. */
  property: PropertySlug;
};

/**
 * The configurable inquiry form, used by `/ubud/wedding` ("Personalize your
 * Wedding", 20 fields) and `/seminyak/tour` (the tour booking form).
 *
 * **Same shape as `ContactForm`, and for the same reasons.** The live site
 * posts these to WPForms, behind a captcha, and WPForms emails the property;
 * here that is Cloudflare Turnstile and SendGrid, both handled by
 * `useFormDelivery`. Each form gets its own Turnstile action and its own email
 * subject, derived from its heading, so the wedding form and the tour form are
 * separable both in Cloudflare's dashboard and in the inbox they land in.
 *
 * **Field labels travel with the answers.** The email is built from the same
 * `InquiryField[]` the form renders, so a question reworded here is reworded
 * in the message the property reads — there is no second copy to update.
 *
 * It is a sibling of `ContactForm`, not a replacement for it: that component
 * is the Contact pages' own fixed five-field form and is left untouched. Both
 * use the same underlined-field treatment (a hairline that turns gold on
 * focus) so the two read as one form style across the site.
 */
export function InquiryForm({
  heading,
  headingAs = "h2",
  fields,
  submitLabel = "Send",
  confirmation = "Thank you for reaching out — we'll get back to you shortly.",
  property,
}: InquiryFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Namespaces every input id, so two forms on one page can never collide.
  const formId = useId();
  const delivery = useFormDelivery({ formName: heading, property });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const sent = await delivery.send(
      fields.map((field) => ({
        label: field.label,
        // `getAll`, not `get`: a checkbox group is several entries under one
        // name, and the wedding form's entertainment list is exactly that.
        value: data
          .getAll(field.name)
          .filter((entry): entry is string => typeof entry === "string")
          .join(", "),
      })),
    );

    if (sent) setIsSubmitted(true);
  }

  const title = <SectionHeading title={heading} as={headingAs} />;

  if (isSubmitted) {
    return (
      <div>
        {title}
        <p className="mt-8 text-[17px] leading-relaxed font-light text-text">
          {confirmation}
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
      {title}

      <div className="mt-9 flex flex-col gap-7">
        {fields.map((field) => {
          const fieldId = `${formId}-${field.name}`;
          const requiredMark = "required" in field && field.required ? (
            <span className="text-error"> *</span>
          ) : null;

          if (field.kind === "textarea") {
            return (
              <div key={field.name} className="flex flex-col gap-2">
                <label htmlFor={fieldId} className={labelClassName}>
                  {field.label}
                  {requiredMark}
                </label>
                <textarea
                  id={fieldId}
                  name={field.name}
                  required={field.required}
                  rows={5}
                  className={`${inputClassName} resize-y`}
                />
              </div>
            );
          }

          if (field.kind === "radio" || field.kind === "checkbox") {
            const isRadio = field.kind === "radio";

            return (
              // A fieldset/legend pair, not a bare label: these are groups of
              // controls, and the group's question is what a screen reader
              // needs to read before the individual options.
              <fieldset key={field.name} className="flex flex-col gap-2">
                <legend className={labelClassName}>
                  {field.label}
                  {requiredMark}
                </legend>
                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3 text-[16px] text-ink">
                  {field.options.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-start gap-2.5"
                    >
                      <input
                        type={isRadio ? "radio" : "checkbox"}
                        name={field.name}
                        value={option}
                        required={field.required}
                        className="mt-1 h-4 w-4 shrink-0 accent-primary"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }

          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={fieldId} className={labelClassName}>
                {field.label}
                {requiredMark}
              </label>
              <input
                id={fieldId}
                name={field.name}
                type={field.kind}
                required={field.required}
                className={inputClassName}
              />
            </div>
          );
        })}

        {/* The bot check and any delivery message, directly above the action
            they guard. The widget renders nothing at all when Turnstile has no
            site key configured. */}
        {delivery.field}

        {/* Shared button classes rather than a hand-rolled copy, so this can't
            drift away from the booking CTAs it sits alongside. `disabled` while
            the enquiry is in flight, so one press cannot become two. */}
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
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
