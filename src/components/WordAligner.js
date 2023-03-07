import React, {useState} from 'react';
import PropTypes from 'prop-types';
import WordList from './WordList/index';
import AlignmentGrid from "./AlignmentGrid";
import {OT_ORIG_LANG} from "../common/constants";
import delay from "../utils/delay";

const TARGET_WORD_BANK=`Target Word Bank`;
const GRID=`Alignment Grid`;
const MERGE_ALIGNMENTS=`Alignment Grid - merge alignments`;
const NEW_ALIGNMENT=`Alignment Grid - new alignment`;
const UNALIGN_TARGET_WORD = `Unalign Target Word`;
const ALIGN_BOTTOM_WORD = `Align Bottom Word`;
const ALIGN_TOP_WORDS = `Align Top Word`;
const lexiconCache_ = {};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    fontSize: '14px',
  },
  groupMenuContainer: {
    width: '250px',
    height: '100%',
  },
  wordListContainer: {
    minWidth: '150px',
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
  wordStyle: {
    backgroundColor: 'lightblue',
    margin: '20px 25%',
    textAlign: 'center',
    fontSize: '40px'
  },
};

/**
 * search word list to find index of token
 * @param {array} wordList
 * @param {object} token
 * @return {number} - index of token or -1 if not found
 */
function findInWordList(wordList, token) {
  let found = -1;
  for (let i = 0, l = wordList.length; i < l; i++) {
    const item = wordList[i];
    if (item.text === token.text &&
      item.tokenOccurrence === token.tokenOccurrence) {
      found = i;
      break;
    }
  }
  return found;
}

/**
 * search tokens array to find index of token
 * @param {array} tokens
 * @param {object} token
 * @return {number} - index of token or -1 if not found
 */
function findToken(tokens, token) {
  let found = -1;
  for (let i = 0, l = tokens.length; i < l; i++) {
    const item = tokens[i];
    if (item.text === token.text &&
      item.occurrence === token.occurrence) {
      found = i;
      break;
    }
  }
  return found;
}

/**
 * search alignments array to find location of target token
 * @param {array} alignments
 * @param {object} token
 * @return {{tokenIndex: number, alignmentIndex: number}} - index of token in alignment and index of alignment, or -1 if not found
 */
function findAlignment(alignments, token) {
  let tokenIndex = -1;
  let alignmentIndex = -1;
  for (let i = 0, l = alignments.length; i < l; i++) {
    const targets = alignments[i].targetNgram;
    tokenIndex = findToken(targets, token)
    if (tokenIndex >= 0) {
      alignmentIndex = i;
      break;
    }
  }
  return { tokenIndex, alignmentIndex };
}

/**
 * convert from token format to format used by word alignment
 * @param {object} token
 * @return {*&{occurrences: *, suggestion: boolean, index: *, occurrence: *, position: *, text}}
 */
function tokenToAlignment(token) {
  return {
    ...token,
    index: token.tokenPos,
    occurrence: token.tokenOccurrence,
    occurrences: token.tokenOccurrences,
    position: token.tokenPos,
    suggestion: false,
    text: token.text,
  }
}

/**
 * const from word alignment fromat to token format
 * @param {object} alignment
 * @return {*&{tokenOccurrence, tokenOccurrences, text, tokenPos}}
 */
function alignmentToToken(alignment) {
  return {
    ...alignment,
    tokenPos: alignment.index,
    tokenOccurrence: alignment.occurrence,
    tokenOccurrences: alignment.occurrences,
    text: alignment.text,
  }
}

/**
 * clean up alignment data:
 *     - remove any alignments that have no words
 *     - sort the source and target words within each card
 *     - sort the alignment cards to by primary words
 * @param {array} alignments
 * @return {*[]}
 */
