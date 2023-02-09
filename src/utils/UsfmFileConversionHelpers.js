/* eslint-disable no-async-promise-executor, no-throw-literal */
import usfmjs from 'usfm-js';
import _ from 'lodash';
import {getVerseAlignments, getWordCountInVerse} from "./alignmentHelpers";

/**
 * test to see if verse is a verseSpan
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseSpan(verse) {
  return verse.toString().includes('-');
}

/**
 * called in case of invalid alignment that is not valid for the verse span, Sets alignment occurrence to high value
 *    so that alignment will be invalidated and has to be reviewed.
 * @param alignment
 */
export function invalidateAlignment(alignment) {
  delete alignment.ref;
  alignment.occurrences = 100000;
  alignment.occurrence = 100000;
}

/**
 * business logic for convertAlignmentFromVerseToVerseSpan:
 *     convert aligned data from mapped to verse to mapped to verse span
 * @param {object} originalVerseSpanData - original bible merged to verse span
 * @param {object} alignedVerseObjects - aligned verse objects for current verse
 * @param {number|string} chapter
 * @param {number} low - low verse number of span
 * @param {number} hi - high verse number of span
 * @param blankVerseAlignments - raw verse alignments for extracting word counts for each verse
 * @return {{verseObjects}}
 */
export function convertAlignmentFromVerseToVerseSpanSub(originalVerseSpanData, alignedVerseObjects, chapter, low, hi, blankVerseAlignments) {
  const bibleVerse = { verseObjects: originalVerseSpanData };
  const alignments = getVerseAlignments(alignedVerseObjects.verseObjects);

  for (let alignment of alignments) {
    const ref = alignment.ref || '';
    const refParts = ref.split(':');
    let verseRef;
    let chapterRef = chapter; // default to current chapter
    const word = alignment.content;
    let occurrence = alignment.occurrence;
    let occurrences = 0;

    if (refParts.length > 1) { // if both chapter and verse
      verseRef = parseInt(refParts[1]);
      chapterRef = refParts[0];
    } else { // verse only
      verseRef = parseInt(refParts[0]);
    }

    if (chapterRef.toString() !== chapter.toString()) {
      console.warn(`convertAlignmentFromVerseToVerseSpan() - alignment of word "${word}:${occurrence}" - chapter in ref "${ref}" does not match current chapter ${chapter} for verse span "${low}-${hi}" - skipping`);
      invalidateAlignment(alignment);
      continue;
    }

    if (!(occurrence > 0)) {
      console.warn(`convertAlignmentFromVerseToVerseSpan() - alignment of word "${word}:${occurrence}" - invalid occurrence in current verse span "${low}-${hi}" - skipping`);
      invalidateAlignment(alignment);
      continue;
    }

    if (!((verseRef >= low) || (verseRef <= hi))) {
      console.warn(`convertAlignmentFromVerseToVerseSpan() - alignment of word "${word}:${occurrence}" - verse in ref ${ref} is not within current verse span "${low}-${hi}" - skipping`);
      invalidateAlignment(alignment);
      continue;
    }

    // transform occurrence(s) from verse based to verse span
    for (let verse = low; verse <= hi; verse++) {
      const wordCount = getWordCountInVerse(blankVerseAlignments, verse, word);
      occurrences += wordCount;

      if (verse < verseRef) {
        occurrence += wordCount; // add word counts for lower verses to occurrence
      }
    }

    if ((occurrence > occurrences)) {
      console.warn(`convertAlignmentFromVerseToVerseSpan() - alignment of word "${word}:${occurrence}" - beyond ocurrences ${occurrences} in current verse span "${low}-${hi}" - skipping`);
      invalidateAlignment(alignment);
    } else {
      delete alignment.ref;
      alignment.occurrences = occurrences;
      alignment.occurrence = occurrence;
    }
  }
  return bibleVerse;
}

/**
 * dive down into milestone to extract words and text
 * @param {Object} verseObject - milestone to parse
 * @return {string} text content of milestone
 */
