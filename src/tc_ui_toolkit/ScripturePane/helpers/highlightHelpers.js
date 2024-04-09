'use strict';
import React from 'react';
import isEqual from 'lodash/isEqual';
import { isWord, punctuationWordSpacing } from './stringHelpers';
import { removeMarker } from './usfmHelpers';

/**
 * check if occurrence is correct match.  Corrects occurrence by adding word count from previous verse
 * @param {number|string} occurrence
 * @param {array} verseWordCounts
 * @param {object} wordItem
 * @returns {boolean}
 */
function doesOccurrenceMatch(occurrence, verseWordCounts, wordItem) {
  if (typeof occurrence === 'string' && occurrence.length === 0) {
    occurrence = 1;
  }

  if (occurrence === -1) {
    return true;
  } else {
    let previousCount = 0;

    if (verseWordCounts) {
      const verseCnt = wordItem.verseCnt || 0;

      if (verseCnt) {
        const previousVerseCounts = verseWordCounts[verseCnt - 1];
        previousCount = previousVerseCounts?.[wordItem.content] || 0;
      }
    }
    return (occurrence === wordItem.occurrence + previousCount);
  }
}

/**
 * check if word is part of quote
 * @param {object} word
 * @param {object} contextId
 * @param {array} verseWordCounts - array of word counts for multi-verse
 * @returns {boolean}
 */
export function isWordArrayMatch(word, contextId, verseWordCounts = null) {
  let isMatch = false;

  if (word && word.content && Array.isArray(word.content) && contextId && contextId.quote) {
    isMatch = word.content.some(wordItem => {
      let foundMatch = false;

      if (Array.isArray(contextId.quote)) {
        for (let i = 0, l = contextId.quote.length; i < l; i++) {
          const quote = contextId.quote[i];

          if (quote.word === wordItem.content) {
            foundMatch = doesOccurrenceMatch(quote.occurrence, verseWordCounts, wordItem);

            if (foundMatch) {
              break;
            }
          }
        }
      } else if (contextId.quote.split(' ').includes(wordItem.content)) {
        foundMatch = doesOccurrenceMatch(contextId.occurrence, verseWordCounts, wordItem);
      }
      return foundMatch;
    });
  }
  return isMatch;
}

/**
 * search word list to match occurrence of word. Counts occurrences current word and makes sure it matches occurrence
 * @param {number} index - position of word to stop at
 * @param {Array} words - list of word objects to search
 * @param {String} wordText - text to match
 * @param {number} occurrence - to match (if -1, then match all occurrences)
 * @return {Boolean} - true if same occurrence
 */
function matchOccurrenceOfWord(index, words, wordText, occurrence) {
// get occurrence of word
  let _occurrence = 0;

  for (let i = 0; i <= index; i++) {
    const wordItem = words[i];

    if ((wordItem.type === 'word') && (wordItem.text === wordText)) {
      _occurrence++;
    }
  }

  const isMatch = (_occurrence === occurrence) || (occurrence === -1);
  return isMatch;
}

/**
 * see if this word is part of quote for current context id.
 * @param {Object} word
 * @param {Object} contextId
 * @param {Array} words
 * @param {number} index
 * @return {boolean} - true if in quote
 */
export function isWordMatch(word, contextId, words, index) {
  let isMatch = false;

  try {
    if (word && word.text && contextId && contextId.quote) {
      if (Array.isArray(contextId.quote)) {
        // if list of words in quote see if this word matches one of the words
        for (let i = 0, l = contextId.quote.length; i < l; i++) {
          const quote = contextId.quote[i];

          if (quote.word === word.text) {
            isMatch = matchOccurrenceOfWord(index, words, word.text, quote.occurrence);

            if (isMatch) {
              break;
            }
          } else if (word.text && word.text.includes('’') && word.text.replace('’', '') === quote.word) {
            const wordText = word.text.replace('’', '');
            // Deep cloning array to avoid referencing the old array address in memory
            const newWords = JSON.parse(JSON.stringify(words));
            // remove apostrophe from each word in the words array
            const wordsWithoutApostrophe = [];

            for (let i = 0; i <= index; i++) {
              const wordItem = newWords[i];

              if (wordItem.text && wordItem.text.includes('’')) {
                wordItem.text = wordItem.text.replace('’', '');
              }
              wordsWithoutApostrophe.push(wordItem);
            }

            isMatch = matchOccurrenceOfWord(index, wordsWithoutApostrophe, wordText, quote.occurrence);

            if (isMatch) {
              break;
            }
          }
        }
      } else { // is string with one or more words
        const quotes = contextId.quote.split(' ');

        for (let i = 0, l = quotes.length; i < l; i++) {
          const quote = quotes[i];

          if (quote === word.text) {
            isMatch = matchOccurrenceOfWord(index, words, quote, contextId.occurrence);
          }
        }
      }
    }
    return isMatch;
  } catch (e) {
    console.error(e);
  }
}

/**
 * determine highlighting for word and previous white space
 * @param {Object} contextId
 * @param {Object} previousWord
 * @param {Object} word
 * @param {array} verseWordCounts - array of word counts for multi-verse
 * @returns {{isHighlightedWord: boolean, isBetweenHighlightedWord: boolean}}
 */
export function getWordHighlightedDetails(contextId, previousWord, word, verseWordCounts = null) {
  const isHighlightedWord = isWordArrayMatch(word, contextId, verseWordCounts);
  const isBetweenHighlightedWord = isHighlightedWord && previousWord && !isEqual(previousWord, word)
      && isWordArrayMatch(previousWord, contextId, verseWordCounts);
  return {
    isHighlightedWord,
    isBetweenHighlightedWord,
  };
}

