# Implementation Plan

## Architecture

- 프로젝트 기술 스택: Next.js 16, React 19, TypeScript, OpenAI API, Tailwind CSS
- README는 애플리케이션 구조를 요약하고 세부 구현은 실제 소스를 기준으로 합니다.

## Folder Structure

```text
README.md
README.ko.md
README.ja.md
memory-bank/
```

## Documentation Conventions

- 영어 문서를 기본 진입점으로 사용합니다.
- 세 문서 상단에 동일한 언어 전환 링크를 둡니다.
- 명령어와 환경 변수 이름은 실제 파일에서 확인합니다.
- 기능, 제한 사항, 보안 주의점을 언어별로 일관되게 유지합니다.

## Testing Strategy

- 세 README 파일 존재 확인
- 상대 링크 대상 존재 확인
- 코드 블록과 언어 링크의 Markdown 구조 확인
- `git diff --check`로 whitespace 오류 확인

## Security Notes

- `.env` 실제 값과 인증정보를 문서에 포함하지 않습니다.
