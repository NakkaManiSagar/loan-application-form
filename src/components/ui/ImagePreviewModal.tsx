import React, { useState } from 'react';
import type { DocumentFile } from '../../types/loanForm';
import { X, ZoomIn, ZoomOut, RotateCw, Trash2 } from 'lucide-react';

interface ImagePreviewModalProps {
  doc: DocumentFile | null;
  onClose: () => void;
  onRemove?: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ doc, onClose, onRemove }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!doc) return null;

  const isPdf = doc.fileType === 'application/pdf';

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
              {doc.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document Type: <span className="uppercase font-semibold">{doc.docType}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Zoom Controls for Images */}
            {!isPdf && (
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-brand-500"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[40px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-brand-500"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-brand-500"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Remove Document Action Button */}
            {onRemove && (
              <button
                type="button"
                onClick={handleRemoveClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 transition-all text-xs font-semibold"
                title="Remove / Delete Document"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Document</span>
              </button>
            )}

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[350px]">
          {isPdf ? (
            <iframe
              src={doc.dataUrl}
              title={doc.name}
              className="w-full h-[550px] rounded-lg border border-slate-300 dark:border-slate-800"
            />
          ) : (
            <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
              <img
                src={doc.dataUrl}
                alt={doc.name}
                className="transition-transform duration-200 shadow-xl rounded-lg max-h-[500px] object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
