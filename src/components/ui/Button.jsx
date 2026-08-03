import PropTypes from "prop-types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const base =
  "inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 font-body text-sm uppercase tracking-wider cyber-chamfer-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  default:
    "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-on-accent hover:shadow-neon",
  secondary:
    "border-2 border-accent-secondary text-accent-secondary bg-transparent hover:bg-accent-secondary hover:text-on-accent hover:shadow-neon-secondary",
  outline:
    "border border-border text-foreground bg-transparent hover:border-accent hover:text-accent hover:shadow-neon-sm",
  ghost: "border-0 text-foreground hover:bg-accent/10 hover:text-accent",
  glitch:
    "border-2 border-accent bg-accent text-on-accent shadow-neon-sm hover:brightness-110 hover:shadow-neon cyber-hover-glitch transition-[filter,box-shadow] duration-150",
};

export default function Button({
  variant = "default",
  className,
  href,
  children,
  type,
  ...props
}) {
  const classes = cn(base, focusRing, variants[variant] || variants.default, className);

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type || "button"} className={classes} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf([
    "default",
    "secondary",
    "outline",
    "ghost",
    "glitch",
  ]),
  className: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
};
