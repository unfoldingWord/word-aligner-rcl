/* eslint-disable indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionsArea from './ActionsArea';
import CheckArea from './CheckArea';
import SaveArea from './SaveArea';
import DialogComponent from './DialogComponent';
import IconIndicators from './IconIndicators';

import './VerseCheck.styles.css';

class VerseCheck extends Component {
  render() {
    const {
      translate,
      alignedGLText,
      verseText,
      unfilteredVerseText,
      mode,
      dialogModalVisibility,
      isCommentChanged,
      tags,
      isVerseChanged,
      saveSelection,
      cancelSelection,
      clearSelection,
      handleSkip,
      toggleNothingToSelect,
      localNothingToSelect,
      maximumSelections,
      selections,
      newSelections,
      nothingToSelect,
      isVerseEdited,
      commentText,
      bookmarkEnabled,
      isVerseInvalidated,
      contextId,
      targetBible,
      toolsSettings,
      handleCloseDialog,
      handleGoToNext,
      handleGoToPrevious,
      handleOpenDialog,
      openAlertDialog,
      changeSelectionsInLocalState,
      toggleBookmark,
      changeMode,
      cancelEditVerse,
      saveEditVerse,
      handleComment,
      cancelComment,
      saveComment,
      bookDetails,
      setToolSettings,
      targetLanguageDetails,
      handleTagsCheckbox,
      handleEditVerse,
      checkIfVerseChanged,
      checkIfCommentChanged,
      validateSelections,
      manifest,
    } = this.props;
    const targetLanguageFont = manifest && manifest.projectFont || '';
    let titleText;
    let saveArea;

    switch (mode) {
      case 'edit':
        titleText = translate('edit_verse');
        saveArea = <div />;
        break;
      case 'comment':
        titleText = translate('comment');
        saveArea = <div />;
        break;
      case 'select':
        titleText = translate('select');
        saveArea = <div />;
        break;
      default:
        titleText = translate('step2_check');
        saveArea = (
          <SaveArea
            translate={translate}
            selections={selections}
            nothingToSelect={nothingToSelect}
            handleGoToNext={handleGoToNext}
            handleGoToPrevious={handleGoToPrevious}
            handleOpenDialog={handleOpenDialog}
          />
        );
    }

    return (
      <div className='verse-check'>
        <div className='verse-check-flex'>
          <div className='verse-check-card'>
            <div className='title-bar'>
              <span>{titleText}</span>
              <IconIndicators
                isVerseEdited={isVerseEdited}
                selections={selections}
                comment={commentText}
                bookmarkEnabled={bookmarkEnabled}
                translate={translate}
                nothingToSelect={nothingToSelect}
                invalidated={isVerseInvalidated}
              />
            </div>
            <CheckArea
              mode={mode}
              tags={tags}
              verseText={verseText}
              comment={commentText}
              translate={translate}
              contextId={contextId}
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
          {saveArea}
        </div>
        <DialogComponent
          handleSkip={handleSkip}
          dialogModalVisibility={dialogModalVisibility}
          handleClose={handleCloseDialog}
          translate={translate} />
      </div>
    );
  }
}


VerseCheck.propTypes = {
  tags: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  selections: PropTypes.array.isRequired,
  contextId: PropTypes.object.isRequired,
  verseText: PropTypes.string.isRequired,
  isVerseEdited: PropTypes.bool.isRequired,
  commentText: PropTypes.string.isRequired,
  targetBible: PropTypes.object.isRequired,
  bookDetails: PropTypes.object.isRequired,
  newSelections: PropTypes.array.isRequired,
  isVerseChanged: PropTypes.bool.isRequired,
  handleGoToNext: PropTypes.func.isRequired,
  nothingToSelect: PropTypes.bool.isRequired,
  bookmarkEnabled: PropTypes.bool.isRequired,
  toolsSettings: PropTypes.object.isRequired,
  alignedGLText: PropTypes.string.isRequired,
  isCommentChanged: PropTypes.bool.isRequired,
  isVerseInvalidated: PropTypes.bool.isRequired,
  targetLanguageDetails: PropTypes.object.isRequired,
  unfilteredVerseText: PropTypes.string.isRequired,
  dialogModalVisibility: PropTypes.bool.isRequired,
  localNothingToSelect: PropTypes.bool.isRequired,
  maximumSelections: PropTypes.number.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  handleGoToPrevious: PropTypes.func.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
  openAlertDialog: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  cancelEditVerse: PropTypes.func.isRequired,
  saveEditVerse: PropTypes.func.isRequired,
  handleComment: PropTypes.func.isRequired,
  cancelComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  toggleNothingToSelect: PropTypes.func.isRequired,
  saveSelection: PropTypes.func.isRequired,
  cancelSelection: PropTypes.func.isRequired,
  clearSelection: PropTypes.func.isRequired,
  handleSkip: PropTypes.func.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  handleEditVerse: PropTypes.func.isRequired,
  checkIfVerseChanged: PropTypes.func.isRequired,
  checkIfCommentChanged: PropTypes.func.isRequired,
  validateSelections: PropTypes.func.isRequired,
  handleTagsCheckbox: PropTypes.func.isRequired,
  changeSelectionsInLocalState: PropTypes.func.isRequired,
  manifest: PropTypes.object,
};

VerseCheck.defaultProps = {
  translate: key => key,
  verseText: '',
  unfilteredVerseText: '',
  commentText: '',
};

export default VerseCheck;
