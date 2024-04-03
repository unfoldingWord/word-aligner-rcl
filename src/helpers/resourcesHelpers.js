// import fs from 'fs-extra';
// import path from 'path-extra';
import {isObject} from 'util';
import semver from 'semver';
// import { resourcesHelpers } from 'tc-source-content-updater';
// import {
//   TARGET_BIBLE,
//   TARGET_LANGUAGE,
//   ORIGINAL_LANGUAGE,
//   USER_RESOURCES_PATH,
//   NT_ORIG_LANG,
//   OT_ORIG_LANG,
//   TRANSLATION_HELPS,
// } from '../common/constants';
// import {
//   isOriginalLanguage,
//   isOldTestament,
// } from './bibleHelpers';

// /**
//  * gets the relation from manifest file for tool
//  * @param {string} glID
//  * @param {string} toolName
//  * @return {null|[]} relation array
//  */
// export function getThelpsManifestRelation(glID, toolName) {
//   const tHelpsManifest = getThelpsManifest(glID, toolName);
//   const tsvRelation = tHelpsManifest && (tHelpsManifest.tsv_relation || (tHelpsManifest.dublin_core && tHelpsManifest.dublin_core.relation));
//   return tsvRelation;
// }

// /**
//  * gets the manifest file for tool
//  * @param {string} glID
//  * @param {string} toolName
//  * @return {null|{}} manifest object
//  */
// export function getThelpsManifest(glID, toolName) {
//   if ( glID && toolName) {
//     const resourcePath = path.join(USER_RESOURCES_PATH, glID, TRANSLATION_HELPS, toolName);
//     const latestVersion = getLatestVersion(resourcePath);
//
//     if (latestVersion) {
//       const pathToBibleManifestFile = path.join(latestVersion, 'manifest.json');
//
//       try {
//         const manifestExists = fs.existsSync(pathToBibleManifestFile);
//
//         if (manifestExists) {
//           const manifest = fs.readJsonSync(pathToBibleManifestFile);
//           return manifest;
//         }
//       } catch (error) {
//         console.error(`getThelpsManifest(${glID}, ${toolName}) - error getting manifest at ${pathToBibleManifestFile}`, error);
//       }
//     }
//   }
//   return null;
// }

// /**
//  * Populates resourceList with resources that can be used in scripture pane
//  * @param {array} resourceList - array to be populated with resources
//  * @param {object} contextId - context Id.
//  * @param {object} bibles - bibles object.
//  */
// export function getAvailableScripturePaneSelections(resourceList, contextId, bibles) {
//   try {
//     resourceList.splice(0, resourceList.length); // remove any pre-existing elements
//     const bookId = contextId && contextId.reference.bookId;
//     const languagesIds = getLanguageIdsFromResourceFolder(bookId);
//
//     // add target Bible if in resource reducer
//     if (bibles && bibles[TARGET_LANGUAGE] && bibles[TARGET_LANGUAGE][TARGET_BIBLE]) {
//       const resource = {
//         bookId,
//         bibleId: TARGET_BIBLE,
//         languageId: TARGET_LANGUAGE,
//         manifest: bibles[TARGET_LANGUAGE][TARGET_BIBLE].manifest,
//       };
//       resourceList.push(resource);
//     }
//
//     // load source bibles
//     languagesIds.forEach((languageId) => {
//       const biblesPath = path.join(USER_RESOURCES_PATH, languageId, 'bibles');
//
//       try {
//         if (fs.existsSync(biblesPath)) {
//           const biblesFolders = fs.readdirSync(biblesPath).filter(folder => folder !== '.DS_Store');
//
//           biblesFolders.forEach(bibleId => {
//             const bibleIdPath = path.join(biblesPath, bibleId);
//
//             try {
//               const owners = getLatestVersionsAndOwners(bibleIdPath) || {};
//
//               for (const owner of Object.keys(owners)) {
//                 let bibleLatestVersion = owners[owner];
//
//                 try {
//                   if (bibleLatestVersion) {
//                     const pathToBibleManifestFile = path.join(bibleLatestVersion, 'manifest.json');
//
//                     try {
//                       const manifestExists = fs.existsSync(pathToBibleManifestFile);
//                       const bookExists = fs.existsSync(
//                         path.join(bibleLatestVersion, bookId, '1.json'));
//
//                       if (manifestExists && bookExists) {
//                         let languageId_ = languageId;
//
//                         if (isOriginalLanguage(languageId)) {
//                           languageId_ = ORIGINAL_LANGUAGE;
//                         }
//
//                         const manifest = fs.readJsonSync(pathToBibleManifestFile);
//
//                         if (Object.keys(manifest).length) {
//                           const resource = {
//                             bookId,
//                             bibleId,
//                             languageId: languageId_,
//                             manifest,
//                             owner,
//                           };
//                           resourceList.push(resource);
//                         }
//                       }
//                     } catch (e) {
//                       console.error('CTW:getAvailableScripturePaneSelections() - Invalid bible: ' + bibleLatestVersion, e);
//                     }
//                   }
//                 } catch (e) {
//                   console.error(`CTW:getAvailableScripturePaneSelections() - failed to get bibles for ${owner} in ${bibleIdPath}`, e);
//                 }
//               }
//             } catch (e) {
//               console.error(`CTW:getAvailableScripturePaneSelections() - failed to get latest version bible in ${bibleIdPath}`, e);
//             }
//           });
//         } else {
//           console.error('CTW:getAvailableScripturePaneSelections() - Directory not found, ' + biblesPath);
//         }
//       } catch (e) {
//         console.error('CTW:getAvailableScripturePaneSelections() - Failed to read list of bibles at ' + biblesPath);
//       }
//     });
//   } catch (e) {
//     console.error('CTW:getAvailableScripturePaneSelections() - FAILED: ', e);
//   }
// }

