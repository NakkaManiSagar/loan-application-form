// Simulated APIs for PAN verification, Aadhaar OTP, IFSC Bank Lookup, Pincode address lookup

export interface PanVerificationResult {
  valid: boolean;
  name?: string;
  status?: string;
  category?: string;
  message: string;
}

export interface IfscLookupResult {
  valid: boolean;
  bankName?: string;
  branch?: string;
  city?: string;
  state?: string;
  message: string;
}

export interface PincodeLookupResult {
  valid: boolean;
  city?: string;
  district?: string;
  state?: string;
  message: string;
}

/**
 * Simulates real-time PAN Card API Verification with NSDL/UTIITSL backend lookup
 */
export async function verifyPanAPI(pan: string): Promise<PanVerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate 800ms API call latency
  
  const cleanPan = pan.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(cleanPan)) {
    return {
      valid: false,
      message: 'Invalid PAN format. PAN must be 10 characters (e.g. ABCDE1234F).',
    };
  }

  // Simulated database lookup based on last letter or standard mock names
  const mockNames: Record<string, string> = {
    P: 'INDIVIDUAL TAXPAYER',
    C: 'COMPANY ENTITY',
    H: 'HUF ENTITY',
    F: 'PARTNERSHIP FIRM',
  };

  const entityTypeChar = cleanPan.charAt(3);
  const entityType = mockNames[entityTypeChar] || 'INDIVIDUAL';

  return {
    valid: true,
    name: 'VERIFIED HOLDER (' + entityType + ')',
    status: 'ACTIVE & LINKED TO AADHAAR',
    category: entityType,
    message: 'PAN verified successfully with Income Tax Department records.',
  };
}

/**
 * Simulates Aadhaar SMS OTP Generation
 */
export async function generateAadhaarOtpAPI(aadhaarNumber: string, mobileNumber?: string): Promise<{ success: boolean; message: string; mockOtp: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  if (aadhaarNumber.length !== 12) {
    return { success: false, message: 'Aadhaar number must be 12 digits', mockOtp: '' };
  }

  const last4 = (mobileNumber && mobileNumber.length >= 4)
    ? mobileNumber.slice(-4)
    : (aadhaarNumber.length >= 4 ? aadhaarNumber.slice(-4) : '9876');
  const maskedMobile = '******' + last4;
  
  // Fixed demo OTP for user convenience + random generator
  return {
    success: true,
    message: `OTP sent to mobile linked with Aadhaar (+91 ${maskedMobile}). Use test OTP: 123456`,
    mockOtp: '123456',
  };
}

/**
 * Simulates Aadhaar OTP Verification
 */
export async function verifyAadhaarOtpAPI(userOtp: string, expectedOtp: string = '123456'): Promise<{ verified: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (userOtp === expectedOtp || userOtp === '123456') {
    return {
      verified: true,
      message: 'Aadhaar e-KYC verified successfully!',
    };
  }

  return {
    verified: false,
    message: 'Invalid OTP. Please enter the 6-digit OTP sent to your registered mobile (Test OTP: 123456).',
  };
}

/**
 * Simulates Direct Mobile SMS OTP Generation for applicant's entered mobile number
 */
export async function generateMobileOtpAPI(mobileNumber: string): Promise<{ success: boolean; message: string; mockOtp: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  if (!mobileNumber || mobileNumber.length !== 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile number starting with 6-9', mockOtp: '' };
  }

  const masked = '******' + mobileNumber.slice(-4);
  return {
    success: true,
    message: `OTP sent successfully to +91 ${masked}. Use test OTP: 123456`,
    mockOtp: '123456',
  };
}

/**
 * Simulates Mobile OTP Verification
 */
export async function verifyMobileOtpAPI(userOtp: string, expectedOtp: string = '123456'): Promise<{ verified: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (userOtp === expectedOtp || userOtp === '123456') {
    return {
      verified: true,
      message: 'Mobile number verified successfully!',
    };
  }

  return {
    verified: false,
    message: 'Invalid OTP. Please enter the 6-digit OTP sent to your mobile (Test OTP: 123456).',
  };
}

/**
 * Simulates RBI IFSC Code Lookup for Bank & Branch Details
 */
export async function lookupIfscAPI(ifsc: string): Promise<IfscLookupResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const cleanIfsc = ifsc.trim().toUpperCase();
  const ifscPrefix = cleanIfsc.substring(0, 4);

  const bankMap: Record<string, { bankName: string; branch: string; city: string; state: string }> = {
    SBIN: { bankName: 'State Bank of India', branch: 'Main Branch', city: 'Mumbai', state: 'Maharashtra' },
    HDFC: { bankName: 'HDFC Bank', branch: 'Connaught Place', city: 'New Delhi', state: 'Delhi' },
    ICIC: { bankName: 'ICICI Bank', branch: 'MG Road', city: 'Bengaluru', state: 'Karnataka' },
    UTIB: { bankName: 'Axis Bank', branch: 'Anna Salai', city: 'Chennai', state: 'Tamil Nadu' },
    PUNB: { bankName: 'Punjab National Bank', branch: 'Park Street', city: 'Kolkata', state: 'West Bengal' },
    KKBK: { bankName: 'Kotak Mahindra Bank', branch: 'Bandra West', city: 'Mumbai', state: 'Maharashtra' },
    BARB: { bankName: 'Bank of Baroda', branch: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat' },
  };

  const knownBank = bankMap[ifscPrefix];
  if (knownBank) {
    return {
      valid: true,
      bankName: knownBank.bankName,
      branch: knownBank.branch,
      city: knownBank.city,
      state: knownBank.state,
      message: 'Bank branch verified.',
    };
  }

  // Fallback for any standard 11-char IFSC pattern
  if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
    return {
      valid: true,
      bankName: `${cleanIfsc.substring(0, 4)} Commercial Bank`,
      branch: 'Central Branch',
      city: 'Metro City',
      state: 'State Capital',
      message: 'Bank branch found.',
    };
  }

  return {
    valid: false,
    message: 'IFSC Code not found in RBI directory. Please enter a valid 11-character code.',
  };
}

/**
 * Simulates Indian Pincode Directory Autocomplete
 */
export async function lookupPincodeAPI(pincode: string): Promise<PincodeLookupResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const cleanPin = pincode.trim();
  
  if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
    return { valid: false, message: 'Pincode must be 6 digits' };
  }

  const pinPrefix = cleanPin.substring(0, 2);

  const pincodeMap: Record<string, { city: string; district: string; state: string }> = {
    '11': { city: 'New Delhi', district: 'Central Delhi', state: 'Delhi' },
    '40': { city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra' },
    '56': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
    '60': { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal' },
    '50': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
    '38': { city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat' },
    '41': { city: 'Pune', district: 'Pune', state: 'Maharashtra' },
    '20': { city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh' },
    '12': { city: 'Gurugram', district: 'Gurugram', state: 'Haryana' },
  };

  const matched = pincodeMap[pinPrefix] || {
    city: `District Zone ${pinPrefix}`,
    district: `District ${cleanPin.substring(0, 3)}`,
    state: 'State Region',
  };

  return {
    valid: true,
    city: matched.city,
    district: matched.district,
    state: matched.state,
    message: 'Address details auto-populated.',
  };
}
