import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'
import CheckArea from '../tc_ui_toolkit/VerseCheck/CheckArea'
import ActionsArea from '../tc_ui_toolkit/VerseCheck/ActionsArea'
import GroupMenuComponent from './GroupMenuComponent'
import { getBestVerseFromBook } from '../helpers/verseHelpers'
import { removeUsfmMarkers } from '../utils/usfmHelpers'
import isEqual from 'deep-equal'
import {
  findCheck,
  findFirstCheck,
  findNextCheck,
  flattenGroupData,
  getAlignedGLText,
  getPhraseFromTw,
  getTitleFromIndex,
  parseTwToIndex
} from '../helpers/translationHelps/twArticleHelpers'
import CheckInfoCard from '../tc_ui_toolkit/CheckInfoCard'
import { parseTnToIndex } from '../helpers/translationHelps/tnArticleHelpers'
import ScripturePane from '../tc_ui_toolkit/ScripturePane'

// const tc = require('../__tests__/fixtures/tc.json')
// const toolApi = require('../__tests__/fixtures/toolApi.json')
//
// const lexiconCache_ = {};

const styles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    width: '80vw',
    height: '75%',
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
};

export const translationWords = 'translationWords'
export const translationNotes = 'translationNotes'

console.log('Checker.js - startup')
const name = 'Checker'
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')

