import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FormState, DocumentFile, StepValidationResult } from '../types/loanForm';
import { INITIAL_FORM_STATE, saveDraft, loadDraft, clearDraft } from '../utils/storage';
import { validateStep } from '../utils/validation';
import { evaluatePreApproval } from '../utils/calculator';

interface FormContextType {
  state: FormState;
  currentStep: number;
  completedSteps: number[];
  errors: Record<string, string>;
  isDarkMode: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  hasSavedDraft: boolean;
  
  // Actions
  setStep: (step: number) => void;
  updateStep1: (fields: Partial<FormState['step1']>) => void;
  updateStep2: (fields: Partial<FormState['step2']>) => void;
  updateStep3: (fields: Partial<FormState['step3']>) => void;
  updateStep4: (fields: Partial<FormState['step4']>) => void;
  updateStep5: (fields: Partial<FormState['step5']>) => void;
  updateStep6: (fields: Partial<FormState['step6']>) => void;
  updateStep7: (docType: string, file: DocumentFile) => void;
  removeDocument: (docType: string) => void;
  updateStep8: (fields: Partial<FormState['step8']>) => void;
  
  nextStep: () => boolean;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  toggleDarkMode: () => void;
  resetForm: () => void;
  restoreDraft: () => void;
  dismissDraftPrompt: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  submitApplication: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('zetheta_theme_mode');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // Check LocalStorage for saved draft on initial load
  useEffect(() => {
    const saved = loadDraft();
    if (saved && saved.currentStep > 1 && !saved.preApproval) {
      setHasSavedDraft(true);
    }
  }, []);

  // Theme Syncing with DOM root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('zetheta_theme_mode', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('zetheta_theme_mode', 'light'); } catch {}
    }
  }, [isDarkMode]);

  // Toast auto-hide
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Debounced Auto-Save to LocalStorage
  useEffect(() => {
    if (state.currentStep > 1 && !state.preApproval) {
      const timer = setTimeout(() => {
        saveDraft(state);
        setState((prev) => ({ ...prev, isAutoSaved: true, lastSavedAt: new Date().toISOString() }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateStep1 = (fields: Partial<FormState['step1']>) => {
    setState((prev) => ({ ...prev, step1: { ...prev.step1, ...fields } }));
    setErrors({});
  };

  const updateStep2 = (fields: Partial<FormState['step2']>) => {
    setState((prev) => ({ ...prev, step2: { ...prev.step2, ...fields } }));
    setErrors({});
  };

  const updateStep3 = (fields: Partial<FormState['step3']>) => {
    setState((prev) => ({ ...prev, step3: { ...prev.step3, ...fields } }));
    setErrors({});
  };

  const updateStep4 = (fields: Partial<FormState['step4']>) => {
    setState((prev) => ({ ...prev, step4: { ...prev.step4, ...fields } }));
    setErrors({});
  };

  const updateStep5 = (fields: Partial<FormState['step5']>) => {
    setState((prev) => ({ ...prev, step5: { ...prev.step5, ...fields } }));
    setErrors({});
  };

  const updateStep6 = (fields: Partial<FormState['step6']>) => {
    setState((prev) => ({ ...prev, step6: { ...prev.step6, ...fields } }));
    setErrors({});
  };

  const updateStep7 = (docType: string, file: DocumentFile) => {
    setState((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        documents: {
          ...prev.step7.documents,
          [docType]: file,
        },
      },
    }));
    setErrors({});
  };

  const removeDocument = (docType: string) => {
    setState((prev) => {
      const updatedDocs = { ...prev.step7.documents };
      delete updatedDocs[docType];
      return {
        ...prev,
        step7: {
          ...prev.step7,
          documents: updatedDocs,
        },
      };
    });
  };

  const updateStep8 = (fields: Partial<FormState['step8']>) => {
    setState((prev) => ({ ...prev, step8: { ...prev.step8, ...fields } }));
    setErrors({});
  };

  const nextStep = (): boolean => {
    const current = state.currentStep;
    const validation: StepValidationResult = validateStep(current, state);

    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      showToast(firstError || 'Please fix errors before continuing', 'error');
      return false;
    }

    setErrors({});
    setState((prev) => {
      const completed = prev.completedSteps.includes(current)
        ? prev.completedSteps
        : [...prev.completedSteps, current];
      const nextStepIndex = Math.min(9, current + 1);
      return {
        ...prev,
        completedSteps: completed,
        currentStep: nextStepIndex,
      };
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Step ${current} completed!`, 'success');
    return true;
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      setStep(state.currentStep - 1);
    }
  };

  const jumpToStep = (targetStep: number) => {
    // Only allow jump to already completed step or previous step
    if (targetStep <= state.currentStep || state.completedSteps.includes(targetStep - 1)) {
      setStep(targetStep);
    } else {
      showToast('Please complete previous steps first', 'info');
    }
  };

  const restoreDraft = () => {
    const saved = loadDraft();
    if (saved) {
      setState(saved);
      setHasSavedDraft(false);
      showToast('Application draft restored successfully!', 'success');
    }
  };

  const dismissDraftPrompt = () => {
    setHasSavedDraft(false);
  };

  const resetForm = () => {
    clearDraft();
    setState(INITIAL_FORM_STATE);
    setErrors({});
    showToast('Form reset successfully', 'info');
  };

  const submitApplication = () => {
    const validation = validateStep(8, state);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast(Object.values(validation.errors)[0] || 'Validation failed on step 8', 'error');
      return;
    }

    const preApproval = evaluatePreApproval(state);
    setState((prev) => {
      const finalState = {
        ...prev,
        currentStep: 9,
        completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        preApproval,
      };
      saveDraft(finalState);
      return finalState;
    });

    showToast('Application submitted successfully! Pre-approval calculated.', 'success');
  };

  return (
    <FormContext.Provider
      value={{
        state,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        errors,
        isDarkMode,
        toastMessage,
        hasSavedDraft,
        setStep,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        updateStep6,
        updateStep7,
        removeDocument,
        updateStep8,
        nextStep,
        prevStep,
        jumpToStep,
        toggleDarkMode,
        resetForm,
        restoreDraft,
        dismissDraftPrompt,
        showToast,
        submitApplication,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
