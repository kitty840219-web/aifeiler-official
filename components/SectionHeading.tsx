export default function SectionHeading({
  eyebrow,
  title,
  desc,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-gold-light">{eyebrow}</p>}
      <h2 className="font-serif text-2xl font-bold text-paper sm:text-3xl">{title}</h2>
      {desc && (
        <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-paper/70 sm:text-base ${center ? "mx-auto" : ""}`}>
          {desc}
        </p>
      )}
    </div>
  );
}
