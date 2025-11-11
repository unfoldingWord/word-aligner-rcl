import cloneDeep from "lodash.clonedeep";
import {removeUsfmMarkers, usfmVerseToJson} from "./usfmHelpers";
import wordaligner from "word-aligner";
import * as UsfmFileConversionHelpers from "./UsfmFileConversionHelpers";
import {
  convertAlignmentFromVerseToVerseSpanSub,
  convertVerseDataToUSFM,
  getUsfmForVerseContent
} from "./UsfmFileConversionHelpers";
import {
  getAlignedWordListFromAlignments,
  getOriginalLanguageListForVerseData,
  migrateTargetAlignmentsToOriginal,
  updateAlignedWordsFromOriginalWordList
} from "./migrateOriginalLanguageHelpers";
import Lexer from "wordmap-lexer";
import { getVerseSpanRange } from './verseObjects';

/**
 * get all the alignments for verse from nested array (finds zaln objects)
 * @param {array} verseSpanAlignments
 * @return {*[]}
 */
export function getVerseAlignments(verseSpanAlignments) {
  let alignments = [];

  if (verseSpanAlignments) {
    for (let alignment of verseSpanAlignments) {
      if (alignment.tag === 'zaln') {
        alignments.push(alignment);
      }

      if (alignment.children) {
        const subAlignments = getVerseAlignments(alignment.children);

        if (subAlignments.length) {
          alignments = alignments.concat(subAlignments);
        }
      }
    }
  }
  return alignments;
}

/**
 * search through verseAlignments for word and get occurrences
 * @param {object} verseAlignments
 * @param {string|number} matchVerse
 * @param {string} word
 * @return {number}
 */
export function getWordCountInVerse(verseAlignments, matchVerse, word) {
  let matchedAlignment = null;

  for (let alignment of verseAlignments[matchVerse]) {
    for (let topWord of alignment.topWords) {
      if (topWord.word === word) {
        matchedAlignment = topWord;
        break;
      }
    }

    if (matchedAlignment) {
      break;
    }
  }

  const wordCount = matchedAlignment && matchedAlignment.occurrences;
  return wordCount || 0;
}

/**
 * convert to number if string
 * @param {string|number} value
 * @returns {number|*}
 */
function parseStrToNumber(value) {
  if (typeof value === 'string') {
    const number = parseInt(value);
    return number;
  }
  return value;
}

/**
 * convert occurrence(s) in word to numbers
 * @param {object} item
 * @returns {object} - new word with occurrence(s) converted to numbers
 */
function convertOccurrencesInWord(item) {
  const occurrence = parseStrToNumber(item.occurrence);
  const occurrences = parseStrToNumber(item.occurrences);
  if (
    (occurrence !== item.occurrence)
    || (occurrences !== item.occurrences)
  ) { // if occurrence(s) changed, create new word
    return {
      ...item,
      occurrence,
      occurrences,
    }
  }

  return item;
}

/**
 * for each item in word list convert occurrence(s) to numbers
 * @param {array} wordlist
 * @returns {array}
 */
function convertOccurrences(wordlist) {
  const wordlist_ = wordlist.map(item => {
    return convertOccurrencesInWord(item);
  })
  return wordlist_;
}

/**
 * get the word list from alignments
 * @param {array} verseObjects
 * @return {array}
 */
export function getWordListFromVerseObjects(verseObjects) {
  const targetVerseUSFM = getUsfmForVerseContent({verseObjects})
  let targetTokens = Lexer.tokenize(removeUsfmMarkers(targetVerseUSFM));
  targetTokens = targetTokens.map(token => (
  { // exclude unneeded data
    text: token.text || token.word,
    occurrence: token.tokenOccurrence,
    occurrences: token.tokenOccurrences,
    index: token.tokenPos,
  }))
  return targetTokens;
}

/**
 * extract alignments from target verse USFM using sourceVerse for word ordering
 * @param {string} alignedTargetVerse
 * @param {object|null} sourceVerse - optional source verse in verseObject format to maintain source language word order
 * @return {array} list of alignments in target text
 */
export function extractAlignmentsFromTargetVerse(alignedTargetVerse, sourceVerse) {
  try {
    const targetVerse = usfmVerseToJson(alignedTargetVerse) || [];
    const alignments = wordaligner.unmerge(targetVerse, sourceVerse || []);
    const originalLangWordList = sourceVerse && getOriginalLanguageListForVerseData(sourceVerse);
    const alignmentsWordList = getAlignedWordListFromAlignments(alignments.alignment);
    const targetTokens = getWordListFromVerseObjects(targetVerse);
    // clean up metadata in alignments
    originalLangWordList && updateAlignedWordsFromOriginalWordList(originalLangWordList, alignmentsWordList);
    if (alignments.alignment) { // for compatibility change alignment to alignments
      // convert occurrence(s) from string to number
      const alignments_ = alignments.alignment.map(alignment => {
        const topWords = convertOccurrences(alignment.topWords);
        const bottomWords = convertOccurrences(alignment.bottomWords);
        return {
          sourceNgram: topWords.map(topWord => { // word aligner uses sourceNgram instead of topWord
            if (originalLangWordList) {
              const pos = originalLangWordList.findIndex(item => (
                topWord.word === (item.word || item.text) &&
                topWord.occurrence == item.occurrence //Tricky: we want to allow automatic conversion between string and integer because occurrence could be either
              ));
              const newSource = {
                ...topWord,
                index: pos,
                text: topWord.text || topWord.word,
              };
              delete newSource.word
              return newSource
            }
            const newSource = {
              ...topWord,
              text: topWord.text || topWord.word,
            };
            delete newSource.word
            delete newSource.position
            return newSource
          }),
          targetNgram: bottomWords.map(bottomWord => { // word aligner uses targetNgram instead of bottomWords
            const word = bottomWord.text || bottomWord.word
            // noinspection EqualityComparisonWithCoercionJS
            const pos = targetTokens.findIndex(item => (
              word === item.text &&
              // eslint-disable-next-line eqeqeq
              bottomWord.occurrence == item.occurrence
            ));

            const newTarget = {
              ...bottomWord,
              index: pos,
              text: word,
            };
            delete newTarget.word
            return newTarget;
          }),
        }
      })
      alignments.alignments = alignments_;
    }
    return alignments;
  } catch (e) {
    console.warn(`extractAlignmentsFromTargetVerse()`,e)
    return null
  }
}

