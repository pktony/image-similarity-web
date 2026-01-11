'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadZone from '@/components/upload-zone';
import ImagePreview from '@/components/image-preview';
import ResultCard from '@/components/result-card';
import {
  findSimilarByUpload,
  findSimilarByUrl,
  validateImageUrl,
} from '@/api/similarity';
import type { UploadMode, ImagePreview as ImagePreviewType, SimilarityResponse } from '@/types';

export default function Home() {
  const [mode, setMode] = useState<UploadMode>('file');
  const [imagePreview, setImagePreview] = useState<ImagePreviewType | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimilarityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // 파일 선택 핸들러
  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview({ file, previewUrl });
    setResult(null);
    setError(null);
  };

  // URL 입력 핸들러
  const handleUrlSubmit = () => {
    const validation = validateImageUrl(imageUrl);
    if (!validation.valid) {
      setError(validation.error || 'URL이 유효하지 않습니다.');
      return;
    }

    setImagePreview({ url: imageUrl, previewUrl: imageUrl });
    setResult(null);
    setError(null);
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    if (imagePreview?.previewUrl && imagePreview.file) {
      URL.revokeObjectURL(imagePreview.previewUrl);
    }
    setImagePreview(null);
    setImageUrl('');
    setResult(null);
    setError(null);
  };

  // 분석 실행 핸들러
  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    setError(null);

    try {
      let response: SimilarityResponse;

      if (imagePreview.file) {
        response = await findSimilarByUpload(imagePreview.file, 3);
      } else if (imagePreview.url) {
        response = await findSimilarByUrl(imagePreview.url, 3);
      } else {
        throw new Error('이미지 정보가 없습니다.');
      }

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 헤더 */}
        <header className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="text-5xl">⚡</div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              포켓몬 닮은꼴 찾기
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              사진을 업로드하면 닮은 포켓몬을 찾아드립니다
            </p>
          </div>
        </header>

        {/* 업로드 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 space-y-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as UploadMode)}>
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="file" className="text-sm font-semibold">파일 업로드</TabsTrigger>
              <TabsTrigger value="url" className="text-sm font-semibold">URL 입력</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              {!imagePreview ? (
                <UploadZone onFileSelect={handleFileSelect} disabled={isLoading} />
              ) : (
                <ImagePreview image={imagePreview} onRemove={handleRemoveImage} />
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              {!imagePreview ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      disabled={isLoading}
                    />
                    <Button onClick={handleUrlSubmit} disabled={isLoading || !imageUrl}>
                      확인
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    이미지 URL을 입력하고 확인 버튼을 클릭하세요
                  </p>
                </div>
              ) : (
                <ImagePreview image={imagePreview} onRemove={handleRemoveImage} />
              )}
            </TabsContent>
          </Tabs>

          {/* 분석 버튼 */}
          {imagePreview && !result && (
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  분석 중...
                </span>
              ) : (
                '포켓몬 찾기'
              )}
            </Button>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-700 text-center flex items-center justify-center gap-2">
                <span className="text-base">⚠️</span>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* 결과 섹션 */}
        {result && (
          <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
            <ResultCard result={result} />

            {/* 다시 시도 버튼 */}
            <div className="text-center">
              <Button
                onClick={handleRemoveImage}
                variant="outline"
                className="px-6 py-5 text-sm font-semibold h-auto rounded-xl border-2 hover:bg-gray-50"
              >
                <span className="mr-2">📸</span>
                새로운 사진으로 도전!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
