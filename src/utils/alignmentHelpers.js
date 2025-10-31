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
    occurrence: item.occurrence || item.occurrence,
    occurrences: item.occurrences || item.occurrences
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
 * Adjusts occurrence numbers in alignment target words based on word changes (insertions/deletions).
 *
 * When words are added or deleted from the target text, the occurrence numbers of subsequent instances
 * of the same word need to be updated. For example, if the second occurrence of "the" is deleted,
 * what was previously the third occurrence becomes the second occurrence.
 *
 * @param {Object} wordChanges - Object containing word change information with properties:
 *   - `order`: Array of change operations in sequential order
 *   - `added`: Array of added word details
 *   - `deleted`: Array of deleted word details
 * @param {Object} alignments - Alignments object containing:
 *   - `alignments`: Array of alignment objects, each with `targetNgram` arrays
 * @description Iterates through word changes in order, incrementing or decrementing occurrence numbers
 *              for aligned target words that match the changed word and have occurrence numbers at or
 *              above the change point.
 */
function adjustTargetOccurrences(wordChanges, alignments) {
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
    const occurrenceToChange = actionItem?.occurrenceToChange
    const occurrences = actionItem?.occurrences

    // Only process if we have valid occurrence data
    if (occurrences && occurrenceToChange >= 0) {
      const alignments_ = alignments?.alignments || [];

      // Iterate through all alignments
      for (const alignment of alignments_) {
        // Check each target word in the alignment
        for (const targetNgram of alignment.targetNgram) {
          const occurrence = targetNgram.occurrence
          const text = targetNgram.text

          // If this target word matches the changed word
          if (text === actionItem.word) {
            // Update occurrence number if it's at or after the change point
            if (occurrence >= occurrenceToChange) {
              targetNgram.occurrence = occurrence + change
            }
          }
        }
      }
    }
  }
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
  if (wordChanges?.order) {
    adjustTargetOccurrences(wordChanges, alignments);
  }
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
 * iterates through target words looking for words not in wordBankList.  If an added word is found, it is added to
 *   wordbank.  And if there are other instances are found, then occurrence counts are updated.
 * @param {array} targetWordList - list of target words
 * @param {array} wordBankList - list of target words in the word bank
 * @param {array} verseAlignments - list of verse alignments that may need updating
 */
function handleAddedWordsInNewText(targetWordList, wordBankList, verseAlignments) {
  for (const targetToken of targetWordList) {
    const pos = wordBankList.findIndex(word => (
      word.text === targetToken.text &&
      word.occurrence === targetToken.occurrence
    ))
    if (pos < 0) {
      const occurrences = targetToken.occurrences;
      const tokenWord = targetToken.text;
      // update occurrence count for all aligned instances of this word
      for (const alignment of verseAlignments) {
        for (const targetWord of alignment.targetNgram) {
          var word_ = targetWord.word || targetWord.text;
          if (word_ === tokenWord) {
            targetWord.occurrences = occurrences
          }
        }
      }
      // update occurrence count for all wordbank instances of this word
      for (const wordBank of wordBankList) {
        var word_ = wordBank.word || wordBank.text;
        if (word_ === tokenWord) {
          wordBank.occurrences = occurrences
        }
      }
      wordBankList.push(targetToken);
    }
  }
}

/**
 * iterates through verse alignments looking for target words not in target word list.  If an extra word is found, it
 * is removed from the verse alignments and occurrence(s) are updated.
 * @param {array} verseAlignments - list of verse alignments that may need updating
 * @param {array} targetWordList - list of target words in new verse text
 * @param {array} targetWords - list of target words in alignments
 * */
