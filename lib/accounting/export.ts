export type ExportRow = { label: string; value: string };

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportRowsAsExcel(filename: string, title: string, rows: ExportRow[]) {
  const lines = [[title, ""], ...rows.map((r) => [r.label, r.value])];
  const csv = "﻿" + lines.map((cols) => cols.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export async function exportNodeAsJpg(node: HTMLElement, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(node, { backgroundColor: "#181542", scale: 2 });
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) return;
  triggerDownload(blob, `${filename}.jpg`);
}
