import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScripturePane from '../tc_ui_toolkit/ScripturePane'
import { GroupMenuComponent } from './GroupMenuComponent'
import { findNextCheck, findPreviousCheck } from '../tc_ui_toolkit/helpers/translationHelps/twArticleHelpers'
import { AlignmentHelpers, WordAligner } from '../index'
import {
  addAlignmentsToVerseUSFM,
  findInWordList,
  resetAlignments,
} from '../helpers/alignmentHelpers'
import complexScriptFonts from '../common/complexScriptFonts'
import isEqual from 'deep-equal'
import { getVerseUSFM } from '../helpers/groupDataHelpers'
import MAPControls from './MAPControls'
import { usfmVerseToJson } from '../helpers/usfmHelpers'

const lexiconCache_ = {};
const theme = createTheme(); // Create MUI theme

const localStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    height: '100%',
  },
  groupMenuContainer: {
    width: '250px',
    height: '100%',
  },
  wordListContainer: {
    minWidth: '100px',
    maxWidth: '400px',
    height: '100%',
    display: 'flex',
  },
  alignmentAreaContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: 'calc(100% - 450px)',
    height: '100%',
  },
  scripturePaneWrapper: {
    minHeight: '250px',
    marginBottom: '20px',
    maxHeight: '310px',
  },
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    width: '97vw',
    height: '65vw',
  },
 centerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    overflowX: 'auto',
    marginLeft: '10px',
  },
  scripturePaneDiv: {
    display: 'flex',
    flexShrink: '0',
    height: '250px',
    paddingBottom: '20px',
  },
    alignmentGridWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
    boxSizing: 'border-box',
    margin: '0 10px 6px 10px',
    boxShadow: '0 3px 10px var(--background-color)',
  },
};

//////////////////////////
// TODO: connect up accelerator keys

// let platform = 'null';
// if ('platform' in navigator) {
//   platform = navigator.platform;
//   console.log(`Container: platform detected: ${platform}`, navigator);
// } else {
//   console.log(`Container: navigator does not support platform`, navigator);
// }
//
// // Function to detect the operating system
// const getOS = () => {
//   if (platform.startsWith('Mac')) return 'mac';
//   if (platform.startsWith('Win')) return 'windows';
//   return 'other';
// };
//
// const os = getOS();
// console.log(`Container: os detected ${os}`);
// const isMacOS = (os === 'mac');
//
// // Define key combinations based on the operating system
// const keyMap = {
//   REFRESH: os === 'mac' ? 'command+f' : 'ctrl+f',
//   ACCEPT: os === 'mac' ? 'command+e' : 'ctrl+e',
//   REJECT: os === 'mac' ? 'command+j' : 'ctrl+j',
//   CLEAR: os === 'mac' ? 'command+k' : 'ctrl+k',
//   COMPLETE: os === 'mac' ? 'command+t' : 'ctrl+t',
//   NEXT: os === 'mac' ? 'command+n' : 'ctrl+n',
//   EXPAND: os === 'mac' ? 'command+w' : 'ctrl+w',
// };

/**
 * Checks if the given object is not empty.
 *
 * @param {Object} dataObject - The object to check.
 * @return {boolean} Returns true if the object is not empty, otherwise false.
 */
function notEmptyObject(dataObject) {
  return dataObject && Object.keys(dataObject).length
}

