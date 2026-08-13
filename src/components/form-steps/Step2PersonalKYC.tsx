import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { calculateAge } from '../../utils/validation';
import { verifyPanAPI, generateAadhaarOtpAPI, verifyAadhaarOtpAPI } from '../../utils/verifications';
import { User, Calendar, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, KeyRound, Loader2, Sparkles } from 'lucide-react';

export const Step2PersonalKYC: React.FC = () => {
  const { state, updateStep2, nextStep, prevStep, errors, showToast } = useFormContext();
  const { fullName, dob, gender, maritalStatus, panNumber, panVerified, panHolderName, aadhaarNumber, aadhaarVerified } = state.step2;

  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const age = calculateAge(dob);

  // PAN Verification Trigger
  const handleVerifyPan = async () => {
    if (!panNumber || panNumber.length !== 10) {
      showToast('Please enter a 10-character PAN number', 'error');
      return;
    }
    setIsVerifyingPan(true);
    try {
      const res = await verifyPanAPI(panNumber, fullName, state.step1.loanType);
      if (res.valid) {
        updateStep2({ panVerified: true, panHolderName: res.name });
        showToast(res.message, 'success');
      } else {
        updateStep2({ panVerified: false });
        showToast(res.message, 'error');
      }
    } finally {
      setIsVerifyingPan(false);
    }
  };

  // Aadhaar OTP Trigger
  const handleSendOtp = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      showToast('Enter valid 12-digit Aadhaar number', 'error');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await generateAadhaarOtpAPI(aadhaarNumber, state.step3.mobile);
      if (res.success) {
        setOtpMessage(res.message);
        setShowOtpModal(true);
        showToast('Real-time OTP dispatched to registered mobile!', 'info');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otpInput || otpInput.length !== 6) {
      showToast('Enter 6-digit OTP', 'error');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await verifyAadhaarOtpAPI(otpInput, aadhaarNumber);
      if (res.verified) {
        updateStep2({ aadhaarVerified: true });
        setShowOtpModal(false);
        showToast('Aadhaar e-KYC Verified Successfully!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 2: Digital Identity Verification & NSDL / UIDAI e-KYC Compliance
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Verify identity credentials in real time via NSDL tax database lookup and UIDAI Aadhaar e-KYC validation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-500" />
            <span>Full Legal Name (As per PAN Card)</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mani.."
            value={fullName}
            onChange={(e) => updateStep2({ fullName: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${errors.fullName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
          />
          {errors.fullName && <p className="text-xs text-rose-500 font-medium">{errors.fullName}</p>}
        </div>

        {/* DOB & Age Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Date of Birth</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => updateStep2({ dob: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${errors.dob ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors.dob && <p className="text-xs text-rose-500 font-medium">{errors.dob}</p>}
          </div>

          {/* Age Indicator Card */}
          <div className="space-y-2 flex flex-col justify-end">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Calculated Age</span>
              <span className={`text-lg font-bold ${age >= 21 && age <= 65 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {dob ? `${age} Years` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Gender & Marital Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'other', label: 'Other' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => updateStep2({ gender: g.id as any })}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${gender === g.id
                    ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Marital Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single', label: 'Single' },
                { id: 'married', label: 'Married' },
                { id: 'other', label: 'Other' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateStep2({ maritalStatus: m.id as any })}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${maritalStatus === m.id
                    ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PAN Verification Section */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>PAN Card Verification (NSDL Tax Database Lookup)</span>
            </label>
            {panVerified && (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. ABCDE1234F"
              value={panNumber}
              onChange={(e) => updateStep2({ panNumber: e.target.value.toUpperCase(), panVerified: false })}
              className={`flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border uppercase font-mono tracking-wider text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${
                errors.panNumber ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={handleVerifyPan}
              disabled={isVerifyingPan || panVerified}
              className="px-5 py-3 rounded-xl font-semibold bg-slate-900 hover:bg-black dark:bg-brand-600 dark:hover:bg-brand-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
            >
              {isVerifyingPan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{panVerified ? 'PAN Verified' : 'Verify PAN'}</span>
            </button>
          </div>
          {panHolderName && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{panHolderName}</p>}
          {errors.panNumber && <p className="text-xs text-rose-500 font-medium">{errors.panNumber}</p>}
        </div>

        {/* Aadhaar Verification Section */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-brand-500" />
              <span>Aadhaar UIDAI e-KYC Verification</span>
            </label>
            {aadhaarVerified && (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>e-KYC Complete</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={12}
              placeholder="12-digit Aadhaar Number"
              value={aadhaarNumber}
              onChange={(e) => updateStep2({ aadhaarNumber: e.target.value.replace(/\D/g, ''), aadhaarVerified: false })}
              className={`flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border font-mono tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${
                errors.aadhaarNumber ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp || aadhaarVerified}
              className="px-5 py-3 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
            >
              {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{aadhaarVerified ? 'KYC Verified' : 'Verify via OTP'}</span>
            </button>
          </div>
          {errors.aadhaarNumber && <p className="text-xs text-rose-500 font-medium">{errors.aadhaarNumber}</p>}
        </div>
      </div>

      {/* Aadhaar OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enter Aadhaar Security OTP</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{otpMessage}</p>
            </div>

            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl font-bold tracking-widest px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-brand-500 text-slate-900 dark:text-white outline-none"
            />

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOtp}
                disabled={isVerifyingOtp}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 text-white flex items-center justify-center"
              >
                {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm OTP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center space-x-2 shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <span>Proceed to Address Details</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
