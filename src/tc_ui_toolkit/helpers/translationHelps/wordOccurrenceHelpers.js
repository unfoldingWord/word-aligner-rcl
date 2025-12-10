/* eslint-disable no-param-reassign */
import { tokenize, tokenizeOrigLang } from 'string-punctuation-tokenizer';
import { getOmittedWordsInQuote } from '../../tsv-groupdata-parser/ellipsisHelpers'
import { cleanQuoteString } from '../../tsv-groupdata-parser/stringHelpers'
import { ELLIPSIS, THREE_DOTS } from '../../../common/constants'

function countStringInArray(array, string) {
  return array.filter(item => item === string).length;
}

export function cleanRegex(str) {
  if (str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
  return str;
}

function tokenizeQuote(quote, isOrigLang = false) {
  if (isOrigLang) {
    return tokenizeOrigLang({ text: quote, includePunctuation: true });
  } else {
    return tokenize({ text: quote, includePunctuation: true });
  }
}

function substrOccurrencesInQuote(quote, substr, substrIndex, ellipsisCount, quoteOmittedStrings, isOrigLang = false) {
  const quoteSubstrings = tokenizeQuote(quote, isOrigLang);
  let precedingSubstrs = quoteSubstrings.slice(0, substrIndex);
  let localEllipsisCount = 0;

  precedingSubstrs.forEach((precedingSubstr, index) => {
    if (precedingSubstr === ELLIPSIS) {
      ++localEllipsisCount;
      const untokenizedString = quoteOmittedStrings[localEllipsisCount - 1];
      const missingPrecedingSubstrs = tokenizeQuote(untokenizedString, isOrigLang).reverse();

      // Add tokenized missing strings to precedingSubstrs for accurate occurrence number search
      missingPrecedingSubstrs.forEach(missingPrecedingSubstr => {
        precedingSubstrs.splice(index, 0, missingPrecedingSubstr);
      });
    }
  });

  // filter out ellipsis
  precedingSubstrs = precedingSubstrs.filter(item => item !== ELLIPSIS);

  return countStringInArray(precedingSubstrs, substr);
}

/**
 * search for previous occurrences of word to get occurrence
 * for this instance
 * @param {string} verseString - The string to search in.
 * @param {string} substr - The sub string to search for.
 * @param {string} quote - the orig language quote.
 * @param {number} substrIndex - substring index number.
 * @param {string} wholeQuote - whole quote without ellipsis.
 * @param {number} ellipsisCount - number of ellipses already
 * @param {string} quoteOmittedStrings - list of omitted strings in the quote.
 * pass in the loop
 */
function getWordOccurrence(verseString, substr, quote, substrIndex, wholeQuote, ellipsisCount, quoteOmittedStrings, isOrigLang = false) {
  const goodQuote = quote.includes(ELLIPSIS) ? wholeQuote : quote;
  const quoteSubStrIndex = verseString.indexOf(goodQuote);
  const precedingStr = verseString.substring(0, quoteSubStrIndex);
  const precedingStrs = tokenizeQuote(precedingStr, isOrigLang);
  let precedingOccurrences = 0;

  for (let i = 0; i <= precedingStrs.length; i++) {
    const stringItem = precedingStrs[i];

    if (stringItem === substr) {
      precedingOccurrences++;
    }
  }

  let occurrence = ++precedingOccurrences;

  // if substr is found in quote more than once
  if (goodQuote.split(new RegExp(cleanRegex(substr), 'gi')).length - 1 > 1) {
    const precedingSubstrOccurrences = substrOccurrencesInQuote(quote, substr, substrIndex, ellipsisCount, quoteOmittedStrings, isOrigLang);
    occurrence += precedingSubstrOccurrences;
  }

  return occurrence;
}

export function getWordOccurrencesForQuote(quote, verseString, isOrigLang = false) {
  const words = [];
  let wholeQuote = '';
  let quoteOmittedStrings;
  // clean quote string
  quote = cleanQuoteString(quote);

  if (quote.includes(THREE_DOTS) || quote.includes(ELLIPSIS)) {
    quote = quote.replace(/\.../g, ELLIPSIS);
    const quoteOmittedWords = getOmittedWordsInQuote(quote, verseString);
    wholeQuote = quoteOmittedWords.wholeQuote;
    quoteOmittedStrings = quoteOmittedWords.omittedStrings;
  }

  const substrings = tokenizeQuote(quote, isOrigLang);

  let ellipsisCount = 0;

  substrings.forEach((substring, index) => {
    let word = {};

    if (substring === ELLIPSIS) {
      ++ellipsisCount;
      word = { word: substring };
    } else {
      const occurrence = getWordOccurrence(verseString, substring, quote, index, wholeQuote, ellipsisCount, quoteOmittedStrings, isOrigLang);

      word = {
        word: substring,
        occurrence,
      };
    }

    words.push(word);
  });

  return words;
}
