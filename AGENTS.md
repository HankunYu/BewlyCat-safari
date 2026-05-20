# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the extension code: `background/`, `contentScripts/`, `popup/`, `options/`, `inject/`, shared `components/`, `stores/`, and `utils/`.
- `src/_locales/` holds i18n strings; maintain manually.
- `src/tests/` contains Vitest specs like `*.spec.ts`.
- `scripts/` includes build helpers (for example `scripts/prepare.ts`).
- `assets/` stores static images/icons; `docs/` includes contributor docs.
- Build outputs land in `extension/`, `extension-firefox/`, and `extension-safari/`.

## Build, Test, and Development Commands
- `pnpm install` installs dependencies (pnpm is required).
- `pnpm dev` builds/watch for Chrome/Edge; `pnpm start:chromium` launches a dev browser.
- `pnpm dev-firefox` builds/watch for Firefox; `pnpm start:firefox` launches a dev browser.
- `pnpm build` builds Chrome/Edge; `pnpm build-firefox` builds Firefox; `pnpm build-safari` builds Safari.
- `pnpm convert-safari` converts `extension-safari/` into a Safari App Extension project (requires macOS + Xcode).
- `pnpm lint` runs ESLint; `pnpm lint:fix` auto-fixes.
- `pnpm test` runs Vitest; `pnpm typecheck` runs `vue-tsc`.

## Coding Style & Naming Conventions
- TypeScript + Vue 3 (Composition API) with Vite; follow existing module layout and file naming in each folder.
- Formatting and import order are enforced by ESLint (`@antfu/eslint-config`, `simple-import-sort`); run `pnpm lint:fix` before PRs.
- Keep new i18n keys grouped with nearby entries in `src/_locales/` and avoid automated i18n tooling.

## Testing Guidelines
- Use Vitest for unit tests; place specs in `src/tests/` with `*.spec.ts`.
- Prefer small, focused tests that mirror existing patterns (see `src/tests/demo.spec.ts`).
- Run `pnpm test` locally before submitting.

## Commit & Pull Request Guidelines
- Commit messages follow Angular-style types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`.
- Optional scope and footer are welcome, e.g. `fix(dock): handle null state` and `Related PR: <url>`.
- Branch naming: `feat/`, `doc/`, or `fix/` for short-lived branches; `main` is the integration branch.
- PRs should include a short summary, reproduction steps if relevant, and screenshots for UI changes.
- For translations, note any languages you cannot validate; do not use i18n automation tools.

## Agent-Specific Instructions
- If you are running automated agents, check `AGENT.md` for architecture notes and build targets.
