import type { Metadata } from "next";
import AccountingHelper from "@/components/accounting/AccountingHelper";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `會計小幫手 ｜ ${SITE.brand}`,
  description: "艾飛樂會計小幫手：利潤、成本、分潤、發票、營業稅、薪資、勞健保試算，還有 AI 會計問答。",
};

export default function AccountingPage() {
  return <AccountingHelper />;
}
