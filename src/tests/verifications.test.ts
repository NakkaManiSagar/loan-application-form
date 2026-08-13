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

describe('Simulated KYC & Financial Verification APIs', () => {
  it('should verify valid PAN card via simulated NSDL API', async () => {
    const res = await verifyPanAPI('ABCDE1234F');
    expect(res.valid).toBe(true);
    expect(res.name).toContain('VERIFIED');
    expect(res.message).toContain('PAN verified successfully');
  });

  it('should reject invalid PAN card format', async () => {
    const res = await verifyPanAPI('INVALIDPAN');
    expect(res.valid).toBe(false);
    expect(res.message).toContain('Invalid PAN format');
  });

  it('should generate Aadhaar SMS OTP using entered mobile number', async () => {
    const res = await generateAadhaarOtpAPI('987654321012', '9876543210');
    expect(res.success).toBe(true);
    expect(res.message).toContain('3210');
    expect(res.mockOtp).toBe('123456');
  });

  it('should verify correct Aadhaar OTP', async () => {
    const res = await verifyAadhaarOtpAPI('123456');
    expect(res.verified).toBe(true);
  });

  it('should reject incorrect Aadhaar OTP', async () => {
    const res = await verifyAadhaarOtpAPI('000000');
    expect(res.verified).toBe(false);
  });

  it('should generate Mobile SMS OTP for entered mobile number', async () => {
    const res = await generateMobileOtpAPI('9988776655');
    expect(res.success).toBe(true);
    expect(res.message).toContain('6655');
    expect(res.mockOtp).toBe('123456');
  });

  it('should verify correct Mobile OTP', async () => {
    const res = await verifyMobileOtpAPI('123456');
    expect(res.verified).toBe(true);
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
