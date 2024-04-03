import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import CheckArea from '../tc_ui_toolkit/VerseCheck/CheckArea'
import ActionsArea from '../tc_ui_toolkit/VerseCheck/ActionsArea'
import GroupMenuComponent from './GroupMenuComponent'
import { getBestVerseFromBook } from '../helpers/verseHelpers'
import { removeUsfmMarkers } from '../utils/usfmHelpers'
import isEqual from 'deep-equal'
import { twlTsvToGroupData } from '../helpers/translationHelps/twArticleHelpers'

// const tc = require('../__tests__/fixtures/tc.json')
// const toolApi = require('../__tests__/fixtures/toolApi.json')
//
// const lexiconCache_ = {};

const styles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    // width: '100vw',
    height: '50%',
  },
  centerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    overflowX: 'auto',
  },
  scripturePaneDiv: {
    display: 'flex',
    flexShrink: '0',
    height: '250px',
    paddingBottom: '20px',
  },
};

console.log('Checker.js - startup')
const name = 'Checker'
const targetBible = require('../__tests__/fixtures/bibles/1jn/targetBible.json')
const enGlBible = require('../__tests__/fixtures/bibles/1jn/enGlBible.json')
const ugntBible = require('../__tests__/fixtures/bibles/1jn/ugntBible.json')
const groupsData = require('../__tests__/fixtures/translationWords/groupsData.json')
const groupsIndex =require('../__tests__/fixtures/translationWords/groupsIndex.json')
const twl = require('../__tests__/fixtures/translationWords/twl_1JN.tsv.json')
const project = {
  identifier: '1jn',
  languageId: 'en'
}
twlTsvToGroupData(twl.data, project, ugntBible).then(() => { })

const selections = [
  {
    "text": "desire",
    "occurrence": 1,
    "occurrences": 1
  }
];

const Checker = ({
  contextId,
  translate,
}) => {
  const [state, _setState] = useState({
    currentContextId: contextId,
    localNothingToSelect: false,
    mode: 'default',
    newSelections: selections,
    nothingToSelect: false,
    verseText: '',
  })

  const {
    currentContextId,
    localNothingToSelect,
    mode,
    newSelections,
    nothingToSelect,
    verseText,
  } = state

  function setState(newState) {
    _setState(prevState => ({ ...prevState, ...newState }))
  }

  useEffect(() => {
    updateContext(contextId)
    setState({ newSelections: selections })
  }, [contextId]);

  function updateContext(contextId) {
    const reference = contextId?.reference
    let verseText = getBestVerseFromBook(targetBible, reference?.chapter, reference?.verse)
    verseText = removeUsfmMarkers(verseText)
    setState({
      currentContextId: contextId,
      verseText,
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
  const alignedGLText = 'eternity';
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
  const changeCurrentContextId = (newContext) => {
    const newContextId = newContext?.contextId
    console.log(`${name}-changeCurrentContextId`, newContextId)

    const selectionsUnchanged = isEqual(selections, newSelections)
    if (selectionsUnchanged) {
      if (newContextId) {
        updateContext(newContextId)
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
    //TODO: save changes
    setState({ mode: 'default' });
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

  return (
    <div style={styles.containerDiv}>
      <GroupMenuComponent
        bookName={bookName}
        translate={translate}
        contextId={currentContextId}
        groupsData={groupsData}
        groupsIndex={groupsIndex}
        targetLanguageFont={targetLanguageFont}
        changeCurrentContextId={changeCurrentContextId}
        direction={direction}
      />
      <div style={styles.centerDiv}>
        <CheckArea
          mode={mode}
          tags={tags}
          verseText={verseText}
          comment={commentText}
          translate={translate}
          contextId={currentContextId}
          selections={selections}
          bookDetails={bookDetails}
          targetBible={targetBible}
          toolsSettings={toolsSettings}
          newSelections={newSelections}
          alignedGLText={alignedGLText}
          handleComment={handleComment}
          isVerseChanged={isVerseChanged}
          invalidated={isVerseInvalidated}
          setToolSettings={setToolSettings}
          nothingToSelect={nothingToSelect}
          openAlertDialog={openAlertDialog}
          handleEditVerse={handleEditVerse}
          maximumSelections={maximumSelections}
          handleTagsCheckbox={handleTagsCheckbox}
          validateSelections={validateSelections}
          targetLanguageFont={targetLanguageFont}
          unfilteredVerseText={unfilteredVerseText}
          checkIfVerseChanged={checkIfVerseChanged}
          targetLanguageDetails={targetLanguageDetails}
          checkIfCommentChanged={checkIfCommentChanged}
          changeSelectionsInLocalState={changeSelectionsInLocalState}
        />
        <ActionsArea
          mode={mode}
          tags={tags}
          toggleNothingToSelect={toggleNothingToSelect}
          localNothingToSelect={localNothingToSelect}
          nothingToSelect={nothingToSelect}
          isCommentChanged={isCommentChanged}
          selections={selections}
          newSelections={newSelections}
          translate={translate}
          bookmarkEnabled={bookmarkEnabled}
          saveSelection={saveSelection}
          cancelSelection={cancelSelection}
          clearSelection={clearSelection}
          toggleBookmark={toggleBookmark}
          changeMode={changeMode}
          cancelEditVerse={cancelEditVerse}
          saveEditVerse={saveEditVerse}
          cancelComment={cancelComment}
          saveComment={saveComment}
        />
      </div>
    </div>
  );
};

Checker.propTypes = {
  contextId: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};
export default Checker;
