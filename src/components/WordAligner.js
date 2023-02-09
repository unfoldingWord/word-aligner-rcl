import React, {useState} from 'react';
import WordList from './WordList/index';
import AlignmentGrid from "./AlignmentGrid";
import {OT_ORIG_LANG} from "../common/constants";
import delay from "../utils/delay";

const WORD_BANK=`Word Bank`;
const GRID=`Alignment Grid`;
const MERGE_ALIGNMENTS=`Alignment Grid - merget alignments`;
const NEW_ALIGNMENT=`Alignment Grid - new alignment`;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    // width: '100vw',
    // height: '100%',
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

function findAlignment(alignments, token) {
  let found = -1;
  let alignment = -1;
  for (let i = 0, l = alignments.length; i < l; i++) {
    const targets = alignments[i].targetNgram;
    found = findToken(targets, token)
    if (found >= 0) {
      alignment = i;
      break;
    }
  }
  return { found, alignment };
}

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

function alignmentToToken(alignment) {
  return {
    ...alignment,
    tokenPos: alignment.index,
    tokenOccurrence: alignment.occurrence,
    tokenOccurrences: alignment.occurrences,
    text: alignment.text,
  }
}

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

function indexForAlignment(alignment) {
  if (alignment.sourceNgram.length) {
    const index = alignment.sourceNgram[0].index;
    return index
  }
  return -1
}

const alignmentComparator = (a, b) => indexForAlignment(a) - indexForAlignment(b);

const indexComparator = (a, b) => a.index - b.index;

const WordAligner = ({
    verseAlignments,
    wordListWords,
    translate,
    contextId,
    targetLanguageFont,
    sourceLanguage,
    showPopover,
    lexicons,
    loadLexiconEntry,
    onChange,
    getLexiconData
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

  function doChangeCallback(results = {}) {
    onChange && onChange({
      ...results,
      verseAlignments: verseAlignments_,
      wordListWords: wordListWords_,
      contextId,
    });
  }

  function updateVerseAlignments(verseAlignments) {
    verseAlignments = alignmentCleanup(verseAlignments);
    setVerseAlignments(verseAlignments);
  }

  const handleUnalignTargetToken = (item) => {
    console.log('handleUnalignTargetToken')
    const source=GRID
    const target=WORD_BANK
    const { found, alignment } = findAlignment(verseAlignments_, item);
    if (alignment >= 0) {
      const verseAlignments = [...verseAlignments_]
      verseAlignments[alignment].targetNgram.splice(found, 1);
      updateVerseAlignments(verseAlignments);
    }

    const found_ = findInWordList(wordListWords_, alignmentToToken(item));
    if (found_ >= 0) {
      const wordListWords = [...wordListWords_]
      wordListWords[found_].disabled = false;
      setWordListWords(wordListWords);
    }
    setResetDrag(true)
    doChangeCallback({
      step: `Unalign Bottom Word`,
      source,
      target,
    });
  };

  const handleAlignTargetToken = (item, alignmentIndex, srcAlignmentIndex) => {
    console.log('handleAlignTargetToken', {alignmentIndex, srcAlignmentIndex})
    if (alignmentIndex !== srcAlignmentIndex) {
      const target=GRID
      let source=GRID
      const verseAlignments = [...verseAlignments_]
      const dest = verseAlignments[alignmentIndex];
      let src = null;
      let found = -1;
      if (srcAlignmentIndex >= 0) {
        src = verseAlignments[srcAlignmentIndex];
        found = findToken(src.targetNgram, item);
        if (found >= 0) {
          src.targetNgram.splice(found, 1);
        }
      } else { // coming from word list
        source=WORD_BANK
        const found = findInWordList(wordListWords_, item);
        if (found >= 0) {
          const wordListWords = [...wordListWords_]
          wordListWords[found].disabled = true;
          setWordListWords(wordListWords);
          item = tokenToAlignment(item);
        }
        setResetDrag(true)
      }

      dest.targetNgram.push(item);
      updateVerseAlignments(verseAlignments);
      doChangeCallback({
        step: `Align Bottom Word`,
        source,
        target,
      });
    }
  };

  const handleAlignPrimaryToken = (item, alignmentIndex, srcAlignmentIndex, startNew) => {
    console.log('handleAlignPrimaryToken', {alignmentIndex, srcAlignmentIndex, startNew})
    if ((alignmentIndex !== srcAlignmentIndex) || startNew) {
      let target=MERGE_ALIGNMENTS
      const source=GRID
      let verseAlignments = [...verseAlignments_]
      let dest = verseAlignments[alignmentIndex];
      let src = null;
      let found = -1;
      let emptySource = false;
      if (srcAlignmentIndex >= 0) {
        src = verseAlignments[srcAlignmentIndex];
        found = findToken(src.sourceNgram, item);
        if (found >= 0) {
          src.sourceNgram.splice(found, 1);
          emptySource = !src.sourceNgram.length;
        }
      }

      if (startNew) { // insert a new alignment
        target = NEW_ALIGNMENT;
        const newPosition = alignmentIndex + 1;
        dest = {
          index: newPosition,
          isSuggestion: false,
          sourceNgram: [ item ],
          targetNgram: [],
        }
        verseAlignments.splice(newPosition, 0, dest)
        for (let i = newPosition + 1; i < verseAlignments.length; i++) {
          const item = verseAlignments[i]
          item.index++;
        }
      } else { // add to existing alignment
        dest.sourceNgram.push(item);
        dest.sourceNgram = dest.sourceNgram.sort(indexComparator)
      }

      if (emptySource && src) {
        const targets = src.targetNgram;
        src.targetNgram = [];
        dest.targetNgram = dest.targetNgram.concat(targets);
        dest.targetNgram = dest.targetNgram.sort(indexComparator)
      }
      updateVerseAlignments(verseAlignments);
      doChangeCallback({
        step: `Align Top Word`,
        source,
        target,
      });
    }
  };
  
  // TRICKY: make hebrew text larger
  let sourceStyle = { fontSize: '100%' };
  const isHebrew = sourceLanguage === OT_ORIG_LANG;

  if (isHebrew) {
    sourceStyle = {
      fontSize: '175%', paddingTop: '2px', paddingBottom: '2px', lineHeight: 'normal', WebkitFontSmoothing: 'antialiased',
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
        getLexiconData={getLexiconData}
      />

    </div>

  );
};

export default WordAligner;