function handleDeletedWords(verseAlignments, targetWordList, targetWords) {
  for (const alignment of verseAlignments) {
    let delete_ = [];
    for (let i = 0, l = alignment.targetNgram.length; i < l; i++) {
      let wordFound = false;
      const targetWord = alignment.targetNgram[i];
      const word = targetWord.text;
      for (const targetToken of targetWordList) {
        if (targetToken.text === word) {
          if (targetWord.occurrence > targetToken.occurrences) {
            delete_.push(i); // extra aligned word
          } else if (targetWord.occurrences !== targetToken.occurrences) {
            // fixup counts
            targetWord.occurrences = targetToken.occurrences;
          }
          wordFound = true;
          break;
        }
      }
      if (!wordFound) {
        delete_.push(i); // extra aligned word
      }
    }
    while (delete_.length) {
      const remove = delete_.pop();
      alignment.targetNgram.splice(remove, 1);
    }
  }

  // remove extra target words that are not in targetWordList
  for (let i = 0; i < targetWords.length; i++) {
    let newOccurrences = 0
    const wordBankWord = targetWords[i]
    const found = targetWordList.findIndex(word => {
      if (word.text === wordBankWord.text ) {
        if (word.occurrence === wordBankWord.occurrence) {
          return true
        }
        newOccurrences = word.occurrences
      }
      return false;
    })
    if (found < 0) {
      // update occurrences
      if (newOccurrences) {
        for (const word of targetWords) {
          if (word.text === wordBankWord.text) {
            if (word.occurrences !== newOccurrences) {
              // fixup counts
              word.occurrences = newOccurrences
            }
          }
        }
      }
      // remove extra word
      targetWords.splice(i, 1)
      i--
    }
  }
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
 */
function findWordChanges(beforeWords, afterWords) {
  const added = []
  const deleted = []
  const order = []

  let i = 0, j = 0

  while (i < beforeWords.length || j < afterWords.length) {
    const beforeWord = beforeWords[i]
    const afterWord = afterWords[j]

    // Check if current words match
    const beforeWordText = beforeWord?.text
    const afterWordText = afterWord?.text
    if (beforeWordText === afterWordText) {
      i++
      j++
    } else {
      // Look ahead to see if current afterWord appears later in beforeWords
      const posAfterwordInRemainingBeforeWords = afterWord
        ? findWordInObjects(beforeWords, afterWord.text, i+1)
        : -1
      const isAfterwordInRemainingBeforeWords = posAfterwordInRemainingBeforeWords >= 0

      // Look ahead to see if current beforeWord appears later in afterWords
      const posBeforeWordInRemainingAfterWords = beforeWord
        ? findWordInObjects(afterWords, beforeWord.text, j+1)
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
        const afterWordChange = getChangeInWordCounts(beforeWords, i, afterWords, j, afterWordText)
        const beforeWordChange = getChangeInWordCounts(beforeWords, i, afterWords, j, beforeWordText)

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
        const startWord = findWordInObjects(beforeWords, afterWordText, i+1)
        const occurrenceToChange = startWord >= 0 ? beforeWords[startWord].occurrence : -1
        added.push({ word: afterWordText,  token: afterWord, occurrences, occurrenceToChange, beforeWordPosition: i, afterWordPosition: j })
        j++
        order.push({action: "added", position: added.length-1})
      }
      if (deleteWord) {
        // Record the word deletion
        const occurrences = countOccurrenceInObjects(afterWords, beforeWordText, 0)
        const startWord = findWordInObjects(beforeWords, beforeWordText, i+1)
        const occurrenceToChange = startWord >= 0 ? beforeWords[startWord].occurrence : -1
        deleted.push({ word: beforeWordText, token: beforeWord, occurrences, occurrenceToChange, beforeWordPosition: i, afterWordPosition: j })
        i++
        order.push({action: "deleted", position: deleted.length-1})
      }
      if (!insertWord && !deleteWord) {
        console.error("findWordChanges - unsupported situation, punt")
        // Fallback: advance both pointers to avoid infinite loop
        i++
        j++
      }
    }
  }

  return { added, deleted, order }
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
  const targetVerseString = UsfmFileConversionHelpers.cleanAlignmentMarkersFromString(targetVerseUsfm);
  console.log('initialtext:\n', targetVerseString)
  console.log('newText:\n', newTargetVerse)
  console.log('changes: ', wordChanges)
  handleAddedWordsInNewText(newTargetTokens, targetWords, verseAlignments);
  handleDeletedWords(verseAlignments, newTargetTokens, targetWords);
  targetVerseUsfm = addAlignmentsToVerseUSFM(targetWords, verseAlignments, newTargetVerse, wordChanges);
  if (targetVerseUsfm === null) {
    console.warn(`updateAlignmentsToTargetVerse() - alignment FAILED for ${newTargetVerse}, removing all alignments`);
    targetVerseUsfm = newTargetVerse;
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