function alignmentCleanup(alignments) {
  let alignments_ = [...alignments]

  // remove empty and sort words
  for (let i = 0; i < alignments_.length; i++) {
    const alignment = alignments_[i]
    if (!alignment.targetNgram.length && !alignment.sourceNgram.length) {
      alignments_.splice(i, 1);
      i--; // backup to accommodate deleted item
    } else { // order words in alignment
      alignment.targetNgram = alignment.targetNgram.sort(indexComparator)
      alignment.sourceNgram = alignment.sourceNgram.sort(indexComparator)
    }
  }

  // alignment ordering by source words
  alignments_ = alignments_.sort(alignmentComparator);

  // update index and ordering
  for (let i = 0; i < alignments_.length; i++) {
    const alignment = alignments_[i]
    alignment.index = i;
  }

  return alignments_;
}

/**
 * get the sort order for sorting alignments - uses the first word in the primary tokens
 * @param {object} alignment
 * @return {number|*}
 */
function sortIndexForAlignment(alignment) {
  if (alignment.sourceNgram.length) {
    const index = alignment.sourceNgram[0].index;
    return index
  }
  return -1
}

/**
 * sort comparator function for alignments
 * @param a
 * @param b
 * @return {number}
 */
const alignmentComparator = (a, b) => sortIndexForAlignment(a) - sortIndexForAlignment(b);

/**
 * sort comparator function for ngram arrays
 * @param a
 * @param b
 * @return {number}
*/
const indexComparator = (a, b) => a.index - b.index;

/**
 * @callback LoadLexiconEntryCB
 * @param {string} lexiconId
 * @param {string} entryId
 */

/**
 * @typedef ContextID
 * @param {object} details
 * @property {string} book
 * @property {string} chapter
 * @property {string} verse
 */

/**
 * @callback OnChangeCB
 * @param {object} details
 * @param {string} details.type is type of alignment change
 * @param {string} details.source - source(s) of the word being changed
 * @param {string} details.destination - destination of the word being changed
 * @param {array} details.verseAlignments - array of current verse alignments
 * @param {array} details.wordListWords - array of current target words
 * @param {ContextID} details.contextId - context of current verse
 */

/**
 * @callback ShowPopOverCB
 * @param {object} PopoverTitle - JSX to show on title of popover
 * @param {object} wordDetails - JSX to show on body of popover
 * @param {object} positionCoord - where to position to popover
 */

/**
 * @callback TranslateCB
 * @param {string} key - key for locale string lookup
 */

/**
 * WordAligner is a stand-alone component for aligning words
 * @param {(book, chapter, verse)} contextId - current verse context
 * @param {object|null} lexiconCache - cache for lexicon data
 * @param {LoadLexiconEntryCB} loadLexiconEntry - callback to load lexicon for language and strong number
 * @param {OnChangeCB} onChange - optional callback for whenever alignment changed
 * @param {ShowPopOverCB} showPopover - callback function to display a popover
 * @param {string} sourceLanguageFont - font to use for source
 * @param {string} sourceFontSizePercent - percentage size for font
 * @param {string} targetLanguageFont - font to use for target
 * @param {string} targetFontSizePercent - percentage size f
 * @param {TranslateCB} translate - callback to look up localized text
 * @param {array} verseAlignments - initial verse alignment
 * @param {array} wordListWords - initial list of target words in wordbank
 * @return {JSX.Element}
 * @constructor
 */

