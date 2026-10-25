# Robindale YSA Ward app prototype

A community-app prototype built with Expo SDK 51, React Native, and React Navigation. It includes a welcome screen, a service dashboard, a random quote, and preview screens for volunteering and suggestions.

## Development

In this directory, using a Node.js environment compatible with the existing Expo SDK 51 toolchain:

```sh
npm ci
npm start
```

Use the platform launch options shown by Expo for an emulator or compatible development build. The tracked lockfile preserves the existing dependency versions; this maintenance work does not upgrade Expo.

## Tests

The external-link tests use Node.js's built-in test runner (Node.js 18 or newer) and do not launch external services:

```sh
npm test
```

They cover successful app launches, unavailable apps, rejected capability checks, failed launches, website/store fallback buttons, mail links, and desktop behavior. They do not replace testing in an iOS or Android build.

## Current behavior and limitations

- Volunteering and Suggestions open registered screens. Both are clearly marked as previews; no submission backend is configured.
- On mobile, service buttons attempt to open the app, then offer its website or app-store page if it cannot be opened. Failed link promises are handled.
- On web/desktop, service buttons open the website directly rather than querying mobile app schemes.
- The iOS configuration declares the three custom schemes queried by the app. This requires a rebuilt native app; changing `app.json` does not alter the installed Expo Go binary. See [React Native Linking](https://reactnative.dev/docs/linking) and [Expo app configuration](https://docs.expo.dev/versions/latest/config/app/).
- Custom app schemes still need validation against the current third-party apps on real devices. Android app detection can also depend on native package-visibility configuration.
- The existing `web` script needs Expo web dependencies before a browser build can be validated: the tracked lockfile currently lacks `react-dom`, `react-native-web`, and `@expo/metro-runtime`.
- The bug-report button opens the device's email client; the application does not send mail itself.

See `bugs.txt` for the remaining acceptance checks.
