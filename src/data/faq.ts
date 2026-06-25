export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What size storage unit do I need?",
    answer:
      "A 5x5 holds the contents of a small closet. A 5x10 fits a one-bedroom apartment's worth of boxes and small furniture. A 10x10 — our most popular size — handles a one-bedroom apartment with appliances. A 10x20 fits a three-bedroom house, and a 10x30 holds a five-bedroom plus large items like vehicles or boats. When in doubt, size up — overflow is cheaper than a second unit.",
    category: "Sizing",
  },
  {
    question: "Do you offer climate-controlled storage?",
    answer:
      "Yes. Climate-controlled units stay between 55–80°F year-round with regulated humidity. We recommend climate control for wood furniture, electronics, leather goods, photos, artwork, musical instruments, and anything moisture-sensitive. Standard units work fine for tools, lawn equipment, plastic bins of decor, and most automotive items.",
    category: "Storage Options",
  },
  {
    question: "Is the facility secure?",
    answer:
      "Every Stormont Self Storage location is fully gated with personalized access codes, monitored 24/7 by HD surveillance cameras, and lit throughout the property. Individual unit doors lock with a customer-supplied disc lock. Our managers live on-site at most facilities and patrol the grounds daily.",
    category: "Security",
  },
  {
    question: "What are your access hours?",
    answer:
      "Standard gate access is 6 AM to 10 PM, seven days a week. Most of our facilities offer 24/7 extended access for an additional fee — ideal for business customers, contractors, or anyone with non-standard schedules. Office hours for in-person service are typically 9 AM to 6 PM Monday–Saturday and 10 AM to 4 PM Sunday.",
    category: "Access",
  },
  {
    question: "Do I need to sign a long-term lease?",
    answer:
      "No. All units are month-to-month with no long-term commitment. Move out anytime by giving 10 days written notice before your next billing cycle. We don't charge cancellation fees, and partial months are prorated when you give proper notice.",
    category: "Pricing",
  },
  {
    question: "How do I pay my bill?",
    answer:
      "We accept credit/debit cards, ACH bank transfers, and cash or check at the office. Most customers set up auto-pay through their online account, which avoids late fees and ensures uninterrupted access. Online payments are available 24/7 through our customer portal.",
    category: "Pricing",
  },
  {
    question: "Do I need insurance for my stored items?",
    answer:
      "Yes — tenant insurance is required and many homeowner or renter policies include coverage for off-premises personal property. If yours doesn't, we offer affordable storage protection plans starting around $10/month with $2,000–$10,000 of coverage tiers. Bring proof of coverage on move-in day or sign up at the office.",
    category: "Insurance",
  },
  {
    question: "Can I rent and reserve online?",
    answer:
      "Absolutely. Use our reserve-online tool to lock in a unit at the current rate; reservations hold the size for up to 7 days at no cost. Full online rental is available at most locations — sign the lease, pay the first month, and receive your gate code via email, all without visiting the office.",
    category: "Reserving",
  },
];