const WordAligner = ({
  contextId,
  lexiconCache = lexiconCache_,
  loadLexiconEntry,
  onChange,
  showPopover = null,
  sourceLanguageFont = '',
  sourceFontSizePercent = 100,
  targetLanguageFont = '',
  targetFontSizePercent = 100,
  translate,
  verseAlignments,
  wordListWords,
  }) => {
  const [dragToken, setDragToken] = useState(null);
  const [verseAlignments_, setVerseAlignments] = useState(verseAlignments);
  const [wordListWords_, setWordListWords] = useState(wordListWords);
  const [resetDrag, setResetDrag] = useState(false);

  const over = false;
  const targetDirection = 'ltr';
  const sourceDirection = 'ltr';
  const toolsSettings = {};
  const setToolSettings = () => {
    console.log('setToolSettings')
  };

  /**
   * callback for each alignment change so that app can keep track of last change or update valid alignment badge
   * @param {object} results
   * @param {string} results.type is type of alignment change
   * @param {string} results.source - source(s) of the word being changed
   * @param {string} results.destination - destination of the word being changed
   */
  function doChangeCallback(results = {}) {
    onChange && onChange({
      ...results,
      verseAlignments: verseAlignments_,
      wordListWords: wordListWords_,
      contextId,
    });
  }

  /**
   * does cleanup for new verse alignments before saving to state
   * @param {array} verseAlignments
   */
  function updateVerseAlignments(verseAlignments) {
    verseAlignments = alignmentCleanup(verseAlignments);
    setVerseAlignments(verseAlignments);
  }

  /**
   * unalign target word - find in alignment card and remove, then clear the disabled flag in the word bank
   * @param {object} targetToken - target word to unalign
   */
  const handleUnalignTargetToken = (targetToken) => {
    console.log('handleUnalignTargetToken')
    const source=GRID
    const destination=TARGET_WORD_BANK
    const { found, alignment } = findAlignment(verseAlignments_, targetToken);
    if (alignment >= 0) {
      const verseAlignments = [...verseAlignments_]
      verseAlignments[alignment].targetNgram.splice(found, 1);
      updateVerseAlignments(verseAlignments);
    }

    const found_ = findInWordList(wordListWords_, alignmentToToken(targetToken));
    if (found_ >= 0) {
      const wordListWords = [...wordListWords_]
      wordListWords[found_].disabled = false;
      setWordListWords(wordListWords);
    }
    setResetDrag(true) // clear the selected words
    doChangeCallback({
      type: UNALIGN_TARGET_WORD,
      source,
      destination,
    });
  };

  /**
   * add target token to alignment card - it can either be from word bank or a different alignment card
   * @param {object} targetToken- target word to align or change alignment
   * @param {number} alignmentIndex - index of alignment card that target word is going to
   * @param {number} srcAlignmentIndex - index of alignment card that target word is coming from, -1 means it was an unaligned word in the word bank
   */
  const handleAlignTargetToken = (targetToken, alignmentIndex, srcAlignmentIndex) => {
    console.log('handleAlignTargetToken', {alignmentIndex, srcAlignmentIndex})
    if (alignmentIndex !== srcAlignmentIndex) {
      const destination=GRID
      let source=GRID
      const verseAlignments = [...verseAlignments_]
      const dest = verseAlignments[alignmentIndex];
      let src = null;
      let found = -1;
      if (srcAlignmentIndex >= 0) { // coming from a different alignment card
        src = verseAlignments[srcAlignmentIndex];
        found = findToken(src.targetNgram, targetToken);
        if (found >= 0) {
          src.targetNgram.splice(found, 1);
        }
      } else { // coming from word list
        source=TARGET_WORD_BANK
        const found = findInWordList(wordListWords_, targetToken);
        if (found >= 0) {
          const wordListWords = [...wordListWords_]
          wordListWords[found].disabled = true;
          setWordListWords(wordListWords);
          targetToken = tokenToAlignment(targetToken);
        }
        setResetDrag(true)
      }

      dest.targetNgram.push(targetToken);
      updateVerseAlignments(verseAlignments);
      doChangeCallback({
        type: ALIGN_BOTTOM_WORD,
        source,
        destination,
      });
    }
  };

  /**
   * moves the primary token to a different alignment or split off as new alignment.
   *    if the source alignment is now empty of primary words, then move all the target words as well.
   * @param {object} primaryToken
   * @param alignmentIndex
   * @param srcAlignmentIndex
   * @param startNew
   */
  const handleAlignPrimaryToken = (primaryToken, alignmentIndex, srcAlignmentIndex, startNew) => {
    console.log('handleAlignPrimaryToken', {alignmentIndex, srcAlignmentIndex, startNew})
    if ((alignmentIndex !== srcAlignmentIndex) || startNew) {
      let destination=MERGE_ALIGNMENTS
      const source=GRID
      let verseAlignments = [...verseAlignments_]
      let dest = verseAlignments[alignmentIndex];
      let src = null;
      let found = -1;
      let emptySource = false;
      if (srcAlignmentIndex >= 0) { // find source alignment for primary word and remove the word
        src = verseAlignments[srcAlignmentIndex];
        found = findToken(src.sourceNgram, primaryToken);
        if (found >= 0) {
          src.sourceNgram.splice(found, 1);
          emptySource = !src.sourceNgram.length; // check if source alignment has any primary words left
        }
      }

      if (startNew) { // insert word into a new alignment
        destination = NEW_ALIGNMENT;
        const newPosition = alignmentIndex + 1;
        dest = {
          index: newPosition,
          isSuggestion: false,
          sourceNgram: [ primaryToken ],
          targetNgram: [],
        }
        verseAlignments.splice(newPosition, 0, dest)
        for (let i = newPosition + 1; i < verseAlignments.length; i++) {
          const item = verseAlignments[i]
          item.index++;
        }
      } else { // add to existing alignment
        dest.sourceNgram.push(primaryToken);
        dest.sourceNgram = dest.sourceNgram.sort(indexComparator)
      }

      if (emptySource && src) { // if source alignment is empty, move all the target words to the new alignment
        const targets = src.targetNgram;
        src.targetNgram = [];
        dest.targetNgram = dest.targetNgram.concat(targets);
        dest.targetNgram = dest.targetNgram.sort(indexComparator)
      }
      updateVerseAlignments(verseAlignments);
      doChangeCallback({
        type: ALIGN_TOP_WORDS,
        source,
        destination,
      });
    }
  };

  let sourceStyle = { fontSize: `${sourceFontSizePercent}%` };

  if (sourceFontSizePercent > 120) {
    sourceStyle = {
      ...sourceStyle, paddingTop: '2px', paddingBottom: '2px', lineHeight: 'normal', WebkitFontSmoothing: 'antialiased',
    };
  }

  if (resetDrag) {
    delay(100).then(() => { // wait a moment for reset to happen before clearing
      setResetDrag(false)
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.wordListContainer}>
        <WordList
          words={wordListWords_}
          verse={contextId.reference.verse}
          isOver={over}
          chapter={contextId.reference.chapter}
          direction={targetDirection}
          toolsSettings={toolsSettings}
          reset={resetDrag}
          setToolSettings={setToolSettings}
          targetLanguageFont={targetLanguageFont}
          onDropTargetToken={handleUnalignTargetToken}
          dragToken={dragToken}
          setDragToken={setDragToken}
        />
      </div>
      <AlignmentGrid
        sourceStyle={sourceStyle}
        sourceDirection={sourceDirection}
        targetDirection={targetDirection}
        alignments={verseAlignments_}
        translate={translate}
        lexicons={lexicons}
        reset={resetDrag}
        toolsSettings={toolsSettings}
        onDropTargetToken={handleAlignTargetToken}
        onDropSourceToken={handleAlignPrimaryToken}
        contextId={contextId}
        isHebrew={isHebrew}
        showPopover={showPopover}
        loadLexiconEntry={loadLexiconEntry}
        targetLanguageFont={targetLanguageFont}
        dragToken={dragToken}
        setDragToken={setDragToken}
      />

    </div>

  );
};

WordAligner.propTypes = {
  contextId: PropTypes.object.isRequired,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showPopover: PropTypes.func.isRequired,
  sourceLanguageFont: PropTypes.string,
  sourceFontSizePercent: PropTypes.number,
  targetLanguageFont: PropTypes.string,
  targetFontSizePercent: PropTypes.number,
  translate: PropTypes.func.isRequired,
  verseAlignments: PropTypes.array.isRequired,
  wordListWords: PropTypes.array.isRequired,
};
export default WordAligner;
