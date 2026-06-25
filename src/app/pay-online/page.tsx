import type { Metadata } from "next";
import { CreditCard, Lock, Shield, ArrowRight } from "lucide-react";
import { CTABanner } from "@/components/content/CTABanner";
import skinConfig from "@/skin.config";

export const metadata: Metadata = {
  title: `Pay online | ${skinConfig.brandName}`,
  description: `Pay your storage bill online at ${skinConfig.brandName}. Secure, fast, and available 24/7.`,
};

export default function PayOnlinePage() {
  return (
    <>
      <section
        data-nocms-component="pay-online-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Pay your bill online
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Secure, fast, and available 24/7 from any device.
          </p>
          <a
            data-role="cta"
            href="#payment-portal"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            Pay now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-text text-center mb-12">
            What you can do online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-xl p-6 text-center border border-text/5">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">
                Pay your bill
              </h3>
              <p className="text-sm text-muted">
                Card, ACH, or stored payment method — all in one click.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 text-center border border-text/5">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">
                Auto-pay
              </h3>
              <p className="text-sm text-muted">
                Set it once and never miss a due date or late fee.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 text-center border border-text/5">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">
                Account history
              </h3>
              <p className="text-sm text-muted">
                Download receipts and review past payments any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="payment-portal"
        className="py-16 lg:py-20 bg-surface"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-text mb-4">
            Online payment portal
          </h2>
          <p className="text-muted mb-8">
            Your payment portal is provided by your facility&apos;s management software. Sign in with
            your tenant account to make a payment, view balances, or update payment information.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-md shadow-md hover:opacity-90 transition-opacity"
          >
            Open payment portal
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-4 text-xs text-muted">
            Need help signing in? Call {skinConfig.contactPhone ?? "us"} during office hours.
          </p>
        </div>
      </section>

      <CTABanner
        heading="Questions about your bill?"
        subheading="Our office team can help with billing, autopay setup, or account changes."
        primaryCta={{ label: "Contact us", href: "/contact" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
