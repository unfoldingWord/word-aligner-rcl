Word Aligner Example with Verse Navigation and Scriptures Pane:

```js
import React, { useState } from 'react';
import {
  AlignmentHelpers,
  groupDataHelpers,
  UsfmFileConversionHelpers,
  verseHelpers,
  WordAlignmentTool,
} from '../index'
import { NT_ORIG_LANG, FINISHED_KEY } from '../common/constants';
import cloneDeep from 'lodash.clonedeep';
import usfmjs from 'usfm-js';
import { lookupTranslationForKey } from '../utils/translations'

const translations = require('../locales/English-en_US.json')
const ugntBook = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const enGlBook = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const targetBook = require('../__tests__/fixtures/bibles/1jn/targetBible.json')
const LexiconData = require("../__tests__/fixtures/lexicon/lexicons.json");

console.log("starting WordAlignmentTool demo")

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

const {
  groupsData,
  groupsIndex
} = groupDataHelpers.initializeGroupDataForScripture(bookId, targetBook, toolName, sourceBook, translate)
const item = groupDataHelpers.findVerseInRefGroupData(groupsData, groupsIndex, 1, 4)
if (item) {
  item[FINISHED_KEY] = false
}
for (let verse = 1; verse < 25; verse++) {
  const item = groupDataHelpers.findVerseInRefGroupData(groupsData, groupsIndex, 2, verse)
  if (item) {
    item[FINISHED_KEY] = false
  }
}

const initialTooleSettings = {
  paneSettings: bibles.map(bible => ({
    bibleId: bible.bibleId,
    font: null,
    fontSize: 100,
    languageId: bible.languageId,
    owner: bible.owner,
    actualLanguage: false,
    isPreRelease: false,
  })),
  paneKeySettings: {},
  toolsSettings: {},
  manifest: {}
}

//convert list to bibleObjects used by aligner
const biblesObject = verseHelpers.getBibleObject(bibles)

const App = () => {
  const [toolSettings, _setToolSettings] = useState(initialTooleSettings); // TODO: need to persist tools state, and read back state on startup

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


  /**
   * Displays a popover with word details when a user clicks on a word
   * @param {Component} PopoverTitle - The component to use as the popover title
   * @param {Object} wordDetails - Details about the clicked word
   * @param {Object} positionCoord - Coordinates for positioning the popover
   * @param {Object} rawData - Raw data about the clicked word
   */
  const showPopover = (PopoverTitle, wordDetails, positionCoord, rawData) => {
    console.log(`showPopover()`, rawData)
    window.prompt(`User clicked on ${JSON.stringify(rawData)}`)
  };

  /**
   * Loads lexicon data for a specified lexicon ID
   * @param {string} lexiconId - The ID of the lexicon to load
   * @returns {Object} The loaded lexicon data
   */
  const loadLexiconEntry = (lexiconId) => {
    console.log(`loadLexiconEntry(${lexiconId})`)
    return LexiconData
  };

  /**
   * Retrieves specific lexicon data for a given lexicon ID and entry ID
   * @param {string} lexiconId - The ID of the lexicon
   * @param {string} entryId - The ID of the specific entry within the lexicon
   * @returns {Object} An object containing the requested lexicon entry data
   */
  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`loadLexiconEntry(${lexiconId}, ${entryId})`)
    const entryData = (LexiconData && LexiconData[lexiconId]) ? LexiconData[lexiconId][entryId] : null;
    return { [lexiconId]: { [entryId]: entryData } };
  };

  /**
   * Saves new alignments to the target book
   * @param {Object} results - The alignment results to save
   * @param {Object} results.contextId - Context information including reference
   * @param {Array} results.targetVerseJSON - The verse data with updated alignments
   */
  function saveNewAlignments(results) {
    const { contextId, targetVerseJSON } = results;
    console.log(`WordAlignmentTool.saveNewAlignments() - alignment changed for `, contextId);// merge alignments into target verse and convert to USFM
    const ref = contextId.reference
    if (targetBook) {
      const targetChapter = targetBook[ref.chapter]
      if (targetChapter) {
        const targetVerse = targetChapter[ref.verse]
        if (targetVerse) {
          const newChapter = { ...targetChapter }
          newChapter[ref.verse] = { verseObjects: targetVerseJSON } // replace with new verse
          targetBook[ref.chapter] = newChapter
        } else {
          console.error(`Invalid verse '${ref.chapter}:${ref.verse}'`)
        }
      } else {
        console.error(`Invalid chapter  '${ref.chapter}'`)
      }
    } else {
      console.error(`Missing book`, results)
    }
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
    if (!isEqual(toolSettings, _toolSettings)) {
      console.log(`new toolSettings`, _toolSettings)
      _setToolSettings(_toolSettings)
    }
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
      <div style={{ width: '1024px', overflow: 'auto' }}>
        <WordAlignmentTool
          addObjectPropertyToManifest={addObjectPropertyToManifest}
          bibles={biblesObject}
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
          saveNewAlignments={saveNewAlignments}
          saveToolSettings={saveToolSettings}
          showPopover={showPopover}
          sourceBook={sourceBook}
          sourceLanguage={sourceLanguage}
          styles={{ maxHeight: '800px', overflowY: 'auto' }}
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
