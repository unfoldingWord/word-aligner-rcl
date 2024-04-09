import isEqual from 'deep-equal';
// import path from 'path-extra';
// import fs from 'fs-extra';
// import { saveGroupsDataItem } from '../localStorage/saveMethods';
// import ProjectAPI from './ProjectAPI';
import { sameContext } from './contextIdHelpers';
import * as verseHelpers from '../tc_ui_toolkit/ScripturePane/helpers/verseHelpers'

/**
 * Gets the group data for the verse reference in contextId from groupsDataReducer
 * @param {Object} groupsData
 * @param {Object} contextId
 * @return {object} group data object.
 */
export const getGroupDataForVerse = (groupsData, contextId) => {
  const filteredGroupData = {};

  if (groupsData) {
    const groupsDataKeys = Object.keys(groupsData);

    for (let i = 0, l = groupsDataKeys.length; i < l; i++) {
      const groupItemKey = groupsDataKeys[i];
      const groupItem = groupsData[groupItemKey];

      if (groupItem) {
        for (let j = 0, l = groupItem.length; j < l; j++) {
          const check = groupItem[j];

          try {
            if (isSameVerse(check.contextId, contextId)) {
              if (!filteredGroupData[groupItemKey]) {
                filteredGroupData[groupItemKey] = [];
              }
              filteredGroupData[groupItemKey].push(check);
            }
          } catch (e) {
            console.warn(`Corrupt check found in group "${groupItemKey}"`, check);
          }
        }
      }
    }
  }
  return filteredGroupData;
};

// /**
//  * Loads all of a tool's group data from the project.
//  * @param {string} toolName - the name of the tool who's helps will be loaded
//  * @param {string} projectDir - the absolute path to the project
//  * @param {object} targetBook - target book content to mark verse spans
//  * @returns {*}
//  */
// export function loadProjectGroupData(toolName, projectDir, targetBook = null) {
//   const project = new ProjectAPI(projectDir);
//   const groupsData = project.getGroupsData(toolName);
//
//   if (targetBook) {
//     tagGroupDataSpans(targetBook, groupsData);
//   }
//   return groupsData;
// }

// /**
//  * gets path to a tool's group data from the project.
//  * @param {string} toolName - the name of the tool who's helps will be loaded
//  * @param {string} projectDir - the absolute path to the project
//  * @param {string} groupID - group identifier
//  * @returns {string} path to a tool's group data
//  */
// export function getGroupDataIndexPath(toolName, projectDir, groupID) {
//   const project = new ProjectAPI(projectDir);
//   return path.join(project.getCategoriesDir(toolName), groupID + '.json');
// }

// /**
//  * gets path to a tool's group data from the project.
//  * @param {string} toolName - the name of the tool who's helps will be loaded
//  * @param {string} projectDir - the absolute path to the project
//  * @param {string} groupID - group identifier
//  * @param {object} groupData - data to save
//  * @returns {string} path to a tool's group data
//  */
// export function saveGroupData(toolName, projectDir, groupID, groupData) {
//   const dataPath = getGroupDataIndexPath(toolName, projectDir, groupID);
//   return fs.outputJson(dataPath, groupData, { spaces: 2 }); // don't need to wait for it to complete, so not a sync operation
// }

/**
 * Generates a chapter-based group index.
 * Most tools will use a chapter based-index.
 * TODO: do not localize the group name here. Instead localize it as needed. See todo on {@link loadProjectGroupIndex}
 * @param {function} translate - the locale function
 * @param {number} [numChapters=150] - the number of chapters to generate
 * @return {*}
 */
export const generateChapterGroupIndex = (translate, numChapters = 150) => {
  const chapterLocalized = translate('tools.chapter') || 'Chapter';

  return Array(numChapters).fill().map((_, i) => {
    let chapter = i + 1;
    return {
      id: 'chapter_' + chapter,
      name: chapterLocalized + ' ' + chapter,
    };
  });
};

/**
 * searches groupData for a match for contextId (groupData must be for same groupId)
 * @param {Object} contextId
 * @param {Array} groupData for same groupId as contextId
 * @return {number} - returns index of match or -1
 */
export const findGroupDataItem = (contextId, groupData) => {
  let index = -1;
  const isQuoteString = typeof contextId.quote === 'string';
  const noContextID = !contextId.checkId;

  for (let i = groupData.length - 1; i >= 0; i--) {
    const grpContextId = groupData[i].contextId;

    if (
      // TRICKY: if there is no checkId in the check, then we use first item that matches all other parameters
      //         (this is used for migration of checks in the case of tNotes).  Otherwise if checkId's are
      //         different, then we don't have a match
      (noContextID || (grpContextId.checkId === contextId.checkId)) &&
      isSameVerse(grpContextId, contextId) &&
      (grpContextId.occurrence === contextId.occurrence) &&
      (isQuoteString ? (grpContextId.quote === contextId.quote) :
        isEqual(grpContextId.quote, contextId.quote))) {
      index = i;
      break;
    }
  }
  return index;
};

/**
 * find all the verse spans for book
 * @param {object} targetBook
 * @return {{}}
 */
export function getVerseSpans(targetBook) {
  const verseSpans = {};
  const chapters = Object.keys(targetBook);

  for (let i = 0, l = chapters.length; i < l; i++) {
    const verseSpansForChapter = {};
    const chapter = chapters[i];

    if (isNaN(parseInt(chapter, 10))) {
      continue;
    }

    const chapterData = targetBook[chapter];
    const verses = Object.keys(chapterData);

    for (let j = 0, lv = verses.length; j < lv; j++) {
      const verse = verses[j];

      if (verseHelpers.isVerseSpan(verse)) {
        const range = verseHelpers.getVerseSpanRange(verse);
        const { low, high } = range;

        for (let i = low; i <= high; i++) {
          verseSpansForChapter[i + ''] = verse;
        }
      }
    }
    verseSpans[chapter] = verseSpansForChapter;
  }
  return verseSpans;
}

