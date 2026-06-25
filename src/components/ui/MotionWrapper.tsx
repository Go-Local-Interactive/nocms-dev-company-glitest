import * as motion from "motion/react-client";
import { type Variants } from "motion/react";
import { type ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  entrance?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "blur-in" | "none";
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  [key: `data-${string}`]: string | undefined;
}

const entranceVariants: Record<string, Variants> = {
  "fade-up": { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  "fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slide-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  "blur-in": { hidden: { opacity: 0, filter: "blur(8px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
};

export function MotionWrapper({ children, entrance = "fade-up", duration = 0.5, delay = 0, once = true, amount = 0.2, className, ...rest }: MotionWrapperProps) {
  if (entrance === "none") return <div className={className} data-nocms-component="motion-wrapper" {...rest}>{children}</div>;
  return (
    <motion.div variants={entranceVariants[entrance]} initial="hidden" whileInView="visible" viewport={{ once, amount }} transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className} data-nocms-component="motion-wrapper" {...rest}>
      {children}
    </motion.div>
  );
}
