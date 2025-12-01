/* eslint-disable no-param-reassign */
import { ELLIPSIS } from '../../common/constants';
// helpers
import { cleanRegex } from '../helpers/translationHelps/wordOccurrenceHelpers';
import { cleanQuoteString } from './stringHelpers';

function validateChunk(verseString, chunk) {
  if (chunk && verseString && !verseString.includes(chunk)) {
    return chunk.trim();
  }
  return chunk;
}

function regex(quote) {
  if (quote) {
    quote = quote.trim();
  }
  return new RegExp(cleanRegex(quote), 'g');
}

function areChunksEqual(chunk1, chunk2) {
  return chunk1 && chunk2 && chunk1.trim() === chunk2.trim();
}

function getStrPrecedingPreviousChunk(verseString, previousChunk, currentChunk, nextChunk) {
  let result = null;
  previousChunk = validateChunk(verseString, previousChunk);
  currentChunk = validateChunk(verseString, currentChunk);
  nextChunk = validateChunk(verseString, nextChunk);
  const previousChunkMatches = verseString.match(regex(previousChunk)) || [];
  const currentChunkMatches = verseString.match(regex(currentChunk)) || [];
  const nextChunkMatches = verseString.match(regex(nextChunk)) || [];

  if (previousChunk && previousChunkMatches.length === 1) {
    const cutoffIndex = verseString.indexOf(previousChunk);
    result = verseString.slice(0, cutoffIndex);
  } else if (currentChunkMatches.length === 1) {
    const cutoffIndex = verseString.indexOf(currentChunk);
    const strPrecedingCurrentChunk = verseString.slice(0, cutoffIndex);
    const previousChunkCutoff = strPrecedingCurrentChunk.lastIndexOf(previousChunk);
    result = verseString.slice(0, previousChunkCutoff);
  } else if (previousChunk && previousChunkMatches.length >= 2) {
    const verseChunks = verseString.split(previousChunk);
    const foundIndex = verseChunks.findIndex(verseChunk => verseChunk.includes(currentChunk));
    result = verseChunks.slice(0, foundIndex + 1).join(previousChunk);
  } else if (nextChunk && nextChunkMatches.length === 1) {
    const cutoffIndex = verseString.indexOf(nextChunk);
    result = verseString.slice(0, cutoffIndex);
  } else if (!areChunksEqual(currentChunk, nextChunk) && nextChunkMatches.length >= 2) {
    const verseChunks = verseString.split(nextChunk);
    const foundIndex = verseChunks.findIndex(verseChunk => verseChunk.includes(currentChunk));
    result = verseChunks.slice(0, foundIndex + 1).join(nextChunk);
  } else if (areChunksEqual(currentChunk, nextChunk) && nextChunkMatches.length === 2) {
    const cutoffIndex = verseString.indexOf(currentChunk);
    result = verseString.slice(0, cutoffIndex);
  }

  return result;
}

function getQuoteChunkSubStrIndex(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) {
  let result;
  let useLastIndexOf = false;
  previousQuoteChunk = validateChunk(verseString, previousQuoteChunk);
  quoteChunk = validateChunk(verseString, quoteChunk);
  nextQuoteChunk = validateChunk(verseString, nextQuoteChunk);
  const splittedVerse = verseString.split(previousQuoteChunk);

  const matches = splittedVerse[1] ? splittedVerse[1].match(regex(quoteChunk)) || [] : [];

  if (splittedVerse.length === 2 && matches.length === 1) {
    useLastIndexOf = splittedVerse[0].includes(quoteChunk);
    // eslint-disable-next-line prettier/prettier
    result = useLastIndexOf ?
      verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk);
  } else if (splittedVerse.length === 2 && matches.length >= 2) {
    // string before missing words
    const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk;
    const strAfter = verseString.replace(strBefore, '');
    result = strBefore.length + strAfter.indexOf(quoteChunk);

    if (result > verseString.length) {
      result = verseString.indexOf(quoteChunk.trim());
    }
  } else if (splittedVerse.filter(str => str.includes(quoteChunk)).length >= 2) {
    // string before missing words
    const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk;
    const strAfter = verseString.replace(strBefore, '');
    result = strBefore.length + strAfter.indexOf(quoteChunk);
  } else if (areChunksEqual(previousQuoteChunk, quoteChunk) && (verseString.match(regex(quoteChunk)) || []).length === 2) {
    result = verseString.lastIndexOf(quoteChunk);
  } else {
    result = verseString.indexOf(quoteChunk);
  }

  return result;
}

