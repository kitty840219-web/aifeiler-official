// 所有試算皆為簡化參考版本，實際金額請以正式帳務／稅務資料為準。

export function calcProfit(price: number, cost: number, platformFeePercent: number, shippingFee: number, adFee: number) {
  const platformFee = Math.round((price * platformFeePercent) / 100);
  const profit = price - cost - platformFee - shippingFee - adFee;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  return { platformFee, profit, margin: Math.round(margin * 10) / 10 };
}

export type CostItem = { label: string; amount: number };

export function calcCost(items: CostItem[], sellingPrice: number) {
  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const ratio = sellingPrice > 0 ? (total / sellingPrice) * 100 : 0;
  return { total, ratio: Math.round(ratio * 10) / 10 };
}

export type SplitShare = { label: string; percent: number };

export function calcSplit(total: number, shares: SplitShare[]) {
  const percentSum = shares.reduce((sum, s) => sum + (s.percent || 0), 0);
  const results = shares.map((s) => ({ label: s.label, percent: s.percent, amount: Math.round((total * s.percent) / 100) }));
  return { results, percentSum };
}

const TAIWAN_VAT_RATE = 0.05;

export function calcInvoiceFromTaxIncluded(taxIncluded: number) {
  const untaxed = Math.round(taxIncluded / (1 + TAIWAN_VAT_RATE));
  const tax = taxIncluded - untaxed;
  return { untaxed, tax, taxIncluded };
}

export function calcInvoiceFromUntaxed(untaxed: number) {
  const tax = Math.round(untaxed * TAIWAN_VAT_RATE);
  const taxIncluded = untaxed + tax;
  return { untaxed, tax, taxIncluded };
}

export function calcBusinessTax(salesTax: number, purchaseTax: number) {
  const payable = Math.max(0, salesTax - purchaseTax);
  const refundable = Math.max(0, purchaseTax - salesTax);
  return { payable, refundable };
}

// 簡化參考費率（一般型上班族／負責人適用，實際請以勞保局、健保署最新公告費率為準）。
const LABOR_INSURANCE_RATE = 0.115; // 勞保（含就業保險）
const LABOR_EMPLOYEE_SHARE = 0.2;
const LABOR_EMPLOYER_SHARE = 0.7;
const HEALTH_INSURANCE_RATE = 0.0517;
const HEALTH_EMPLOYEE_SHARE = 0.3;
const HEALTH_EMPLOYER_SHARE = 0.6;
const PENSION_EMPLOYER_RATE = 0.06; // 勞退雇主提撥（強制最低 6%）

// 健保雇主負擔採全國平均眷屬數 0.56 人計算（即 1.56 人），與員工實際眷屬數無關；
// 員工負擔則依本人實際眷屬數計算，最多計收至本人＋3 位眷屬。
const HEALTH_EMPLOYER_AVERAGE_UNITS = 1.56;

export function calcLaborInsurance(insuredSalary: number, dependents = 0) {
  const laborTotal = Math.round(insuredSalary * LABOR_INSURANCE_RATE);
  const laborEmployee = Math.round(laborTotal * LABOR_EMPLOYEE_SHARE);
  const laborEmployer = Math.round(laborTotal * LABOR_EMPLOYER_SHARE);

  const healthEmployeeUnits = Math.min(1 + dependents, 4);
  const healthEmployee = Math.round(insuredSalary * HEALTH_INSURANCE_RATE * healthEmployeeUnits * HEALTH_EMPLOYEE_SHARE);
  const healthEmployer = Math.round(insuredSalary * HEALTH_INSURANCE_RATE * HEALTH_EMPLOYER_AVERAGE_UNITS * HEALTH_EMPLOYER_SHARE);

  const pensionEmployer = Math.round(insuredSalary * PENSION_EMPLOYER_RATE);

  const employeeTotal = laborEmployee + healthEmployee;
  const employerTotal = laborEmployer + healthEmployer + pensionEmployer;

  return {
    laborTotal, laborEmployee, laborEmployer,
    healthEmployee, healthEmployer,
    pensionEmployer,
    employeeTotal, employerTotal,
  };
}

export function calcPayroll(baseSalary: number, bonus: number, insuranceDeduction: number, incomeTaxWithheld: number) {
  const gross = baseSalary + bonus;
  const netPay = gross - insuranceDeduction - incomeTaxWithheld;
  return { gross, netPay };
}

// 租金扣繳：公司／行號支付租金給「個人」房東時需扣繳所得稅；月租金達 20,010 元（113 年起）需另計二代健保補充保費。
const RENTAL_WITHHOLDING_RATE = 0.1;
const RENTAL_SUPPLEMENTARY_PREMIUM_RATE = 0.0211;
const RENTAL_SUPPLEMENTARY_PREMIUM_THRESHOLD = 20010;

export function calcRentalWithholding(rent: number, landlordType: "individual" | "company") {
  if (landlordType === "company") {
    return { withholding: 0, supplementaryPremium: 0, netPayment: rent, needsWithholding: false };
  }
  const withholding = Math.round(rent * RENTAL_WITHHOLDING_RATE);
  const supplementaryPremium = rent >= RENTAL_SUPPLEMENTARY_PREMIUM_THRESHOLD ? Math.round(rent * RENTAL_SUPPLEMENTARY_PREMIUM_RATE) : 0;
  const netPayment = rent - withholding - supplementaryPremium;
  return { withholding, supplementaryPremium, netPayment, needsWithholding: true };
}
