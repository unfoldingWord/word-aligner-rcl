// import fs from 'fs-extra';
// import path from 'path-extra';
// import {isObject} from 'util';
// import {
//   formatAndSaveGroupData,
//   generateGroupsIndex,
//   saveGroupsIndex,
//   tsvToGroupData,
//   tsvToGroupData7Cols,
// } from 'tsv-groupdata-parser';
// helpers
// import * as resourcesHelpers from '../resourcesHelpers';
import { ELLIPSIS } from '../../common/constants'
// import { formatVersionWithV } from '../apiHelpers'
// import {downloadAndProcessResource} from '../resourcesDownloadHelpers';
// import {delay, getQueryStringForBibleId, getQueryVariable} from '../utils';
// constants
// import * as errors from '../../resources/errors';
// import {
//   OT_ORIG_LANG,
//   NT_ORIG_LANG,
//   OT_ORIG_LANG_BIBLE,
//   NT_ORIG_LANG_BIBLE,
//   BOOK_CHAPTER_VERSES,
//   BIBLE_LIST_NT,
// } from '../../resources/bible';
// import {makeSureResourceUnzipped} from '../unzipFileHelpers';
// import {
//   DCS_BASE_URL,
//   DOOR43_CATALOG,
//   formatVersionWithoutV,
//   formatVersionWithV,
//   getLatestRelease,
//   getOwnerForOriginalLanguage,
// } from '../apiHelpers';
// import { ELLIPSIS } from 'tsv-groupdata-parser/lib/utils/constants';

const ELLIPSIS_WITH_SPACES = ` ${ELLIPSIS} `;

// /**
//  * search to see if we need to get any missing resources needed for tN processing
//  * @param {String} sourcePath - Path to the extracted files that came from the zip file from the catalog
//  * e.g. /Users/mannycolon/translationCore/resources/imports/en_tn_v16/en_tn
//  * @param {String} resourcesPath Path to resources folder
//  * @param {Function} getMissingOriginalResource - function called to fetch missing resources
//  * @param {Array} downloadErrors - parsed list of download errors with details such as if the download completed (vs. parsing error), error, and url
//  * @param {String} languageId - language ID for tA
//  * @param {String} ownerStr
//  * @param {boolean} needTa - set to false if resource does not depend on TA
//  * @param {object} config - configuration object
//  * @return {Promise<{otQuery: string, ntQuery: string}>}
//  */
// export async function getMissingResources(sourcePath, resourcesPath, getMissingOriginalResource, downloadErrors, languageId, ownerStr, needTa = true, config = {}) {
//   const tsvManifest = resourcesHelpers.getResourceManifestFromYaml(sourcePath);
//   // array of related resources used to generated the tsv.
//   const tsvRelations = tsvManifest.dublin_core.relation;
//   const OT_ORIG_LANG_QUERY = getQueryStringForBibleId(tsvRelations, OT_ORIG_LANG);
//   const otQuery = getQueryVariable(OT_ORIG_LANG_QUERY, 'v');
//   const NT_ORIG_LANG_QUERY = getQueryStringForBibleId(tsvRelations, NT_ORIG_LANG);
//   const ntQuery = getQueryVariable(NT_ORIG_LANG_QUERY, 'v');
//   for (const isNewTestament of [false, true]) {
//     const query = isNewTestament ? ntQuery : otQuery;
//     if (query) {
//       const origLangVersion = formatVersionWithV(query);
//       const origLangId = isNewTestament ? NT_ORIG_LANG : OT_ORIG_LANG;
//       const origLangBibleId = isNewTestament ? NT_ORIG_LANG_BIBLE: OT_ORIG_LANG_BIBLE;
//       const originalLanguageOwner = getOwnerForOriginalLanguage(ownerStr);
//       await getMissingOriginalResource(resourcesPath, origLangId, origLangBibleId, origLangVersion, downloadErrors, originalLanguageOwner, config);
//       const originalBiblePath = path.join(
//         resourcesPath,
//         origLangId,
//         'bibles',
//         origLangBibleId,
//         resourcesHelpers.addOwnerToKey(origLangVersion, originalLanguageOwner),
//       );
//       makeSureResourceUnzipped(originalBiblePath);
//     }
//   }
//
//   await delay(500);
//
//   if (needTa) {
//     // make sure tA is unzipped
//     const tAPath = path.join(
//       resourcesPath,
//       languageId,
//       'translationHelps/translationAcademy'
//     );
//     const taVersionPath = resourcesHelpers.getLatestVersionInPath(tAPath, ownerStr, true);
//     if (taVersionPath) {
//       makeSureResourceUnzipped(taVersionPath);
//     } else {
//       const resource = `${ownerStr}/${languageId}_ta`;
//       throw new Error(`tnArticleHelpers.getMissingResources() - cannot find '${resource}', at ${tAPath} for ${ownerStr}`);
//     }
//   }
//
//   return {otQuery, ntQuery};
// }

