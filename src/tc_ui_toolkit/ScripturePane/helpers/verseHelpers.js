'use strict';
import React from 'react';
import isEqual from 'deep-equal';
import * as stringTokenizer from 'string-punctuation-tokenizer';
import { VerseObjectUtils } from 'word-aligner';
import { getVerses } from 'bible-reference-range';
// helpers
import * as highlightHelpers from './highlightHelpers';
import {
  createHighlightedSpan,
  createNonClickableSpan,
  createTextSpan,
  onWordClick,
} from './htmlElementsHelpers';
import {
  hasLeadingSpace,
  hasTrailingSpace,
  removeMarker,
} from './usfmHelpers';
import {
  isIsolatedLeftQuote,
  isNestedMilestone,
  isWord,
  punctuationWordSpacing,
  textIsEmptyInVerseObject,
} from './stringHelpers';

/**
 * if showing USFM codes, replace newlines
 * @param {string} text
 * @param {boolean} showUsfm
 * @return {JSX.Element}
 */
function textToHtml(text, showUsfm) {
  if (showUsfm && (text.indexOf('\n') >= 0)) {
    const parts = text.split('\n');
    const html = [parts[0]];

    for (let i = 1; i < parts.length; i++) {
      html.push('↲');
      html.push(<br/>);
      html.push(parts[i]);
    }
    return html;
  }
  return text;
}

/**
 * render text as HTML and overlay any selections
 * @param {String} verseText
 * @param {Array} selections - text selections to highlight
 * @param {Function} translate
 * @param {Object} fontStyle - font specific styling
 * @param {boolean} isTargetBible
 * @param {String} fontClass
 * @param {boolean} showUsfm
 * @return {*}
 */
export const verseString = (verseText, selections, translate, fontStyle = null, isTargetBible, fontClass, showUsfm) => {
  let newVerseText = verseText;

  if (!showUsfm) {
    newVerseText = removeMarker(verseText);
    newVerseText = newVerseText.replace(/\s+/g, ' ');
    // if string only contains spaces then make it an empty string
    newVerseText = newVerseText.replace(/\s/g, '').length === 0 ? '' : newVerseText;
  }

  // if empty string then newVerseText = place holder warning.
  if (newVerseText.length === 0) {
    newVerseText = translate('pane.missing_verse_warning');
  }

  let verseTextSpans = <span className={fontClass}>{textToHtml(newVerseText, showUsfm)}</span>;

  if (!showUsfm && selections && selections.length > 0) {
    const _selectionArray = stringTokenizer.selectionArray(newVerseText, selections);
    verseTextSpans = [];
    verseTextSpans.length = 0;

    for (let i = 0, len = _selectionArray.length; i < len; i++) {
      const selection = _selectionArray[i];
      const index = i;
      let spanStyle = { backgroundColor: selection.selected ? 'var(--highlight-color)' : '' };

      if (fontStyle) {
        spanStyle = {
          ...spanStyle,
          ...fontStyle,
        };
      }
      verseTextSpans.push(
        <span key={index} className={fontClass} style={spanStyle}>
          {selection.text}
        </span>,
      );
    }
  }

  return verseTextSpans;
};

/**
 * create verse elements from an array of verse objects
 * @param {Array|Object} verseText - verse data
 * @param {String} bibleId
 * @param {Object} contextId
 * @param {Function} getLexiconData
 * @param {Boolean} showPopover
 * @param {Function} translate
 * @param {Object} fontStyle - font specific styling
 * @param {String} fontClass - font class name
 * @param {array} verseWordCounts - array of word counts for multi-verse
 * @return {Array} - verse elements to display
 */
