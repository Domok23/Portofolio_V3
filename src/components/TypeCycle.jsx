import { useEffect, useState } from "react";

/** Simple typewriter that survives React StrictMode remounts. */
export default function TypeCycle({
  lines = [],
  typingMs = 55,
  holdMs = 1400,
  deleteMs = 28,
  className = "",
  cursorClassName = "text-accent",
}) {
  const [text, setText] = useState("");
  const [donePulse, setDonePulse] = useState(true);

  useEffect(() => {
    if (!lines.length) return undefined;

    let cancelled = false;
    let line = 0;
    let i = 0;
    let deleting = false;
    let timer;

    const schedule = (fn, ms) => {
      timer = window.setTimeout(fn, ms);
    };

    const tick = () => {
      if (cancelled) return;
      const current = lines[line % lines.length];

      if (!deleting) {
        i += 1;
        setText(current.slice(0, i));
        setDonePulse(true);
        if (i >= current.length) {
          schedule(() => {
            deleting = true;
            tick();
          }, holdMs);
          return;
        }
        schedule(tick, typingMs);
        return;
      }

      i -= 1;
      setText(current.slice(0, Math.max(i, 0)));
      if (i <= 0) {
        deleting = false;
        line = (line + 1) % lines.length;
        schedule(tick, 280);
        return;
      }
      schedule(tick, deleteMs);
    };

    setText("");
    schedule(tick, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [lines, typingMs, holdMs, deleteMs]);

  return (
    <span className={className}>
      {text}
      <span
        className={`${cursorClassName} ${donePulse ? "inline-block animate-pulse" : ""}`}
        aria-hidden
      >
        ▌
      </span>
    </span>
  );
}