// /**
//  * get object of latest versions by owner
//  * @param {string} folder
//  * @return {object}
//  */
// export function getLatestVersionsAndOwners(folder) {
//   return resourcesHelpers.getLatestVersionsAndOwners(folder);
// }

// export function getLanguageIdsFromResourceFolder(bookId) {
//   try {
//     let languageIds = getFilesInResourcePath(USER_RESOURCES_PATH);
//
//     // if it's an old testament project remove greek from languageIds.
//     if (isOldTestament(bookId)) {
//       languageIds = languageIds.filter(languageId => languageId !== NT_ORIG_LANG);
//     } else { // else if it's a new testament project remove hebrew from languageIds.
//       languageIds = languageIds.filter(languageId => languageId !== OT_ORIG_LANG);
//     }
//     languageIds = languageIds.filter(languageID => {
//       let valid = (fs.lstatSync(path.join(USER_RESOURCES_PATH, languageID)).
//         isDirectory());
//       return valid;
//     });
//     return languageIds;
//   } catch (error) {
//     console.error(error);
//   }
// }

// /**
//  * get list of files in resource path
//  * @param {String} resourcePath - path
//  * @param {String|null} [ext=null] - optional extension to match
//  * @return {Array}
//  */
// export function getFilesInResourcePath(resourcePath, ext=null) {
//   if (fs.lstatSync(resourcePath).isDirectory()) {
//     let files = fs.readdirSync(resourcePath).filter(file => {
//       if (ext) {
//         return path.extname(file) === ext;
//       }
//       return file !== '.DS_Store';
//     }); // filter out .DS_Store
//     return files;
//   }
//   return [];
// }
//
// function getLatestVersion(dir) {
//   const versions = listVersions(dir);
//
//   if (versions.length > 0) {
//     return path.join(dir, versions[0]);
//   } else {
//     return null;
//   }
// }
//
// /**
//  * Returns an array of paths found in the directory filtered and sorted by version
//  * @param {string} dir
//  * @returns {string[]}
//  */
// function listVersions(dir) {
//   if (fs.pathExistsSync(dir)) {
//     const versionedDirs = fs.readdirSync(dir).filter(file => fs.lstatSync(path.join(dir, file)).isDirectory() &&
//           file.match(/^v\d/i));
//     return versionedDirs.sort((a, b) =>
//       -compareVersions(a, b) // do inverted sort
//     );
//   }
//   return [];
// }
//
// /**
//  * compares version numbers, if a > b returns 1; if a < b return -1; else are equal and return 0
//  * @param a
//  * @param b
//  * @return {number}
//  */
// function compareVersions(a, b) {
//   const cleanA = semver.coerce(a);
//   const cleanB = semver.coerce(b);
//
//   if (semver.gt(cleanA, cleanB)) {
//     return 1;
//   } else if (semver.lt(cleanA, cleanB)) {
//     return -1;
//   } else {
//     return 0;
//   }
// }

/**
 * @description Formats an error for all resources to have a standard format
 * @param {Object} resource Resource object
 * @param {String} errMessage Error message
 * @return {String} The formatted error message
 */
export function formatError(resource, errMessage) {
  if (!resource || !isObject(resource) || !resource.languageId || !resource.resourceId) {
    resource = {
      languageId: 'unknown',
      resourceId: 'unknown',
    };
  }
  return resource.owner + '/' + resource.languageId + '_' + resource.resourceId + ': ' + errMessage;
}
