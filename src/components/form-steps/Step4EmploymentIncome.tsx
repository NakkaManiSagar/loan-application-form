import React from 'react';
import { useFormContext } from '../../context/FormContext';
import type { EmploymentType } from '../../types/loanForm';
import { Briefcase, Building2, IndianRupee, Award, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export const Step4EmploymentIncome: React.FC = () => {
  const { state, updateStep4, nextStep, prevStep, errors } = useFormContext();
  const { employmentType, companyName, designation, totalExperienceYears, netMonthlyIncome, existingMonthlyEmis } = state.step4;

  const debtRatio = netMonthlyIncome > 0 ? Math.round((existingMonthlyEmis / netMonthlyIncome) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 4: Employment Profiling & Fixed Obligation Income Assessment (FOIR)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate professional stability, monthly net income flows, and existing debt obligations against banking FOIR thresholds.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Employment Type Selection Cards */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-brand-500" />
            <span>Employment Category</span>
            <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'salaried', label: 'Salaried Employee', desc: 'Working at MNC, Govt, or Pvt Ltd company' },
              { id: 'self-employed', label: 'Self-Employed Professional', desc: 'Doctor, CA, Lawyer, Consultant' },
              { id: 'business-owner', label: 'Business Owner / Partner', desc: 'Proprietor, Director, Partner firm' },
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => updateStep4({ employmentType: type.id as EmploymentType })}
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  employmentType === type.id
                    ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 ring-2 ring-brand-500/50'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{type.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employer & Designation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>{employmentType === 'salaried' ? 'Employer / Company Name' : 'Business / Firm Name'}</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Infosys Ltd"
              value={companyName}
              onChange={(e) => updateStep4({ companyName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                errors.companyName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors.companyName && <p className="text-xs text-rose-500 font-medium">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-500" />
              <span>Designation / Role</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={designation}
              onChange={(e) => updateStep4({ designation: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                errors.designation ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none`}
            />
            {errors.designation && <p className="text-xs text-rose-500 font-medium">{errors.designation}</p>}
          </div>
        </div>

        {/* Experience & Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Total Work / Business Experience: <span className="font-bold text-brand-500">{totalExperienceYears} Years</span>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              value={totalExperienceYears}
              onChange={(e) => updateStep4({ totalExperienceYears: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-emerald-500" />
              <span>Net Take-Home Monthly Income (INR)</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="85000"
              value={netMonthlyIncome || ''}
              onChange={(e) => updateStep4({ netMonthlyIncome: Number(e.target.value) })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                errors.netMonthlyIncome ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-bold text-lg`}
            />
            {errors.netMonthlyIncome && <p className="text-xs text-rose-500 font-medium">{errors.netMonthlyIncome}</p>}
          </div>
        </div>

        {/* Existing EMIs & Debt Ratio Check */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-amber-500" />
              <span>Total Existing Monthly Obligations / EMIs</span>
            </label>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              debtRatio > 50 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              FOIR Ratio: {debtRatio}%
            </span>
          </div>

          <input
            type="number"
            placeholder="0 if no active loans"
            value={existingMonthlyEmis}
            onChange={(e) => updateStep4({ existingMonthlyEmis: Number(e.target.value) })}
            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border ${
              errors.existingMonthlyEmis ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
            } text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-semibold`}
          />

          {debtRatio > 50 && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>
                High Obligation Warning: Existing EMIs consume <strong>{debtRatio}%</strong> of your monthly income. Financial institutions prefer an EMI-to-Income FOIR ratio under 50%.
              </span>
            </div>
          )}
          {errors.existingMonthlyEmis && <p className="text-xs text-rose-500 font-medium">{errors.existingMonthlyEmis}</p>}
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
          <span>Proceed to Specific Details</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
