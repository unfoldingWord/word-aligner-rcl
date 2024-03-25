/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VerseCheck, verseHelpers } from 'tc-ui-toolkit';
import { connect } from 'react-redux';
// helpers
import { optimizeSelections } from '../helpers/selectionHelpers';
import { getInvalidQuoteMessage } from '../helpers/checkAreaHelpers';
import { getVerseText } from '../helpers/verseHelpers';
// actions
import { changeToNextContextId, changeToPreviousContextId } from '../state/actions/contextIdActions';
import { addComment } from '../state/actions/commentsActions';
import { changeSelections, validateSelections } from '../state/actions/selectionsActions';
import { editTargetVerse } from '../state/actions/verseEditActions';
import { toggleBookmark } from '../state/actions/bookmarksActions';
// selectors
import {
  getContextId,
  getProjectManifest,
  getGatewayLanguageCode,
  getTargetBible,
  getCurrentGroup,
  getMaximumSelections,
  getCommentsReducer,
  getSelectionsReducer,
  getBookmarksReducer,
  getCurrentToolName,
  getProjectPath,
  getUsername,
  getUserData,
  getToolsSettings,
} from '../selectors';
import { contextNotEmpty } from '../utils/utils';


function useLocalState(initialState) {
  const [localState, setLocalState] = useState(initialState);

  return {
    ...localState,
    setLocalState(newState) {
      setLocalState(prevState => ({ ...prevState, ...newState }));
    },
  };
}

