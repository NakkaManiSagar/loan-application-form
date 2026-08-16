import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { lookupIfscAPI } from '../../utils/verifications';
import type { AccountType } from '../../types/loanForm';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles, CreditCard, Gauge } from 'lucide-react';

export const Step6BankFinancial: React.FC = () => {
  const { state, updateStep6, nextStep, prevStep, errors, showToast } = useFormContext();
  const { bankName, accountNumber, confirmAccountNumber, ifscCode, ifscVerified, branchName, accountType, selfReportedCreditScore } = state.step6;

  const [isVerifyingIfsc, setIsVerifyingIfsc] = useState(false);

  // IFSC Verification Trigger
  const handleVerifyIfsc = async () => {
    if (!ifscCode || ifscCode.length !== 11) {
      showToast('Enter valid 11-character IFSC Code', 'error');
      return;
    }
    setIsVerifyingIfsc(true);
    try {
      const res = await lookupIfscAPI(ifscCode);
      if (res.valid) {
        updateStep6({
          ifscVerified: true,
          bankName: res.bankName || bankName,
          branchName: `${res.branch}, ${res.city}`,
        });
        showToast(`Bank branch (${res.bankName} - ${res.branch}) verified!`, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsVerifyingIfsc(false);
    }
  };

  const getCreditScoreRating = (score: number) => {
    if (score >= 780) return { text: 'Excellent Credit (780+)', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' };
    if (score >= 720) return { text: 'Good Credit (720-779)', color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/50' };
    if (score >= 650) return { text: 'Fair Credit (650-719)', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' };
    return { text: 'Subprime / High Risk (<650)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' };
  };

  const scoreRating = getCreditScoreRating(selfReportedCreditScore);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 6: Direct Disbursement Bank Mandate & CIBIL Bureau Assessment
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify disbursement banking details with RBI IFSC directory validation and self-assessed credit bureau score ranges.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">

        {/* IFSC Lookup Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>IFSC Code & RBI Branch Lookup</span>
              <span className="text-rose-500">*</span>
            </label>
            {ifscVerified && (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>IFSC Verified</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={11}
              placeholder="e.g. SBIN0001234 or HDFC0000123"
              value={ifscCode}
              onChange={(e) => updateStep6({ ifscCode: e.target.value.toUpperCase(), ifscVerified: false })}
              className={`flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border uppercase font-mono tracking-wider ${errors.ifscCode ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500`}
            />
            <button
              type="button"
              onClick={handleVerifyIfsc}
              disabled={isVerifyingIfsc || ifscVerified}
              className="px-5 py-3 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
            >
              {isVerifyingIfsc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{ifscVerified ? 'Verified' : 'Verify IFSC'}</span>
            </button>
          </div>

          {branchName && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Branch: {bankName} - {branchName}</span>
            </p>
          )}
          {errors.ifscCode && <p className="text-xs text-rose-500 font-medium">{errors.ifscCode}</p>}
        </div>

        {/* Bank Name & Account Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Bank Name</label>
            <input
              type="text"
              placeholder="e.g. HDFC Bank Ltd"
              value={bankName}
              onChange={(e) => updateStep6({ bankName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${errors.bankName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white outline-none`}
            />
            {errors.bankName && <p className="text-xs text-rose-500 font-medium">{errors.bankName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'savings', label: 'Savings Account' },
                { id: 'current', label: 'Current Account' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => updateStep6({ accountType: acc.id as AccountType })}
                  className={`py-3 px-3 text-xs font-bold rounded-xl border transition-all ${accountType === acc.id
                      ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account Number & Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-500" />
              <span>Account Number</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 5010023456789"
              value={accountNumber}
              onChange={(e) => updateStep6({ accountNumber: e.target.value.replace(/\D/g, '') })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border font-mono tracking-widest ${errors.accountNumber ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white outline-none`}
            />
            {errors.accountNumber && <p className="text-xs text-rose-500 font-medium">{errors.accountNumber}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Confirm Account Number</label>
            <input
              type="text"
              placeholder="Re-enter Account Number"
              value={confirmAccountNumber}
              onChange={(e) => updateStep6({ confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border font-mono tracking-widest ${errors.confirmAccountNumber ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white outline-none`}
            />
            {errors.confirmAccountNumber && <p className="text-xs text-rose-500 font-medium">{errors.confirmAccountNumber}</p>}
          </div>
        </div>

        {/* Self-Reported Credit Score Slider */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-brand-500" />
              <span>Self-Reported CIBIL / Experian Credit Score Range</span>
            </label>
            <div className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${scoreRating.color}`}>
              {scoreRating.text}
            </div>
          </div>

          <input
            type="range"
            min={300}
            max={900}
            step={10}
            value={selfReportedCreditScore}
            onChange={(e) => updateStep6({ selfReportedCreditScore: Number(e.target.value) })}
            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />

          <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span>300 (Poor)</span>
            <span>650 (Fair)</span>
            <span>750 (Good)</span>
            <span>900 (Excellent)</span>
          </div>
        </div>
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
          <span>Proceed to Document Uploads</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
