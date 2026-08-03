export default function Scanlines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <div
        className="absolute inset-0 mix-blend-multiply dark:mix-blend-soft-light opacity-20 dark:opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
        }}
      />
    </div>
  );
}
