const { test, expect } = require('@playwright/test');

function failOnPageErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return () => expect(errors, 'uncaught browser errors').toEqual([]);
}

test('homepage navigation, theme, and portrait interaction work', async ({ page }) => {
  const assertNoPageErrors = failOnPageErrors(page);

  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Justin');
  await expect(page.getByRole('link', { name: 'posts' })).toBeVisible();

  const portrait = page.getByRole('button', { name: 'Show Justin as a pixel character' });
  await expect(portrait).toBeEnabled();
  await portrait.click();
  await expect(portrait).toHaveAttribute('aria-pressed', 'true');

  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Toggle dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  assertNoPageErrors();
});

test('posts index links to a rendered post', async ({ page }) => {
  const assertNoPageErrors = failOnPageErrors(page);

  await page.goto('/posts/');
  await expect(page.getByRole('heading', { name: 'Posts.' })).toBeVisible();

  const firstPost = page.locator('.writing-row').first();
  await expect(firstPost).toBeVisible();
  await firstPost.click();
  await expect(page.locator('article.post')).toBeVisible();

  assertNoPageErrors();
});

test('404 page renders its recovery links', async ({ page }) => {
  const assertNoPageErrors = failOnPageErrors(page);

  await page.goto('/404.html');
  await expect(page.getByText('404 · not found · page presumed lost')).toBeVisible();
  await expect(page.getByRole('link', { name: /The front page/ })).toBeVisible();

  assertNoPageErrors();
});

test('pronoun game starts without browser errors', async ({ page }) => {
  const assertNoPageErrors = failOnPageErrors(page);

  await page.goto('/special-projects/pronouns/');
  await page.getByRole('button', { name: 'START GAME' }).click();
  await expect(page.locator('#start-screen')).toHaveClass(/hidden/);
  await expect(page.locator('#prompt-text')).toContainText(/\b(HIM|HER|HE|SHE)\b/);
  await expect(page.getByRole('button', { name: 'Boy' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Girl' })).toBeVisible();

  assertNoPageErrors();
});
