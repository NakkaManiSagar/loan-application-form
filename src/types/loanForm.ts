export type LoanType = 'personal' | 'home' | 'business';
export type EmploymentType = 'salaried' | 'self-employed' | 'business-owner';
export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'other';
export type ResidenceType = 'owned' | 'rented' | 'parental' | 'company_provided';
export type PropertyType = 'apartment' | 'independent_house' | 'plot' | 'commercial';
export type PropertyStatus = 'under_construction' | 'ready_to_move' | 'resale';
export type BusinessType = 'proprietorship' | 'partnership' | 'pvtltd' | 'llp';
export type AccountType = 'savings' | 'current';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface GuarantorDetails {
  name: string;
  relation: string;
  mobile: string;
  monthlyIncome: number;
}

export interface PersonalLoanDetails {
  creditCardsCount: number;
  totalCreditCardLimit: number;
  hasExistingLoans: boolean;
  guarantorRequired: boolean;
  guarantorDetails?: GuarantorDetails;
}

export interface HomeLoanDetails {
  propertyType: PropertyType;
  propertyLocation: string;
  estimatedMarketValue: number;
  downPaymentAmount: number;
  builderName: string;
  propertyStatus: PropertyStatus;
}

export interface BusinessLoanDetails {
  gstin: string;
  gstinVerified: boolean;
  businessType: BusinessType;
  annualTurnover: number;
  yearsInBusiness: number;
  businessPan: string;
}

export interface DocumentFile {
  id: string;
  docType: 'pan' | 'aadhaar' | 'income_proof' | 'bank_statement' | 'loan_specific_doc';
  name: string;
  fileType: string;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface FormStep1 {
  loanType: LoanType;
  loanAmount: number;
  tenureMonths: number;
  purpose: string;
}

export interface FormStep2 {
  fullName: string;
  dob: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  panNumber: string;
  panVerified: boolean;
  panHolderName?: string;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
}

export interface FormStep3 {
  email: string;
  mobile: string;
  residenceType: ResidenceType;
  currentAddress: Address;
  sameAsCurrent: boolean;
  permanentAddress: Address;
  yearsAtCurrentAddress: number;
}

export interface FormStep4 {
  employmentType: EmploymentType;
  companyName: string;
  designation: string;
  totalExperienceYears: number;
  netMonthlyIncome: number;
  existingMonthlyEmis: number;
}

export interface FormStep5 {
  personalLoan: PersonalLoanDetails;
  homeLoan: HomeLoanDetails;
  businessLoan: BusinessLoanDetails;
}

export interface FormStep6 {
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  ifscVerified: boolean;
  branchName: string;
  accountType: AccountType;
  selfReportedCreditScore: number;
}

export interface FormStep7 {
  documents: Record<string, DocumentFile>;
}

export interface FormStep8 {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  creditCheckConsent: boolean;
  signatureDataUrl: string;
}

export interface PreApprovalResult {
  applicationId: string;
  submittedAt: string;
  score: number; // 0 - 100
  status: 'pre_approved' | 'conditional_approval' | 'under_review';
  approvedAmount: number;
  interestRate: number; // e.g. 10.5%
  monthlyEMI: number;
  totalRepayment: number;
  totalInterest: number;
  maxEligibleAmount: number;
  debtToIncomeRatio: number;
}

export interface FormState {
  currentStep: number;
  completedSteps: number[]; // e.g. [1, 2, 3]
  step1: FormStep1;
  step2: FormStep2;
  step3: FormStep3;
  step4: FormStep4;
  step5: FormStep5;
  step6: FormStep6;
  step7: FormStep7;
  step8: FormStep8;
  preApproval?: PreApprovalResult;
  lastSavedAt?: string;
  isAutoSaved: boolean;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
