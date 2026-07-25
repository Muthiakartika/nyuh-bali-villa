"use client";

import { useId, useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClassName } from "@/components/ui/Button";

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
  | { kind: "checkbox"; name: string; label: string; options: string[] };

type InquiryFormProps = {
  heading: string;
  fields: InquiryField[];
  submitLabel?: string;
  /** Shown in place of the form once it has been "sent". */
  confirmation?: string;
};

/**
 * The configurable inquiry form, used by `/ubud/wedding` ("Personalize your
 * Wedding", 20 fields) and `/seminyak/tour` (the tour booking form).
 *
 * **Same simplification as `ContactForm`, and for the same reason.** The live
 * site posts these to WPForms, which emails the property. This project has no
 * server to receive a submission, so `handleSubmit` prevents the native reload
 * and swaps in a confirmation — the part of the interaction a visitor actually
 * experiences. A real deployment replaces the body of `handleSubmit` with a
 * call to a Server Action.
 *
 * It is a sibling of `ContactForm`, not a replacement for it: that component
 * is the Contact pages' own fixed five-field form and is left untouched. Both
 * use the same underlined-field treatment (a hairline that turns gold on
 * focus) so the two read as one form style across the site.
 */
export function InquiryForm({
  heading,
  fields,
  submitLabel = "Send",
  confirmation = "Thank you for reaching out — we'll get back to you shortly.",
}: InquiryFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Namespaces every input id, so two forms on one page can never collide.
  const formId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  const title = <SectionHeading title={heading} />;

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
    <form onSubmit={handleSubmit}>
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
                      className="flex cursor-pointer items-center gap-2.5"
                    >
                      <input
                        type={isRadio ? "radio" : "checkbox"}
                        name={field.name}
                        value={option}
                        required={isRadio ? field.required : undefined}
                        className="h-4 w-4 accent-primary"
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

        {/* Shared button classes rather than a hand-rolled copy, so this can't
            drift away from the booking CTAs it sits alongside. */}
        <button
          type="submit"
          className={buttonClassName("solid", "md", "mt-2 w-fit")}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
