'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { decodeResult, type ShareableResult } from '@/lib/share';
import { getPokemonImages } from '@/api/pokemon';
import pokemonTheme from '@/data/pokemon-theme.json';
import Link from 'next/link';

const RANK_LABELS = {
  1: '🥇 최고의 닮은꼴!',
  2: '🥈 숨겨진 닮은꼴',
  3: '🥉 의외의 닮은꼴',
} as const;

function SharedResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ShareableResult | null>(null);
  const [error, setError] = useState(false);
  const [pokemonImages, setPokemonImages] = useState<(string | null)[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const medals = pokemonTheme.icons.medals;

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setError(true);
      return;
    }

    const decoded = decodeResult(data);
    if (!decoded) {
      setError(true);
      return;
    }

    setResult(decoded);
  }, [searchParams]);

  useEffect(() => {
    if (!result) return;

    const loadPokemonImages = async () => {
      setIsLoadingImages(true);
      try {
        const englishNames = result.top_k_english.slice(0, 3).map(([name]) => name);
        const images = await getPokemonImages(englishNames);
        setPokemonImages(images);
      } catch (err) {
        console.error('Failed to load Pokemon images:', err);
        setPokemonImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadPokemonImages();
  }, [result]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] space-y-6">
              <div className="text-6xl">😢</div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  결과를 찾을 수 없어요
                </h3>
                <p className="text-gray-600">링크가 잘못되었거나 만료되었을 수 있습니다.</p>
              </div>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
                  직접 테스트하러 가기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] space-y-6">
              <div className="text-6xl animate-bounce">⚡</div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 animate-pulse">
                  결과를 불러오는 중...
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { top_k } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="text-5xl">⚡</div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              포켓몬 닮은꼴 결과
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              친구의 포켓몬 닮은꼴을 확인해보세요!
            </p>
          </div>
        </header>

        <Card className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                ✨ 포켓몬 닮은꼴 결과
              </h3>

              {top_k.slice(0, 3).map((item, index) => {
                const [name, score] = item;
                const percentage = Math.round(score * 100);
                const rankNumber = (index + 1) as 1 | 2 | 3;
                const medal = medals[rankNumber.toString() as '1' | '2' | '3'];
                const pokemonImageUrl = pokemonImages[index];
                const rankLabel = RANK_LABELS[rankNumber];

                return (
                  <div
                    key={index}
                    className={`
                      space-y-3 p-4 rounded-xl border transition-all duration-200
                      ${index === 0 ? 'bg-amber-50 border-amber-200' : ''}
                      ${index === 1 ? 'bg-gray-50 border-gray-200' : ''}
                      ${index === 2 ? 'bg-orange-50 border-orange-200' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          text-2xl w-10 h-10 flex items-center justify-center rounded-full shrink-0
                          ${index === 0 ? 'bg-amber-100' : 'bg-white border border-gray-300'}
                        `}>
                          {medal}
                        </div>

                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-200 shrink-0">
                          {isLoadingImages ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                          ) : pokemonImageUrl ? (
                            <img
                              src={pokemonImageUrl}
                              alt={name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-2xl">❓</span>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-lg text-gray-900">{name}</p>
                          <p className="text-xs font-medium text-gray-500">
                            {rankLabel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">
                          {percentage}
                        </span>
                        <span className="text-sm font-medium text-gray-600">%</span>
                      </div>
                    </div>

                    <div className="relative">
                      <Progress
                        value={percentage}
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-4">
                나도 어떤 포켓몬을 닮았는지 궁금하다면?
              </p>
              <Link href="/">
                <Button className="px-6 py-5 text-sm font-bold h-auto rounded-xl bg-red-600 hover:bg-red-700 text-white">
                  <span className="mr-2">📸</span>
                  나도 테스트하러 가기!
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SharedResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] space-y-6">
              <div className="text-6xl animate-bounce">⚡</div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 animate-pulse">
                  결과를 불러오는 중...
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <SharedResultContent />
    </Suspense>
  );
}
