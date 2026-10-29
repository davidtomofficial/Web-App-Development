# Robindale YSA Ward — React Native / Expo Prototype

**Status: historical learning prototype, not a production app.** This code explores an informational application with React Native, Expo, and React Navigation. It is retained for technical portfolio review and historical reference.

## What is in the project

- `App.js` defines a stack navigator connecting a welcome screen to the main example screen.
- `components/WelcomeScreen.js` and `components/AssetExample.js` contain interface elements and navigation examples.
- `components/FeedbackForm.js` and `components/Volunteeringform.js` contain prototype form components.
- `assets/` contains associated images and example content.

## Historical technology versions

The committed `package.json` references Expo SDK **~51.0.0**, React **18.2.0**, React Native **0.74.1**, React Navigation, and other dependencies. These version numbers document the prototype's historical environment; they are **not** a claim of currently supported dependencies.

The manifest includes `start`, `android`, `ios`, and `web` scripts. **The current web build, native builds, accessibility, functionality, and deployment have not been independently validated.** Browser-specific dependencies and version compatibility may require changes before the app can run.

## For reviewers

Read the source code and component structure to evaluate the prototype. To test it, first establish a compatible Expo/React Native environment and review the dependencies. Do not use it as a currently supported app or publish it without a fresh build, security, and functionality review.

This is an independent historical code experiment. Use of the organization name does **not** imply that it is an officially released, endorsed, or maintained organizational application.

See the [repository-level overview](../../README.md) for the distinction between current professional work, coursework, and archived prototypes.
