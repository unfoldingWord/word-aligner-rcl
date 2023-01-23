# wordAlignment

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/57413041-9de1-4d67-969e-3d5a2cd4225c/deploy-status)](https://app.netlify.com/sites/translation-helps-rcl/deploys)
[![CI Status](https://github.com/unfoldingWord/translation-helps-rcl/workflows/CI/badge.svg)](https://github.com/unfoldingWord/translation-helps-rcl/actions)
[![Current Verison](https://img.shields.io/github/tag/unfoldingWord/translation-helps-rcl.svg)](https://github.com/unfoldingWord/translation-helps-rcl/tags)
[![View this project on NPM](https://img.shields.io/npm/v/translation-helps-rcl)](https://www.npmjs.com/package/translation-helps-rcl)
[![Coverage Status](https://coveralls.io/repos/github/unfoldingWord/translation-helps-rcl/badge.svg?branch=main)](https://coveralls.io/github/unfoldingWord/translation-helps-rcl?branch=main)

A React Component Library for rendering and editing scripture translation resources.

## Peer Dependencies

- [Material-UI Versions](https://material-ui.com/versions/)

Word alignment tool for [translationCore].

## Usage

First, install the package using npm:

```js
  npm install word-aligner-rcl --save
```

Then, require the package and use it like so:

```js
import { CheckInfoCard } from 'tc-ui-toolkit';

class App extends Component {
  render() {
    return (
      <CheckInfoCard />
    )
    ;
  }
}
```

## Contributing

### Environment setup

- Run `npm run setup`

  or
- `npm i`
- `npm run build`
- `npm link` or `sudo npm link`
- `cd word-aligner-rcl-test`
- `npm i`
- `npm link word-aligner-rcl`

## Git Branch Management

Note:

- I am using the feature branch named `my-feature-branch` which is a branch you would have created on the `unfoldingWord/word-aligner-rcl` repo for your feature implementation.
- You do not have to do anything different if your changes are reflected in a translationCore tool. Because the tool will get its `node_modules` from translationCore during runtime.

1. Checkout the master branch for `word-aligner-rcl`(pull latest), create/checkout your branch called `my-feature-branch`.
2. Implement your feature on `my-feature-branch` and test it in the `word-aligner-rcl-test` app (That workflow is outlined below)
3. Push your changes from `my-feature-branch` to the `word-aligner-rcl` origin
4. Once you are ready to test your app on the translationCore repo run `npm i unfoldingWord/word-aligner-rcl#my-feature-branch` in your translationCore root directory
    - This will give you the changes you made on `word-aligner-rcl/my-feature-branch` without having to do a premature `npm publish`
5. Ensure all changes work as expected on translationCore branch.
    - Note the workflow to make more changes from your `my-feature-branch` and test them on translationCore is to simply repeat step 3, and then run `rm -rf node_modules/word-aligner-rcl; npm i word-aligner-rcl;` in the translationCore root directory. This will give you the pushed changes without having to re-install all the `node_modules`
6. When the feature you implemented is ready and all tests are passing then you are ready for PRs.
7. **run `npm uninstall word-aligner-rcl; npm i word-aligner-rcl;`** in the translationCore root directory
   - This will ensure that you do not have the word-aligner-rcl branch as a npm version. That was merely for testing, not production.
8. Make a PR on the `unfoldingWord/word-aligner-rcl` repo with your feature implementation `my-feature-branch`
9. After the feature branch on word-aligner-rcl gets merged make a PR on the `translationCore` repo with a new branch that includes the latest `word-aligner-rcl` version
    - Note: up until now you did not have to push any changes to a branch for the `word-aligner-rcl` feature implementation. At this point you will have to do so in order to see changes you made in `my-feature-branch`, reflected in translationCore.
10. Once the PR has been merged, verify the fix from `my-feature-branch` is still working.

## Publish Workflow

1. Review and test PR
2. If requirements are met merge it
3. Checkout to `master` branch
4. run `git pull`
5. Bump package version number
   - Usually will usually be a minor version check for me https://docs.npmjs.com/cli/version
6. `npm i`
7. `npm publish`
8. `git push`

## Component Development

`word-aligner-rcl` components should be developed inside their own folder in the `src` folder.

Use the `CheckInfoCard` component as a guide to develop your own `tc-ui-toolkit` components.

#### Commands to get your development rolling

- Terminal 1
  - In the root directory of `word-aligner-rcl`
    - `npm start` so that webpack watches your changes and reloads (Live hot reloading).
      or
    - `npm build src` to build your components code without watching for changes.
- Terminal 2
  - In the `word-aligner-rcl-test` directory (To render the component in the browser)
    - cd to `word-aligner-rcl-test`
    - run `npm start`
    - Then the `word-aligner-rcl-test` app should open in your default browser.

#### Directory & file structure (Root directory of components within `word-aligner-rcl`)

```js
src
│  index.js
│  index.test.js
│
└───CheckInforCard
│   │   CheckInfoCard.js
│   │   CheckInfoCard.test.js
│   │   CheckInfoCard.styles.css
│   │   index.js
│   │   ...
│
└───ComponentName
│   │   ComponentName.js
│   │   ComponentName.test.js
│   │   ComponentName.styles.css
│   │   index.js
│   │   ...
│   └───SubComponentName
│   │    │   ComponentName.test.js
│   │    │   ComponentName.styles.css
│   │    │   index.js
│   │    │   ...
│   └───SubComponentName
│       │   ComponentName.test.js
│       │   ComponentName.styles.css
│       │   index.js
│       │   ...
│
└───ComponentName
    │   ComponentName.js
    │   ComponentName.test.js
    │   ComponentName.styles.css
    │   index.js
    │   ...
```

#### Rendering your Component UI in the browser

- To render your Component UI in the browser edit the `App.js` file inside the `src` folder in `word-aligner-rcl-test` by including/importing the component as follow:

```js
import { CheckInfoCard } from 'tc-ui-toolkit';
```

If you want to add additional components then import them as follow:

```js
import { CheckInfoCard, OtherComponentName } from 'tc-ui-toolkit';
```

Then use the UI component as follow:

```js
class App extends Component {
  render() {
    return (
      <div style={{ padding: '10px' }}>
        <CheckInfoCard
          title="save, saves, saved, safe, salvation"
          phrase='The term "save" refers to keeping someone from experiencing something bad or harmful. To "be safe" means to be protected from harm or danger.'
          seeMoreLabel="See More"
          showSeeMoreButton={false}
          onSeeMoreClick={() => console.log('clicked')}
        />
      </div>
    );
  }
}
```

References:

- <https://medium.com/@BrodaNoel/how-to-create-a-react-component-and-publish-it-in-npm-668ad7d363ce>
- <https://codeburst.io/how-to-create-and-publish-your-first-node-js-module-444e7585b738>

For `material-ui-next` related questions go to the [material-ui-next website](https://material-ui-next.com/)
