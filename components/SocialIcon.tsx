type IconType = "instagram" | "youtube" | "line" | "link" | "shop" | "mail";

export default function SocialIcon({
  type,
  className = "h-5 w-5",
}: {
  type: IconType;
  className?: string;
}) {
  switch (type) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path
            d="M12 3c5 0 9 3.4 9 7.6 0 3.7-3.2 6.9-7.6 7.5-.3 0-.6.2-.7.5l-.3 1.7c-.1.5-.6.6-.9.2l-2.2-2.4a1 1 0 00-.8-.3C5 17.2 3 14.1 3 10.6 3 6.4 7 3 12 3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shop":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d="M4 8l1.5-4h13L20 8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4 8h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 12a3 3 0 006 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "link":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path
            d="M9.5 14.5l5-5M8 9.5L6.6 10.9a3 3 0 004.2 4.2L12 14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 9l1.4-1.4a3 3 0 00-4.2-4.2L11 4.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
