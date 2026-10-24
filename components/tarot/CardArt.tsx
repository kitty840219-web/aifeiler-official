import { Court, Suit, TarotCard } from "@/lib/tarot/cards";
import { asset } from "@/lib/basePath";

const GOLD = "#f3d9a4";
const GOLD_SOFT = "#f3d9a466";
const CREAM = "#fff6e2";
const INK = "#0b0f2e";

type Pose = {
  armsUp?: boolean;
  armLeftUp?: boolean;
  armRightUp?: boolean;
  armsOut?: boolean;
  seated?: boolean;
  bowed?: boolean;
  legsApart?: boolean;
};

function Figure({ cx, cy, scale = 1, rotate = 0, pose = {} }: { cx: number; cy: number; scale?: number; rotate?: number; pose?: Pose }) {
  const { armsUp, armLeftUp, armRightUp, armsOut, seated, bowed, legsApart } = pose;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) rotate(${rotate})`} stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round">
      <circle cx={0} cy={-30} r={4.2} fill={CREAM} stroke={GOLD} />
      <path
        d={
          seated
            ? "M -9 -4 L 9 -4 L 6 -22 L -6 -22 Z M -9 -4 L -12 6 M 9 -4 L 12 6"
            : bowed
              ? "M -8 2 Q 0 -24 8 2 Z"
              : legsApart
                ? "M 0 -22 L -9 8 M 0 -22 L 9 8 M -6 -22 L 6 -22"
                : "M -8 -4 L 8 -4 L 5 -24 L -5 -24 Z M -3 -4 L -6 10 M 3 -4 L 6 10"
        }
        fill={GOLD_SOFT}
      />
      {armsUp && <path d="M -4 -22 L -10 -34 M 4 -22 L 10 -34" />}
      {armLeftUp && <path d="M -4 -20 L -13 -28 M 4 -20 L 8 -8" />}
      {armRightUp && <path d="M 4 -20 L 13 -28 M -4 -20 L -8 -8" />}
      {armsOut && <path d="M -5 -20 L -16 -14 M 5 -20 L 16 -14" />}
    </g>
  );
}

function Rays({ cx, cy, r, count = 12, len = 10 }: { cx: number; cy: number; r: number; count?: number; len?: number }) {
  const lines = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * (r + 2);
    const y1 = cy + Math.sin(a) * (r + 2);
    const x2 = cx + Math.cos(a) * (r + len);
    const y2 = cy + Math.sin(a) * (r + len);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <g stroke={GOLD} strokeWidth={1.6} strokeLinecap="round">
      {lines}
    </g>
  );
}

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <Rays cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r} fill={GOLD_SOFT} stroke={GOLD} strokeWidth={1.6} />
    </g>
  );
}

function Crescent({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <path
      d={`M ${cx + r} ${cy - r} A ${r} ${r} 0 1 0 ${cx + r} ${cy + r} A ${r * 0.6} ${r * 0.6} 0 1 1 ${cx + r} ${cy - r} Z`}
      fill={GOLD_SOFT}
      stroke={GOLD}
      strokeWidth={1.6}
    />
  );
}

function Star({ cx, cy, r, filled = true }: { cx: number; cy: number; r: number; filled?: boolean }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
  }).join(" ");
  return <polygon points={points} fill={filled ? GOLD : "none"} stroke={GOLD} strokeWidth={1.2} />;
}

function Wave({ y, width = 100, x = 10 }: { y: number; width?: number; x?: number }) {
  return (
    <path
      d={`M ${x} ${y} q 10 -6 20 0 t 20 0 t 20 0 t 20 0`}
      fill="none"
      stroke={GOLD}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  );
}

function Cliff({ x = 10, y = 165, w = 100 }: { x?: number; y?: number; w?: number }) {
  return <path d={`M ${x} ${y} L ${x + w * 0.55} ${y - 26} L ${x + w} ${y} Z`} fill={GOLD_SOFT} stroke={GOLD} strokeWidth={1.4} />;
}

function Pillar({ x, y = 175, h = 60 }: { x: number; y?: number; h?: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} fill="none">
      <rect x={x - 6} y={y - h} width={12} height={h} />
      <rect x={x - 9} y={y - h - 6} width={18} height={6} />
    </g>
  );
}

function Tower({ cx = 60, base = 175 }: { cx?: number; base?: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} fill={GOLD_SOFT}>
      <rect x={cx - 14} y={base - 60} width={28} height={60} />
      <path d={`M ${cx - 16} ${base - 60} l 4 -8 l 4 8 l 4 -8 l 4 8 l 4 -8 l 4 8`} fill="none" />
      <path d={`M ${cx + 20} 20 L ${cx + 6} 50 L ${cx + 16} 50 L ${cx} 82`} stroke={GOLD} strokeWidth={2} fill="none" />
    </g>
  );
}

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} />;
  });
  return (
    <g stroke={GOLD} strokeWidth={1.4} fill="none">
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.18} fill={GOLD} />
      {spokes}
    </g>
  );
}

function Pentacle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth={1.4} />
      <Star cx={cx} cy={cy} r={r * 0.8} filled={false} />
    </g>
  );
}

function Chalice({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path
      d={`M ${cx - 10} ${cy - 10} Q ${cx - 10} ${cy + 4} ${cx} ${cy + 4} Q ${cx + 10} ${cy + 4} ${cx + 10} ${cy - 10}
          M ${cx} ${cy + 4} L ${cx} ${cy + 14} M ${cx - 7} ${cy + 18} L ${cx + 7} ${cy + 18} M ${cx} ${cy + 14} L ${cx} ${cy + 18}`}
      fill="none"
      stroke={GOLD}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  );
}

function Wands({ cx, cy, count = 10, len = 34 }: { cx: number; cy: number; count?: number; len?: number }) {
  const lines = Array.from({ length: count }, (_, i) => {
    const a = -0.9 + (i / (count - 1)) * 1.8;
    const x2 = cx + Math.sin(a) * len;
    const y2 = cy - Math.cos(a) * len;
    return <line key={i} x1={cx} y1={cy + 8} x2={x2} y2={y2} />;
  });
  return (
    <g stroke={GOLD} strokeWidth={1.3} strokeLinecap="round">
      {lines}
    </g>
  );
}

function Scale({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round">
      <line x1={cx} y1={cy - 20} x2={cx} y2={cy - 4} />
      <line x1={cx - 20} y1={cy - 4} x2={cx + 20} y2={cy - 4} />
      <path d={`M ${cx - 20} ${cy - 4} L ${cx - 26} ${cy + 8} A 8 6 0 0 0 ${cx - 14} ${cy + 8} Z`} />
      <path d={`M ${cx + 20} ${cy - 4} L ${cx + 14} ${cy + 8} A 8 6 0 0 0 ${cx + 26} ${cy + 8} Z`} />
      <path d={`M ${cx - 10} ${cy - 26} L ${cx + 10} ${cy - 26}`} />
    </g>
  );
}

function Wings({ cx, cy, w = 26 }: { cx: number; cy: number; w?: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.4} fill={GOLD_SOFT}>
      <path d={`M ${cx} ${cy} Q ${cx - w} ${cy - 10} ${cx - w - 4} ${cy + 12} Q ${cx - w / 2} ${cy + 6} ${cx} ${cy + 10} Z`} />
      <path d={`M ${cx} ${cy} Q ${cx + w} ${cy - 10} ${cx + w + 4} ${cy + 12} Q ${cx + w / 2} ${cy + 6} ${cx} ${cy + 10} Z`} />
    </g>
  );
}

function ChainLinks({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} fill="none">
      <ellipse cx={cx - 6} cy={cy} rx={6} ry={9} />
      <ellipse cx={cx + 6} cy={cy + 8} rx={6} ry={9} />
    </g>
  );
}

function Lion({ cx, cy }: { cx: number; cy: number }) {
  const mane = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * 9}
        y1={cy + Math.sin(a) * 9}
        x2={cx + Math.cos(a) * 15}
        y2={cy + Math.sin(a) * 15}
      />
    );
  });
  return (
    <g stroke={GOLD} strokeWidth={1.3} fill="none" strokeLinecap="round">
      {mane}
      <circle cx={cx} cy={cy} r={8} fill={GOLD_SOFT} />
      <path d={`M ${cx + 6} ${cy + 6} Q ${cx + 20} ${cy + 12} ${cx + 26} ${cy + 2}`} />
    </g>
  );
}

function Trumpet({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round">
      <path d={`M ${cx - 14} ${cy} L ${cx + 6} ${cy - 8} L ${cx + 6} ${cy + 8} Z`} fill={GOLD_SOFT} />
      <line x1={cx + 6} y1={cy} x2={cx + 20} y2={cy} />
      <path d={`M ${cx + 22} ${cy - 8} q 6 8 0 16 M ${cx + 28} ${cy - 6} q 5 6 0 12`} />
    </g>
  );
}

function Rose({ cx, cy, r = 6 }: { cx: number; cy: number; r?: number }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={r * 0.85} />;
  });
  return (
    <g fill={GOLD_SOFT} stroke={GOLD} strokeWidth={1}>
      {petals}
      <circle cx={cx} cy={cy} r={r * 0.7} fill={GOLD} />
    </g>
  );
}

function Frame() {
  return <rect x={6} y={6} width={108} height={188} rx={6} fill="none" stroke={GOLD} strokeOpacity={0.35} strokeWidth={1} />;
}

function scene(id: number) {
  switch (id) {
    case 0: // The Fool
      return (
        <>
          <Sun cx={60} cy={38} r={12} />
          <Cliff x={-10} y={150} w={90} />
          <Figure cx={78} cy={140} scale={1.15} pose={{ legsApart: true, armsOut: true }} />
        </>
      );
    case 1: // The Magician
      return (
        <>
          <path d="M 46 34 Q 60 20 74 34 Q 60 48 46 34 Z" stroke={GOLD} strokeWidth={1.4} fill="none" />
          <Figure cx={60} cy={130} scale={1.35} pose={{ armLeftUp: true }} />
          <rect x={30} y={158} width={60} height={8} fill={GOLD_SOFT} stroke={GOLD} strokeWidth={1.2} />
        </>
      );
    case 2: // The High Priestess
      return (
        <>
          <Pillar x={26} h={90} />
          <Pillar x={94} h={90} />
          <Crescent cx={60} cy={40} r={12} />
          <Figure cx={60} cy={132} scale={1.3} pose={{ seated: true }} />
        </>
      );
    case 3: // The Empress
      return (
        <>
          <Rose cx={30} cy={50} r={7} />
          <Rose cx={92} cy={54} r={6} />
          <Figure cx={60} cy={126} scale={1.4} pose={{ seated: true }} />
          <Wave y={172} />
        </>
      );
    case 4: // The Emperor
      return (
        <>
          <Cliff x={-10} y={168} w={140} />
          <Figure cx={60} cy={126} scale={1.4} pose={{ seated: true }} />
          <path d="M 44 78 L 60 62 L 76 78" stroke={GOLD} strokeWidth={1.6} fill="none" />
        </>
      );
    case 5: // The Hierophant
      return (
        <>
          <Pillar x={30} h={70} />
          <Pillar x={90} h={70} />
          <Figure cx={60} cy={128} scale={1.4} pose={{ armRightUp: true }} />
          <path d="M 52 40 L 68 40 M 60 32 L 60 48" stroke={GOLD} strokeWidth={1.6} />
        </>
      );
    case 6: // The Lovers
      return (
        <>
          <Sun cx={60} cy={34} r={10} />
          <Figure cx={38} cy={128} scale={1.2} pose={{ armRightUp: true }} />
          <Figure cx={82} cy={128} scale={1.2} pose={{ armLeftUp: true }} />
        </>
      );
    case 7: // The Chariot
      return (
        <>
          <Star cx={40} cy={30} r={5} />
          <Star cx={80} cy={30} r={5} />
          <Figure cx={60} cy={116} scale={1.2} pose={{ armsUp: false }} />
          <g stroke={GOLD} strokeWidth={1.6} fill="none">
            <rect x={32} y={140} width={56} height={20} />
            <circle cx={40} cy={166} r={10} />
            <circle cx={80} cy={166} r={10} />
          </g>
        </>
      );
    case 8: // Strength
      return (
        <>
          <path d="M 20 40 q 40 -20 80 0" stroke={GOLD} strokeWidth={1.4} fill="none" />
          <Lion cx={82} cy={128} />
          <Figure cx={44} cy={124} scale={1.2} pose={{ bowed: true }} />
        </>
      );
    case 9: // The Hermit
      return (
        <>
          <path d="M 82 44 L 82 30 M 76 36 L 88 36 M 78 32 L 86 40 M 86 32 L 78 40" stroke={GOLD} strokeWidth={1.4} />
          <Rays cx={82} cy={36} r={6} count={8} len={8} />
          <Cliff x={-10} y={168} w={140} />
          <Figure cx={56} cy={126} scale={1.3} pose={{ armRightUp: true }} />
        </>
      );
    case 10: // Wheel of Fortune
      return (
        <>
          <Wheel cx={60} cy={96} r={40} />
          <Star cx={22} cy={40} r={5} />
          <Star cx={98} cy={40} r={5} />
        </>
      );
    case 11: // Justice
      return (
        <>
          <Scale cx={60} cy={54} />
          <Pillar x={26} h={70} />
          <Pillar x={94} h={70} />
          <Figure cx={60} cy={128} scale={1.3} pose={{ seated: true }} />
        </>
      );
    case 12: // The Hanged Man
      return (
        <>
          <path d="M 30 30 L 90 30" stroke={GOLD} strokeWidth={2} />
          <line x1={60} y1={30} x2={60} y2={54} stroke={GOLD} strokeWidth={1.4} />
          <Figure cx={60} cy={112} scale={1.35} rotate={180} pose={{ legsApart: true }} />
        </>
      );
    case 13: // Death
      return (
        <>
          <Sun cx={92} cy={40} r={10} />
          <Cliff x={-10} y={168} w={140} />
          <Rose cx={40} cy={140} r={7} />
          <path d="M 60 150 L 60 100" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" />
        </>
      );
    case 14: // Temperance
      return (
        <>
          <Wings cx={60} cy={92} w={30} />
          <Figure cx={60} cy={128} scale={1.3} pose={{ armsOut: true }} />
          <Wave y={168} />
        </>
      );
    case 15: // The Devil
      return (
        <>
          <path d="M 48 68 L 42 56 M 72 68 L 78 56" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" />
          <Wings cx={60} cy={90} w={24} />
          <Figure cx={60} cy={128} scale={1.3} pose={{ armsOut: true }} />
          <ChainLinks cx={60} cy={158} />
        </>
      );
    case 16: // The Tower
      return (
        <>
          <Tower cx={60} base={172} />
          <Star cx={24} cy={26} r={4} />
          <Star cx={98} cy={22} r={4} />
        </>
      );
    case 17: // The Star
      return (
        <>
          <Star cx={60} cy={30} r={14} />
          <Star cx={26} cy={54} r={5} />
          <Star cx={94} cy={50} r={5} />
          <Star cx={44} cy={70} r={4} />
          <Star cx={78} cy={68} r={4} />
          <Figure cx={60} cy={132} scale={1.2} pose={{ bowed: true }} />
          <Wave y={168} />
        </>
      );
    case 18: // The Moon
      return (
        <>
          <Crescent cx={60} cy={36} r={14} />
          <Star cx={30} cy={30} r={4} />
          <Star cx={90} cy={30} r={4} />
          <Pillar x={30} h={40} y={140} />
          <Pillar x={90} h={40} y={140} />
          <Wave y={168} />
        </>
      );
    case 19: // The Sun
      return (
        <>
          <Sun cx={60} cy={44} r={20} />
          <Figure cx={60} cy={140} scale={1.2} pose={{ armsOut: true }} />
        </>
      );
    case 20: // Judgement
      return (
        <>
          <Sun cx={60} cy={30} r={10} />
          <Trumpet cx={44} cy={106} />
          <Wings cx={60} cy={100} w={22} />
          <Figure cx={60} cy={144} scale={1.15} pose={{ armsUp: true }} />
        </>
      );
    case 21: // The World
      return (
        <>
          <g stroke={GOLD} strokeWidth={1.4} fill="none">
            <ellipse cx={60} cy={96} rx={40} ry={26} />
          </g>
          <Star cx={30} cy={40} r={4} />
          <Star cx={90} cy={40} r={4} />
          <Star cx={30} cy={150} r={4} />
          <Star cx={90} cy={150} r={4} />
          <Figure cx={60} cy={96} scale={1.1} pose={{ legsApart: true, armsOut: true }} />
        </>
      );
    default:
      return <Star cx={60} cy={96} r={14} />;
  }
}

// --- Minor arcana: small repeatable suit glyphs, arranged as pip cards ---

function SuitGlyph({ cx, cy, suit, scale = 1 }: { cx: number; cy: number; suit: Suit; scale?: number }) {
  const s = scale;
  switch (suit) {
    case "wands":
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`} stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round">
          <line x1={0} y1={-9} x2={0} y2={9} />
          <line x1={-3} y1={-5} x2={3} y2={-2} />
          <line x1={3} y1={2} x2={-3} y2={5} />
        </g>
      );
    case "cups":
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`} stroke={GOLD} strokeWidth={1.4} fill={GOLD_SOFT} strokeLinecap="round">
          <path d="M -6 -6 Q -6 4 0 4 Q 6 4 6 -6 Z" />
          <line x1={0} y1={4} x2={0} y2={8} />
          <line x1={-4} y1={9} x2={4} y2={9} />
        </g>
      );
    case "swords":
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`} stroke={GOLD} strokeWidth={1.6} strokeLinecap="round">
          <line x1={0} y1={-9} x2={0} y2={7} />
          <line x1={-4} y1={-2} x2={4} y2={-2} />
          <path d="M -3 7 L 3 7 L 0 11 Z" fill={GOLD} />
        </g>
      );
    case "pentacles":
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <circle r={7} fill="none" stroke={GOLD} strokeWidth={1.3} />
          <Star cx={0} cy={0} r={5.2} filled={false} />
        </g>
      );
  }
}

