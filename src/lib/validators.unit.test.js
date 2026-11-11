import { describe, expect, test } from 'vitest';
import { validateMessage } from './validators';

describe('validateMessage 실제 검증', () => {
  test('정상 메시지의 앞뒤 공백만 제거한다', () => {
    expect(validateMessage(' \n 여행 중 들은 노래 \t')).toEqual({
      ok: true,
      value: '여행 중 들은 노래',
    });
  });

  test.each([
    ['빈 문자열', ''],
    ['공백만 있는 문자열', ' \t\n '],
    ['null', null],
    ['undefined', undefined],
  ])('%s 입력을 거부한다', (_label, input) => {
    expect(validateMessage(input)).toEqual({ ok: false, value: '' });
  });

  test('인수를 생략하면 빈 메시지로 거부한다', () => {
    expect(validateMessage()).toEqual({ ok: false, value: '' });
  });

  test.each([
    [1, true],
    [199, true],
    [200, true],
    [201, false],
  ])('%i자 메시지의 허용 여부는 %s이다', (length, ok) => {
    const value = '가'.repeat(length);
    expect(validateMessage(value)).toEqual({ ok, value });
  });

  test('길이 제한은 앞뒤 공백을 제거한 후 적용한다', () => {
    const value = '가'.repeat(200);
    expect(validateMessage(` \n${value}\t `)).toEqual({ ok: true, value });
  });
});
