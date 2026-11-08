const TONES = {
  gold: "border-gold/40 bg-gold/10 text-gold-light",
  light: "border-paper/25 bg-paper/10 text-gold-light",
} as const;

export default function TagChip({
  children,
  tone = "gold",
  className = "",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
