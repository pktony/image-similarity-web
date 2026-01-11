'use client';

import { useState } from 'react';
import { Link2, Check, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SimilarityResponse } from '@/types';
import {
  createShareUrl,
  copyToClipboard,
  extractShareableResult,
  shareToKakao,
} from '@/lib/share';

interface ShareButtonProps {
  result: SimilarityResponse;
  captureTargetRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButton({ result, captureTargetRef }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const shareUrl = createShareUrl(result);
  const shareable = extractShareableResult(result);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKakaoShare = () => {
    const success = shareToKakao(shareable, shareUrl);
    if (!success) {
      alert('카카오톡 공유를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSaveImage = async () => {
    if (!captureTargetRef?.current) return;

    setIsSaving(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(captureTargetRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `pokemon-lookalike-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2 rounded-lg border-gray-300 hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-600">복사됨!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span>링크 복사</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleKakaoShare}
        className="gap-2 rounded-lg border-gray-300 hover:bg-gray-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.643 1.758 4.968 4.404 6.29-.145.525-.934 3.38-.967 3.598 0 0-.02.166.088.229.108.063.235.015.235.015.31-.043 3.593-2.356 4.158-2.767.686.096 1.393.146 2.082.146 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
        </svg>
        <span>카카오톡</span>
      </Button>

      {captureTargetRef && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveImage}
          disabled={isSaving}
          className="gap-2 rounded-lg border-gray-300 hover:bg-gray-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>이미지 저장</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
