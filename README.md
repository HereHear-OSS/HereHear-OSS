# HereHear — 여행지에 남기는 음악 발자국

OSS 기반 SW프로그래밍 학기 프로젝트 · 위치 기반 음악 공유 웹 서비스


여행지의 추억을 음악으로 남기는 HereHear을 기획하며 웹 개발을 배우고 있습니다. 아이디어를 실제로 사용할 수 있는 서비스로 구현하는 것이 이번 학기의 목표입니다.

## 팀원
- 2545044 정소민
- 2545159 김규희
- 2544435 김미리내
- 2544391 진금지
- 2545136 전유리
- 2544608 오지수
- 2544552 이정경


## 관심 분야

- 여행 경험과 추억을 기록하는 서비스
- 음악으로 감정과 이야기를 전달하는 사용자 경험
- 지도와 위치 정보를 활용한 웹 서비스
- 모바일에서 이해하기 쉽고 사용하기 편한 UI/UX

## 학기 프로젝트 — HereHear

현재 위치에 음악과 메시지를 남기고, 다른 여행자가 해당 장소 반경 2km 안에서 발견하고 들을 수 있는 위치 기반 음악 공유 서비스를 기획하고 있습니다.

| 핵심 기능 | 내용 |
| --- | --- |
| 음악 등록 | 현재 GPS 위치에 곡과 메시지를 남기고, 반경 안 동일 곡의 중복 등록을 제한합니다. |
| 발견 · 재생 | 지도 위 발자국 마커로 음악을 발견하고, 반경 안에서 메시지를 확인하고 음악을 듣습니다. |
| 추억 저장 | 좋아요로 공감하고 즐겨찾기로 다시 확인할 음악을 저장합니다. |

프로젝트 기획과 개발 마일스톤은 [프로젝트 제안서](HereHear_프로젝트_제안서.md)를 참고하세요.


## 학습 기록 계획

- 기능을 완성할 때마다 구현 내용과 검증 결과를 기록합니다.
- 오류를 해결하면 원인과 해결 방법을 정리합니다.
- 계획한 기능과 실제 구현 결과를 비교하며 다음 작업을 조정합니다.

이번 학기에는 등록 → 발견 → 재생 → 저장 흐름이 동작하는 MVP를 완성하고, 90초 안에 핵심 기능을 시연하는 것을 목표로 합니다.

## 데모

https://here-hear-oss.vercel.app

## 기술 스택

- React 18, Vite
- Leaflet(react-leaflet) 지도
- Supabase
- 테스트: Vitest, Playwright / 린트: ESLint

## 실행 방법

```bash
git clone https://github.com/HereHear-OSS/HereHear-OSS.git
cd HereHear-OSS
npm install
```

`.env.example`을 복사해 `.env`를 만듭니다.

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS / Linux / Git Bash
cp .env.example .env
```

아래 Supabase 준비를 마친 뒤 개발 서버를 실행합니다.

```bash
npm run dev              # http://localhost:5173
```

위치(Geolocation) 기능은 HTTPS 또는 localhost에서만 동작합니다.

### Supabase 준비

1. Supabase 프로젝트를 생성하고 Authentication > Providers에서 **Anonymous sign-ins**를 켭니다.
2. SQL Editor에서 `supabase/migrations/0001_init.sql`을 실행한 뒤 `supabase/seed.sql`을 실행합니다.
3. 프로젝트의 URL과 anon key를 `.env`의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`에 입력합니다. `service_role` 키는 사용하지 않습니다.

### 테스트 및 빌드

```bash
npm test                 # 단위 테스트 (Vitest)
npm run lint             # ESLint 검사
npx playwright install   # E2E 테스트용 브라우저 최초 설치
npm run test:e2e         # 사용자 흐름 테스트 (Playwright)
npm run build            # 배포용 빌드
```

자세한 개발 환경과 명령어는 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 폴더 구조

```
src/
├─ constants/    policy.js(정책 상수) · errors.js(에러 코드/메시지)
├─ lib/          geo.js(거리) · location.js(위치 유효성) · validators.js · supabaseClient.js
├─ services/     authService · footprintService · reactionService  (Supabase RPC 호출)
├─ hooks/        useGeolocation · useAnonymousSession · useFootprints · useAudioPlayer
├─ data/         songCatalog.js (허용 음원 목록)
├─ components/   common · map · sheet · register · saved
├─ pages/        MapPage(발견) · RegisterPage(등록) · SavedPage(저장)
└─ styles/       index.css
supabase/        migrations/0001_init.sql · seed.sql
tests/e2e/       Playwright 시나리오
```

## 주차별 개발 계획

| 주차 | 파일 |
| --- | --- |
| 5주 | `supabase/migrations`, `authService`, `get_footprint_markers` 로 두 세션 공유 확인 |
| 6주 | `lib/geo.js`(Haversine), `useGeolocation`, `LocationStatus`, `geo.test.js`, `location.test.js` |
| 7주 | `RegisterForm`, `RegisterPage`, SQL `create_footprint` (검증·등록) |
| 8주 | SQL `create_footprint` 의 곡별 락 + 중복 차단, 에러 코드 변환 |
| 9주 | `useFootprints`, `FootprintMarker`, `MapView` (활성/비활성 표시) |
| 10주 | `FootprintSheet`, `useAudioPlayer`, SQL `get_footprint_detail` |
| 11주 | `toggle_like`, `reactionService`, 중복 요청 방지 |
| 12주 | `toggle_favorite`, `get_my_favorites`, `SavedPage`, `SavedList` |
| 13주 | `constants/errors.js` 기반 오류 처리 전반 |
| 14주 | `tests/e2e/flow.spec.js` |

## 구현 정책

`src/constants/policy.js` 와 SQL 함수의 숫자를 항상 동일하게 유지한다.

## 기여하기

기여는 언제나 환영합니다. [CONTRIBUTING.md](CONTRIBUTING.md)와 [행동 강령](CODE_OF_CONDUCT.md)을 먼저 읽어 주세요.

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)로 배포됩니다.

- [라이선스 비교와 선택 기준](docs/license-comparison.md)
- [Inner Source 도입 로드맵](docs/inner-source-roadmap.md)

<!-- DORA START -->
## Weekly DORA Report

- Lead Time: N/A
- Deployment Frequency: 0 deployments/week
- MTTR: N/A
- Change Failure Rate: N/A
<!-- DORA END -->
