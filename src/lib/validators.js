import { POLICY } from '../constants/policy';

/**
 * 메시지: 앞뒤 공백 제거 후 1~200자.
 * @returns {{ok:boolean,value:string}}
 * TODO(7주): 필요하면 규칙 보강 (서버 SQL 의 check 제약과 항상 동일하게)
 */
export function validateMessage(raw) {
  const value = (raw ?? '').trim();
  const ok = value.length >= POLICY.MESSAGE_MIN && value.length <= POLICY.MESSAGE_MAX;
  return { ok, value };
}
