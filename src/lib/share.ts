import type { SimilarityResponse } from '@/types';

export interface ShareableResult {
  top_k: [string, number][];
  top_k_english: [string, number][];
  verdict: string;
}

export function extractShareableResult(result: SimilarityResponse): ShareableResult {
  return {
    top_k: result.top_k.slice(0, 3) as [string, number][],
    top_k_english: result.top_k_english.slice(0, 3) as [string, number][],
    verdict: result.verdict,
  };
}

export function encodeResult(result: ShareableResult): string {
  const json = JSON.stringify(result);
  const base64 = btoa(encodeURIComponent(json));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeResult(encoded: string): ShareableResult | null {
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

export function createShareUrl(result: SimilarityResponse, baseUrl?: string): string {
  const shareable = extractShareableResult(result);
  const encoded = encodeResult(shareable);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://image-similarity-web.vercel.app');
  return `${base}/result?data=${encoded}`;
}

export function createShareText(result: ShareableResult): string {
  const [topPokemon, topScore] = result.top_k[0];
  const percentage = Math.round(topScore * 100);
  return `나와 닮은 포켓몬은 ${topPokemon}(${percentage}%)래요! ⚡ 당신도 테스트해보세요!`;
}

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

const KAKAO_APP_KEY = '6582fe19030b6a607808fc34e2735440';

function initKakao(): boolean {
  if (typeof window === 'undefined' || !window.Kakao) {
    return false;
  }
  
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }
  
  return window.Kakao.isInitialized();
}

export function shareToKakao(result: ShareableResult, shareUrl: string): boolean {
  if (!initKakao() || !window.Kakao) {
    return false;
  }

  const [topPokemon, topScore] = result.top_k[0];
  const percentage = Math.round(topScore * 100);

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `나의 포켓몬 닮은꼴: ${topPokemon} (${percentage}%)`,
      description: '나와 닮은 포켓몬을 찾아보세요! ⚡',
      imageUrl: 'https://image-similarity-web.vercel.app/opengraph-image',
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '나도 테스트하기',
        link: {
          mobileWebUrl: 'https://image-similarity-web.vercel.app',
          webUrl: 'https://image-similarity-web.vercel.app',
        },
      },
    ],
  });

  return true;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch {
      return false;
    }
  }
}
