import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    // 1. Явно указываем, какой файл запускать.
    // Vitest (когда не падает) увидит этот include.
    include: ['./packages/react-provider/spamHash.browser.vitest.ts'],
    
    // 2. Включаем глобальные переменные (describe, test, expect)
    globals: true,

    // 3. Конфигурация браузера
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),

      // 4. ВОТ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
      // Vitest просил 'instances'.
      // Он ожидает МАССИВ ОБЪЕКТОВ, а не массив строк.
      instances: [
        { browser: 'chromium' }
      ],
    },
  },
});
