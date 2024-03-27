Checking Tool Example:

```js
import React, {useState} from 'react';
import {NT_ORIG_LANG} from "../common/constants";

const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");

const translate = (key) => {
  console.log(`translate(${key})`)
  return `key-(${key})`
};


const App = () => {
  const loadLexiconEntry = (key) => {
    console.log(`loadLexiconEntry(${key})`)
  };
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return {[lexiconId]: {[entryId]: entryData}};
  };


  return (
    <>
      <div style={{height: '650px', width: '800px'}}>
          <Checker
            styles={{ maxHeight: '450px', overflowY: 'auto' }}
            translate={translate}
          />
        </div>
    </>
  );
};

App();
```
