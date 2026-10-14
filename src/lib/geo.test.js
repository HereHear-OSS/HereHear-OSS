import { describe, test } from 'vitest';

// 6주차: 거리 계산 경계 테스트 (제안서 8장)
// 팁: 위도 1도 ≈ 111km → 2km ≈ 0.018도. 경계값은 distanceMeters 결과를 기준으로 좌표를 만들 것.
describe('geo', () => {
  test.todo('같은 좌표의 거리는 0m');
  test.todo('2km 바로 안쪽 좌표는 isWithinRadius === true');
  test.todo('정확히 2,000m 경계는 포함(true)');
  test.todo('2km 바로 바깥쪽 좌표는 isWithinRadius === false');
});
