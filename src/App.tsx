import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { Header } from './components/common/Header';
import { StepProgress } from './components/common/StepProgress';
import { Toast } from './components/common/Toast';
import { ResumeModal } from './components/common/ResumeModal';

import { Step1LoanSelection } from './components/form-steps/Step1LoanSelection';
import { Step2PersonalKYC } from './components/form-steps/Step2PersonalKYC';
import { Step3ContactAddress } from './components/form-steps/Step3ContactAddress';
import { Step4EmploymentIncome } from './components/form-steps/Step4EmploymentIncome';
import { Step5DivergentDetails } from './components/form-steps/Step5DivergentDetails';
import { Step6BankFinancial } from './components/form-steps/Step6BankFinancial';
import { Step7DocumentUpload } from './components/form-steps/Step7DocumentUpload';
import { Step8ReviewESign } from './components/form-steps/Step8ReviewESign';
import { Step9PreApprovalSuccess } from './components/form-steps/Step9PreApprovalSuccess';

const FormContent: React.FC = () => {
  const { currentStep } = useFormContext();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <Step1LoanSelection />;
      case 2: return <Step2PersonalKYC />;
      case 3: return <Step3ContactAddress />;
      case 4: return <Step4EmploymentIncome />;
      case 5: return <Step5DivergentDetails />;
      case 6: return <Step6BankFinancial />;
      case 7: return <Step7DocumentUpload />;
      case 8: return <Step8ReviewESign />;
      case 9: return <Step9PreApprovalSuccess />;
      default: return <Step1LoanSelection />;
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {renderCurrentStep()}
    </main>
  );
};

export function App() {
  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
        <Header />
        <StepProgress />
        <FormContent />
        <ResumeModal />
        <Toast />
        
        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Zetheta Algorithms Private Limited. All Rights Reserved. WorkBridge Enterprise Loan Portal.</p>
          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">STRICTLY CONFIDENTIAL & PRIVATE NDA COMPLIANT WORKFLOW</p>
        </footer>
      </div>
    </FormProvider>
  );
}

export default App;
