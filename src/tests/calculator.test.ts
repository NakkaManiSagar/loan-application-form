import { describe, it, expect } from 'vitest';
import { calculateMonthlyEMI, evaluatePreApproval, generateAmortizationSchedule } from '../utils/calculator';
import { INITIAL_FORM_STATE } from '../utils/storage';
import type { FormState } from '../types/loanForm';

describe('Calculator & Pre-Approval Scoring Engine Tests', () => {
  it('should accurately calculate monthly EMI using standard formula', () => {
    // Principal = 100,000, Interest = 12% p.a., Tenure = 12 months
    const emi = calculateMonthlyEMI(100000, 12, 12);
    expect(emi).toBeGreaterThan(8800);
    expect(emi).toBeLessThan(8900); // exact EMI ~8,885
  });

  it('should generate amortization schedule rows correctly', () => {
    const rows = generateAmortizationSchedule(500000, 11.5, 36, 12);
    expect(rows).toHaveLength(12);
    expect(rows[0].month).toBe(1);
    expect(rows[0].beginningBalance).toBe(500000);
    expect(rows[0].endingBalance).toBeLessThan(500000);
  });

  it('should evaluate high-credit applicant with a Pre-Approved score >= 75', () => {
    const highCreditState: FormState = {
      ...INITIAL_FORM_STATE,
      step1: { loanType: 'personal', loanAmount: 500000, tenureMonths: 36, purpose: 'Medical' },
      step2: { ...INITIAL_FORM_STATE.step2, fullName: 'John Doe', panVerified: true, aadhaarVerified: true },
      step4: { ...INITIAL_FORM_STATE.step4, netMonthlyIncome: 150000, existingMonthlyEmis: 10000, totalExperienceYears: 8 },
      step6: { ...INITIAL_FORM_STATE.step6, selfReportedCreditScore: 800, ifscVerified: true },
    };

    const res = evaluatePreApproval(highCreditState);
    expect(res.score).toBeGreaterThanOrEqual(75);
    expect(res.status).toBe('pre_approved');
    expect(res.monthlyEMI).toBeGreaterThan(0);
    expect(res.applicationId).toMatch(/^ZB-PE-/);
  });
});
