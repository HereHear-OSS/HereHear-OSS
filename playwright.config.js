import { defineConfig, devices } from '@playwright/test';

// 위치 권한·좌표를 흉내 내려면 context 옵션(geolocation, permissions)을 사용한다.
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    ...devices['Pixel 7'], // 모바일 화면 기준
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
