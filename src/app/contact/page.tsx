import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/content/ContactForm";
import { fetchPageBySlug } from "@/lib/payload";
import { PageDocument, pageDocumentMetadata } from "@/components/blocks/PageDocument";
import skinConfig from "@/skin.config";

// Tenant override: an imported legacy page with this exact slug (e.g. a
// migrated `/contact`) wins over the template's demo content, keeping the
// legacy URL intact. With `output: "export"` the check runs at build time —
// a fresh deploy is the invalidation trigger.
const PAGE_SLUG = "contact";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return pageDocumentMetadata(page);
  return {
    title: `Contact | ${skinConfig.brandName}`,
    description: `Get in touch with ${skinConfig.brandName}. Reserve a unit, ask about pricing, or schedule a visit.`,
  };
}

export default async function ContactPage() {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return <PageDocument page={page} />;

  return (
    <>
      <section
        data-nocms-component="contact-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Contact us
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Reserve a unit, ask about pricing, or check on a current rental — we&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text mb-8" data-role="heading-2">
                Get in touch
              </h2>
              <div className="space-y-6">
                {skinConfig.contactPhone && (
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text" data-role="heading-3">Phone</h3>
                      <a
                        href={`tel:${skinConfig.contactPhone.replace(/[^\d+]/g, "")}`}
                        className="text-primary hover:underline"
                      >
                        {skinConfig.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {skinConfig.contactEmail && (
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text" data-role="heading-4">Email</h3>
                      <a
                        href={`mailto:${skinConfig.contactEmail}`}
                        className="text-primary hover:underline"
                      >
                        {skinConfig.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {skinConfig.primaryAddress && (
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text" data-role="heading-5">Office</h3>
                      <p className="text-muted" data-role="text">
                        {skinConfig.primaryAddress.line1}, {skinConfig.primaryAddress.city},{" "}
                        {skinConfig.primaryAddress.state} {skinConfig.primaryAddress.zip}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text" data-role="heading-6">Office hours</h3>
                    <p className="text-muted" data-role="text-2">Mon–Fri: 9:00 AM – 6:00 PM</p>
                    <p className="text-muted" data-role="text-3">Saturday: 9:00 AM – 5:00 PM</p>
                    <p className="text-muted" data-role="text-4">Sunday: 10:00 AM – 4:00 PM</p>
                    <p className="text-muted text-sm mt-1" data-role="text-5">
                      Gate access available outside office hours at most facilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm
                heading="Send us a message"
                description="Tell us about your storage needs and we'll respond within one business day."
                fields={[
                  { name: "name", label: "Full name", type: "text", required: true, placeholder: "Your full name" },
                  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
                  { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 000-0000" },
                  {
                    name: "interest",
                    label: "What can we help with?",
                    type: "select",
                    options: [
                      "Reserving a new unit",
                      "Existing reservation question",
                      "Billing or payment question",
                      "Pricing or sizing help",
                      "Other",
                    ],
                  },
                  { name: "message", label: "Message", type: "textarea", placeholder: "How can we help?" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
