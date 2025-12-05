Word Aligner Example with Navigation:

```js
import React, { useState } from 'react';
import {
  AlignmentHelpers,
  groupDataHelpers,
  UsfmFileConversionHelpers
} from '../index'
import { NT_ORIG_LANG } from '../common/constants';
import cloneDeep from 'lodash.clonedeep';
import usfmjs from 'usfm-js';
import { lookupTranslationForKey } from '../utils/translations'

const translations = require('../locales/English-en_US.json')
const ugntBook = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBook = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const targetBook = require('../__tests__/fixtures/bibles/1jn/targetBible.json')
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");

console.log("starting WordAlignerWithNavigation demo")

const bookName = 'Titus'
const bookId = 'tit'
const toolName = 'wordAligner'
const gatewayBook = enGlBook;
const sourceBook = ugntBook;

// Bible data configuration for all scripture panes
const bibles = [
  {
    book: targetBook,
    languageId: 'targetLanguage',
    bibleId: 'targetBible',
    owner: 'unfoldingWord'
  },
  {
    book: sourceBook,
    languageId: 'el-x-koine',
    bibleId: 'ugnt',
    owner: 'unfoldingWord'
  },
  {
    book: gatewayBook,
    languageId: 'en',
    bibleId: 'ult',
    owner: 'unfoldingWord'
  },
]

const translate = (key, defaultValue) => {
  // console.log(`translate(${key})`)
  const translation = lookupTranslationForKey(translations, key)
  return translation
};

const { groupsData, groupsIndex} = groupDataHelpers.initializeGroupDataForScripture(bookId, targetBook, toolName, sourceBook, translate)

const App = () => {
  const [toolSettings, _setToolSettings] = useState({}); // TODO: need to persist tools state, and read back state on startup

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

  /**
   * Adds a new key name to the manifest object
   * @param {String} propertyName - key string name.
   * ex.
   * manifest {
   *  ...,
   *  [propertyName]: 'value',
   *  ...
   * }
   * @param {*} value - value to be saved in the propertyName
   */
  function addObjectPropertyToManifest(propertyName, value) {
    console.log(`addObjectPropertyToManifest - ${propertyName} = ${value}`)
    // TODO need to save setting in project manifest
  }

  /**
   * @description helper function that Updates/changes a tools'/modules' settings.
   * @param {string} moduleNamespace - module name that would be saved
   * @param {string} settingsPropertyName - is the property name to be used
   *  to save multiple settings names for a module.
   * @param {object} toolSettingsData - settings data.
   * @return {object} acton object.
   */
  function saveToolSettings(moduleNamespace, settingsPropertyName, toolSettingsData) {
    const _toolSettings = cloneDeep(toolSettings); // close to make new tools state object

    let moduleData = _toolSettings[moduleNamespace]
    if (!moduleData) {
      moduleData = {}
      _toolSettings[moduleNamespace] = moduleData
    }

    moduleData[settingsPropertyName] = toolSettingsData
    _setToolSettings(_toolSettings)
  };

  /**
   * This is called by tool when a verse has been edited. It updates group data reducer for current tool
   * and updates the file system for tools not loaded.
   * This will first do TW selections validation and prompt user if invalidations are found.
   * Then it calls updateVerseEditStatesAndCheckAlignments to save verse edits and then validate alignments.
   * @param {int} chapterWithVerseEdit
   * @param {int|string} verseWithVerseEdit
   * @param {string} before - the verse text before the edit
   * @param {string} after - the verse text after the edit
   * @param {array} tags - an array of tags indicating the reason for the edit
   * @param {string} username - user's name.
   * @param {string} gatewayLanguageCode - gateway Language Code.
   * @param {string} gatewayLanguageQuote - gateway Language quote.
   * @param {string} projectSaveLocation - project path.
   * @param {string} currentToolName - tool name.
   * @param {function} translate - locale function.
   * @param {function} showAlert - showAlert.
   * @param {function} closeAlert - closeAlert.
   * @param {function} showIgnorableAlert - showIgnorableAlert.
   * @param {function} updateTargetVerse - updateTargetVerse.
   * @param {object} toolApi - toolApi.
   */
  const editedTargetVerse = (chapterWithVerseEdit, verseWithVerseEdit, before, after, tags, username, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation, currentToolName, translate, showAlert, closeAlert, showIgnorableAlert, updateTargetVerse, toolApi) => (dispatch, getState) => {
    const state = getState();
    const contextId = getContextId(state);
    const currentCheckContextId = contextId;
    const {
      bookId, chapter: currentCheckChapter, verse: currentCheckVerse,
    } = currentCheckContextId.reference;

    const contextIdWithVerseEdit = {
      ...currentCheckContextId,
      reference: {
        ...currentCheckContextId.reference,
        chapter: chapterWithVerseEdit,
        verse: verseWithVerseEdit,
      },
    };
  };

  return (
    <>
      <div style={{ height: '800px', width: '800px', overflow: 'auto' }}>
        <WordAlignerWithNavigation
          addObjectPropertyToManifest={addObjectPropertyToManifest}
          bibles={bibles}
          bookName={bookName}
          contextId={contextId}
          editedTargetVerse={editedTargetVerse}
          gatewayBook={enGlBook}
          getLexiconData={getLexiconData_}
          groupsData={groupsData}
          groupsIndex={groupsIndex}
          initialSettings={toolSettings}
          lexiconCache={lexicons}
          loadLexiconEntry={loadLexiconEntry}
          onChange={onChange}
          saveToolSettings={saveToolSettings}
          showPopover={showPopover}
          sourceBook={sourceBook}
          sourceLanguage={sourceLanguage}
          styles={{ maxHeight: '450px', overflowY: 'auto' }}
          targetLanguageFont={targetLanguageFont}
          targetBook={targetBook}
          translate={translate}
        />
      </div>
    </>
  );
};

App();
```
