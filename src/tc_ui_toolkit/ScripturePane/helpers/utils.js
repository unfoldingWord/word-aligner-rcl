const defaultDirection = 'ltr';

/**
 * Delays code execution for a number of ms given.
 * @param {number} ms
 */
export function delay(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

/**
 * lookup translation for text or key.  First looks for a static translation and then tries a dynamic translation
 * @param {Function} translate - translation function
 * @param {String} text - string or key to translate
 * @param {String} deflt - default string to use if no translation is found
 * @param {Object} params - Params to use for printing
 * @return {String} translated text
 */
export function getTranslation(translate, text, deflt) {
  let key = text.toLowerCase();
  key = key.replace(' ', '_');
  let translation;
  translation = translate(key);

  if (!translation || ((typeof translation == 'string') && (translation.indexOf('Missing translation key') >= 0))) { // if not translated, return original text
    translation = deflt;
  }
  return translation;
}

/**
 * get title with id arranged for language direction
 * @param {string} languageName
 * @param {string} identifier
 * @param {boolean|string} direction
 * @param {string} preRelease - pre-release string to add
 * @return {string}
 */
export function getTitleWithId(languageName, identifier, direction = defaultDirection, preRelease = '') {
  let title;

  if (isLTR(direction)) {
    title = `${languageName} (${identifier.toUpperCase()})`;
  } else {
    title = `(${identifier.toUpperCase()}) ${languageName}`;
  }

  if (preRelease) {
    title = `[${title}] - ${preRelease}`;
  }

  return title;
}

/**
 * get reference arranged for language direction
 * @param {string} chapter
 * @param {string|number} verse
 * @param {boolean|string} direction
 * @return {string}
 */
export function getReferenceStr(chapter, verse, direction = defaultDirection) {
  if (isLTR(direction)) {
    return `${chapter}:${verse}`;
  }
  return `${verse}:${chapter}`;
}

/**
 * get title arranged for language direction
 * @param {string} first - initial text
 * @param {string} second - following text
 * @param {boolean|string} direction
 * @return {string}
 */
export function getTitleStr(first, second, direction = defaultDirection) {
  if (isLTR(direction)) {
    return `${first} ${second}`;
  }
  return `${second} ${first}`;
}

/**
 * determine if language direction is ltr.  If direction parameter is not
 *   string then treat as boolean (if true then LTR)
 * @param {boolean|string} direction
 * @return {boolean} true if LTR
 */
export function isLTR(direction) {
  if (typeof direction === 'string'){
    return (direction !== 'rtl');
  }
  return direction;
}
