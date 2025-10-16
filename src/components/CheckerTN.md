# Translation Notes Checker Example

## Synopsis
This file demonstrates how to set up and use the Translation Notes checking component from the checking-tool-rcl library. It provides a complete, working example of the Checker component configured for the Translation Notes checking workflow.

## Description
The CheckerTN.md file contains a self-contained React application that showcases how to initialize and use the Checker component with Translation Notes data. It demonstrates proper configuration of all required properties, including:

- Loading and setting up sample Bible data (target language, gateway language, and original language)
- Configuring context IDs for verse selection
- Setting up translation helpers and lexicon data
- Implementing callback functions for saving settings and checking data
- Configuring language details and display settings

This example serves as both documentation and a testing sandbox for the Translation Notes checking workflow, allowing developers to understand the component structure and requirements.

## Requirements
- React 18.3.1+
- word-aligner-lib for handling alignment data
- Sample Bible data (target, gateway, and original language)
- Translation Notes data in the correct format
- TranslationAcademy content for reference materials
- Lexicon data for word lookups

## Usage
This example can be viewed in the Styleguidist documentation or copied as a starting point for implementing the Translation Notes checking workflow in a new application.

## Checking Tool Example for Translation Notes:

```js
import React, { useState, useEffect } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker, { translationNotes } from './Checker'
import { lookupTranslationForKey } from '../utils/translations'
import { groupDataHelpers } from 'word-aligner-lib'

// Load sample data from fixtures
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTn = require('../__tests__/fixtures/translationNotes/enTn_1JN.json')
const glTaData = require('../__tests__/fixtures/translationAcademy/en_ta.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
// Extract checking data from the translation notes
const checkingData = groupDataHelpers.extractGroupData(glTn)
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')

// Translation helper function for UI strings
const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

// Callback for when settings are saved
const saveSettings = (settings) => {
  console.log(`saveSettings`, settings)
};

// Callback for when checking data changes
const saveCheckingData = (newState) => {
  const selections = newState && newState.selections
  console.log(`saveCheckingData - new selections`, selections)
  const currentContextId = newState && newState.currentContextId
  console.log(`saveCheckingData - current context data`, currentContextId)
}

// Configuration settings
const showDocument = true // set to false to disable showing ta or tw document
const bookId = "1jn"
const bookName = "1 John"
const targetLanguageId = 'en'
const targetLanguageName = "English"
const targetLanguageDirection = "ltr"
const gatewayLanguageId = "en"
const gatewayLanguageOwner = "unfoldingWord"

// Initial context for checking (verse and word to check)
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

// Target language metadata
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

// Bible data configuration for all languages
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

console.log('CheckerTN.md - startup')

const App = () => {
  // State management for current context
  const [contextId, setCcontextId] = useState(contextId_)

  // Lexicon lookup functions
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
          checkType={translationNotes}
          contextId={contextId}
          getLexiconData={getLexiconData_}
          glWordsData={glTaData}
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
