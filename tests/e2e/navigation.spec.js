import { expect, test } from '@playwright/test';

test.use({
  geolocation: { latitude: 37.5665, longitude: 126.978, accuracy: 10 },
  permissions: ['geolocation'],
});

test('지도에서 등록 폼을 검증하고 저장 목록으로 이동한다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: '.env 에 Supabase 설정이 없어요.' }))
    .toBeVisible();

  const navigation = page.getByRole('navigation');
  await expect(navigation.getByRole('link', { name: '지도', exact: true }))
    .toHaveAttribute('aria-current', 'page');

  await navigation.getByRole('link', { name: '등록', exact: true }).click();
  await expect(page).toHaveURL('/register');
  await expect(page.getByRole('heading', { name: '현재 위치에 음악 남기기' })).toBeVisible();

  await page.getByRole('combobox').selectOption('song-001');
  const message = page.getByPlaceholder('이 장소의 기억을 남겨보세요 (1~200자)');
  await message.fill('   ');
  const submit = page.getByRole('button', { name: '현재 위치에 등록', exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByRole('alert').filter({ hasText: '곡을 선택하고 메시지를 1~200자로 입력해 주세요.' }))
    .toBeVisible();
  await expect(page).toHaveURL('/register');

  await navigation.getByRole('link', { name: '저장', exact: true }).click();
  await expect(page).toHaveURL('/saved');
  await expect(page.getByRole('heading', { name: '저장한 발자국' })).toBeVisible();
  await expect(page.getByText('저장한 발자국이 아직 없어요.', { exact: true })).toBeVisible();
  await expect(navigation.getByRole('link', { name: '저장', exact: true }))
    .toHaveAttribute('aria-current', 'page');
});
