import React from 'react';
import PropTypes from 'prop-types';
// components
import DefaultArea from '../DefaultArea';
import SelectionArea from '../SelectionArea';
import InstructionsArea from '../InstructionsArea';
import EditVerseArea from '../EditVerseArea';
import CommentArea from '../CommentArea';
import './CheckArea.styles.css';

const CheckArea = ({
  mode,
  tags,
  comment,
  verseText,
  translate,
  contextId,
  selections,
  invalidated,
  targetBible,
  bookDetails,
  newSelections,
  alignedGLText,
  handleComment,
  toolsSettings,
  isVerseChanged,
  nothingToSelect,
  openAlertDialog,
  handleEditVerse,
  setToolSettings,
  maximumSelections,
  handleTagsCheckbox,
  validateSelections,
  targetLanguageFont,
  unfilteredVerseText,
  checkIfVerseChanged,
  checkIfCommentChanged,
  targetLanguageDetails,
  changeSelectionsInLocalState,
}) => {
  let modeArea;
  const { direction: targetLanguageDirection = 'ltr' } = targetLanguageDetails || {};

  switch (mode) {
  case 'edit':
    var fontSize = (toolsSettings['CheckArea'] && toolsSettings['CheckArea'].fontSize) || 100;

    modeArea = (
      <EditVerseArea
        tags={tags}
        verseText={unfilteredVerseText}
        isVerseChanged={isVerseChanged}
        handleTagsCheckbox={handleTagsCheckbox}
        handleEditVerse={handleEditVerse}
        checkIfVerseChanged={checkIfVerseChanged}
        languageDirection={targetLanguageDirection}
        translate={translate}
        targetLanguageFont={targetLanguageFont}
        targetLanguageFontSize={`${fontSize}%`}
      />
    );
    break;
  case 'comment':
    modeArea = (
      <CommentArea
        comment={comment}
        translate={translate}
        handleComment={handleComment}
        checkIfCommentChanged={checkIfCommentChanged}
      />
    );
    break;
  case 'select':
    modeArea = (
      <div style={{
        WebkitUserSelect: 'none', display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center', overflow: 'auto',
      }}>
        <InstructionsArea
          verseText={verseText}
          selections={selections}
          alignedGLText={alignedGLText}
          mode={mode}
          translate={translate}
          invalidated={invalidated}
          targetLanguageFont={targetLanguageFont}
          targetLanguageDirection={targetLanguageDirection}
        />
      </div>);
    break;
  case 'default':
  default:
    modeArea = (
      <div style={{
        WebkitUserSelect: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
      }}>
        <InstructionsArea
          dontShowTranslation={true}
          verseText={verseText}
          selections={selections}
          alignedGLText={alignedGLText}
          translate={translate}
          invalidated={invalidated}
          nothingToSelect={nothingToSelect}
          targetLanguageFont={targetLanguageFont}
          targetLanguageDirection={targetLanguageDirection}
        />
      </div>
    );
  }

  let reference = contextId.reference;

  if (contextId.verseSpan) { // if are in a verse span, use it
    reference = {
      ...contextId.reference,
      verse: contextId.verseSpan,
    };
  }

  return (
    <div className='check-area'>
      {mode === 'select' ?
        <SelectionArea
          mode={mode}
          translate={translate}
          verseText={verseText}
          bookDetails={bookDetails}
          targetBible={targetBible}
          selections={newSelections}
          toolsSettings={toolsSettings}
          reference={reference}
          setToolSettings={setToolSettings}
          openAlertDialog={openAlertDialog}
          maximumSelections={maximumSelections}
          targetLanguageFont={targetLanguageFont}
          targetLanguageDetails={targetLanguageDetails}
          changeSelectionsInLocalState={changeSelectionsInLocalState}
        />
        :
        <DefaultArea
          translate={translate}
          verseText={verseText}
          selections={selections}
          targetBible={targetBible}
          bookDetails={bookDetails}
          toolsSettings={toolsSettings}
          reference={reference}
          setToolSettings={setToolSettings}
          validateSelections={validateSelections}
          targetLanguageFont={targetLanguageFont}
          targetLanguageDetails={targetLanguageDetails}
        />
      }
      <div style={{
        borderLeft: '1px solid var(--border-color)', flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center',
      }}>
        {modeArea}
      </div>
    </div>
  );
};

CheckArea.propTypes = {
  tags: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  translate: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  invalidated: PropTypes.bool.isRequired,
  verseText: PropTypes.string.isRequired,
  contextId: PropTypes.object.isRequired,
  selections: PropTypes.array.isRequired,
  bookDetails: PropTypes.object.isRequired,
  handleComment: PropTypes.func.isRequired,
  targetBible: PropTypes.object.isRequired,
  newSelections: PropTypes.array.isRequired,
  isVerseChanged: PropTypes.bool.isRequired,
  alignedGLText: PropTypes.string.isRequired,
  nothingToSelect: PropTypes.bool.isRequired,
  handleEditVerse: PropTypes.func.isRequired,
  openAlertDialog: PropTypes.func.isRequired,
  toolsSettings: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  validateSelections: PropTypes.func.isRequired,
  handleTagsCheckbox: PropTypes.func.isRequired,
  checkIfVerseChanged: PropTypes.func.isRequired,
  maximumSelections: PropTypes.number.isRequired,
  unfilteredVerseText: PropTypes.string.isRequired,
  checkIfCommentChanged: PropTypes.func.isRequired,
  targetLanguageDetails: PropTypes.object.isRequired,
  changeSelectionsInLocalState: PropTypes.func.isRequired,
};

export default CheckArea;