const WordAlignmentTool = ({
  addObjectPropertyToManifest,
  bibles,
  bookName,
  contextId,
  editedTargetVerse,
  gatewayBook,
  getLexiconData,
  groupsData,
  groupsIndex,
  initialSettings,
  lexiconCache = lexiconCache_,
  loadLexiconEntry,
  saveNewAlignments,
  setToolSettings,
  showPopover = null,
  sourceBook,
  sourceLanguage,
  sourceLanguageFont = '',
  sourceFontSizePercent = 100,
  targetBook,
  targetLanguage= {},
  targetLanguageFont = '',
  targetFontSizePercent = 100,
  translate,
  styles: styles_ = {},
  }) => {

  const [currentContextId, setCurrentContextId] = useState(contextId);
  const [alignmentData, _setAlignmentData] = useState({ });
  const [groupsMenuData, setGroupsMenuData] = useState({ });

  function setAlignmentData(alignmentData_) {
    if (!isEqual(alignmentData, alignmentData_)) {
      _setAlignmentData(alignmentData_)
    }
  }

  const {
    paneSettings,
    paneKeySettings,
    toolsSettings,
    manifest
  } = initialSettings
  const {
    targetWords,
    verseAlignments
  } = alignmentData
  const targetDirection = targetLanguage?.direction || 'ltr';
  const readyToDisplayChecker = notEmptyObject(bibles) && notEmptyObject(groupsMenuData.groupsData) && notEmptyObject(sourceBook) && notEmptyObject(targetBook);

  const expandedScripturePaneTitle = bookName;
  const currentSelections = [] // TODO not sure if selections are even used in word Aligner

  /**
   * Updates the alignment data for the specified context ID by processing the target and source verses.
   *
   * @param {Object} _currentContextId - The current context ID containing a reference to the chapter and verse.
   * @return {boolean} Returns true if the alignment data was successfully updated; otherwise, returns false.
   */
  function updateAlignmentData(_currentContextId) {
    const ref = _currentContextId?.reference
    const targetVerseUSFM = getVerseUSFM(targetBook, ref.chapter, ref.verse)
    const sourceVerseUSFM = getVerseUSFM(sourceBook, ref.chapter, ref.verse)
    if (targetVerseUSFM && sourceVerseUSFM) {
      const {
        targetWords,
        verseAlignments
      } = AlignmentHelpers.parseUsfmToWordAlignerData(targetVerseUSFM, sourceVerseUSFM)

      const alignmentComplete = AlignmentHelpers.areAlgnmentsComplete(targetWords, verseAlignments)
      console.log(`Alignments are ${alignmentComplete ? 'COMPLETE!' : 'incomplete'}`)
      setAlignmentData({
        targetWords,
        verseAlignments
      })
      return true
    }
    return false
  }

  useEffect(() => { // detect change of source alignments
    if (!isEqual(currentContextId, contextId)) {
      setCurrentContextId(contextId)
    }

    let foundData = false
    if (readyToDisplayChecker) {
      foundData = updateAlignmentData(contextId)
    }

    if (!foundData) {
      setAlignmentData({})
    }
  }, [readyToDisplayChecker, contextId])

  useEffect(() => { // detect change of source alignments
    if (notEmptyObject(groupsData)) {
      setGroupsMenuData({groupsIndex, groupsData})
    }
  }, [groupsIndex, groupsData])

  /**
   * Persists settings to storage after removing Bible data to reduce size
   * Creates shallow copies to avoid modifying original objects
   * @param {object} _settings - Settings object to save
   * @private
   */
  function _saveSettings(_settings) {
    if (setToolSettings && _settings) {
      const newSettings = { ..._settings }
      delete newSettings.manifest
      const _paneSettings = [ ...newSettings.paneSettings ]
      for (let i = 0; i < _paneSettings.length; i++) {
        const _paneSetting = {..._paneSettings[i]} // shallow copy
        if (_paneSetting?.book) {
          delete _paneSetting.book // remove all the book data before saving
        }
        _paneSettings[i] = _paneSetting
      }
      newSettings.paneSettings = _paneSettings

      const _paneKeySettings = { ...newSettings.paneKeySettings }
      const keys = Object.keys(_paneKeySettings)
      for (const key of keys) {
        const _paneSetting = {..._paneKeySettings[key]} // shallow copy
        if (_paneSetting?.book) {
          delete _paneSetting.book // remove all the book data before saving
        }
        _paneKeySettings[key] = _paneSetting
      }
      newSettings.paneKeySettings = _paneKeySettings

      setToolSettings(newSettings)
    }
  }

  /**
   * Updates settings state and optionally persists them
   * @param {object} newSettings - New settings to merge
   * @param {boolean} doSave - Whether to persist settings
   */
  function setSettings(newSettings, doSave = false) {
    const _settings = {
      ...initialSettings,
      ...newSettings
    }

    doSave && _saveSettings(_settings)
  }

  /**
   * Navigates to the next check in the sequence
   */
  function handleGoToNext() {
    console.log(`handleGoToNext`)
    const nextCheck = findNextCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(nextCheck, true)
  }

  /**
   * Navigates to the previous check in the sequence
   */
  function handleGoToPrevious() {
    console.log(`handleGoToPrevious`)
    const previousCheck = findPreviousCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(previousCheck, true)
  }

  /**
   * Handles changes in alignment data by processing the updated alignments
   * and updating the target verse USFM content. It also determines if the
   * alignments are complete.
   *
   * @param {Object} results - The alignment data containing target words and verse alignments.
   * @param {Array} results.targetWords - The list of target words in the verse.
   * @param {Array} results.verseAlignments - The alignment mappings for the target words.
   * @return {void} This function does not return a value.
   */
  function handleAlignmentChange(results) {
    console.log(`handleAlignmentChange() - alignment changed, results`, results);// merge alignments into target verse and convert to USFM
    const {targetWords, verseAlignments} = results;
    // get initial bible text
    const ref = currentContextId?.reference;
    const targetVerseUSFM_ = getVerseUSFM(targetBook, ref.chapter, ref.verse)
    const verseUsfm = AlignmentHelpers.addAlignmentsToVerseUSFM(targetWords, verseAlignments, targetVerseUSFM_);
    console.log(verseUsfm);
    const alignmentComplete = AlignmentHelpers.areAlgnmentsComplete(targetWords, verseAlignments);
    console.log(`Alignments are ${alignmentComplete ? 'COMPLETE!' : 'incomplete'}`);
    setAlignmentData(results)
  }

  /**
   * Handles the saving of Bible text alignments with updated data.
   *
   * This function prepares the updated aligned verse data in USFM and JSON formats
   * and triggers a save operation using the provided `saveNewAlignments` handler.
   * It uses the current context reference, retrieves the initial Bible text,
   * updates alignments, and formats the aligned verse text appropriately.
   *
   * Dependencies:
   * - Retrieves the initial Bible verse in USFM format using `getVerseUSFM`.
   * - Updates the alignments of the target text using `addAlignmentsToVerseUSFM`.
   * - Converts the updated USFM text into JSON format using `usfmVerseToJson`.
   *
   * Preconditions:
   * - Requires `currentContextId` with a valid `reference` object containing
   *   `chapter` and `verse`.
   * - Expects `saveNewAlignments` to be defined for saving the processed alignments.
   *
   * @function
   * @name handleSaveAlignments
   */
  const handleSaveAlignments = () => {
    console.log( "handleSaveAlignments" );
    const ref = currentContextId?.reference
    // get initial bible text
    const targetVerseUSFM_ = getVerseUSFM(targetBook, ref.chapter, ref.verse)
    // apply new alignments to original verse text
    const targetVerseUSFM = addAlignmentsToVerseUSFM(targetWords, verseAlignments, targetVerseUSFM_);
    const targetVerseJSON = usfmVerseToJson(targetVerseUSFM);
    saveNewAlignments && saveNewAlignments({ contextId: currentContextId,  ...alignmentData, targetVerseUSFM, targetVerseJSON })
  }

  /**
   * Removes all alignments and updates the relevant alignment state and data.
   *
   * This function clears all existing verse alignments and ensures all target words
   * in the word bank are re-enabled if they were disabled due to prior alignments.
   * Updating the state involves the following steps:
   *
   * 1. Iterating through all alignments in the verse and identifying target tokens
   *    that need to be re-enabled in the word bank.
   * 2. Re-enabling the identified target tokens in the target word list.
   * 3. Clearing all alignments by setting `targetNgram` to an empty array and
   *    marking them as no longer suggestions.
   * 4. Updating the alignment data with the new cleared alignments and modified
   *    target word states.
   * 5. Invoking the change callback to notify listeners about the unalignment action.
   *
   * This function is intended to manage the reconciliation of alignment data and
   * ensure that the UI and underlying data align correctly when all alignments
   * are cleared.
   */
  const handleClearAlignments = () => {
    console.log( "handleClearAlignments" );
    const newAlignmentData = alignmentData || {}
    //Make sure all words which were dropped are not disabled in the word list.
    const targetTokensNeedingDisabled = verseAlignments
      //Now reduce to target words.
      .reduce( (acc, alignment) => {
        alignment.targetNgram.forEach( targetToken => {
          acc.push( targetToken );
        });
        return acc;
      },[])
      //now reduce these to target words which are still disabled in the wordbox.
      .filter( targetToken => {
        const found = AlignmentHelpers.findInWordList(targetWords, targetToken);
        if( found < 0 ) return false;
        if( !targetWords[found].disabled ) return false;
        return true;
      });

    //if there are any of the target words needing to be disabled
    if( targetTokensNeedingDisabled.length > 0 ) {
      //Then map through creating new word objects which are disabled if they are in the targetTokensNeedingDisabled list.
      const newTargetWords = targetWords.map( targetWord => {
        if( findInWordList( targetTokensNeedingDisabled, targetWord ) >= 0 ) return { ...targetWord, disabled: false };
        return targetWord;
      });
      newAlignmentData.targetWords = newTargetWords;
    }

    //Drop all target tokens from verseAlignments
    const clearedAlignments = verseAlignments.map( alignment => {
      return {...alignment, isSuggestion: false, targetNgram: []};
    });

    const updatedVerseAlignments = AlignmentHelpers.updateVerseAlignments( clearedAlignments )
    newAlignmentData.verseAlignments = updatedVerseAlignments;

    setAlignmentData(newAlignmentData)

    // doChangeCallback({
    //   type: UNALIGN_TARGET_WORD,
    //   source: GRID,
    //   destination: TARGET_WORD_BANK
    // }, updatedVerseAlignments);
  }

  /**
   * Changes the current check being worked on
   * Validates for unsaved changes before switching
   * @param {object} newContext - New check context
   * @param {boolean} noCheck - Skip validation if true
   */
  const changeCurrentCheck_ = (newContext, noCheck = false) => {
    const newContextId = newContext?.contextId

    if (newContextId) {
      const {
        reference: {
          bookId,
          chapter,
          verse,
        },
        tool,
        groupId,
      } = newContextId;
      const refStr = `${tool} ${groupId} ${bookId} ${chapter}:${verse}`;
      console.info(`changeCurrentCheck_() - setting new contextId to: ${refStr}`);

      setCurrentContextId(newContextId)
      updateAlignmentData(newContextId)
    }
  }

  /**
   * Resets the alignments by invoking the resetAlignments method and updates the alignment data with the reset values.
   *
   * This method logs the reset event, calls the resetAlignments function, and updates the state with the new alignment data.
   *
   * @return {void} No return value.
   */
  function onReset() {
    console.log("onReset() - reset Alignments")
    const alignmentData = resetAlignments.resetAlignments(verseAlignments, targetWords)
    setAlignmentData({
      verseAlignments: alignmentData.verseAlignments,
      targetWords: alignmentData.targetWords,
    })
  }

  const haveVerseData = verseAlignments?.length && targetWords?.length

  const _checkerStyles = {
    ...localStyles.containerDiv,
    ...styles_,
  }

  return (
    <ThemeProvider theme={theme}>
      {readyToDisplayChecker ?
      <div id='checker' style={localStyles.container}>
        <GroupMenuComponent
          bookName={bookName}
          changeCurrentContextId={changeCurrentCheck_}
          contextId={currentContextId}
          direction={targetDirection}
          groupsData={groupsMenuData.groupsData}
          groupsIndex={groupsMenuData.groupsIndex}
          targetLanguageFont={targetLanguageFont}
          translate={translate}
        />
        <div style={localStyles.alignmentAreaContainer}>
          { notEmptyObject(bibles) &&
            <div style={localStyles.scripturePaneDiv}>
              <ScripturePane
                addObjectPropertyToManifest={addObjectPropertyToManifest}
                bibles={bibles}
                complexScriptFonts={complexScriptFonts}
                contextId={currentContextId}
                currentPaneSettings={paneSettings}
                editVerseRef={null}
                editTargetVerse={editedTargetVerse}
                expandedScripturePaneTitle={expandedScripturePaneTitle}
                getAvailableScripturePaneSelections={null}
                getLexiconData={getLexiconData}
                makeSureBiblesLoadedForTool={null}
                projectDetailsReducer={{ manifest }}
                selections={currentSelections}
                setToolSettings={setSettings}
                showPopover={showPopover}
                onExpandedScripturePaneShow={null}
                translate={translate}
              />
            </div>
          }
          <div>
            {haveVerseData ?
              <WordAligner
                contextId={currentContextId}
                getLexiconData={getLexiconData}
                lexiconCache={lexiconCache}
                loadLexiconEntry={loadLexiconEntry}
                onChange={handleAlignmentChange}
                showPopover={showPopover}
                sourceLanguage={sourceLanguage}
                styles={{}}
                targetLanguageFont={targetLanguageFont}
                targetWords={targetWords}
                translate={translate}
                verseAlignments={verseAlignments}
              />
            :
              "no verse data"
            }
            <MAPControls
              disableSuggestions={true}
              hasSuggestions={false}
              onClear={handleClearAlignments}
              onSave={handleSaveAlignments}
              showPopover={showPopover}
              showSaveOptions={true}
              translate={translate}
            />
          </div>
        </div>
      </div>
      :
        'Waiting for Data'
      }
    </ThemeProvider>
  );
};

WordAlignmentTool.propTypes = {
  addObjectPropertyToManifest: PropTypes.func.isRequired,
  bibles: PropTypes.object.isRequired,
  bookName: PropTypes.string.isRequired,
  contextId: PropTypes.object.isRequired,
  editedTargetVerse: PropTypes.func.isRequired,
  gatewayBook: PropTypes.object,
  getLexiconData: PropTypes.func,
  groupData: PropTypes.object,
  groupsIndex: PropTypes.array,
  initialSettings: PropTypes.object.isRequired,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  saveNewAlignments: PropTypes.func,
  saveToolSettings: PropTypes.func.isRequired,
  showPopover: PropTypes.func.isRequired,
  sourceBook: PropTypes.object,
  sourceLanguage: PropTypes.string.isRequired,
  sourceLanguageFont: PropTypes.string,
  sourceFontSizePercent: PropTypes.number,
  styles: PropTypes.object,
  targetBook: PropTypes.object,
  targetFontSizePercent: PropTypes.number,
  targetLanguage: PropTypes.object,
  targetLanguageFont: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

export default WordAlignmentTool;
