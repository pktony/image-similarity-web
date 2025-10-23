'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SimilarityResponse } from '@/types';
import pokemonTheme from '@/data/pokemon-theme.json';

interface ResultCardProps {
  result: SimilarityResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { top_k } = result;
  const medals = pokemonTheme.icons.medals;

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      <CardContent className="p-6 sm:p-8 space-y-5">

        <div className="space-y-4">
          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            🏆 매칭 결과
          </h3>

          {top_k.slice(0, 3).map((item, index) => {
            const [name, score] = item;
            const percentage = Math.round(score * 100);
            const rankNumber = (index + 1) as 1 | 2 | 3;
            const medal = medals[rankNumber.toString() as '1' | '2' | '3'];

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      text-2xl w-10 h-10 flex items-center justify-center rounded-full shrink-0
                      ${index === 0 ? 'bg-amber-100' : 'bg-white border border-gray-300'}
                    `}>
                      {medal}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{name}</p>
                      <p className="text-xs font-medium text-gray-500">
                        {rankNumber}위
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

        {result.margin > 0 && (
          <div className="pt-2">
            <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700 text-center">
                <span className="mr-2">🎯</span>
                신뢰도: <span className="font-bold text-blue-700">{Math.round(result.margin * 100)}%</span>
                <span className="text-gray-500 ml-1">(1위-2위 차이)</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
