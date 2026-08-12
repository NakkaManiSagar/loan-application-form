import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useFormContext();

  if (!toastMessage) return null;

  const { text, type } = toastMessage;

  const bgColors = {
    success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
    error: 'bg-rose-900/90 border-rose-500/50 text-rose-100',
    info: 'bg-brand-900/90 border-brand-500/50 text-brand-100',
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${bgColors[type]}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
};
