import { getOrigLangforBook } from './bibleHelpers'
import { convertVerseToUSFM } from './UsfmFileConversionHelpers'
import { tokenizeVerseObjects } from '../utils/verseObjects'
import { removeUsfmMarkers } from './usfmHelpers'
import { AlignmentHelpers } from '../index'
import Lexer from 'wordmap-lexer'
import { createVerseMarker, getVerseData as getVerseData_ } from '../tc_ui_toolkit/ScripturePane/helpers/verseHelpers'
import {COMPLETED_KEY, UNALIGNED_KEY} from "../common/constants";

function createGroupItem(bookId, chapter, verse, toolName) {
  return {
    'contextId': {
      'reference': {
        'bookId': bookId,
        'chapter': chapter,
        'verse': verse,
      },
      'tool': toolName,
      'groupId': 'chapter_' + chapter,
    },
  };
}

/**
 * @description Auto-generates the chapter group data since more projects will use it.
 * This function processes chapter-level data to create standardized group data structures
 * that can be consumed by various tools and components throughout the application.
 *
 * @param {string} bookId - The identifier of the current book (e.g., 'gen', 'mat', 'rev')
 * @param {string} toolName - The identifier of the current tool (e.g., 'translationWords', 'translationNotes')
 * @param {Object} bookData - The raw book data object containing chapters, verses, and associated content
 * @param {Object} bookData[chapters] - Chapter data indexed by chapter number
 * @param {Object} bookData.metadata - Optional metadata about the book
 *
 * @returns {Object} groupData - The generated group data organized by categories and group IDs
 * @returns {Array} groupData[group] - Array of group data items
 */
export const generateChapterGroupData = (bookId, bookData, toolName) => {
  let groupsData = { };
  const { languageId: origLang, bibleId: origBible } = getOrigLangforBook(bookId);

  let chapters = bookData && Object.keys(bookData) || null;
  if (chapters && bookId && toolName) { // make we have data
    chapters = chapters.filter(chapter => chapter !== 'front' && chapter !== 'manifest')
    chapters.sort((a, b) => parseInt(a) - parseInt(b)) // sort chapters numerically

    for (let chapter of chapters) {
      const verses = bookData[chapter] // get the verses for chapter
      let verseList = Object.keys(verses)
      verseList = verseList.filter(chapter => chapter !== 'front')
      verseList.sort((a, b) => parseInt(a) - parseInt(b))

      const verseData = verseList.map((verse) => // turn verses into array of group items
        createGroupItem(bookId, chapter, verse, toolName));
      const chapterId = getChapterId(chapter)
      groupsData[chapterId] = verseData;
    }
  }
  return groupsData;
};

/**
 * Generates a unique identifier for a chapter.
 *
 * @param {number|string} chapter - The chapter number or name to be used for generating the ID.
 * @return {string} Returns the unique identifier for the specified chapter.
 */
function getChapterId(chapter) {
  return 'chapter_' + chapter
}

export function initializeGroupData(groupsData, groupIndex, targetBook, sourceBook) {
  if (groupsData && groupIndex && targetBook && sourceBook) {
    for (const catagory of groupIndex) {
      const groupItems = groupsData[catagory.id]
      for (const groupItem of groupItems) {
        const contextId = groupItem.contextId
        const ref = contextId?.reference
        let alignmentComplete = false
        const targetVerseUSFM = getVerseUSFM(targetBook, ref.chapter, ref.verse)
        const sourceVerseUSFM = getVerseUSFM(sourceBook, ref.chapter, ref.verse)
        if (targetVerseUSFM && sourceVerseUSFM) {
          const {
            targetWords,
            verseAlignments
          } = AlignmentHelpers.parseUsfmToWordAlignerData(targetVerseUSFM, sourceVerseUSFM)
          alignmentComplete = AlignmentHelpers.areAlgnmentsComplete(targetWords, verseAlignments);
        }
        groupItem[COMPLETED_KEY] = alignmentComplete
        groupItem[UNALIGNED_KEY] = !alignmentComplete
      }
    }
  } else {
    console.warn(`initializeGroupData() - data missing for book`)
  }
}

/**
 * Generates a chapter-based group index.
 * Most tools will use a chapter based-index.
 * @param {function} translate - the locale function
 * @param {number} [numChapters=150] - the number of chapters to generate
 * @return {Array} - catagories of group data
 */
export const generateChapterGroupIndex = (translate, numChapters = 150) => {
  const chapterLocalized = translate('menu.chapter', 'Chapter');
  return Array(numChapters).fill().map((_, i) => {
    let chapter = i + 1;
    return {
      id: getChapterId(chapter),
      name: chapterLocalized + ' ' + chapter,
    };
  });
};

