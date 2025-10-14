# Translation Words Checker Example

## Synopsis
This file provides a complete working example of the Translation Words checking component from the checking-tool-rcl library. It demonstrates the initialization, configuration, and usage of the Checker component specifically for the translationWords workflow.

## Description
The CheckerTW.md file contains a self-contained React application that demonstrates the proper setup and usage of the Checker component with Translation Words data. This example shows:

- How to load and initialize Bible data in multiple languages (target, gateway, and original)
- How to configure the Translation Words checking environment
- How to handle lexicon lookups and word references
- How to manage state and context for the checking process
- How to implement proper callback functions for saving data and settings

This example serves as both documentation and a functional demonstration of the Translation Words checking workflow within the checking-tool-rcl library.

## Requirements
- React 18.3.1+
- word-aligner-lib for processing alignment data
- Sample Bible data (target, gateway, and original language)
- Translation Words data in the expected format
- Lexicon data for word lookups and references

## Usage
This example can be viewed in the Styleguidist documentation or used as a reference for implementing Translation Words checking in a new application.

## Checking Tool Example for Translation Words:

```js
import React, { useState, useEffect } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import Checker, { translationWords } from './Checker'
import { lookupTranslationForKey } from '../utils/translations'
import { groupDataHelpers } from 'word-aligner-lib'

// Load sample data from fixtures for demonstration
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");
const translations = require('../locales/English-en_US.json')
const glTwl = require('../__tests__/fixtures/translationWords/twl_1jn_parsed.json')
const glTwData = require('../__tests__/fixtures/translationWords/en_tw.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
// Extract checking data from translation words list
const checkingData = groupDataHelpers.extractGroupData(glTwl)
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')

// Translation helper function for UI strings
const translate = (key) => {
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

// Callback for saving user settings
const saveSettings = (settings) => {
  console.log(`saveSettings`, settings)
};

// Callback for saving checking progress and data
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
    "groupId": "age", // The translation word category
    "quote": "αἰῶνα", // The word being checked
    "strong": [
      "G01650" // Strong's number for reference
    ],
    "lemma": [
      "αἰών" // The lemma (dictionary form)
    ],
    "occurrence": 1 // Which occurrence in the verse
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

// Bible data configuration for all required languages
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
          checkType={translationWords} // Specify translation words check type
          contextId={contextId}
          getLexiconData={getLexiconData_}
          glWordsData={glTwData} // Translation words data
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