export function getWordsFromNestedMilestone(nestedWords, contextId, index, previousWord, wordSpacing, fontClass, verseWordCounts) {
  // if its an array of an array thus get deep nested words array.
  if (Array.isArray(nestedWords[0])) {
    nestedWords = getDeepNestedWords(nestedWords);
  }

  let isHighlightedWord = false;
  let isBetweenHighlightedWord = false;
  let nestedPreviousWord = previousWord;
  let nestedWordSpacing = wordSpacing;
  const wordSpans =[];

  for (let i = 0, len = nestedWords.length; i < len; i++) {
    const nestedWord = nestedWords[i];
    const nestedWordIndex = i;
    const wordsArray = nestedWords;

    const nestedWordSpanIndex = `${index.toString()}_${nestedWordIndex.toString()}_${nestedWord.text}`;
    const nestedNextWord = wordsArray[index + 1];

    if (isWord(nestedWord)) {
      let padding = nestedWordSpacing;
      nestedWordSpacing = ' '; // spacing between words

      if (nestedPreviousWord && isPuntuationAndNeedsNoSpace(nestedPreviousWord)) {
        padding = '';
      }

      const highlightedDetails = getWordHighlightedDetails(
        contextId,
        nestedPreviousWord,
        nestedWord,
        verseWordCounts,
      );
      isHighlightedWord = highlightedDetails.isHighlightedWord;
      isBetweenHighlightedWord = highlightedDetails.isBetweenHighlightedWord;
      nestedPreviousWord = nestedWord;
      const paddingSpanStyle = { backgroundColor: isBetweenHighlightedWord ? 'var(--highlight-color)' : 'transparent' };

      wordSpans.push(
        <span key={nestedWordSpanIndex.toString()}>
          <span style={paddingSpanStyle}>
            {padding}
          </span>
          <span className={fontClass} style={{ backgroundColor: isHighlightedWord ? 'var(--highlight-color)' : '' }}>
            {removeMarker(nestedWord.text)}
          </span>
        </span>,
      );
    } else if (nestedWord.text) {
      nestedWordSpacing = punctuationWordSpacing(nestedWord); // spacing before words
      const text = removeMarker(nestedWord.text);

      if (isPunctuationHighlighted(nestedPreviousWord, nestedNextWord, contextId, verseWordCounts)) {
        wordSpans.push(
          <span key={nestedWordSpanIndex} className={fontClass} style={{ backgroundColor: 'var(--highlight-color)' }}>
            {text}
          </span>,
        );
      } else {
        wordSpans.push(
          <span className={fontClass} key={nestedWordSpanIndex}>
            {text}
          </span>,
        );
      }
    }
  }

  return {
    wordSpans,
    nestedPreviousWord,
    nestedWordSpacing,
  };
}

/**
 * Determines if the previous word is a punctuation that
 * doesnt need spacing after it.
 * @param {Object} wordObject
 */
function isPuntuationAndNeedsNoSpace(wordObject) {
  return !isWord(wordObject) && (wordObject.text === '"') || (wordObject.text === '\'');
}

/**
 * Gets a words object array from a deep nested milestone.
 * @param {array} nestedWords
 */
export function getDeepNestedWords(nestedWords) {
  let deepNestedWords = null;

  for (let i = 0, len = nestedWords.length; i < len; i++) {
    const nestedWord = nestedWords[i];

    if (nestedWord.text) {
      deepNestedWords = nestedWords;
    } else {
      deepNestedWords = getDeepNestedWords(nestedWord);
    }
  }

  return deepNestedWords;
}

/**
 * Determines if a punctuation should be highlighted or not.
 * @param {object} previousWord
 * @param {object} nextWord
 * @param {object} contextId
 * @param {array} words
 * @param {number} index
 * @param {array} verseWordCounts - array of word counts for multi-verse
 * @returns {bool} true or false. highlighted or not highlighted.
 */
export function isPunctuationHighlighted(previousWord, nextWord, contextId, words, index, verseWordCounts = null) {
  // handle nested previous words
  if (previousWord && Array.isArray(previousWord[0])) {
    const nestedPreviousWord = getDeepNestedWords(previousWord);
    // get the last item in the array
    previousWord = nestedPreviousWord[nestedPreviousWord.length - 1];
  }

  // handle nested next words
  if (nextWord) {
    if (Array.isArray(nextWord) || Array.isArray(nextWord[0])) {
      let nestedNextWords = getDeepNestedWords(nextWord);
      nextWord = nestedNextWords[0];
    }
  }

  const isPreviousWordMatch = previousWord && previousWord.content ?
    isWordArrayMatch(previousWord, contextId, verseWordCounts) : isWordMatch(previousWord, contextId, words, index - 1);
  const isNextWordMatch = nextWord && nextWord.content ?
    isWordArrayMatch(nextWord, contextId, verseWordCounts) : isWordMatch(nextWord, contextId, words, index + 1);

  if (previousWord && nextWord) {
    return isPreviousWordMatch && isNextWordMatch;
  } else if (previousWord) {
    return isPreviousWordMatch;
  } else if (nextWord) {
    return isNextWordMatch;
  } else {
    return false;
  }
}

let spaceCounter = 0;

/**
 * pushes a span to the array
 * @param {Array} verseSpan
 * @param {String} fontClass
 */
export function addSpace(verseSpan, fontClass) {
  verseSpan.push(
    <span key={'space_' +(++spaceCounter)} className={fontClass} style={{ backgroundColor: 'transparent' }}>
      {' '}
    </span>,
  );
}
