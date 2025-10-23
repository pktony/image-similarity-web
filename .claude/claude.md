# Image Similarity Web - 포켓몬 닮은꼴 찾기 프로젝트

## 프로젝트 개요
사진을 업로드하거나 URL을 입력하면 포켓몬 닮은꼴을 찾아주는 웹 애플리케이션

## 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 아키텍처 원칙

### 폴더 구조 규칙
```
src/
├── api/              # API 클라이언트 (도메인별 분리)
│   └── {domain}/
│       ├── client.ts # API 호출 함수
│       └── index.ts  # Export
├── types/            # 타입 정의 및 스키마
│   ├── {domain}.ts
│   └── index.ts
├── data/             # JSON 데이터 (하드코딩 금지)
│   └── *.json
├── components/       # 컴포넌트 (컴포넌트별 폴더)
│   ├── {component-name}/
│   │   └── index.tsx
│   └── ui/           # 공통 UI 컴포넌트
├── app/              # 페이지 (도메인별 분리)
│   ├── {domain}/
│   │   └── page.tsx
│   └── page.tsx      # 루트 페이지
└── lib/              # 유틸리티
```

### 코딩 규칙

1. **반복 금지**: API는 `api/` 폴더에 도메인별로 정리
2. **타입 관리**: Schema와 Model은 `types/`에 저장
3. **페이지 분리**: `app/` 폴더 안에 도메인별로 분리
4. **컴포넌트 구조**:
   - 공통 컴포넌트는 `components/` 폴더
   - 컴포넌트별 폴더 생성
   - `index.tsx`에 구현
5. **UI 컴포넌트**: shadcn/ui 사용
   - `components/ui/`에 shadcn 컴포넌트 설치
   - 필요한 컴포넌트: Button, Input, Tabs, Card, Progress
6. **데이터 관리**: 하드코딩 금지, JSON 파일로 관리
7. **확인 필수**: 애매한 부분은 반드시 질문

## API 스펙

### Base URL
- 환경변수: `NEXT_PUBLIC_API_BASE_URL`
- 예시: `http://localhost:8000`

### Endpoints

#### 1. POST `/api/v1/similarity/find-by-upload`
파일 업로드로 유사도 검색

**Request**:
- `file`: Image file (multipart/form-data) - required
- `top_k`: Number (query param, default: 3, range: 1-10)

**Response**: `SimilarityResponse`

#### 2. POST `/api/v1/similarity/find-by-url`
URL로 유사도 검색

**Request**:
```json
{
  "url": "string (1-2083 chars)"
}
```
- `top_k`: Number (query param, default: 3, range: 1-10)

**Response**: `SimilarityResponse`

### Response Schema
```typescript
interface SimilarityResponse {
  top_k: [string, number][];  // [포켓몬명, 유사도] 배열
  verdict: string;             // 최종 판정
  s1: number;                  // 최고 유사도
  margin: number;              // s1 - s2 차이
  is_unknown: boolean;         // 불명 여부
}
```

**예시**:
```json
{
  "top_k": [
    ["피카츄", 0.85],
    ["라이츄", 0.72],
    ["파이리", 0.65]
  ],
  "verdict": "피카츄",
  "s1": 0.85,
  "margin": 0.13,
  "is_unknown": false
}
```

## 기능 요구사항

### 페이지 구성
- **라우트**: `/` (루트 페이지)
- **레이아웃**: 포켓몬 테마 (빨강/흰색/검정)

### 이미지 입력 방식
1. **파일 업로드 탭**
   - 드래그앤드롭 지원
   - 파일 선택 버튼
   - 파일 타입 검증

2. **URL 입력 탭**
   - URL 입력 필드
   - 유효성 검증

### 미리보기
- 업로드/입력한 이미지 표시
- 제거/재선택 기능

### 결과 표시
- **Top 3 고정** (1위/2위/3위)
- 메달 아이콘 또는 순위 표시
- 유사도 퍼센트 (프로그레스 바)
- 최종 판정(verdict) 강조

### UI/UX
- 포켓몬 테마 컬러
- 귀여운 디자인
- 애니메이션 (결과 표시 시)
- 반응형 디자인
- 로딩 상태 표시
- 에러 처리

## 개발 우선순위

1. shadcn/ui 설치 및 설정
2. 환경 설정 (.env.local)
3. 타입 정의 (types/)
4. 데이터 파일 (data/)
5. API 클라이언트 (api/similarity/)
6. shadcn 컴포넌트 설치 (Button, Input, Tabs, Card, Progress)
7. 도메인 컴포넌트 (upload-zone, image-preview, result-card)
8. 메인 페이지 (app/page.tsx)
9. 스타일링 및 애니메이션

## 주의사항

- 포켓몬 이미지는 플레이스홀더 사용 (나중에 제공 예정)
- Top K는 3개로 고정
- 모든 데이터는 JSON 파일로 관리
- 타입 안정성 최우선
- 컴포넌트 재사용성 고려
