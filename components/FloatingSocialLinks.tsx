import SocialIcon from "@/components/SocialIcon";
import { LINKS } from "@/lib/data/site";

const socials = [
  { label: "LINE", name: "官方 LINE", href: LINKS.lineOA, type: "line", color: "#168342" },
  { label: "FB", name: "Facebook", href: "https://www.facebook.com/profile.php?id=100093979488257", type: "facebook", color: "#2760ad" },
  { label: "IG", name: "Instagram", href: LINKS.instagramQuotes, type: "instagram", color: "#a94277" },
  { label: "YouTube", name: "YouTube", href: LINKS.youtube, type: "youtube", color: "#bc3535" },
] as const;

export default function FloatingSocialLinks() {
  return (
    <nav
      aria-label="浮動社群連結"
      className="fixed right-2 top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-2 rounded-full border border-[#d8c59e]/60 bg-[#fffaf0]/90 p-1.5 shadow-lg backdrop-blur-sm sm:right-4"
    >
      {socials.map((social) => (
        <a
          key={social.type}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`前往艾飛樂 ${social.name}（另開視窗）`}
          title={social.name}
          style={{ color: social.color }}
          className="flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-full bg-white/90 transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b59451]"
        >
          {social.type === "facebook" ? (
            <span aria-hidden="true" className="h-5 font-sans text-2xl font-bold leading-5">f</span>
          ) : <SocialIcon type={social.type} className="h-5 w-5" />}
          <span className="font-sans text-[8px] font-bold leading-none">{social.label}</span>
        </a>
      ))}
    </nav>
  );
}
