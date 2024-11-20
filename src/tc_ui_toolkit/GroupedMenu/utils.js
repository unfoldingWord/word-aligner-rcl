import { getReferenceStr, getTitleStr } from '../ScripturePane/helpers/utils'

/**
 * zero fill string to make minimum length
 * @param text
 * @param len
 * @returns {*}
 */
function zeroAdjustLength(text, len) {
  let parts = text.split('-');
  text = parts[0];

  while (text.length < len) {
    text = '0' + text;
  }
  parts[0] = text;
  return parts.join('-');
}

function splitChapterVerse(ref_) {
  const [chapter, verse] = ref_.split(':');
  return { chapter, verse };
}

/**
 * create a reference where chapter and verse is zero filled to be same width
 * @param ref
 * @returns {null|string}
 */
function normalizeRef(ref) {
  let { chapter, verse } = splitChapterVerse(ref);

  if (chapter && verse) {
    chapter = zeroAdjustLength(chapter, 3);
    verse = zeroAdjustLength(verse, 3);
    return `${chapter}_${verse}`;
  }

  return null;
}

export function bibleRefSort(a, b) { // sorts by numerical chapter/verse order
  const akey = normalizeRef(a);
  const bkey = normalizeRef(b);
  // eslint-disable-next-line no-nested-ternary
  return akey < bkey ? -1 : akey > bkey ? 1 : 0;
}

/**
 * Helper utility to generate data for the menu organized by group.
 * @param {[]} index - the group index
 * @param {object} data - the group data
 * @param {string} direction - layout direction - default 'ltr'
 * @param {string} progressKey - the key by which the group progress will be measured
 * @param {function} [onProcessItem=null] - an optional callback to perform additional processing on a menu item. This is executed before the `progressKey` is evaluated.
 * @param {[]} menu - returns the nested menu
 * @param {string} progressKey2 - the secondary key by which the group progress will be measured
 */
function generateMenuByGroup(data, index, direction, onProcessItem, menu, progressKey, progressKey2) {
  const dataKeys = Object.keys(data);

  for (let i = 0, len = index.length; i < len; i++) {
    const entry = index[i];

    if (dataKeys.includes(entry.id)) {
      // generate menu group
      const group = data[entry.id];
      const gl = group.length;
      const children = new Array(gl);

      for (let j = 0; j < gl; j++) {
        const item = processMenuItem(group[j]);
        item.direction = direction;
        children[j] = onProcessItem ? onProcessItem(item) : item;
      }
      menu.push({
        title: entry.name,
        progress: calculateProgress(children, progressKey, progressKey2),
        id: entry.id,
        children,
      });
    }
  }
}

/**
 * Helper utility to generate data for the menu organized by reference.
 * @param {[]} index - the group index
 * @param {object} data - the group data
 * @param {string} direction - layout direction - default 'ltr'
 * @param {string} progressKey - the key by which the group progress will be measured
 * @param {function} [onProcessItem=null] - an optional callback to perform additional processing on a menu item. This is executed before the `progressKey` is evaluated.
 * @param {[]} menu - returns the nested menu
 * @param {string} progressKey2 - the secondary key by which the group progress will be measured
 */
function generateMenuByRef(data, index, direction, onProcessItem, menu, progressKey, progressKey2) {
  let refs = {};
  let groups = {};

  for (let i = 0, len = index.length; i < len; i++) {
    const entry = index[i];
    const id = entry?.id;
    groups[id] = entry?.name || '';
    const dataItems = data[id] || [];

    for (const item of dataItems) {
      const ref = item?.contextId?.reference;

      if (ref) {
        const refStr = `${ref.chapter}:${ref.verse}`;
        let children = refs[refStr];

        if (!children) {
          children = [];
          refs[refStr] = children;
        }

        const newItem = {
          ...item,
          organizeByRef: refStr,
        };
        children.push(newItem);
      }
    }
  }

  const sortedRefs = Object.keys(refs).sort(bibleRefSort);

  for (const ref of sortedRefs) {
    const children = refs[ref];

    for (let i = 0, len = children.length; i < len; i++) {
      const entry = children[i];
      const item = processMenuItem(entry);
      item.direction = direction;
      item.groupName = groups[item.groupId] || item.groupId;
      let processed = onProcessItem ? onProcessItem(item, true) : item;
      children[i] = processed;
    }

    menu.push({
      title: ref,
      progress: calculateProgress(children, progressKey, progressKey2),
      id: ref,
      children,
      organizeByRef: ref,
    });
  }
}

