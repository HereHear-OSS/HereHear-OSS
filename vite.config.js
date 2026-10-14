import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // e2e(Playwright) 파일은 vitest가 건드리지 않도록 단위 테스트만 지정
    include: ['src/**/*.test.js'],
  },
});
