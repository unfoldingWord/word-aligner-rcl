import { getOrigLangforBook } from './bibleHelpers'

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
 * @param {Object} bookData.chapters - Chapter data indexed by chapter number
 * @param {Object} bookData.metadata - Optional metadata about the book
 *
 * @returns {Object} The generated group data organized by categories and group IDs
 * @returns {Object} groupData - Structured data ready for tool consumption
 * @returns {Array} groupData.items - Array of group data items
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

/**
 * Generates a chapter-based group index.
 * Most tools will use a chapter based-index.
 * @param {function} translate - the locale function
 * @param {number} [numChapters=150] - the number of chapters to generate
 * @return {*}
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
