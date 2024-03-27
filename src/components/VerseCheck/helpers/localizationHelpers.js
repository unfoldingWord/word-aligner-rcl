/* eslint-disable no-console */

/**
 * translate a string and splits it into parts.  Fills part array with blank lines to meet minCount
 * @param {function} translate
 * @param {string} key
 * @param {string} splitAt - text for splitting
 * @param {int} minCount
 * @return {array} split translated string
 */
export const getTranslatedParts = (translate, key, splitAt, minCount) => {
  let parts = [];
  const translation = translate(key);

  if (translation) {
    parts = translation.split(splitAt);
  }

  for (let i = parts.length; i < minCount; i++) {
    parts.push('');
  }
  return parts;
};