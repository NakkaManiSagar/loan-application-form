import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { FileUploader } from '../ui/FileUploader';
import { ImagePreviewModal } from '../ui/ImagePreviewModal';
import type { DocumentFile } from '../../types/loanForm';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Step7DocumentUpload: React.FC = () => {
  const { state, updateStep7, removeDocument, nextStep, prevStep, errors } = useFormContext();
  const docs = state.step7.documents;
  const loanType = state.step1.loanType;

  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  const handleUpload = (docType: string, file: DocumentFile) => {
    updateStep7(docType, file);
  };

  const handleRemove = (docType: string) => {
    removeDocument(docType);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Step 7: Client-Side Encrypted Document Uploads & Canvas Compression
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload mandatory KYC & financial proofs. All images are compressed automatically on your device via HTML5 Canvas before uploading.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PAN Card */}
          <FileUploader
            label="PAN Card Document"
            description="Clear front photo of PAN Card"
            docType="pan"
            existingFile={docs.pan}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onPreview={setPreviewDoc}
            error={errors.pan}
          />

          {/* Aadhaar Card */}
          <FileUploader
            label="Aadhaar Card Proof"
            description="Front & Back or e-Aadhaar PDF"
            docType="aadhaar"
            existingFile={docs.aadhaar}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onPreview={setPreviewDoc}
            error={errors.aadhaar}
          />

          {/* Income Proof */}
          <FileUploader
            label="Income Proof / Salary Slips / ITR"
            description="Latest 3 months salary slips or ITR acknowledgement"
            docType="income_proof"
            existingFile={docs.income_proof}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onPreview={setPreviewDoc}
            error={errors.income_proof}
          />

          {/* Bank Statements */}
          <FileUploader
            label="6-Month Bank Statement"
            description="Primary bank account statement in PDF / Image format"
            docType="bank_statement"
            existingFile={docs.bank_statement}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onPreview={setPreviewDoc}
            error={errors.bank_statement}
          />
        </div>

        {/* Loan Specific Divergent Document */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {loanType === 'home' && (
            <FileUploader
              label="Property Allotment / Sale Deed / Plan"
              description="Copy of builder allotment letter, sale agreement, or registered property deed"
              docType="loan_specific_doc"
              existingFile={docs.loan_specific_doc}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onPreview={setPreviewDoc}
              error={errors.loan_specific_doc}
            />
          )}

          {loanType === 'business' && (
            <FileUploader
              label="GST Registration / Business Incorporation Certificate"
              description="Official GST certificate (Form REG-06) or Udyam / Shop Act license"
              docType="loan_specific_doc"
              existingFile={docs.loan_specific_doc}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onPreview={setPreviewDoc}
              error={errors.loan_specific_doc}
            />
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <ImagePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

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
          <span>Proceed to Review & E-Sign</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
