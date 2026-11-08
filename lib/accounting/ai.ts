import { TAROT_API_URL } from "@/lib/tarot/ai";
import { ACCOUNTING_TOOLS, type AccountingToolId } from "./tools";
import { ACCOUNTING_RESOURCES } from "./resources";

export type AccountingAnswer = {
  answer: string;
  suggestedTool: AccountingToolId | "";
  suggestedResource: string;
};

const TOOL_LABEL_TO_ID = Object.fromEntries(ACCOUNTING_TOOLS.map((t) => [t.label, t.id])) as Record<string, AccountingToolId>;
const RESOURCE_NAMES = new Set(ACCOUNTING_RESOURCES.map((r) => r.name));

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function post(question: string): Promise<AccountingAnswer> {
  const response = await fetch(TAROT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "accounting_qa", question }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "小幫手暫時無法回答，請稍後再試");
  const suggestedLabel = typeof data?.suggestedTool === "string" ? data.suggestedTool : "";
  const suggestedResource = typeof data?.suggestedResource === "string" && RESOURCE_NAMES.has(data.suggestedResource) ? data.suggestedResource : "";
  return {
    answer: typeof data?.answer === "string" ? data.answer : "",
    suggestedTool: TOOL_LABEL_TO_ID[suggestedLabel] || "",
    suggestedResource,
  };
}

export async function askAccountingAi(question: string): Promise<AccountingAnswer> {
  try {
    return await post(question);
  } catch (error) {
    // A bare "Failed to fetch" is usually a transient network/cold-start hiccup, not a real
    // server error — retry once before surfacing it to the user.
    if (error instanceof TypeError) {
      await sleep(800);
      try {
        return await post(question);
      } catch {
        throw new Error("小幫手暫時連不上，請稍後再試一次");
      }
    }
    throw error;
  }
}