/**
 * iterate through group data converting older format ellipsis breaks to ampersand
 * @param {object} groupData
 * @param {string} filepath
 */
export function convertEllipsisToAmpersand(groupData, filepath) {
  if (groupData) {
    const categoriesKeys = Object.keys(groupData);
    for (const categoryKey of categoriesKeys) {
      const categoryData = groupData[categoryKey];
      const checkKeys = Object.keys(categoryData);
      for (const checkKey of checkKeys) {
        const checks = categoryData[checkKey];
        for (const check of checks) {
          const contextId = check && check.contextId && check.contextId;
          if (contextId) {
            let quote = contextId.quote;
            let quoteString = contextId.quoteString;
            const foundEllipsis = quoteString && quoteString.includes(ELLIPSIS);
            if (foundEllipsis) {
              // console.log(`convertEllipsisToAmpersand(${filepath}) - found ellipsis in `, JSON.stringify(contextId));
              quoteString = quoteString.replaceAll(ELLIPSIS_WITH_SPACES, ' & ');
              quoteString = quoteString.replaceAll(ELLIPSIS, ' & ');
              if (Array.isArray(quote) && quote.length) {
                quote = quote.map(item => (item.word === ELLIPSIS ? {word: '&'} : item));
                contextId.quote = quote;
                contextId.quoteString = quoteString;
              } else {
                console.log(`convertEllipsisToAmpersand(${filepath}) - missing quote array in `, JSON.stringify(contextId));
              }
            }
          }
        }
      }
    }
  }
}

