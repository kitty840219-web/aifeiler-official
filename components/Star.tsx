export default function Star({
  className = "h-4 w-4",
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`animate-twinkle ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" />
    </svg>
  );
}
