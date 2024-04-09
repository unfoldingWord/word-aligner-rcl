import usfmjs from 'usfm-js';

// consts
const leadingSpacesRegex = new RegExp(/^\s/);
const trailingSpacesRegex = new RegExp(/\s$/);

/**
 * Method to filter usfm markers from a string
 * @param {String} verseText - The string to remove markers from
 * @return {String}
 */
export const removeMarker = (verseText) => {
  let text = usfmjs.removeMarker(verseText);
  const trimmed = verseText.trimLeft();
  const offset = verseText.indexOf(trimmed);

  if (offset > 0) { // see if we need to restore leading white space
    text = verseText.substr(0, offset) + text; // restore original leading white space
  }
  return text;
};

/**
 * returns true if text has leading white space
 * @param {String} text
 * @return {boolean}
 */
export const hasLeadingSpace = (text) => {
  const hasSpace = leadingSpacesRegex.test(text);
  return hasSpace;
};

/**
 * returns true if text has trailing white space
 * @param {String} text
 * @return {boolean}
 */
export const hasTrailingSpace = (text) => {
  const hasSpace = trailingSpacesRegex.test(text);
  return hasSpace;
};
