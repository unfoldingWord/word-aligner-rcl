import {delay} from './utils';
import {SORT, STAGE, SUBJECT} from '../index';
import fs from 'fs-extra';
import path from 'path-extra';
import * as Bible from '../resources/bible';
import {
  cleanReaddirSync,
  getLatestVersionsAndOwners,
  getVersionAndOwnerFromPath,
} from './resourcesHelpers';
import {getResourceInfo, RESOURCE_ID_MAP} from './parseHelpers';

const request = require('request');
export const DOOR43_CATALOG = `Door43-Catalog`;
export const CN_CATALOG = `unfoldingWord`;
export const DEFAULT_OWNER = DOOR43_CATALOG;
export const TRANSLATION_HELPS = 'translationHelps';
export const EMPTY_TIME = '0001-01-01T00:00:00+00:00';
export const OWNER_SEPARATOR = '_';
export const SEARCH_LIMIT = 250;
export const DCS_BASE_URL = 'https://git.door43.org';

/**
 * does http request and returns the response data parsed from JSON
 * @param {string} url
 * @param {number} retries
 * @return {Promise<{Object}>}
 */
export async function makeJsonRequestDetailed(url, retries= 5) {
  let result_;
  for (let i = 1; i <= retries; i++) {
    result_ = null;
    try {
      result_ = await new Promise((resolve, reject) => {
        request(url, function(error, response, body) {
          if (error)
            reject(error);
          else if (response.statusCode === 200) {
            let result = body;
            try {
              result = JSON.parse(body);
            } catch (e) {
              reject(e);
            }
            resolve({result, response, body});
          } else {
            reject(`fetch error ${response.statusCode}`);
          }
        });
      });
    } catch (e) {
      if (i >= retries) {
        console.warn(`makeJsonRequestDetailed(${url}) - error getting data`, e);
        throw e;
      }
      result_ = null;
      console.log(`makeJsonRequestDetailed(${url}) - retry ${i+1} getting data, last error`, e);
      await delay(500);
    }

    if (result_) {
      break;
    }
  }
  return result_;
}

/**
 * does specific page query and returns the response data parsed from JSON
 * @param {string} url
 * @param {number} page
 * @param {number} retries
 * @return {Promise<{Object}>}
 */
export async function doMultipartQueryPage(url, page = 1, retries = 5) {
  const url_ = `${url}&page=${page}`;
  const {result, response} = await makeJsonRequestDetailed(url_, retries);
  const pos = response && response.rawHeaders && response.rawHeaders.indexOf('X-Total-Count');
  const totalCount = (pos >= 0) ? parseInt(response.rawHeaders[pos + 1]) : 0;
  const items = result && result.data || null;
  return {items, totalCount};
}

/**
 * does multipart query and returns the response data parsed from JSON. Continues to read pages until all results are returned.
 * @param {string} url
 * @param {number} retries
 * @return {Promise<{Object}>}
 */
export async function doMultipartQuery(url, retries = 5) {
  let page = 1;
  let data = [];
  const {items, totalCount} = await doMultipartQueryPage(url, page, retries = 5);
  let lastItems = items;
  let totalCount_ = totalCount;
  data = data.concat(items);
  while (lastItems && data.length < totalCount_) {
    const {items, totalCount} = await doMultipartQueryPage(url, ++page, retries = 5);
    lastItems = items;
    totalCount_ = totalCount;
    if (items && items.length) {
      data = data.concat(items);
    }
  }

  return data;
}

/**
 * searching subjects
 * @param {array} subjects
 * @param {string} owner
 * @param {number} retries
 * @return {Promise<*>}
 */
async function searchSubjects(subjects, owner, retries=3) {
  const subjectParam = encodeURI(subjects.join(','));
  let fetchUrl = `${DCS_BASE_URL}/api/v1/catalog/search?metadataType=rc&partialMatch=0&subject=${subjectParam}`;
  if (owner) {
    fetchUrl += fetchUrl + `&owner=${owner}`;
  }
  const result = await doMultipartQuery(fetchUrl, retries);
  return result;
}

/**
 * get published catalog using catalog next v3
 * @return {Promise<*[]>}
 */
