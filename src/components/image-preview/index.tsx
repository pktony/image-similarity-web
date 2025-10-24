'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import type { ImagePreview as ImagePreviewType } from '@/types';

interface ImagePreviewProps {
  image: ImagePreviewType;
  onRemove: () => void;
}

export default function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative p-4 bg-gray-50 rounded-xl border border-gray-200">
        {/* Image container */}
        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 bg-white">
          <Image
            src={image.previewUrl}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={!!image.url}
          />
        </div>

        {/* File name badge */}
        {image.file && (
          <div className="mt-3 px-3 py-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-600 text-center truncate">
              {image.file.name}
            </p>
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center border-2 border-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
