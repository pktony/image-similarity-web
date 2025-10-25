import type { CompressionOptions } from '@/lib/image-compression';

/**
 * 이미지 압축 설정
 * - maxSizeMB: 압축 후 최대 파일 크기 (MB)
 * - maxWidthOrHeight: 압축 후 최대 가로/세로 크기 (px)
 * - useWebWorker: 웹 워커 사용 여부 (성능 향상)
 * - quality: 압축 품질 (0.0 ~ 1.0)
 */
export const COMPRESSION_CONFIG: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.8,
};

/**
 * 파일 크기 제한 (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 허용된 이미지 타입
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/**
 * 압축 메시지
 */
export const COMPRESSION_MESSAGES = {
  compressing: '이미지 압축 중...',
  wait: '잠시만 기다려주세요',
  success: '압축 완료',
  failed: '압축 실패 (원본 사용)',
} as const;
