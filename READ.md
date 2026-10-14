# HereHear — 여행지에 남기는 음악 발자국

위치 기반 음악 공유 웹 서비스 (React + JavaScript + Vite / Leaflet / Supabase).

## 실행 방법

```bash
npm install
cp .env.example .env     # Supabase URL / anon key 입력
npm run dev              # http://localhost:5173
npm test                 # 단위 테스트 (vitest)
npm run test:e2e         # 사용자 흐름 테스트 (playwright, 최초 1회: npx playwright install)
npm run build
```

> 위치(Geolocation) 기능은 HTTPS 또는 localhost 에서만 동작한다.

## Supabase 준비

1. 프로젝트 생성 → Authentication > Providers > **Anonymous sign-ins** 켜기
2. SQL Editor 에서 `supabase/migrations/0001_init.sql` 실행 → `supabase/seed.sql` 실행
3. Project Settings > API 의 URL / anon key 를 `.env` 에 입력 (service_role 키는 절대 사용 금지)

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

## 주차별 채울 곳 (TODO 주석 검색: `TODO(`)

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

## 정책 (확정 시 여기에 기록)

`src/constants/policy.js` 와 SQL 함수의 숫자를 항상 동일하게 유지한다.
