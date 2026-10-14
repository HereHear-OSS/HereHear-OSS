import { POLICY } from '../constants/policy';
import { ERROR_CODES } from '../constants/errors';

/**
 * 위치 측정값이 등록/새 재생에 쓸 수 있는지 검사한다.
 * @param {{lat:number,lng:number,accuracy:number,timestamp:number}|null} position
 * @param {number} now Date.now() (테스트에서 주입 가능)
 * @returns {{ok:true}|{ok:false,code:string}}
 */
export function checkPositionUsable(position, now = Date.now()) {
  if (!position) return { ok: false, code: ERROR_CODES.LOCATION_UNAVAILABLE };
  if (now - position.timestamp > POLICY.MAX_LOCATION_AGE_MS) {
    return { ok: false, code: ERROR_CODES.LOCATION_STALE };
  }
  if (position.accuracy > POLICY.MAX_ACCURACY_M) {
    return { ok: false, code: ERROR_CODES.LOCATION_INACCURATE };
  }
  return { ok: true };
}
