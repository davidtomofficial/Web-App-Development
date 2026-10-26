const { test: base, expect } = require('@playwright/test');

// Exercise the exported application in a real browser, without contacting services.
const test = base.extend({
  browserChecks: [async ({ context, baseURL }, use) => {
    const errors = [];
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    context.on('response', response => {
      if (response.url().startsWith(baseURL) && response.status() >= 400) {
        errors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === baseURL) return route.continue();
      errors.push(`Unexpected external request: ${route.request().url()}`);
      return route.abort();
    });
    await use();
    expect(errors, 'Uncaught browser errors, missing assets, or unexpected requests').toEqual([]);
  }, { auto: true }],
});

async function openDashboard(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Get Started', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('button', { name: 'Calendar', exact: true })).toBeVisible();
}

test('welcome, dashboard, preview forms, and in-app Back render correctly', async ({ page }, testInfo) => {
  await openDashboard(page);
  // RN Web paints Image as a background and keeps its measuring <img> hidden.
  await expect.poll(() => page.locator('img[src*="Robindale-YSA-logo"]').evaluateAll(images =>
    images.length > 0 && images.every(img => img.complete && img.naturalWidth > 0)
  )).toBe(true);
  await testInfo.attach('dashboard', { body: await page.screenshot(), contentType: 'image/png' });

  for (const [label, heading, route] of [
    ['Volunteering', 'Volunteering Form', 'volunteering'],
    ['Suggestions', 'Feedback Form', 'suggestions'],
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${route}$`));
    await expect(page.getByText(heading, { exact: true })).toBeVisible();
    await expect(page.getByText(/This preview does not collect or submit/)).toBeVisible();
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('button', { name: 'Calendar', exact: true })).toBeVisible();
  }
});

test('browser Back, Forward, and reload preserve the selected screen', async ({ page }) => {
  await openDashboard(page);
  await page.getByRole('button', { name: 'Volunteering', exact: true }).click();
  await expect(page).toHaveURL(/\/volunteering$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('button', { name: 'Calendar', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByText('Volunteering Form', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/volunteering$/);
  await expect(page.getByText('Volunteering Form', { exact: true })).toBeVisible();
});

for (const [route, heading] of [['volunteering', 'Volunteering Form'], ['suggestions', 'Feedback Form']]) {
  test(`direct /${route} URL renders the preview`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.getByText(heading, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
}

for (const [label, destination] of [
  ['Calendar', 'https://calendar.google.com/calendar/u/0/r'],
  ['Tools', 'https://www.churchofjesuschrist.org/'],
  ['Messaging', 'https://groupme.com/en-US/'],
]) {
  test(`${label} opens its website in a separate browser page`, async ({ context, page }) => {
    // Keep real window.open/popup behavior; replace only the remote HTTP response.
    const requests = [];
    await context.route(destination, route => {
      requests.push(route.request().url());
      return route.fulfill({ contentType: 'text/html', body: '<title>External destination fixture</title>' });
    });
    await openDashboard(page);
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: label, exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(destination);
    await expect(popup).toHaveTitle('External destination fixture');
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    expect(requests).toEqual([destination]);
    await expect(page).toHaveURL(/\/dashboard$/);
    await popup.close();
  });
}

test('mail link supplies encoded sample content without invoking an OS mail client', async ({ page }) => {
  await page.addInitScript(() => {
    window.__mailRequests = [];
    window.open = (...args) => { window.__mailRequests.push(args); return null; };
  });
  await openDashboard(page);
  await page.getByRole('button', { name: 'Report a bug or give feedback', exact: true }).click();
  const requests = await page.evaluate(() => window.__mailRequests);
  expect(requests).toHaveLength(1);
  const [url, target, features] = requests[0];
  expect(url).toContain('subject=Bug%20Report%20or%20Feedback');
  const mail = new URL(url);
  expect(mail.protocol).toBe('mailto:');
  expect(mail.pathname).toBe('support@RobindaleYSA.com');
  expect(mail.searchParams.get('body')).toBe('Hello, I would like to report a bug or provide feedback. Please provide details here:');
  expect(target).toBe('_blank');
  expect(features).toBe('noopener');
});

test('a thrown browser launch error produces a visible alert', async ({ page }) => {
  // Fault injection checks the rendered app error path, not popup-blocker detection.
  await page.addInitScript(() => { window.open = () => { throw new Error('Test launch failure'); }; });
  await openDashboard(page);
  const dialogPromise = page.waitForEvent('dialog').then(async dialog => {
    const details = { type: dialog.type(), message: dialog.message() };
    await dialog.accept();
    return details;
  });
  await page.getByRole('button', { name: 'Calendar', exact: true }).click();
  const dialog = await dialogPromise;
  expect(dialog.type).toBe('alert');
  expect(dialog.message).toContain('Unable to open link');
  await expect(page.getByRole('button', { name: 'Calendar', exact: true })).toBeVisible();
});
