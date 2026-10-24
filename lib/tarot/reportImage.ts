import { asset } from "../basePath";
import { CardDraw } from "./cards";
import { RELATIONSHIP_POSITION_LABELS } from "./ai";
import { SavedReading } from "./history";

type DrawCommand = (ctx: CanvasRenderingContext2D) => void;

/** Draw an independent report, not a screenshot of the scroll-limited dialog. */
export async function createReportJpg(report: SavedReading): Promise<Blob> {
  await document.fonts.ready;
  const width = 1080;
  const margin = 68;
  const contentWidth = width - margin * 2;
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("此瀏覽器無法建立報告圖片");
  const commands: DrawCommand[] = [];
  let y = 72;
  const font = (size: number, bold: boolean) => `${bold ? "600" : "400"} ${size}px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif`;

  function text(value: string, size = 27, color = "#293147", bold = false) {
    measure!.font = font(size, bold);
    const lines: string[] = [];
    for (const paragraph of value.split(/\r?\n/)) {
      let line = "";
      for (const char of Array.from(paragraph)) {
        if (line && measure!.measureText(line + char).width > contentWidth) {
          lines.push(line);
          line = char;
        } else line += char;
      }
      lines.push(line);
    }
    const top = y;
    const lineHeight = Math.ceil(size * 1.65);
    commands.push((ctx) => {
      ctx.font = font(size, bold);
      ctx.fillStyle = color;
      ctx.textBaseline = "top";
      lines.forEach((line, i) => ctx.fillText(line, margin, top + i * lineHeight));
    });
    y += lines.length * lineHeight + 18;
  }
  function divider() {
    const top = y + 8;
    commands.push((ctx) => { ctx.fillStyle = "#d8c59a"; ctx.fillRect(margin, top, contentWidth, 2); });
    y += 42;
  }
  async function loadCardImage(draw: CardDraw) {
    if (!draw.card.image) throw new Error(`找不到${draw.card.name}的牌圖，請稍後再試`);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("牌圖載入失敗，請確認網路後重新下載"));
      img.src = asset(draw.card.image!);
    });
    return img;
  }
  async function card(draw: CardDraw) {
    const img = await loadCardImage(draw);
    const h = 350;
    const w = h * img.naturalWidth / img.naturalHeight;
    const top = y;
    commands.push((ctx) => {
      ctx.save();
      ctx.translate(width / 2, top + h / 2);
      if (draw.isReversed) ctx.rotate(Math.PI);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    });
    y += h + 26;
  }
  async function cardOverview(draws: CardDraw[]) {
    const images = await Promise.all(draws.map(loadCardImage));
    const columns = Math.min(3, draws.length);
    const gap = 24;
    const cellWidth = (contentWidth - gap * (columns - 1)) / columns;
    const cardHeight = columns === 1 ? 390 : 330;
    const labelHeight = 74;
    const rows = Math.ceil(draws.length / columns);
    const top = y;
    commands.push((ctx) => {
      draws.forEach((draw, index) => {
        const row = Math.floor(index / columns);
        const rowStartIndex = row * columns;
        const itemsInRow = Math.min(columns, draws.length - rowStartIndex);
        const column = index - rowStartIndex;
        const img = images[index];
        const cardWidth = cardHeight * img.naturalWidth / img.naturalHeight;
        const rowWidth = itemsInRow * cellWidth + (itemsInRow - 1) * gap;
        const rowLeft = margin + (contentWidth - rowWidth) / 2;
        const centerX = rowLeft + column * (cellWidth + gap) + cellWidth / 2;
        const cardTop = top + row * (cardHeight + labelHeight);
        ctx.save();
        ctx.translate(centerX, cardTop + cardHeight / 2);
        if (draw.isReversed) ctx.rotate(Math.PI);
        ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
        ctx.restore();
        ctx.font = font(23, true);
        ctx.fillStyle = "#8a6b32";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(`${draw.card.name}（${draw.isReversed ? "逆位" : "正位"}）`, centerX, cardTop + cardHeight + 14, cellWidth);
      });
      ctx.textAlign = "left";
    });
    y += rows * (cardHeight + labelHeight) + 8;
  }
  const self = report.birthInfo.self;
  const partner = report.birthInfo.partner;
  commands.push((ctx) => {
    ctx.fillStyle = "#17213d"; ctx.fillRect(0, 0, width, 254);
    ctx.strokeStyle = "#bba16c"; ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, width - 48, 206);
    for (const [x, top, r] of [[936, 78, 10], [984, 127, 6], [916, 177, 5]]) {
      ctx.beginPath(); ctx.moveTo(x-r, top); ctx.lineTo(x+r, top); ctx.moveTo(x, top-r); ctx.lineTo(x, top+r); ctx.stroke();
    }
  });
  text("艾飛樂語錄  /  TAROT READING", 24, "#e0c78c", true);
  text("個人線上塔羅占卜報告", 43, "#fffaf0", true);
  y = 294;
  const profileTop = y;
  const profileCommand = commands.length;
  y += 18;
  text("個案基本資料", 32, "#17213d", true);
  text(`占卜日期：${report.date}`);
  text(`個案姓名：${self.name || "未填"}${self.gender ? `（${self.gender}）` : ""}`);
  text(`出生年月日：${self.date?.replaceAll("-", ".") || "未填"}　出生時間：${self.time || "未知"}`);
  if (report.coupleMode) {
    text(`對方姓名：${partner?.name || "未填"}${partner?.gender ? `（${partner.gender}）` : ""}`);
    text(`對方出生年月日：${partner?.date?.replaceAll("-", ".") || "未填"}`);
  }
  const profileHeight = y - profileTop;
  commands.splice(profileCommand, 0, (ctx) => {
    ctx.fillStyle = "#f1eadb"; ctx.fillRect(margin - 22, profileTop - 4, contentWidth + 44, profileHeight + 8);
    ctx.fillStyle = "#bba16c"; ctx.fillRect(margin - 22, profileTop - 4, 4, profileHeight + 8);
  });
  y += 30;
  divider();
  text("遇到的問題", 32, "#8a6b32", true);
  text(report.question);
  divider();
  text("個性分析", 34, "#17213d", true);
  if (report.reading.personality) text(report.reading.personality);
  const labels = report.positions?.length === report.spreadSize ? report.positions : report.spreadSize === 5 ? RELATIONSHIP_POSITION_LABELS : report.spreadSize === 3 ? ["過去", "現在", "未來"] : ["核心訊息"];
  divider();
  await cardOverview(report.results);
  divider();
  text("解牌", 34, "#17213d", true);
  for (let i = 0; i < report.results.length; i++) {
    const draw = report.results[i];
    divider();
    text(`${String(i+1).padStart(2, "0")}  ${labels[i]}｜${draw.card.name}（${draw.isReversed ? "逆位" : "正位"}）`, 32, "#8a6b32", true);
    await card(draw);
    text(report.reading.paragraphs[i]);
  }
  divider();
  text("總結與建議", 34, "#17213d", true);
  text(report.reading.summary);
  for (const [index, followUp] of report.followUps.entries()) {
    divider();
    text(`追問 ${index + 1}｜${followUp.question}`, 32, "#8a6b32", true);
    await card(followUp.card);
    text(`${followUp.card.card.name}（${followUp.card.isReversed ? "逆位" : "正位"}）`, 27, "#8a6b32", true);
    text(followUp.answer);
  }
  divider();
  text("艾飛樂語錄 · 用插畫與文字，陪你走過每個黑夜。", 22, "#8a6b32");
  const height = y + 50;
  // Keep large five-card / five-follow-up reports within mobile canvas limits.
  const scale = Math.min(1, Math.sqrt(14000000 / (width * height)), 16000 / height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("此瀏覽器無法建立報告圖片");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#17213d";
  ctx.fillRect(0, 0, width, 14);
  commands.forEach((draw) => draw(ctx));
  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    canvas.width = canvas.height = 1;
    if (blob) resolve(blob); else reject(new Error("圖片產生失敗，請重試"));
  }, "image/jpeg", 0.92));
}
