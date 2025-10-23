'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateImageFile } from '@/api/similarity';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setError(null);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      setError('이미지 파일을 업로드해주세요.');
      return;
    }

    const validation = validateImageFile(imageFile);
    if (!validation.valid) {
      setError(validation.error || '파일이 유효하지 않습니다.');
      return;
    }

    onFileSelect(imageFile);
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '파일이 유효하지 않습니다.');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 sm:p-16 text-center transition-all cursor-pointer',
          isDragOver && !disabled && 'border-red-500 bg-red-50 scale-[1.01]',
          !isDragOver && 'border-gray-300 hover:border-red-400 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-400 bg-red-50'
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center gap-4">
          {isDragOver ? (
            <Upload className="w-12 h-12 text-red-600" />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-600" />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-base font-semibold text-gray-900">
              {isDragOver ? '이미지를 여기에 놓으세요' : '이미지를 드래그하거나 클릭하세요'}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP, GIF (최대 10MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700 text-center">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}
