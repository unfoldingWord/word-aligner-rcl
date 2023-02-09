import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import WordAligner from './WordAligner';
import WordList from './WordList/index';

const verseAlignments = require('../data/alignments.json');

/**
 * The base container for this tool
 */
export class WordAlignerDemo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WordList
        verseAlignments={verseAlignments}
      />
    );
  }
}

WordAlignerDemo.contextTypes = { store: PropTypes.any.isRequired };

WordAlignerDemo.propTypes = {
  contextId: PropTypes.object,
  sourceVerse: PropTypes.object,
  sourceChapter: PropTypes.object,
  targetChapter: PropTypes.object,
  bookId: PropTypes.string.isRequired,
  gatewayLanguageCode: PropTypes.string.isRequired,

  // dispatch props
  acceptTokenSuggestion: PropTypes.func.isRequired,
  removeTokenSuggestion: PropTypes.func.isRequired,
  alignTargetToken: PropTypes.func.isRequired,
  unalignTargetToken: PropTypes.func.isRequired,
  moveSourceToken: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  resetVerse: PropTypes.func.isRequired,
  setAlignmentPredictions: PropTypes.func.isRequired,
  clearAlignmentSuggestions: PropTypes.func.isRequired,
  acceptAlignmentSuggestions: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  addBookmark: PropTypes.func.isRequired,
  editTargetVerse: PropTypes.func.isRequired,

  // state props
  username: PropTypes.string.isRequired,
  hasRenderedSuggestions: PropTypes.bool.isRequired,
  verseIsAligned: PropTypes.bool.isRequired,
  verseIsComplete: PropTypes.bool.isRequired,
  verseAlignments: PropTypes.array.isRequired,
  alignedTokens: PropTypes.array.isRequired,
  verseIsValid: PropTypes.bool.isRequired,
  normalizedTargetVerseText: PropTypes.string.isRequired,
  normalizedSourceVerseText: PropTypes.string.isRequired,
  hasSourceText: PropTypes.bool.isRequired,
  hasTargetText: PropTypes.bool.isRequired,
  currentBookmarks: PropTypes.bool.isRequired,
  currentComments: PropTypes.string.isRequired,

  // drag props
  isOver: PropTypes.bool,

  // tc actions
  showPopover: PropTypes.func.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  loadLexiconEntry: PropTypes.func.isRequired,

  // more
  sourceDirection: PropTypes.string.isRequired,
  sourceLanguage: PropTypes.string.isRequired,
  targetDirection: PropTypes.string.isRequired,
  manifest: PropTypes.object.isRequired,

  // old properties
  projectDetailsReducer: PropTypes.object.isRequired,
  resourcesReducer: PropTypes.object.isRequired,
  settingsReducer: PropTypes.shape({ toolsSettings: PropTypes.object.isRequired }).isRequired,
};

export default WordAlignerDemo;
