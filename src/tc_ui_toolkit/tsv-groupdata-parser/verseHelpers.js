import { getVerses } from 'bible-reference-range';
import { verseObjectsToString } from './verseObjecsHelper';

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
 * find all verses in ref and return as long string
 * @param {object} bookData - indexed by chapter and then verse ref
 * @param {string} ref - formats such as “2:4-5”, “2:3a”, “2-3b-4a”, “2:7,12”, “7:11-8:2”, "6:15-16;7:2"
 * @param {boolean} failOnMissingVerse
 * @returns {string}
 */
export function getVerseString(bookData, ref, failOnMissingVerse = true) {
  let verseObjects_ = [];
  const verseRefs = getVerses(bookData, ref);

  for (const verseRef of verseRefs) {
    if (!verseRef.verseData && failOnMissingVerse) {
      return null;
    }

    const verseData = verseRef.verseData;
    let verseObjects; // (verseData && verseData.verseObjects);

    if (verseData) {
      if (typeof verseData === 'string') {
        verseObjects = [{ text: verseData }];
      } else if (Array.isArray(verseData)) {
        verseObjects = verseData;
      } else if (verseData.verseObjects) {
        verseObjects = verseData.verseObjects;
      }
      Array.prototype.push.apply(verseObjects_, verseObjects);
    }
  }

  return verseObjectsToString(verseObjects_);
}

