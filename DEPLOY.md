# Vercel 배포 가이드

이 문서는 케이스 면접 연습 애플리케이션을 Vercel에 배포하는 방법을 설명합니다.

## 🎯 배포 전 준비사항

1. **GitHub 저장소 준비**
   - 프로젝트를 GitHub에 푸시해야 합니다
   - Private 또는 Public 저장소 모두 가능합니다

2. **OpenAI API 키 준비**
   - [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 발급
   - 배포 시 환경 변수로 설정합니다

## 📋 배포 단계

### 1단계: GitHub에 프로젝트 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/casestudy.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 계정 생성 및 로그인

1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)

### 3단계: 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 저장소 목록에서 `casestudy` 선택
3. 프로젝트 설정 확인:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `.next` (자동)
   - **Install Command**: `npm install` (자동)

### 4단계: 환경 변수 설정 (중요!)

**⚠️ 이 단계를 건너뛰면 애플리케이션이 작동하지 않습니다!**

1. 프로젝트 설정 화면에서 **"Environment Variables"** 섹션으로 스크롤
2. **"Add"** 버튼 클릭
3. 다음 정보 입력:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-api-key-here` (본인의 OpenAI API 키)
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     모두 체크
4. **"Save"** 클릭

### 5단계: 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (보통 1-2분 소요)
3. 배포 완료 후 **"Visit"** 버튼으로 사이트 확인

## 🔧 Vercel CLI를 사용한 배포 (선택사항)

터미널에서 직접 배포하려면:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리로 이동
cd casestudy

# 배포 (첫 배포)
vercel

# 환경 변수 설정
vercel env add OPENAI_API_KEY
# 프롬프트에 API 키 입력
# Production, Preview, Development 모두 선택

# 프로덕션 배포
vercel --prod
```

## ✅ 배포 후 확인

배포가 완료되면 다음을 확인하세요:

1. **사이트 접속**: Vercel에서 제공하는 URL로 접속
2. **기능 테스트**:
   - 케이스 문제 받기
   - 면접관에게 질문하기
   - 답변 평가 받기
3. **에러 확인**: 브라우저 콘솔과 Vercel 로그 확인

## 🔄 업데이트 배포

코드를 수정한 후 다시 배포하려면:

### GitHub 연동 시 (자동 배포)
- `git push`만 하면 자동으로 재배포됩니다
- Pull Request 생성 시 Preview 배포도 자동 생성됩니다

### 수동 배포
```bash
vercel --prod
```

## 🐛 트러블슈팅

### 문제: API가 503 에러를 반환합니다

**원인**: 환경 변수가 설정되지 않았거나 잘못되었습니다.

**해결**:
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 확인
2. `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
3. 환경 변수 변경 후 재배포 필요

### 문제: 빌드가 실패합니다

**원인**: 코드 오류 또는 의존성 문제

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러가 있다면 수정 후 다시 배포
```

### 문제: 환경 변수가 적용되지 않습니다

**원인**: 환경 변수 변경 후 재배포가 필요합니다

**해결**:
- Vercel 대시보드에서 "Redeploy" 클릭
- 또는 `vercel --prod` 실행

### 문제: 함수 실행 시간 초과

**원인**: OpenAI API 응답이 너무 오래 걸립니다

**해결**:
- Vercel Hobby 플랜은 함수 실행 시간이 10초로 제한됩니다
- Pro 플랜으로 업그레이드하거나, API 호출 최적화 고려

## 📊 Vercel 플랜 비교

| 기능 | Hobby (무료) | Pro ($20/월) |
|------|--------------|--------------|
| 함수 실행 시간 | 10초 | 60초 |
| 대역폭 | 100GB/월 | 1TB/월 |
| 빌드 시간 | 45분/월 | 6000분/월 |
| 환경 변수 | 무제한 | 무제한 |

## 🔐 보안 주의사항

- ✅ **환경 변수는 절대 코드에 하드코딩하지 마세요**
- ✅ **`.env` 파일은 Git에 커밋하지 마세요** (이미 `.gitignore`에 포함됨)
- ✅ **API 키는 Vercel 환경 변수로만 관리하세요**
- ✅ **프로덕션과 개발 환경의 API 키를 분리하는 것을 권장합니다**

## 📚 추가 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경 변수 관리](https://vercel.com/docs/concepts/projects/environment-variables)

---

배포에 문제가 있으면 이슈를 등록해 주세요!
