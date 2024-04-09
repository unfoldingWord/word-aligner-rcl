/* eslint-disable curly */
import { isObject } from 'util';
// import {
//   formatAndSaveGroupData,
//   generateGroupDataItem,
//   ManageResource,
//   parseReference,
//   tsvToObjects,
// } from 'tsv-groupdata-parser';
// helpers
import * as resourcesHelpers from '../resourcesHelpers';
// eslint-disable-next-line no-duplicate-imports
// import {getResourceManifest} from '../resourcesHelpers';
// constants
// import * as errors from '../../resources/errors';
// import {getOwnerForOriginalLanguage} from '../apiHelpers';
// import {makeSureResourceUnzipped} from '../unzipFileHelpers';
// import { BIBLE_BOOKS, NT_ORIG_LANG, NT_ORIG_LANG_BIBLE, OT_ORIG_LANG, OT_ORIG_LANG_BIBLE } from '../../resources/bible';
import {
  convertEllipsisToAmpersand,
} from './tnArticleHelpers';
import * as tsvparser from 'uw-tsv-parser';
import { cleanupReference } from 'bible-reference-range'
import { getBestVerseFromBook } from '../verseHelpers'
import targetBible from '../../__tests__/fixtures/bibles/1jn/targetBible.json'
import { getWordOccurrencesForQuote } from './wordOccurrenceHelpers'
import { hasEllipsis } from '../tsv-groupdata-parser/ellipsisHelpers'
import { getVerseString } from '../tsv-groupdata-parser/verseHelpers'
import { ELLIPSIS } from '../../common/constants'
import { convertReference } from './tsvToGroupData'
import { getAlignedText } from '../../tc_ui_toolkit/VerseCheck/helpers/checkAreaHelpers'
// import { delay } from '../../utils/delay';

/**
 * organize group data by categories and groupID
 * @param {array} groupData
 * @return {Object}
 */
const categorizeGroupData = groupData => {
  const categorizedGroupData = {
    kt: {},
    names: {},
    other: {},
  };
  Object.keys(groupData).forEach(category_ => {
    let category = category_;
    const items = groupData[category];
    if (!categorizedGroupData[category]) {
      category = 'other'; // unknown categories go in other
    }
    for (const item of items) {
      const groupId = item.contextId && item.contextId.groupId;
      if (groupId) {
        if (!categorizedGroupData[category][groupId]) {
          categorizedGroupData[category][groupId] = [];
        }
        categorizedGroupData[category][groupId].push(item);
      }
    }
  });
  return categorizedGroupData;
};

/**
 * Returns the formatted groupData item for a given tsv item.
 * @param {object} tsvItem tsv item.
 * @param {string} toolName tool name.
 * @param {string} verseString
 * @returns {object} groupData item.
 */
export const generateGroupDataItem = (tsvItem, toolName, verseString) => {
  let { OrigQuote = '' } = tsvItem;
  // clean quote string
  OrigQuote = OrigQuote.replace(/ \& /g, ' … '); // treat new break character same as ellipsis
  // if quote has more than one word get word occurrences
  const wordOccurrencesForQuote = getWordOccurrencesForQuote(OrigQuote, verseString, true); // uses tokenizer to get list of words handle various punctuation and spacing chars
  const quote = wordOccurrencesForQuote.length > 1 || hasEllipsis(OrigQuote) ? wordOccurrencesForQuote : OrigQuote; // only use array if more than one word found
  const quoteString = OrigQuote.trim().replace(/\.../gi, ELLIPSIS);
  const { chapter, verse } = convertReference(tsvItem);
  return {
    comments: false,
    reminders: false,
    selections: false,
    verseEdits: false,
    nothingToSelect: false,
    contextId: {
      checkId: tsvItem.ID || '',
      occurrenceNote: tsvItem.OccurrenceNote || '',
      reference: {
        bookId: tsvItem.Book.toLowerCase() || '',
        chapter: chapter || '',
        verse: verse || '',
      },
      tool: toolName || '',
      groupId: tsvItem.SupportReference || '',
      quote,
      quoteString,
      glQuote: tsvItem.GLQuote || '',
      occurrence: parseInt(tsvItem.Occurrence, 10) || 1,
    },
  };
};


