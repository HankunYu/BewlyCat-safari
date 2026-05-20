# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Install dependencies (pnpm required)
pnpm install

# Development
pnpm dev              # Chrome/Edge dev mode with HMR
pnpm dev-firefox      # Firefox dev mode
pnpm start:chromium   # Launch Chrome with extension loaded
pnpm start:firefox    # Launch Firefox with extension loaded

# Building
pnpm build            # Build for Chrome/Edge → extension/
pnpm build-firefox    # Build for Firefox → extension-firefox/
pnpm build-safari     # Build for Safari → extension-safari/

# Quality checks
pnpm lint             # ESLint check
pnpm lint:fix         # Auto-fix lint issues
pnpm test             # Run Vitest
pnpm typecheck        # Run vue-tsc type checking
```

## Architecture Overview

BewlyCat is a **Manifest V3 browser extension** for Bilibili that provides an enhanced homepage experience. Built with Vue 3 + Vite + TypeScript + Pinia.

### Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Extension                        │
├─────────────────────────────────────────────────────────────┤
│  Background Service Worker (src/background/)                │
│  ├── messageListeners/api/  # Proxied Bilibili API calls    │
│  ├── wbiSign.ts             # WBI signature for API auth    │
│  └── appAuthScheduler.ts    # Auth token refresh            │
├─────────────────────────────────────────────────────────────┤
│  Content Scripts (src/contentScripts/)                      │
│  ├── index.ts               # Main entry, Vue app mount     │
│  ├── player.ts              # Player enhancements           │
│  ├── shortcuts.ts           # Keyboard shortcuts            │
│  └── audioInterceptor.ts    # Volume normalization          │
├─────────────────────────────────────────────────────────────┤
│  Inject Scripts (src/inject/)  # Runs in page's MAIN world  │
└─────────────────────────────────────────────────────────────┘
```

### Message-Driven Communication

Content scripts communicate with background via `browser.runtime.sendMessage`. Background handles all Bilibili API calls to work around CORS and add WBI signatures.

### Multi-Platform Conditional Compilation

```typescript
process.env.FIREFOX // true when building for Firefox
process.env.SAFARI // true when building for Safari
__DEV__ // true in development mode
```

## Key Source Directories

- `src/background/messageListeners/api/` - API handlers for video, search, ranking, history, etc.
- `src/components/` - Reusable Vue components (VideoCard, TopBar, Dock, Settings, etc.)
- `src/contentScripts/views/` - Page-specific views injected into Bilibili
- `src/stores/` - Pinia stores (mainStore, topBarStore, settingsStore)
- `src/composables/` - Vue composition functions (useStorageLocal, useDark, useFilter)
- `src/logic/storage.ts` - Extension storage management and settings schema
- `src/models/` - TypeScript interfaces for Bilibili API responses
- `src/_locales/` - i18n translation files (manually maintained, no automation tools)

## Code Conventions

- Use Vue 3 Composition API with `<script setup>`
- Path alias: `~/` maps to `src/`
- ESLint with `@antfu/eslint-config`; run `pnpm lint:fix` before commits
- Commit messages follow Angular convention: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Branch naming: `feat/`, `fix/`, `doc/` for feature work; `main` is the integration branch
- i18n files are **manually maintained** - do not use i18n automation tools

## Testing

Tests use Vitest and are located in `src/tests/` with `*.spec.ts` pattern.

```bash
pnpm test              # Run all tests
pnpm test -- demo      # Run specific test file
```
