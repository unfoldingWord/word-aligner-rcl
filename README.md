
# checking-tool-rcl

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/57413041-9de1-4d67-969e-3d5a2cd4225c/deploy-status)](https://app.netlify.com/sites/translation-helps-rcl/deploys)
[![CI Status](https://github.com/unfoldingWord/translation-helps-rcl/workflows/CI/badge.svg)](https://github.com/unfoldingWord/translation-helps-rcl/actions)
[![Current Verison](https://img.shields.io/github/tag/unfoldingWord/translation-helps-rcl.svg)](https://github.com/unfoldingWord/translation-helps-rcl/tags)
[![View this project on NPM](https://img.shields.io/npm/v/translation-helps-rcl)](https://www.npmjs.com/package/translation-helps-rcl)
[![Coverage Status](https://coveralls.io/repos/github/unfoldingWord/translation-helps-rcl/badge.svg?branch=main)](https://coveralls.io/github/unfoldingWord/translation-helps-rcl?branch=main)

A React Component Library for doing translation checking - extracted from translationNotes and translationWords.

## About

The Checking Tool Resource Container Library (checking-tool-rcl) is a comprehensive React component library designed for Bible translation checking workflows. It provides reusable UI components and utilities that enable efficient and consistent translation verification processes across different applications.

This library is built as a resource container library (RCL), making it easy to integrate into various React applications while maintaining a consistent user experience for translation checking activities.

### Key Features

- **Translation Notes (TN) Checking**: Components for reviewing and validating translation notes
- **Translation Words (TW) Checking**: Tools for verifying key terms and concepts across translations
- **Multi-pane Scripture Viewing**: Side-by-side display of original language, gateway language, and target language texts
- **Verse Selection and Annotation**: Interface for selecting, highlighting, and annotating portions of verses
- **Comment Management**: Tools for adding and tracking comments on translations
- **Bookmark/Reminder System**: Ability to mark checks for later review
- **Translation Helps Integration**: Display of contextual help documents and lexicon data
- **Responsive Layout**: Adaptable UI that works across different screen sizes
- **Customizable Styling**: Configurable appearance to match host application themes

### Use Cases

- Bible translation checking applications
- Translation verification workflows
- Multi-language scripture comparison tools
- Translation quality assurance systems
- Bible study applications with checking capabilities

## Running demo

- using node v20:
  - from the command line cd to the folder containing the repo
  - then run `yarn` to install dependencies
  - then run `yarn start` to launch the demo

## Running tests

- using node v20:
  - from the command line cd to the folder containing the repo
  - then run `yarn` to install dependencies
  - then run `yarn test` to run the unit tests

## Integration

The checking-tool-rcl can be easily integrated into React applications and provides a straightforward API for implementing translation checking functionality. The library includes detailed examples (CheckerTN.md and CheckerTW.md) that demonstrate proper configuration and usage.

## Updates

- In version 1.0.0 converted to react 18

## Peer Dependencies

- [Material-UI Versions](https://material-ui.com/versions/)

This package requires @material-ui v4 core, icons, and lab. [Material-UI Installation](https://material-ui.com/getting-started/installation/)

- [Material-UI Styles](https://material-ui.com/styles/basics/)

The CSS Styles implementation uses the updated version and is incompatible with v3.

- [Material-UI Lab](https://material-ui.com/components/about-the-lab/)

A few components use the Lab components such as the Skeleton for the infinite scrolling effect.

## Contributing

Contributions to the checking-tool-rcl are welcome! Whether you're fixing bugs, improving documentation, or proposing new features, your help makes this library better for everyone.

## License

This project is licensed under the terms specified in the LICENSE file in the repository.
