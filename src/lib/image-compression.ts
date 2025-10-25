import imageCompression from 'browser-image-compression';
import { COMPRESSION_CONFIG } from '@/config/compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const compressionOptions = {
    ...COMPRESSION_CONFIG,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);

    const originalSizeMB = file.size / 1024 / 1024;
    const compressedSizeMB = compressedFile.size / 1024 / 1024;
    const reductionPercent = ((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1);

    console.log(`Image compressed: ${originalSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${reductionPercent}% reduction)`);

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    return file;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
