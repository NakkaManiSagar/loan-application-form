import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { Sun, Moon, CheckCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, isDarkMode, toggleDarkMode, resetForm } = useFormContext();
  const { isAutoSaved, lastSavedAt, currentStep } = state;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                ZETHETA <span className="text-brand-500 dark:text-brand-400 font-semibold">WorkBridge</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                PROD-GRADE FINTECH ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Enterprise Loan Disbursement & Underwriting Portal
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center space-x-3">
          {/* Auto-save Pill */}
          {currentStep > 1 && currentStep < 9 && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {isAutoSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse-subtle" />
                  <span className="hidden md:inline">Auto-Saved</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Saving...</span>
                </>
              )}
            </div>
          )}

          {/* Reset Draft Button */}
          {currentStep > 1 && (
            <button
              onClick={resetForm}
              title="Reset Application & Clear Draft"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-150"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
