import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '포켓몬 닮은꼴 결과';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface PageProps {
  searchParams: Promise<{ data?: string }>;
}

interface ShareableResult {
  top_k: [string, number][];
  verdict: string;
}

function decodeResult(encoded: string): ShareableResult | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = decodeURIComponent(atob(base64));
    const parsed = JSON.parse(json);

    if (!parsed.top_k || !Array.isArray(parsed.top_k)) {
      return null;
    }

    return parsed as ShareableResult;
  } catch {
    return null;
  }
}

const MEDAL_STYLES = [
  { medal: '🥇', bg: '#fef3c7', border: '#fbbf24', text: '#92400e' },
  { medal: '🥈', bg: '#f3f4f6', border: '#9ca3af', text: '#374151' },
  { medal: '🥉', bg: '#ffedd5', border: '#fb923c', text: '#9a3412' },
];

function ResultRow({ name, score, index }: { name: string; score: number; index: number }) {
  const percentage = Math.round(score * 100);
  const style = MEDAL_STYLES[index];
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        borderRadius: 20,
        background: style.bg,
        border: `3px solid ${style.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 48 }}>{style.medal}</span>
        <span style={{ fontSize: 40, fontWeight: 800, color: style.text }}>
          {name}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 56, fontWeight: 900, color: '#1f2937' }}>
          {percentage}
        </span>
        <span style={{ fontSize: 28, fontWeight: 600, color: '#6b7280' }}>%</span>
      </div>
    </div>
  );
}

export default async function Image({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = params.data;
  const result = data ? decodeResult(data) : null;

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #ef4444 0%, #ef4444 45%, #1f2937 45%, #1f2937 55%, #f8fafc 55%, #f8fafc 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 200,
            }}
          >
            <span style={{ fontSize: 72 }}>⚡</span>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: '#1f2937', margin: 0 }}>
              포켓몬 닮은꼴 찾기
            </h1>
            <p style={{ fontSize: 28, color: '#4b5563', margin: 0, marginTop: 16 }}>
              나와 닮은 포켓몬을 찾아보세요!
            </p>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const first = result.top_k[0];
  const second = result.top_k[1];
  const third = result.top_k[2];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fee2e2 100%)',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 56 }}>⚡</span>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#1f2937', margin: 0 }}>
            포켓몬 닮은꼴 결과
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            flex: 1,
          }}
        >
          {first && <ResultRow name={first[0]} score={first[1]} index={0} />}
          {second && <ResultRow name={second[0]} score={second[1]} index={1} />}
          {third && <ResultRow name={third[0]} score={third[1]} index={2} />}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <p style={{ fontSize: 24, color: '#6b7280', margin: 0 }}>
            image-similarity-web.vercel.app
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
