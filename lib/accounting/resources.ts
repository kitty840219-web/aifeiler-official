export type AccountingResource = {
  name: string;
  note: string;
  url: string;
};

export const ACCOUNTING_RESOURCES: AccountingResource[] = [
  { name: "勞動部", note: "勞動法規、勞資爭議申訴", url: "https://www.mol.gov.tw" },
  { name: "勞工保險局", note: "勞保、勞退投保與給付", url: "https://www.bli.gov.tw" },
  { name: "衛生福利部中央健康保險署", note: "健保投保與費率", url: "https://www.nhi.gov.tw" },
  { name: "全國法規資料庫", note: "查詢現行法規原文", url: "https://law.moj.gov.tw" },
  { name: "財政部稅務入口網", note: "發票、營業稅、所得稅申報", url: "https://www.etax.nat.gov.tw" },
];
