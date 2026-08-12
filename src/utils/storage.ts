import type { FormState } from '../types/loanForm';

const STORAGE_KEY = 'zetheta_workbridge_loan_application_draft_v1';

export const INITIAL_FORM_STATE: FormState = {
  currentStep: 1,
  completedSteps: [],
  step1: {
    loanType: 'personal',
    loanAmount: 500000,
    tenureMonths: 36,
    purpose: 'Personal Expenses & Medical',
  },
  step2: {
    fullName: '',
    dob: '',
    gender: 'male',
    maritalStatus: 'single',
    panNumber: '',
    panVerified: false,
    aadhaarNumber: '',
    aadhaarVerified: false,
  },
  step3: {
    email: '',
    mobile: '',
    residenceType: 'rented',
    currentAddress: { street: '', city: '', state: '', pincode: '' },
    sameAsCurrent: true,
    permanentAddress: { street: '', city: '', state: '', pincode: '' },
    yearsAtCurrentAddress: 3,
  },
  step4: {
    employmentType: 'salaried',
    companyName: '',
    designation: 'Software Engineer',
    totalExperienceYears: 4,
    netMonthlyIncome: 85000,
    existingMonthlyEmis: 12000,
  },
  step5: {
    personalLoan: {
      creditCardsCount: 1,
      totalCreditCardLimit: 150000,
      hasExistingLoans: false,
      guarantorRequired: false,
    },
    homeLoan: {
      propertyType: 'apartment',
      propertyLocation: 'Bengaluru',
      estimatedMarketValue: 6000000,
      downPaymentAmount: 1200000,
      builderName: 'Prestige Group',
      propertyStatus: 'under_construction',
    },
    businessLoan: {
      gstin: '',
      gstinVerified: false,
      businessType: 'proprietorship',
      annualTurnover: 2500000,
      yearsInBusiness: 3,
      businessPan: '',
    },
  },
  step6: {
    bankName: 'HDFC Bank',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    ifscVerified: false,
    branchName: '',
    accountType: 'savings',
    selfReportedCreditScore: 750,
  },
  step7: {
    documents: {},
  },
  step8: {
    termsAccepted: false,
    privacyAccepted: false,
    creditCheckConsent: false,
    signatureDataUrl: '',
  },
  isAutoSaved: false,
};

/**
 * Save draft state to LocalStorage
 */
export function saveDraft(state: FormState): boolean {
  try {
    const dataToSave: FormState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
      isAutoSaved: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Failed to save application draft to local storage:', error);
    return false;
  }
}

/**
 * Load draft state from LocalStorage
 */
export function loadDraft(): FormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FormState;
    return parsed;
  } catch (error) {
    console.error('Failed to parse draft from local storage:', error);
    return null;
  }
}

/**
 * Clear saved draft
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear draft from local storage:', error);
  }
}

/**
 * Export application payload as encrypted/encoded token JSON
 */
export function exportDraftToken(state: FormState): string {
  try {
    const payload = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(payload)));
  } catch (e) {
    console.error('Failed to export draft token:', e);
    return '';
  }
}

/**
 * Import application state from encoded token string
 */
export function importDraftToken(tokenStr: string): FormState | null {
  try {
    const jsonStr = decodeURIComponent(escape(atob(tokenStr.trim())));
    return JSON.parse(jsonStr) as FormState;
  } catch (e) {
    console.error('Invalid token format:', e);
    return null;
  }
}
