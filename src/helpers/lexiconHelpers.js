import { MorphUtils } from 'word-aligner';

const ZERO_WIDTH_SPACE = '\u200B';
const ZERO_WIDTH_JOINER = '\u2060';

/**
 * splits a word by zero width spaces
 * @param {String} word - compound word to split
 * @return {Array} split parts
 */
export const getWordParts = (word) => {
  if (word) {
    let wordParts = [word];

    if (word.includes(ZERO_WIDTH_JOINER)) {
      wordParts = word.split(ZERO_WIDTH_JOINER);
    } else if (word.includes(ZERO_WIDTH_SPACE)) {
      wordParts = word.split(ZERO_WIDTH_SPACE);
    }
    return wordParts;
  }
  return [];
};

/**
 * splits morph of compound word into parts
 * @param {string} morph - morph string to convert
 * @return {Array} morphology for each part
 */
export const getMorphKeys = (morph) => {
  const morphKeys = MorphUtils.getMorphLocalizationKeys(morph);
  const morphKeysForParts = [];
  let lastPos = 0;
  let pos = 0;
  let part;
  const divider = '*:';

  if ((pos = morphKeys.indexOf(divider)) >= 0) {
    while (pos >= 0) {
      part = morphKeys.slice(lastPos, pos);
      morphKeysForParts.push(part);
      lastPos = pos + 1;
      pos = morphKeys.indexOf(divider, lastPos);
    }
    part = morphKeys.slice(lastPos);

    if (part.length) {
      morphKeysForParts.push(part);
    }
  } else {
    morphKeysForParts.push(morphKeys);
  }
  return morphKeysForParts;
};

/**
 * checks for formats such as `c:d:H0776` and splits into parts
 * @param {String} strong - the strong's number to get the entryIds from
 * @return {Array} - list of parts
 */
export const getStrongsParts = (strong) => {
  if (strong) {
    const parts = strong.split(':');
    return parts;
  }
  return [];
};

/**
 * searches through the parts to see if there is a valid strongs number
 * @param strong
 * @return {boolean}
 */
export const containsValidStrongsNumber = (strong) => {
  const parts = getStrongsParts(strong);

  for (let i = 0, len = parts.length; i < len; i++) {
    const entryId = lexiconEntryIdFromStrongs(parts[i]);

    if (entryId) {
      return true;
    }
  }
  return false;
};

/**
 * @description - Get the lexiconIds from the strong's number
 * @param {String} strong - the strong's number to get the entryIds from
 * @return {String} - the id of the lexicon
 */
export const lexiconIdFromStrongs = (strong) => {
  const lexiconId = (strong && strong.startsWith('G')) ? 'ugl': 'uhl';
  return lexiconId;
};
/**
 * @description - Get the lexicon entryIds from the strong's number
 * @param {String} strong - the strong's number to get the entryIds from
 * @return {int} - the number of the entry
 */
export const lexiconEntryIdFromStrongs = (strong) => {
  if (strong) {
    let strongsCode = strong.replace(/\w/, '');

    if (!strong.startsWith('H')) { // Greek has an extra 0 at end
      strongsCode = strongsCode.slice(0, -1);
    }

    const entryId = (strongsCode && parseInt(strongsCode)) || 0;
    return entryId;
  }
  return 0;
};

/**
 * looks up the strongs numbers for each part of a multipart strongs
 * @param {String} strong
 * @param {Function} getLexiconData
 * @return {*}
 */
export const lookupStrongsNumbers = (strong, getLexiconData) => {
  let lexiconData = {};
  const parts = getStrongsParts(strong);

  for (let i = 0, len = parts.length; i < len; i++) {
    const part = parts[i];
    const entryId = lexiconEntryIdFromStrongs(part);

    if (entryId) {
      const lexiconId = lexiconIdFromStrongs(part);
      const lexiconData_ = getLexiconData(lexiconId, entryId);

      if (lexiconData_) {
        if (lexiconData && lexiconData_[lexiconId] && lexiconData_[lexiconId][entryId]) { // if already exists combine data
          if (!lexiconData[lexiconId]) {
            lexiconData[lexiconId] = {};
          }
          lexiconData[lexiconId][entryId] = lexiconData_[lexiconId][entryId];
        }
      }
    }
  }
  return lexiconData;
};