import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import type { PropertyType, PropertyStatus, BusinessType } from '../../types/loanForm';
import { CreditCard, Home, Building, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export const Step5DivergentDetails: React.FC = () => {
  const { state, updateStep5, nextStep, prevStep, errors, showToast } = useFormContext();
  const loanType = state.step1.loanType;
  const { personalLoan, homeLoan, businessLoan } = state.step5;

  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);

  // GSTIN Verification trigger
  const handleVerifyGstin = async () => {
    if (!businessLoan.gstin || businessLoan.gstin.length !== 15) {
      showToast('Enter valid 15-character GSTIN', 'error');
      return;
    }
    setIsVerifyingGstin(true);
    setTimeout(() => {
      setIsVerifyingGstin(false);
      updateStep5({
        businessLoan: { ...businessLoan, gstinVerified: true },
      });
      showToast('GSTIN verified with GSTN Portal!', 'success');
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>Step 5: Loan-Specific Divergent Asset & Commercial Parameters</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Divergent technical fields tailored exclusively for {loanType.toUpperCase()} loan processing and underwriting.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* PERSONAL LOAN SPECIFIC UI */}
        {loanType === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <span>Personal Liabilities & Credit Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Active Credit Cards Count</label>
                <select
                  value={personalLoan.creditCardsCount}
                  onChange={(e) => updateStep5({ personalLoan: { ...personalLoan, creditCardsCount: Number(e.target.value) } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value={0}>0 (No Credit Cards)</option>
                  <option value={1}>1 Credit Card</option>
                  <option value={2}>2 Credit Cards</option>
                  <option value={3}>3-5 Credit Cards</option>
                  <option value={6}>6+ Credit Cards</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Total Combined Credit Card Limit (INR)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={personalLoan.totalCreditCardLimit}
                  onChange={(e) => updateStep5({ personalLoan: { ...personalLoan, totalCreditCardLimit: Number(e.target.value) } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-semibold"
                />
              </div>
            </div>

            {/* Optional Guarantor Sub-Form Toggle */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={personalLoan.guarantorRequired}
                  onChange={(e) => updateStep5({
                    personalLoan: {
                      ...personalLoan,
                      guarantorRequired: e.target.checked,
                      guarantorDetails: e.target.checked
                        ? { name: '', relation: 'Spouse', mobile: '', monthlyIncome: 45000 }
                        : undefined,
                    },
                  })}
                  className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
                />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Add Co-Applicant / Guarantor to Boost Eligibility
                </span>
              </label>

              {personalLoan.guarantorRequired && personalLoan.guarantorDetails && (
                <div className="p-5 rounded-2xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/50 space-y-4 animate-slide-up">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Guarantor Information</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guarantor Full Name</label>
                      <input
                        type="text"
                        placeholder="Guarantor Name"
                        value={personalLoan.guarantorDetails.name}
                        onChange={(e) => updateStep5({
                          personalLoan: {
                            ...personalLoan,
                            guarantorDetails: { ...personalLoan.guarantorDetails!, name: e.target.value },
                          },
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                      {errors['guarantor.name'] && <p className="text-xs text-rose-500">{errors['guarantor.name']}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Relationship</label>
                      <select
                        value={personalLoan.guarantorDetails.relation}
                        onChange={(e) => updateStep5({
                          personalLoan: {
                            ...personalLoan,
                            guarantorDetails: { ...personalLoan.guarantorDetails!, relation: e.target.value },
                          },
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Sibling">Sibling</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guarantor Mobile</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="9876543210"
                        value={personalLoan.guarantorDetails.mobile}
                        onChange={(e) => updateStep5({
                          personalLoan: {
                            ...personalLoan,
                            guarantorDetails: { ...personalLoan.guarantorDetails!, mobile: e.target.value.replace(/\D/g, '') },
                          },
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                      />
                      {errors['guarantor.mobile'] && <p className="text-xs text-rose-500">{errors['guarantor.mobile']}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guarantor Net Monthly Income</label>
                      <input
                        type="number"
                        placeholder="45000"
                        value={personalLoan.guarantorDetails.monthlyIncome}
                        onChange={(e) => updateStep5({
                          personalLoan: {
                            ...personalLoan,
                            guarantorDetails: { ...personalLoan.guarantorDetails!, monthlyIncome: Number(e.target.value) },
                          },
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HOME LOAN SPECIFIC UI */}
        {loanType === 'home' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Home className="w-5 h-5 text-emerald-500" />
              <span>Property Assessment & Down Payment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Property Category</label>
                <select
                  value={homeLoan.propertyType}
                  onChange={(e) => updateStep5({ homeLoan: { ...homeLoan, propertyType: e.target.value as PropertyType } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="apartment">Multi-Story Apartment Flat</option>
                  <option value="independent_house">Independent Villa / House</option>
                  <option value="plot">Residential Plot / Land</option>
                  <option value="commercial">Commercial Property Space</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Property Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Whitefield, Bengaluru"
                  value={homeLoan.propertyLocation}
                  onChange={(e) => updateStep5({ homeLoan: { ...homeLoan, propertyLocation: e.target.value } })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                    errors['home.propertyLocation'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white outline-none`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Builder / Developer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Prestige / Sobha"
                  value={homeLoan.builderName}
                  onChange={(e) => updateStep5({ homeLoan: { ...homeLoan, builderName: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Estimated Property Market Value (INR)</label>
                <input
                  type="number"
                  placeholder="6000000"
                  value={homeLoan.estimatedMarketValue}
                  onChange={(e) => updateStep5({ homeLoan: { ...homeLoan, estimatedMarketValue: Number(e.target.value) } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-bold text-lg"
                />
                {errors['home.estimatedMarketValue'] && <p className="text-xs text-rose-500 font-medium">{errors['home.estimatedMarketValue']}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Own Contribution / Down Payment (INR)</label>
                <input
                  type="number"
                  placeholder="1200000"
                  value={homeLoan.downPaymentAmount}
                  onChange={(e) => updateStep5({ homeLoan: { ...homeLoan, downPaymentAmount: Number(e.target.value) } })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                    errors['home.downPaymentAmount'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white outline-none font-bold text-lg`}
                />
                {errors['home.downPaymentAmount'] && <p className="text-xs text-rose-500 font-medium">{errors['home.downPaymentAmount']}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Construction & Legal Status</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'under_construction', label: 'Under Construction' },
                  { id: 'ready_to_move', label: 'Ready to Move' },
                  { id: 'resale', label: 'Resale Property' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateStep5({ homeLoan: { ...homeLoan, propertyStatus: s.id as PropertyStatus } })}
                    className={`py-3 px-3 text-xs font-bold rounded-xl border transition-all ${
                      homeLoan.propertyStatus === s.id
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS LOAN SPECIFIC UI */}
        {loanType === 'business' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building className="w-5 h-5 text-purple-500" />
              <span>Commercial Registration & Financial Performance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Business Constitution / Type</label>
                <select
                  value={businessLoan.businessType}
                  onChange={(e) => updateStep5({ businessLoan: { ...businessLoan, businessType: e.target.value as BusinessType } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="pvtltd">Private Limited (Pvt Ltd)</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Business PAN Number</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. AAACB1234C"
                  value={businessLoan.businessPan}
                  onChange={(e) => updateStep5({ businessLoan: { ...businessLoan, businessPan: e.target.value.toUpperCase() } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono uppercase"
                />
                {errors['business.businessPan'] && <p className="text-xs text-rose-500 font-medium">{errors['business.businessPan']}</p>}
              </div>
            </div>

            {/* GSTIN Verification Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>GSTIN Number & Verification</span>
                </label>
                {businessLoan.gstinVerified && (
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>GST Active</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={15}
                  placeholder="22AAAAA0000A1Z5"
                  value={businessLoan.gstin}
                  onChange={(e) => updateStep5({ businessLoan: { ...businessLoan, gstin: e.target.value.toUpperCase(), gstinVerified: false } })}
                  className={`flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border uppercase font-mono ${
                    errors['business.gstin'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white outline-none`}
                />
                <button
                  type="button"
                  onClick={handleVerifyGstin}
                  disabled={isVerifyingGstin || businessLoan.gstinVerified}
                  className="px-5 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
                >
                  {isVerifyingGstin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{businessLoan.gstinVerified ? 'GSTIN Verified' : 'Verify GSTIN'}</span>
                </button>
              </div>
              {errors['business.gstin'] && <p className="text-xs text-rose-500 font-medium">{errors['business.gstin']}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Annual Audited Turnover (INR)</label>
                <input
                  type="number"
                  placeholder="2500000"
                  value={businessLoan.annualTurnover}
                  onChange={(e) => updateStep5({ businessLoan: { ...businessLoan, annualTurnover: Number(e.target.value) } })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                    errors['business.annualTurnover'] ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  } text-slate-900 dark:text-white outline-none font-bold text-lg`}
                />
                {errors['business.annualTurnover'] && <p className="text-xs text-rose-500 font-medium">{errors['business.annualTurnover']}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Years in Continuous Operation: <span className="font-bold text-purple-500">{businessLoan.yearsInBusiness} Yrs</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={businessLoan.yearsInBusiness}
                  onChange={(e) => updateStep5({ businessLoan: { ...businessLoan, yearsInBusiness: Number(e.target.value) } })}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

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
          <span>Proceed to Bank Verification</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