export async function getOldCatalogReleases() {
  const released = [];
  const owner = null; // get all owners
  const subjectList = ['Bible', 'Aligned Bible', 'Greek New Testament', 'Hebrew Old Testament', 'Translation Words', 'TSV Translation Notes', 'Translation Academy'];
  // const subjectList = ['Bible', 'Testament', 'Translation Words', 'TSV Translation Notes', 'Translation Academy'];

  try {
    const result = await searchSubjects(subjectList, owner, 5);
    let repos = 0;
    const languages = result && result.languages || [];
    for (const language of languages) {
        const languageId = language.identifier;
        const resources = language.resources || [];
        for (const resource of resources) {
          resource.languageId = languageId;
          resource.resourceId = resource.identifier;
          resource.foundInCatalog = 'OLD';
          resource.full_name = resource.full_name || `${resource.owner}/${resource.repo}`;
          resource.checking_level = resource.checking && resource.checking.checking_level;
          const formats = resource.formats;
          if (formats && formats.length > 1) {
            console.log('too many');
          }
          const firstFormat = formats && formats[0];
          resource.downloadUrl = firstFormat && firstFormat.url;
          released.push(resource);
          repos++;
        }
      }
      console.log(`has ${repos} items`);
    console.log(`released catalog has ${released.length} items`);
  } catch (e) {
    console.error('getOldCatalogReleases() - error getting catalog', e);
    return [];
  }

  return released;
}

/**
 * find matching resource in resourceList
 * @param {array} resourceList
 * @param {object} resource
 * @return {*}
 */
function findResource(resourceList, resource) {
  const foundResource = resourceList.find(item => {
    return (item.owner === resource.owner) &&
      (item.language === resource.language) &&
      (item.resourceId === resource.resourceId);
  });
  return foundResource;
}

/**
 * merge twl resource downloads into tw downloads
 * @param {Array} catalogReleases
 * @return {*}
 */
export function combineTwords(catalogReleases) {
  return catalogReleases.filter(resource => {
    if (resource.owner !== 'Door43-Catalog') {
      switch (resource.resourceId) {
        case 'twl': {
          const twResource = findResource(catalogReleases, {...resource, resourceId: 'tw'});
          if (twResource) {
            twResource.loadAfter = [resource];
          } else {
            return false; // if no tw available, we cannot use the twl
          }
          break;
        }
        case 'tw': {
          const twlResource = findResource(catalogReleases, {...resource, resourceId: 'twl'});
          if (twlResource) {
            resource.loadAfter = [twlResource];
          } else {
            return false; // if no twl available, we cannot use the tw
          }
        }
        break;
      }
    }
    return true;
  });
}

/**
 * filter list of items and ignore master branch
 * @param {[object]} catalog - array of resources
 * @param {[string]} ignoredResources
 * @return {[object]}
 */
function filterOutMasterBranch(catalog, ignoredResources = []) {
  let catalog_ = catalog.filter(resource => {
    if (ignoredResources.includes(resource.resource)) {
      return false; // reject ignored resources
    }

    const tagName = resource.branch_or_tag_name;
    if (tagName) { // check for version
      const firstChar = tagName[0];
      const isDigit = (firstChar >= '0') && (firstChar <= '9');
      const isD43Master = (tagName === 'master') && (resource.owner === DOOR43_CATALOG);
      if (isD43Master || (firstChar !== 'v' && !isDigit)) {
        if (!isD43Master) {
          console.log(`filterOutMasterBranch - invalid version: ${tagName} in ${getResourceInfo(resource)}`);
        }
        return false; // reject if tag is not a version
      }
    }

    return true;
  });
  return catalog_;
}

/**
 * get published catalog - combines catalog next releases with old catalog
 * @param {object} config
 * @param {string|null} config.stage - stage for search, default is prod
 * @return {Promise<*[]>}
 */
