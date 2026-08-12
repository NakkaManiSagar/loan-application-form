import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { FileText, ArrowRight, X } from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const { hasSavedDraft, restoreDraft, dismissDraftPrompt } = useFormContext();

  if (!hasSavedDraft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={dismissDraftPrompt}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Resume Previous Application Draft?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          We found an unsaved loan application draft stored on this device. Would you like to pick up where you left off?
        </p>

        <div className="flex space-x-3">
          <button
            onClick={dismissDraftPrompt}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Start Fresh
          </button>
          <button
            onClick={restoreDraft}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 transition-all"
          >
            <span>Resume Draft</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
