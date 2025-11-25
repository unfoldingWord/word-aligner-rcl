import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'deep-equal'
import {OT_ORIG_LANG} from "../common/constants";
import delay from "../utils/delay";
import * as types from '../common/WordCardTypes';
import ScripturePane from '../tc_ui_toolkit/ScripturePane'
import { GroupMenuComponent } from './GroupMenuComponent'

const lexiconCache_ = {};
const styles = {
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

const WordAlignerWithNavigation = ({
  contextId,
  getLexiconData,
  lexiconCache = lexiconCache_,
  loadLexiconEntry,
  onChange,
  showPopover = null,
  sourceLanguage,
  sourceLanguageFont = '',
  sourceFontSizePercent = 100,
  targetLanguage= {},
  targetLanguageFont = '',
  targetFontSizePercent = 100,
  translate,
  verseAlignments,
  targetWords,
  styles: styles_ = {},
  }) => {

  const readyToDisplayChecker = true;
  const styleProps = styles || {}
  const _checkerStyles = {
    ...styles.containerDiv,
    ...styleProps,
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
    console.log(`${name}-changeCurrentContextId`, newContextId)

    const selectionsUnchanged = isEqual(currentSelections, tempSelections)
    if (noCheck || selectionsUnchanged) {
      if (newContextId) {
        let check = findCheck(groupsData, newContextId, false)
        updateContext(newContext)
        if (check) {
          setLocalCheckingData(null)
          setTempCheckingData(null)
          updateModeForSelections(check.selections, check.nothingToSelect)
        }
      }
    } else {
      console.log('Checker.changeCurrentContextId - unsaved changes')
    }
    changedCurrentCheck && changedCurrentCheck(newContext)
  }

  return (
    readyToDisplayChecker ?
      <div id='checker' style={_checkerStyles}>
        <GroupMenuComponent
          bookName={bookName}
          changeCurrentContextId={changeCurrentCheck_}
          contextId={currentContextId}
          direction={direction}
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
                editTargetVerse={editTargetVerse}
                expandedScripturePaneTitle={expandedScripturePaneTitle}
                getAvailableScripturePaneSelections={null}
                getLexiconData={getLexiconData_}
                makeSureBiblesLoadedForTool={null}
                projectDetailsReducer={{ manifest }}
                selections={currentSelections}
                setToolSettings={setToolSettingsScripture}
                showPopover={showPopover}
                onExpandedScripturePaneShow={null}
                translate={translate}
              />
            </div>
          }
          <div>
            <WordAligner
              styles={styles}
              verseAlignments={verseAlignments}
              targetWords={targetWords}
              translate={translate}
              contextId={contextId}
              targetLanguageFont={targetLanguageFont}
              sourceLanguage={sourceLanguage}
              showPopover={showPopover}
              lexicons={lexicons}
              loadLexiconEntry={loadLexiconEntry}
              onChange={onChange}
              getLexiconData={getLexiconData}
              resetAlignments={resetAlignments}
            />
          </div>
        </div>
        { popoverProps?.popoverVisibility &&
          <PopoverContainer {...popoverProps} />
        }
      </div>
      :
      'Waiting for Data'
  );
};

WordAlignerWithNavigation.propTypes = {
  contextId: PropTypes.object.isRequired,
  getLexiconData: PropTypes.func,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showPopover: PropTypes.func.isRequired,
  sourceLanguage: PropTypes.string.isRequired,
  sourceLanguageFont: PropTypes.string,
  sourceFontSizePercent: PropTypes.number,
  styles: PropTypes.object,
  targetLanguageFont: PropTypes.string,
  targetFontSizePercent: PropTypes.number,
  translate: PropTypes.func.isRequired,
  verseAlignments: PropTypes.array.isRequired,
  targetWords: PropTypes.array.isRequired,
};
export default WordAlignerWithNavigation;