/**
 * adds verseSpan tags to group data items where target translation is a verse span
 * @param {object} targetBook
 * @param {object} groupsData
 */
export function tagGroupDataSpans(targetBook, groupsData) {
  const verseSpans = getVerseSpans(targetBook);
  const groupNames = Object.keys(groupsData);

  for (let i = 0, l = groupNames.length; i < l; i++) {
    const groupName = groupNames[i];
    const groupItems = groupsData[groupName];

    for (let j = 0, l2 = groupItems.length; j < l2; j++) {
      const groupItem = groupItems[j];

      try {
        let contextId = groupItem.contextId;
        const { reference: { chapter, verse } } = contextId;
        const verseSpansForChapter = verseSpans[chapter];

        if (verseHelpers.isVerseSet(verse)) {
          groupItem.contextId.verseSpan = verse;
        } else if (verseSpansForChapter) {
          const verseSpan = verseSpansForChapter[verse + ''];

          if (verseSpan) {
            groupItem.contextId.verseSpan = verseSpan;
          }
        }

        // eslint-disable-next-line no-empty
      } catch (e) { }
    }
  }
}

/**
 * if ref is a string, converts to number unless it's a verse span
 * @param {string|number} verse
 * @return {string|number}
 */
export function normalizeRef(verse) {
  const isString = (typeof verse === 'string');

  if (isString) {
    if (!verse.includes('-')) { // if not verse span convert to number
      verse = parseInt(verse, 10);
    }
  }
  return verse;
}

/**
 * make sure context IDs are for same verse.  Optimized over isEqual()
 * @param {string|number} verseSpan
 * @param {string|number} verse
 * @return {boolean} returns true if verse within verse span
 */
export function isVerseWithinVerseSpan(verseSpan, verse) {
  if (typeof verseSpan === 'string') {
    const { low, high } = verseHelpers.getVerseSpanRange(verseSpan);

    if ((low > 0) && (high > 0)) {
      return ((verse >= low) && (verse <= high));
    }
  }
  return false;
}

/**
 * make sure context IDs are for same verse.  Optimized over isEqual()
 * @param {Object} contextId1 - context we are checking
 * @param {Object} contextId2 - context that we are trying to match, could have verse span
 * @return {boolean} returns true if context IDs are for same verse
 */
export function isSameVerse(contextId1, contextId2) {
  let match = false;

  if (normalizeRef(contextId1.reference.chapter) === normalizeRef(contextId2.reference.chapter)) {
    let verse1 = normalizeRef(contextId1.reference.verse);
    let verse2 = normalizeRef(contextId2.reference.verse);
    match = (verse1 === verse2);

    if (!match) { // if not exact match, check for verseSpan
      if (verseHelpers.isVerseSpan(verse2)) {
        match = isVerseWithinVerseSpan(verse2, verse1);
      }
    }
  }
  return match;
}

/**
 * Returns the toggled group data based on the key name passed in.
 * @param {object} state - app store state.
 * @param {object} action - action object being dispatch by the action method.
 * @param {string} key - object key. ex. "comments", "bookmarks", "selections" or "verseEdits".
 */
export const getToggledGroupData = (state, action, key) => {
  let groupData = state.groupsData[action.contextId.groupId];

  if (groupData == undefined) {
    return groupData;
  }

  let index = -1;
  let groupObject = null;

  for (let i = 0, l = groupData.length; i < l; i++) {
    if (sameContext(groupData[i].contextId, action.contextId)) {
      index = i;
      break;
    }
  }

  const oldGroupObject = (index >= 0) ? groupData[index] : null;

  if (oldGroupObject) {
    groupData = [...groupData]; // create new array from old one (shallow copy)
    groupObject = { ...oldGroupObject }; // create new object from old one (shallow copy)
    groupData[index] = groupObject; // replace original object

    switch (key) {
    case 'comments':
      if (action.text.length > 0) {
        groupObject[key] = action.text;
      } else {
        groupObject[key] = false;
      }
      break;
    case 'invalidated':
      groupObject[key] = !!action.boolean;
      break;
    case 'reminders':
      if (action.boolean) {
        groupObject[key] = action.boolean;
      } else {
        groupObject[key] = !groupData[index][key];
      }
      break;
    case 'selections':
      if (action.selections.length > 0) {
        groupObject[key] = action.selections; // we save the selections for quick invalidation checking
        groupObject['nothingToSelect'] = !!action.nothingToSelect;
      } else {
        groupObject[key] = null;
        groupObject['nothingToSelect'] = !!action.nothingToSelect;
      }
      break;
    default:
      groupObject[key] = true;
      break;
    }
  }

  if (groupObject && !isEqual(groupObject, oldGroupObject)) { // only write if we found the group data item and it has changed
    const { groupsData } = state;
    const { projectSaveLocation } = action;
    const {
      tool: toolName,
      reference: { bookId },
    } = action.contextId;
    const updatedGroupsData = {
      ...groupsData,
      [action.contextId.groupId]: groupData,
    };
    // Persisting groupsData in filesystem
    // saveGroupsDataItem(updatedGroupsData, projectSaveLocation, toolName, bookId, action.contextId.groupId);
  }

  return groupData;
};
