export type AccountingToolId =
  | "profit"
  | "cost"
  | "split"
  | "invoice"
  | "tax"
  | "payroll"
  | "laborInsurance"
  | "company"
  | "rental";

export type AccountingTool = {
  id: AccountingToolId;
  label: string;
  desc: string;
  icon: string;
  tone: "green" | "purple" | "orange" | "pink" | "blue" | "teal" | "rose" | "mint";
};

export const ACCOUNTING_TOOLS: AccountingTool[] = [
  { id: "profit", label: "利潤小幫手", desc: "快速計算利潤與利潤率，了解實際獲利狀況", icon: "🧮", tone: "green" },
  { id: "split", label: "分潤小幫手", desc: "輸入金額與比例，自動計算分潤金額", icon: "🤝", tone: "purple" },
  { id: "cost", label: "成本小幫手", desc: "計算各項成本與成本率，掌握成本結構", icon: "📦", tone: "orange" },
  { id: "invoice", label: "發票小幫手", desc: "開立發票、計算稅額，二聯／三聯發票", icon: "🧾", tone: "pink" },
  { id: "tax", label: "營業稅小幫手", desc: "計算銷項、進項與應繳稅額，一目了然", icon: "📊", tone: "blue" },
  { id: "company", label: "公司設立小幫手", desc: "一步步引導你完成公司設立", icon: "🏢", tone: "teal" },
  { id: "payroll", label: "薪資小幫手", desc: "計算薪資、扣繳與勞健保，讓薪資計算更輕鬆", icon: "🧑‍💼", tone: "rose" },
  { id: "laborInsurance", label: "勞健保小幫手", desc: "計算勞健保金額與公司負擔", icon: "🛡️", tone: "mint" },
  { id: "rental", label: "租金扣繳小幫手", desc: "支付房東租金，快速算出扣繳稅額與補充保費", icon: "🏠", tone: "blue" },
];
