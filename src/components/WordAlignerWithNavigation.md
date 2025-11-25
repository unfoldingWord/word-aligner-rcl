Word Aligner Example with Navigation:

```js
import React, { useState } from 'react';
import {
  AlignmentHelpers,
  groupDataHelpers,
  UsfmFileConversionHelpers
} from "../index"
import { NT_ORIG_LANG } from "../common/constants";

const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");

console.log("starting WordAlignerWithNavigation demo")

const bookName = 'Titus'

// Bible data configuration for all scripture panes
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

const translate = (key) => {
  console.log(`translate(${key})`)
};

const groupsData = groupDataHelpers.generateChapterGroupData(bookId, targetBible, toolName)
const groupsIndex = groupDataHelpers.generateChapterGroupIndex(translate, Object.keys(groupsData).length);

const targetVerseUSFM = alignedVerseJson.usfm;
const sourceVerseUSFM = originalVerseJson.usfm;

const {
  targetWords: targetWords_,
  verseAlignments: verseAlignments_
} = AlignmentHelpers.parseUsfmToWordAlignerData(targetVerseUSFM, sourceVerseUSFM);

const alignmentComplete = AlignmentHelpers.areAlgnmentsComplete(targetWords_, verseAlignments_);
console.log(`Alignments are ${alignmentComplete ? 'COMPLETE!' : 'incomplete'}`);

const App = () => {
  const [state, setState] = useState({ targetWords: targetWords_, verseAlignments: verseAlignments_ });
  const { targetWords, verseAlignments } = state;

  const targetLanguageFont = '';
  const sourceLanguage = NT_ORIG_LANG;
  const lexicons = {};
  const contextId = {
    "reference": {
      "bookId": "tit",
      "chapter": 1,
      "verse": 1
    },
    "tool": "wordAlignment",
    "groupId": "chapter_1"
  };

  const showPopover = (PopoverTitle, wordDetails, positionCoord, rawData) => {
    console.log(`showPopover()`, rawData)
    window.prompt(`User clicked on ${JSON.stringify(rawData)}`)
  };
  const loadLexiconEntry = (lexiconId) => {
    console.log(`loadLexiconEntry(${lexiconId})`)
    return LexiconData
  };
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return { [lexiconId]: { [entryId]: entryData } };
  };

  function onChange(results) {
    console.log(`WordAligner() - alignment changed, results`, results);// merge alignments into target verse and convert to USFM
    const { targetWords, verseAlignments } = results;
    const verseUsfm = AlignmentHelpers.addAlignmentsToVerseUSFM(targetWords, verseAlignments, targetVerseUSFM);
    console.log(verseUsfm);
    const alignmentComplete = AlignmentHelpers.areAlgnmentsComplete(targetWords, verseAlignments);
    console.log(`Alignments are ${alignmentComplete ? 'COMPLETE!' : 'incomplete'}`);
  }

  function onReset() {
    console.log("WordAligner() - reset Alignments")
    const alignmentData = resetAlignments.resetAlignments(verseAlignments, targetWords)
    setState({
      verseAlignments: alignmentData.verseAlignments,
      targetWords: alignmentData.targetWords,
    })
  }

  return (
    <>
      <div>
        <button
          style={{ margin: '10px' }}
          onClick={onReset}
        >
          {"Reset Alignments"}
        </button>
      </div>
      <div style={{ height: '650px', width: '800px' }}>
        <WordAlignerWithNavigation
          bibles={bibles}
          bookName={bookName}
          contextId={contextId}
          getLexiconData={getLexiconData_}
          groupsData={groupsData}
          groupsIndex={groupsIndex}
          lexicons={lexicons}
          loadLexiconEntry={loadLexiconEntry}
          onChange={onChange}
          showPopover={showPopover}
          sourceLanguage={sourceLanguage}
          styles={{ maxHeight: '450px', overflowY: 'auto' }}
          targetLanguageFont={targetLanguageFont}
          targetWords={targetWords}
          translate={translate}
          verseAlignments={verseAlignments}
        />
      </div>
    </>
  );
};

App();
```
