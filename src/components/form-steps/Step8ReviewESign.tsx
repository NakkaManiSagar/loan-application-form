import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { SignatureCanvas } from '../ui/SignatureCanvas';
import { Edit3, Shield, ArrowLeft, Send } from 'lucide-react';

export const Step8ReviewESign: React.FC = () => {
  const { state, updateStep8, jumpToStep, prevStep, submitApplication, errors } = useFormContext();
  const { step1, step2, step3, step4, step8 } = state;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 8: Comprehensive Application Audit, Declarations, & Legal E-Signature
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review all submitted financial sections, confirm statutory DPDP consents, and execute your legally binding digital signature.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1 Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">1. Loan Specifications</h4>
            <button
              type="button"
              onClick={() => jumpToStep(1)}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center space-x-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Loan Type:</strong> {step1.loanType.toUpperCase()} LOAN</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Amount Requested:</strong> ₹{step1.loanAmount.toLocaleString('en-IN')}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Tenure:</strong> {step1.tenureMonths} Months</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Purpose:</strong> {step1.purpose}</p>
          </div>
        </div>

        {/* Step 2 Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">2. Applicant KYC Details</h4>
            <button
              type="button"
              onClick={() => jumpToStep(2)}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center space-x-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Name:</strong> {step2.fullName}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">DOB:</strong> {step2.dob}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">PAN:</strong> {step2.panNumber} ({step2.panVerified ? 'Verified' : 'Unverified'})</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Aadhaar:</strong> {step2.aadhaarNumber} ({step2.aadhaarVerified ? 'KYC Complete' : 'Pending'})</p>
          </div>
        </div>

        {/* Step 3 Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">3. Contact & Address</h4>
            <button
              type="button"
              onClick={() => jumpToStep(3)}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center space-x-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Contact:</strong> {step3.email} | +91 {step3.mobile}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">City & Pincode:</strong> {step3.currentAddress.city}, {step3.currentAddress.state} ({step3.currentAddress.pincode})</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Street Address:</strong> {step3.currentAddress.street}</p>
          </div>
        </div>

        {/* Step 4 Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">4. Employment & Financials</h4>
            <button
              type="button"
              onClick={() => jumpToStep(4)}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center space-x-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-slate-200">Category:</strong> {step4.employmentType.toUpperCase()}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Company:</strong> {step4.companyName} ({step4.designation})</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Net Monthly Income:</strong> ₹{step4.netMonthlyIncome.toLocaleString('en-IN')}</p>
            <p><strong className="text-slate-900 dark:text-slate-200">Existing Monthly EMIs:</strong> ₹{step4.existingMonthlyEmis.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Declarations & Signature Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-brand-500" />
          <span>Declarations, Credit Authorization & E-Sign</span>
        </h3>

        {/* Consents Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={step8.termsAccepted}
              onChange={(e) => updateStep8({ termsAccepted: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 mt-0.5"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              I hereby declare that all information furnished in this loan application is true, correct, and complete to the best of my knowledge. I accept the <a href="#" className="text-brand-500 underline">Terms & Conditions</a> of Zetheta WorkBridge.
            </span>
          </label>
          {errors.termsAccepted && <p className="text-xs text-rose-500 font-medium pl-8">{errors.termsAccepted}</p>}

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={step8.privacyAccepted}
              onChange={(e) => updateStep8({ privacyAccepted: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 mt-0.5"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              I agree to the <a href="#" className="text-brand-500 underline">Privacy Policy</a> and consent to data storage compliance as per Indian DPDP Act.
            </span>
          </label>
          {errors.privacyAccepted && <p className="text-xs text-rose-500 font-medium pl-8">{errors.privacyAccepted}</p>}

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={step8.creditCheckConsent}
              onChange={(e) => updateStep8({ creditCheckConsent: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 mt-0.5"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              I explicitly authorize Zetheta WorkBridge & partner NBFCs to pull my credit bureau reports (CIBIL / Experian / Equifax) for underwriting evaluation.
            </span>
          </label>
          {errors.creditCheckConsent && <p className="text-xs text-rose-500 font-medium pl-8">{errors.creditCheckConsent}</p>}
        </div>

        {/* Signature Pad */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <SignatureCanvas
            value={step8.signatureDataUrl}
            onChange={(url) => updateStep8({ signatureDataUrl: url })}
            error={errors.signatureDataUrl}
          />
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
          onClick={submitApplication}
          className="px-8 py-4 rounded-xl font-extrabold bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white flex items-center space-x-3 shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 text-base"
        >
          <Send className="w-5 h-5" />
          <span>SUBMIT LOAN APPLICATION</span>
        </button>
      </div>
    </div>
  );
};
