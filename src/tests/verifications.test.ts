import { describe, it, expect } from 'vitest';
import { 
  verifyPanAPI, 
  generateAadhaarOtpAPI, 
  verifyAadhaarOtpAPI, 
  generateMobileOtpAPI,
  verifyMobileOtpAPI,
  lookupIfscAPI, 
  lookupPincodeAPI 
} from '../utils/verifications';
import { validateVerhoeffAadhaar, validateNsdlPanStructure } from '../utils/verhoeff';

describe('Real-World & Verhoeff Validated Verification Engine', () => {
  it('should validate NSDL PAN structure and surname initial matching', () => {
    // Rahul Sharma -> Last name 'Sharma' -> 5th char must be 'S'
    const validPan = 'ABCPS1234F';
    const check1 = validateNsdlPanStructure(validPan, 'Rahul Sharma', 'personal');
    expect(check1.isValid).toBe(true);

    // Mismatched 5th char ('E' vs 'S')
    const invalidPan = 'ABCPE1234F';
    const check2 = validateNsdlPanStructure(invalidPan, 'Rahul Sharma', 'personal');
    expect(check2.isValid).toBe(false);
    expect(check2.reason).toContain('Surname');
  });

  it('should validate UIDAI Verhoeff Checksum for Aadhaar numbers', () => {
    // Fake repeating numbers fail
    const fakeAadhaar = '123456789012';
    const check1 = validateVerhoeffAadhaar(fakeAadhaar);
    expect(check1.isValid).toBe(false);

    const validAadhaar = '987654321098';
    const check2 = validateVerhoeffAadhaar(validAadhaar);
    expect(check2.isValid).toBe(true);
  });

  it('should verify valid PAN card via NSDL database lookup', async () => {
    const res = await verifyPanAPI('ABCPS1234F', 'Rahul Sharma', 'personal');
    expect(res.valid).toBe(true);
    expect(res.name).toContain('RAHUL SHARMA');
    expect(res.message).toContain('NSDL PAN Verified');
  });

  it('should reject invalid PAN card format or surname mismatch', async () => {
    const res = await verifyPanAPI('ABCPE1234F', 'Rahul Sharma', 'personal');
    expect(res.valid).toBe(false);
    expect(res.message).toContain('Surname');
  });

  it('should generate Aadhaar SMS OTP for valid Aadhaar', async () => {
    const res = await generateAadhaarOtpAPI('987654321098', '9876543210');
    expect(res.success).toBe(true);
    expect(res.message).toContain('3210');
    expect(res.mockOtp).toBeDefined();
  });

  it('should reject fake Aadhaar number during OTP generation', async () => {
    const res = await generateAadhaarOtpAPI('222222222222', '9876543210');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Fake Aadhaar');
  });

  it('should verify OTP against dynamic active OTP session', async () => {
    const otpRes = await generateAadhaarOtpAPI('987654321098', '9876543210');
    const verifyRes = await verifyAadhaarOtpAPI(otpRes.mockOtp, '9876543210');
    expect(verifyRes.verified).toBe(true);
  });

  it('should reject incorrect OTP', async () => {
    await generateAadhaarOtpAPI('987654321098', '9876543210');
    const verifyRes = await verifyAadhaarOtpAPI('000000', '9876543210');
    expect(verifyRes.verified).toBe(false);
  });

  it('should generate Mobile SMS OTP for valid Indian mobile number', async () => {
    const res = await generateMobileOtpAPI('9876543210');
    expect(res.success).toBe(true);
    expect(res.message).toContain('3210');
  });

  it('should reject dummy mobile number like 1234567890', async () => {
    const res = await generateMobileOtpAPI('1234567890');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Invalid Mobile Number');
  });

  it('should verify Mobile OTP correctly', async () => {
    const otpRes = await generateMobileOtpAPI('9876543210');
    const verifyRes = await verifyMobileOtpAPI(otpRes.mockOtp, '9876543210');
    expect(verifyRes.verified).toBe(true);
  });

  it('should lookup RBI IFSC bank branch details', async () => {
    const res = await lookupIfscAPI('SBIN0001234');
    expect(res.valid).toBe(true);
    expect(res.bankName).toBe('State Bank of India');
    expect(res.city).toBe('Mumbai');
  });

  it('should lookup Indian Pincode postal details', async () => {
    const res = await lookupPincodeAPI('560001');
    expect(res.valid).toBe(true);
    expect(res.city).toBe('Bengaluru');
    expect(res.state).toBe('Karnataka');
  });
});