/**
 * Parses list of tsv items and returns an object holding the lists of group ids.
 * @param {Array} tsvItems - list of items to process
 * @param {string} originalBiblePath path to original bible.
 *        e.g. /resources/el-x-koine/bibles/ugnt/v0.11
 * @param {string} resourcesPath path to the resources dir
 *      e.g. /User/john/translationCore/resources
 * @param {string} bookId
 * @param {string} langId
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 *      then it returns the object organized by tn article category.
 * @return {Object} - groupData
 */
function tsvObjectsToGroupData(tsvItems, origLangBible, resourcesPath, bookId, langId, toolName, params) {
  const groupData = {};
  const twLinkMatch = /^rc:\/\/\*\/tw\/dict\/bible\/(\w+)\/([\w\d]+)/;
  const twLinkRE = new RegExp(twLinkMatch);
  bookId = bookId.toLowerCase();

  try {
    // const resourceApi = new ManageResource(originalBiblePath, bookId);

    for (const tsvItem of tsvItems) {
      if (tsvItem.Reference && tsvItem.ID && tsvItem.OrigWords && tsvItem.Occurrence && tsvItem.TWLink) {
//        const tags = cleanGroupId(tsvItem.Tags) || 'other';
        const twLink = tsvItem.TWLink.match(twLinkRE);
        if (!twLink) {
          console.warn(`tsvObjectsToGroupData() - invalid TWLink: ${tsvItem.TWLink}`);
          continue;
        }

        const chapter = tsvItem.Chapter;
        const verse = tsvItem.Verse;
        tsvItem.Book = bookId;
        tsvItem.Chapter = chapter;
        tsvItem.Verse = verse;
        tsvItem.OrigQuote = tsvItem.OrigWords;
        tsvItem.Catagory = twLink[1];
        tsvItem.SupportReference = twLink[2];
        let verseString = null;

        if (!tsvItem.Catagory || !tsvItem.SupportReference) {
          console.warn(`tsvObjectsToGroupData() - invalid TWLink: ${tsvItem.TWLink}`);
          continue;
        }

        try {
          verseString = getVerseString(origLangBible, tsvItem.Reference);
        } catch (e) {
          if (parseInt(chapter, 10) && parseInt(verse, 10)) {
            console.warn(`tsvObjectsToGroupData() - error getting verse string: chapter ${chapter}, verse ${verse} from ${JSON.stringify(tsvItem)}`, e);
          }
        }

        if (verseString) {
          const key = tsvItem.Catagory;
          const groupDataItem = generateGroupDataItem(tsvItem, toolName, verseString);
          if (groupData[key]) {
            groupData[key].push(groupDataItem);
          } else {
            groupData[key] = [groupDataItem];
          }
        }
      } else {
        console.warn('tsvObjectsToGroupData() - error processing item:', JSON.stringify(tsvItem));
      }
    }

    return params && params.categorized ? categorizeGroupData(groupData) : groupData;
  } catch (e) {
    console.error(`tsvObjectsToGroupData() - error processing TSVs`, e);
    throw e;
  }
}

/**
 * separate a reference string such as "1:1" into chapter and verse and add a verseStr for references that have multiple verses
 * @param {string} ref - reference string
 * @return {{Chapter, Verse}}
 */
export function parseReference(ref) {
  const cleanedRef = cleanupReference(ref);
  const ref_ = {
    Chapter: cleanedRef.chapter,
    Verse: cleanedRef.verse + '',
  };

  if (cleanedRef.verseStr) {
    ref_.verseStr = cleanedRef.verseStr;
  }
  return ref_;
}

/**
 * make sure context IDs are for same verse.  Optimized over isEqual()
 * @param {Object} contextId1
 * @param {Object} contextId2
 * @return {boolean} returns true if context IDs are for same verse
 */
export function isSameVerseByContext(contextId1, contextId2) {
  return (contextId1.reference.chapter == contextId2.reference.chapter) && // TRICKY: we are allowing coercion since chapters and verses could be either strings or numbers
    (contextId1.reference.verse == contextId2.reference.verse);
}

/**
 * make sure context IDs are for same verse.  Optimized over isEqual()
 * @param {Object} reference1
 * @param {Object} reference2
 * @return {boolean} returns true if context IDs are for same verse
 */
