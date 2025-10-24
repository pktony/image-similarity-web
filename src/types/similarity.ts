/**
 * Image Similarity API Types
 */

// API Request Types
export interface ImageUrlRequest {
  url: string; // 1-2083 chars
}

// API Response Types
export type SimilarityResult = [string, number]; // [포켓몬명, 유사도 점수]

export interface SimilarityResponse {
  top_k: SimilarityResult[]; // Top K 유사도 결과
  top_k_english: SimilarityResult[]; // Top K 유사도 영어 결과
  verdict: string; // 최종 판정 (포켓몬명 또는 "unknown")
  s1: number; // 최고 유사도 점수
  margin: number; // 1위와 2위 점수 차이 (s1 - s2)
  is_unknown: boolean; // 알 수 없음 여부
}

// UI State Types
export type UploadMode = 'file' | 'url';

export interface ImagePreview {
  file?: File;
  url?: string;
  previewUrl: string;
}

// Error Types
export interface ApiError {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
  message?: string;
}
