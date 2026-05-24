# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (StyleGuidist component explorer on localhost:6060)
NODE_OPTIONS=--openssl-legacy-provider npx styleguidist server

# Build
npm run build:prod   # minified, for release
npm run build:dev    # unminified

# Test
npm test                                 # all tests
jest testUpdateAlignments.test.js        # single test file (no npm prefix needed)
jest --watch                             # watch mode

# Lint & format
npm run lint
npm run lint:fix
npm run format
```

## What this library does

A React Component Library (RCL) for aligning Bible verse words — mapping source language (Greek/Hebrew) words to target translation words — with USFM (`zaln` tag) as the storage format. It exports three progressive components plus helper utilities.

## Three main components

All exported from `src/index.js`:

| Component | Adds over the simpler one |
|-----------|---------------------------|
| `WordAligner` | Base: word bank + alignment grid, drag-drop, lexicon popup |
| `WordAlignmentTool` | + verse selector, Scripture context panes, Reset/Save buttons |
| `SuggestingWordAligner` | + async suggestion engine (`suggester` callback), suggestion controls |

## Architecture

**Data format**: Alignments are stored in USFM `zaln` markup. The helpers parse USFM into an internal word-list/alignment-object structure, pass it to components, and serialize it back on save.

**Key source areas:**

- `src/components/` — React UI (22 files). The three main components are `WordAligner.jsx`, `WordAlignmentTool.jsx`, `SuggestingWordAligner.jsx`.
- `src/helpers/alignmentHelpers.js` — Core alignment business logic (~1237 lines): `parseUsfmToWordAlignerData`, `updateAlignmentsToTargetVerse`, `alignmentCleanup`, `findAlignment`, etc.
- `src/helpers/usfmHelpers.js` — USFM parse/generate.
- `src/helpers/groupDataHelpers.js` — Chapter/verse data navigation.
- `src/helpers/migrateOriginalLanguageHelpers.js` — Migration between original-language versions.
- `src/tc_ui_toolkit/` — Bundled UI sub-components (ScripturePane, GroupedMenu, FontSizeSlider, etc.) that are used internally and also re-exported.
- `src/common/constants.js` — `OT_ORIG_LANG`, `NT_ORIG_LANG`, and related constants.

**State**: Components are mostly controlled (caller owns alignment state). `SuggestingWordAligner` maintains internal suggestion state.

**Build output**: Vite produces both ESM (`dist/index.es.js`) and CJS (`dist/index.cjs.js`).

## Tests

Tests live in `src/__tests__/`. Fixtures (JSON test cases) are in `src/__tests__/fixtures/`.

- `testUpdateAlignments.test.js` — most comprehensive; covers alignment migration and updates
- `Lexicon.test.js`, `groupData.test.js`, `verseSpan.test.js` — targeted helpers tests

Jest config (`jest.config.js`) clears mocks between tests; coverage output goes to `coverage/`.

## Code style

`.prettierrc`: no semicolons, single quotes, 2-space indent, avoid arrow parens.  
`.eslintrc`: React rules enabled, jest globals, semicolons required (note: ESLint rule differs from Prettier — prefer `lint:fix` + `format` together).