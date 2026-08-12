import React from 'react';
import { useFormContext } from '../../context/FormContext';
import type { LoanType } from '../../types/loanForm';
import { User, Home, Briefcase, IndianRupee, Clock, Target, ArrowRight } from 'lucide-react';

export const Step1LoanSelection: React.FC = () => {
  const { state, updateStep1, nextStep, errors } = useFormContext();
  const { loanType, loanAmount, tenureMonths, purpose } = state.step1;

  const handleLoanTypeSelect = (type: LoanType) => {
    let defaultAmt = 500000;
    let defaultTenure = 36;
    if (type === 'home') {
      defaultAmt = 4500000;
      defaultTenure = 180;
    } else if (type === 'business') {
      defaultAmt = 2500000;
      defaultTenure = 48;
    }
    updateStep1({ loanType: type, loanAmount: defaultAmt, tenureMonths: defaultTenure });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 1: Loan Category & Financial Capital Specifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your target loan category to configure customized interest rates, tenure windows, and underwriting criteria.
        </p>
      </div>

      {/* Loan Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            id: 'personal',
            title: 'Personal Loan',
            desc: 'Instant funds for personal needs, medical emergency, or travel.',
            rate: 'From 11.5% p.a.',
            max: 'Up to ₹50 Lakhs',
            icon: User,
            color: 'from-blue-600 to-indigo-600',
          },
          {
            id: 'home',
            title: 'Home / Property Loan',
            desc: 'Finance new property purchase, flat, or construction with low EMI.',
            rate: 'From 8.4% p.a.',
            max: 'Up to ₹5 Crores',
            icon: Home,
            color: 'from-emerald-600 to-teal-600',
          },
          {
            id: 'business',
            title: 'Business Loan',
            desc: 'Working capital & expansion loans for registered enterprises.',
            rate: 'From 13.0% p.a.',
            max: 'Up to ₹2 Crores',
            icon: Briefcase,
            color: 'from-purple-600 to-pink-600',
          },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = loanType === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleLoanTypeSelect(item.id as LoanType)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-brand-500 ring-2 ring-brand-500/50 shadow-xl shadow-brand-500/10 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 min-h-[36px] line-clamp-2">
                {item.desc}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{item.rate}</span>
                <span className="text-slate-600 dark:text-slate-400">{item.max}</span>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sliders & Purpose Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Loan Amount Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-brand-500" />
              <span>Required Loan Amount</span>
            </label>
            <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-4 py-1 rounded-xl border border-brand-200 dark:border-brand-800/50">
              ₹{loanAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <input
            type="range"
            min={loanType === 'home' ? 500000 : loanType === 'business' ? 100000 : 50000}
            max={loanType === 'home' ? 50000000 : loanType === 'business' ? 20000000 : 5000000}
            step={50000}
            value={loanAmount}
            onChange={(e) => updateStep1({ loanAmount: Number(e.target.value) })}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />

          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>₹{(loanType === 'home' ? 500000 : loanType === 'business' ? 100000 : 50000).toLocaleString('en-IN')}</span>
            <span>₹{(loanType === 'home' ? 50000000 : loanType === 'business' ? 20000000 : 5000000).toLocaleString('en-IN')}</span>
          </div>

          {errors.loanAmount && <p className="text-xs text-rose-500 font-medium">{errors.loanAmount}</p>}
        </div>

        {/* Tenure Slider */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>Loan Tenure (Months / Years)</span>
            </label>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {tenureMonths} Months <span className="text-xs text-slate-400 font-normal">({(tenureMonths / 12).toFixed(1)} Yrs)</span>
            </div>
          </div>

          <input
            type="range"
            min={6}
            max={loanType === 'home' ? 360 : 84}
            step={6}
            value={tenureMonths}
            onChange={(e) => updateStep1({ tenureMonths: Number(e.target.value) })}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />

          <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
            <span>6 Months</span>
            <span>{loanType === 'home' ? '30 Years (360 Mo)' : '7 Years (84 Mo)'}</span>
          </div>
        </div>

        {/* Loan Purpose */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-brand-500" />
            <span>Loan Purpose / End-Use Statement</span>
          </label>

          <select
            value={purpose}
            onChange={(e) => updateStep1({ purpose: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          >
            {loanType === 'personal' && (
              <>
                <option value="Personal Expenses & Medical">Personal Expenses & Medical Emergency</option>
                <option value="Home Renovation & Interiors">Home Renovation & Interiors</option>
                <option value="Wedding & Family Function">Wedding & Family Function</option>
                <option value="Debt Consolidation">Debt Consolidation & Credit Card Payoff</option>
                <option value="Higher Education">Higher Education & Courses</option>
              </>
            )}
            {loanType === 'home' && (
              <>
                <option value="Purchase Ready Flat">Purchase Ready-to-Move Apartment</option>
                <option value="Under Construction Property">Under-Construction Builder Project</option>
                <option value="Construct Independent House">Construct Independent House on Plot</option>
                <option value="Plot Purchase">Purchase Residential Land / Plot</option>
                <option value="Balance Transfer & Topup">Home Loan Balance Transfer & Top-Up</option>
              </>
            )}
            {loanType === 'business' && (
              <>
                <option value="Working Capital & Inventory">Working Capital & Inventory Purchase</option>
                <option value="Machinery & Equipment Expansion">Machinery & Equipment Expansion</option>
                <option value="Office / Factory Space Lease">Office / Factory Space Lease</option>
                <option value="Business Refinancing">Business Refinancing & Debt Clearance</option>
              </>
            )}
          </select>

          {errors.purpose && <p className="text-xs text-rose-500 font-medium">{errors.purpose}</p>}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={nextStep}
          className="px-8 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center space-x-2 shadow-lg shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <span>Save & Proceed to Personal KYC</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
