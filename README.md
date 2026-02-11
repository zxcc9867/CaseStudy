# 케이스 면접 연습 애플리케이션

AI 기반 컨설팅 케이스 면접 연습 플랫폼입니다. 실제 면접과 유사하게 면접관과 대화하며 정보를 확인한 후 답변을 작성하고, AI가 답변을 평가·피드백해 줍니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [사용 방법](#사용-방법)
- [API 엔드포인트](#api-엔드포인트)
- [아키텍처](#아키텍처)

## ✨ 주요 기능

### 1. **AI 케이스 문제 생성**
- 5가지 유형의 케이스 문제 자동 생성
  - 시장 규모 추정 (Market Sizing)
  - 수익성 (Profitability)
  - 전략 (Strategy)
  - 브레인스토밍 (Brainstorming)
  - 기타 (Misc)

### 2. **대화형 면접 시뮬레이션**
- 면접관 역할의 AI와 실시간 대화
- 전제 확인을 위한 질문 가능 (여러 번 가능)
- 대화 히스토리 자동 저장 및 표시
- 실제 면접과 유사한 인터랙티브 경험

### 3. **AI 기반 답변 평가**
- 점수 (0-100점)
- 전체 요약 평가
- 강점 분석
- 개선점 제시
- 모범 답안 포인트 제공
- 대화 히스토리 기반 평가 (질문의 적절성, 정보 활용도 포함)

## 🛠 기술 스택

### Frontend
- **Next.js 16.1.6** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4** (스타일링)

### Backend
- **Next.js API Routes** (서버 사이드 API)
- **OpenAI API** (GPT-4o-mini 모델)

### 개발 도구
- **ESLint** (코드 품질)
- **Turbopack** (빠른 개발 서버)

## 📁 프로젝트 구조

```
casestudy/
├── app/
│   ├── api/                    # API 라우트 (서버 사이드)
│   │   ├── case-question/      # 케이스 문제 생성
│   │   │   └── route.ts
│   │   ├── ask-question/       # 면접관에게 질문하기
│   │   │   └── route.ts
│   │   └── evaluate/           # 답변 평가
│   │       └── route.ts
│   ├── page.tsx                # 메인 페이지 (클라이언트 컴포넌트)
│   ├── layout.tsx              # 루트 레이아웃
│   └── globals.css             # 전역 스타일
├── lib/
│   ├── openai.ts               # OpenAI 클라이언트 유틸리티
│   └── types.ts                # TypeScript 타입 정의
├── .env.example                # 환경 변수 예시
├── package.json
└── README.md
```

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 OpenAI API 키를 추가합니다:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**API 키 발급 방법:**
1. [OpenAI Platform](https://platform.openai.com/api-keys) 접속
2. 계정 생성/로그인
3. API Keys 메뉴에서 새 키 생성
4. 생성된 키를 `.env` 파일에 복사

> ⚠️ **보안 주의**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. API 키는 절대 공개하지 마세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 📖 사용 방법

### 1. 케이스 문제 받기
- 원하는 유형 선택 (시장 규모 추정, 수익성, 전략 등)
- **「케이스 문제 받기」** 버튼 클릭
- AI가 해당 유형의 케이스 문제를 생성합니다

### 2. 면접관에게 질문하기
- 문제를 읽고 추가 정보가 필요하면 질문 입력
- 예시 질문:
  - "시장 규모는 얼마인가요?"
  - "경쟁사는 누구인가요?"
  - "목표 고객층은?"
  - "현재 매출은?"
- **「질문하기」** 버튼 클릭 또는 Enter 키
- AI 면접관이 답변합니다
- 필요시 여러 번 질문 가능

### 3. 최종 답변 작성
- 확인한 정보를 바탕으로 최종 답변 작성
- 구조화된 접근 방식 권장:
  - 문제 정의
  - 분석 프레임워크 제시
  - 구체적 계산/분석
  - 결론 및 제안

### 4. 평가 받기
- **「평가 받기」** 버튼 클릭
- AI가 다음을 평가합니다:
  - 문제 이해도
  - 질문의 적절성
  - 논리적 사고 과정
  - 구조화된 접근
  - 최종 답변의 완성도

## 🔌 API 엔드포인트

### `POST /api/case-question`

케이스 문제를 생성합니다.

**Request Body:**
```json
{
  "category": "market-sizing" | "profitability" | "strategy" | "brainstorming" | "misc"
}
```

**Response:**
```json
{
  "id": "gen-1234567890",
  "title": "문제 제목",
  "category": "market-sizing",
  "question": "문제 본문..."
}
```

### `POST /api/ask-question`

면접관에게 질문하고 답변을 받습니다.

**Request Body:**
```json
{
  "caseQuestion": "케이스 문제 본문",
  "conversationHistory": [
    { "role": "user", "content": "이전 질문" },
    { "role": "assistant", "content": "이전 답변" }
  ],
  "userQuestion": "현재 질문"
}
```

**Response:**
```json
{
  "answer": "면접관의 답변"
}
```

### `POST /api/evaluate`

사용자의 답변을 평가합니다.

**Request Body:**
```json
{
  "question": "케이스 문제",
  "userAnswer": "사용자의 답변",
  "conversationHistory": [
    { "role": "user", "content": "질문" },
    { "role": "assistant", "content": "답변" }
  ]
}
```

**Response:**
```json
{
  "score": 85,
  "summary": "전체 평가 요약...",
  "strengths": ["강점1", "강점2"],
  "improvements": ["개선점1", "개선점2"],
  "modelPoints": ["참고 포인트1", "참고 포인트2"]
}
```

## 🏗 아키텍처

### 클라이언트-서버 구조

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ──────▶ │  Next.js API │ ──────▶ │  OpenAI API │
│  (React)    │         │    Routes    │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

### 보안 설계

- **API 키 보호**: `process.env.OPENAI_API_KEY`는 서버 사이드에서만 접근 가능
- **클라이언트 노출 방지**: API 키가 브라우저에 노출되지 않음
- **환경 변수**: `.env` 파일은 Git에 커밋되지 않음 (`.gitignore`)

### 데이터 흐름

1. **문제 생성**
   ```
   사용자 → [유형 선택] → POST /api/case-question → OpenAI API → 문제 반환
   ```

2. **질문-답변**
   ```
   사용자 → [질문 입력] → POST /api/ask-question → OpenAI API (면접관 역할) → 답변 반환
   ```

3. **평가**
   ```
   사용자 → [답변 작성] → POST /api/evaluate → OpenAI API (평가자 역할) → 평가 결과 반환
   ```

### 상태 관리

- **React Hooks**: `useState`로 클라이언트 상태 관리
  - `question`: 현재 케이스 문제
  - `conversationHistory`: 질문-답변 히스토리
  - `answer`: 최종 답변
  - `feedback`: 평가 결과

### AI 모델 설정

- **모델**: GPT-4o-mini (비용 효율적이면서도 높은 품질)
- **Temperature**: 
  - 문제 생성: 0.8 (창의성)
  - 질문 답변: 0.7 (균형)
  - 평가: 0.4 (일관성)

## 📝 주요 파일 설명

### `lib/openai.ts`
- OpenAI 클라이언트 생성 및 관리
- 환경 변수에서 API 키 로드
- 서버 사이드 전용 유틸리티

### `lib/types.ts`
- TypeScript 타입 정의
- 케이스 카테고리, 질문, 평가 응답 타입

### `app/page.tsx`
- 메인 UI 컴포넌트 (클라이언트 컴포넌트)
- 상태 관리 및 API 호출
- 사용자 인터랙션 처리

### `app/api/*/route.ts`
- Next.js API Routes (서버 사이드)
- OpenAI API 호출 및 응답 처리
- 에러 핸들링

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

## 🚀 Vercel 배포

이 프로젝트는 Vercel에 바로 배포할 수 있습니다. Next.js를 기본 지원하므로 추가 설정 없이 배포 가능합니다.

### 배포 방법

#### 방법 1: Vercel 웹 대시보드 사용 (권장)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Vercel에 로그인**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

3. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정 확인:
     - **Framework Preset**: Next.js (자동 감지)
     - **Root Directory**: `./` (기본값)
     - **Build Command**: `npm run build` (자동)
     - **Output Directory**: `.next` (자동)

4. **환경 변수 설정** (중요!)
   - "Environment Variables" 섹션으로 이동
   - 다음 변수 추가:
     ```
     Name: OPENAI_API_KEY
     Value: sk-your-api-key-here
     ```
   - Environment: Production, Preview, Development 모두 선택
   - "Save" 클릭

5. **배포 실행**
   - "Deploy" 버튼 클릭
   - 배포 완료 후 URL 확인

#### 방법 2: Vercel CLI 사용

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **프로젝트 배포**
   ```bash
   cd casestudy
   vercel
   ```

4. **환경 변수 설정**
   ```bash
   vercel env add OPENAI_API_KEY
   # 프롬프트에 API 키 입력
   # Production, Preview, Development 모두 선택
   ```

5. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 배포 후 확인사항

- ✅ 환경 변수 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
- ✅ API 라우트가 정상 작동하는지 테스트
- ✅ 빌드 로그에서 에러가 없는지 확인

### 환경 변수 관리

Vercel 대시보드에서 환경 변수를 관리할 수 있습니다:
- **Settings** → **Environment Variables**
- Production, Preview, Development 환경별로 설정 가능
- 환경 변수 변경 시 재배포 필요

### 트러블슈팅

**문제**: API가 503 에러를 반환합니다
- **해결**: Vercel 환경 변수에 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인

**문제**: 빌드가 실패합니다
- **해결**: 로컬에서 `npm run build`가 성공하는지 확인
- Node.js 버전 확인 (Vercel은 자동으로 최신 LTS 사용)

**문제**: 환경 변수가 적용되지 않습니다
- **해결**: 환경 변수 변경 후 재배포 필요 (`vercel --prod` 또는 대시보드에서 재배포)

### Vercel 무료 플랜 제한사항

- **함수 실행 시간**: 10초 (Hobby 플랜)
- **대역폭**: 100GB/월
- **빌드 시간**: 45분/월
- **환경 변수**: 무제한

> 💡 **참고**: OpenAI API 호출은 서버리스 함수에서 실행되므로, 긴 응답 시간이 필요할 경우 Vercel Pro 플랜을 고려하세요.

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

**Made with ❤️ for case interview practice**
