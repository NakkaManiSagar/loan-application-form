/**
 * HTML5 Canvas Image Compression Utility
 * Client-side compression for user uploaded KYC & financial documents before storing in application state.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // e.g. 45% reduction
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 340 KB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Compress image file using HTML5 Canvas
 * @param file Uploaded image File object
 * @param maxWidth Max width in pixels (default 1200)
 * @param maxHeight Max height in pixels (default 1200)
 * @param quality JPEG compression quality 0.1 to 1.0 (default 0.75)
 */
export function compressImageFile(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // If PDF or non-image document, read as DataURL without canvas compression
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate standard aspect ratio scaling
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Create HTML5 Canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw image onto canvas
        ctx.fillStyle = '#FFFFFF'; // white background for transparent PNGs
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas image to compressed JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate size in bytes from base64 string
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
        const compressedSizeBytes = Math.round(base64Length * (3 / 4));

        const originalSize = file.size;
        const compressionRatio = originalSize > 0 
          ? Math.max(0, Math.round(((originalSize - compressedSizeBytes) / originalSize) * 100))
          : 0;

        resolve({
          dataUrl: compressedDataUrl,
          originalSize,
          compressedSize: compressedSizeBytes,
          compressionRatio,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for canvas compression'));
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
