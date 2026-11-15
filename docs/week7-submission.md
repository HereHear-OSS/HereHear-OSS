# [7주차] GitHub Actions 기반 기본 CI/CD 구축

HereHear-OSS는 React·JavaScript·Vite 기반의 위치 기반 음악 공유 프로젝트입니다. `feature/week7-8-cicd` 브랜치에서 기본 CI/CD를 구축했으며, 현재 제출 시점에는 8주차 공통화·캐시·조건부 배포 설정도 반영되어 있습니다.

## 제출 증빙 링크

- [메인 CI 워크플로: ci.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/ci.yml)
- [보조 워크플로: reusable-test.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml)
- [GitHub Actions 성공 실행: 0d999b9](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933)
- [7주차 제출 문서 원문](https://github.com/HereHear-OSS/HereHear-OSS/blob/main/docs/week7-submission.md)
- [관련 PR #17](https://github.com/HereHear-OSS/HereHear-OSS/pull/17)
- [8주차 최적화 보고서 원문](https://github.com/HereHear-OSS/HereHear-OSS/blob/main/docs/week8-ci-optimization-report.md)

## 필수 요구사항별 구현과 증빙

| 요구사항 | 실제 구현 | 확인 링크 |
| --- | --- | --- |
| Lint/Test 자동 실행 | main 대상 PR, main·지정 브랜치 push, 수동 실행에서 `npm run lint`와 `npm test -- --reporter=verbose` 수행 | [테스트 YAML](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml) |
| OS/Node Matrix | Ubuntu/Windows × Node 22/24의 네 조합에서 Lint·Unit Test 수행 | [네 Matrix 조합의 성공 기록](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933) |
| 실제 브라우저 검증 | Ubuntu·Node 24 조합에서 Chromium 설치 및 E2E 실행 | [Chromium E2E 성공 job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225290) |
| 민감정보 관리 | Vercel 인증 토큰은 `secrets.VERCEL_TOKEN`, 조직·프로젝트 ID는 `vars.VERCEL_ORG_ID`·`vars.VERCEL_PROJECT_ID`로 참조. 문서·코드에 실제 토큰을 기재하지 않음 | [deploy 설정](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/ci.yml) |
| Build → Test → Deploy 의존성 | `test.needs: build`, `deploy.needs: [build, test, changes]`로 모든 Matrix 성공 후 배포 | [의존 관계 YAML](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/ci.yml) |
| Artifact 업로드 | Ubuntu·Node 24.22.1에서 빌드한 `dist/`를 `herehear-dist`로 업로드 | [Build 성공 job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491086188) |
| Artifact 다운로드·검증 | 각 Matrix job에서 동일 실행의 `herehear-dist`를 다운로드하고 HTML·참조 JS/CSS 파일 검증 | [다운로드·검증 YAML](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml) |
| Preview 배포 | 모든 선행 검사 성공 및 지정 push·변경 조건 충족 시 Vercel CLI의 `--target=preview`로 배포 | [Preview 배포 성공 job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491968696) |

## 성공한 CI 로그
 
다음은 커밋 `0d999b9`의 [전체 성공 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933)에서 확인한 job별 결과입니다.

| Job | 결과 | 실행 로그 |
| --- | --- | --- |
| Build | 성공 · `npm run build`, `herehear-dist` 업로드 | [Build](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491086188) |
| Ubuntu · Node 22 | 성공 · Artifact 검증, Lint, Unit Test | [Ubuntu · Node 22](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225141) |
| Ubuntu · Node 24 | 성공 · Artifact 검증, Lint, Unit Test, Chromium E2E | [Ubuntu · Node 24](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225290) |
| Windows · Node 22 | 성공 · Artifact 검증, Lint, Unit Test | [Windows · Node 22](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225162) |
| Windows · Node 24 | 성공 · Artifact 검증, Lint, Unit Test | [Windows · Node 24](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225097) |
| Vercel Preview | 성공 · 배포와 URL 확인 | [Deploy Vercel Preview](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491968696) |
| 배포 결과 요약 | 성공 · 검사·배포 결과 기록 | [Step Summary job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130492244873) |

## 수행 내용과 배포 조건

1. **Build**: checkout → [공통 프로젝트 준비](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/actions/setup-project/action.yml) → `npm run build` → Artifact 업로드.
2. **Test Matrix**: Build 성공 후 [Reusable Workflow](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml)를 호출합니다. 네 조합 각각에서 공통 준비·Artifact 다운로드/검증·Lint·Unit Test를 실행하고, Ubuntu·Node 24에서는 Chromium E2E도 실행합니다.
3. **Deploy**: Build와 네 Matrix 검사, 별도 `changes` job이 성공한 뒤 배포 조건을 평가합니다. 실패한 선행 검사를 성공으로 처리하거나 무시하지 않습니다.

Preview 배포는 **push 이벤트 + `feature/week7-8-cicd` 브랜치 + 배포 대상 파일 변경**인 경우에만 실행합니다. PR·main push·수동 실행에서는 배포가 생략됩니다. README 등 문서만 변경되어도 Build/Test는 실행하지만 deploy는 생략되며, [README 변경 배포 생략 사례](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43009568780)에서 확인할 수 있습니다.

`changes`는 일반 push의 `before → after` 전체 차이를 비교하고, 첫 push는 기본 브랜치와의 공통 조상을 기준으로 비교합니다. 이력을 비교할 수 없으면 보수적으로 배포 후보로 처리하므로 항상 실제 파일 변경을 판정할 수 있는 것은 아닙니다. 배포 판정 이유·검사 결과·성공 URL은 GitHub Actions Step Summary에서 확인할 수 있습니다.

## 결과 요약과 검증 범위

커밋 `0d999b9`의 위 성공 실행에서 Build, 네 Matrix의 Lint·Unit Test·Artifact 검증, Ubuntu·Node 24 Chromium E2E, Preview 배포가 성공했습니다. 이전 로컬 검증에서는 단위 테스트 **24개 통과·기존 TODO 10개**, E2E **1개 통과·기존 skip 3개**였으며, TODO·skip을 통과한 테스트로 계산하지 않습니다. 해당 GitHub 실행의 step 성공 여부와 로컬 테스트 개수 기록은 구분합니다.

기본 권한은 `contents: read`이고 Vercel Secrets는 deploy job에서만 사용합니다. 이 제출 문서는 Secret 값 자체나 Vercel 대시보드 설정을 공개·검증하는 문서가 아닙니다.

CI Artifact는 테스트의 파일 검증용입니다. Preview 배포는 소스를 전송해 Vercel 프로젝트의 Preview 설정·환경변수로 다시 빌드하므로, 다운로드한 `dist`를 그대로 배포하거나 E2E가 배포 URL을 검증하는 구조는 아닙니다. 기존 DORA 워크플로는 유지됩니다.
