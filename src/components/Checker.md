Checking Tool Example:

```js
import React, { useState } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker from './Checker'

import { lookupTranslationForKey } from '../utils/translations'
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTwlTsv = require('../__tests__/fixtures/translationWords/twl_1JN.tsv.json').data
const glTwData = require('../__tests__/fixtures/translationWords/enTw.json')

const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

const contextId =
  {
    "reference": {
      "bookId": "1jn",
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


console.log('Checker.md - startup')

const App = () => {
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
      <div style={{ height: '650px', width: '800px' }}>
        <Checker
          styles={{ maxHeight: '450px', overflowY: 'auto' }}
          translate={translate}
          contextId={contextId}
          glTwlTsv={glTwlTsv}
          glTwData={glTwData}
        />
      </div>
    </>
  );
};

App();
```
