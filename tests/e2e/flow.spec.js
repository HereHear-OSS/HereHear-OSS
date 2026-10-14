import { test } from '@playwright/test';

// 14주차: 두 세션 통합 검증 (등록 → 발견 → 재생 → 저장)
// 위치는 browser.newContext({ geolocation: { latitude, longitude }, permissions: ['geolocation'] }) 로 주입.
test.describe('핵심 흐름', () => {
  test.skip('여행자 A가 등록하고 여행자 B(다른 세션)가 반경 안에서 발견한다', async () => {});
  test.skip('동일 곡을 반경 2km 안에 다시 등록하면 "이미 등록된 노래입니다"가 표시된다', async () => {});
  test.skip('좋아요 중복 집계 없음, 취소 가능, 재접속 후 즐겨찾기 유지', async () => {});
});