export async function getCatalog(config = {}) {
  let searchParams = {
    subject: SUBJECT.ALL_TC_RESOURCES,
    stage: STAGE.LATEST,
    owner: DOOR43_CATALOG,
    DCS_BASE_URL: config.DCS_BASE_URL,
    partialMatch: '0',
  };
  const catalogReleases = await searchCatalogNext(searchParams);
  console.log(`getCatalog - found ${catalogReleases.length} items in old Door43-Catalog`);
  let catalogReleases_ = filterOutMasterBranch(catalogReleases, ['obs', 'obs-tn']);
  console.log(`getCatalog - found ${catalogReleases_.length} items in old Door43-Catalog after filter`);
  searchParams = {
    subject: SUBJECT.ALL_TC_RESOURCES,
    stage: config.stage || STAGE.PROD,
    DCS_BASE_URL: config.DCS_BASE_URL,
    partialMatch: '0',
  };
  const newCatalogReleases = await searchCatalogNext(searchParams);
  console.log(`getCatalog - found ${newCatalogReleases.length} items in catalog next`);
  let newCatalogReleases_ = filterOutMasterBranch(newCatalogReleases, ['obs', 'obs-tn']);
  console.log(`getCatalog - found ${newCatalogReleases_.length} items in catalog next after filter`);

  // merge catalogs together - catalog new takes precedence
  for (const item of newCatalogReleases_) {
    const index = catalogReleases_.findIndex(oldItem => (item.full_name === oldItem.full_name) && (item.full_name === oldItem.full_name));
    if (index >= 0) {
      catalogReleases_[index] = item; // overwrite item in old catalog
      catalogReleases_[index].foundInCatalog = 'NEW+OLD';
    } else {
      catalogReleases_.push(item); // add unique item
    }
  }
  console.log(`getCatalog - now ${catalogReleases_.length} items in merged catalog, before filter`);

  // combine tw and twl dependencies
  catalogReleases_ = combineTwords(catalogReleases_);

  console.log(`getCatalog - now ${catalogReleases_.length} items in filtered catalog`);

  return catalogReleases_;
}

/**
 * add parameter to url string
 * @param {*} value
 * @param {object} parameters
 * @param {string} tag
 * @return {*}
 */
function addUrlParameter(value, parameters, tag) {
  if (value) {
    if (parameters) { // see if we need separator
      parameters += '&';
    }
    parameters += `${tag}=${encodeURIComponent(value)}`;
  }
  return parameters;
}

/**
 * filter for supported repos
 * @param {array} resources
 * @return {*[]}
 */
function getCompatibleResourceList(resources) {
  const supported = [];
  for (const item of resources || []) {
    // add fields for backward compatibility
    const languageId = item.language;
    let [, resourceId] = (item.name || '').split(`${languageId}_`);
    resourceId = resourceId || item.name; // if language was not in name, then use name as resource ID
    item.resourceId = resourceId;
    item.languageId = languageId;
    item.checking_level = item.repo && item.repo.checking_level;
    item.foundInCatalog = 'NEW';
    item.modified = item.modified || item.released;

    if (item.zipball_url) {
      item.downloadUrl = item.zipball_url;
    }
    // check for version. if there is one, it will save having to fetch it from DCS later.
    if (item.release) { // if released
      const tagName = item.release.tag_name;
      if (tagName && (tagName[0] === 'v')) {
        item.version = tagName.substr(1);
      }
    } else {
      const branchOrTagName = item.branch_or_tag_name;
      if (branchOrTagName && (branchOrTagName[0] === 'v')) {
        item.version = branchOrTagName.substr(1);
      }
    }
    if (item.subject) {
      item.subject = item.subject.replaceAll(' ', '_');
    }
    // add supported resources to returned list
    if (item.downloadUrl && item.subject && item.name && item.full_name) {
      supported.push(item);
    }
  }
  return supported;
}

/**
 * @typedef {Object} searchParamsType
 * @property {String} owner - resource owner, if undefined then all are searched
 * @property {String} languageId - language of resource, if undefined then all are searched
 * @property {String} subject - one or more subjects separated by comma. See options defined in SUBJECT.
 *                                  If undefined then all are searched.
 * @property {Number} limit - maximum results to return, default 100
 * @property {String} partialMatch - if true will do case insensitive, substring matching, default is false
 * @property {String} stage - specifies which release stage to be returned out of these stages:
 *                    STAGE.PROD - return only the production releases
 *                    STAGE.PRE_PROD - return the pre-production release if it exists instead of the production release
 *                    STAGE.DRAFT - return the draft release if it exists instead of pre-production or production release
 *                    STAGE.LATEST -return the default branch (e.g. master) if it is a valid RC instead of the "prod", "preprod" or "draft".  (default)
 * @property {Number|String} checkingLevel - search only for entries with the given checking level(s). Can be 1, 2 or 3.  Default is any.
 * @property {String} sort - how to sort results (see defines in SORT), if undefined then sorted by by "lang", then "subject" and then "tag"
 */