export function getOmittedWordsInQuote(quote, verseString) {
  // Clean quote string
  quote = cleanQuoteString(quote);
  const quoteChunks = quote.split(ELLIPSIS);
  const missingWordsIndices = [];

  quoteChunks.forEach((quoteChunk, index) => {
    let quoteChunkSubStrIndex;
    const previousQuoteChunk = validateChunk(verseString, quoteChunks[index - 1]);
    let nextQuoteChunk = validateChunk(verseString, quoteChunks[index + 1]);

    // if first chunk & is not the last item in the array
    if ((index === 0) && (index < quoteChunks.length - 1)) {
      if (!verseString.includes(nextQuoteChunk)) {
        nextQuoteChunk = nextQuoteChunk.trim();
      }

      const strBeforeNextQuote = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) || '';

      // TRICKY: in some cases the chunk isn't found in the preceding string because of extra space in the string.
      if (!strBeforeNextQuote.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim();
        quoteChunks[index] = quoteChunk;
      }

      // Determine whether to use the last Index or first index of quoteChunk
      const lastIndexOfQuoteChunk = strBeforeNextQuote.lastIndexOf(quoteChunk);

      if (quoteChunk.trim() === nextQuoteChunk.trim()) {
        quoteChunkSubStrIndex = verseString.indexOf(quoteChunk.trim());
      } else if (lastIndexOfQuoteChunk + quoteChunk.length === strBeforeNextQuote.length) {
        const precedingLastQuoteChunkoccurrence = strBeforeNextQuote.slice(lastIndexOfQuoteChunk);

        if (precedingLastQuoteChunkoccurrence.includes(quoteChunk)) {
          // if quote chunk is found again in preceding string
          quoteChunkSubStrIndex = strBeforeNextQuote.indexOf(quoteChunk);
        }
      } else {
        quoteChunkSubStrIndex = strBeforeNextQuote.lastIndexOf(quoteChunk);
      }

      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.trim().length : 0));
    } else if ((index === quoteChunks.length - 1 || index >= 2) && quoteChunks.length >= 3) {
      // Determine whether to use the last Index or first index of quoteChunk.
      // if last quoteChunk in the array use lastIndexOf string.
      const useLastIndexOf = quoteChunks.length === index + 1;
      // eslint-disable-next-line prettier/prettier
      const lastMissingWordEndingIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk);
      const sliced = verseString.slice(lastMissingWordEndingIndex);
      const stringPrecedingLastChunk = verseString.replace(sliced, '');
      const matches = verseString.match(regex(quoteChunk), 'g');
      let lastAddedIndex = missingWordsIndices[missingWordsIndices.length - 1];
      let startIndex;

      if (matches && matches.length >= 3) {
        const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk;
        startIndex = strBefore.length;
      } else {
        startIndex = stringPrecedingLastChunk.indexOf(previousQuoteChunk) + previousQuoteChunk.length;

        if (startIndex < lastAddedIndex) {
          startIndex = stringPrecedingLastChunk.lastIndexOf(previousQuoteChunk) + previousQuoteChunk.length;
        }
      }

      missingWordsIndices.push(startIndex + (index === 0 ? quoteChunk.length : 0));

      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim();
        quoteChunks[index] = quoteChunk;
      }

      // eslint-disable-next-line prettier/prettier
      let endIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk);
      lastAddedIndex = missingWordsIndices[missingWordsIndices.length - 1];

      if (endIndex < lastAddedIndex && !useLastIndexOf) {
        endIndex = verseString.lastIndexOf(quoteChunk);
      }

      missingWordsIndices.push(endIndex + (index === 0 ? quoteChunk.length : 0));
    } else {
      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim();
        quoteChunks[index] = quoteChunk;
      }

      quoteChunkSubStrIndex = getQuoteChunkSubStrIndex(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk);
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0));
    }
  });

  const omittedStrings = [];

  missingWordsIndices.forEach((startIndex, i) => {
    if (!((i + 1) % 2 == 0)) {
      // if index is odd number
      const endIndex = missingWordsIndices[i + 1];
      const missingString = verseString.slice(startIndex, endIndex);
      omittedStrings.push(missingString);
    }
  });

  let wholeQuote = '';

  quoteChunks.forEach((chunk, index) => {
    const missingWord = omittedStrings[index] || '';
    wholeQuote = wholeQuote + chunk + missingWord;
  });

  // clean string
  wholeQuote = cleanQuoteString(wholeQuote);

  return {
    wholeQuote,
    omittedStrings,
  };
}

/**
 * Returns whether a string includes ellipsis or not.
 * @param {string} origQuote - Original language quote.
 */
export function hasEllipsis(origQuote = '') {
  return origQuote.includes(ELLIPSIS);
}
