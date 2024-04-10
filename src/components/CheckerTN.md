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
const glTaData = require('../__tests__/fixtures/translationAcademy/enTa_1JN.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const checkingData = extractGroupData(glTn)

const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

var bookId = "1jn"

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

const project = {
  identifier: bookId,
  languageId: 'en'
}

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
      <div style={{ height: '600px', width: '850px' }}>
        <Checker
          styles={{ maxHeight: '500px', overflowY: 'auto' }}
          translate={translate}
          contextId={contextId}
          checkingData={checkingData}
          glWordsData={glTaData}
          alignedGlBible={enGlBible}
          checkType={translationNotes}
        />
      </div>
    </>
  );
};

App();
```