/**
 * Method to search for latest resources using catalog next
 * @param {searchParamsType} searchParams - search options
 * @param {number} retries - number of times to retry calling search API, default 3
 * @return {Promise<*[]|null>}
 */
export async function searchCatalogNext(searchParams, retries=3) {
  let result_ = null;
  const {
    owner,
    languageId,
    subject,
    limit = SEARCH_LIMIT,
    stage = STAGE.LATEST,
    checkingLevel,
    partialMatch,
    sort = SORT.REPO_NAME,
    DCS_BASE_URL: baseUrl = DCS_BASE_URL,
  } = searchParams;

  try {
    let fetchUrl = `${baseUrl}/api/v1/catalog/search`;
    let parameters = '';
    parameters = addUrlParameter(owner, parameters, 'owner');
    parameters = addUrlParameter(languageId, parameters, 'lang');
    parameters = addUrlParameter(subject, parameters, 'subject');
    parameters = addUrlParameter(limit, parameters, 'limit');
    parameters = addUrlParameter(stage, parameters, 'stage');
    parameters = addUrlParameter(checkingLevel, parameters, 'checkingLevel');
    parameters = addUrlParameter(partialMatch, parameters, 'partialMatch');
    parameters = addUrlParameter('rc', parameters, 'metadataType');
    parameters = addUrlParameter(sort, parameters, 'sort');
    if (parameters) {
      fetchUrl += '?' + parameters;
    }
    console.log(`Searching: ${fetchUrl}`);
    result_ = await doMultipartQuery(fetchUrl, retries);
  } catch (e) {
    console.warn('searchCatalogNext() - error calling search API', e);
    return null;
  }

  const supported = getCompatibleResourceList(result_);
  return supported;
}

/**
 * does Catalog next API query to get manifest data
 * @param {string} owner
 * @param {string} repo
 * @param {string} tag
 * @param {number} retries
 * @param {string} baseUrl - optional server to use
 * @return {Promise<{Object}>}
 */
export async function downloadManifestData({owner, repo, tag = 'master', retries = 5, baseUrl = DCS_BASE_URL}) {
  const fetchUrl = `${baseUrl}/api/v1/catalog/entry/${owner}/${repo}/${tag}/metadata`;
  try {
    const {result} = await makeJsonRequestDetailed(fetchUrl, retries);
    return result;
  } catch (e) {
    console.warn('downloadManifestData() - error getting manifest data', e);
    throw e;
  }
}

/**
 * does Catalog next API query to get metadata for latest version
 * @param {string} owner
 * @param {string} repo
 * @param {number} retries
 * @param {string} stage - null defaults to production
 * @param {string} baseUrl - optional server to use
 * @return {Promise<{Object}>}
 */
export async function getLatestRelease({owner, repo, retries = 5, stage = null, baseUrl = DCS_BASE_URL}) {
  let fetchUrl = `${baseUrl}/api/v1/catalog/search/${owner}/${repo}`;
  if (stage) {
    fetchUrl += `?stage=${stage}`;
  }
  try {
    const {result} = await makeJsonRequestDetailed(fetchUrl, retries);
    if (result.data[0] && result.data[0].release) {
      return result.data[0];
    }
    console.warn(`getLatestRelease() - error getting release data, empty response to ${fetchUrl}`);
    return null;
  } catch (e) {
    console.warn(`getLatestRelease() - error getting release data from  ${fetchUrl}`, e);
    throw e;
  }
}

/**
 * does Catalog next API query to get metadata for tag
 * @param {string} owner
 * @param {string} repo
 * @param {string|null} tag
 * @param {number} retries
 * @param {string} baseUrl - optional server to use
 * @return {Promise<{Object}>}
 */
export async function getReleaseMetaData({owner, repo, tag, retries = 5, baseUrl = DCS_BASE_URL}) {
  const fetchUrl = `${baseUrl}/api/v1/catalog/entry/${owner}/${repo}/${tag}`;
  try {
    const {result} = await makeJsonRequestDetailed(fetchUrl, retries);
    return result;
  } catch (e) {
    console.warn('getReleaseMetaData() - error getting manifest data', e);
    throw e;
  }
}

/**
 * reads Json file if it exists, otherwise returns null
 * @param {string} jsonPath
 * @return {object|null}
 */