// /**
//  * @description Processes the extracted files for translationNotes to separate the folder
//  * structure and produce the index.json file for the language with the title of each article.
//  * @param {Object} resource - Resource object
//  * @param {String} sourcePath - Path to the extracted files that came from the zip file from the catalog
//  * e.g. /Users/mannycolon/translationCore/resources/imports/en_tn_v16/en_tn
//  * @param {String} outputPath - Path to place the processed resource files WITHOUT the version in the path
//  * @param {String} resourcesPath Path to resources folder
//  * @param {Array} downloadErrors - parsed list of download errors with details such as if the download completed (vs. parsing error), error, and url
//  * @param {object} config - configuration object
//  */
// export async function processTranslationNotes(resource, sourcePath, outputPath, resourcesPath, downloadErrors, config = {}) {
//   try {
//     if (!resource || !isObject(resource) || !resource.languageId || !resource.resourceId) {
//       throw Error(resourcesHelpers.formatError(resource, errors.RESOURCE_NOT_GIVEN));
//     }
//     if (!sourcePath) {
//       throw Error(resourcesHelpers.formatError(resource, errors.SOURCE_PATH_NOT_GIVEN));
//     }
//     if (!fs.pathExistsSync(sourcePath)) {
//       throw Error(resourcesHelpers.formatError(resource, errors.SOURCE_PATH_NOT_EXIST));
//     }
//     if (!outputPath) {
//       throw Error(resourcesHelpers.formatError(resource, errors.OUTPUT_PATH_NOT_GIVEN));
//     }
//     if (fs.pathExistsSync(outputPath)) {
//       fs.removeSync(outputPath);
//     }
//
//     const translationAcademyPath = path.join(
//       resourcesPath,
//       resource.languageId,
//       'translationHelps',
//       'translationAcademy'
//     );
//     let taCategoriesPath = resourcesHelpers.getLatestVersionInPath(translationAcademyPath, resource.owner);
//     if (!taCategoriesPath) {
//       console.log(`tnArticleHelpers.processTranslationNotes() - download missing tA resource`);
//       await getMissingHelpsResource(resourcesPath, resource, 'ta', 'Translation_Academy', downloadErrors, config);
//       console.log(`tnArticleHelpers.processTranslationNotes() - have tA resource`);
//       taCategoriesPath = resourcesHelpers.getLatestVersionInPath(translationAcademyPath, resource.owner);
//     }
//
//     const originalLanguageOwner = getOwnerForOriginalLanguage(resource.owner);
//     const {otQuery, ntQuery} = await getMissingResources(sourcePath, resourcesPath, getMissingOriginalResource, downloadErrors, resource.languageId, resource.owner, true, config);
//     console.log(`tnArticleHelpers.processTranslationNotes() - have needed original bibles for ${sourcePath}, starting processing`);
//     const tsvFiles = fs.readdirSync(sourcePath).filter((filename) => path.extname(filename) === '.tsv');
//     const tnErrors = [];
//     let bookCount = 0;
//
//     for (const filename of tsvFiles) {
//       try {
//         const isSevenCol = (filename.toLowerCase().indexOf('tn_') === 0); // file names are as tn_2JN.tsv
//         const splitter = isSevenCol ? '_' : '-';
//         const bookId = filename.split(splitter)[1].toLowerCase().replace('.tsv', '');
//         if (!BOOK_CHAPTER_VERSES[bookId]) console.error(`tnArticleHelpers.processTranslationNotes() - ${bookId} is not a valid book id.`);
//         let isNewTestament = true;
//         if (isSevenCol) {
//           isNewTestament = BIBLE_LIST_NT.find(bookNumberAndId => (bookNumberAndId.split('-')[1].toLowerCase() === bookId));
//         } else {
//           const bookNumberAndIdMatch = filename.match(/(\d{2}-\w{3})/ig) || [];
//           const bookNumberAndId = bookNumberAndIdMatch[0];
//           isNewTestament = BIBLE_LIST_NT.includes(bookNumberAndId);
//         }
//         const originalLanguageId = isNewTestament ? NT_ORIG_LANG : OT_ORIG_LANG;
//         const originalLanguageBibleId = isNewTestament ? NT_ORIG_LANG_BIBLE : OT_ORIG_LANG_BIBLE;
//         const version = isNewTestament && ntQuery ? ('v' + ntQuery) : otQuery ? ('v' + otQuery) : null;
//         if (!version) {
//           console.warn('tnArticleHelpers.processTranslationNotes() - There was a missing original language version for book ' + bookId + ' of resource ' + originalLanguageBibleId + ' from ' + resource.downloadUrl);
//           continue;
//         }
//         const originalBiblePath = path.join(
//           resourcesPath,
//           originalLanguageId,
//           'bibles',
//           originalLanguageBibleId,
//           `${version}_${originalLanguageOwner}`
//         );
//         if (fs.existsSync(originalBiblePath)) {
//           const filepath = path.join(sourcePath, filename);
//           let groupData;
//           const params = {categorized: true};
//           const toolName = 'translationNotes';
//           if (isSevenCol) {
//             groupData = await tsvToGroupData7Cols(filepath, bookId, resourcesPath, resource.languageId, toolName, originalBiblePath, params);
//           } else {
//             groupData = await tsvToGroupData(filepath, toolName, params, originalBiblePath, resourcesPath, resource.languageId);
//           }
//           convertEllipsisToAmpersand(groupData, filepath);
//           await formatAndSaveGroupData(groupData, outputPath, bookId);
//           bookCount += 1;
//         } else {
//           const resource = `${originalLanguageOwner}/${originalLanguageId}_${originalLanguageBibleId}`;
//           const message = `tnArticleHelpers.processTranslationNotes() - cannot find '${resource}' at ${originalBiblePath}:`;
//           console.error(message);
//           tnErrors.push(message);
//         }
//       } catch (e) {
//         const message = `tnArticleHelpers.processTranslationNotes() - error processing ${filename}:`;
//         console.error(message, e);
//         tnErrors.push(message + e.toString());
//       }
//     }
//
//     await delay(200);
//
//     if (tnErrors.length) { // report errors
//       const message = `tnArticleHelpers.processTranslationNotes() - error processing ${sourcePath}`;
//       console.error(message);
//       throw new Error(`${message}:\n${tnErrors.join('\n')}`);
//     }
//
//     if (!bookCount) {
//       const message = `tnArticleHelpers.processTranslationNotes() - no books could be processed in ${sourcePath}`;
//       console.error(message);
//       throw new Error(`${message}:\n${tnErrors.join('\n')}`);
//     }
//
//     // Generate groupsIndex using tN groupData & tA articles.
//     makeSureResourceUnzipped(taCategoriesPath);
//     const categorizedGroupsIndex = generateGroupsIndex(outputPath, taCategoriesPath);
//     saveGroupsIndex(categorizedGroupsIndex, outputPath);
//   } catch (error) {
//     console.error('tnArticleHelpers.processTranslationNotes() - error:', error);
//     throw error;
//   }
// }

