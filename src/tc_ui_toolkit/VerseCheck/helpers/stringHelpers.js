/* eslint-disable no-console */
/**
 * @description Function that count occurrences of a substring in a string
 * @param {String} string - The string to search in
 * @param {String} subString - The sub string to search for
 * @returns {Integer} - the count of the occurrences
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 * modified to fit our use cases, return zero for '' substring, and no use case for overlapping.
 */
export const occurrencesInString = (string, subString) => {
  if (subString.length <= 0) {
    return 0;
  }

  var occurrences = 0, position = 0, step = subString.length;

  while (position < string.length) {
    position = string.indexOf(subString, position);

    if (position === -1) {
      break;
    }
    ++occurrences;
    position += step;
  }
  return occurrences;
};
/**
 * @description - Function that normalizes a string including whitespace
 * @param {String} string - the string to normalize
 * @preturns {String} - The returned normalized string
 */
export const normalizeString = (string) => {
  string = string.replace(/\s+/g, ' ');
  return string;
};
/**
 * @description - generates a selection object from the selected text, precedingText and whole text
 * @param {String} selectedText - the text that is selected
 * @param {String} precedingText - the text that precedes the selection
 * @param {String} entireText - the text that the selection should be in
 * @return {Object} - the selection object to be used
 */
export const generateSelection = (selectedText, precedingText, entireText) => {
  let selection = {}; // response
  // replace more than one contiguous space with a single one since HTML/selection only renders 1
  entireText = normalizeString(entireText);
  // get the occurrences before this one
  let precedingOccurrences = occurrencesInString(precedingText, selectedText);
  // calculate this occurrence number by adding it to the preceding ones
  let occurrence = precedingOccurrences + 1;
  // get the total occurrences from the verse
  let occurrences = occurrencesInString(entireText, selectedText);

  selection = {
    text: selectedText,
    occurrence: occurrence,
    occurrences: occurrences,
  };
  return selection;
};
