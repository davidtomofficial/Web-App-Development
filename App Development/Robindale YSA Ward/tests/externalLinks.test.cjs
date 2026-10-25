const test = require('node:test');
const assert = require('node:assert/strict');
const { createExternalLinkActions } = require('../utils/externalLinks');

const appUrl = 'example://';
const storeUrl = 'https://example.com/store';
const webUrl = 'https://example.com/';

function setup(os = 'ios', behavior = {}) {
  const opened = [];
  const queries = [];
  const alerts = [];
  const browserAlerts = [];
  const actions = createExternalLinkActions({
    Platform: { OS: os },
    Alert: { alert: (...args) => alerts.push(args) },
    notifyBrowserError: message => browserAlerts.push(message),
    Linking: {
      canOpenURL: async (url) => {
        queries.push(url);
        if (behavior.queryError) throw new Error('Capability query failed');
        return behavior.supported ?? true;
      },
      openURL: async (url) => {
        opened.push(url);
        if (behavior.failUrls?.includes(url)) throw new Error('Launch failed');
      },
    },
  });
  return { ...actions, opened, queries, alerts, browserAlerts };
}

for (const os of ['ios', 'android']) {
  test(`${os}: open an installed app`, async () => {
    const state = setup(os);
    assert.equal(await state.openAppOrStore(appUrl, storeUrl, webUrl), true);
    assert.deepEqual(state.queries, [appUrl]);
    assert.deepEqual(state.opened, [appUrl]);
    assert.deepEqual(state.alerts, []);
  });
}

for (const os of ['web', 'windows']) {
  test(`${os}: use the website without querying mobile schemes`, async () => {
    const state = setup(os, { queryError: true });
    assert.equal(await state.openAppOrStore(appUrl, storeUrl, webUrl), true);
    assert.deepEqual(state.queries, []);
    assert.deepEqual(state.opened, [webUrl]);
    assert.deepEqual(state.alerts, []);
  });
}

for (const [label, behavior] of [
  ['unavailable app', { supported: false }],
  ['rejected capability query', { queryError: true }],
  ['rejected app launch', { failUrls: [appUrl] }],
]) {
  test(`${label}: offer working website and store choices`, async () => {
    const state = setup('ios', behavior);
    assert.equal(await state.openAppOrStore(appUrl, storeUrl, webUrl), false);
    assert.equal(state.alerts.length, 1);
    const buttons = state.alerts[0][2];
    const beforeCancel = state.opened.length;
    assert.equal(buttons.find(button => button.text === 'Cancel').onPress, undefined);
    assert.equal(state.opened.length, beforeCancel);
    assert.equal(await buttons.find(button => button.text === 'Website').onPress(), true);
    assert.equal(await buttons.find(button => button.text === 'Download').onPress(), true);
    assert.deepEqual(state.opened.slice(-2), [webUrl, storeUrl]);
  });
}

for (const [label, url] of [['Website', webUrl], ['Download', storeUrl]]) {
  test(`${label} failure is handled after choosing a fallback`, async () => {
    const state = setup('android', { supported: false, failUrls: [url] });
    await state.openAppOrStore(appUrl, storeUrl, webUrl);
    const button = state.alerts[0][2].find(button => button.text === label);
    assert.equal(await button.onPress(), false);
    assert.equal(state.alerts[1][0], 'Unable to open link');
  });
}

test('direct mail link succeeds without an app capability query', async () => {
  const state = setup();
  assert.equal(await state.openUrl('mailto:example@example.com'), true);
  assert.deepEqual(state.opened, ['mailto:example@example.com']);
  assert.deepEqual(state.queries, []);
});

test('direct link failure is handled and reported', async () => {
  const state = setup('ios', { failUrls: [webUrl] });
  assert.equal(await state.openUrl(webUrl), false);
  assert.equal(state.alerts[0][0], 'Unable to open link');
  assert.deepEqual(state.browserAlerts, []);
});

test('web link failure gives browser feedback without a native alert', async () => {
  const state = setup('web', { failUrls: [webUrl] });
  assert.equal(await state.openAppOrStore(appUrl, storeUrl, webUrl), false);
  assert.deepEqual(state.queries, []);
  assert.deepEqual(state.alerts, []);
  assert.match(state.browserAlerts[0], /Unable to open link/);
});

test('web mail failure uses the browser alert when no notifier is supplied', async () => {
  const originalAlert = globalThis.alert;
  const messages = [];
  globalThis.alert = message => messages.push(message);
  try {
    const actions = createExternalLinkActions({
      Platform: { OS: 'web' },
      Alert: { alert: () => assert.fail('Native alert must not be used on web') },
      Linking: { openURL: async () => { throw new Error('No mail handler'); } },
    });
    assert.equal(await actions.openUrl('mailto:example@example.com'), false);
    assert.match(messages[0], /Unable to open link/);
  } finally {
    if (originalAlert === undefined) delete globalThis.alert;
    else globalThis.alert = originalAlert;
  }
});