export function isSameVerseByRef(reference1, reference2) {
  return (reference1.chapter == reference2.chapter) && // TRICKY: we are allowing coercion since chapters and verses could be either strings or numbers
    (reference1.verse == reference2.verse);
}

export function findCheck(groupsData, contextId, defaultToFirst = false) {
  let check = null
  let checkedBook = false;
  if (groupsData && contextId?.reference) {
    for (const groupId of Object.keys(groupsData)) {
      if (groupId === contextId.groupId) {
        const catagoryItems = groupsData[groupId]
        const reference = contextId?.reference
        if (!checkedBook && catagoryItems.length) {
          if (reference?.bookId !== catagoryItems[0]?.contextId?.reference?.bookId) {
            break; // context id is for difference book
          }
          checkedBook = true
        }
        if (reference) {
          for (const item of catagoryItems) {
            const itemContextId = item.contextId
            if (isSameVerseByRef(reference, itemContextId?.reference)) {
              let matchFound = false
              if (contextId.checkId) {
                if (contextId.checkId === itemContextId?.checkId) {
                  matchFound = true
                }
              } else // if no checkId, fall back to matching quote and occurrence
              if ((contextId.quote === itemContextId?.quote) && (contextId.occurrence === itemContextId?.occurrence)) {
                matchFound = true
              }

              if (matchFound) {
                check = item
                break
              }
            }
          }
        }
        break // when finished checking all items in groupId, there is no point to continue
      }
    }
  }
  if (!check && defaultToFirst) {
    check = findFirstCheck(groupsData)
  }
  return check
}

export function findNextCheck(groupsData, contextId, defaultToFirst = false) {
  let check = null
  let checkedBook = false;
  let matchFound = false
  if (groupsData && contextId?.reference) {
    const groupsKeys = Object.keys(groupsData)
    for (let idx = 0; idx < groupsKeys.length; idx++) {
      const groupId = groupsKeys[idx]
      if (groupId === contextId.groupId) {
        const catagoryItems = groupsData[groupId]
        const reference = contextId?.reference
        if (!checkedBook && catagoryItems.length) {
          if (reference?.bookId !== catagoryItems[0]?.contextId?.reference?.bookId) {
            break; // context id is for difference book
          }
          checkedBook = true
        }
        if (reference) {
          for (let i = 0; i < catagoryItems.length; i++) {
            const item = catagoryItems[i]
            const itemContextId = item.contextId
            if (isSameVerseByRef(reference, itemContextId?.reference)) {
              if (contextId.checkId) {
                if (contextId.checkId === itemContextId?.checkId) {
                  matchFound = true
                }
              } else // if no checkId, fall back to matching quote and occurrence
              if ((contextId.quote === itemContextId?.quote) && (contextId.occurrence === itemContextId?.occurrence)) {
                matchFound = true
              }
            }

            if (matchFound) { // if match was found, then this must be the next check
              if (i < catagoryItems.length - 1) {
                check = catagoryItems[i + 1]
              } else if (idx < groupsKeys.length - 1) { // move to first item in next group
                const nextGroupId = groupsKeys[idx + 1]
                const nextGroupItems = groupsData[nextGroupId]
                check = nextGroupItems[0]
              }
              break
            }
          }
        }
        break // when finished checking all items in groupId, there is no point to continue
      }
    }
  }
  if (!check && defaultToFirst) {
    check = findFirstCheck(groupsData)
  }
  return check
}

export function findFirstCheck(groupsData) {
  let check = null
  const groupKeys = groupsData && Object.keys(groupsData)
  if (groupKeys?.length) {
    const firstGroup = groupsData[groupKeys[0]]
    if (firstGroup?.length) {
      check = firstGroup[0]
    }
  }
  return check
}

export function flattenGroupData(groupsData) {
  let mergedGroups = { }

  for (const category of Object.keys(groupsData)) {
    const groups = groupsData[category]
    for (const groupId of Object.keys(groups)) {
      const group = groups[groupId]
      const newGroup = group.map(item => {
        const newItem = {...item} // shallow copy
        newItem.category = category
        return newItem
      })
      mergedGroups[groupId] = newGroup
    }
  }

  let sortedGroups = { }
  for (const key of Object.keys(mergedGroups).sort()) {
    sortedGroups[key] = mergedGroups[key]
  }

  return sortedGroups;
}

