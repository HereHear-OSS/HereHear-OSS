import { defineConfig, devices } from '@playwright/test';

// 위치 권한·좌표를 흉내 내려면 context 옵션(geolocation, permissions)을 사용한다.
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    ...devices['Pixel 7'], // 모바일 화면 기준
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    // Always start an isolated server without a Supabase connection.
    reuseExistingServer: false,
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    },
  },
});