function pipPositions(count: number): { x: number; y: number }[] {
  if (count === 1) return [{ x: 60, y: 100 }];
  const top = 36;
  const bottom = 164;
  const cols = count === 2 ? [60] : [42, 78];
  if (count === 2) return [{ x: 60, y: top }, { x: 60, y: bottom }];
  const rows = Math.ceil(count / 2);
  const pts: { x: number; y: number }[] = [];
  let placed = 0;
  for (let r = 0; r < rows; r++) {
    const y = rows === 1 ? (top + bottom) / 2 : top + (r * (bottom - top)) / (rows - 1);
    for (let c = 0; c < cols.length && placed < count; c++) {
      pts.push({ x: cols[c], y });
      placed++;
    }
  }
  return pts;
}

function CrownGlyph({ cx, cy, court }: { cx: number; cy: number; court: Court }) {
  switch (court) {
    case "page":
      return <circle cx={cx} cy={cy} r={3} fill="none" stroke={GOLD} strokeWidth={1.4} />;
    case "knight":
      return <path d={`M ${cx - 5} ${cy + 4} L ${cx} ${cy - 6} L ${cx + 5} ${cy + 4} Z`} fill="none" stroke={GOLD} strokeWidth={1.4} />;
    case "queen":
      return (
        <path
          d={`M ${cx - 6} ${cy + 4} L ${cx - 6} ${cy - 2} L ${cx - 2} ${cy + 2} L ${cx} ${cy - 6} L ${cx + 2} ${cy + 2} L ${cx + 6} ${cy - 2} L ${cx + 6} ${cy + 4} Z`}
          fill={GOLD_SOFT}
          stroke={GOLD}
          strokeWidth={1.2}
        />
      );
    case "king":
      return (
        <g stroke={GOLD} strokeWidth={1.3} fill={GOLD_SOFT}>
          <path d={`M ${cx - 7} ${cy + 4} L ${cx - 7} ${cy - 1} L ${cx - 3} ${cy + 2} L ${cx} ${cy - 6} L ${cx + 3} ${cy + 2} L ${cx + 7} ${cy - 1} L ${cx + 7} ${cy + 4} Z`} />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy - 10} />
          <line x1={cx - 2} y1={cy - 8} x2={cx + 2} y2={cy - 8} />
        </g>
      );
  }
}

function minorScene(card: TarotCard) {
  const suit = card.suit as Suit;
  if (card.court) {
    return (
      <>
        <CrownGlyph cx={60} cy={54} court={card.court} />
        <Figure cx={60} cy={132} scale={1.35} pose={{ seated: true }} />
        <SuitGlyph cx={60} cy={158} suit={suit} scale={1.6} />
      </>
    );
  }
  const count = card.rank ?? 1;
  return (
    <>
      {pipPositions(count).map((p, i) => (
        <SuitGlyph key={i} cx={p.x} cy={p.y} suit={suit} scale={1.3} />
      ))}
    </>
  );
}

export default function CardArt({ card, className = "" }: { card: TarotCard; className?: string }) {
  if (card.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(card.image)}
        alt={card.name}
        loading="eager"
        decoding="async"
        className={`object-contain ${className}`}
      />
    );
  }
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-hidden="true">
      <rect x={0} y={0} width={120} height={200} fill={INK} />
      <Frame />
      {card.suit ? minorScene(card) : scene(card.id)}
    </svg>
  );
}