export function extractGroupData(data) {
  const groupData = {}
  for (const catagory of Object.keys(data)) {
    if (catagory !== 'manifest') { // skip over manifest
      groupData[catagory] = data[catagory]?.groups || {}
    }
  }
  return groupData
}

/**
 * process the TSV file into index files
 * @param {string} tsvData
 * @param {object} project
 * @param {string} resourcesPath
 * @param {string} originalBiblePath
 * @param {string} outputPath
 */
export async function twlTsvToGroupData(tsvData, project, origLangBible) {
  const bookId = project.identifier;
  let groupData;
  const {
    tsvItems,
    error,
  } = await tsvDataToObjects(tsvData);

  if (error) {
    throw error;
  }

  const tsvItems_ = [];
  for (const tsvItem of tsvItems) {
    const cleanedRef = parseReference(tsvItem.Reference);
    const tsvItem_ = {
      ...tsvItem,
      ...cleanedRef,
    };
    tsvItems_.push(tsvItem_);
  }

  try {
    groupData = tsvObjectsToGroupData(tsvItems_, origLangBible, "", bookId, project.languageId, 'translationWords', {categorized: true});
    convertEllipsisToAmpersand(groupData);
  } catch (e) {
    console.error(`twArticleHelpers.twlTsvToGroupData() - error processing group data`, e);
    throw e;
  }
  return groupData;
}

/**
 * parse the twData into a flat index
 * @param {object} twData
 * @returns {array}
 */
export function parseTwToIndex(twData) {
  let index = []
  for (const catagoryId of Object.keys(twData)) {
    const catagory = twData[catagoryId]
    if (catagory?.index) {
      index = index.concat(catagory?.index)
    }
  }
  return index
}

/**
 * process the TSV file into index files
 * @param {string} tsvData
 */
// eslint-disable-next-line require-await
export async function tsvDataToObjects(tsvData) {
  // console.log(tsvLines);
  let tsvItems;
  let parseErrorMsg;
  let error;
  let expectedColumns = 0;
  const tableObject = tsvparser.tsvStringToTable(tsvData);

  if ( tableObject.errors.length > 0 ) {
    parseErrorMsg = '';
    expectedColumns = tableObject.header.length;

    for (let i=0; i<tableObject.errors.length; i++) {
      let msg;
      const rownum = tableObject.errors[i][0] - 1; // adjust for data table without header row
      const colsfound = tableObject.errors[i][1];

      if ( colsfound > expectedColumns ) {
        msg = 'Row is too long';
      } else {
        msg = 'Row is too short';
      }
      parseErrorMsg += `\n\n${msg}:`;
      parseErrorMsg += '\n' + tableObject.data[rownum].join(',');
    }
    console.warn(`twArticleHelpers.twlTsvToGroupData() - table parse errors found: ${parseErrorMsg}`);
  }

  try {
    tsvItems = tableObject.data.map(line => {
      const tsvItem = {};
      const l = tableObject.header.length;

      for (let i = 0; i < l; i++) {
        const key = tableObject.header[i];
        const value = line[i] || '';
        tsvItem[key] = value.trim();
      }
      return tsvItem;
    });
  } catch (e) {
    console.error(`twArticleHelpers.twlTsvToGroupData() - error processing filepath: ${tsvPath}`, e);
    error = e;
  }
  return {
    tsvItems,
    parseErrorMsg,
    error,
    expectedColumns,
  };
}


