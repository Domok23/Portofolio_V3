import { motion } from "framer-motion";

const defaultTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

export default function MotionSection({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
  ...props
}) {
  const Comp = motion[as] || motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0, filter: "none" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...defaultTransition, delay }}
      {...props}
      style={{ filter: "none", ...(props.style || {}) }}
    >
      {children}
    </Comp>
  );
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
