Checking Tool Example:

```js
import React, { useState, useEffect } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker from './Checker'
import { lookupTranslationForKey } from '../utils/translations'
import { twlTsvToGroupData } from '../helpers/translationHelps/twArticleHelpers'

const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTwlTsv = require('../__tests__/fixtures/translationWords/twl_1JN.tsv.json').data
const glTwData = require('../__tests__/fixtures/translationWords/enTw.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')

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

console.log('Checker.md - startup')

const App = () => {
  const [checkingData, setCheckingData] = useState(null)
  const [contextId, setCcontextId] = useState(contextId_)

  const loadLexiconEntry = (key) => {
    console.log(`loadLexiconEntry(${key})`)
  };
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return { [lexiconId]: { [entryId]: entryData } };
  };

  useEffect(() => {
    twlTsvToGroupData(glTwlTsv, project, ugntBible).then((groupsData) => {
      setCheckingData(groupsData)
    })
  }, [glTwlTsv]);

  return (
    <>
      <div style={{ height: '600px', width: '850px' }}>
        <Checker
          styles={{ maxHeight: '500px', overflowY: 'auto' }}
          translate={translate}
          contextId={contextId}
          checkingData={checkingData}
          glTwData={glTwData}
          alignedGlBible={enGlBible}
        />
      </div>
    </>
  );
};

App();
```
