import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trash2, Check, PenTool } from 'lucide-react';

interface SignatureCanvasProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ value, onChange, error }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#026fc7');
  const strokeWidth = 3;
  const [hasStrokes, setHasStrokes] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Dynamically scale canvas resolution to match container bounding box
  const syncCanvasResolution = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // Save current drawing content before resize
      const ctx = canvas.getContext('2d');
      let currentData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        try {
          currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          currentData = null;
        }
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restore drawing content if canvas was resized
      if (ctx && currentData) {
        try {
          ctx.putImageData(currentData, 0, 0);
        } catch {
          // Ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    syncCanvasResolution();
    window.addEventListener('resize', syncCanvasResolution);
    return () => window.removeEventListener('resize', syncCanvasResolution);
  }, [syncCanvasResolution]);

  // Load existing signature dataUrl if present
  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasStrokes(true);
        };
        img.src = value;
      }
    }
  }, [value]);

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev, data]);
    } catch {
      // Ignore
    }
  };

  /**
   * Accurate HTML5 Canvas Coordinate Mapping
   * Multiplies CSS bounding rect offsets by scaling ratio canvas.width / rect.width
   * to align marker stroke 1:1 directly under mouse or touch cursor.
   */
  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveStateToHistory();
    setIsDrawing(true);
    setHasStrokes(true);

    const { x, y } = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    setHistory([]);
    onChange('');
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const previousState = newHistory.pop();
    setHistory(newHistory);

    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    } else {
      clearCanvas();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-900 dark:text-white">
          <PenTool className="w-4 h-4 text-brand-500" />
          <span>Digital Signature Canvas</span>
        </label>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Stroke Colors */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {['#026fc7', '#0f172a', '#059669'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setStrokeColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  strokeColor === c ? 'ring-2 ring-offset-1 ring-brand-500 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={undoLastStroke}
            disabled={history.length === 0}
            className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-brand-500 disabled:opacity-30"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 text-xs text-rose-500 hover:text-rose-600"
            title="Clear Signature"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Surface Container */}
      <div 
        ref={containerRef}
        className={`relative border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden transition-all h-44 ${
          error ? 'border-rose-500' : hasStrokes ? 'border-brand-500/60' : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none cursor-crosshair block"
        />

        {!hasStrokes && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <PenTool className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-xs font-medium">Draw your official signature here using mouse or touch</span>
          </div>
        )}

        {hasStrokes && (
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
            <Check className="w-3 h-3" />
            <span>Signature Captured</span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
