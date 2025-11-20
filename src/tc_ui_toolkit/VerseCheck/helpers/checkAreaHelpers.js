const BREAK_CHAR = '&';
const DEFAULT_SEPARATOR = ' ';

/**
 * gets the quote as an array of occurrences
 * @param {Array|String} quote
 * @param {int} occurrenceToMatch
 * @return {Array}
 */
export const getQuoteAsArray = (quote, occurrenceToMatch) => {
  let quoteArray = quote;

  if (typeof quote ==='string') { // should only be string in case of single word quote, otherwise is an array
    quoteArray = quote.split(' ');
    quoteArray = quoteArray.map(word => ({ word, occurrence: occurrenceToMatch }));
  }
  return quoteArray;
};

/**
 * see if occurrence of verseObject is a match to `match`.  If match occurrence is -1, it will match all occurrences in verse
 * @param {object} verseObject
 * @param {object} match
 * @returns {boolean}
 */
function isOccurrenceMatch(verseObject, match) {
  const isMatch = (verseObject.occurrence === match.occurrence) || (match.occurrence === -1);
  return isMatch;
}

/**
 * getAlignedText - returns a string of the text found in an array of verseObjects that matches the words to find
 *                  and their occurrence in the verse.
 * @param {Array} verseObjects
 * @param {Array|String} quote
 * @param {int} occurrenceToMatch
 * @param {boolean} isMatch - if true, all verseObjects will be considered a match and will be included in the returned text
 */
export const getAlignedText = (verseObjects, quote, occurrenceToMatch, isMatch=false) => {
  let text = '';

  if (! verseObjects || ! quote || ! occurrenceToMatch) {
    return text;
  }

  const wordsToMatch = getQuoteAsArray(quote, occurrenceToMatch);
  let separator = DEFAULT_SEPARATOR;
  let needsBreak = false;

  for (let i = 0, l = verseObjects.length; i < l; i++) {
    const verseObject = verseObjects[i];
    let lastMatch = false;

    if ((verseObject.type === 'milestone' || verseObject.type === 'word')) {
      // It is a milestone or a word...we want to handle all of them.
      if (isMatch || wordsToMatch.find(item => (verseObject.content === item.word) && isOccurrenceMatch(verseObject, item))) {
        lastMatch = true;

        // We have a match (or previously had a match in the parent) so we want to include all text that we find,
        if (needsBreak) {
          // Need to add an ellipsis to the separator since a previous match but not one right next to this one
          separator += BREAK_CHAR+DEFAULT_SEPARATOR;
          needsBreak = false;
        }

        if (text) {
          // There has previously been text, so append the separator, either a space or punctuation
          text += separator;
        }
        separator = DEFAULT_SEPARATOR; // reset the separator for the next word

        if (verseObject.text) {
          // Handle type word, appending the text from this node
          text += verseObject.text;
        }

        if (verseObject.children) {
          // Handle children of type milestone, appending all the text of the children, isMatch is true
          text += getAlignedText(verseObject.children, wordsToMatch, occurrenceToMatch, true);
        }
      } else if (verseObject.children) {
        // Did not find a match, yet still need to go through all the children and see if there's match.
        // If there isn't a match here, i.e. childText is empty, and we have text, we still need
        // an ellipsis if a later match is found since there was some text here
        let childText = getAlignedText(verseObject.children, wordsToMatch, occurrenceToMatch, isMatch);

        if (childText) {
          lastMatch = true;

          if (needsBreak) {
            separator += BREAK_CHAR+DEFAULT_SEPARATOR;
            needsBreak = false;
          }
          text += (text?separator:'') + childText;
          separator = DEFAULT_SEPARATOR;
        } else if (text) {
          needsBreak = true;
        }
      }
    }

    if ( lastMatch && verseObjects[i + 1] && verseObjects[i + 1].type === 'text' && text) {
      // Found some text that is a word separator/punctuation, e.g. the apostrophe between "God" and "s" for "God's"
      // We want to preserve this so we can show "God's" instead of "God ... s"
      if (separator === DEFAULT_SEPARATOR) {
        separator = '';
      }
      separator += verseObjects[i + 1].text;
    }
  }
  return text;
};
