# CheckArea.md

## Synopsis
This file contains example code showing how to use the CheckAreaWrapper component for Bible translation checking. It demonstrates the minimal setup needed to render a functional CheckArea component in a standalone environment.

## Description
The CheckArea component is a central part of the checking-tool-rcl library that displays the current verse being checked and allows users to:
- View verse text in various Bible translations
- Make and review text selections
- Add comments to verses
- Edit verse content
- Mark selections as invalid
- Toggle "nothing to select" state

This example renders a CheckAreaWrapper with minimal props for demonstration purposes. In a real application, the CheckArea would be part of a more complex workflow involving:
- Context data about the current verse/check
- Various Bible translations
- Selection management
- User comments and annotations
- Mode switching (select, edit, comment)

## Requirements
- React 18.3.1+
- Access to lexicon data (demonstrated with mock data)
- A translation function for UI strings
- CSS styling for proper display

---

CheckArea Example:

```js

import React, { useState } from 'react';
import { NT_ORIG_LANG } from '../common/constants';
import CheckAreaWrapper from './CheckAreaWrapper'

// Mock lexicon data for the example
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");

// Simple translation function that logs the key and returns a formatted string
const translate = (key) => {
  console.log(`translate(${key})`)
  return `key-(${key})`
};

console.log('CheckArea.md - startup')

const App = () => {
  // Mock function for loading lexicon entries - logs the requested key
  const loadLexiconEntry = (key) => {
    console.log(`loadLexiconEntry(${key})`)
  };

  // Mock function to retrieve lexicon data for specified lexicon and entry IDs
  // Returns data in the format expected by the component
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return { [lexiconId]: { [entryId]: entryData } };
  };


  return (
    <>
      <div style={{ height: '650px', width: '800px' }}>
        {/*
         * Render the CheckAreaWrapper with minimal props:
         * - styles: Container styling with height constraints and scroll behavior
         * - translate: Function for translating UI strings
         *
         * In a real application, many more props would be provided:
         * - contextId: Current verse reference and check info
         * - selections: Current text selections
         * - verseText: The verse being checked
         * - alignedGLText: Gateway language aligned text
         * - mode: Current mode (select, edit, comment)
         * - handlers for various user interactions
         */}
        <CheckAreaWrapper
          styles={{ maxHeight: '450px', overflowY: 'auto' }}
          translate={translate}
        />
      </div>
    </>
  );
};

App();
```
