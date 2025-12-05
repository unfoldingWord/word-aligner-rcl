import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScripturePane from '../tc_ui_toolkit/ScripturePane'
import { GroupMenuComponent } from './GroupMenuComponent'
import { findNextCheck, findPreviousCheck } from '../tc_ui_toolkit/helpers/translationHelps/twArticleHelpers'
import { AlignmentHelpers, WordAligner } from '../index'
import {resetAlignments} from "../helpers/alignmentHelpers";
import complexScriptFonts from '../common/complexScriptFonts'
import isEqual from 'deep-equal'
import { getVerseUSFM } from '../helpers/groupDataHelpers'

const lexiconCache_ = {};
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
    width: 'calc(100vw - 650px)',
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

let platform = 'null';
if ('platform' in navigator) {
  platform = navigator.platform;
  console.log(`Container: platform detected: ${platform}`, navigator);
} else {
  console.log(`Container: navigator does not support platform`, navigator);
}

// Function to detect the operating system
const getOS = () => {
  if (platform.startsWith('Mac')) return 'mac';
  if (platform.startsWith('Win')) return 'windows';
  return 'other';
};

const os = getOS();
console.log(`Container: os detected ${os}`);
const isMacOS = (os === 'mac');

// Define key combinations based on the operating system
const keyMap = {
  REFRESH: os === 'mac' ? 'command+f' : 'ctrl+f',
  ACCEPT: os === 'mac' ? 'command+e' : 'ctrl+e',
  REJECT: os === 'mac' ? 'command+j' : 'ctrl+j',
  CLEAR: os === 'mac' ? 'command+k' : 'ctrl+k',
  COMPLETE: os === 'mac' ? 'command+t' : 'ctrl+t',
  NEXT: os === 'mac' ? 'command+n' : 'ctrl+n',
  EXPAND: os === 'mac' ? 'command+w' : 'ctrl+w',
};

/**
 * Checks if the given object is not empty.
 *
 * @param {Object} dataObject - The object to check.
 * @return {boolean} Returns true if the object is not empty, otherwise false.
 */
function notEmptyObject(dataObject) {
  return dataObject && Object.keys(dataObject).length
}

const WordAlignerWithNavigation = ({
  addObjectPropertyToManifest,
  bibles,
  bookName,
  contextId,
  editedTargetVerse,
  gatewayBook,
  getLexiconData,
  initialSettings,
  lexiconCache = lexiconCache_,
  loadLexiconEntry,
  onChange,
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
  const [alignmentData, setAlignmentData] = useState({ });

  // Main settings state - includes pane configuration, tool settings, and manifest data
  const [settings, _setSettings] = useState({
    paneSettings: [],
    paneKeySettings: {},
    toolsSettings: {},
    manifest: {}
  })
  const {
    paneSettings,
    paneKeySettings,
    toolsSettings,
    manifest
  } = settings
  const {
    targetWords,
    verseAlignments
  } = alignmentData
  const targetDirection = targetLanguage?.direction || 'ltr';
  const readyToDisplayChecker = bibles?.length && notEmptyObject(groupsData) && notEmptyObject(sourceBook) && notEmptyObject(targetBook);
  const styleProps = localStyles || {}
  const _checkerStyles = {
    ...localStyles.containerDiv,
    ...styleProps,
  }
  const expandedScripturePaneTitle = bookName;

  const currentSelections = [] // TODO not sure if selections are even used in word Aligner

  function updateAlignmentData(_currentContextId) {
    let targetVerse
    let sourceVerse
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
  }, [readyToDisplayChecker, contextId, group])

  /**
   * Persists settings to storage after removing Bible data to reduce size
   * Creates shallow copies to avoid modifying original objects
   * @param {object} _settings - Settings object to save
   * @private
   */
  function _saveSettings(_settings) {
    if (saveSettings && _settings) {
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

      saveSettings(newSettings)
    }
  }

  /**
   * Updates settings state and optionally persists them
   * @param {object} newSettings - New settings to merge
   * @param {boolean} doSave - Whether to persist settings
   */
  function setSettings(newSettings, doSave = false) {
    const _settings = {
      ...settings,
      ...newSettings
    }

    _setSettings(_settings)
    doSave && _saveSettings(_settings)
  }

  /**
   * Navigates to the next check in the sequence
   */
  function handleGoToNext() {
    console.log(`${name}-handleGoToNext`)
    const nextCheck = findNextCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(nextCheck, true)
  }

  /**
   * Navigates to the previous check in the sequence
   */
  function handleGoToPrevious() {
    console.log(`${name}-handleGoToPrevious`)
    const previousCheck = findPreviousCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(previousCheck, true)
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

  function onReset() {
    console.log("onReset() - reset Alignments")
    const alignmentData = resetAlignments.resetAlignments(verseAlignments, targetWords)
    setState({
      verseAlignments: alignmentData.verseAlignments,
      targetWords: alignmentData.targetWords,
    })
  }

  const theme = createTheme(); // Create MUI theme
  const haveVerseData = verseAlignments?.length && targetWords?.length

  return (
    <ThemeProvider theme={theme}>
      {readyToDisplayChecker ?
      <div id='checker' style={_checkerStyles}>
        <GroupMenuComponent
          bookName={bookName}
          changeCurrentContextId={changeCurrentCheck_}
          contextId={currentContextId}
          direction={targetDirection}
          groupsData={groupsData}
          groupsIndex={groupsIndex}
          targetLanguageFont={targetLanguageFont}
          translate={translate}
        />
        <div style={localStyles.centerDiv}>
          { bibles && Object.keys(bibles).length &&
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
                setToolSettings={setToolSettings}
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
                onChange={onChange}
                resetAlignments={resetAlignments}
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
          </div>
        </div>
      </div>
      :
        'Waiting for Data'
      }
    </ThemeProvider>
  );
};

WordAlignerWithNavigation.propTypes = {
  addObjectPropertyToManifest: PropTypes.func.isRequired,
  bibles: PropTypes.array.isRequired,
  bookName: PropTypes.string.isRequired,
  contextId: PropTypes.object.isRequired,
  editedTargetVerse: PropTypes.func.isRequired,
  gatewayBook: PropTypes.object,
  getLexiconData: PropTypes.func,
  initialSettings: PropTypes.object.isRequired,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  onChange: PropTypes.func,
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

export default WordAlignerWithNavigation;
