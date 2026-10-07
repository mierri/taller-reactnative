This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

---

name: expo-project-structure
description: Folder structure for a new Expo app. Use when scaffolding or laying out a new Expo project with Expo Router, or deciding where a file should live in one. For new projects only — never restructure an existing app to match.
version: 1.0.0
license: MIT

---

# Expo Project Structure

A starting skeleton for a **new** Expo app — one with no committed folder structure yet.

**Apply only to new projects.** If the app already has a layout, follow its existing conventions and leave files where they are — a default to start from, never a standard to enforce or migrate toward. When unsure whether a project is new, ask before moving anything.

The whole layout, assembled from the rules below:

```
├── assets/
├── scripts/
├── src/
│   ├── app/                       # Expo Router routes ONLY — every file is a route
│   │   ├── api/                   #   server API routes, grouped here
│   │   │   ├── user+api.ts
│   │   │   └── settings+api.ts
│   │   ├── _layout.tsx
│   │   ├── _layout.web.tsx         #   platform-specific layout
│   │   ├── index.tsx
│   │   └── settings.tsx
│   ├── components/                 # reusable UI: button, card, table…
│   │   ├── table/                  #   complex component → folder + index.tsx
│   │   │   ├── cell.tsx
│   │   │   └── index.tsx
│   │   ├── bar-chart.tsx
│   │   ├── bar-chart.web.tsx        #   platform-specific variant
│   │   └── button.tsx
│   ├── screens/                    # screen bodies that route files render
│   │   ├── home/
│   │   │   ├── card.tsx            #   used only by Home — not shared
│   │   │   └── index.tsx           #   rendered by src/app/index.tsx
│   │   └── settings.tsx
│   ├── server/                     # server-only helpers used by app/api
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── utils/                      # standalone helpers + colocated tests
│   │   ├── format-date.ts
│   │   └── format-date.test.ts
│   ├── hooks/                      # reusable hooks: use-theme.ts…
│   ├── constants.ts
│   └── theme.ts
├── app.json
├── eas.json
└── package.json
```

## `src/` and `src/app`

Keep app code under `src/` to separate it from config files. Expo Router supports both `app/` and `src/app/` out of the box — to switch, move the folder and restart the bundler. The default template aliases `@/*` to `./src/*` in `tsconfig.json`.

`src/app` is **routes-only**: every file there becomes a route, so nothing else belongs in it. Everything below lives in sibling folders.

## components/ — reusable UI

Generic, reused UI (button, card, table) with one named export each. Name files in **kebab-case** (`bar-chart.tsx`), matching the default `create-expo-app` template. When a component grows, give it its own folder with the root in `index.tsx` and **colocate** its private sub-components beside it — the import path (`@/components/table`) stays unchanged.

## screens/ — screen bodies

Because `app/` files must be routes, complex screen UI that isn't reused has no home there. Once a screen grows big enough to need breaking out to separate components, put it in `screens/` and let each route just render its screen:

```tsx
import { Home } from "@/screens/home";

export default function HomeScreen() {
  // route-specific concerns only — e.g. read url params here
  return <Home />;
}
```

**Colocate** a screen's private components inside its folder (`screens/home/components/`). A bonus: the same screen can render under multiple routes.

## server/ + app/api/ — separate server code

Appending `+api` to a file in `app/` makes it a server **API route**. Server code is different from frontend code — it runs in a Node-like server environment (deployed with EAS Hosting or on [third-party services](https://docs.expo.dev/router/web/api-routes/#hosting-on-third-party-services)) and can read secret env vars (`process.env.X`, not just `EXPO_PUBLIC_*`). Keep it apart:

- Group all routes under `app/api/` → `/api/user`, `/api/settings`. This colocates them and avoids collisions (e.g. a `/user` screen and a `/user` route).
- Put shared server-only helpers in `src/server/`.
- Consider ESLint rules that fence `+api` files and `server/` off from frontend-only checks.

## Platform-specific code

Small differences: use `Platform.select` / `Platform.OS`. For larger ones, split into platform files instead of inline `if/else` — `bar-chart.tsx` + `bar-chart.web.tsx`, imported extension-free (`@/components/bar-chart`); Metro picks the right file per target.

- Props must be identical across variants.
- A default file (no platform extension) is always required — make it a no-op if the component is single-platform.
- Supported extensions: `.ios`, `.android`, `.native`, `.web`.

## Colocate styles and tests

- **Styles:** keep the `StyleSheet.create({ ... })` object at the bottom of the component file rather than in a separate `.styles` file.
- **Tests:** put `format-date.test.ts` next to `format-date.ts` (preferred over a separate `__tests__/` folder) so tested files are obvious at a glance.

## AI and config files

Agent instructions live at the repo root — `AGENTS.md` / `CLAUDE.md`, with project skills under `.claude/`. Other config and assets stay outside `src/`: `app.json` / `app.config.ts`, `eas.json`, `package.json`, `assets/`, and `scripts/`.

---

Based on [Expo app folder structure best practices](https://expo.dev/blog/expo-app-folder-structure-best-practices) by Kadi Kraman. For `src/` precedence and alias mechanics, see the [Expo docs](https://docs.expo.dev/router/reference/src-directory/).

## Submitting Feedback

If you encounter errors, misleading or outdated information in this skill, report it so Expo can improve:

```bash
npx --yes submit-expo-feedback@latest --category skills --subject "expo-project-structure" "<actionable feedback>"
```

Only submit when you have something specific and actionable to report. Include as much relevant context as possible.
If an AI agent repeatedly failed or the user had to take over an Expo task, load the expo-skill-feedback skill and follow its eval-candidate flow instead of reusing the command above.