/**
 * Helper utility to generate data for the menu.
 * @param {[]} index - the group index
 * @param {object} data - the group data
 * @param {string} direction - layout direction - default 'ltr'
 * @param {string} progressKey - the key by which the group progress will be measured
 * @param {function} [onProcessItem=null] - an optional callback to perform additional processing on a menu item. This is executed before the `progressKey` is evaluated.
 * @param {string} progressKey2 - the secondary key by which the group progress will be measured
 * @param {boolean} organizeByRef - optional, if true then group by references
 * @returns {[]} the menu data
 */
export function generateMenuData(
  index,
  data,
  progressKey,
  direction = 'ltr',
  onProcessItem = null,
  progressKey2 = null,
  organizeByRef = false,
) {
  const menu = [];

  if (organizeByRef) {
    generateMenuByRef(data, index, direction, onProcessItem, menu, progressKey, progressKey2);
  } else {
    generateMenuByGroup(data, index, direction, onProcessItem, menu, progressKey, progressKey2);
  }
  return menu;
}



/**
 * Produces a valid menu item from a context id or a group data entry.
 * This is useful for pre-processing the active entry.
 * @param {object} contextId - a context id or group data entry.
 * @param {string} direction - layout direction - default 'ltr'
 * @param {function} [onProcessItem=null] - an optional preprocessor
 * @param {boolean} organizeByRef - optional, if true then group by references
 * @returns {object}
 */
export function generateMenuItem(
  contextId,
  direction = 'ltr',
  onProcessItem = null,
  organizeByRef = false,
) {
  // TRICKY: determine if this is a contextId or group data entry.
  let item;

  if (contextId.hasOwnProperty('contextId')) {
    item = contextId;
  } else {
    item = { contextId };
  }
  item.direction = direction;

  if (organizeByRef) {
    const ref = item?.contextId?.reference;

    if (ref) {
      const refStr = `${ref.chapter}:${ref.verse}`;
      item.organizeByRef = refStr;
    }
  }

  // perform pre-processing
  if (typeof onProcessItem === 'function') {
    return onProcessItem(processMenuItem(item));
  } else {
    return processMenuItem(item);
  }
}

/**
 * Calculates the progress over an array of objects
 * @param {object[]} data - an array of objects
 * @param {string} progressKey - the key used to check the completion status of each object
 * @param {string} progressKey2 - the secondary key used to check the completion status of each object
 * @returns {number} - returns a number between 0 and 100 inclusive
 */
function calculateProgress(data, progressKey, progressKey2) {
  const total = data.length;
  let completed = 0;

  for (let i = 0, len = data.length; i < len; i ++) {
    if (data[i][progressKey] || (progressKey2 && data[i][progressKey2])) {
      completed++;
    }
  }
  return (completed / total) * 100;
}

/**
 * Performs some default child generation operations.
 * For advanced menu item customization you should provide a callback to {@link generateMenuData}
 * @param {object} data - the menu item data
 * @returns {object} - the formatted menu item data
 */
function processMenuItem(data) {
  // TRICKY: use the context id to pre-populate some fields
  const {
    contextId: {
      groupId,
      reference: {
        bookId, chapter, verse,
      },
    },
  } = data;
  const refStr = getReferenceStr(chapter, verse);
  const passageTitle = getTitleStr(bookId, refStr, data.direction);

  return {
    ...data,
    groupId,
    itemId: refStr,
    title: passageTitle,
  };
}
