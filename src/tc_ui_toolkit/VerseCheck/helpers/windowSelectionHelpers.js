import { tokenize } from 'string-punctuation-tokenizer';
import * as stringHelpers from './stringHelpers';

/**
 * @description - Gets the selection object from the currently selected text from the Web UI
 * @param {String} entireText - the text that the selection should be in, ie verseText
 * @param {Boolean} fallbackToPreviousWord - if true then we select previous word if selection is at end of word
 * @return {Object} - the selection object to be used
 * TODO: Find a way to test
 */
export const getSelectionFromCurrentWindowSelection = (entireText, fallbackToPreviousWord = false) => {
  let selection; // response
  const windowSelection = getCurrentWindowSelection();
  let selectedText = getSelectedTextFromWindowSelection(windowSelection);
  let precedingText = getPrecedingTextFromWindowSelection(windowSelection);

  if (fallbackToPreviousWord && (selectedText === ' ')) { // handle edge case of clicking near end of word
    const words = tokenize({ text: precedingText });

    if (words && words.length) {
      const lastWord = words[words.length - 1];

      if (lastWord) {
        const pos = precedingText.lastIndexOf(lastWord);

        if (pos && (pos + lastWord.length === precedingText.length)) { // if last word is at end of string
          // use last word for selection
          selectedText = lastWord;
          precedingText = precedingText.substr(0, pos);
          console.log(`getSelectionFromCurrentWindowSelection() - switching to last word, selectedText ${JSON.stringify(selectedText)}`);
        }
      }
    }
  }

  // Some edge cases leave a weird selection remaining, let's clean up.
  selection = stringHelpers.generateSelection(selectedText, precedingText, entireText);
  window.getSelection().empty();
  return selection;
};
/**
* @description - Gets the window's Selection from the UI
* @return {Object} windowSelection - a windowSelection object from inside a compatible element
* TODO: Find a way to test
*/
export const getCurrentWindowSelection = () => window.getSelection();
/**
* @description - Gets the window selected text from the windowSelection
* @param {Object} windowSelection - a windowSelection object from inside a compatible element
* @return {String} - selectedText
* TODO: Find a way to test
*/
export const getSelectedTextFromWindowSelection = (windowSelection) => windowSelection.toString();
/**
* @description - Gets the precedingText from the windowSelection
* @param {Object} windowSelection - a windowSelection object from inside a compatible element
* @return {String} - the string of precedingText
* Implementation notes on why you can't just use the window.getSelection()
* getSelection is limited by same innerText node, and does not include span siblings
* indexOfTextSelection is broken by any other previous selection since it only knows its innerText node.
* TODO: Find a way to test
*/
export const getPrecedingTextFromWindowSelection = (windowSelection) => {
  let precedingText; // response
  // concatenate spans etc... to get the precedingText from the windowSelection

  if (windowSelection.rangeCount) {
    // get the text after the preceding selection and current span selection is in.
    const selectionRange = windowSelection.getRangeAt(0);
    // get the character index of what is selected in context of the span it is in.
    const selectionRangeStart = selectionRange.startOffset;
    // get the container of the selection, this is a strange object, that logs as a string.
    const textContainer = selectionRange.commonAncestorContainer;
    // get the parent span that contains the textContainer.

    let element;

    // if the textContainer is #text, then use the parentElement - usually non-overlapping selection
    if ('#text' === textContainer.nodeName) {
      element = textContainer.parentElement;
    }

    // if the textContainer is a span, then use it as the element
    if ('SPAN' === textContainer.nodeName) {
      element = textContainer;
    }

    // if the textContainer is a div, its an overlapping selection, don't use commonAncestorContainer
    if ('DIV' === textContainer.nodeName) {
      element = selectionRange.startContainer.parentElement;
    }

    // check for element, as textContainer can but rarely be something other than #text, span or div
    if (element) {
      precedingText = getPrecedingTextFromElementAndSiblings(element, selectionRangeStart, windowSelection);
    }
  }
  return precedingText;
};
/**
 * @description - gets the precedingText from the element ending at the selectionRangeStart
 * @param {Element} element - the html element that has text and siblings with text
 * @param {Int} selectionRangeStart - the character index of the start of the selection
 * @return {String} - the string of precedingText
 */
export const getPrecedingTextFromElementAndSiblings = (element, selectionRangeStart, windowSelection) => {
  let precedingText; // response
  const precedingTextFromElementSiblings = getPrecedingTextFromElementSiblings(element, windowSelection);
  const precedingTextFromElement = getPrecedingTextFromElement(element, selectionRangeStart, windowSelection);
  precedingText = precedingTextFromElementSiblings + precedingTextFromElement;
  return precedingText;
};
/**
 * @description - gets the precedingText from the element ending at the selectionRangeStart
 * @param {Element} element - the html element that has text
 * @param {Int} selectionRangeStart - the character index of the start of the selection
 * @return {String} - the string of precedingText
 */
export const getPrecedingTextFromElement = (element, selectionRangeStart) => {
  let precedingText; // response
  const text = element.textContent;
  precedingText = text.slice(0, selectionRangeStart);
  return precedingText;
};
/**
 * @description - gets the precedingText from the element siblings
 * @param {Element} element - the html element that has text and siblings with text
 * @return {String} - the string of precedingText
 */
export const getPrecedingTextFromElementSiblings = (element, windowSelection) => {
  let precedingText = ''; // response
  // get the previous sibling to start the loop
  let previousSibling = element.previousElementSibling;

  // loop through previous spans to get their text
  while (previousSibling) {
    // just in case the previousSibling just happens to be a part of the selection
    if (windowSelection && !windowSelection.containsNode(previousSibling)) {
      // prepend the spans innerText to the precedingText
      precedingText = previousSibling.textContent + precedingText;
    }
    // move to the previous span, if none, it ends the loop
    previousSibling = previousSibling.previousElementSibling;
  }
  return precedingText;
};

/**
 * This is a helper method to determine if the selection needs a break char in
 * between the selected words or not.
 * @param {Array} selections - Array of word objects that the user selected
 * @param {string} verseText - The entire verse string from the current check
 * @returns {boolean} - Whether the View should display a break
 */
export function shouldRenderBreak(selections, verseText) {
  /** Need to get the words and occurrence of the selected edge words */
  const endSelectedWord = selections[selections.length - 1].text.trim();
  const endSelectedWordOccurrence = selections[selections.length - 1].occurrence;
  const beginningSelectedWord = selections[0].text.trim();
  const beginningSelectedWordOccurrence = selections[0].occurrence;

  /** Using the occurrences to get the actual index of the word vs
   *  the first time it appears in verse text */
  const indexOfBeginningSelection = verseText.split(beginningSelectedWord, beginningSelectedWordOccurrence).join(beginningSelectedWord).length;
  const indexOfEndSelection = verseText.split(endSelectedWord, endSelectedWordOccurrence).join(endSelectedWord).length;

  /** Checking the text in between selected words for a non-space character */
  const textBetweenSelection = verseText.substring(indexOfBeginningSelection + beginningSelectedWord.length, indexOfEndSelection);
  /** If the end index is the same as the beginning then it is the first word */
  const showBreak = (indexOfEndSelection !== indexOfBeginningSelection) && textBetweenSelection.match(/\S/);
  return showBreak;
}
