import PropTypes from "prop-types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function CornerAccents() {
  const corner = "pointer-events-none absolute h-3 w-3 border-accent";
  return (
    <>
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

export default function Card({
  variant = "default",
  hoverEffect = false,
  className,
  children,
  ...props
}) {
  const isTerminal = variant === "terminal";
  const isHolo = variant === "holographic";

  return (
    <div
      className={cn(
        "relative cyber-chamfer border transition-all duration-300",
        isTerminal && "border-border bg-background pt-10",
        isHolo && "border-accent/30 bg-muted-bg/30 shadow-neon",
        !isTerminal && !isHolo && "border-border bg-surface",
        hoverEffect &&
          "hover:-translate-y-px hover:border-accent hover:shadow-neon",
        className
      )}
      {...props}
    >
      {isTerminal && (
        <div
          className="absolute left-0 right-0 top-0 flex h-8 items-center gap-2 border-b border-border px-3"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
      )}
      {isHolo && <CornerAccents />}
      {children}
    </div>
  );
}

Card.propTypes = {
  variant: PropTypes.oneOf(["default", "terminal", "holographic"]),
  hoverEffect: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
