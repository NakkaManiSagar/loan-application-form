import { describe, it, expect } from 'vitest';
import { 
  validateStep1, validateStep4, validateStep5, 
  PAN_REGEX, AADHAAR_REGEX, GSTIN_REGEX, calculateAge 
} from '../utils/validation';
import { INITIAL_FORM_STATE } from '../utils/storage';
import type { FormState } from '../types/loanForm';

describe('Validation Engine Tests', () => {
  it('should validate PAN card format correctly', () => {
    expect(PAN_REGEX.test('ABCDE1234F')).toBe(true);
    expect(PAN_REGEX.test('invalid-pan')).toBe(false);
    expect(PAN_REGEX.test('12345ABCDE')).toBe(false);
  });

  it('should validate Aadhaar 12-digit format correctly', () => {
    expect(AADHAAR_REGEX.test('987654321012')).toBe(true);
    expect(AADHAAR_REGEX.test('1234')).toBe(false);
    expect(AADHAAR_REGEX.test('012345678901')).toBe(false); // cannot start with 0 or 1
  });

  it('should validate GSTIN 15-character format correctly', () => {
    expect(GSTIN_REGEX.test('22AAAAA0000A1Z5')).toBe(true);
    expect(GSTIN_REGEX.test('INVALIDGSTIN')).toBe(false);
  });

  it('should correctly calculate age from DOB', () => {
    expect(calculateAge('2000-01-01')).toBeGreaterThanOrEqual(25);
    expect(calculateAge('2020-01-01')).toBe(6);
  });

  it('should fail Step 1 validation if loan amount is out of bounds', () => {
    const invalidState: FormState = {
      ...INITIAL_FORM_STATE,
      step1: {
        ...INITIAL_FORM_STATE.step1,
        loanType: 'personal',
        loanAmount: 1000, // min is 10,000
      },
    };
    const res = validateStep1(invalidState);
    expect(res.isValid).toBe(false);
    expect(res.errors.loanAmount).toBeDefined();
  });

  it('should pass Step 1 validation for valid inputs', () => {
    const validState: FormState = {
      ...INITIAL_FORM_STATE,
      step1: {
        loanType: 'personal',
        loanAmount: 500000,
        tenureMonths: 36,
        purpose: 'Medical Expenses',
      },
    };
    const res = validateStep1(validState);
    expect(res.isValid).toBe(true);
  });

  it('should enforce cross-step FOIR rule in Step 4 (EMIs > 50% of income)', () => {
    const state: FormState = {
      ...INITIAL_FORM_STATE,
      step4: {
        ...INITIAL_FORM_STATE.step4,
        netMonthlyIncome: 50000,
        existingMonthlyEmis: 30000, // 60% FOIR
      },
    };
    const res = validateStep4(state);
    expect(res.isValid).toBe(false);
    expect(res.errors.existingMonthlyEmis).toContain('exceed 50%');
  });

  it('should enforce home loan down payment minimum 10% in Step 5', () => {
    const state: FormState = {
      ...INITIAL_FORM_STATE,
      step1: { ...INITIAL_FORM_STATE.step1, loanType: 'home' },
      step5: {
        ...INITIAL_FORM_STATE.step5,
        homeLoan: {
          propertyType: 'apartment',
          propertyLocation: 'Bengaluru',
          estimatedMarketValue: 5000000,
          downPaymentAmount: 200000, // Only 4%, required min 10% (500,000)
          builderName: 'Prestige',
          propertyStatus: 'ready_to_move',
        },
      },
    };
    const res = validateStep5(state);
    expect(res.isValid).toBe(false);
    expect(res.errors['home.downPaymentAmount']).toBeDefined();
  });
});
