interface SectionWrapperProps {
  bg?: "background" | "surface" | "dark" | "primary";
  pattern?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
  [key: `data-${string}`]: string | undefined;
}

const bgClasses: Record<string, string> = {
  background: "bg-background text-text",
  surface: "bg-surface text-text",
  dark: "bg-[#333] text-white",
  primary: "bg-primary text-white",
};

export function SectionWrapper({
  bg = "background",
  pattern = false,
  className = "",
  id,
  children,
  ...rest
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative py-16 lg:py-24 overflow-hidden ${bgClasses[bg] ?? bgClasses.background} ${className}`}
      data-nocms-component="section-wrapper"
      {...rest}
    >
      {pattern && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
