import { getAlignedText } from '../tc_ui_toolkit/VerseCheck/helpers/checkAreaHelpers'

/**
 * looks up the GL text from an aligned GL bible using the Original Language
 * @param {object} toolsSelectedGLs
 * @param {object} contextId
 * @param {object} bibles
 * @param {string} currentToolName
 * @return {string|null} returns null if error getting text
 */
export function getAlignedGLText(toolsSelectedGLs, contextId, bibles, currentToolName) {
  if (contextId) {
    const selectedGL = toolsSelectedGLs[currentToolName];

    if (!bibles || !bibles[selectedGL] || !Object.keys(bibles[selectedGL]).length) {
      return contextId.quote;
    }

    const sortedBibleIds = Object.keys(bibles[selectedGL]).sort(bibleIdSort);

    for (let i = 0; i < sortedBibleIds.length; ++i) {
      const bible = bibles[selectedGL][sortedBibleIds[i]];

      if (bible && contextId && bible[contextId.reference.chapter] && bible[contextId.reference.chapter][contextId.reference.verse] && bible[contextId.reference.chapter][contextId.reference.verse].verseObjects) {
        const verseObjects = bible[contextId.reference.chapter][contextId.reference.verse].verseObjects;
        const alignedText = getAlignedText(verseObjects, contextId.quote, contextId.occurrence);

        if (alignedText) {
          return alignedText;
        }
      }
    }
  }
  return null;
}

/**
 * creates the error meesage for invalid quote
 * @param {object} contextId
 * @param {Function} translate
 * @return {string}
 */
export function getInvalidQuoteMessage(contextId, translate) {
  let origLangQuote = '';

  if (contextId) {
    origLangQuote = getQuoteAsString(contextId.quote);
  }

  const message = translate('quote_invalid', { quote: origLangQuote });
  return message;
}

/**
 * convert quote to string
 * @param {String|Array} quote
 * @return {string}
 */
export function getQuoteAsString(quote) {
  let text = '';

  if (Array.isArray(quote)) {
    text = quote.map(({ word }) => word).join(' ');
  } else if (typeof quote === 'string') {
    text = quote;
  }
  // remove space before any punctuation that is used in Greek except `...` and `…`
  text = text.replace(/\s+(?!\.\.\.)(?!…)([.,;'’`?!"]+)/g, '$1');
  return text;
}

export function bibleIdSort(a, b) {
  const biblePrecedence = ['udb', 'ust', 'ulb', 'ult', 'irv']; // these should come first in this order if more than one aligned Bible, from least to greatest

  if (biblePrecedence.indexOf(a) == biblePrecedence.indexOf(b)) {/* eslint-disable-next-line no-nested-ternary */
    return (a < b ? -1 : a > b ? 1 : 0);
  } else {
    return biblePrecedence.indexOf(b) - biblePrecedence.indexOf(a);
  } // this plays off the fact other Bible IDs will be -1
}
