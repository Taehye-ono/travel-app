import { test, expect } from '@playwright/test';

test('creates a nature trip, preserves edits, and clears mandatory places after city change', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.locator('#form-error')).toContainText('도시');
  await page.getByRole('radio', { name: /London/ }).check();
  await page.getByRole('checkbox', { name: '자연', exact: true }).check();
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.getByRole('heading', { name: 'Hyde Park', exact: true })).toBeVisible();
  await expect(page.getByText('추천 장소가 없는 날이에요.')).toBeVisible();
  await page.getByRole('button', { name: '조건 수정하기', exact: true }).first().click();
  await expect(page.getByRole('checkbox', { name: '자연', exact: true })).toBeChecked();
  await page.getByRole('checkbox', { name: /British Museum/ }).check();
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.getByRole('heading', { name: 'British Museum', exact: true })).toBeVisible();
  await expect(page.getByText('필수 방문', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '조건 수정하기', exact: true }).first().click();
  await page.getByRole('radio', { name: /Edinburgh/ }).check();
  await expect(page.getByRole('status')).toContainText('초기화');
  await expect(page.getByRole('checkbox', { name: /British Museum/ })).toHaveCount(0);
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.getByRole('heading', { name: /에든버러,/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile supports searching, validates capacity, and has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('radio', { name: /London/ }).check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/mobile-input.png', fullPage: true, caret: 'initial' });
  await page.getByRole('radio', { name: '1일', exact: true }).check();
  await page.getByRole('radio', { name: /여유롭게/ }).check();
  await page.getByRole('checkbox', { name: '자연', exact: true }).check();
  const search = page.getByRole('searchbox');
  await search.fill('no such place');
  await expect(page.getByText('검색 결과가 없어요.')).toBeVisible();
  await search.fill('');
  for (const name of ['British Museum', 'Tower of London', 'Tower Bridge', 'Borough Market']) await page.getByRole('checkbox', { name: new RegExp(name) }).check();
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.locator('#form-error')).toContainText('1곳 많아요');
  await page.getByRole('checkbox', { name: /Borough Market/ }).uncheck();
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.locator('.result-place')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('.result-heading h1')).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/mobile-result.png', fullPage: true, caret: 'initial' });
});

test('desktop input and result render without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/desktop-input.png', fullPage: true, caret: 'initial' });
  await page.getByRole('radio', { name: /Edinburgh/ }).check();
  for (const name of ['관광', '역사·문화', '자연', '음식·카페', '쇼핑']) await page.getByRole('checkbox', { name, exact: true }).check();
  await page.getByRole('radio', { name: /빡빡하게/ }).check();
  await page.getByRole('button', { name: '여행 일정 만들기' }).click();
  await expect(page.locator('.result-place')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('.result-heading h1')).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/desktop-result.png', fullPage: true, caret: 'initial' });
});
