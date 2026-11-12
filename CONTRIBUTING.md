# Contributing to HereHear-OSS

HereHear(위치 기반 음악 공유 서비스) 팀 프로젝트의 협업 규칙입니다.
모든 변경은 **GitHub Flow**(브랜치 → PR → 리뷰 → 병합)를 따릅니다.

## 1. 기본 원칙

- `main` 브랜치는 항상 배포 가능한 상태를 유지합니다. **직접 push 금지**
- 모든 작업은 Issue에서 시작하고, `feature/*` 브랜치에서 진행합니다.
- 모든 병합은 Pull Request와 **최소 1명의 승인(Approve)** 을 거칩니다.
- 자신이 올린 PR은 스스로 승인·병합하지 않습니다.

## 2. 작업 흐름 (GitHub Flow)

```text
Issue 확인/생성 → feature 브랜치 생성 → 작업·커밋 → push → PR 생성
→ 코드리뷰 ([MUST]/[SHOULD]) → 수정 반영 → 승인 → main에 Squash and merge → 브랜치 삭제
```

```bash
git checkout main && git pull origin main
git checkout -b feature/12-music-register
# 작업 후
git add .
git commit -m "feat(register): 음악 등록 폼 UI 추가"
git push -u origin feature/12-music-register
```

## 3. 브랜치 이름 규칙

`<type>/<이슈번호>-<짧은-설명>` (영문 소문자, 하이픈 사용)

| 접두사 | 용도 | 예시 |
| --- | --- | --- |
| `feature/` | 새 기능 | `feature/12-music-register` |
| `fix/` | 버그 수정 | `fix/20-radius-check` |
| `docs/` | 문서 | `docs/31-contributing` |
| `chore/` | 설정·빌드·CI | `chore/35-eslint-rule` |

## 4. 커밋 메시지 규칙 (Conventional Commits)

```text
<type>(<scope>): <설명>

[본문 — 선택]
[Footer — 선택, 예: Closes #12]
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
- **scope(선택)**: `map`, `register`, `player`, `favorite`, `auth`, `supabase`, `ui`, `e2e`
- 설명은 한 줄로, 무엇을 했는지 명확하게 씁니다.

예시:

```text
feat(map): 발자국 마커와 바텀시트 추가
fix(register): 반경 2km 내 동일 곡 중복 등록 허용 오류 수정
docs: README에 실행 방법 추가
test(e2e): 음악 등록 → 재생 시나리오 추가
chore(ci): weekly DORA report 워크플로우 수정
```

## 5. Pull Request 규칙

1. base는 `main`, compare는 본인의 feature 브랜치로 설정합니다.
2. **PR 제목도 Conventional Commits 형식**으로 작성합니다. (예: `feat(register): 음악 등록 폼 구현`)
3. PR 템플릿(`.github/pull_request_template.md`)의 항목을 빠짐없이 채웁니다.
4. 관련 Issue를 `Closes #번호`로 연결합니다.
5. PR은 가능하면 **변경 300줄 안팎**으로 작게 유지합니다.
6. 올리기 전 로컬에서 확인합니다.
   ```bash
   npm run lint
   npm run build
   ```
7. UI 변경은 모바일 화면 스크린샷을 첨부합니다.

## 6. 코드리뷰 규칙

- 리뷰어는 PR이 올라오면 **24시간 이내**에 1차 리뷰를 남기는 것을 목표로 합니다.
- 피드백은 `[MUST]` / `[SHOULD]` 태그로 구조화합니다. 자세한 기준은 [docs/review-guide.md](docs/review-guide.md)를 따릅니다.
- 작성자는 모든 `[MUST]`를 해결한 뒤 재리뷰를 요청합니다.
- 해결한 코멘트는 작성자가 답글로 반영 내용을 남기고, Resolve는 리뷰어가 합니다.

## 7. 병합 규칙

- 승인 1개 이상 + 모든 `[MUST]` 해결 + CI(Actions) 통과 시 병합합니다.
- 병합 방식은 **Squash and merge**를 기본으로 하고, 병합 커밋 메시지도 Conventional Commits를 지킵니다.
- 병합 후 feature 브랜치는 삭제합니다.

## 8. 보안 · 환경 변수

- Supabase 키 등 비밀 값은 코드에 직접 쓰지 않고 `.env`에만 둡니다. (`.env`는 커밋 금지)
- 새 환경 변수를 추가하면 `.env.example`에 이름만 추가합니다.

## 9. 코드 스타일

- ESLint 규칙을 따릅니다. (`npm run lint`)
- React + JavaScript 기준으로 작성합니다.
- 컴포넌트 파일명은 PascalCase, 함수·변수는 camelCase를 사용합니다.

