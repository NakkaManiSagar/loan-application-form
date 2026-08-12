import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { generatePreApprovalPDF } from '../../utils/pdfGenerator';
import { generateAmortizationSchedule } from '../../utils/calculator';
import { exportDraftToken } from '../../utils/storage';
import { Award, CheckCircle2, Download, RefreshCw, Copy, Check, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export const Step9PreApprovalSuccess: React.FC = () => {
  const { state, resetForm, showToast } = useFormContext();
  const preApproval = state.preApproval;
  const { step1, step2 } = state;

  const [copied, setCopied] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  if (!preApproval) return null;

  const amortizationRows = generateAmortizationSchedule(
    preApproval.approvedAmount,
    preApproval.interestRate,
    step1.tenureMonths,
    12
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(preApproval.applicationId);
    setCopied(true);
    showToast('Application Reference ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyToken = () => {
    const token = exportDraftToken(state);
    navigator.clipboard.writeText(token);
    showToast('Application payload token copied!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-brand-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>{preApproval.status.replace('_', ' ')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Congratulations, {step2.fullName || 'Applicant'}!
            </h1>
            <p className="text-sm text-slate-300">
              Your instant pre-approval assessment has been calculated using real-time credit underwriting rules.
            </p>

            <div className="flex items-center justify-center md:justify-start space-x-2 pt-2 text-xs text-slate-400">
              <span>App ID: <strong className="text-white font-mono">{preApproval.applicationId}</strong></span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:text-brand-400 text-slate-400 transition-colors"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Pre-approval Score Badge */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl min-w-[160px]">
            <Award className="w-8 h-8 text-amber-400 mb-1 animate-bounce" />
            <span className="text-3xl font-extrabold text-white">{preApproval.score} / 100</span>
            <span className="text-[11px] text-slate-300 font-semibold mt-0.5">Pre-Approval Index</span>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Approved Amount</span>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">
            ₹{preApproval.approvedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Monthly EMI</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{preApproval.monthlyEMI.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/mo</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Offered Rate</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {preApproval.interestRate}% <span className="text-xs font-normal text-slate-400">p.a.</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Max Eligible Limit</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            ₹{preApproval.maxEligibleAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Amortization Schedule Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div
          onClick={() => setShowAmortization(!showAmortization)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Repayment Schedule & Amortization Breakdown (Year 1)
            </h3>
          </div>
          {showAmortization ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        {showAmortization && (
          <div className="overflow-x-auto pt-3 border-t border-slate-100 dark:border-slate-800 animate-slide-up">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Opening Principal</th>
                  <th className="py-2.5 px-3">EMI</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Closing Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {amortizationRows.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">Month {row.month}</td>
                    <td className="py-2.5 px-3">₹{row.beginningBalance.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-semibold text-brand-600 dark:text-brand-400">₹{row.emi.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">₹{row.interestPaid.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-medium">₹{row.endingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={handleCopyToken}
          className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center space-x-2 transition-all text-xs"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Encrypted Payload Token</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={resetForm}
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Application</span>
          </button>

          <button
            onClick={() => generatePreApprovalPDF(state, preApproval)}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>Download Pre-Approval PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
