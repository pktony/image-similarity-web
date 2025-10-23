import type { ImageUrlRequest, SimilarityResponse, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * API 에러 핸들링
 */
class ApiException extends Error {
  constructor(
    message: string,
    public status?: number,
    public detail?: ApiError
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

/**
 * 파일 업로드로 유사한 포켓몬 찾기
 * @param file - 업로드할 이미지 파일
 * @param topK - 반환할 결과 개수 (기본값: 3)
 * @returns SimilarityResponse
 */
export async function findSimilarByUpload(
  file: File,
  topK: number = 3
): Promise<SimilarityResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/similarity/find-by-upload?top_k=${topK}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiException(
        errorData.message || '이미지 업로드에 실패했습니다.',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    );
  }
}

/**
 * URL로 유사한 포켓몬 찾기
 * @param url - 이미지 URL
 * @param topK - 반환할 결과 개수 (기본값: 3)
 * @returns SimilarityResponse
 */
export async function findSimilarByUrl(
  url: string,
  topK: number = 3
): Promise<SimilarityResponse> {
  try {
    const requestBody: ImageUrlRequest = { url };

    const response = await fetch(
      `${API_BASE_URL}/api/v1/similarity/find-by-url?top_k=${topK}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiException(
        errorData.message || 'URL 분석에 실패했습니다.',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    );
  }
}

/**
 * 파일 유효성 검증
 * @param file - 검증할 파일
 * @returns 유효성 여부와 에러 메시지
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 제한 (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' };
  }

  // 이미지 파일 타입 검증
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '지원하는 이미지 형식: JPG, PNG, WebP, GIF' };
  }

  return { valid: true };
}

/**
 * URL 유효성 검증
 * @param url - 검증할 URL
 * @returns 유효성 여부와 에러 메시지
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  // 빈 문자열 체크
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL을 입력해주세요.' };
  }

  // URL 길이 제한 (API 스펙: 1-2083)
  if (url.length < 1 || url.length > 2083) {
    return { valid: false, error: 'URL 길이는 1-2083자 사이여야 합니다.' };
  }

  // URL 형식 검증
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'HTTP 또는 HTTPS URL만 지원합니다.' };
    }
  } catch {
    return { valid: false, error: '올바른 URL 형식이 아닙니다.' };
  }

  return { valid: true };
}