const parseMilestone = verseObject => {
  let text = verseObject.text || '';
  let wordSpacing = '';
  const length = verseObject.children ? verseObject.children.length : 0;

  for (let i = 0; i < length; i++) {
    let child = verseObject.children[i];

    switch (child.type) {
    case 'word':
      text += wordSpacing + child.text;
      wordSpacing = ' ';
      break;

    case 'milestone':
      text += wordSpacing + parseMilestone(child);
      wordSpacing = ' ';
      break;

    default:
      if (child.text) {
        text += child.text;
        const lastChar = text.substr(-1);

        if ((lastChar !== ',') && (lastChar !== '.') && (lastChar !== '?') && (lastChar !== ';')) { // legacy support, make sure padding before word
          wordSpacing = '';
        }
      }
      break;
    }
  }
  return text;
};

/**
 * get text from word and milestone markers
 * @param {Object} verseObject - to parse
 * @param {String} wordSpacing - spacing to use before next word
 * @return {*} new verseObject and word spacing
 */
const replaceWordsAndMilestones = (verseObject, wordSpacing) => {
  let text = '';

  if (verseObject.type === 'word') {
    text = wordSpacing + verseObject.text;
  } else if (verseObject.type === 'milestone') {
    text = wordSpacing + parseMilestone(verseObject);
  }

  if (text) { // replace with text object
    verseObject = {
      type: 'text',
      text,
    };
    wordSpacing = ' ';
  } else {
    wordSpacing = ' ';

    if (verseObject.nextChar) {
      wordSpacing = ''; // no need for spacing before next word if this item has it
    } else if (verseObject.text) {
      const lastChar = verseObject.text.substr(-1);

      if (![',', '.', '?', ';'].includes(lastChar)) { // legacy support, make sure padding before next word if punctuation
        wordSpacing = '';
      }
    }

    if (verseObject.children) { // handle nested
      const verseObject_ = _.cloneDeep(verseObject);
      let wordSpacing_ = '';
      const length = verseObject.children.length;

      for (let i = 0; i < length; i++) {
        const flattened =
          replaceWordsAndMilestones(verseObject.children[i], wordSpacing_);
        wordSpacing_ = flattened.wordSpacing;
        verseObject_.children[i] = flattened.verseObject;
      }
      verseObject = verseObject_;
    }
  }
  return { verseObject, wordSpacing };
};

/**
 * check if string has alignment markers
 * @param {String} usfmData
 * @return {Boolean} true if string has alignment markers
 */
export const hasAlignments = usfmData => {
  const hasAlignment = usfmData.includes('\\zaln-s') || usfmData.includes('\\w');
  return hasAlignment;
};

/**
 * @description verseObjects with occurrences via string
 * @param {String} usfmData - The string to search in
 * @return {String} - cleaned USFM
 */
export const cleanAlignmentMarkersFromString = usfmData => {
  if (hasAlignments(usfmData)) {
    // convert string using usfm to JSON
    const verseObjects = usfmjs.toJSON('\\v 1 ' + usfmData, { chunk: true }).verses['1'];
    return getUsfmForVerseContent(verseObjects);
  }
  return usfmData;
};

/**
 * converts verse from verse objects to USFM string
 * @param verseData
 * @return {string}
 */
export function convertVerseDataToUSFM(verseData) {
  const outputData = {
    'chapters': {},
    'headers': [],
    'verses': { '1': verseData },
  };
  const USFM = usfmjs.toUSFM(outputData, { chunk: true });
  const split = USFM.split('\\v 1');

  if (split.length > 1) {
    let content = split[1];

    if (content.substr(0, 1) === ' ') { // remove space separator
      content = content.substr(1);
    }
    return content;
  }
  return ''; // error on JSON to USFM
}

/**
 * @description convert verse from verse objects to USFM string, removing milestones and word markers
 * @param {Object|Array} verseData
 * @return {String}
 */
export const getUsfmForVerseContent = (verseData) => {
  if (verseData.verseObjects) {
    let wordSpacing = '';
    const flattenedData = [];
    const length = verseData.verseObjects.length;

    for (let i = 0; i < length; i++) {
      const verseObject = verseData.verseObjects[i];
      const flattened = replaceWordsAndMilestones(verseObject, wordSpacing);
      wordSpacing = flattened.wordSpacing;
      flattenedData.push(flattened.verseObject);
    }
    verseData = { // use flattened data
      verseObjects: flattenedData,
    };
  }
  return convertVerseDataToUSFM(verseData);
};
