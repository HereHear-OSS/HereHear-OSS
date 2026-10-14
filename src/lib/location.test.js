import { describe, test } from 'vitest';

describe('checkPositionUsable', () => {
  test.todo('위치가 없으면 LOCATION_UNAVAILABLE');
  test.todo('30초보다 오래되면 LOCATION_STALE');
  test.todo('정확도 100m 초과면 LOCATION_INACCURATE');
  test.todo('조건을 만족하면 ok: true');
});
