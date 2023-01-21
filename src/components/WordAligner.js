import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import isEqual from 'deep-equal';
import { Token } from 'wordmap-lexer';
import MissingBibleError from './MissingBibleError';
import AlignmentGrid from './AlignmentGrid';
import WordList from './WordList/index';

const translate=k=>k;

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

/**
 * The base container for this tool
 */
export class WordAligner extends Component {
  constructor(props) {
    super(props);
    this.handleRefreshSuggestions = this.handleRefreshSuggestions.bind(this);
    this.handleAcceptSuggestions = this.handleAcceptSuggestions.bind(this);
    this.handleRejectSuggestions = this.handleRejectSuggestions.bind(this);
    this.handleRemoveSuggestion = this.handleRemoveSuggestion.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.enableAutoComplete = this.enableAutoComplete.bind(this);
    this.disableAutoComplete = this.disableAutoComplete.bind(this);
    this.handleAcceptTokenSuggestion = this.handleAcceptTokenSuggestion.bind(
      this);
    this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
    this.handleVerseEditClick = this.handleVerseEditClick.bind(this);
    this.handleVerseEditClose = this.handleVerseEditClose.bind(this);
    this.handleVerseEditSubmit = this.handleVerseEditSubmit.bind(this);
    this.handleCommentClick = this.handleCommentClick.bind(this);
    this.handleCommentClose = this.handleCommentClose.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.state = {
      loading: false,
      validating: false,
      prevState: undefined,
      writing: false,
      snackText: null,
      canAutoComplete: false,
      resetWordList: false,
      showVerseEditor: false,
      showComments: false,
    };
  }

  handleSnackbarClose() {
    this.setState({ snackText: null });
  }

  handleModalOpen(isOpen) {
    if (isOpen) {
      this.handleResetWordList();
    }
  }

  handleResetWordList() {
    this.setState( { resetWordList: true });
  }

