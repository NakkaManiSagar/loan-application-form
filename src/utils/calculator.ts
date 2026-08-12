import type { FormState, PreApprovalResult } from '../types/loanForm';

/**
 * Annual interest rates per loan type
 */
export const INTEREST_RATES = {
  personal: 11.5, // 11.5% p.a.
  home: 8.4,      // 8.4% p.a.
  business: 13.0, // 13.0% p.a.
};

/**
 * Calculates Monthly EMI using standard formula:
 * EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * @param principal Loan Amount in INR
 * @param annualRate Annual interest rate in % (e.g. 10.5)
 * @param tenureMonths Loan tenure in months
 */
export function calculateMonthlyEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (!principal || !tenureMonths || principal <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / tenureMonths);

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}

export interface AmortizationRow {
  month: number;
  beginningBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

/**
 * Generates Amortization Schedule Breakdown
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  maxMonths: number = 12
): AmortizationRow[] {
  const emi = calculateMonthlyEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const schedule: AmortizationRow[] = [];

  const renderLimit = Math.min(tenureMonths, maxMonths);

  for (let month = 1; month <= renderLimit; month++) {
    const interestPaid = Math.round(balance * monthlyRate);
    const principalPaid = Math.min(balance, emi - interestPaid);
    const endingBalance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      beginningBalance: balance,
      emi,
      principalPaid,
      interestPaid,
      endingBalance,
    });

    balance = endingBalance;
  }

  return schedule;
}

/**
 * Pre-approval Score Engine (0 to 100)
 * Evaluates applicant across 5 key pillars:
 * 1. Income & Existing Obligations (Debt-to-Income FOIR ratio)
 * 2. Work Experience & Employment Stability
 * 3. Credit Score & KYC Verification Status
 * 4. Loan-to-Value (LTV) / Business Turnover Ratio
 * 5. Document Completeness
 */
export function evaluatePreApproval(state: FormState): PreApprovalResult {
  const { loanType, loanAmount, tenureMonths } = state.step1;
  const { netMonthlyIncome, existingMonthlyEmis, totalExperienceYears } = state.step4;
  const { selfReportedCreditScore, ifscVerified } = state.step6;
  const { panVerified, aadhaarVerified } = state.step2;

  const annualRate = INTEREST_RATES[loanType] || 11.0;
  const proposedEMI = calculateMonthlyEMI(loanAmount, annualRate, tenureMonths);

  const totalMonthlyDebt = (existingMonthlyEmis || 0) + proposedEMI;
  const debtToIncomeRatio = netMonthlyIncome > 0 ? (totalMonthlyDebt / netMonthlyIncome) * 100 : 100;

  // Score Pillars (Total 100)
  let score = 0;

  // Pillar 1: Debt-to-Income Ratio (30 Points)
  if (debtToIncomeRatio <= 35) score += 30;
  else if (debtToIncomeRatio <= 50) score += 22;
  else if (debtToIncomeRatio <= 65) score += 12;
  else score += 0;

  // Pillar 2: Credit Score (25 Points)
  const creditScore = selfReportedCreditScore || 700;
  if (creditScore >= 780) score += 25;
  else if (creditScore >= 740) score += 20;
  else if (creditScore >= 680) score += 14;
  else if (creditScore >= 620) score += 8;
  else score += 2;

  // Pillar 3: KYC & Verification Status (20 Points)
  if (panVerified) score += 8;
  if (aadhaarVerified) score += 8;
  if (ifscVerified) score += 4;

  // Pillar 4: Employment & Experience (15 Points)
  if (totalExperienceYears >= 5) score += 15;
  else if (totalExperienceYears >= 2) score += 10;
  else score += 5;

  // Pillar 5: Loan-Specific Multiplier (10 Points)
  if (loanType === 'home') {
    const marketValue = state.step5.homeLoan.estimatedMarketValue || 1;
    const downPayment = state.step5.homeLoan.downPaymentAmount || 0;
    const ltvRatio = ((marketValue - downPayment) / marketValue) * 100;
    if (ltvRatio <= 75) score += 10;
    else if (ltvRatio <= 85) score += 6;
  } else if (loanType === 'business') {
    const turnover = state.step5.businessLoan.annualTurnover || 1;
    if (turnover >= loanAmount * 2.5) score += 10;
    else if (turnover >= loanAmount * 1.5) score += 6;
  } else {
    // Personal loan: credit cards count check
    const ccCount = state.step5.personalLoan.creditCardsCount || 0;
    if (ccCount <= 3) score += 10;
    else score += 5;
  }

  score = Math.min(100, Math.max(10, score));

  // Determine Approval Band
  let status: 'pre_approved' | 'conditional_approval' | 'under_review' = 'under_review';
  let approvedAmount = loanAmount;
  let finalRate = annualRate;

  if (score >= 75) {
    status = 'pre_approved';
    approvedAmount = loanAmount;
    finalRate = Math.max(7.5, annualRate - 0.5); // Preferred interest rate discount
  } else if (score >= 50) {
    status = 'conditional_approval';
    approvedAmount = Math.round(loanAmount * 0.85); // 85% pre-approval
    finalRate = annualRate;
  } else {
    status = 'under_review';
    approvedAmount = Math.round(loanAmount * 0.65);
    finalRate = annualRate + 1.0;
  }

  const finalEMI = calculateMonthlyEMI(approvedAmount, finalRate, tenureMonths);
  const totalRepayment = finalEMI * tenureMonths;
  const totalInterest = totalRepayment - approvedAmount;

  // Max Eligible Loan Amount based on 50% max FOIR
  const maxAvailableMonthlyEMI = Math.max(0, netMonthlyIncome * 0.5 - (existingMonthlyEmis || 0));
  const maxEligibleAmount = Math.round(
    (maxAvailableMonthlyEMI * (Math.pow(1 + finalRate / 12 / 100, tenureMonths) - 1)) /
    ((finalRate / 12 / 100) * Math.pow(1 + finalRate / 12 / 100, tenureMonths))
  );

  const appId = `ZB-${loanType.toUpperCase().substring(0, 2)}-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    applicationId: appId,
    submittedAt: new Date().toISOString(),
    score,
    status,
    approvedAmount,
    interestRate: parseFloat(finalRate.toFixed(2)),
    monthlyEMI: finalEMI,
    totalRepayment,
    totalInterest,
    maxEligibleAmount: Math.max(approvedAmount, maxEligibleAmount),
    debtToIncomeRatio: parseFloat(debtToIncomeRatio.toFixed(1)),
  };
}
