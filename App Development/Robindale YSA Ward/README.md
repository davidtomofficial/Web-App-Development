# Robindale YSA Ward app prototype

Historical educational work retained for **resume demonstrations and reference for future development**. This Expo / React Native prototype demonstrates stack navigation, reusable link handling, platform-specific behavior, and browser regression tests. It is not an operational ward application, active signup service, or commercial product.

The welcome screen, dashboard, original imagery, random quote, and service destinations are preserved. Volunteering and Suggestions are explicitly labeled portfolio previews and collect no information.

## Reproducible setup

Use **Node.js 22.23.4 and npm 10.9.9**. `.nvmrc` records Node; `engines` and `packageManager` record the toolchain in `package.json`. For example, with nvm installed:

```sh
cd "App Development/Robindale YSA Ward"
nvm install
nvm use
npm install --global npm@10.9.9
npm ci --no-audit --no-fund
npm run web
```

All subsequent commands run in this app directory. `npm ci` uses the committed lockfile. `npm start`, `npm run ios`, and `npm run android` retain the original Expo development commands; they do not establish native-device compatibility.

## Dependency choices

| Package | Manifest | Locked version |
| --- | --- | --- |
| Expo | `~51.0.0` | `51.0.0` (preserved) |
| React / React DOM | `18.2.0` | `18.2.0` |
| React Native | `0.74.1` | `0.74.1` (preserved) |
| React Native Web | `~0.19.10` | `0.19.13` |
| Expo Metro runtime | `~3.2.3` | `3.2.3` |
| React Navigation native / stack | `6.1.17` / `6.3.29` | Original locked versions, now explicitly declared |

The web dependencies were selected with this project's Expo CLI using `npx expo install react-dom react-native-web @expo/metro-runtime`, following [Expo's web setup](https://docs.expo.dev/workflow/web/). Metro is explicitly selected in `app.json`. There is no Expo, React, React Native, or navigation-major migration. Playwright and `serve-handler` are pinned development-only tools.

This retained historical stack is not a production deployment or dependency-security certification. Installation can emit upstream deprecation warnings. Evaluate upgrades separately before reuse in a new project; automatic major upgrades or `npm audit fix --force` are not part of reproducing this example.

## Build and preview

```sh
npm run build:web
npm run preview:web
```

Open `http://127.0.0.1:4173`. The local preview serves the exported `dist/` application on loopback and falls back to `index.html` for browser history routes. Other static servers must provide the same SPA fallback for direct links and reloads.

| Browser path | Screen |
| --- | --- |
| `/` | Welcome |
| `/dashboard` | Service dashboard |
| `/volunteering` | Volunteering preview |
| `/suggestions` | Suggestions preview |

Browser URLs, Back, and Forward use React Navigation's [linking configuration](https://reactnavigation.org/docs/6.x/configuring-links/). Directly opened preview screens have a dashboard fallback for their Back button. Both changes are gated to web; native navigation and external-link decisions retain their previous behavior.

## Automated validation

```sh
npm test
npx playwright install --with-deps chromium
npm run test:browser
```

`npm test` runs the 13 existing Node behavioral tests with injected platform/link dependencies. `npm run test:browser` always exports a fresh web bundle, starts the preview automatically, and runs 18 Chromium checks: nine cases each at 1280 × 900 and 390 × 844. Close any manually running preview on port 4173 first. The narrow viewport is a desktop browser, not a native-device test.

Browser coverage includes:

- Welcome, dashboard, both preview screens, in-app Back, and logo loading.
- Browser Back, Forward, reloads, direct preview URLs, and return to the dashboard.
- Calendar, Tools, and Messaging opening their expected HTTPS URLs in real separate pages with no opener. Only remote HTTP responses are replaced with fixtures; external services are never contacted.
- Encoded sample `mailto:` content, with `window.open` intercepted so no OS mail client launches.
- A visible alert after an injected launch exception, plus uncaught JavaScript errors and missing local assets.

The [GitHub Actions workflow](../../.github/workflows/robindale-web.yml) runs on relevant PR changes, pushes to `main`, and manual dispatch. It uses a clean install, pinned action revisions, one Chromium worker, zero retries, a three-minute test limit, and a 15-minute job limit. Repository permissions are read-only; superseded runs are canceled. Reports, dashboard screenshots, and failure traces are retained for seven days. It does not publish the app.

See [VALIDATION.md](VALIDATION.md) for recorded results and environment limitations. Run `npx playwright show-report` to inspect a local report.

## Boundaries for future reference

- **Native remains unverified:** no iOS/Android build, simulator, or physical-device acceptance is claimed. The existing iOS query schemes require a native rebuild; Expo Go does not acquire them from `app.json`. Third-party schemes, Android package visibility, and installed/uninstalled app fallbacks need native testing if reused.
- **External services:** browser tests validate destinations and popup behavior, not third-party availability, authentication, or integration. Service URLs are historical examples.
- **Email:** `support@RobindaleYSA.com` is retained as a historical sample, not a verified or monitored support address. The app does not send mail, and OS mail-client handoff is unverified.
- **Browser limits:** Firefox, Safari/WebKit, and real mobile browsers are untested. A popup blocker may silently return `null`; React Native Web's `Linking.openURL` does not reliably report that condition. The exception test is not a popup-blocker acceptance test.
- **Forms:** no backend or submission workflow exists or is planned as part of this portfolio maintenance.

Existing assets, attribution, and licensing decisions are unchanged. `bugs.txt` records the remaining validation boundaries.
