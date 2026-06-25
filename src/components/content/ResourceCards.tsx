import { ArrowRight, BookOpen, DollarSign, FileText, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface Resource {
  slug: string;
  title: string;
  description: string;
  tag: string;
  image?: string;
  href?: string;
  type?: "guide" | "faq" | "financial" | "article";
}

interface ResourceCardsProps {
  resources?: Resource[];
  heading?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  guide: BookOpen,
  faq: HelpCircle,
  financial: DollarSign,
  article: FileText,
};

const defaultResources: Resource[] = [
  {
    slug: "senior-living-guide",
    title: "The Complete Guide to Senior Living",
    description: "Everything families need to know about choosing the right senior living community, from care levels to finances.",
    tag: "Guide",
    type: "guide",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
  },
  {
    slug: "financial-help",
    title: "Understanding Senior Living Costs",
    description: "A breakdown of pricing, insurance options, VA benefits, and financial assistance programs available to families.",
    tag: "Financial",
    type: "financial",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  },
  {
    slug: "caregiver-support",
    title: "Resources for Family Caregivers",
    description: "Support groups, respite options, and practical tips for family members caring for aging loved ones.",
    tag: "Support",
    type: "guide",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80",
  },
];

export function ResourceCards({
  resources = defaultResources,
  heading = "Helpful Resources for Families",
}: ResourceCardsProps) {
  return (
    <section data-nocms-component="resource-cards" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {(resources ?? []).map((resource) => {
            const Icon = typeIcons[resource.type ?? "article"] ?? FileText;
            return (
              <a data-nocms-component="resource-cards"
                key={resource.slug}
                href={resource.href ?? `/resources/${resource.slug}`}
                className="group bg-surface rounded-xl overflow-hidden border border-text/5 hover:shadow-lg transition-all block"
              >
                {resource.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" data-role="media"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" className="bg-primary/90 text-white backdrop-blur-sm">
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {resource.tag}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4" data-role="subheading">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
