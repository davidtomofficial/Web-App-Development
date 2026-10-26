# Browser validation record

Date: **2026-10-26**. Scope: historical portfolio/reference example; no deployment, operational service, or native release acceptance.

## Local results

| Check | Result |
| --- | --- |
| Original branch baseline | Clean installation and 13 unit tests passed; Expo web export failed because the three web dependencies were missing |
| Updated clean installation | `npm ci --no-audit --no-fund` passed: 1,221 packages installed using Node 22.23.4 / npm 10.9.9 |
| Existing behavioral tests | 13 passed; native and web dependencies are mocked in these tests |
| Metro web export | Passed with Expo 51.0.0 / React Native 0.74.1 / React 18.2.0; generated the browser bundle and local assets |
| Actual browser suite | 18 passed in Chromium 153.0.8010.0: nine cases at each of 1280 × 900 and 390 × 844 |
| Visual inspection | Dashboard screenshots inspected at desktop and narrow widths; original layout and imagery retained |
| Native devices/builds | Not run; no iOS or Android validation claimed |

The original application was also exercised in Chromium before the navigation fix. Going Welcome → dashboard → Volunteering left the URL at `/`, and browser Back returned to `about:blank`. Web-only linking now keeps URLs and browser history synchronized. Directly opened preview forms also needed a fallback because their Back button had no previous app screen; they now replace that screen with the dashboard. Automated tests cover both regressions.

## Browser environment qualification

The standard `npx playwright install chromium` download returned HTML instead of a ZIP in the authoring environment. To complete actual-browser testing, the local run used the separately installed, npm-distributed `@sparticuz/chromium@153.0.0` executable with Playwright 1.64.1. A temporary configuration outside the repository selected that executable. No alternate browser package or machine-specific path is included in application dependencies or the committed configuration.

The normal reproducible path is documented in the README: clean install, `npx playwright install --with-deps chromium`, and `npm run test:browser`. GitHub Actions uses this standard path with Playwright's matched Chromium revision. Local results above must not be represented as a successful standard browser-download test or as a completed GitHub-hosted run; hosted results are recorded on PR #1.

## What the browser tests establish

- The real exported JavaScript application renders and supports both preview routes, app Back, browser Back/Forward, reload, and direct-entry return navigation.
- Service clicks create real new browser pages at the expected HTTPS destinations with `window.opener === null`. Remote responses are intercepted; no service authentication, availability, or current app integration is claimed.
- The sample mail link's encoded content is checked at the browser boundary. It does not invoke a real OS mail handler or send mail.
- A deliberately thrown `window.open` exception reaches the visible alert path. Silent popup blocking is not covered by that injected exception.
- Tests watch for uncaught page errors, missing local assets, and unintended external requests. The dashboard image loads from the exported assets.

## Remaining reference-only limitations

iOS/Android builds, real devices, native app-scheme availability, Android package visibility, real mail handlers, silently blocked popups, Safari/WebKit, Firefox, and actual mobile browsers remain unverified. Narrow Chromium coverage is viewport testing only. Preview forms have no submission backend. Those boundaries are intentional for a resume example; they are not a commitment to build production functionality.

The existing framework versions and asset files are retained. Regenerating the lockfile adds web/test dependencies and updates the shared `minimatch` patch version from 3.1.2 to 3.1.5 to satisfy the preview server dependency. Historical licensing decisions are unchanged.
