import {removeUsfmMarkers, usfmVerseToJson} from "./usfmHelpers";
import wordaligner from "word-aligner";
import * as UsfmFileConversionHelpers from "./UsfmFileConversionHelpers";
import {convertVerseDataToUSFM} from "./UsfmFileConversionHelpers";
import {
  getAlignedWordListFromAlignments,
  getOriginalLanguageListForVerseData,
  updateAlignedWordsFromOriginalWordList
} from "./migrateOriginalLanguageHelpers";
import Lexer from "wordmap-lexer";

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
 * for each item in word list convert occurrence(s) to numbers
 * @param {array} wordlist
 * @returns {array}
 */
function convertOccurrences(wordlist) {
  const wordlist_ = wordlist.map(item => {
    const occurrence = parseStrToNumber(item.occurrence);
    const occurrences = parseStrToNumber(item.occurrences);
    return {
      ...item,
      occurrence,
      occurrences,
    }
  })
  return wordlist_;
}

/**
 * extract alignments from target verse USFM using sourceVerse for word ordering
 * @param {string} alignedTargetVerse
 * @param {object} sourceVerse - in verseObject format
 * @return {array} list of alignments in target text
 */
export function extractAlignmentsFromTargetVerse(alignedTargetVerse, sourceVerse) {
  const targetVerse = usfmVerseToJson(alignedTargetVerse);
  const alignments = wordaligner.unmerge(targetVerse, sourceVerse);
  const originalLangWordList = getOriginalLanguageListForVerseData(sourceVerse);
  const alignedTargetWordList = getAlignedWordListFromAlignments(alignments.alignment);
  // clean up metadata in alignments
  updateAlignedWordsFromOriginalWordList(originalLangWordList, alignedTargetWordList);
  if (alignments.alignment) { // for compatibility change alignment to alignments
    // convert occurrence(s) from string to number
    const alignments_ = alignments.alignment.map(alignment => {
      const topWords = convertOccurrences(alignment.topWords);
      const bottomWords = convertOccurrences(alignment.bottomWords);
      return {
        ...alignment,
        topWords,
        bottomWords,
        sourceNgram: topWords.map(topWord => {
          const pos = originalLangWordList.findIndex(item => (
            topWord.word === item.text &&
            topWord.occurrence === item.occurrence
          ));
          return {
            ...topWord,
            position: pos,
            index: pos,
            text: topWord.text || topWord.word,
          }
        }),
        targetNgram: bottomWords.map(item => ({ ...item, text: item.text || item.word })),
      }
    })
    alignments.alignments = alignments_;
  }
  return alignments;
}

/**
 * merge alignments into target verse
 * @param {string} targetVerseText - target verse to receive alignments
 * @param {{alignments, wordBank}} verseAlignments - contains all the alignments and wordbank is list of unaligned target words
 * @return {string|null} target verse in USFM format
 */
export function addAlignmentsToTargetVerseUsingUnmerge(targetVerseText, verseAlignments) {
  const verseString = UsfmFileConversionHelpers.cleanAlignmentMarkersFromString(targetVerseText);
  let verseObjects;

  try {
    verseObjects = wordaligner.merge(
      verseAlignments.alignments, verseAlignments.wordBank, verseString, true,
    );
  } catch (e) {
    console.log(`addAlignmentsToTargetVerse() - invalid alignment`, e);
  }

  if (verseObjects) {
    const targetVerse = convertVerseDataToUSFM(verseObjects);
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
    token.disabled = isUsed;
    return token;
  });
}

/**
 * create wordbank of unused target words, transform alignments, and then merge alignments into target verse
 * @param {array} wordListWords - list of all target words - the disabled flag indicates word is aligned
 * @param {array} verseAlignments
 * @param {string} targetVerseText - target verse to receive alignments
 * @return {string|null} target verse in USFM format
 */
export function addAlignmentsToVerseUSFM(wordListWords, verseAlignments, targetVerseText) {
  let wordBank = wordListWords.filter(item => (!item.disabled))
  wordBank = wordBank.map(item => ({
    ...item,
    word: item.word || item.text,
    occurrence: item.occurrence || item.tokenOccurrence,
    occurrences: item.occurrences || item.tokenOccurrences,
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
      word: item.word || item.text,
    })),
    bottomWords: item.targetNgram.map(item => ({
      ...item,
      word: item.word || item.text
    })),
  }));
  const alignments = {
    alignments: alignments_,
    wordBank,
  }
  const verseUsfm = addAlignmentsToTargetVerseUsingUnmerge(targetVerseText, alignments);
  return verseUsfm;
}

/**
 * parse target language and original language USFM text into the structures needed by the word-aligner
 * @param {string} targetVerseUSFM
 * @param {string} sourceVerseUSFM
 * @returns {{wordListWords: *[], verseAlignments: *}}
 */
export function parseUsfmToWordAlignerData(targetVerseUSFM, sourceVerseUSFM) {
  let targetTokens = [];
  if (targetVerseUSFM) {
    targetTokens = Lexer.tokenize(removeUsfmMarkers(targetVerseUSFM));
  }

  const sourceVerseObjects = usfmVerseToJson(sourceVerseUSFM);
  let wordListWords = [];
  const targetVerseAlignments = extractAlignmentsFromTargetVerse(targetVerseUSFM, sourceVerseObjects);
  const verseAlignments = targetVerseAlignments.alignments;
  if (sourceVerseObjects) {
    wordListWords = markTargetWordsAsDisabledIfAlreadyUsedForAlignments(targetTokens, verseAlignments);
  }
  return {wordListWords, verseAlignments};
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
      const targetWordCount = alignment.targetNgram?.length || 0;
      if (!targetWordCount) {
        alignmentComplete = false;
        break;
      }
    }
  }
  return alignmentComplete;
}
