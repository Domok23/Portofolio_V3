import { forwardRef } from "react";
import PropTypes from "prop-types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = forwardRef(function Input(
  { className, as: Comp = "input", ...props },
  ref
) {
  const isTextarea = Comp === "textarea";

  return (
    <div className="relative">
      <span
        className={cn(
          "pointer-events-none absolute left-3 font-label text-accent",
          isTextarea ? "top-3" : "top-1/2 -translate-y-1/2"
        )}
        aria-hidden
      >
        &gt;
      </span>
      <Comp
        ref={ref}
        className={cn(
          "w-full min-h-11 border border-border bg-surface py-2.5 pl-8 pr-3 font-body text-accent",
          "placeholder:text-muted cyber-chamfer-sm transition-all duration-200",
          "focus:border-accent focus:shadow-neon focus:outline-none",
          isTextarea && "resize-none pt-3",
          className
        )}
        {...props}
      />
    </div>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Input;