export function verseArray(verseText = [], bibleId, contextId, getLexiconData, showPopover, translate, fontStyle = null, fontClass, verseWordCounts = null) {
  let verseObjects = VerseObjectUtils.getWordListForVerse(verseText);
  let wordSpacing = '';
  let previousWord = null;
  const verseSpan = [];
  verseSpan.length = 0;

  if (verseText.verseObjects && textIsEmptyInVerseObject(verseText, bibleId)) { // if empty verse string.
    verseSpan.push(
      <span key={translate('pane.missing_verse_warning')}>
        {translate('pane.missing_verse_warning')}
      </span>,
    );
  } else {
    const isHebrew = (bibleId === 'uhb');
    const origLangBible = isHebrew || bibleId === 'ugnt';
    verseObjects = Array.isArray(verseObjects) ? verseObjects : verseObjects.verseObject;

    for (let i = 0, len = verseObjects.length; i < len; i++) {
      const object = verseObjects[i];
      const index = i;
      const nextWord = verseObjects[index + 1];

      if (object.type === 'html') {
        verseSpan.push(object.html);
      } else if (isWord(object)) {
        const padding = wordSpacing;
        wordSpacing = ' '; // spacing between words
        const text = (object.word || object.text);
        let isHighlightedWord = false;
        let isBetweenHighlightedWord = false;

        if (origLangBible && contextId.quote && object.text) {
          isHighlightedWord = highlightHelpers.isWordMatch(object, contextId, verseObjects, index);
          isBetweenHighlightedWord = previousWord && !isEqual(previousWord, object) &&
            highlightHelpers.isWordMatch(previousWord, contextId, verseObjects, index - 1) && isHighlightedWord;
        } else if (contextId.quote && object.content) {
          const highlightedDetails = highlightHelpers.getWordHighlightedDetails(contextId, previousWord, object, verseWordCounts);
          isHighlightedWord = highlightedDetails.isHighlightedWord;
          isBetweenHighlightedWord = highlightedDetails.isBetweenHighlightedWord;
        }
        // Save word to be used as previousWord in next word.
        previousWord = object;
        const paddingSpanStyle = { backgroundColor: isBetweenHighlightedWord ? 'var(--highlight-color)' : 'transparent' };

        // TRICKY: for now we are disabling lexicon popups for any bible that is not ugnt or uhb. The reason for
        // this is than some bibles have different strongs format. We are waiting on long term solution.
        if (object.strong && origLangBible) { // if clickable
          let spanStyle = { backgroundColor: isHighlightedWord ? 'var(--highlight-color)' : '' };

          if (fontStyle) {
            spanStyle = {
              ...spanStyle,
              ...fontStyle,
            };
          }
          verseSpan.push(
            <span
              key={index.toString()}
              onClick={(e) => onWordClick(e, object, getLexiconData, showPopover, translate, isHebrew)}
              style={{ cursor: 'pointer' }}
            >
              <span className={fontClass} style={paddingSpanStyle}>
                {padding}
              </span>
              <span className={fontClass} style={spanStyle}>
                {removeMarker(text)}
              </span>
            </span>,
          );
        } else {
          verseSpan.push(createNonClickableSpan(index, paddingSpanStyle, padding, isHighlightedWord, text, fontClass));
        }
      } else if (isNestedMilestone(object)) { // if nested milestone
        const nestedMilestone = highlightHelpers.getWordsFromNestedMilestone(object, contextId, index, previousWord, wordSpacing, fontClass, verseWordCounts);

        for (let j = 0, nLen = nestedMilestone.wordSpans.length; j < nLen; j++) {
          const nestedWordSpan = nestedMilestone.wordSpans[j];
          verseSpan.push(nestedWordSpan);
        }
        previousWord = nestedMilestone.nestedPreviousWord;
        wordSpacing = nestedMilestone.nestedWordSpacing;
      } else if (object.text) { // if not word, show punctuation, etc. but not clickable
        let text = object.text;

        if (hasLeadingSpace(text)) { // leading spaces are not significant in html, so we need to replace with a hard space
          text = text.substr(1);
          highlightHelpers.addSpace(verseSpan, fontClass);
        }

        const trailingSpace = hasTrailingSpace(text);

        if (trailingSpace && text) { // trailing spaces are not significant in html, so we need to replace with a hard space
          text = text.substr(0, text.length - 1);
        }

        const isUsfmTagNotSpan = object.tag && !object.endTag; // see if USFM tag does not have a matching end tag.

        if (isUsfmTagNotSpan || isIsolatedLeftQuote(text)) { // if this was not just simple text marker, need to add whitespace
          highlightHelpers.addSpace(verseSpan);
        }
        wordSpacing = punctuationWordSpacing(object); // spacing before words

        if (highlightHelpers.isPunctuationHighlighted(previousWord, nextWord, contextId, verseObjects, index, verseWordCounts)) {
          verseSpan.push(createHighlightedSpan(index, text, fontClass));
        } else {
          verseSpan.push(createTextSpan(index, text, fontClass));
        }

        if (trailingSpace) { // add the trailing space after the text span
          highlightHelpers.addSpace(verseSpan);
        }
      }
    }
  }

  return verseSpan;
}

