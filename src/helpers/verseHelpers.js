import usfmjs from 'usfm-js';
import { getVerses } from 'bible-reference-range';
import { normalizeString } from './stringHelpers';
import { isVerseWithinVerseSpan } from './groupDataHelpers';

/**
 * find verse data from verse or verse span
 * @param {object} currentBible
 * @param {string} chapter
 * @param {string|number} verse
 * @param {boolean} addVerseRef - if true then we add verse marker inline
 * @return {null|*}
 */
export function getBestVerseFromBook(currentBible, chapter, verse, addVerseRef=false) {
  let chapterData = currentBible && currentBible[chapter];

  if (!chapterData) {
    const c = parseInt(chapter, 10);
    chapterData = currentBible && currentBible[c];
  }

  let verseData = getBestVerseFromChapter(chapterData, verse, addVerseRef);

  if (verseData) {
    return verseData;
  }
  return '';
}

/**
 * find verse in chapter, if not found check if within a verse span
 * @param {string} verse
 * @param {object} chapterData
 * @returns {{ verseData, verseLabel }}
 */
export function getVerse(chapterData, verse ) {
  const verseNum = parseInt(verse, 10);
  let verseData = chapterData[verseNum];
  let verseLabel = null;

  if (verseData) {
    verseLabel = verseNum;
  } else {
    for (let verse_ in chapterData) {
      if (verseHelpers.isVerseSpan(verse_)) {
        if (isVerseWithinVerseSpan(verse_, verseNum)) {
          verseData = chapterData[verse_];
          verseLabel = verse_;
          break;
        }
      }
    }
  }
  return { verseData, verseLabel };
}

/**
 * append verse to verses array
 * @param {object} chapterData
 * @param {string} verse - verse to fetch (could be verse span)
 * @param {array} history
 * @param {array} verses - array of verses text
 * @param {boolean} addVerseRef - if true then we add verse marker inline
 */
function addVerse(chapterData, verses, history, verse, addVerseRef=false) {
  const { verseData, verseLabel } = getVerse(chapterData, verse);

  if (verseData && !history.includes(verseLabel)) {
    if (addVerseRef && verses.length) {
      verses.push(verse + ' ');
    }

    history.push(verseLabel + '');
    verses.push(verseData);
  }
}

/**
 * find verse data from verse or verse span
 * @param {object} chapterData
 * @param {string|number} verse
 * @param {boolean} addVerseRef - if true then we add verse marker inline
 * @return {null|*}
 */
export function getBestVerseFromChapter(chapterData, verse, addVerseRef=false) {
  if (chapterData) {
    let verseData = chapterData?.[verse];

    if (!verseData) {
      const history = []; // to guard against duplicate verses
      const verseList = verseHelpers.getVerseList(verse);
      let verses = [];

      for (const verse_ of verseList) {
        if (verseHelpers.isVerseSpan(verse_)) {
          // iterate through all verses in span
          const { low, high } = verseHelpers.getVerseSpanRange(verse_);

          for (let i = low; i <= high; i++) {
            addVerse(chapterData, verses, history, i, addVerseRef);
          }
        } else { // not a verse span
          addVerse(chapterData, verses, history, verse_, addVerseRef);
        }
      }

      let allStrings = true;
      let verseObjects = [];

      for (const verse of verses) {
        if (typeof verse !== 'string') {
          allStrings = false;
          break;
        }
      }

      if (allStrings) {
        return verses && verses.join('\n') || null;
      }

      for (const verse of verses) {
        if (typeof verse === 'string') {
          verseObjects.push({ type: 'text', text: '\n' + verse });
        } else if (verse.verseObjects) {
          Array.prototype.push.apply(verseObjects, verse.verseObjects);
        }
      }
      return { verseObjects };
    }
    return verseData;
  }
  return null;
}

/**
 *  Gets both the verse text without usfm markers and unfilteredVerseText.
 * @param {object} bookData - current book data
 * @param {object} contextId - context id
 * @param {boolean} addVerseRef - if true then we add verse marker inline
 */
export function getVerseText(bookData, contextId, addVerseRef=false) {
  let unfilteredVerseText = '';
  let verseText = '';

  if (contextId && contextId.reference) {
    const { chapter, verse } = contextId.reference;
    const refs = getVerses(bookData, `${chapter}:${verse}`);
    let initialChapter;

    if (refs && refs.length) {
      initialChapter = refs[0].chapter;
    }

    for (let verseCnt = 0; verseCnt < refs.length; verseCnt++) {
      const ref = refs[verseCnt];
      const chapter = ref.chapter;
      const data = ref.verseData;
      let label = ref.verse;

      if (chapter !== initialChapter) {
        label = `${chapter}:${label}`;
      }

      if (verseCnt > 0) {
        unfilteredVerseText += '\n';

        if (addVerseRef) {
          unfilteredVerseText += label + ' ';
        }
      }

      unfilteredVerseText += data;
    }

    verseText = usfmjs.removeMarker(unfilteredVerseText);
    // normalize whitespace in case selection has contiguous whitespace _this isn't captured
    verseText = normalizeString(verseText);
  }

  return { unfilteredVerseText, verseText };
}