function VerseCheckWrapper({
  goToNext,
  manifest,
  translate,
  contextId,
  verseText,
  showAlert,
  addComment,
  targetBible,
  goToPrevious,
  isVerseEdited,
  alignedGLText,
  toolsSettings,
  toggleBookmark,
  onInvalidCheck,
  editTargetVerse,
  setToolSettings,
  changeSelections,
  maximumSelections,
  isVerseInvalidated,
  validateSelections,
  unfilteredVerseText,
  selectionsReducer: {
    selections,
    nothingToSelect,
  },
  commentsReducer: { text: commentText },
  bookmarksReducer: { enabled: bookmarkEnabled },
  editVerseInScripturePane,
}) {
  // Determine screen mode
  const initialMode = getInitialMode();
  const {
    mode,
    newComment,
    newVerseText,
    newSelections,
    newNothingToSelect,
    isCommentChanged,
    isVerseChanged,
    newTags,
    isDialogOpen,
    goToNextOrPrevious,
    setLocalState,
    alignedGlTextState,
  } = useLocalState({
    mode: initialMode,
    newComment: null,
    newVerseText: null,
    newSelections: selections,
    newNothingToSelect: nothingToSelect,
    isCommentChanged: false,
    isVerseChanged: false,
    newTags: [],
    isDialogOpen: false,
    goToNextOrPrevious: null,
    lastContextId: null,
    alignedGlTextState: '',
  });

  useEffect(() => {
    // TRICKY: for async fs loads, need to update mode and selection state when new selection loads
    setLocalState(
      {
        mode: getInitialMode(),
        newSelections: selections,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections]);

  useEffect(() => {
    let alignedGlTextState = alignedGLText;

    if (!alignedGLText && contextNotEmpty(contextId)) {
      alignedGlTextState = getInvalidQuoteMessage(contextId, translate);

      if (onInvalidCheck) {
        onInvalidCheck();
      }
    }
    setLocalState({
      mode: initialMode,
      newComment: null,
      newVerseText: null,
      newSelections: selections,
      newNothingToSelect: nothingToSelect,
      newTags: [],
      lastContextId: null,
      alignedGlTextState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextId]);

  function getInitialMode() {
    return selections && selections.length || verseText.length === 0 ?
      'default' : nothingToSelect ? 'default' : 'select';
  }

  function handleOpenDialog(goToNextOrPrevious) {
    setLocalState({ goToNextOrPrevious, isDialogOpen: true });
  }

  function handleCloseDialog() {
    setLocalState({ isDialogOpen: false });
  }

  function handleSkip(e) {
    e.preventDefault();
    setLocalState({ isDialogOpen: false });

    if (goToNextOrPrevious == 'next') {
      goToNext();
    } else if (goToNextOrPrevious == 'previous') {
      goToPrevious();
    }
  }

  /**
   * see if current verse is part of a list or a verse range that is not an
   *    exact match in the target bible.  In that case there is more than one
   *    verse to be edited, so return first verse to be edited.  Otherwise we
   *    have an exact match to in the target bible and will just return null.
   * @returns {null|string}
   */
  function checkIfMultipartVerseToEdit() {
    const { reference: { chapter, verse } } = contextId;
    const verseRef = contextId.verseSpan || verse; // if in verse span, use it
    const verseFound = targetBible?.[chapter]?.[verseRef];
    let editVerse = null;

    if (!verseFound) { // reference is not exact match to single verse or span
      const verseList = verseHelpers.getVerseList(verseRef); // get the parts

      if (verseList?.length) {
        editVerse = verseList[0];

        if (verseHelpers.isVerseSpan(editVerse)) {
          const { low } = verseHelpers.getVerseSpanRange(editVerse);

          if (low) {
            editVerse = low;
          }
        }
      }
    }
    return editVerse;
  }

  function changeMode(mode) {
    if (mode === 'edit') {
      let editFirstVerse = checkIfMultipartVerseToEdit();

      if (editFirstVerse) {
        // eslint-disable-next-line no-unused-expressions
        editVerseInScripturePane && editVerseInScripturePane(editFirstVerse);
        return;
      }
    }

    setLocalState({
      mode,
      newSelections: selections,
    });
  }

  function handleComment(e) {
    e.preventDefault();
    setLocalState({ newComment: e.target.value });
  }

  function checkIfCommentChanged(e) {
    const newcomment = e.target.value || '';
    const oldcomment = commentText || '';

    setLocalState({ isCommentChanged: newcomment !== oldcomment });
  }

  function cancelComment() {
    setLocalState({
      mode: 'default',
      newSelections: selections,
      newComment: null,
      isCommentChanged: false,
    });
  }

  function saveComment() {
    addComment(newComment);
    setLocalState({
      mode: 'default',
      newSelections: selections,
      newComment: null,
      isCommentChanged: false,
    });
  }

  function handleTagsCheckbox(tag) {
    const tagIndex = newTags.indexOf(tag);
    let _newTags;

    if (tagIndex > -1) {
      const copy = newTags.slice(0);
      copy.splice(tagIndex, 1);
      _newTags = copy;
    } else {
      _newTags = [...newTags, tag];
    }

    setLocalState({ newTags: _newTags });
  }

  function handleEditVerse(e) {
    setLocalState({ newVerseText: e.target.value });
  }

  function checkIfVerseChanged(e) {
    const { chapter, verse } = contextId.reference;
    const newverse = e.target.value || '';
    const oldverse = targetBible[chapter][verse] || '';

    if (newverse === oldverse) {
      setLocalState({
        isVerseChanged: false,
        newTags: [],
      });
    } else {
      setLocalState({ isVerseChanged: true });
    }
  }

  function cancelEditVerse() {
    setLocalState({
      mode: 'default',
      newSelections: selections,
      newVerseText: null,
      isVerseChanged: false,
      newTags: [],
    });
  }

  function saveEditVerse() {
    const { chapter, verse } = contextId.reference;
    const verseRef = contextId.verseSpan || verse; // if in verse span, use it
    const before = targetBible[chapter][verseRef];

    setLocalState({
      mode: 'default',
      newSelections: selections,
      newVerseText: null,
      isVerseChanged: false,
      newTags: [],
    });
    editTargetVerse(chapter, verseRef, before, newVerseText, newTags);
  }

  function changeSelectionsInLocalState(newSelections) {
    if (newSelections.length > 0) {
      setLocalState({ newNothingToSelect: false });
    } else {
      setLocalState({ newNothingToSelect: nothingToSelect });
    }
    setLocalState({ newSelections });
  }

  function cancelSelection() {
    setLocalState({
      mode: 'default',
      newNothingToSelect: nothingToSelect,
      newSelections: selections,
    });
  }

  function clearSelection() {
    setLocalState({ newSelections: [] });
  }

  function saveSelection() {
    // optimize the selections to address potential issues and save
    const selections = optimizeSelections(verseText, newSelections);
    changeSelections(selections, newNothingToSelect);
    changeMode('default');
  }

  function toggleNothingToSelect(newNothingToSelect) {
    setLocalState({ newNothingToSelect });
  }

  if (contextNotEmpty(contextId)) {
    return (
      <VerseCheck
        mode={mode}
        tags={newTags}
        translate={translate}
        verseText={verseText}
        contextId={contextId}
        changeMode={changeMode}
        selections={selections}
        targetBible={targetBible}
        commentText={commentText}
        isVerseEdited={isVerseEdited}
        toolsSettings={toolsSettings}
        newSelections={newSelections}
        bookDetails={manifest.project}
        isVerseChanged={isVerseChanged}
        setToolSettings={setToolSettings}
        nothingToSelect={nothingToSelect}
        bookmarkEnabled={bookmarkEnabled}
        alignedGLText={alignedGlTextState}
        dialogModalVisibility={isDialogOpen}
        maximumSelections={maximumSelections}
        isVerseInvalidated={isVerseInvalidated}
        unfilteredVerseText={unfilteredVerseText}
        targetLanguageDetails={manifest.target_language}
        localNothingToSelect={newNothingToSelect}
        isCommentChanged={isCommentChanged}
        handleSkip={handleSkip}
        handleGoToNext={goToNext}
        handleGoToPrevious={goToPrevious}
        handleOpenDialog={handleOpenDialog}
        handleCloseDialog={handleCloseDialog}
        openAlertDialog={showAlert}
        toggleBookmark={toggleBookmark}
        cancelEditVerse={cancelEditVerse}
        saveEditVerse={saveEditVerse}
        handleComment={handleComment}
        cancelComment={cancelComment}
        saveComment={saveComment}
        saveSelection={saveSelection}
        cancelSelection={cancelSelection}
        clearSelection={clearSelection}
        handleEditVerse={handleEditVerse}
        checkIfVerseChanged={checkIfVerseChanged}
        checkIfCommentChanged={checkIfCommentChanged}
        validateSelections={validateSelections}
        handleTagsCheckbox={handleTagsCheckbox}
        toggleNothingToSelect={toggleNothingToSelect}
        changeSelectionsInLocalState={changeSelectionsInLocalState}
        manifest={manifest}
      />
    );
  } else {
    return null;
  }
}

VerseCheckWrapper.propTypes = {
  translate: PropTypes.func.isRequired,
  gatewayLanguageCode: PropTypes.string,
  manifest: PropTypes.object.isRequired,
  verseText: PropTypes.string.isRequired,
  contextId: PropTypes.object.isRequired,
  isVerseEdited: PropTypes.bool.isRequired,
  targetBible: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  alignedGLText: PropTypes.string.isRequired,
  commentsReducer: PropTypes.object.isRequired,
  bookmarksReducer: PropTypes.object.isRequired,
  isVerseInvalidated: PropTypes.bool.isRequired,
  maximumSelections: PropTypes.number.isRequired,
  unfilteredVerseText: PropTypes.string.isRequired,
  selectionsReducer: PropTypes.shape({
    selections: PropTypes.array.isRequired,
    nothingToSelect: PropTypes.bool.isRequired,
  }).isRequired,
  changeSelections: PropTypes.func.isRequired,
  goToNext: PropTypes.func.isRequired,
  goToPrevious: PropTypes.func.isRequired,
  onInvalidCheck: PropTypes.func.isRequired,
  validateSelections: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  editTargetVerse: PropTypes.func.isRequired,
  editVerseInScripturePane: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const contextId = getContextId(state);
  const targetBible = getTargetBible(ownProps);
  const { verseText, unfilteredVerseText } = getVerseText(targetBible, contextId, true);
  const currentGroupItem = getCurrentGroup(state);
  const isVerseEdited = !!(currentGroupItem && currentGroupItem.verseEdits);
  const isVerseInvalidated = !!(currentGroupItem && currentGroupItem.invalidated);
  const currentToolName = getCurrentToolName(ownProps);
  const alignedGLText = ownProps.gatewayLanguageQuote;
  const toolsSettings = getToolsSettings(ownProps);

  return {
    contextId,
    verseText,
    targetBible,
    isVerseEdited,
    alignedGLText,
    toolsSettings,
    isVerseInvalidated,
    unfilteredVerseText,
    showAlert: ownProps.tc.showAlert,
    manifest: getProjectManifest(ownProps),
    commentsReducer: getCommentsReducer(state),
    setToolSettings: ownProps.tc.setToolSettings,
    bookmarksReducer: getBookmarksReducer(state),
    selectionsReducer: getSelectionsReducer(state),
    maximumSelections: getMaximumSelections(currentToolName),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    tc: {
      bookId,
      showAlert,
      closeAlert,
      onInvalidCheck,
      updateTargetVerse,
      showIgnorableAlert,
    },
    toolApi,
    contextId,
    translate,
    gatewayLanguageQuote,
  } = ownProps;
  const username = getUsername(ownProps);
  const userData = getUserData(ownProps);
  const currentToolName = getCurrentToolName(ownProps);
  const projectSaveLocation = getProjectPath(ownProps);
  const gatewayLanguageCode = getGatewayLanguageCode(ownProps);

  return {
    goToNext: () => dispatch(changeToNextContextId(projectSaveLocation, userData, gatewayLanguageCode, gatewayLanguageQuote)),
    goToPrevious: () => dispatch(changeToPreviousContextId(projectSaveLocation, userData, gatewayLanguageCode, gatewayLanguageQuote)),
    addComment: (text) => dispatch(addComment(text, username, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation)),
    editTargetVerse: (chapter, verse, before, after, tags) => {
      dispatch(editTargetVerse(chapter, verse, before, after, tags, username, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation, currentToolName, translate, showAlert, closeAlert, showIgnorableAlert, updateTargetVerse, toolApi));
    },
    toggleBookmark: () => {
      dispatch(toggleBookmark(username, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation));
    },
    changeSelections: (selections, nothingToSelect) => {
      dispatch(changeSelections(selections, false, null, null, nothingToSelect, username, currentToolName, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation));
    },
    validateSelections: (targetVerse) => {
      validateSelections(targetVerse, contextId, null, null, true, {}, null, projectSaveLocation, bookId, currentToolName, username, gatewayLanguageCode, gatewayLanguageQuote);
    },
    onInvalidCheck: () => {
      onInvalidCheck(contextId, gatewayLanguageCode, true, () => {
        dispatch(changeToNextContextId(projectSaveLocation, userData, gatewayLanguageCode, gatewayLanguageQuote));
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerseCheckWrapper);