/**
 * get verse range from span
 * @param {string} verseSpan
 * @return {{high: number, low: number}}
 */
export function getVerseSpanRange(verseSpan) {
  let [low, high] = verseSpan.split('-');

  if (low && high) {
    low = parseInt(low, 10);
    high = parseInt(high, 10);

    if ((low > 0) && (high >= low)) {
      return { low, high };
    }
  }
  return {};
}

/**
 * splits verse list into individual verses
 * @param {string} verseStr
 * @return {[number]}
 */
export function getVerseList(verseStr) {
  const verses = verseStr.toString().split(',');
  return verses;
}

/**
 * test if verse is valid verse span string
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseSpan(verse) {
  const isSpan = (typeof verse === 'string') && verse.includes('-');
  return isSpan;
}

/**
 * test if verse is valid verse list (verse numbers separated by commas)
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseList(verse) {
  const isList = (typeof verse === 'string') && verse.includes(',');
  return isList;
}

/**
 * test if verse is valid verse span or verse list
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseSet(verse) {
  const isSet = isVerseSpan(verse) || isVerseList(verse);
  return isSet;
}

/**
 * get bible from bibles
 * @param {object} bibles
 * @param {string} languageId
 * @param owner
 * @param bibleId
 * @return {*}
 */
export function getBibleElement(bibles, languageId, bibleId, owner = null) {
  const key = (owner && languageId !== 'targetLanguage') ? `${languageId}_${owner}` : languageId;
  const bibleElement = bibles[key]?.[bibleId];
  return bibleElement;
}

/**
 * try to find verse from chapter.  If not found look for verse spans
 * @param {object} bible
 * @param {string} chapter
 * @param {string} verse
 * @return {object|null}
 */