// /**
//  * @description Processes the extracted files for translationWord to create the folder
//  * structure and produce the index.js file for the language with the title of each article.
//  * @param {Object} resource - Resource object
//  * @param {String} sourcePath - Path to the extracted files that came from the zip file from the catalog
//  * @param {String} outputPath - Path to place the processed resource files WIHTOUT the version in the path
//  * @param {string} resourcesPath
//  * @param {Array} downloadErrors - parsed list of download errors with details such as if the download completed (vs. parsing error), error, and url
//  * @param {object} config - configuration object
//  * @return {Boolean} true if success
//  */
// export async function processTranslationWordsTSV(resource, sourcePath, outputPath, resourcesPath, downloadErrors, config = {}) {
//   try {
//     if (!resource || !isObject(resource) || !resource.languageId || !resource.resourceId)
//       throw Error(resourcesHelpers.formatError(resource, errors.RESOURCE_NOT_GIVEN));
//     if (!sourcePath)
//       throw Error(resourcesHelpers.formatError(resource, errors.SOURCE_PATH_NOT_GIVEN));
//     if (!fs.pathExistsSync(sourcePath))
//       throw Error(resourcesHelpers.formatError(resource, errors.SOURCE_PATH_NOT_EXIST));
//     if (!outputPath)
//       throw Error(resourcesHelpers.formatError(resource, errors.OUTPUT_PATH_NOT_GIVEN));
//     if (fs.pathExistsSync(outputPath))
//       fs.removeSync(outputPath);
//
//     const {otQuery, ntQuery} = await getMissingResources(sourcePath, resourcesPath, getMissingOriginalResource, downloadErrors, resource.languageId, resource.owner, false, config);
//
//     // make sure tW is already installed
//     const twPath = path.join(
//       resourcesPath,
//       resource.languageId,
//       'translationHelps/translationWords'
//     );
//     const twVersionPath = resourcesHelpers.getLatestVersionInPath(twPath, resource.owner);
//     if (fs.existsSync(twVersionPath)) {
//       makeSureResourceUnzipped(twVersionPath);
//     } else {
//       const resource_ = `${resource.owner}/${resource.languageId}_tw`;
//       throw new Error(`processTranslationWordsTSV() - cannot find '${resource_}' at ${twPath} for ${resource.owner}`);
//     }
//
//     const manifest = getResourceManifest(sourcePath);
//     if (!(manifest && Array.isArray(manifest.projects))) {
//       throw new Error(`processTranslationWordsTSV() - no projects in manifest at ${sourcePath} for ${resource.owner}`);
//     }
//
//     const twlErrors = [];
//
//     for (const project of manifest.projects) {
//       const tsvPath = path.join(sourcePath, project.path);
//       try {
//         const bookId = project.identifier;
//         const isNewTestament = BIBLE_BOOKS.newTestament[project.identifier];
//         const originalLanguageId = isNewTestament ? NT_ORIG_LANG : OT_ORIG_LANG;
//         const originalLanguageBibleId = isNewTestament ? NT_ORIG_LANG_BIBLE : OT_ORIG_LANG_BIBLE;
//         const version = isNewTestament && ntQuery ? ('v' + ntQuery) : otQuery ? ('v' + otQuery) : null;
//         if (!version) {
//           console.warn('processTranslationWordsTSV() - There was a missing version for book ' + bookId + ' of resource ' + originalLanguageBibleId + ' from ' + resource.downloadUrl);
//           continue;
//         }
//         const originalLanguageOwner = getOwnerForOriginalLanguage(resource.owner);
//         const originalBiblePath = path.join(
//           resourcesPath,
//           originalLanguageId,
//           'bibles',
//           originalLanguageBibleId,
//           `${version}_${originalLanguageOwner}`
//         );
//
//         if (fs.existsSync(originalBiblePath)) {
//           const groupData = await twlTsvToGroupData(tsvPath, project, resourcesPath, originalBiblePath, outputPath);
//           convertEllipsisToAmpersand(groupData, tsvPath);
//           await formatAndSaveGroupData(groupData, outputPath, bookId);
//         } else {
//           const resource = `${originalLanguageOwner}/${originalLanguageId}_${originalLanguageBibleId}`;
//           const message = `processTranslationWordsTSV() - cannot find '${resource}' at ${originalBiblePath}:`;
//           console.error(message);
//           twlErrors.push(message);
//         }
//       } catch (e) {
//         const message = `processTranslationWordsTSV() - error processing ${tsvPath}:`;
//         console.error(message, e);
//         twlErrors.push(message + e.toString());
//       }
//     }
//
//     await delay(200);
//
//     if (twlErrors.length) { // report errors
//       const message = `processTranslationWordsTSV() - error processing ${sourcePath}`;
//       console.error(message);
//       throw new Error(`${message}:\n${twlErrors.join('\n')}`);
//     }
//   } catch (error) {
//     console.error('processTranslationWordsTSV() - error:', error);
//     throw error;
//   }
// }