  componentDidUpdate(prevProps) {
    const {
      verseIsAligned,
      verseIsComplete,
    } = this.props;

    const {
      canAutoComplete,
      resetWordList,
    } = this.state;

    if (!WordAligner.contextDidChange(this.props, prevProps)) {
      // auto complete the verse
      if (verseIsAligned && canAutoComplete && !verseIsComplete) {
        this.handleToggleComplete(null, true);
      }
    }

    if (resetWordList) {
      this.setState({ resetWordList: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // When resetWordList goes from true to false, we don't need to render again
    return !(this.state.resetWordList && !nextState.resetWordList);
  }

  /**
   * Checks if the context has changed. e.g. the user navigated away from the previous context.
   * @param nextProps
   * @param prevProps
   * @return {boolean}
   */
  static contextDidChange(nextProps, prevProps) {
    return !isEqual(prevProps.contextId, nextProps.contextId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.contextId && WordAligner.contextDidChange(nextProps, this.props)) {
      // scroll alignments to top when context changes
      let page = document.getElementById('AlignmentGrid');

      if (page) {
        page.scrollTop = 0;
      }

      this.runMAP(nextProps).catch(() => {
      });
      this.disableAutoComplete();
    }
  }

  /**
   * Handles adding secondary words to an alignment
   * @param {Token} token - the secondary word to move
   * @param {object} nextAlignmentIndex - the alignment to which the token will be moved
   * @param {object} [prevAlignmentIndex=null] - the alignment from which the token will be removed.
   */
  handleAlignTargetToken(token, nextAlignmentIndex, prevAlignmentIndex = null) {
    console.log(`handleAlignTargetToken`, {token, nextAlignmentIndex, prevAlignmentIndex});
  }

  /**
   * Handles removing secondary words from an alignment
   * @param {Token} token - the secondary word to remove
   * @param {object} prevAlignmentIndex - the alignment from which the token will be removed.
   */
  handleUnalignTargetToken(token, prevAlignmentIndex) {
    console.log(`handleAlignTargetToken`, {token, prevAlignmentIndex});
  }

  /**
   * Handles (un)merging primary words
   * @param {Token} token - the primary word to move
   * @param {object} nextAlignmentIndex - the alignment to which the token will be moved.
   * @param {object} prevAlignmentIndex - the alignment from which the token will be removed.
   */
  handleAlignPrimaryToken(token, nextAlignmentIndex, prevAlignmentIndex) {
    const {
      moveSourceToken,
      contextId: { reference: { chapter, verse } },
    } = this.props;

    moveSourceToken(chapter, verse, nextAlignmentIndex, prevAlignmentIndex,
      token);
    this.handleToggleComplete(null, false);
  }

  /**
   * Returns the target tokens with used tokens labeled as disabled
   * @return {*}
   */
  getLabeledTargetTokens() {
    const {
      targetTokens,
      alignedTokens,
    } = this.props;
    return targetTokens.map(token => {
      let isUsed = false;

      for (const usedToken of alignedTokens) {
        if (token.toString() === usedToken.toString()
          && token.occurrence === usedToken.occurrence
          && token.occurrences === usedToken.occurrences) {
          isUsed = true;
          break;
        }
      }
      token.disabled = isUsed;
      return token;
    });
  }

  render() {
    const {
      isOver,
      bookId,
      contextId,
      showPopover,
      hasSourceText,
      verseAlignments,
      setToolSettings,
      resourcesReducer,
      loadLexiconEntry,
      connectDropTarget,
      sourceDirection,
      sourceLanguage,
      targetDirection,
      manifest,
    } = this.props;
    const { projectFont: targetLanguageFont = '' } = manifest;
    const targetLanguage = manifest && manifest.target_language;
    let bookName = targetLanguage && targetLanguage.book && targetLanguage.book.name;

    if (!bookName) {
      bookName = bookId; // fall back to book id
    }


    // TODO: use the source book direction to correctly style the alignments

    const { lexicons } = resourcesReducer;

    // TRICKY: do not show word list if there is no source bible.
    let words = [];

    if (hasSourceText) {
      words = this.getLabeledTargetTokens();
    }

    const { reference: { chapter, verse } } = contextId || { reference: { chapter: 1, verse: 1 } };

    // const algnGridFontSize = 100;
    const toolsSettings =
    {
      WordList: {
        fontSize: 100,
      }
    };

    // TRICKY: make hebrew text larger
    let sourceStyle = { fontSize: '100%' };
    const isHebrew = sourceLanguage === 'hbo';

    if (isHebrew) {
      sourceStyle = {
        fontSize: '175%', paddingTop: '2px', paddingBottom: '2px', lineHeight: 'normal', WebkitFontSmoothing: 'antialiased',
      };
    }

    return (
      <DragDropContext>
        <div style={styles.wordListContainer}>
          <WordList
            words={words}
            verse={verse}
            isOver={isOver}
            chapter={chapter}
            direction={targetDirection}
            toolsSettings={toolsSettings}
            reset={this.state.resetWordList}
            setToolSettings={setToolSettings}
            connectDropTarget={connectDropTarget}
            targetLanguageFont={targetLanguageFont}
            onDropTargetToken={this.handleUnalignTargetToken}
          />
        </div>
        <div style={styles.alignmentAreaContainer}>
          <div style={styles.alignmentGridWrapper}>
            <div className='title-bar' style={{ marginTop: '2px', marginBottom: `10px` }}>
              <span>{translate('align_title')}</span>
            </div>
            {hasSourceText ? (
              <AlignmentGrid
                sourceStyle={sourceStyle}
                sourceDirection={sourceDirection}
                targetDirection={targetDirection}
                alignments={verseAlignments}
                translate={translate}
                lexicons={lexicons}
                toolsSettings={toolsSettings}
                onDropTargetToken={this.handleAlignTargetToken}
                onDropSourceToken={this.handleAlignPrimaryToken}
                onCancelSuggestion={this.handleRemoveSuggestion}
                onAcceptTokenSuggestion={this.handleAcceptTokenSuggestion}
                contextId={contextId}
                isHebrew={isHebrew}
                showPopover={showPopover}
                loadLexiconEntry={loadLexiconEntry}
                targetLanguageFont={targetLanguageFont}
              />
            ) : (
              <MissingBibleError translate={translate}/>
            )}
          </div>
        </div>
      </DragDropContext>
    );
  }
}

WordAligner.contextTypes = { store: PropTypes.any.isRequired };

WordAligner.propTypes = {
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
  sourceTokens: PropTypes.arrayOf(PropTypes.instanceOf(Token)).isRequired,
  targetTokens: PropTypes.arrayOf(PropTypes.instanceOf(Token)).isRequired,
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
  connectDropTarget: PropTypes.func,

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

export default WordAligner;
