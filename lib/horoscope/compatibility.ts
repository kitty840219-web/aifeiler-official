import { ZodiacElement, ZodiacSign } from "./signs";

type ElementPairKey = string;

const ELEMENT_MATCH: Record<ElementPairKey, { score: number; verdict: string; desc: string }> = {
  "火-火": { score: 4, verdict: "火花四射", desc: "兩個人都熱情直接、行動力十足，在一起充滿能量，但也容易因為誰都不讓誰而擦出爭執的火花。互相多留一點耐心，會是很有衝勁的一對。" },
  "土-土": { score: 4, verdict: "穩定踏實", desc: "兩人步調相近，都重視安全感與現實面，相處起來很有默契，日子過得踏實。要留意的是別讓生活太一成不變，偶爾也要給彼此新鮮感。" },
  "風-風": { score: 4, verdict: "心靈相通", desc: "兩人都善於溝通、思想活躍，聊起天來總有說不完的話題。感情裡不缺乏刺激，但也要記得多一點實際的陪伴，別只停留在想法層面。" },
  "水-水": { score: 4, verdict: "情感深厚", desc: "兩人都情感細膩、重視內心連結，很容易建立深刻的情感羈絆。要注意的是別讓彼此的情緒互相影響，適時保留一點空間會更健康。" },
  "火-風": { score: 5, verdict: "天生一對", desc: "風元素能為火元素搧風點火，讓彼此的熱情與想法相互激發，是公認很速配的組合。一個帶來靈感，一個付諸行動,配合得恰到好處。" },
  "風-火": { score: 5, verdict: "天生一對", desc: "風元素能為火元素搧風點火，讓彼此的熱情與想法相互激發，是公認很速配的組合。一個帶來靈感，一個付諸行動,配合得恰到好處。" },
  "土-水": { score: 5, verdict: "天生一對", desc: "水元素滋潤著土元素，讓彼此都感到滋養與安穩，是很容易長久經營的組合。一個給予情感支持，一個提供踏實依靠,十分互補。" },
  "水-土": { score: 5, verdict: "天生一對", desc: "水元素滋潤著土元素，讓彼此都感到滋養與安穩，是很容易長久經營的組合。一個給予情感支持，一個提供踏實依靠,十分互補。" },
  "火-土": { score: 3, verdict: "需要磨合", desc: "一個衝勁十足，一個步調穩健，一開始可能覺得對方太急或太慢。只要願意互相體諒步調上的差異，會是很好的互補搭配。" },
  "土-火": { score: 3, verdict: "需要磨合", desc: "一個衝勁十足，一個步調穩健，一開始可能覺得對方太急或太慢。只要願意互相體諒步調上的差異，會是很好的互補搭配。" },
  "風-水": { score: 3, verdict: "需要磨合", desc: "一個理性愛聊，一個感性重情，溝通方式不太一樣，容易有誤會。多練習用對方能懂的方式表達心意，感情會更順暢。" },
  "水-風": { score: 3, verdict: "需要磨合", desc: "一個理性愛聊，一個感性重情，溝通方式不太一樣，容易有誤會。多練習用對方能懂的方式表達心意，感情會更順暢。" },
  "火-水": { score: 2, verdict: "挑戰不小", desc: "一個熱情直接，一個細膩敏感，步調與表達方式差異較大，容易一個覺得對方太衝、一個覺得對方太多想。需要更多耐心理解彼此的需求。" },
  "水-火": { score: 2, verdict: "挑戰不小", desc: "一個熱情直接，一個細膩敏感，步調與表達方式差異較大，容易一個覺得對方太衝、一個覺得對方太多想。需要更多耐心理解彼此的需求。" },
  "土-風": { score: 2, verdict: "挑戰不小", desc: "一個務實重規律，一個重視自由與新鮮感，價值觀容易有落差。若能欣賞彼此的差異，反而能學到不同的生活方式。" },
  "風-土": { score: 2, verdict: "挑戰不小", desc: "一個務實重規律，一個重視自由與新鮮感，價值觀容易有落差。若能欣賞彼此的差異，反而能學到不同的生活方式。" },
};

export type CompatibilityResult = {
  score: number;
  verdict: string;
  desc: string;
};

export function getCompatibility(a: ZodiacSign, b: ZodiacSign): CompatibilityResult {
  const key: ElementPairKey = `${a.element}-${b.element}`;
  const match = ELEMENT_MATCH[key];
  return match;
}

export const ELEMENT_LIST: ZodiacElement[] = ["火", "土", "風", "水"];
