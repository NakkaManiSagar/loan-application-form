import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { 
  FileText, User, MapPin, Briefcase, Split, 
  Building2, UploadCloud, PenTool, Award, Check 
} from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
}

export const STEPS: StepItem[] = [
  { id: 1, title: 'Loan Selection', shortTitle: 'Loan', icon: FileText },
  { id: 2, title: 'Personal & KYC', shortTitle: 'KYC', icon: User },
  { id: 3, title: 'Contact & Address', shortTitle: 'Address', icon: MapPin },
  { id: 4, title: 'Employment', shortTitle: 'Income', icon: Briefcase },
  { id: 5, title: 'Loan Details', shortTitle: 'Divergent', icon: Split },
  { id: 6, title: 'Bank Verification', shortTitle: 'Bank', icon: Building2 },
  { id: 7, title: 'Documents', shortTitle: 'Uploads', icon: UploadCloud },
  { id: 8, title: 'Review & Sign', shortTitle: 'E-Sign', icon: PenTool },
  { id: 9, title: 'Pre-Approval', shortTitle: 'Approval', icon: Award },
];

export const StepProgress: React.FC = () => {
  const { currentStep, completedSteps, jumpToStep } = useFormContext();

  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100));

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Progress Percent Bar */}
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Application Progress</span>
          <span className="text-brand-600 dark:text-brand-400 font-bold">{progressPercent}% Completed</span>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps Grid / Scrollable Bar */}
        <div className="relative flex items-center justify-between overflow-x-auto pb-2 scrollbar-thin">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isAccessible = isCompleted || step.id <= currentStep;

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && jumpToStep(step.id)}
                disabled={!isAccessible}
                className={`flex flex-col items-center min-w-[70px] sm:min-w-[90px] px-1 group transition-all duration-200 ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                }`}
              >
                {/* Step Icon Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-110 ring-2 ring-brand-400/50'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-medium text-center truncate max-w-[85px] transition-colors ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-600 dark:text-slate-400 font-medium'
                  }`}
                >
                  {step.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