export function readJsonFile(jsonPath) {
  if (fs.existsSync(jsonPath)) {
    try {
      const resourceManifest = fs.readJsonSync(jsonPath);
      return resourceManifest;
    } catch (e) {
      console.error(`getLocalResourceList(): could not read ${jsonPath}`, e);
    }
  }
  return null;
}

/**
 * add resource to list
 * @param {string} resourceLatestPath
 * @param {string} pathToResourceManifestFile
 * @param {string} languageId
 * @param {string} resourceId
 * @param {array} localResourceList
 */
function addLocalResource(resourceLatestPath, pathToResourceManifestFile, languageId, resourceId, localResourceList) {
  const {version, owner} = getVersionAndOwnerFromPath(resourceLatestPath);

  const resourceManifest = readJsonFile(pathToResourceManifestFile);
  if (resourceManifest) {
    const localResource = {
      languageId,
      resourceId,
      owner,
      version,
      modifiedTime: resourceManifest.catalog_modified_time,
      manifest: resourceManifest,
    };

    localResourceList.push(localResource);
  } else {
    console.log(`addLocalResource(): no such file or directory, ${pathToResourceManifestFile}`);
  }
}

/**
 * get local resources
 * @param {string} resourcesPath
 * @return {null|*[]}
 */
export const getLocalResourceList = (resourcesPath) => {
  try {
    if (!fs.existsSync(resourcesPath)) {
      fs.ensureDirSync(resourcesPath);
    }

    const localResourceList = [];
    const resourceLanguages = fs.readdirSync(resourcesPath)
      .filter((file) => path.extname(file) !== '.json' && file !== '.DS_Store');

    for (let i = 0; i < resourceLanguages.length; i++) {
      const languageId = resourceLanguages[i];
      const biblesPath = path.join(resourcesPath, languageId, 'bibles');
      const tHelpsPath = path.join(resourcesPath, languageId, TRANSLATION_HELPS);
      const bibleIds = cleanReaddirSync(biblesPath);
      const tHelpsResources = cleanReaddirSync(tHelpsPath);

      bibleIds.forEach((bibleId) => {
        const bibleIdPath = path.join(biblesPath, bibleId);
        const owners = getLatestVersionsAndOwners(bibleIdPath) || {};
        for (const owner of Object.keys(owners)) {
          const bibleLatestVersion = owners[owner];
          if (bibleLatestVersion) {
            const pathToBibleManifestFile = path.join(bibleLatestVersion, 'manifest.json');
            addLocalResource(bibleLatestVersion, pathToBibleManifestFile, languageId, bibleId, localResourceList);
          } else {
            console.log(`getLocalResourceList(): bibleLatestVersion is not found.`);
          }
        }
      });

      tHelpsResources.forEach((tHelpsId) => {
        const tHelpResource = path.join(tHelpsPath, tHelpsId);
        const latestVersions = getLatestVersionsAndOwners(tHelpResource) || {};
        const resourceId = RESOURCE_ID_MAP[tHelpsId] || tHelpsId; // map resource names to ids
        for (const owner of Object.keys(latestVersions)) {
          const tHelpsLatestVersion = latestVersions[owner];

          if (tHelpsLatestVersion) {
            const pathTotHelpsManifestFile = path.join(tHelpsLatestVersion, 'manifest.json');
            addLocalResource(tHelpsLatestVersion, pathTotHelpsManifestFile, languageId, resourceId, localResourceList);
          } else {
            console.log(`getLocalResourceList(): tHelpsLatestVersion is ${tHelpsLatestVersion}.`);
          }
        }
      });
    }
    return localResourceList;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * determine owner for original language resource.  If resource owner is door43 Catalog, then the original
 *  language resource will be the same.  Otherwise it will be unfoldingWord.
 * @param {string} resourceOwner
 * @return {string}
 */
export function getOwnerForOriginalLanguage(resourceOwner) {
  const origLangOwner = (resourceOwner !== DOOR43_CATALOG) ? CN_CATALOG : DOOR43_CATALOG;
  return origLangOwner;
}

/**
 * make sure version starts with v
 * @param {string} version
 * @return {string}
 */
export function formatVersionWithV(version) {
  const version_ = (version[0] === 'v') ? version : 'v' + version;
  return version_;
}

/**
 * make sure version does not start with v
 * @param {string} version
 * @return {string}
 */
export function formatVersionWithoutV(version) {
  const version_ = (version[0] === 'v') ? version.substring(1) : version;
  return version_;
}
