import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { lookupPincodeAPI, generateMobileOtpAPI, verifyMobileOtpAPI } from '../../utils/verifications';
import { Mail, Phone, MapPin, Building, ArrowRight, ArrowLeft, Loader2, KeyRound, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { INDIAN_STATES, getDistrictsForState } from '../../utils/indianLocationData';

export const Step3ContactAddress: React.FC = () => {
  const { state, updateStep3, nextStep, prevStep, errors, showToast } = useFormContext();
  const { email, mobile, mobileVerified, residenceType, currentAddress, sameAsCurrent, permanentAddress, yearsAtCurrentAddress } = state.step3;

  const [isSearchingPin, setIsSearchingPin] = useState(false);
  const [isSearchingPermPin, setIsSearchingPermPin] = useState(false);

  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [mobileOtpInput, setMobileOtpInput] = useState('');
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingMobileOtp, setIsVerifyingMobileOtp] = useState(false);
  const [mobileOtpMessage, setMobileOtpMessage] = useState('');

  // Current Pincode Lookup
  const handleCurrentPincodeLookup = async (pin: string) => {
    updateStep3({ currentAddress: { ...currentAddress, pincode: pin } });
    if (pin.length === 6) {
      setIsSearchingPin(true);
      try {
        const res = await lookupPincodeAPI(pin);
        if (res.valid && res.city && res.state) {
          updateStep3({
            currentAddress: {
              ...currentAddress,
              pincode: pin,
              city: res.city,
              state: res.state,
            },
          });
        }
      } finally {
        setIsSearchingPin(false);
      }
    }
  };

  // Permanent Pincode Lookup
  const handlePermPincodeLookup = async (pin: string) => {
    updateStep3({ permanentAddress: { ...permanentAddress, pincode: pin } });
    if (pin.length === 6) {
      setIsSearchingPermPin(true);
      try {
        const res = await lookupPincodeAPI(pin);
        if (res.valid && res.city && res.state) {
          updateStep3({
            permanentAddress: {
              ...permanentAddress,
              pincode: pin,
              city: res.city,
              state: res.state,
            },
          });
        }
      } finally {
        setIsSearchingPermPin(false);
      }
    }
  };

  // Mobile OTP Handlers
  const handleSendMobileOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setIsSendingMobileOtp(true);
    try {
      const res = await generateMobileOtpAPI(mobile);
      if (res.success) {
        setMobileOtpMessage(res.message);
        setShowMobileOtpModal(true);
        showToast('OTP sent to your mobile number!', 'info');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleConfirmMobileOtp = async () => {
    if (!mobileOtpInput || mobileOtpInput.length !== 6) {
      showToast('Enter 6-digit OTP', 'error');
      return;
    }
    setIsVerifyingMobileOtp(true);
    try {
      const res = await verifyMobileOtpAPI(mobileOtpInput, mobile);
      if (res.verified) {
        updateStep3({ mobileVerified: true });
        setShowMobileOtpModal(false);
        showToast('Mobile number verified successfully!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsVerifyingMobileOtp(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 3: Applicant Contact Channels & Residential Address Autocomplete
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify your official contact protocols and current residence parameters with automated Indian Pincode directory lookup.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Email & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brand-500" />
              <span>Email Address</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g.manixxx@gmail.com"
              value={email}
              onChange={(e) => updateStep3({ email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>Mobile Number</span>
                <span className="text-rose-500">*</span>
              </div>
              {mobileVerified && (
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold">
                +91
              </span>
              <input
                type="text"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => updateStep3({ mobile: e.target.value.replace(/\D/g, ''), mobileVerified: false })}
                className={`flex-1 px-4 py-3 rounded-r-xl bg-slate-50 dark:bg-slate-950 border ${errors.mobile ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-mono`}
              />
            </div>
            {errors.mobile && <p className="text-xs text-rose-500 font-medium">{errors.mobile}</p>}

            <button
              type="button"
              onClick={handleSendMobileOtp}
              disabled={isSendingMobileOtp || mobileVerified || mobile.length !== 10}
              className={`mt-2 flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${mobileVerified
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
              {isSendingMobileOtp ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mobileVerified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>{mobileVerified ? 'Mobile Verified via SMS OTP' : 'Send OTP to Entered Mobile'}</span>
            </button>
          </div>
        </div>

        {/* Current Address Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            <span>Current Residential Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* State Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</label>
              <select
                value={currentAddress.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  updateStep3({
                    currentAddress: {
                      ...currentAddress,
                      state: newState,
                      city: '',
                    },
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City / District Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / District</label>
              <select
                value={currentAddress.city}
                onChange={(e) => updateStep3({ currentAddress: { ...currentAddress, city: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="">{currentAddress.state ? 'Select District / City' : '← Select State First'}</option>
                {getDistrictsForState(currentAddress.state, currentAddress.city).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode with Autocomplete trigger */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pincode (6 Digits)</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 522617"
                  value={currentAddress.pincode}
                  onChange={(e) => handleCurrentPincodeLookup(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-mono ${errors['currentAddress.pincode'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                    } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
                />
                {isSearchingPin && (
                  <Loader2 className="w-4 h-4 text-brand-500 animate-spin absolute right-3 top-3" />
                )}
              </div>
              {errors['currentAddress.pincode'] && <p className="text-xs text-rose-500 font-medium">{errors['currentAddress.pincode']}</p>}
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Flat, House No., Building & Street</label>
            <input
              type="text"
              placeholder="e.g. #402, Sunshine Apartments, 1st Cross, Indiranagar"
              value={currentAddress.street}
              onChange={(e) => updateStep3({ currentAddress: { ...currentAddress, street: e.target.value } })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${errors['currentAddress.street'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors['currentAddress.street'] && <p className="text-xs text-rose-500 font-medium">{errors['currentAddress.street']}</p>}
          </div>

          {/* Residence Type & Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-brand-500" />
                <span>Residence Ownership</span>
              </label>
              <select
                value={residenceType}
                onChange={(e) => updateStep3({ residenceType: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              >
                <option value="owned">Owned by Self / Spouse</option>
                <option value="parental">Owned by Parents</option>
                <option value="rented">Rented / Leased</option>
                <option value="company_provided">Company Provided Quarters</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Years at Current Residence: <span className="font-bold text-brand-500">{yearsAtCurrentAddress} Yrs</span>
              </label>
              <input
                type="range"
                min={0}
                max={25}
                value={yearsAtCurrentAddress}
                onChange={(e) => updateStep3({ yearsAtCurrentAddress: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Toggle */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-400 transition-all">
            <input
              type="checkbox"
              checked={sameAsCurrent}
              onChange={(e) => updateStep3({ sameAsCurrent: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Permanent Address is the same as Current Address
            </span>
          </label>

          {!sameAsCurrent && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 animate-slide-up">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Permanent Address Details</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</label>
                  <select
                    value={permanentAddress.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      updateStep3({
                        permanentAddress: {
                          ...permanentAddress,
                          state: newState,
                          city: '',
                        },
                      });
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / District</label>
                  <select
                    value={permanentAddress.city}
                    onChange={(e) => updateStep3({ permanentAddress: { ...permanentAddress, city: e.target.value } })}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">{permanentAddress.state ? 'Select District / City' : '← Select State First'}</option>
                    {getDistrictsForState(permanentAddress.state, permanentAddress.city).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pincode (6 Digits)</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6 Digits"
                      value={permanentAddress.pincode}
                      onChange={(e) => handlePermPincodeLookup(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                    {isSearchingPermPin && (
                      <Loader2 className="w-4 h-4 text-brand-500 animate-spin absolute right-3 top-2.5" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Permanent Street Address</label>
                <input
                  type="text"
                  value={permanentAddress.street}
                  onChange={(e) => updateStep3({ permanentAddress: { ...permanentAddress, street: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
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
          <span>Proceed to Employment & Income</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile SMS OTP Modal */}
      {showMobileOtpModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowMobileOtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enter Mobile Verification OTP</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mobile Number: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">+91 ******{mobile.slice(-4)}</span>
                </p>
                {mobileOtpMessage && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{mobileOtpMessage}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={mobileOtpInput}
                onChange={(e) => setMobileOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMobileOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMobileOtp}
                disabled={isVerifyingMobileOtp}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold flex items-center justify-center space-x-2"
              >
                {isVerifyingMobileOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm OTP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
