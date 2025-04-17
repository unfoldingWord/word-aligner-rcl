Checking Tool Example:

```js
import React, { useState, useEffect } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker, { translationWords } from './Checker'
import { lookupTranslationForKey } from '../utils/translations'
import { groupDataHelpers } from 'word-aligner-lib'

const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTwl = require('../__tests__/fixtures/translationWords/twl_1jn_parsed.json')
const glTwData = require('../__tests__/fixtures/translationWords/en_tw.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const checkingData = groupDataHelpers.extractGroupData(glTwl)
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')

const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

const saveSettings = (settings) => {
  console.log(`saveSettings`, settings)
};

const saveCheckingData = (newState) => {
  const selections = newState && newState.selections
  console.log(`saveCheckingData - new selections`, selections)
  const currentContextId = newState && newState.currentContextId
  console.log(`saveCheckingData - current context data`, currentContextId)
}

const showDocument = true // set to false to disable showing ta or tw document
const bookId = "1jn"
const bookName = "1 John"
const targetLanguageId = 'en'
const targetLanguageName = "English"
const targetLanguageDirection = "ltr"
const gatewayLanguageId = "en"
const gatewayLanguageOwner = "unfoldingWord"

const contextId_ =
  {
    "reference": {
      "bookId": bookId,
      "chapter": 2,
      "verse": 17
    },
    "tool": "translationWords",
    "groupId": "age",
    "quote": "αἰῶνα",
    "strong": [
      "G01650"
    ],
    "lemma": [
      "αἰών"
    ],
    "occurrence": 1
  }

const targetLanguageDetails = {
  id: targetLanguageId,
  name: targetLanguageName,
  direction: targetLanguageDirection,
  gatewayLanguageId,
  gatewayLanguageOwner,
  book: {
    id: bookId,
    name: bookName
  }
}

const bibles = [
  {
    book: targetBible,
    languageId: 'targetLanguage',
    bibleId: 'targetBible',
    owner: 'unfoldingWord'
  },
  {
    book: enGlBible,
    languageId: 'en',
    bibleId: 'ult',
    owner: 'unfoldingWord'
  },
  {
    book: ugntBible,
    languageId: 'el-x-koine',
    bibleId: 'ugnt',
    owner: 'unfoldingWord'
  }
]

console.log('CheckerTW.md - startup')

const App = () => {
  const [contextId, setCcontextId] = useState(contextId_)

  const loadLexiconEntry = (key) => {
    console.log(`loadLexiconEntry(${key})`)
  };
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return { [lexiconId]: { [entryId]: entryData } };
  };

  return (
    <>
      <div style={{ height: '600px', width: '1200px' }}>
        <Checker
          styles={{ width: '100%', height: '100%', overflowX: 'auto', overflowY: 'auto' }}
          alignedGlBible={enGlBible}
          bibles={bibles}
          checkingData={checkingData}
          checkType={translationWords}
          contextId={contextId}
          getLexiconData={getLexiconData_}
          glWordsData={glTwData}
          saveCheckingData={saveCheckingData}
          saveSettings={saveSettings}
          showDocument={showDocument}
          targetBible={targetBible}
          targetLanguageDetails={targetLanguageDetails}
          translate={translate}
        />
      </div>
    </>
  );
};

App();
```