/**
 * Initializes group data for scripture by generating chapter group data, creating an index, and returning the result.
 *
 * @param {string} bookId - The identifier for the book being processed.
 * @param {object} targetBook - The target book object containing details relevant to the operation.
 * @param {string} toolName - The name of the tool invoking the method for context.
 * @param {object} sourceBook - The source book object used for reference during initialization.
 * @param {function} translate - A localization function to generate translated messages or values.
 * @return {object} Returns an object containing `groupsData` and `groupsIndex`, where `groupsData` holds the generated group data, and `groupsIndex` represents the chapter group index.
 */
export function initializeGroupDataForScripture(bookId, targetBook, toolName, sourceBook, translate) {
  const groupsData = generateChapterGroupData(bookId, targetBook, toolName)
  const groupsIndex = generateChapterGroupIndex(translate, Object.keys(groupsData).length);
  initializeGroupData(groupsData, groupsIndex, targetBook, sourceBook)
  return { groupsData: groupsData, groupsIndex: groupsIndex }
}

/**
 * Evaluates whether a check has already been loaded
 * @param {object} checkData - the json check data
 * @param {array} loadedChecks - an array of loaded unique checks
 * @returns {boolean} - true if the check has not been loaded yet.
 */
export function isCheckUnique(checkData, loadedChecks) {
  const checkContextId = checkData.contextId;

  if (checkContextId) {
    for (const check of loadedChecks) {
      const quoteCondition = Array.isArray(check.contextId.quote) ?
        isEqual(check.contextId.quote, checkContextId.quote) : check.contextId.quote === checkContextId.quote;

      if (check.contextId && check.contextId.groupId === checkContextId.groupId &&
          quoteCondition && check.contextId.occurrence === checkContextId.occurrence) {
        return false;
      }
    }
    return true;
  }
  throw new Error('Invalid check data, missing contextId');
}

/**
 * Retrieves the verse data for a given chapter and verse from the provided book data.
 *
 * @param {Object} bookData - The book data containing the chapters and verses.
 * @param {number} chapter - The chapter number from which the verse will be retrieved.
 * @param {number} verse - The specific verse number to retrieve.
 * @return {string|Object|undefined} The verse data as a string, verseObjects, or undefined if not found.
 */
export function getVerseData(bookData, chapter, verse) {
  const verseData = getVerseData_(bookData, chapter, verse, createVerseMarker)?.verseData
  return verseData
}

/**
 * Retrieves the USFM formatted verse from the provided book data.
 *
 * @param {Object} bookData - The book data object containing Bible contents.
 * @param {number|string} chapter - The chapter number to retrieve.
 * @param {number|string} verse - The verse number to retrieve.
 * @return {string|null} The USFM formatted verse text, or null if not found.
 */
export function getVerseUSFM(bookData, chapter, verse) {
  if (bookData && chapter && verse) {
    const verseData = getVerseData(bookData, chapter, verse)
    if (verseData) {
      const verseUSFM = convertVerseToUSFM(verseData)
      return verseUSFM
    }
  }
  return null
}

export function validateVerse(targetBook, sourceBook, chapter, verse, silent=false) {
  const targetVerseUSFM = getVerseUSFM(targetBook, chapter, verse);
  const sourceVerse = getVerseData(targetBook, chapter, verse)

  if (!(targetVerseUSFM && sourceVerse)) {
    console.warn(`Could not validate missing verse ${chapter}:${verse}`);
    return false;
  }

  const sourceTokens = tokenizeVerseObjects(sourceVerse.verseObjects);
  const targetVerseText = removeUsfmMarkers(targetVerse);
  const targetTokens = Lexer.tokenize(targetVerseText);
  let normalizedSource = '';
  let normalizedSourceArray = [];
  let normalizedTarget = '';
  let normalizedTargetArray = [];

  for (let t of sourceTokens) {
    normalizedSourceArray.push(t.toString());
  }
  normalizedSource = normalizedSourceArray.join(' ');

  for (let t of targetTokens) {
    normalizedTargetArray.push(t.toString());
  }
  normalizedTarget = normalizedTargetArray.join(' ');
  const isAligned = getIsVerseAligned(store.getState(), chapter, verse);
  const areVerseAlignmentsValid = getIsVerseAlignmentsValid(store.getState(), chapter, verse,
    normalizedSource, normalizedTarget);
  const isAlignmentComplete = getIsVerseFinished(this, chapter, verse);

  if (!areVerseAlignmentsValid) {
    const wasChanged = repairAndInspectVerse(chapter, verse, sourceTokens,
      targetTokens);
    let isVerseInvalidated = (wasChanged || isAligned || isAlignmentComplete);

    if (isVerseInvalidated) {
      this.setVerseInvalid(chapter, verse, true, silent);
    }
    this.setVerseFinished(chapter, verse, false);
    // TRICKY: if there were no alignments we fix silently
    return !isVerseInvalidated;
  }

  return true;
}
