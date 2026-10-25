import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "/Users/kitty840219/Desktop/網站/repo";
const skillDir = "/Users/kitty840219/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
const previewDir = path.join(workspaceDir, ".portfolio-deck-previews");
const finalPath = path.join(workspaceDir, "public/downloads/李宛容-Ivy-數位內容與視覺設計作品集-2026.pptx");
const sectionNames = [
  "封面", "作品導覽", "核心能力", "關於我", "個人 IP", "IP 人物設計", "品牌與合作", "社群作品", "社群經營", "社群經營",
  "社群經營", "內容企劃", "影音與設計", "影片剪輯", "AI IP 企劃", "AI IP 企劃", "AI IP 企劃", "AI IP 企劃",
  "電商視覺", "行銷企劃", "周邊商品", "平面設計", "貼圖與長文", "Banner 設計", "電商長圖", "模擬設計",
  "模擬設計", "模擬設計", "電商長圖", "刊物設計", "刊物設計", "周邊商品", "Banner 設計", "文宣設計",
  "文宣設計", "活動海報", "AR／VR", "3D 建模", "3D 建模", "3D 建模", "未來期許",
];

await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
for (let index = 0; index < 41; index += 1) {
  const page = index + 1;
  const slide = deck.slides.add();
  slide.background.fill = "#171441";

  const paper = slide.shapes.add({
    geometry: "roundRect",
    position: { left: 30, top: 30, width: 1220, height: 660 },
    fill: "#F6EFE5",
    line: { fill: "#DDB24B", width: 2 },
  });
  paper.borderRadius = 24;

  const bytes = await fs.readFile(path.join(workspaceDir, `public/images/portfolio/portfolio-${String(page).padStart(2, "0")}.webp`));
  slide.images.add({
    blob: bytes,
    contentType: "image/webp",
    alt: `李宛容作品集第 ${page} 頁`,
    fit: "contain",
    position: { left: 48, top: 54, width: 1184, height: 666 },
    geometry: "roundRect",
    borderRadius: 16,
  });

  const label = slide.shapes.add({
    geometry: "roundRect",
    position: { left: 62, top: 46, width: 230, height: 42 },
    fill: "#171441",
    line: { fill: "#DDB24B", width: 1 },
  });
  label.borderRadius = 18;
  label.text = sectionNames[index];
  label.text.style = { typeface: "PingFang TC", fontSize: 17, bold: true, color: "#F4D789", alignment: "center", verticalAlignment: "middle", autoFit: "shrinkText" };

  const marker = slide.shapes.add({
    geometry: "ellipse",
    position: { left: 1170, top: 45, width: 48, height: 48 },
    fill: "#DDB24B",
    line: { fill: "#171441", width: 1 },
  });
  marker.text = String(page).padStart(2, "0");
  marker.text.style = { typeface: "Georgia", fontSize: 14, bold: true, color: "#171441", alignment: "center", verticalAlignment: "middle", autoFit: "shrinkText" };

  slide.speakerNotes.textFrame.setText(`內容與作品圖片整理自李宛容提供的 41 頁作品集 PDF，第 ${page} 頁。`);
}

const candidatePath = path.join(stagingDir, "portfolio-redesign-candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidatePath);

for (let index = 0; index < deck.slides.items.length; index += 1) {
  const preview = await deck.export({ slide: deck.slides.items[index], format: "png", scale: 1 });
  await fs.writeFile(path.join(previewDir, `portfolio-${String(index + 1).padStart(2, "0")}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href);
await finalizePresentation({
  explicitTotalSlideCount: 41,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "/Users/kitty840219/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-heading-fit"],
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "portfolio-redesign.validation.json"),
});

console.log(finalPath);
