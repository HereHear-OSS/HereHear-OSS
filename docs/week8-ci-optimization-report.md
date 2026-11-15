# 8주차 GitHub Actions 최적화 보고서

## 제출 증빙 링크

| 확인 항목 | 증빙 링크 |
| --- | --- |
| 메인 CI·변경 감지·조건부 Preview 배포 | [ci.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/ci.yml) |
| OS/Node Matrix·Reusable Workflow | [reusable-test.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml) |
| Composite Action·npm 캐시·의존성 설치 | [setup-project/action.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/actions/setup-project/action.yml) |
| Reusable Workflow 및 Preview 배포 성공 (`0d999b9`) | [Actions 성공 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933) |
| README만 변경한 조건부 배포 검증 (`4e2f428`) | [배포 생략 실행](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43009568780) |
| 캐시 적용 전 | [실행 42978199840](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42978199840) · [Build 로그](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42978199840/job/130382134240) |
| 캐시 최초 저장 | [실행 42985619210](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42985619210) · [Build 로그](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42985619210/job/130405955864) |
| Cache Hit | [실행 43011240933](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933) · [Build 로그](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491086188) |
| 시간 비교와 측정 한계 | [9절 캐시 적용 전후 비교](#9-캐시-적용-전후-비교) |
| 7주차 제출 문서 | [기본 CI/CD 구축 증빙 원문](https://github.com/HereHear-OSS/HereHear-OSS/blob/main/docs/week7-submission.md) |

Build의 `npm ci` 로그 구간은 **3.27초 → 1.86초**로, 두 실행에서 **약 43.1% 감소**했다.

- 프로젝트: HereHear-OSS
- 작업 브랜치: `feature/week7-8-cicd`
- 관련 PR: [#17](https://github.com/HereHear-OSS/HereHear-OSS/pull/17)
- 작성일: 2026-11-11 (한국 시간)
- 구현 확인 파일: [ci.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/ci.yml), [reusable-test.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/workflows/reusable-test.yml), [setup-project/action.yml](https://github.com/HereHear-OSS/HereHear-OSS/blob/0d999b96faf8de5b19c08800c8de48be61d5cc5b/.github/actions/setup-project/action.yml)

## 1. 목적과 확인 범위

7주차에 구축한 Build → Test Matrix → Vercel Preview 배포 흐름을 유지하면서 의존성 다운로드를 재사용하고, 중복 설정을 줄이며, 배포와 무관한 변경의 불필요한 Preview 배포를 생략하는 것이 목적이다. 테스트 범위를 줄여 실행 시간을 단축하는 방식은 적용하지 않았다.

구현은 성공 실행의 커밋에 고정한 YAML에서 확인했다. 시간 비교에는 GitHub Actions Build job의 원본 로그 타임스탬프를 사용했다. 측정 방법과 비교 한계는 9절에 기록했다.

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

| 구분 | 커밋 | CI 실행 | Build 로그에서 확인한 근거 |
| --- | --- | --- | --- |
| 캐시 적용 전 | `a501f4a7` | [42978199840](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42978199840) | [Build](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42978199840/job/130382134240)에서 Node 설정 후 `npm ci` 실행 |
| 캐시 최초 저장 | `0c6c1a44` | [42985619210](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42985619210) | [Build](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/42985619210/job/130405955864)의 `Post Set up Node.js`에서 `Cache saved with the key` |
| Cache Hit | `0d999b96` | [43011240933](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933) | [Build](https://github.com/HereHear-OSS/HereHear-OSS/actions/runs/43011240933/job/130491086188)의 `Set up project`에서 `Cache hit for` 및 `Cache restored successfully` |

최초 저장과 복원에 사용한 주 캐시 키는 모두 `node-cache-Linux-x64-npm-59d67398f73ab492d93c495f4e321dfcb4f3b8c5d2f3f0bcce3778e1d58bc092`였다.

Ubuntu·Node 24.22.1 Build job에서 `Run npm ci` 시작부터 다음 `Run npm run build` 시작까지의 로그 타임스탬프 차이를 구했다. 이 구간에는 로그 출력과 다음 명령으로 전환하는 시간이 포함된다.

| 비교 대상 | 시작 UTC (2026-11-11) | 다음 Build 명령 시작 UTC | 관찰된 구간 |
| --- | --- | --- | --- |
| 캐시 적용 전 | `07:15:53.2034658` | `07:15:56.4723705` | 약 3.27초 |
| Cache Hit | `11:21:24.5460234` | `11:21:26.4075127` | 약 1.86초 |

관찰 차이는 약 1.41초이며, 표시한 초 단위 값으로 계산한 감소율은 `(3.27 - 1.86) / 3.27 × 100 ≈ 43.1%`이다. 최초 저장 실행은 캐시 키 생성 증빙으로 사용했다.

서로 다른 커밋에서 한 번씩 실행한 결과다. 두 실행 사이에 Composite Action 등 워크플로 변경도 있었고 러너 부하와 네트워크 상태를 통제하지 않았으므로 캐시만의 기여도는 산출할 수 없다. 측정 범위는 `npm ci` 로그 구간이며 캐시 복원·저장 시간, Build Job 전체, Matrix 전체, Vercel 배포 시간은 별도 지표다. Build Job 전체의 최적화 전후 시간은 동일 기준으로 검증하지 않았다.

동일 소스·lockfile·실행 환경에서 cache miss와 hit를 여러 차례 측정하면 설치 구간과 Build Job 전체 시간을 각각 비교할 수 있다.

## 10. 한계와 후속 확인 사항

- Matrix는 호환성 검증 범위를 넓히지만 전체 runner 사용량이 늘 수 있다. 현재 자료에는 Matrix 전체·워크플로 전체·배포의 최적화 전후 측정값이 없다.
- Composite Action과 Reusable Workflow의 유지보수 효과를 시간 단축 효과와 분리해 평가해야 한다.
- 문서 변경도 Build·Test는 계속 실행하며, `changes`의 전체 이력 checkout과 Summary job에도 비용이 발생한다.
- 현재 변경 필터에는 새 `reusable-test.yml` 자체가 없다. 이 파일만 변경하면 검증은 실행하지만 배포는 생략된다. 현재 구현을 그대로 반영한 결과이며, 배포 대상 범위 확대는 별도 합의가 필요하다.
- E2E는 Supabase 없는 Vite 개발 서버의 입력 검증·라우팅을 대상으로 한다. 내려받은 `dist`의 브라우저 동작이나 실제 배포된 Preview의 Supabase 연동 검증은 아니다.
- Vercel 배포는 `vercel@latest`를 사용하고 Matrix의 Node 22/24도 메이저 범위이므로 장기 비교 시 실제 해석 버전을 기록해야 한다.
- 이 보고서는 Vercel 대시보드 설정·Secret 값·운영 환경·다른 프로젝트의 자동 배포 연결 상태를 직접 검증하지 않았다.
- 실행 로그는 GitHub Actions 보존 기간에 따라 열람이 제한될 수 있다. 9절에 측정에 사용한 타임스탬프와 캐시 메시지를 함께 기록했다.

## 결과 요약

Build와 네 Test Matrix 조합, Chromium E2E가 성공했다. 공통 준비 단계는 Composite Action으로, 테스트 job은 Reusable Workflow로 공통화했다. README만 바꾼 실행에서는 Preview 배포가 생략됐고, 배포 조건을 충족한 실행에서는 배포가 성공했다. 두 Build 실행의 `npm ci` 로그 구간에서 약 43.1% 감소를 관찰했다.