const Checker = ({
  alignedGlBible,
  checkingData,
  checkType,
  contextId,
  glWordsData,
  translate,
}) => {
  const [state, _setState] = useState({
    alignedGLText: '',
    check: null,
    currentContextId: null,
    currentCheckingData: null,
    groupTitle: '',
    groupPhrase: '',
    groupsData: null,
    groupsIndex: null,
    localNothingToSelect: false,
    mode: 'default',
    modified: false,
    newSelections: null,
    nothingToSelect: false,
    selections: null,
    verseText: '',
  })

  const {
    alignedGLText,
    check,
    currentContextId,
    currentCheckingData,
    groupTitle,
    groupPhrase,
    groupsData,
    groupsIndex,
    localNothingToSelect,
    mode,
    modified,
    newSelections,
    nothingToSelect,
    selections,
    verseText,
  } = state

  function setState(newState) {
    _setState(prevState => ({ ...prevState, ...newState }))
  }

  function updateMode(newSelections) {
    const noSelections = (!newSelections.length)
    const newMode = noSelections ? 'select' : 'default'
    setState({
      mode: newMode
    })
  }

  useEffect(() => {
    if (contextId && checkingData && glWordsData) {
      let flattenedGroupData = null
      let newSelections = null
      let groupsIndex = null
      if (checkingData) {
        flattenedGroupData = flattenGroupData(checkingData)
      }

      const check = findCheck(flattenedGroupData, contextId, true)
      if (glWordsData) {
        if (checkType === translationNotes) {
          groupsIndex = parseTnToIndex(glWordsData)
        } else {
          groupsIndex = parseTwToIndex(glWordsData)
        }
      }

      const newState = {
        groupsData: flattenedGroupData,
        groupsIndex,
        currentCheckingData: checkingData,
        check,
        modified: false,
      }

      if (check) { // if found a match, use the selections
        newSelections = check.selections || []
        newState.selections = newSelections
        newState.newSelections = newSelections
      }

      setState(newState)

      if (flattenedGroupData && check?.contextId) {
        updateContext(check?.contextId, groupsIndex)
        updateMode(newSelections)
      }
    }
  }, [contextId, checkingData, glWordsData]);

  function updateContext(contextId, groupsIndex_ = groupsIndex) {
    const reference = contextId?.reference
    let verseText = getBestVerseFromBook(targetBible, reference?.chapter, reference?.verse)
    verseText = removeUsfmMarkers(verseText)
    const alignedGLText = getAlignedGLText(alignedGlBible, contextId);
    const groupTitle = getTitleFromIndex(groupsIndex_, contextId?.groupId)
    const groupPhrase = getPhraseFromTw(glWordsData, contextId?.groupId)
    setState({
      alignedGLText,
      currentContextId: contextId,
      verseText,
      groupTitle,
      groupPhrase
    })
  }

  const tags = [];
  const commentText = '';
  const invalidated = false;
  const bookDetails = {
    "id": "1jn",
    "name": "1 John"
  };
  const toolsSettings = {
    "ScripturePane": {
      "currentPaneSettings": [
        {
          "languageId": "targetLanguage",
          "bibleId": "targetBible",
          "fontSize": 120,
          "owner": "Door43-Catalog"
        },
        {
          "languageId": "originalLanguage",
          "bibleId": "ugnt",
          "owner": "Door43-Catalog"
        },
        {
          "languageId": "en",
          "bibleId": "ult",
          "owner": "Door43-Catalog",
          "isPreRelease": false
        },
        {
          "languageId": "fa",
          "bibleId": "glt",
          "owner": "fa_gl",
          "isPreRelease": false
        }
      ]
    }
  };

  const handleComment = () => {
    console.log(`${name}-handleComment`)
  }
  const isVerseChanged = false;
  const setToolSettings = () => {
    console.log(`${name}-setToolSettings`)
  }
  const openAlertDialog = () => {
    console.log(`${name}-openAlertDialog`)
  }
  const handleEditVerse = () => {
    console.log(`${name}-handleEditVerse`)
  }
  const maximumSelections = 4
  const isVerseInvalidated = false
  const handleTagsCheckbox = () => {
    console.log(`${name}-handleTagsCheckbox`)
  }
  const validateSelections = (selections_) => {
    console.log(`${name}-validateSelections`, selections_)
  }
  const targetLanguageFont = 'default'
  const unfilteredVerseText = 'The people who do not honor God will disappear, along with all of the things that they desire. But the people who do what God wants them to do will live forever!\n\n\\ts\\*\n\\p'
  const checkIfVerseChanged = () => {
    console.log(`${name}-checkIfVerseChanged`)
  }
  const targetLanguageDetails = {
    "id": "en",
    "name": "English",
    "direction": "ltr",
    "book": {
      "name": "1 John"
    }
  }
  const checkIfCommentChanged = () => {
    console.log(`${name}-checkIfCommentChanged`)
  }
  const changeSelectionsInLocalState = (selections_) => {
    console.log(`${name}-changeSelectionsInLocalState`, selections_)
    setState({
      newSelections: selections_,
    });
  }
  const toggleNothingToSelect = (select) => {
    console.log(`${name}-toggleNothingToSelect`, select)
    setState({ localNothingToSelect: select })
  }
  const bookName = '1 John'
  const changeCurrentContextId = (newContext, noCheck = false) => {
    const newContextId = newContext?.contextId
    console.log(`${name}-changeCurrentContextId`, newContextId)

    const selectionsUnchanged = isEqual(selections, newSelections)
    if (noCheck || selectionsUnchanged) {
      if (newContextId) {
        let check = findCheck(groupsData, newContextId, false)
        updateContext(newContextId)
        if (check) {
          const newSelections = check.selections || []
          setState({
            newSelections,
            selections: newSelections,
          })
          updateMode(newSelections)
        }
      }
    } else {
      console.log('Checker.changeCurrentContextId - unsaved changes')
    }
  }
  const direction = 'ltr'

  const isCommentChanged = false
  const bookmarkEnabled = false
  const saveSelection = () => {
    console.log(`${name}-saveSelection`)
    const newGroupsData = _.cloneDeep(groupsData);
    const checkInGroupsData = findCheck(newGroupsData, currentContextId)
    if (checkInGroupsData) {
      //save the selection changes
      const category = checkInGroupsData.category
      const newCheckData = _.cloneDeep(currentCheckingData);
      const checkInCheckingData = findCheck(newCheckData[category], currentContextId, false)
      if (checkInCheckingData) {
        checkInCheckingData.selections = newSelections
        checkInGroupsData.selections = newSelections
        setState({
          currentCheckingData: newCheckData,
          groupsData: newGroupsData,
          mode: 'default',
          modified: true,
          selections: newSelections,
        });

        const nextCheck = findNextCheck(groupsData, currentContextId, false)
        const nextContextId = nextCheck?.contextId
        if (nextContextId) {
          changeCurrentContextId(nextCheck, true)
        }
      }
    }
  }
  const cancelSelection = () => {
    console.log(`${name}-cancelSelection`)
    setState({
      newSelections: selections,
      mode: 'default'
    });
  }
  const clearSelection = () => {
    console.log(`${name}-clearSelection`)
    setState({ newSelections: [] });
  }
  const toggleBookmark = () => {
    console.log(`${name}-toggleBookmark`)
  }
  const changeMode = (mode) => {
    console.log(`${name}-changeMode`, mode)
    setState({ mode })
  }
  const cancelEditVerse = () => {
    console.log(`${name}-cancelEditVerse`)
  }
  const saveEditVerse = () => {
    console.log(`${name}-saveEditVerse`)
  }
  const cancelComment = () => {
    console.log(`${name}-cancelComment`)
  }
  const saveComment = () => {
    console.log(`${name}-saveComment`)
  }
  const readyToDisplayChecker = groupsData && groupsIndex && currentContextId && verseText

  const bibles = {
    'en_unfoldingWord': {
      'en_ult': {
        ...alignedGlBible,
        manifest: {
          language_name: 'English',
          language_id: 'en',
          direction: "ltr",
          description: 'Gateway Language',
          resource_title: "unfoldingWord® Literal Text"
        }
      }
    }
  }

  const paneSettings = [
    {
      languageId: 'en',
      bibleId: 'en_ult',
      owner: 'unfoldingWord'
    }
  ]
  const manifest = {
    language_name: 'English'
  }

  return (
    readyToDisplayChecker ?
      <div style={styles.containerDiv}>
        <GroupMenuComponent
          bookName={bookName}
          changeCurrentContextId={changeCurrentContextId}
          contextId={currentContextId}
          direction={direction}
          groupsData={groupsData}
          groupsIndex={groupsIndex}
          targetLanguageFont={targetLanguageFont}
          translate={translate}
        />
        <div style={{ display: 'flex', flexDirection: 'column',}}>
          <div style={styles.scripturePaneDiv}>
            <ScripturePane
              addObjectPropertyToManifest={null}
              bibles={bibles}
              complexScriptFonts={null}
              contextId={currentContextId}
              currentPaneSettings={paneSettings}
              editVerseRef={null}
              editTargetVerse={null}
              expandedScripturePaneTitle={'expandedScripturePaneTitle'}
              getAvailableScripturePaneSelections={null}
              getLexiconData={null}
              makeSureBiblesLoadedForTool={null}
              projectDetailsReducer={{ manifest }}
              selections={selections}
              setToolSettings={null}
              showPopover={false}
              onExpandedScripturePaneShow={null}
              translate={translate}
            />
            {/*<ScripturePaneWrapper*/}
            {/*  tc={tc}*/}
            {/*  toolApi={toolApi}*/}
            {/*  translate={translate}*/}
            {/*  onExpandedScripturePaneShow={onExpandedScripturePaneShow}*/}
            {/*  editVerseInScrPane={editVerseInScrPane}*/}
            {/*/>*/}
          </div>
          <div>
            <CheckInfoCard
              getScriptureFromReference={null}
              onLinkClick={() => false}
              onSeeMoreClick={() => false}
              phrase={groupPhrase}
              seeMoreLabel={translate('see_more')}
              showSeeMoreButton={false}
              title={groupTitle}
            />
            <div style={styles.centerDiv}>
            </div>
            <div style={styles.centerDiv}>
              <CheckArea
                alignedGLText={alignedGLText}
                bookDetails={bookDetails}
                changeSelectionsInLocalState={changeSelectionsInLocalState}
                checkIfCommentChanged={checkIfCommentChanged}
                checkIfVerseChanged={checkIfVerseChanged}
                comment={commentText}
                contextId={currentContextId}
                handleComment={handleComment}
                handleEditVerse={handleEditVerse}
                handleTagsCheckbox={handleTagsCheckbox}
                isVerseChanged={isVerseChanged}
                invalidated={isVerseInvalidated}
                maximumSelections={maximumSelections}
                mode={mode}
                newSelections={newSelections}
                nothingToSelect={nothingToSelect}
                openAlertDialog={openAlertDialog}
                setToolSettings={setToolSettings}
                selections={selections}
                tags={tags}
                targetBible={targetBible}
                targetLanguageDetails={targetLanguageDetails}
                targetLanguageFont={targetLanguageFont}
                translate={translate}
                toolsSettings={toolsSettings}
                unfilteredVerseText={unfilteredVerseText}
                verseText={verseText}
                validateSelections={validateSelections}
              />
              <ActionsArea
                bookmarkEnabled={bookmarkEnabled}
                cancelComment={cancelComment}
                cancelEditVerse={cancelEditVerse}
                cancelSelection={cancelSelection}
                changeMode={changeMode}
                clearSelection={clearSelection}
                isCommentChanged={isCommentChanged}
                localNothingToSelect={localNothingToSelect}
                mode={mode}
                newSelections={newSelections}
                nothingToSelect={nothingToSelect}
                saveComment={saveComment}
                saveEditVerse={saveEditVerse}
                saveSelection={saveSelection}
                selections={selections}
                tags={tags}
                toggleNothingToSelect={toggleNothingToSelect}
                translate={translate}
                toggleBookmark={toggleBookmark}
              />
            </div>
          </div>
        </div>
      </div>
      :
      'Waiting for Data'
  );
};

Checker.propTypes = {
  alignedGlBible: PropTypes.object,
  checkingData: PropTypes.object.isRequired,
  checkType: PropTypes.string,
  contextId: PropTypes.object.isRequired,
  glWordsData: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};
export default Checker;
