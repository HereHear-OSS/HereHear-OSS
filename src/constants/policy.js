// 제안서 5장 "구현 정책"을 한 곳에 모은 상수. 정책이 바뀌면 여기만 고친다.
// (서버 SQL 함수의 숫자와 반드시 같게 유지할 것: supabase/migrations/0001_init.sql)
export const POLICY = {
  RADIUS_M: 2000, // 반경 2,000m 이하 포함
  MAX_LOCATION_AGE_MS: 30_000, // 위치 측정값 유효기간 30초
  MAX_ACCURACY_M: 100, // 정확도 오차 100m 초과 시 등록/새 재생 차단
  MESSAGE_MIN: 1,
  MESSAGE_MAX: 200,
};

export const DEFAULT_MAP_CENTER = [37.5665, 126.978]; // 위치 확인 전 임시 중심 (서울시청)
export const DEFAULT_MAP_ZOOM = 14;
