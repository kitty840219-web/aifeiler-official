export default function StatBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/25 bg-paper/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-paper/90">
      <span className="text-gold-light">{icon}</span>
      {label}
    </span>
  );
}
