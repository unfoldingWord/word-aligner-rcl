Checking Tool Example:

```js
import React, { useState, useEffect } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker, { translationNotes } from './Checker'
import { lookupTranslationForKey } from '../utils/translations'
import { extractGroupData } from '../helpers/translationHelps/twArticleHelpers'

const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTn = require('../__tests__/fixtures/translationNotes/enTn_1JN.json')
const glTaData = require('../__tests__/fixtures/translationAcademy/en_ta.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const checkingData = extractGroupData(glTn)
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')

const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

const saveSelection = (newState) => {
  const selections = newState && newState.selections
  console.log(`saveSelection - new selections`, selections)
  const currentContextId = newState && newState.currentContextId
  console.log(`saveSelection - current context data`, currentContextId)
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

const bibles = [
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

console.log('CheckerTN.md - startup')

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
      <div style={{ height: '600px', width: '850px' }}>
        <Checker
          styles={{ maxHeight: '500px', overflowY: 'auto' }}
          alignedGlBible={enGlBible}
          bibles={bibles}
          checkingData={checkingData}
          checkType={translationNotes}
          contextId={contextId}
          getLexiconData={getLexiconData_}
          glWordsData={glTaData}
          saveSelection={saveSelection}
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