/**
 * merge alignments into target verse
 * @param {string} targetVerseText - target verse to receive alignments
 * @param {{alignments, wordBank}} verseAlignments - contains all the alignments and wordbank is list of unaligned target words
 * @return {string|null} target verse in USFM format
 */
export function addAlignmentsToTargetVerseUsingMerge(targetVerseText, verseAlignments) {
  const verseString = UsfmFileConversionHelpers.cleanAlignmentMarkersFromString(targetVerseText);
  let verseObjects;

  try {
    verseObjects = wordaligner.merge(
      verseAlignments.alignments, verseAlignments.wordBank, verseString, true,
    );
  } catch (e) {
    console.error(`addAlignmentsToTargetVerseUsingMerge() - invalid alignment`, e);
  }

  if (verseObjects) {
    const targetVerse = convertVerseDataToUSFM({verseObjects});
    return targetVerse;
  }

  return null;
}

/**
 * iterate through the target words marking words as disabled if they are already used in alignments
 * @param {array} targetWordList
 * @param {array} alignments
 * @returns {array} updated target word list
 */
export function  markTargetWordsAsDisabledIfAlreadyUsedForAlignments(targetWordList, alignments) {
  return targetWordList.map(token => {
    let isUsed = false;

    for (const alignment of alignments) {
      for (const usedToken of alignment.targetNgram) {
        if (token.text.toString() === usedToken.text.toString()
          && token.occurrence === usedToken.occurrence
          && token.occurrences === usedToken.occurrences) {
          isUsed = true;
          break;
        }
      }
      if (isUsed) {
        break;
      }
    }

    const targetWord = { // exclude unneeded data
      disabled: isUsed,
      text: token.text,
      occurrence: token.tokenOccurrence,
      occurrences: token.tokenOccurrences,
      index: token.tokenPos,
    }
    return targetWord;
  });
}

/**
 * Processes the given word bank and verse alignments to generate cleaned alignments
 * with remapped word properties and filters disabled items from the word bank.
 *
 * @param {Array} wordBankWords - Array of words from the word bank, potentially containing disabled items.
 * @param {Array} verseAlignments - Array of alignment data containing source and target ngrams with words and metadata.
 * @return {Object} An object containing two properties:
 *                  - `alignments`: The cleaned and remapped alignments of source and target words.
 *                  - `wordBank`: The filtered and processed word bank with additional properties.
 */
function getCleanedAlignments(wordBankWords, verseAlignments) {
  let wordBank = wordBankWords.filter(item => (!item.disabled))
  wordBank = wordBank.map(item => ({
    ...item,
    word: item.word || item.text,
    occurrence: item.occurrence,
    occurrences: item.occurrences
  }))
  // remap sourceNgram:topWords, targetNgram:bottomWords,
  const alignments_ = verseAlignments.map(item => ({
    ...item,
    topWords: item.sourceNgram.map(item => ({
      strong: item.strong,
      lemma: item.lemma,
      morph: item.morph,
      occurrence: item.occurrence,
      occurrences: item.occurrences,
      word: item.word || item.text
    })),
    bottomWords: item.targetNgram.map(item => ({
      ...item,
      word: item.word || item.text
    }))
  }))
  const alignments = {
    alignments: alignments_,
    wordBank
  }
  return alignments
}

/**
 * Finds the position of a specific word occurrence in a given word list.
 *
 * @param {Array} wordList - An array of word objects to search through. Each object should contain `text` and `occurrence` properties.
 * @param {string} text - The text value of the word to find.
 * @param {number} occurrenceToMatch - The occurrence value of the word to match.
 * @return {number|null} The index of the matching word occurrence if found, or null if the `wordList` is not a populated array.
 */
function findWordOccurrencePos(wordList, text, occurrenceToMatch) {
  if (!wordList?.length) {
    return null // word list is not a populated array
  }
  return wordList.findIndex((token) => (token.text === text && token.occurrence === occurrenceToMatch));
}

/**
 * Processes the given alignments and word changes to compute the occurrences of words.
 *
 * @param {Array} alignments - The alignments to be processed. Defaults to an empty array if not provided.
 * @param {Object} wordChanges - The changes containing word information. May include an `afterWords` property which is an array of tokens (each token containing a `word` or `text` property).
 * @return {Object} An object containing:
 *                  - `alignments_`: The processed alignments.
 *                  - `occurrencesMap`: A map where the keys are words and the values are their respective occurrence counts.
 */
