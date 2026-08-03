export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-cyber-parallax="80"
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl dark:bg-accent/20"
      />
      <div
        data-cyber-parallax="-60"
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-secondary/10 blur-3xl dark:bg-accent-secondary/15"
      />
      <div
        data-cyber-parallax="40"
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-tertiary/5 blur-3xl dark:bg-accent-tertiary/10"
      />
    </div>
  );
}
