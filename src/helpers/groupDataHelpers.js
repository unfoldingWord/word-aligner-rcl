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
 * @description - Auto generate the chapter group data since more projects will use it
 * @param {String} bookId - id of the current book
 * @param {String} toolName - id of the current tool
 * @param {Object} targetBook
 */
export const generateChapterGroupData = (bookId, bookData, toolName) => {
  let groupsData = [];
  const { languageId: origLang, bibleId: origBible } = getOrigLangforBook(bookId);

  let chapters = bookData && Object.keys(bookData) || null;
  if (chapters && bookId && toolName) { // make we have data
    chapters = chapters.filter(chapter => chapter !== 'front' && chapter !== 'manifest')
    chapters.sort((a, b) => parseInt(a) - parseInt(b)) // sort chapters numerically

    groupsData = chapters.map((chapter) => { // create array from number of chapters
      const verses = bookData[chapter] // get the verses for chapter
      let verseList = Object.keys(verses)
      verseList = verseList.filter(chapter => chapter !== 'front')
      verseList.sort((a, b) => parseInt(a) - parseInt(b))

      return verseList.map((verse) => // turn number of verses into array
        createGroupItem(bookId, chapter, verse, toolName));
    });
  }
  return groupsData;
};

/**
 * Generates a chapter-based group index.
 * Most tools will use a chapter based-index.
 * @param {function} translate - the locale function
 * @param {number} [numChapters=150] - the number of chapters to generate
 * @return {*}
 */
export const generateChapterGroupIndex = (translate, numChapters = 150) => {
  const chapterLocalized = translate('tools.chapter', 'Chapter');
  return Array(numChapters).fill().map((_, i) => {
    let chapter = i + 1;
    return {
      id: 'chapter_' + chapter,
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
