import React, { useState } from 'react';
import type { DocumentFile } from '../../types/loanForm';
import { compressImageFile, formatBytes } from '../../utils/imageCompression';
import { UploadCloud, FileCheck, Trash2, Eye, Cpu, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  description: string;
  docType: 'pan' | 'aadhaar' | 'income_proof' | 'bank_statement' | 'loan_specific_doc';
  existingFile?: DocumentFile;
  onUpload: (docType: string, doc: DocumentFile) => void;
  onRemove: (docType: string) => void;
  onPreview: (doc: DocumentFile) => void;
  error?: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  docType,
  existingFile,
  onUpload,
  onRemove,
  onPreview,
  error,
  accept = 'image/jpeg,image/png,application/pdf',
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    try {
      setIsCompressing(true);
      const res = await compressImageFile(file);

      const docFile: DocumentFile = {
        id: `${docType}-${Date.now()}`,
        docType,
        name: file.name,
        fileType: file.type,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        dataUrl: res.dataUrl,
        uploadedAt: new Date().toISOString(),
      };

      onUpload(docType, docFile);
    } catch (err) {
      console.error('File compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
          <span>{label}</span>
          <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
      </div>

      {!existingFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 ${
            dragActive
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
              : error
              ? 'border-rose-500/80 bg-rose-50/30 dark:bg-rose-950/10'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 hover:border-brand-400'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={onChangeInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            {isCompressing ? (
              <div className="flex flex-col items-center py-2">
                <Cpu className="w-8 h-8 text-brand-500 animate-spin mb-1" />
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  Client-side Canvas Image Compression in progress...
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-500 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-brand-500 underline">Click to upload</span> or drag and drop file
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Supports JPG, PNG, PDF up to 10MB (Auto-compressed)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Uploaded Document Card */
        <div className="border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>

            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {existingFile.name}
              </p>
              
              {/* Compression Metric Badge */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span>{formatBytes(existingFile.compressedSize)}</span>
                {existingFile.originalSize > existingFile.compressedSize && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.2 rounded">
                    Saved Math.round(((existingFile.originalSize - existingFile.compressedSize)/existingFile.originalSize)*100)%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => onPreview(existingFile)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Preview Document"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(docType)}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-rose-500 text-xs font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