/**
 * @description - Generates the groups index for the tw articles (both kt, other and names).
 * @param {String} filesPath - Path to all tw markdown artciles.
 * @param {String} twOutputPath Path to the resource location in the static folder.
 * @param {String} folderName article type. ex. kt or other.
 */
function generateGroupsIndex(filesPath, twOutputPath, folderName) {
  const groupsIndex = [];
  const groupIds = fs.readdirSync(filesPath).filter((filename) => {
    return filename.split('.').pop() === 'md';
  });
  groupIds.forEach((fileName) => {
    const groupObject = {};
    const filePath = path.join(filesPath, fileName);
    const articleFile = fs.readFileSync(filePath, 'utf8');
    const groupId = fileName.replace('.md', '');
    // get the article's first line and remove #'s and spaces from beginning/end
    const groupName = articleFile.split('\n')[0].replace(/(^\s*#\s*|\s*#\s*$)/gi, '');
    groupObject.id = groupId;
    groupObject.name = groupName;
    groupsIndex.push(groupObject);
  });
  groupsIndex.sort(compareByFirstUniqueWord);
  const groupsIndexOutputPath = path.join(
    twOutputPath,
    folderName,
    'index.json',
  );

  fs.outputJsonSync(groupsIndexOutputPath, groupsIndex, {spaces: 2});
}

/**
 * Splits the string into words delimited by commas and compares the first unique word
 * @param {String} a first string to be compared
 * @param {String} b second string to be compared
 * @return {int} comparison result
 */
function compareByFirstUniqueWord(a, b) {
  const aWords = a.name.toUpperCase().split(',');
  const bWords = b.name.toUpperCase().split(',');
  while (aWords.length || bWords.length) {
    if (!aWords.length)
      return -1;
    if (!bWords.length)
      return 1;
    const aWord = aWords.shift().trim();
    const bWord = bWords.shift().trim();
    if (aWord !== bWord)
      return (aWord < bWord ? -1 : 1);
  }
  return 0; // both lists are the same
}

/**
 * looks up the GL text from an aligned GL bible using the Original Language
 * @param {object} toolsSelectedGLs
 * @param {object} contextId
 * @param {object} bibles
 * @param {string} currentToolName
 * @return {string|null} returns null if error getting text
 */
export function getAlignedGLText(alignedGlBible, contextId) {
  if (contextId) {
    if (!alignedGlBible || !Object.keys(alignedGlBible).length) {
      return contextId.quote;
    }

    const verseObjects = alignedGlBible?.[contextId.reference.chapter]?.[contextId.reference.verse]?.verseObjects
    if (contextId ) {
      const alignedText = getAlignedText(verseObjects, contextId.quote, contextId.occurrence);

      if (alignedText) {
        return alignedText;
      }
    }
  }
  return null;
}

/**
 * Gets the phrase from tW
 * @param {string} articleId
 * @param {object} glTwData
 * @return {string}
 */
export function getPhraseFromTw(glTwData, articleId) {
  let currentArticle = '';
  glTwData = glTwData || {}

  for (const groupId of Object.keys(glTwData)) {
    const group = glTwData[groupId]
    const article = group?.articles?.[articleId]
    if (article) {
      currentArticle = article
      break
    }
  }

  if (!currentArticle) {
    return '';
  }

  let splitLine = currentArticle.split('\n');

  if (splitLine.length === 1 && splitLine[0] === '') {
    return '';
  }

  let finalArray = [];

  for (let i = 0; i < splitLine.length; i++) {
    if (splitLine[i] !== '' && !~splitLine[i].indexOf('#')) {
      finalArray.push(splitLine[i]);
    }
  }

  let maxLength = 225;
  let finalString = '';
  let chosenString = finalArray[0];
  let splitString = chosenString.split(' ');

  for (let word of splitString) {
    if ((finalString + ' ' + word).length >= maxLength) {
      finalString += '...';
      break;
    }
    finalString += ' ';
    finalString += word;
  }
  return finalString;
}
