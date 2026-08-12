import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { lookupPincodeAPI } from '../../utils/verifications';
import { Mail, Phone, MapPin, Building, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export const Step3ContactAddress: React.FC = () => {
  const { state, updateStep3, nextStep, prevStep, errors, showToast } = useFormContext();
  const { email, mobile, residenceType, currentAddress, sameAsCurrent, permanentAddress, yearsAtCurrentAddress } = state.step3;

  const [isSearchingPin, setIsSearchingPin] = useState(false);
  const [isSearchingPermPin, setIsSearchingPermPin] = useState(false);

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
          showToast(`City (${res.city}) and State (${res.state}) auto-populated!`, 'success');
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
          showToast(`Permanent address city & state auto-populated!`, 'success');
        }
      } finally {
        setIsSearchingPermPin(false);
      }
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
              placeholder="e.g. rahul.sharma@example.com"
              value={email}
              onChange={(e) => updateStep3({ email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brand-500" />
              <span>Mobile Number</span>
              <span className="text-rose-500">*</span>
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
                onChange={(e) => updateStep3({ mobile: e.target.value.replace(/\D/g, '') })}
                className={`flex-1 px-4 py-3 rounded-r-xl bg-slate-50 dark:bg-slate-950 border ${
                  errors.mobile ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-mono`}
              />
            </div>
            {errors.mobile && <p className="text-xs text-rose-500 font-medium">{errors.mobile}</p>}
          </div>
        </div>

        {/* Current Address Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            <span>Current Residential Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Pincode with Autocomplete trigger */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pincode (6 Digits)</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 560001"
                  value={currentAddress.pincode}
                  onChange={(e) => handleCurrentPincodeLookup(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-mono ${
                    errors['currentAddress.pincode'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
                />
                {isSearchingPin && (
                  <Loader2 className="w-4 h-4 text-brand-500 animate-spin absolute right-3 top-3" />
                )}
              </div>
              {errors['currentAddress.pincode'] && <p className="text-xs text-rose-500 font-medium">{errors['currentAddress.pincode']}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / District</label>
              <input
                type="text"
                placeholder="Bengaluru"
                value={currentAddress.city}
                onChange={(e) => updateStep3({ currentAddress: { ...currentAddress, city: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</label>
              <input
                type="text"
                placeholder="Karnataka"
                value={currentAddress.state}
                onChange={(e) => updateStep3({ currentAddress: { ...currentAddress, state: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
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
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                errors['currentAddress.street'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pincode</label>
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

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    value={permanentAddress.city}
                    onChange={(e) => updateStep3({ permanentAddress: { ...permanentAddress, city: e.target.value } })}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    value={permanentAddress.state}
                    onChange={(e) => updateStep3({ permanentAddress: { ...permanentAddress, state: e.target.value } })}
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
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
    </div>
  );
};
