"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface ContactFormProps {
  fields?: FormField[];
  submitLabel?: string;
  heading?: string;
  description?: string;
}

const defaultFields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "(555) 000-0000" },
  {
    name: "interest",
    label: "I am interested in",
    type: "select",
    options: ["Independent Living", "Assisted Living", "Memory Care", "Respite Care", "Not sure yet"],
  },
  {
    name: "relationship",
    label: "I am a",
    type: "select",
    options: ["Researching for myself", "Family member / caregiver", "Healthcare professional", "Other"],
  },
  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us how we can help..." },
];

export function ContactForm({
  fields = defaultFields,
  submitLabel = "Send Message",
  heading = "Get in Touch",
  description = "Have questions about our community? We would love to hear from you. Fill out the form below and a team member will respond within 24 hours.",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div data-nocms-component="contact-form-flat" className="bg-surface rounded-xl p-12 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" aria-hidden="true" />
        <h3 className="font-heading text-2xl font-bold text-text mb-3">Thank You!</h3>
        <p className="text-muted max-w-md mx-auto" data-role="subheading">
          We have received your message and will be in touch within 24 hours. In the meantime, feel free to call us or schedule a tour.
        </p>
      </div>
    );
  }

  return (
    <div data-nocms-component="contact-form-flat">
      {heading && <h2 data-role="heading" className="font-heading text-3xl font-bold text-text mb-3">{heading}</h2>}
      {description && <p className="text-muted mb-8 max-w-lg">{description}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {(fields ?? []).map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-text mb-1.5">
              {field.label}
              {field.required && <span className="text-secondary ml-1" aria-hidden="true">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-text/10 bg-background text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                className="w-full px-4 py-3 rounded-lg border border-text/10 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-text/10 bg-background text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              />
            )}
          </div>
        ))}
        <Button type="submit" data-role="submit" variant="primary" size="lg" className="w-full sm:w-auto">
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitLabel}
        </Button>
      </form>
    </div>
  );
}
