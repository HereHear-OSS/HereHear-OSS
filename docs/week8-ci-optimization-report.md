# 8주차 GitHub Actions 최적화 보고서

- 프로젝트: HereHear-OSS
- 작업 브랜치: `feature/week7-8-cicd`
- 관련 PR: [#17](https://github.com/HereHear-OSS/HereHear-OSS/pull/17)
- 작성일: 2026-11-11 (한국 시간)
- 구현 확인 파일: [ci.yml](../.github/workflows/ci.yml), [reusable-test.yml](../.github/workflows/reusable-test.yml), [setup-project/action.yml](../.github/actions/setup-project/action.yml)

## 1. 목적과 확인 범위

7주차에 구축한 Build → Test Matrix → Vercel Preview 배포 흐름을 유지하면서 의존성 다운로드를 재사용하고, 중복 설정을 줄이며, 배포와 무관한 변경의 불필요한 Preview 배포를 생략하는 것이 목적이다. 테스트 범위를 줄여 실행 시간을 단축하는 방식은 적용하지 않았다.

이 보고서는 현재 YAML의 실제 구현, GitHub Actions API에서 확인한 실행·job·step 결과, 사용자가 제공한 캐시 전후 관찰값을 구분해 작성했다. 캐시 비교값의 원본 로그 및 반복 측정 자료는 이번 작성 과정에서 별도로 확보하지 않았다.

## 2. 전체 실행 구조

`ci.yml`은 main 대상 PR, main 또는 feature/week7-8-cicd push, 수동 실행을 지원한다. 기본 권한은 `contents: read`이다.

| 구성 | 역할과 선행 조건 |
| --- | --- |
| `changes` | 별도 job에서 변경 파일과 배포 대상 여부 판정 |
| `build` | Ubuntu·Node 24.22.1에서 공통 준비 → Build → `herehear-dist` 업로드 |
| `test` | `needs: build` 이후 Reusable Workflow 호출, 내부에서 네 Matrix 조합 실행 |
| `deploy` | `needs: [build, test, changes]`, 이벤트·브랜치·변경 파일 조건 충족 및 선행 job 성공 시 Preview 배포 |
| `deployment-summary` | `needs: [changes, build, test, deploy]`, `if: always()`로 결과와 생략 이유 기록 |

`changes`와 `build`는 병렬 실행할 수 있다. 문서만 변경되어도 Build와 Test Matrix는 실행하며, 경로 조건은 배포에만 적용된다.

## 3. Ubuntu/Windows × Node 22/24 Matrix

`reusable-test.yml`의 `strategy.matrix`는 다음 네 조합을 실행한다. 제외 조합은 없다.

| OS | Node.js | 수행 내용 |
| --- | --- | --- |
| `ubuntu-latest` | 22 | 준비, 아티팩트 다운로드·검증, Lint, Unit Test |
| `ubuntu-latest` | 24 | 위 검사 + Chromium 설치 및 E2E |
| `windows-latest` | 22 | 준비, 아티팩트 다운로드·검증, Lint, Unit Test |
| `windows-latest` | 24 | 준비, 아티팩트 다운로드·검증, Lint, Unit Test |

각 조합은 `npm run lint`, `npm test -- --reporter=verbose`를 실행한다. Chromium은 Ubuntu·Node 24에서만 `npx playwright install --with-deps chromium`으로 설치하고 `npm run test:e2e -- --reporter=list`를 실행한다. 다른 세 조합의 E2E step 생략은 명시적인 환경 선택 조건이며, 단위 테스트를 생략하는 설정은 아니다.

Build는 Ubuntu·Node 24.22.1에서 한 번 수행한다. Test Matrix가 네 환경에서 각각 다시 Build하는 구조는 아니다. 아티팩트 검증은 `dist/index.html`의 React root, 참조된 JS·CSS 경로, 해당 파일의 존재와 0보다 큰 크기를 검사한다. 이는 실제 운영 서비스의 동작 검증과는 구분된다.

## 4. Composite Action

`.github/actions/setup-project/action.yml`은 step 단위의 공통 준비를 담당한다.

1. 필수 input `node-version`을 `actions/setup-node@v6`에 전달한다.
2. npm 다운로드 캐시를 복원한다.
3. `shell: bash`로 `npm ci`를 실행한다.

Build는 `24.22.1`, Test Matrix는 `${{ matrix.node }}`를 전달한다. 각 job은 checkout 후 로컬 Composite Action을 호출한다. `shell: bash`를 명시해 Windows에서도 설치 step의 셸을 일관되게 지정했다. deploy는 이 Action을 사용하지 않고 기존 별도 Node 설정을 유지한다.

공통화는 설정 불일치와 중복 수정 부담을 줄인다. Composite Action 자체가 실행 시간을 줄였다는 별도 측정 결과는 없다.

## 5. Reusable Workflow

`.github/workflows/reusable-test.yml`은 `workflow_call`을 진입점으로 갖고, 전체 Test Matrix job을 포함한다. 메인 워크플로의 호출은 다음과 같다.

```yaml
test:
  needs: build
  uses: ./.github/workflows/reusable-test.yml
```

Reusable Workflow 내부에서는 기존 Composite Action을 재사용한다. 즉, Composite Action은 Node·캐시·설치라는 step 묶음이고, Reusable Workflow는 Matrix와 테스트 job 전체를 묶는다.

`actions/download-artifact@v4`는 동일 workflow run의 `herehear-dist`를 `dist/`에 다운로드한다. 별도 run ID나 GitHub 토큰을 전달하지 않는다. 호출 대상과 호출자는 `contents: read` 권한을 유지하며, 테스트에는 Vercel Secrets를 전달하지 않는다.

네 조합이 모두 성공해야 호출 job인 `test`가 성공하며 deploy가 진행할 수 있다. Reusable Workflow 도입의 주효과는 구성 재사용과 유지보수이며, 독립적인 시간 단축 효과는 측정하지 않았다.

## 6. npm 캐시 설정

Composite Action은 다음 설정을 사용한다.

```yaml
uses: actions/setup-node@v6
with:
  node-version: ${{ inputs.node-version }}
  cache: npm
  cache-dependency-path: package-lock.json
```

캐시 대상은 npm이 다운로드한 패키지 데이터이며 `node_modules` 자체가 아니다. 매번 `npm ci`를 실행해 lockfile에 맞춰 의존성을 설치한다. `package-lock.json` 내용이 달라지면 해시가 바뀌어 새로운 주 캐시 키를 사용한다. 새 키에서도 복원 가능한 이전 캐시가 있으면 일부 다운로드 데이터를 재사용할 수 있으므로, 키 변경이 기존 다운로드 데이터의 전량 삭제를 의미하지는 않는다.

Ubuntu와 Windows는 플랫폼별 캐시를 사용한다. Node 버전별로 반드시 별도 캐시가 생성된다고 가정하지 않는다. 실제 cache hit 여부와 사용된 키는 setup-node 로그에서 확인해야 한다. 배포 job에는 npm 캐시를 적용하지 않았다.

## 7. 조건부 Vercel Preview 배포

배포는 다음 조건을 모두 만족할 때만 실행된다.

- 이벤트가 `push`
- 브랜치가 `feature/week7-8-cicd`
- `changes.outputs.deploy == 'true'`
- Build와 모든 Test Matrix 조합 성공

PR, main push, 수동 실행에서는 배포하지 않는다. 변경 감지는 추가 외부 Action이나 GitHub 변경 파일 API 없이 전체 Git 이력과 Python의 Git 명령 호출로 수행한다.

| 배포 대상 | 실제 경로 패턴 |
| --- | --- |
| 앱·정적 파일 | `src/`, `public/`, `index.html` |
| 의존성·환경 설정 | `package.json`, `package-lock.json`, `.npmrc`, `.env.example` |
| 빌드·배포 설정 | `vite.config.*`, `vercel.config.*`, `vercel.json`, `.vercelignore` |
| DB·공통 CI 구성 | `supabase/`, `.github/actions/`, `.github/workflows/ci.yml` |

README, READ.md, 제안서, docs·보고서 등 위 패턴에 해당하지 않는 파일만 변경되면 CI의 deploy job을 생략한다. 테스트 전용 경로 `tests/`, ESLint 설정, DORA YAML도 현재 패턴에는 포함되지 않는다. `src/` 내부 테스트는 경로상 배포 대상이다.

일반 push는 이벤트의 `before → after`를 비교해 여러 커밋을 함께 처리한다. 첫 push는 기본 브랜치와의 공통 조상을 기준으로 비교한다. `--no-renames`를 사용해 이름 변경을 삭제·추가로 처리하므로 앱 경로에서 문서 경로로 옮긴 파일도 감지한다. 비교 이력이 없으면 배포 누락 방지를 위해 보수적으로 배포 후보로 처리하되 Build/Test 성공 조건은 유지한다.

`changes`는 판정 사유를, `deployment-summary`는 Build·Test·Deploy 결과와 실패 또는 생략 관련 정보를 Step Summary에 기록한다.

배포는 `VERCEL_TOKEN` Secret과 `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` Variables를 사용해 기존 herehear-cicd-practice 프로젝트를 지정한다. CLI는 `--target=preview`를 사용하며 Production 옵션은 사용하지 않는다. 성공 URL을 검증한 후 Summary에 기록한다.

기존 `dist` 아티팩트를 배포에 직접 사용하지 않고 Vercel에서 소스를 다시 빌드한다. CI의 일반 Vite `dist`는 Vercel `--prebuilt`에 필요한 `.vercel/output` 형식이 아니며, Preview 프로젝트 설정·환경변수도 빌드에 반영해야 하기 때문이다. 따라서 CI Build와 Vercel 빌드는 목적이 다르고 중복 빌드 비용이 남아 있다.

## 8. 실행 결과와 GitHub 증빙

### README만 변경한 경우

[커밋 4e2f428](https://github.com/HereHear-OSS/HereHear-OSS/commit/4e2f428269bb9562c7fd7bc3f20bea2baaec1802)은 로컬 Git 이력상 README.md만 변경했다. 해당 [push CI 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43009568780)의 API 기록에서 다음을 확인했다.

- Build, 변경 감지, 네 Matrix job, Summary 모두 성공
- Ubuntu·Node 24의 Chromium E2E step 성공
- [Deploy Vercel Preview job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43009568780/job/130486016650)은 `skipped`

이는 현재 CI의 배포 job이 문서 변경 시 생략되는 사례다. 같은 커밋에 다른 배포 이벤트 워크플로 기록도 존재하므로, 이 증거만으로 다른 Vercel 프로젝트나 외부 배포 경로까지 모두 실행되지 않았다고 단정하지 않는다.

### Reusable Workflow 성공 사례

[커밋 0d999b9](https://github.com/HereHear-OSS/HereHear-OSS/commit/0d999b96faf8de5b19c08800c8de48be61d5cc5b)의 [push CI 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933)은 성공했다. API 기록에서 다음을 확인했다.

- Build 및 아티팩트 업로드 성공
- `test / Test (...)` 이름의 네 Matrix job 모두 성공
- 각 조합의 Composite 준비, 아티팩트 다운로드·검증, Lint, Unit Test step 성공
- [Ubuntu·Node 24 job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491225290)의 Chromium 설치·E2E 성공
- [Preview deploy job](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491968696)과 Summary 성공

같은 커밋의 [PR CI 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011248949)도 전체 실행 결과가 성공이다. 이 보고서 작성 시 상세 job·step 확인은 위 push 실행을 대상으로 했다.

이전 로컬 검증 기록은 단위 테스트 24개 통과·기존 TODO 10개, E2E 1개 통과·기존 skip 3개였다. 이번 GitHub API 조회는 step 성공 여부를 확인한 것이며 해당 실행 로그의 assertion 개수를 재집계한 것은 아니다. TODO와 skip은 통과한 테스트 수에 포함하지 않는다.

## 9. 캐시 적용 전후 비교

아래 수치는 사용자가 관찰해 제공한 값이다. 이번 문서 작성 중 새로운 시간을 측정하거나 특정 run의 원본 로그와 다시 대조하지 않았다.

| 측정 항목 | 캐시 적용 전 | Cache Hit 이후 | 관찰된 감소 | 감소율 |
| --- | --- | --- | --- | --- |
| Build Job 전체 | 20초 | 15초 | 5초 | 25% |
| `npm ci` | 5초 | 3초 | 2초 | 40% |

감소율은 `(적용 전 - 적용 후) / 적용 전 × 100`으로 계산했다. `npm ci`는 Build Job에 포함되는 단계이므로 두 감소 시간을 합산하지 않는다.

관찰상 Cache Hit 이후 두 항목의 시간이 줄었으나, 캐시만의 인과효과로 단정할 수 없다. 러너 부하, 네트워크, Node/npm 버전, 작업 내용, setup-node와 캐시 복원·저장 시간 등의 차이가 영향을 줄 수 있다. 단일 관찰값으로 평균·중앙값·성공률·통계적 유의성을 제시하지 않는다. Build의 나머지 3초 차이를 캐시나 Composite/Reusable 효과로 임의 귀속하지 않는다.

향후에는 동일 소스·lockfile·실행 환경에서 cache miss와 hit를 구분해 여러 차례 측정하고, 설치 단계와 Build Job 전체 시간을 각각 비교해야 한다. Matrix 전체 소요 시간과 사용량, Vercel 빌드·배포 시간은 별도 지표로 측정해야 한다.

## 10. 한계와 후속 확인 사항

- Matrix는 호환성 검증 범위를 넓히지만 전체 runner 사용량이 늘 수 있다. 현재 자료에는 Matrix 전체·워크플로 전체·배포의 최적화 전후 측정값이 없다.
- Composite Action과 Reusable Workflow의 유지보수 효과를 시간 단축 효과와 분리해 평가해야 한다.
- 문서 변경도 Build·Test는 계속 실행하며, `changes`의 전체 이력 checkout과 Summary job에도 비용이 발생한다.
- 현재 변경 필터에는 새 `reusable-test.yml` 자체가 없다. 이 파일만 변경하면 검증은 실행하지만 배포는 생략된다. 현재 구현을 그대로 반영한 결과이며, 배포 대상 범위 확대는 별도 합의가 필요하다.
- E2E는 Supabase 없는 Vite 개발 서버의 입력 검증·라우팅을 대상으로 한다. 내려받은 `dist`의 브라우저 동작이나 실제 배포된 Preview의 Supabase 연동 검증은 아니다.
- Vercel 배포는 `vercel@latest`를 사용하고 Matrix의 Node 22/24도 메이저 범위이므로 장기 비교 시 실제 해석 버전을 기록해야 한다.
- 이 보고서는 Vercel 대시보드 설정·Secret 값·운영 환경·다른 프로젝트의 자동 배포 연결 상태를 직접 검증하지 않았다.
- 커밋·실행 증빙 링크는 위 사례를 입증하지만 캐시 비교 수치의 원본 증빙을 대신하지 않는다. 후속 제출 시 Cache Hit 로그와 설치/Build 시간 화면을 별도로 보관하는 것이 필요하다.

이번 보고서 작성에서는 CI/CD와 앱 코드를 수정하지 않았으며 새 workflow 실행, commit, push, merge를 수행하지 않았다.
