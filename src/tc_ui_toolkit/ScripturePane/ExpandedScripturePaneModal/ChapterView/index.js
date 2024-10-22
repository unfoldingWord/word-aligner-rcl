/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './ChapterView.styles.css';

// components
import { getReferenceStr, getTitleStr } from '../../helpers/utils';
import VerseEditorDialog from '../../../VerseEditor';
import { getBibleElement, getVerseDataFromBible } from '../../helpers/verseHelpers';
import VerseRow from './VerseRow';
import { getUsfmForVerseContent } from '../../../../helpers/UsfmFileConversionHelpers'

class ChapterView extends Component {
  componentDidMount() {
    let { chapter, verse } = this.props.contextId.reference;
    let verseReference = ChapterView.makeRefKey(chapter, verse);
    let currentVerse = this.verseRefs[verseReference];
    let element = ReactDOM.findDOMNode(currentVerse);

    if (element) {
      element.scrollIntoView();
    }
  }

  /**
   * Generates a key to use for verse ref's
   * @param chapter
   * @param verse
   * @return {string}
   */
  static makeRefKey(chapter, verse) {
    return `c${chapter.toString()}v${verse.toString()}`;
  }

  componentWillUnmount() {
    this.verseRefs = {};
  }

  render() {
    const {
      bibles,
      contextId,
      translate,
      selections,
      showPopover,
      getLexiconData,
      handleEditorSubmit,
      handleEditorCancel,
      currentPaneSettings,
      projectDetailsReducer,
      handleEditTargetVerse,
      showTargetUsfm,
    } = this.props;

    const { chapter, verse } = contextId.reference;
    const languageID = 'en';
    const bookID = 'ult';
    const bible = getBibleElement(bibles, languageID, bookID);
    const verseNumbers = Object.keys(bible[chapter]);
    const { manifest: projectManifest } = projectDetailsReducer;
    const targetLanguageFont = projectManifest.projectFont || '';
    this.verseRefs = {};
    let verseRows = [];

    if (verseNumbers.length > 0) {
      const frontIdx = verseNumbers.indexOf('front');

      if (frontIdx > 0) { // move front to top of verse list if not there
        const front = verseNumbers[frontIdx];
        verseNumbers.splice(frontIdx);
        verseNumbers.unshift(front);
      }

      for (let i = 0, len = verseNumbers.length; i < len; i++) {
        const verseNumber = verseNumbers[i];
        const { verseLabel } = getVerseDataFromBible(bible, chapter, verse);
        const refKey = ChapterView.makeRefKey(chapter, verseNumber);

        verseRows.push(
          <VerseRow
            key={verseNumber.toString()}
            verse={verseLabel || verse}
            bibles={bibles}
            chapter={chapter}
            translate={translate}
            contextId={contextId}
            selections={selections}
            showPopover={showPopover}
            getLexiconData={getLexiconData}
            currentVerseNumber={verseNumber}
            targetLanguageFont={targetLanguageFont}
            currentPaneSettings={currentPaneSettings}
            onEditTargetVerse={handleEditTargetVerse}
            evenVerse={i % 2 === 0}
            ref={node => this.verseRefs[refKey] = node}
            showTargetUsfm={showTargetUsfm}
          />,
        );
      }
    }

    const { editVerse } = this.props;
    const openEditor = editVerse !== null;
    let verseTitle = '';
    let verseText = '';
    let fontSizePercent = 100; // default font size
    const direction = projectManifest.target_language && projectManifest.target_language.direction || 'ltr';

    if (openEditor) {
      let bookName = projectManifest?.target_language?.book?.name;

      if (!bookName) {
        console.warn('The localized book name could not be found. This is likely a bug in tC.');
        bookName = projectManifest?.project?.name || bookID;
      }

      const refStr = getReferenceStr(editVerse.chapter, editVerse.verse);
      verseTitle = getTitleStr(bookName, refStr, direction);
      verseText = editVerse.verseText || '';
      if (typeof verseText !== 'string') {
        verseText = getUsfmForVerseContent(verseText)
      }
      const targetConfig = currentPaneSettings.find(pane => (pane.languageId === 'targetLanguage'));

      if (targetConfig) {
        fontSizePercent = targetConfig.fontSize;
      }
    }

    return (
      <div>
        <div className="verse-row-container">
          {verseRows}
        </div>
        <VerseEditorDialog
          open={openEditor}
          translate={translate}
          verseText={verseText}
          verseTitle={verseTitle}
          onSubmit={handleEditorSubmit}
          onCancel={handleEditorCancel}
          targetLanguageFont={targetLanguageFont}
          targetLanguageFontSize={`${fontSizePercent}%`}
          direction={direction}
        />
      </div>
    );
  }
}

ChapterView.propTypes = {
  contextId: PropTypes.object.isRequired,
  currentPaneSettings: PropTypes.array.isRequired,
  editTargetVerse: PropTypes.func.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  bibles: PropTypes.object.isRequired,
  selections: PropTypes.array.isRequired,
  getLexiconData: PropTypes.func.isRequired,
  showPopover: PropTypes.func.isRequired,
  editVerse: PropTypes.object,
  handleEditTargetVerse: PropTypes.func.isRequired,
  handleEditorSubmit: PropTypes.func.isRequired,
  handleEditorCancel: PropTypes.func.isRequired,
  showTargetUsfm: PropTypes.bool,
};

export default ChapterView;
