# PRD: Multilingual README

## 1. Problem

한국어 중심 또는 누락된 README 때문에 영어·일본어 사용자가 프로젝트의 가치와 실행 방법을 바로 이해하기 어렵다.

## 2. Target Users

- 글로벌 채용 담당자와 엔지니어
- 일본어권 채용 담당자와 엔지니어
- 한국어 사용자와 유지보수자

## 3. Goals

- `README.md`를 영어 기본 문서로 제공한다.
- `README.ko.md`와 `README.ja.md`를 언어 링크로 연결한다.
- 세 언어에서 프로젝트 목적, 기능, 기술, 실행, 검증, 제한 사항을 동일하게 전달한다.

## 4. Non-goals

- 애플리케이션 코드, 데이터, API, 배포 동작 변경
- 확인되지 않은 기능이나 성과 추가

## 5. Functional Requirements

- [x] 영어 `README.md`
- [x] 한국어 `README.ko.md`
- [x] 일본어 `README.ja.md`
- [x] 각 문서 상단의 `English | 한국어 | 日本語` 링크
- [x] 실제 저장소와 일치하는 명령어·환경 변수·링크

## 6. Success Metrics

- 세 문서가 서로 연결되고 GitHub에서 정상 렌더링된다.
- 문서 변경 외 애플리케이션 파일은 수정하지 않는다.