export function getVerseDataFromBible(bible, chapter, verse) {
  let verseData = null;
  let verseLabel = null;

  try {
    const chapterData = bible[chapter];

    if (chapterData) {
      verseData = chapterData[verse];

      if (verseData) {
        verseLabel = verse;
      } else { // search for verse span that contains verse
        const verseVal = parseInt(verse);

        for (let verseIndex in chapterData) {
          if (isVerseSpan(verseIndex)) {
            const { low, high } = getVerseSpanRange(verseIndex);

            if ( (verseVal >= low) && (verseVal <= high) ) {
              verseData = chapterData[verseIndex];
              verseLabel = verseIndex;
              break;
            }
          }
        }
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return { verseData, verseLabel };
}

/**
 * check to see if verseLabel is a span, if so see if verse is the first verse in the span
 * @param {string} verseLabel - verse label to test for span
 * @param {string|number} verse - verse number to check if first verse in span
 * @return {object|null}
 */
export function isVerseInSpan(verseLabel, verse) {
  let isVerseSpan = false, isFirstVerse = false;

  if (verseLabel) {
    try {
      const [, hi] = verseLabel.split('-');
      isVerseSpan = !!hi;

      if (isVerseSpan) {
        if (typeof verse === 'string') {
          verse = parseInt(verse);
        }

        const startVerse = parseInt(verseLabel);
        isFirstVerse = (verse === startVerse);
      }
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }
  return { isVerseSpan, isFirstVerse };
}

/**
 * count original words in verseObjects - it is nested so this is recursive
 * @param {array} verseObjects
 * @param {number} verseCnt
 * @param {boolean} multiVerse
 * @param {object} previousVerseWordCounts
 * @param {object} currentVerseCounts
 */
function countOriginalWords(verseObjects, verseCnt, multiVerse, currentVerseCounts, previousVerseWordCounts) {
  if (verseObjects) {
    for (const vo of verseObjects) {
      if (multiVerse && (vo?.tag === 'zaln')) {
        vo.verseCnt = verseCnt;
        const origWord = vo?.content;

        if (origWord) {
          const previousCount = previousVerseWordCounts[origWord] || 0;
          const currentCount = currentVerseCounts[origWord] || 0;

          if (!currentCount) {
            currentVerseCounts[origWord] = vo.occurrences + previousCount;
          }

          if (vo.children) {
            countOriginalWords(vo.children, verseCnt, multiVerse, currentVerseCounts, previousVerseWordCounts);
          }
        }
      }
    }
  }
}

/**
 * gets verse data for verseList
 * @param {object} bookData
 * @param {number|string} chapter
 * @param {string} verseList - can be a single verse, comma separated list of verses or verse range
 * @param {function} createVerseMarker - to create a verse marker
 * @returns {{verseData: {verseObjects: *[]}, verseLabel: string}}
 */
export function getVerseData(bookData, chapter, verseList, createVerseMarker) {
  let verseLabel = '';
  let initialChapter;
  const refs = getVerses(bookData, `${chapter}:${verseList}`);
  let verseSpanData = [];
  const history = []; // to guard against duplicate verses
  let verseWordCounts = [];
  const multiVerse = refs.length > 1;

  if (refs && refs.length) {
    initialChapter = refs[0].chapter;
  }

  for (let verseCnt = 0; verseCnt < refs.length; verseCnt++) {
    const previousVerseWordCounts = verseCnt > 0 ? verseWordCounts[verseCnt-1] : {};
    const currentVerseCounts = {};
    verseWordCounts.push(currentVerseCounts);
    const ref = refs[verseCnt];
    const chapter = ref.chapter;
    const data = ref.verseData;
    let label = ref.verse;

    if (chapter !== initialChapter) {
      label = `${chapter}:${label}`;
    }

    if (data && !history.includes(label)) { // skip over duplicates
      history.push(label + '');

      if (verseSpanData.length) {
        verseSpanData.push(createVerseMarker(label));
      }

      if (typeof data === 'string') { // if data is string type, we need to wrap as a text verse object
        verseSpanData.push({
          type: 'text',
          text: data,
        });
      } else { // get cumulative word counts for each verse
        const verseObjects = data?.verseObjects;

        if (verseObjects) {
          countOriginalWords(verseObjects, verseCnt, multiVerse, currentVerseCounts, previousVerseWordCounts, verseWordCounts);
          Array.prototype.push.apply(verseSpanData, data.verseObjects);
          const words = Object.keys(previousVerseWordCounts);

          for (const word of words) { // update current verse with counts from previous verse
            if (!currentVerseCounts[word]) {
              currentVerseCounts[word] = previousVerseWordCounts[word];
            }
          }
        }
      }

      if (!verseLabel) {
        verseLabel = label.toString();
      }
    }
  }

  if (!multiVerse) {
    verseWordCounts = null;
  }

  const verseData = { verseObjects: verseSpanData };
  return {
    verseData,
    verseLabel,
    multiVerse,
    verseWordCounts,
  };
}


/**
 * create html to mark verse
 * @param verse
 * @return {JSX.Element}
 */
export function getVerseMarker(verse) {
  return <><br/><b>{verse}</b> </>;
}

/**
 * create an html object to insert into scripture pane
 * @param {JSX.Element} html
 * @return {{html, text: string, type: string}}
 */
function createHtmlInsert(html) {
  return {
    type: 'html',
    html: html,
    text: '',
  };
}

/**
 * create an object to mark the beginning of a verse
 * @param {string} verse
 * @return {object}
 */
export function createVerseMarker(verse) {
  return createHtmlInsert(getVerseMarker(verse));
}
