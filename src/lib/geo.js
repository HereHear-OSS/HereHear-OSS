import { POLICY } from '../constants/policy';

/**
 * 두 좌표 사이의 거리(미터).
 * @param {{lat:number,lng:number}} a
 * @param {{lat:number,lng:number}} b
 * @returns {number}
 *
 * TODO(6주): Haversine 공식으로 구현. 지도 활성 상태·클라이언트 검사에 공통 사용.
 * 서버(PostGIS)의 ST_Distance 결과와 오차가 거의 없어야 한다.
 */
// eslint-disable-next-line no-unused-vars
export function distanceMeters(a, b) {
  return Infinity; // TODO: 구현 전에는 항상 "멀다"로 취급해 안전하게 막는다
}

/** 반경(기본 2,000m) 이하를 포함하는지 */
export function isWithinRadius(a, b, radiusM = POLICY.RADIUS_M) {
  return distanceMeters(a, b) <= radiusM;
}