function getWordOccurrences(alignments, wordChanges) {
  const alignments_ = alignments || [];

  // get occurrence counts for each word
  const occurrencesMap = {};
  const afterWords = wordChanges?.afterWords || [];
  if (afterWords.length) { // if we have word list, count those words
    for (const token of afterWords) {
      const word = token.word || token.text
      if (word) {
        const currentCount = occurrencesMap[word] || 0;
        occurrencesMap[word] = currentCount + 1
      }
    }
  }
  return {alignments_, occurrencesMap};
}

/**
 * Adjusts alignment target occurrences based on word changes such as insertions and deletions.
 *
 * @param {Object} wordChanges - Represents the details of word changes, including the order of changes,
 *                               details of added or deleted words, and a reference to all words post changes.
 * @param {Array} alignments - An array of alignment objects where each object contains target n-grams
 *                             that may potentially be adjusted based on word changes.
 * @return {void} This method modifies the `alignments` parameter directly to reflect updated occurrences.
 */
function fixAlignmentOccurrences(wordChanges, alignments) {
  // Tweak alignment target occurrences based on insertions and deletions
  for (const orderItem of wordChanges.order) {
    const isDeleted = orderItem.action === 'deleted'
    let actionItem = null
    let change = 0;

    if (isDeleted) {
      // Deleted item: decrement occurrence numbers for later instances
      change = -1
    } else {
      // Added item: increment occurrence numbers for later instances
      change = 1
    }

    // Get the specific added or deleted word details
    actionItem = wordChanges[orderItem.action]?.[orderItem.position]
    if (actionItem) { // sanity check
      const occurrenceToChange = actionItem.occurrenceToChange
      const occurrences = actionItem.occurrences

      // Only process if we have valid occurrence data
      if (occurrences && occurrenceToChange >= 0) {
        const alignments_ = alignments || [];

        // Iterate through all alignments
        for (const alignment of alignments_) {
          // Check each target word in the alignment
          const targetNgrams = alignment?.targetNgram || [];
          for (let i = 0; i < targetNgrams.length; i++) {
            const targetNgram = targetNgrams[i]
            const occurrence = targetNgram.occurrence
            const text = targetNgram.text

            // If this target word matches the changed word
            if (text === actionItem.word) {
              // Update occurrence number if it's at or after the change point
              if (occurrence >= occurrenceToChange) {
                // find the new occurrence token
                const occurrenceToMatch = occurrence + change
                const findPos = findWordOccurrencePos(wordChanges.afterWords, text, occurrenceToMatch)
                const newToken = findPos >= 0 ? wordChanges.afterWords[findPos] : null
                if (newToken) {
                  targetNgrams[i] = newToken
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Removes invalid or duplicate target alignments from the provided alignments array based on the occurrence.
 * Invalid alignments are those whose occurrences exceed the allowed number or are invalid.
 * Duplicate alignments are also removed.
 *
 * @param {Array} alignments_ - Array of alignment objects, each containing a `targetNgram` property with target word details.
 * @param {Object} occurrencesMap - An object mapping target words to their maximum allowed occurrences.
 * @return {void} This function modifies the `alignments_` array in place and does not return a value.
 */
function removeInvalidTargetAlignments(alignments_, occurrencesMap) {
  const alignedTargetWords = {}

  // Iterate through all alignments and remove invalid target occurrences or duplicated occurrences
  for (let alignmentIndex = 0; alignmentIndex < alignments_.length; alignmentIndex++) {
    let alignment = alignments_[alignmentIndex]

    // Check each target word in the alignment
    const targetNgrams = alignment?.targetNgram || [];
    for (let targetIndex = 0; targetIndex < targetNgrams.length; targetIndex++) {
      const targetNgram = targetNgrams[targetIndex];
      const occurrence = targetNgram.occurrence
      const text = targetNgram.text
      const key = `${text}_${occurrence}`
      const wordOccurrences = occurrencesMap[text];
      let removeTargetAlignment = !(wordOccurrences > 0) || !(occurrence > 0) || occurrence > wordOccurrences
      let reason = ''

      if (!removeTargetAlignment) {
        if (alignedTargetWords[key]) { // if this target occurrence already exists
          // console.log('removing duplicate occurrence', targetNgram)
          // console.log('at location', alignedTargetWords[key])
          removeTargetAlignment = true
          reason = 'duplicate'
        }
      } else {
        // console.log('removing invalid occurrence', targetNgram)
        reason = `invalid occurrence`
      }

      if (removeTargetAlignment) {
        // console.log(`removing ${reason}`, targetNgram)
        targetNgrams.splice(targetIndex, 1)
        targetIndex--; // backup to account for removed item
      } else {
        alignedTargetWords[key] = `${alignmentIndex}:${targetIndex}` // mark target occurrence as already used and where
        if (targetNgram.occurrences !== wordOccurrences) {
          targetNgram.occurrences = wordOccurrences
        }
      }
    }
  }
}

/**
 * Adjusts occurrence numbers in alignment target words based on word changes (insertions/deletions).
 *
 * When words are added or deleted from the target text, the occurrence numbers of subsequent instances
 * of the same word need to be updated. For example, if the second occurrence of "the" is deleted,
 * what was previously the third occurrence becomes the second occurrence.
 *
 * @param {Object} wordChanges - Object containing details about word changes:
 *   - `order`: Array of {action, position} indicating sequence of changes
 *   - `added`: Array of {word, token, occurrences, occurrenceToChange} for added words
 *   - `deleted`: Array of {word, token, occurrences, occurrenceToChange} for deleted words
 *   - `afterWords`: Array of target text tokens after changes
 * @param {Object[]} alignments - Array of alignment objects, each containing:
 *   - `targetNgram`: Array of target word objects to be updated
 * @description Processes word changes sequentially to:
 *   1. Update occurrence numbers for target words after each deletion/addition
 *   2. Find and update tokens in afterWords that match changed words
 *   3. Handle invalid/duplicate target occurrences by removing them
 *   4. Track which target words have been aligned to avoid duplicates
 */
function adjustTargetOccurrences(wordChanges, alignments) {
  const {alignments_, occurrencesMap} = getWordOccurrences(alignments, wordChanges);
  fixAlignmentOccurrences(wordChanges, alignments);
  removeInvalidTargetAlignments(alignments_, occurrencesMap);
}

/**
 * create wordbank of unused target words, transform alignments, and then merge alignments into target verse
 * @param {array} wordBankWords - list of all target words in word bank - the disabled flag indicates word is aligned
 * @param {array} verseAlignments
 * @param {string} targetVerseText - target verse to receive alignments
 * @param {object} wordChanges - optional, details edit changes so that alignment target occurrences can be tweaked
 * @return {string|null} target verse in USFM format
 */
export function addAlignmentsToVerseUSFM(wordBankWords, verseAlignments, targetVerseText, wordChanges = null) {
  const alignments = getCleanedAlignments(wordBankWords, verseAlignments)
  const verseUsfm = addAlignmentsToTargetVerseUsingMerge(targetVerseText, alignments);
  return verseUsfm;
}

/**
 * parse target language and original language USFM text into the structures needed by the word-aligner
 * @param {string} targetVerseUSFM
 * @param {string|null} sourceVerseUSFM
 * @returns {{targetWords: *[], verseAlignments: *}}
 */
export function parseUsfmToWordAlignerData(targetVerseUSFM, sourceVerseUSFM) {
  let targetTokens = [];
  if (targetVerseUSFM) {
    targetTokens = Lexer.tokenize(removeUsfmMarkers(targetVerseUSFM));
  }

  const sourceVerseObjects = sourceVerseUSFM && usfmVerseToJson(sourceVerseUSFM);
  let targetWords = [];
  const targetVerseAlignments = extractAlignmentsFromTargetVerse(targetVerseUSFM, sourceVerseObjects);
  const verseAlignments = targetVerseAlignments?.alignments;
  targetWords = markTargetWordsAsDisabledIfAlreadyUsedForAlignments(targetTokens, verseAlignments);
  return {targetWords, verseAlignments};
}

/**
 * iterate through target word list to make sure all words are used, and then iterate through all alignments to make sure all source alignments have target words
 * @param {array} targetWords
 * @param {array} verseAlignments
 * @returns {boolean}
 */
export function areAlgnmentsComplete(targetWords, verseAlignments) {
  let alignmentComplete = true;
  for (const word of targetWords) {
    if (!word.disabled) {
      alignmentComplete = false;
      break;
    }
  }

  if (alignmentComplete) {
    for (const alignment of verseAlignments) {
      const sourceWordCount = alignment.sourceNgram?.length || 0;
      const targetWordCount = alignment.targetNgram?.length || 0;
      if (!targetWordCount && sourceWordCount) { // if no target words, but we have source words, then incomplete alignment
        alignmentComplete = false;
        break;
      }
    }
  }
  return alignmentComplete;
}

/**
 * Searches for a specific text within an array of objects and returns the index of its first occurrence starting from a given position.
 *
 * @param {Array.<{text: string}>} wordObjectsArray - An array of objects, where each object contains a `text` property.
 * @param {string} matchText - The text to search for within the `text` property of the objects.
 * @param {number} [startPos=0] - The position in the array to start searching from, defaults to 0 if not provided.
 * @return {number} The index of the first occurrence of the matching text starting from `startPos`, or -1 if not found.
 */
function findWordInObjects(wordObjectsArray, matchText, startPos=0) {
  const pos = wordObjectsArray.findIndex((w, pos) => ((pos >= startPos) && (w.text === matchText)))
  return pos
}

/**
 * Counts the occurrences of a specific text within an array of objects that contain a 'text' property.
 *
 * @param {Array.<Object>} wordObjectsArray - An array of objects, where each object is expected to have a 'text' property.
 * @param {string} matchText - The text to search for within the 'text' property of the objects in the array.
 * @param {number} [startPos=0] - Optional starting index in the array from where the search begins. Defaults to 0.
 * @return {number} - The count of objects in the array whose 'text' property matches the specified matchText.
 */
function countOccurrenceInObjects(wordObjectsArray, matchText, startPos=0) {
  let count = 0;
  for (let i = startPos; i < wordObjectsArray.length; i++) {
    const word = wordObjectsArray[i];
    if (word.text === matchText) {
      count++;
    }
  }
  return count;
}

/**
 * Calculates the change in the count of a specific word or text between two collections of word objects.
 *
 * @param {Object[]} beforeWords - The collection of word objects before the change.
 * @param {number} beforeStartPos - The starting position in the beforeWords collection to begin counting.
 * @param {Object[]} afterWords - The collection of word objects after the change.
 * @param {number} afterStartPos - The starting position in the afterWords collection to begin counting.
 * @param {string} matchText - The word or text to count within the collections.
 * @return {number} The difference in word counts for the specified text between the afterWords and beforeWords collections.
 */
function getChangeInWordCounts(beforeWords, beforeStartPos, afterWords, afterStartPos, matchText) {
  if (!matchText) {
    return 0
  }
  const beforeWordCount = countOccurrenceInObjects(beforeWords, matchText, beforeStartPos)
  const afterWordCount = countOccurrenceInObjects(afterWords, matchText, afterStartPos)
  return afterWordCount - beforeWordCount
}

/**
 * Swaps and modifies words occurrences marked as added.
 *
 * @param {Object} lastToken - The last token being processed, containing positional information.
 * @param {Array} stack - The current list of words to be modified.
 * @param {number} endStreakPos - The ending position in the added list where changes occur.
 * @param {Array} beforeWords - The list of words representing the initial state.
 * @param {number} startStreakPos - The index where the modified token should be inserted.
 * @param {Array} afterWords - The list of words representing the final state.
 */
function swapChangedAddedWords(lastToken, stack, endStreakPos, beforeWords, startStreakPos, afterWords) {
  const newBeforeWordPosition = lastToken.beforeWordPosition - 1;
  const newStack = cloneDeep(stack)
  const endStreak = newStack[endStreakPos]
  if (endStreak) {
    newStack.splice(endStreakPos, 1)
    endStreak.token = beforeWords[newBeforeWordPosition] // use token from begining instance
    endStreak.occurrenceToChange = endStreak.token.occurrence
    newStack.splice(startStreakPos, 0, endStreak)
    const newAfterWordToken = beforeWords[newBeforeWordPosition]
    let newAfterWordPosition = newAfterWordToken.index
    for (let i = startStreakPos; i <newStack.length; i++) {
      const item = newStack[i]
      item.beforeWordPosition = newBeforeWordPosition
      item.afterWordPosition = newAfterWordPosition++
      stack[i] = item // replace original
    }
  }
}

/**
 * Swaps and modifies words occurrences marked as deleted.
 *
 * @param {Object} lastToken - The last token being processed, containing positional information.
 * @param {Array} stack - The current list of words to be modified.
 * @param {number} endStreakPos - The ending position in the added list where changes occur.
 * @param {Array} beforeWords - The list of words representing the initial state.
 * @param {number} startStreakPos - The index where the modified token should be inserted.
 * @param {Array} afterWords - The list of words representing the final state.
 */
function swapChangedDeletedWords(lastToken, stack, endStreakPos, beforeWords, startStreakPos, afterWords) {
  const newAfterWordPosition = lastToken.afterWordPosition - 1;
  const newStack = cloneDeep(stack)
  const endStreak = newStack[endStreakPos]
  if (endStreak) {
    newStack.splice(endStreakPos, 1)
    endStreak.token = afterWords[newAfterWordPosition] // use token from begining instance
    endStreak.occurrenceToChange = endStreak.token.occurrence
    newStack.splice(startStreakPos, 0, endStreak)
    const newBeforeWordToken = afterWords[newAfterWordPosition]
    let newBeforeWordPosition = newBeforeWordToken.index
    for (let i = startStreakPos; i <newStack.length; i++) {
      const item = newStack[i]
      item.afterWordPosition = newAfterWordPosition
      item.beforeWordPosition = newBeforeWordPosition++
      stack[i] = item // replace original
    }
  }
}

/**
 * Adjusts the starting position within a contiguous sequence of operations where the last word matches the word before.
 *
 * @param {Array} order - An array of objects representing the sequence of operations where each object contains an action and a position.
 * @param {string} operation - The specific operation to match with actions in the order array. (e.g. added or deleted)
 * @param {Array} stack - An array representing the stack of tokens, each containing positional and word-related information.
 * @param {Array} beforeWords - An array of tokens representing words processed before the current operation.
 * @param {Array} afterWords - An array of tokens representing words processed after the current operation.
 * @return {void} This function modifies the `stack` in-place without returning a value.
 */
function fixStartPositionWhereRepeatedWord(order, operation, stack, beforeWords, afterWords) {
  const ifAdding = operation === "added";
  const fixedSequenceField = ifAdding ?  "beforeWordPosition" : "afterWordPosition"
  const stackWords = ifAdding ?  beforeWords : afterWords

  for (let i = 0; i < order.length; i++) {
    const item = order[i]
    if (item.action === operation) {
      const currentToken = stack[item.position]
      // find end of stack words contiguous sequence
      let endStreakPos = i;
      let lastToken = currentToken
      let nextToken, nextItem;
      for (let j = i + 1; j < order.length; j++) {
        nextItem = order[j]
        if (item.action !== operation) {
          break;
        }
        nextToken = stack[nextItem.position]
        if (!nextToken || currentToken[fixedSequenceField] !== nextToken[fixedSequenceField]) {
          break;
        }
        lastToken = nextToken
        endStreakPos = j
      }

      // now that we have the sequence of stack words
      const lastWord = lastToken.word || lastToken.text
      // check if previous matching word
      const previousPos = currentToken[fixedSequenceField] - 1
      if (previousPos >= 0) {
        const previousToken = stackWords[previousPos]
        const previousWord = previousToken.word || previousToken.text
        if (lastWord === previousWord) {
          if (ifAdding) {
            swapChangedAddedWords(lastToken, stack, endStreakPos, beforeWords, i, afterWords);
          } else {
            swapChangedDeletedWords(lastToken, stack, endStreakPos, beforeWords, i, afterWords);
          }
          i = endStreakPos // skip over the section changed
        }
      }
    }
  }
}

/**
 * Identifies words that were added or deleted between two arrays of words.
 *
 * This function performs a sequential comparison of two word arrays, tracking insertions and deletions
 * while handling multiple occurrences of the same word. It uses a two-pointer algorithm to traverse
 * both arrays and determines whether words were added, deleted, or remain unchanged.
 *
 * @param {Object[]} beforeWords - The array of words before changes. Each word object should have a 'text' property.
 * @param {Object[]} afterWords - The array of words after changes. Each word object should have a 'text' property.
 * @returns {{added: Object[], deleted: Object[], order: Object[]}} An object with three arrays:
 *   - `added`: Words newly present in `afterWords` that were not in `beforeWords`, each containing:
 *     - `word`: The text of the added word
 *     - `token`: The complete word object from `afterWords`
 *     - `occurrences`: Total count of this word in `afterWords`
 *     - `occurrenceToChange`: The occurrence number to change in existing alignments (-1 if not applicable)
 *     - `beforeWordPosition`: The position in `beforeWords` where the word was inserted
 *     - `afterWordPosition`: The position in `afterWords` where the word was added
 *   - `deleted`: Words present in `beforeWords` that are not in `afterWords`, each containing:
 *     - `word`: The text of the deleted word
 *     - `token`: The complete word object from `beforeWords`
 *     - `occurrences`: Total count of this word in `afterWords`
 *     - `occurrenceToChange`: The occurrence number to change in existing alignments (-1 if not applicable)
 *     - `beforeWordPosition`: The position in `beforeWords` where the word was deleted
 *     - `afterWordPosition`: The position in `afterWords` where the word would have been
 *   - `order`: Sequential list of changes for maintaining proper order, each containing:
 *     - `action`: Either "added" or "deleted"
 *     - `position`: Index in the respective `added` or `deleted` array
 * @description Compares two arrays of word objects to detect added and deleted words,
 *              taking into account the order and multiple occurrences of words. The algorithm
 *              uses lookahead to determine whether a word mismatch represents an insertion,
 *              deletion, or replacement by examining remaining words in both arrays.
 *   - afterWords - The array of words after changes. Each word object should have a 'text' property.
 */
function findWordChanges(beforeWords, afterWords) {

  try {
    let added = []
    const deleted = []
    const order = []
    const _initialAfterWords = cloneDeep(afterWords)

    let beforeWordPosition = 0, afterWordPosition = 0

    while (beforeWordPosition < beforeWords.length || afterWordPosition < afterWords.length) {
      const beforeWord = beforeWords[beforeWordPosition]
      const afterWord = afterWords[afterWordPosition]

      // Check if current words match
      const beforeWordText = beforeWord?.text
      const afterWordText = afterWord?.text
      if (beforeWordText === afterWordText) {
        beforeWordPosition++
        afterWordPosition++
      } else {
        // Look ahead to see if current afterWord appears later in beforeWords
        const posAfterwordInRemainingBeforeWords = afterWord
          ? findWordInObjects(beforeWords, afterWord.text, beforeWordPosition + 1)
          : -1
        const isAfterwordInRemainingBeforeWords = posAfterwordInRemainingBeforeWords >= 0

        // Look ahead to see if current beforeWord appears later in afterWords
        const posBeforeWordInRemainingAfterWords = beforeWord
          ? findWordInObjects(afterWords, beforeWord.text, afterWordPosition + 1)
          : -1
        const isBeforeWordInRemainingAfterWords = posBeforeWordInRemainingAfterWords >= 0

        let deleteWord = false
        let insertWord = false

        if (afterWord && (!isAfterwordInRemainingBeforeWords)) {
          // afterWord is completely new - doesn't exist anywhere in remaining beforeWords
          insertWord = true
        } else if (beforeWord && !isBeforeWordInRemainingAfterWords) {
          // beforeWord was completely removed - doesn't exist anywhere in remaining afterWords
          deleteWord = true
        } else {
          // Both words exist somewhere in remaining arrays, need to determine order of operations

          // Calculate net change in word counts from current positions forward
          const afterWordChange = getChangeInWordCounts(beforeWords, beforeWordPosition, afterWords, afterWordPosition, afterWordText)
          const beforeWordChange = getChangeInWordCounts(beforeWords, beforeWordPosition, afterWords, afterWordPosition, beforeWordText)

          if (beforeWord && (beforeWordChange < 0)) {
            // beforeWord has fewer remaining occurrences in after - it was deleted
            deleteWord = true
          } else if (afterWord && (afterWordChange > 0)) {
            // afterWord has more remaining occurrences in after - it was added
            insertWord = true
          } else if (beforeWord && (posBeforeWordInRemainingAfterWords > posAfterwordInRemainingBeforeWords)) {
            // beforeWord appears further away than afterWord - delete beforeWord first
            deleteWord = true
          } else if (afterWord && (posBeforeWordInRemainingAfterWords <= posAfterwordInRemainingBeforeWords)) {
            // afterWord appears closer or at same distance - insert afterWord first
            insertWord = true
          } else {
            // TODO fix - should not get into this state, so we just processing arbitrary word
            console.warn("findWordChanges - unexpected situation, skipping word")
            if (beforeWord) {
              deleteWord = true
            } else if (afterWord) {
              insertWord = true
            }
          }
        }

        if (insertWord) {
          // Record the word insertion
          const occurrences = countOccurrenceInObjects(afterWords, afterWordText, 0)
          const startWord = findWordInObjects(beforeWords, afterWordText, beforeWordPosition + 1)
          const occurrenceToChange = startWord >= 0 ? beforeWords[startWord].occurrence : -1
          added.push({
            word: afterWordText,
            token: afterWord,
            occurrences,
            occurrenceToChange,
            beforeWordPosition,
            afterWordPosition
          })
          afterWordPosition++
          order.push({action: "added", position: added.length - 1})
        }
        if (deleteWord) {
          // Record the word deletion
          const occurrences = countOccurrenceInObjects(afterWords, beforeWordText, 0)
          const startWord = findWordInObjects(beforeWords, beforeWordText, beforeWordPosition + 1)
          const occurrenceToChange = startWord >= 0 ? beforeWords[startWord].occurrence : -1
          deleted.push({
            word: beforeWordText,
            token: beforeWord,
            occurrences,
            occurrenceToChange,
            beforeWordPosition,
            afterWordPosition
          })
          beforeWordPosition++
          order.push({action: "deleted", position: deleted.length - 1})
        }
        if (!insertWord && !deleteWord) {
          console.error("findWordChanges - unsupported situation, punt")
          // Fallback: advance both pointers to avoid infinite loop
          beforeWordPosition++
          afterWordPosition++
        }
      }
    }

    // fix sequence of added words
    fixStartPositionWhereRepeatedWord(order, "added", added, beforeWords, afterWords);

    // fix sequence of deleted words
    fixStartPositionWhereRepeatedWord(order, "deleted", deleted, beforeWords, afterWords, "afterWordPosition");

    return {added, deleted, order, afterWords}
  } catch (e) {
    console.error(`findWordChanges - error thrown finding changes`, e)
    return {added: [], deleted: [], order: [], afterWords: _initialAfterWords}
  }
}

/**
 * merge alignments into new target verse
 * @return {string|null} target verse in USFM format
 * @param {object[]} initialTargetVerseObjects
 * @param {string} newTargetVerse
 */
export function updateAlignmentsToTargetVerse(initialTargetVerseObjects, newTargetVerse) {
  let targetVerseUsfm = convertVerseDataToUSFM(initialTargetVerseObjects);
  let { targetWords, verseAlignments } = parseUsfmToWordAlignerData(targetVerseUsfm, null);
  const newTargetTokens = getWordListFromVerseObjects(usfmVerseToJson(newTargetVerse));
  const wordChanges = findWordChanges(targetWords, newTargetTokens)

  // DEBUG
  const targetVerseString = UsfmFileConversionHelpers.cleanAlignmentMarkersFromString(targetVerseUsfm);
  console.log('initialtext:\n', targetVerseString)
  console.log('newText:\n', newTargetVerse)
  console.log('changes: ', wordChanges)
  //

  try {
    adjustTargetOccurrences(wordChanges, verseAlignments)
    targetVerseUsfm = addAlignmentsToVerseUSFM(newTargetTokens, verseAlignments, newTargetVerse);
    if (targetVerseUsfm === null) {
      console.warn(`updateAlignmentsToTargetVerse() - alignment FAILED for ${newTargetVerse}, removing all alignments`);
      targetVerseUsfm = newTargetVerse;
    }
  } catch (e) {
    console.error(`updateAlignmentsToTargetVerse - error thrown finding changes, removing alignments`, e)
    targetVerseUsfm = newTargetVerse
  }
  const alignedVerseObjects = usfmVerseToJson(targetVerseUsfm)
  return {
    targetVerseObjects: alignedVerseObjects,
    targetVerseText: targetVerseUsfm,
  };
}

/**
 * migrate alignments to match original language words, and then merge alignments into target verse
 * @return {string|null} target verse in USFM format
 * @param {object[]} targetVerseObjects
 * @param {string} newTargetVerse
 * @param {object[]} originalLanguageVerseObjects
 */
export function updateAlignmentsToTargetVerseWithOriginal(targetVerseObjects, newTargetVerse, originalLanguageVerseObjects) {
  // migrate the initial alignments to current original source
  const migratedTargetVerseObjects = migrateTargetAlignmentsToOriginal(targetVerseObjects, originalLanguageVerseObjects)

  // apply new verse text
  const results = updateAlignmentsToTargetVerse(migratedTargetVerseObjects, newTargetVerse)
  return results
}

/**
 * generate blank alignments for all the verses in a verse span
 * @param {string} verseSpan
 * @param {object} origLangChapterJson
 * @param {object} blankVerseAlignments - object to return verse alignments
 * @return {{low, hi}} get range of verses in verse span
 */
function getRawAlignmentsForVerseSpan(verseSpan, origLangChapterJson, blankVerseAlignments) {
  const { low, high } = getVerseSpanRange(verseSpan);

  // generate raw alignment data for each verse in range
  for (let verse = low; verse <= high; verse++) {
    const originalVerse = origLangChapterJson[verse];

    if (originalVerse) {
      const blankAlignments = wordaligner.generateBlankAlignments(originalVerse);
      blankVerseAlignments[verse] = blankAlignments;
    }
  }

  return { low, hi: high };
}

/**
 * business logic for convertAlignmentsFromVerseSpansToVerse:
 *    for each alignment converts mapping to original language verse span to be mapped to original language verse by adding ref and updating occurrence(s)
 * @param {object} verseSpanData - aligned output data - will be modified with verse span fixes
 * @param {number} low - low verse number of span
 * @param {number} hi - high verse number of span
 * @param {object} blankVerseAlignments - raw verse alignments for extracting word counts for each verse
 * @param {number|string} chapterNumber
 */
function convertAlignmentsFromVerseSpansToVerseSub(verseSpanData, low, hi, blankVerseAlignments, chapterNumber) {
  const verseSpanAlignments = verseSpanData && verseSpanData.verseObjects;
  const alignments = getVerseAlignments(verseSpanAlignments);

  for (let alignment of alignments) {
    const word = alignment.content;
    let occurrence = alignment.occurrence;

    // transform occurrence(s) from verse span based to verse reference
    for (let verse = low; verse <= hi; verse++) {
      const wordCount = getWordCountInVerse(blankVerseAlignments, verse, word);

      if (occurrence <= wordCount) { // if inside this verse, add reference
        alignment.ref = `${chapterNumber}:${verse}`;
        alignment.occurrences = wordCount;
        alignment.occurrence = occurrence;
        break;
      } else {
        occurrence -= wordCount; // subtract counts for this verse
      }
    }
  }
}

/**
 * for each alignment converts mapping to original verse by ref to be mapped to original language verse span by removing ref and updating occurrence(s)
 * @param {object} targetLanguageVerse - in verseObjects format
 * @param {object} originalLanguageChapterData - verseObjects for the current chapter
 * @param {string} chapter - current chapter (used for sanity checking refs for original language alignments)
 * @param {string} verseSpan - range of verses (e.g. '11-13')
 * @return {{alignedTargetVerseObjects: *, originalLanguageVerseObjects: {verseObjects}}}
 */
export function convertAlignmentFromVerseToVerseSpan(targetLanguageVerse, originalLanguageChapterData, chapter, verseSpan) {
  const blankVerseAlignments = {};
  const alignedTargetVerseObjects = cloneDeep(targetLanguageVerse)
  const {low, hi} = getRawAlignmentsForVerseSpan(verseSpan, originalLanguageChapterData, blankVerseAlignments);
  let mergedUgntData = [];
  for (let verse = low; verse <= hi; verse++) {
    const verseObjectsForVerse = originalLanguageChapterData?.[verse]?.verseObjects;
    mergedUgntData = mergedUgntData.concat(verseObjectsForVerse || [])
  }
  const originalLanguageVerseObjects = convertAlignmentFromVerseToVerseSpanSub(mergedUgntData, alignedTargetVerseObjects, chapter, low, hi, blankVerseAlignments)
  return {alignedTargetVerseObjects, originalLanguageVerseObjects};
}

/**
 *  for each alignment converts mapping to original language verse span to be mapped to original language verse by adding ref and updating occurrence(s)
 * @param originalLanguageChapterData
 * @param alignedTargetVerseObjects
 * @param {string} chapter
 * @param {string} verseSpan
 * @return {string}
 */
export function convertAlignmentsFromVerseSpansToVerse(originalLanguageChapterData, alignedTargetVerseObjects, chapter, verseSpan) {
  const blankVerseAlignments = {};
  const {low, hi} = getRawAlignmentsForVerseSpan(verseSpan, originalLanguageChapterData, blankVerseAlignments);
  const verseSpanData = cloneDeep(alignedTargetVerseObjects)
  convertAlignmentsFromVerseSpansToVerseSub(verseSpanData, low, hi, blankVerseAlignments, chapter)
  const finalUSFM = convertVerseDataToUSFM(verseSpanData)
  return finalUSFM;
}

/**
 * reset the alignments in verseAlignments_ and targetWords_ - returns new arrays with alignments reset
 * @param {array[AlignmentType]} verseAlignments_
 * @param {array[TargetWordBankType]} targetWords_
 * @returns {{words: array[TargetWordBankType], verseAlignments: array[AlignmentType] }}
 */
export function resetAlignments(verseAlignments_, targetWords_) {
  if (verseAlignments_?.length) {
    const verseAlignments = cloneDeep(verseAlignments_)
    const targetWords = cloneDeep(targetWords_)

    for (const alignment of verseAlignments) { // clear out each alignment
      alignment.targetNgram = [] // remove target words for each alignment
      if (alignment.sourceNgram?.length > 1) { // if there are multiple source words, split each into separate alignment
        for (let i = 1; i < alignment.sourceNgram?.length; i++) {
          const sourceNgram = alignment.sourceNgram[i]
          const newAlignment = {
            sourceNgram: [sourceNgram],
            targetNgram: []
          }
          verseAlignments.push(newAlignment)
        }

        alignment.sourceNgram = [alignment.sourceNgram[0]]
      }
    }

    for (const word of targetWords) { // clear all words marked used
      word.disabled = false
    }
    return {verseAlignments, targetWords}
  }
  return { }
}