// /**
//  * Get missing original language resource
//  * @param {String} resourcesPath - resources Path
//  * @param {String} originalLanguageId - original language Id
//  * @param {String} originalLanguageBibleId - original language bible Id
//  * @param {String} version - version number
//  * @param {Array} downloadErrors - parsed list of download errors with details such as if the download completed (vs. parsing error), error, and url
//  * @param {String} ownerStr
//  * @param {object} config - configuration object
//  * @return {Promise}
//  */
// export function getMissingOriginalResource(resourcesPath, originalLanguageId, originalLanguageBibleId, version, downloadErrors, ownerStr, config= {}) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const version_ = formatVersionWithV(version);
//       const originalBiblePath = path.join(
//         resourcesPath,
//         originalLanguageId,
//         'bibles',
//         originalLanguageBibleId,
//         `${version_}_${ownerStr}`
//       );
//
//       // If version needed is not in the resources download it.
//       if (!fs.existsSync(originalBiblePath)) {
//         const resourceName = `${originalLanguageId}_${originalLanguageBibleId}`;
//         let downloadUrl;
//         let origOwner = ownerStr;
//         const baseUrl = config.DCS_BASE_URL || DCS_BASE_URL;
//         if (ownerStr === DOOR43_CATALOG) {
//           if (baseUrl === DCS_BASE_URL) {
//             // Download orig. lang. resource
//             downloadUrl = `https://cdn.door43.org/${originalLanguageId}/${originalLanguageBibleId}/${version_}/${originalLanguageBibleId}.zip`;
//           } else {
//             origOwner = DOOR43_CATALOG;
//             downloadUrl = `${baseUrl}/${origOwner}/${resourceName}/archive/${version_}.zip`;
//           }
//         } else { // otherwise we read from uW org
//           // Download orig. lang. resource
//           origOwner = 'unfoldingWord';
//           downloadUrl = `${baseUrl}/${origOwner}/${resourceName}/archive/${version_}.zip`;
//         }
//         console.log(`tnArticleHelpers.getMissingOriginalResource() - downloading missing original bible: ${downloadUrl}`);
//         const resource = {
//           languageId: originalLanguageId,
//           resourceId: originalLanguageBibleId,
//           remoteModifiedTime: '0001-01-01T00:00:00+00:00',
//           downloadUrl,
//           name: resourceName,
//           version: formatVersionWithoutV(version),
//           subject: 'Bible',
//           owner: origOwner,
//           catalogEntry: {
//             subject: {},
//             resource: {},
//             format: {},
//           },
//         };
//         // Delay to try to avoid Socket timeout
//         await delay(1000);
//         await downloadAndProcessResource(resource, resourcesPath, downloadErrors, config);
//         resolve();
//       } else {
//         resolve();
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// /**
//  * download a missing resource that matches parentResource, but has fetchResourceId
//  * @param {String} resourcesPath - resources Path
//  * @param {object} parentResource - resource of object loading this as a dependency
//  * @param {String} fetchResourceId - id of resource to fetch, such as 'ta'
//  * @param {String} fetchSubject - subject string of resource to fetch, such as 'Translation_Academy'
//  * @param {Array} downloadErrors - parsed list of download errors with details such as if the download completed (vs. parsing error), error, and url
//  * @param {object} config - configuration object
//  * @return {Promise}
//  */
// export function getMissingHelpsResource(resourcesPath, parentResource, fetchResourceId, fetchSubject, downloadErrors, config = {}) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const resourceName = `${parentResource.languageId}_${fetchResourceId}`;
//       // get latest version
//       const latest = await getLatestRelease({
//         owner: parentResource.owner,
//         repo: resourceName,
//         stage: config.stage,
//         baseUrl: config.DCS_BASE_URL || DCS_BASE_URL,
//       });
//       if (!latest) {
//         console.warn('tnArticleHelpers.getMissingHelpsResource() - no release found');
//         throw 'no release found';
//       }
//       const release = latest && latest.release;
//       const version = release && release.tag_name || 'master';
//       const version_ = formatVersionWithV(version);
//
//       const baseUrl = config.DCS_BASE_URL || DCS_BASE_URL;
//       const downloadUrl = `${baseUrl}/${parentResource.owner}/${resourceName}/archive/${version_}.zip`;
//       console.log(`tnArticleHelpers.getMissingHelpsResource() - downloading missing helps: ${downloadUrl}`);
//       const remoteModifiedTime = (latest && latest.released) || (release && release.published_at);
//       const resource = {
//         languageId: latest.language,
//         resourceId: fetchResourceId,
//         remoteModifiedTime,
//         downloadUrl,
//         name: resourceName,
//         owner: parentResource.owner,
//         version: formatVersionWithoutV(version),
//         subject: latest.subject,
//       };
//       // Delay to try to avoid Socket timeout
//       await delay(1000);
//       await downloadAndProcessResource(resource, resourcesPath, downloadErrors, config);
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// /**
//  * Get the version of the other Tns orginal language.
//  * @param {String} resourcesPath - resources Path
//  * @param {string} originalLanguageId - original Language Id.
//  * @return {array}
//  */
// export function getOtherTnsOLVersions(resourcesPath, originalLanguageId) {
//   const languageIds = fs.readdirSync(resourcesPath)
//     .filter((filename) => resourcesHelpers.isDirectory(resourcesPath, filename));
//   const versionsToNotDelete = [];
//
//   languageIds.forEach((languageId) => {
//     const tnHelpsPath = path.join(resourcesPath, languageId, 'translationHelps', 'translationNotes');
//     if (fs.existsSync(tnHelpsPath)) {
//       const owners = resourcesHelpers.getLatestVersionsAndOwners(tnHelpsPath) || {};
//       for (const owner of Object.keys(owners)) {
//         const tnHelpsVersionPath = owners[owner];
//         if (tnHelpsVersionPath) {
//           const tnManifestPath = path.join(tnHelpsVersionPath, 'manifest.json');
//           if (fs.existsSync(tnManifestPath)) {
//             const manifest = fs.readJsonSync(tnManifestPath);
//             const {relation} = manifest.dublin_core || {};
//             const query = getQueryStringForBibleId(relation, originalLanguageId);
//             if (query) {
//               let requiredVersion = getQueryVariable(query, 'v');
//               if (requiredVersion) {
//                 const version = 'v' + requiredVersion;
//                 // console.log(`tnArticleHelpers.getOtherTnsOLVersions() - for ${languageId}, found dependency: ${query}`);
//                 versionsToNotDelete.push(version);
//               } else {
//                 console.log(`getOtherTnsOLVersions() - could not find version for ${query} in ${tnHelpsPath}`);
//               }
//             }
//           }
//         }
//       }
//     }
//   });
//
//   return versionsToNotDelete;
// }

/**
 * parse the twData into a flat index
 * @param {object} tnData
 * @returns {array}
 */
export function parseTnToIndex(tnData) {
  let index = []
  for (const categoryId of Object.keys(tnData)) {
    const category = tnData[categoryId]
    for (const groupId of Object.keys(category)) {
      const markDown = category[groupId] || ''
      let name = groupId
      if (markDown) { // get title from markdown - this is the localized name
        const parts = markDown.split('#')
        if (parts?.length > 1) {
          const title = parts[1].trim()
          if (title) {
            name = title
          }
        }
      }
      const entry = {
        id: groupId,
        name,
      }
      index.push(entry)
    }
  }
  return index
}
