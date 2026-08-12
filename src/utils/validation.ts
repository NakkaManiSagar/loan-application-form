import type { FormState, StepValidationResult } from '../types/loanForm';

// Regular Expressions for Indian Financial Form Formats
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const AADHAAR_REGEX = /^[2-9]{1}[0-9]{11}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

/**
 * Calculates applicant age from DOB string YYYY-MM-DD
 */
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Step 1 Validation: Loan Selection & Purpose
 */
export function validateStep1(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { loanType, loanAmount, tenureMonths, purpose } = state.step1;

  if (!loanType) {
    errors.loanType = 'Please select a loan type';
  }

  // Amount limits per loan type
  let minAmount = 10000;
  let maxAmount = 5000000;
  if (loanType === 'home') {
    minAmount = 500000;
    maxAmount = 50000000;
  } else if (loanType === 'business') {
    minAmount = 100000;
    maxAmount = 20000000;
  }

  if (!loanAmount || loanAmount < minAmount || loanAmount > maxAmount) {
    errors.loanAmount = `Loan amount for ${loanType?.toUpperCase() || 'this'} loan must be between ₹${minAmount.toLocaleString('en-IN')} and ₹${maxAmount.toLocaleString('en-IN')}`;
  }

  if (!tenureMonths || tenureMonths < 6 || tenureMonths > 360) {
    errors.tenureMonths = 'Tenure must be between 6 and 360 months';
  }

  if (!purpose || purpose.trim().length < 3) {
    errors.purpose = 'Please state the purpose of the loan';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 2 Validation: Personal & KYC Details
 */
export function validateStep2(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { fullName, dob, gender, maritalStatus, panNumber, panVerified, aadhaarNumber, aadhaarVerified } = state.step2;

  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = 'Full Name must be at least 3 characters as per PAN card';
  }

  if (!dob) {
    errors.dob = 'Date of Birth is required';
  } else {
    const age = calculateAge(dob);
    if (age < 21 || age > 65) {
      errors.dob = `Applicant must be between 21 and 65 years old (Current age: ${age})`;
    }
  }

  if (!gender) errors.gender = 'Gender selection is required';
  if (!maritalStatus) errors.maritalStatus = 'Marital status is required';

  if (!panNumber || !PAN_REGEX.test(panNumber.toUpperCase())) {
    errors.panNumber = 'Enter a valid 10-character PAN (e.g. ABCDE1234F)';
  } else if (!panVerified) {
    errors.panNumber = 'Please click verify to validate PAN status';
  }

  if (!aadhaarNumber || !AADHAAR_REGEX.test(aadhaarNumber)) {
    errors.aadhaarNumber = 'Enter a valid 12-digit Aadhaar Number';
  } else if (!aadhaarVerified) {
    errors.aadhaarNumber = 'Aadhaar OTP verification is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 3 Validation: Contact & Address
 */
export function validateStep3(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { email, mobile, residenceType, currentAddress, sameAsCurrent, permanentAddress, yearsAtCurrentAddress } = state.step3;

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!mobile || !MOBILE_REGEX.test(mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
  }

  if (!residenceType) errors.residenceType = 'Residence ownership status is required';

  if (!currentAddress.street || currentAddress.street.trim().length < 5) {
    errors['currentAddress.street'] = 'Current street address must be at least 5 characters';
  }
  if (!currentAddress.city) errors['currentAddress.city'] = 'City is required';
  if (!currentAddress.state) errors['currentAddress.state'] = 'State is required';
  if (!currentAddress.pincode || !PINCODE_REGEX.test(currentAddress.pincode)) {
    errors['currentAddress.pincode'] = 'Enter a valid 6-digit Pincode';
  }

  if (!sameAsCurrent) {
    if (!permanentAddress.street || permanentAddress.street.trim().length < 5) {
      errors['permanentAddress.street'] = 'Permanent street address must be at least 5 characters';
    }
    if (!permanentAddress.city) errors['permanentAddress.city'] = 'Permanent city is required';
    if (!permanentAddress.state) errors['permanentAddress.state'] = 'Permanent state is required';
    if (!permanentAddress.pincode || !PINCODE_REGEX.test(permanentAddress.pincode)) {
      errors['permanentAddress.pincode'] = 'Enter a valid 6-digit Permanent Pincode';
    }
  }

  if (yearsAtCurrentAddress === undefined || yearsAtCurrentAddress < 0) {
    errors.yearsAtCurrentAddress = 'Please specify years at current address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 4 Validation: Employment & Income Details + Cross-step EMI Check
 */
export function validateStep4(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { employmentType, companyName, designation, totalExperienceYears, netMonthlyIncome, existingMonthlyEmis } = state.step4;

  if (!employmentType) errors.employmentType = 'Employment type is required';

  if (!companyName || companyName.trim().length < 2) {
    errors.companyName = employmentType === 'salaried' ? 'Employer/Company Name is required' : 'Business/Firm Name is required';
  }

  if (!designation || designation.trim().length < 2) {
    errors.designation = 'Designation/Role is required';
  }

  if (totalExperienceYears === undefined || totalExperienceYears < 0) {
    errors.totalExperienceYears = 'Years of total work experience is required';
  }

  if (!netMonthlyIncome || netMonthlyIncome < 15000) {
    errors.netMonthlyIncome = 'Net monthly income must be at least ₹15,000 for loan eligibility';
  }

  if (existingMonthlyEmis === undefined || existingMonthlyEmis < 0) {
    errors.existingMonthlyEmis = 'Existing monthly EMIs amount is required (enter 0 if none)';
  } else if (netMonthlyIncome && existingMonthlyEmis >= netMonthlyIncome * 0.5) {
    errors.existingMonthlyEmis = `Existing EMIs (₹${existingMonthlyEmis.toLocaleString('en-IN')}) exceed 50% of your monthly income. Maximum debt ratio exceeded.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 5 Validation: Divergent Loan Specific Details
 */
export function validateStep5(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const loanType = state.step1.loanType;

  if (loanType === 'personal') {
    const { guarantorRequired, guarantorDetails } = state.step5.personalLoan;
    if (guarantorRequired && guarantorDetails) {
      if (!guarantorDetails.name || guarantorDetails.name.trim().length < 3) {
        errors['guarantor.name'] = 'Guarantor full name is required';
      }
      if (!guarantorDetails.relation) errors['guarantor.relation'] = 'Relationship with guarantor is required';
      if (!guarantorDetails.mobile || !MOBILE_REGEX.test(guarantorDetails.mobile)) {
        errors['guarantor.mobile'] = 'Valid guarantor mobile number is required';
      }
      if (!guarantorDetails.monthlyIncome || guarantorDetails.monthlyIncome < 20000) {
        errors['guarantor.monthlyIncome'] = 'Guarantor monthly income must be at least ₹20,000';
      }
    }
  } else if (loanType === 'home') {
    const { propertyType, propertyLocation, estimatedMarketValue, downPaymentAmount, builderName, propertyStatus } = state.step5.homeLoan;
    if (!propertyType) errors['home.propertyType'] = 'Property type is required';
    if (!propertyLocation || propertyLocation.trim().length < 3) errors['home.propertyLocation'] = 'Property location/city is required';
    if (!builderName || builderName.trim().length < 2) errors['home.builderName'] = 'Builder/Project name is required';
    if (!propertyStatus) errors['home.propertyStatus'] = 'Property status is required';

    if (!estimatedMarketValue || estimatedMarketValue < 500000) {
      errors['home.estimatedMarketValue'] = 'Property market value must be at least ₹5,00,000';
    }

    // Cross-step: Down payment must be at least 10% of market value
    const minDownPayment = estimatedMarketValue ? estimatedMarketValue * 0.10 : 0;
    if (!downPaymentAmount || downPaymentAmount < minDownPayment) {
      errors['home.downPaymentAmount'] = `Down payment must be at least 10% of property value (Min: ₹${minDownPayment.toLocaleString('en-IN')})`;
    }
  } else if (loanType === 'business') {
    const { gstin, gstinVerified, businessType, annualTurnover, yearsInBusiness, businessPan } = state.step5.businessLoan;
    if (!businessType) errors['business.businessType'] = 'Business registration type is required';

    if (!gstin || !GSTIN_REGEX.test(gstin.toUpperCase())) {
      errors['business.gstin'] = 'Enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5)';
    } else if (!gstinVerified) {
      errors['business.gstin'] = 'GSTIN verification is required';
    }

    if (!businessPan || !PAN_REGEX.test(businessPan.toUpperCase())) {
      errors['business.businessPan'] = 'Enter valid Business PAN';
    }

    if (!yearsInBusiness || yearsInBusiness < 1) {
      errors['business.yearsInBusiness'] = 'Business must be operational for at least 1 year';
    }

    // Cross-step: Annual turnover must be at least 1.5x the requested loan amount
    const reqAmount = state.step1.loanAmount || 0;
    const minTurnover = reqAmount * 1.5;
    if (!annualTurnover || annualTurnover < minTurnover) {
      errors['business.annualTurnover'] = `Annual turnover (₹${annualTurnover?.toLocaleString('en-IN') || 0}) must be at least 1.5x of requested loan amount (Min: ₹${minTurnover.toLocaleString('en-IN')})`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 6 Validation: Bank & Financial Verification
 */
export function validateStep6(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { bankName, accountNumber, confirmAccountNumber, ifscCode, ifscVerified, accountType } = state.step6;

  if (!bankName) errors.bankName = 'Bank Name is required';
  if (!accountType) errors.accountType = 'Account Type selection is required';

  if (!accountNumber || accountNumber.length < 9 || !/^\d+$/.test(accountNumber)) {
    errors.accountNumber = 'Enter a valid 9-18 digit account number';
  }

  if (confirmAccountNumber !== accountNumber) {
    errors.confirmAccountNumber = 'Account numbers do not match';
  }

  if (!ifscCode || !IFSC_REGEX.test(ifscCode.toUpperCase())) {
    errors.ifscCode = 'Enter a valid 11-character IFSC Code (e.g. SBIN0001234)';
  } else if (!ifscVerified) {
    errors.ifscCode = 'Please verify IFSC Code to fetch branch details';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 7 Validation: Document Uploads
 */
export function validateStep7(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const docs = state.step7.documents;
  const loanType = state.step1.loanType;

  if (!docs.pan) {
    errors.pan = 'PAN card document upload is required';
  }
  if (!docs.aadhaar) {
    errors.aadhaar = 'Aadhaar card document upload is required';
  }
  if (!docs.income_proof) {
    errors.income_proof = 'Income Proof / Salary Slips / ITR document is required';
  }
  if (!docs.bank_statement) {
    errors.bank_statement = 'Recent 6-month Bank Statement is required';
  }

  if (loanType === 'home' && !docs.loan_specific_doc) {
    errors.loan_specific_doc = 'Property allotment / Sale deed document is required for Home Loan';
  } else if (loanType === 'business' && !docs.loan_specific_doc) {
    errors.loan_specific_doc = 'GST Registration Certificate is required for Business Loan';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 8 Validation: Review & E-Signature
 */
export function validateStep8(state: FormState): StepValidationResult {
  const errors: Record<string, string> = {};
  const { termsAccepted, privacyAccepted, creditCheckConsent, signatureDataUrl } = state.step8;

  if (!termsAccepted) {
    errors.termsAccepted = 'You must accept the Terms and Conditions to proceed';
  }
  if (!privacyAccepted) {
    errors.privacyAccepted = 'You must accept the Privacy Policy';
  }
  if (!creditCheckConsent) {
    errors.creditCheckConsent = 'Credit bureau check authorization is mandatory';
  }
  if (!signatureDataUrl || signatureDataUrl.length < 500) {
    errors.signatureDataUrl = 'Please provide your digital e-signature on the canvas';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * General Step Validator by Step Number
 */
export function validateStep(stepIndex: number, state: FormState): StepValidationResult {
  switch (stepIndex) {
    case 1: return validateStep1(state);
    case 2: return validateStep2(state);
    case 3: return validateStep3(state);
    case 4: return validateStep4(state);
    case 5: return validateStep5(state);
    case 6: return validateStep6(state);
    case 7: return validateStep7(state);
    case 8: return validateStep8(state);
    default: return { isValid: true, errors: {} };
  }
}
