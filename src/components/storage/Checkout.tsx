"use client";

import * as React from "react";
import { useState } from "react";

/**
 * Reservation checkout form. Source: storage-theme-payload
 * `src/components/CubbyCheckout`. The upstream renders a `<cubby-checkout>`
 * web component injected by Cubby's CDN script — replaced here with a plain
 * client form (name + email + phone + move-in date) so the template stays
 * vendor-agnostic. The submit handler is a stub that logs the payload and
 * shows a thank-you state; integrators replace `onSubmit` with the real call.
 *
 * Editor contract: heading carries `data-role="heading"`, subheading carries
 * `data-role="subheading"`, primary submit button carries `data-role="cta"`.
 */

interface CheckoutProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  /** Called with form values on submit. Defaults to `console.log` + thank-you. */
  onSubmit?: (values: CheckoutFormValues) => void | Promise<void>;
}

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  moveInDate: string;
}

const initial: CheckoutFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  moveInDate: "",
};

export function Checkout({
  heading = "Reserve your unit",
  subheading = "Tell us a bit about yourself and we'll hold the unit for 48 hours.",
  ctaLabel = "Reserve now",
  onSubmit,
}: CheckoutProps) {
  const [values, setValues] = useState<CheckoutFormValues>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof CheckoutFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // eslint-disable-next-line no-console
        console.log("[Checkout] reservation submit", values);
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section
        data-nocms-component="checkout"
        className="py-12 lg:py-16"
        aria-live="polite"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            data-role="heading"
            className="font-heading text-3xl font-bold text-text mb-3"
          >
            Thanks, {values.firstName || "we got it"}!
          </h2>
          <p data-role="subheading" className="text-zinc-600 text-lg">
            We&apos;ll reach out shortly to confirm your reservation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section data-nocms-component="checkout" className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2
          data-role="heading"
          className="font-heading text-3xl font-bold text-text mb-3"
        >
          {heading}
        </h2>
        <p data-role="subheading" className="text-zinc-600 mb-6">
          {subheading}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="checkout-first"
              label="First name"
              required
              value={values.firstName}
              onChange={update("firstName")}
              autoComplete="given-name"
            />
            <Field
              id="checkout-last"
              label="Last name"
              required
              value={values.lastName}
              onChange={update("lastName")}
              autoComplete="family-name"
            />
          </div>
          <Field
            id="checkout-email"
            label="Email"
            type="email"
            required
            value={values.email}
            onChange={update("email")}
            autoComplete="email"
          />
          <Field
            id="checkout-phone"
            label="Phone"
            type="tel"
            required
            value={values.phone}
            onChange={update("phone")}
            autoComplete="tel"
          />
          <Field
            id="checkout-date"
            label="Desired move-in date"
            type="date"
            required
            value={values.moveInDate}
            onChange={update("moveInDate")}
          />
          <button
            type="submit"
            data-role="cta"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-4 rounded-md shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? "Submitting…" : ctaLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text mb-1">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full h-11 rounded-md border border-zinc-300 px-3 text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
