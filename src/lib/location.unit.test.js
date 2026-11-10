import { afterEach, describe, expect, test, vi } from 'vitest';
import { checkPositionUsable } from './location';
import { ERROR_CODES } from '../constants/errors';

const NOW = 1_700_000_000_000;
const position = { lat: 37.5665, lng: 126.978, accuracy: 10, timestamp: NOW };

afterEach(() => {
  vi.useRealTimers();
});

describe('checkPositionUsable 실제 검증', () => {
  test.each([null, undefined])('위치가 %s이면 사용 불가다', (input) => {
    expect(checkPositionUsable(input, NOW)).toEqual({
      ok: false,
      code: ERROR_CODES.LOCATION_UNAVAILABLE,
    });
  });

  test('최신이고 정확한 위치는 사용할 수 있다', () => {
    expect(checkPositionUsable(position, NOW)).toEqual({ ok: true });
  });

  test.each([0, 29_999, 30_000])('%i ms 지난 위치는 사용할 수 있다', (age) => {
    expect(checkPositionUsable({ ...position, timestamp: NOW - age }, NOW))
      .toEqual({ ok: true });
  });

  test('30초보다 1ms 오래된 위치는 거부한다', () => {
    expect(checkPositionUsable({ ...position, timestamp: NOW - 30_001 }, NOW))
      .toEqual({ ok: false, code: ERROR_CODES.LOCATION_STALE });
  });

  test.each([0, 99.9, 100])('정확도 오차 %i m는 허용한다', (accuracy) => {
    expect(checkPositionUsable({ ...position, accuracy }, NOW)).toEqual({ ok: true });
  });

  test('정확도 오차가 100m를 초과하면 거부한다', () => {
    expect(checkPositionUsable({ ...position, accuracy: 100.1 }, NOW))
      .toEqual({ ok: false, code: ERROR_CODES.LOCATION_INACCURATE });
  });

  test('오래되고 부정확한 위치는 오래됨 오류를 먼저 반환한다', () => {
    expect(checkPositionUsable({ ...position, timestamp: NOW - 30_001, accuracy: 101 }, NOW))
      .toEqual({ ok: false, code: ERROR_CODES.LOCATION_STALE });
  });

  test('현재 시간을 생략하면 Date.now()를 기준으로 판단한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(checkPositionUsable(position)).toEqual({ ok: true });
    vi.setSystemTime(NOW + 30_001);
    expect(checkPositionUsable(position))
      .toEqual({ ok: false, code: ERROR_CODES.LOCATION_STALE });
  });
});
