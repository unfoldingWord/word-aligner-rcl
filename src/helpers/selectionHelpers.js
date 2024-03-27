/* eslint-disable no-constant-condition */
import _ from 'lodash';
// constants
import {
  DEFAULT_MAX_SELECTIONS,
  TRANSLATION_NOTES,
  TN_MAX_SELECTIONS,
} from '../common/constants';
// helpers
import * as stringHelpers from './stringHelpers';

/**
 * determine the maximum selections allowed based on tool name
 * @param toolName
 * @return {number}
 */
export const getMaximumSelections = toolName => (toolName === TRANSLATION_NOTES) ? TN_MAX_SELECTIONS : DEFAULT_MAX_SELECTIONS;

/**
 * Splice string into array of ranges, flagging what is selected
 * @param {array} ranges - array of ranges [[int,int],...]
 * @returns {array} - array of objects [obj,...]
 */
export const spliceStringOnRanges = (string, ranges) => {
  let selectionArray = []; // response
  // sort ranges - this ensures we build the string correctly and don't miss selections
  // concat overlaps - should not be a concern here but might help rendering bugs
  let remainingString = string;
  // shift the range since the loop is destructive
  // by working on the remainingString and not original string
  let rangeShift = 0;

  ranges.forEach(function (rangeObject) {
    let range = rangeObject.range;
    // save all the text before the selection
    let beforeSelection = remainingString.slice(0, range[0] - rangeShift);
    // console.info('beforeSelection: ', beforeSelection)
    // save the text in the selection
    let selection = remainingString.slice(range[0] - rangeShift, range[1] + 1 - rangeShift);
    // console.info('subString: ', selection)
    // save all the text after the selection
    let afterSelection = remainingString.slice(range[1] - rangeShift + 1);
    // console.info('afterSelection: ', afterSelection)
    selectionArray.push({ text: beforeSelection, selected: false });
    selectionArray.push({
      text: selection,
      selected: true,
      occurrence: rangeObject.occurrence,
      occurrences: rangeObject.occurrences,
    });
    // next iteration is using remaining string
    remainingString = afterSelection;
    // shift the range up to last char of substring (before+sub)
    rangeShift += beforeSelection.length;
    rangeShift += selection.length;
  });
  selectionArray.push({ text: remainingString, selected: false });
  // remove empty text from selectionArray
  return selectionArray;
};
//
// Use the following lines to test the previous function
// var string = "01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890"
// var ranges = [ { range: [ 45, 47 ], occurrence: 2, occurrences: 2 } ]
// console.info(module.exports.spliceStringOnRanges(string, ranges))

/**
 * This converts ranges to array of selection objects
 * @param {string} string - text used to get the ranges of
 * @param {array} selections - array of selections [obj,...]
 * @returns {array} - array of range objects
 */
export const selectionsToRanges = (string, selections) => {
  let ranges = [];

  selections.forEach(function (selection) {
    if (string !== undefined && string.includes(selection.text)) {
      let splitArray = string.split(selection.text);
      let beforeSelection = splitArray.slice(0, selection.occurrence).join(selection.text);
      let start = beforeSelection.length;
      let end = start + selection.text.length - 1;
      let rangesObject = {
        range: [start, end],
        occurrence: selection.occurrence,
        occurrences: selection.occurrences,
      };
      ranges.push(rangesObject);
    }
  });
  return ranges;
};
//
// Use the following lines to test the previous function
// var string = "01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890"
// var selections = [
//   { text: '234', occurrence: 2, occurrences: 2 },
// ]
// console.info(module.exports.selectionsToRanges(string, selections))

/**
 * Splice string into array of substrings, flagging what is selected
 * @param {string} string - text used to get the ranges of
 * @param {array} selections - array of selections [obj,...]
 * @returns {array} - array of objects
 */
export const selectionArray = (string, selections) => {
  let selectionArray = [];
  let ranges = selectionsToRanges(string, selections);
  selectionArray = spliceStringOnRanges(string, ranges);
  return selectionArray;
};
//
// Use the following lines to test the previous function
// var string = "01 234 56789qwertyuiopasdfghjklzxcvbnmtyui01 234 567890"
// var selections = [
//   { text: '234', occurrence: 2, occurrences: 2 },
// ]
// console.info(module.exports.selectionArray(string, selections))


/**
 * This abstracts complex handling of ranges such as order, deduping, concatenating, overlaps
 * @param {array}  ranges - array of ranges [[int,int],...]
 * @returns {array} - array of optimized ranges [[int,int],...]
 */
export const optimizeRanges = (ranges) => {
  let optimizedRanges = []; // response

  ranges = _.sortBy(ranges, function (range) {
    return range[1];
  });// order ranges by end char index as secondary
  ranges = _.sortBy(ranges, function (range) {
    return range[0];
  });// order ranges by start char index as primary
  ranges = _.uniq(ranges); // remove duplicates
  // combine overlapping and contiguous ranges
  let _range = [];

  ranges.forEach(function (range, index) {
    if (range[0] >= _range[0] && range[0] <= _range[1] + 1) { // the start occurs in the running range and +1 handles contiguous
      if (range[1] >= _range[0] && range[1] <= _range[1]) { // if the start occurs inside running range then let's check the end
        // if the end occurs inside the running range then it's inside it and doesn't matter
      } else { // it doesn't occur inside the running range
        _range[1] = range[1]; // extend running range
      }
    } else { // the start does not occur in the running range
      if (_range.length != 0) {
        optimizedRanges.push(_range);
      } // the running range is closed push it to optimizedRanges
      _range = range; // reset the running range to this one
    }

    if (ranges.length === index + 1 && _range[1] - _range[0] >= 0) { // this is the last one and it isn't blank
      optimizedRanges.push(_range); // push the last one to optimizedRanges
    }
  });
  return optimizedRanges;
};
//
// Use the following lines to test the previous function
// var ranges = [[1,1],[5,9],[3,4],[7,10],[20,40],[15,16],[14,17]]
// console.info(module.exports.optimizeRanges(ranges))
// => [ [ 1, 1 ], [ 3, 10 ], [ 14, 17 ], [ 20, 40 ] ]

/**
 * This converts ranges to array of selection objects
 * @param {string} string - text used to get the ranges of
 * @param {array} ranges - array of ranges [[int,int],...]
 * @returns {array} - array of selection objects
 */
export const rangesToSelections = (string, ranges) => {
  let selections = [];

  ranges.forEach( range => {
    const start = range[0], end = range[1]; // set the start and end point
    const length = end - start + 1; // get the length of the sub string
    const subString = string.substr(start, length); // get text of the sub string
    const beforeText = string.substr(0, start); // get the string prior to the range
    const beforeMatches = stringHelpers.occurrencesInString(beforeText, subString); // get occurrences prior to range
    const occurrence = beforeMatches + 1; // get number of this occurrence
    const occurrences = stringHelpers.occurrencesInString(string, subString); // get occurrences in string
    const selection = {
      text: subString,
      occurrence: occurrence,
      occurrences: occurrences,
    };

    if (occurrences > 0) { // there are some edge cases where empty strings get through but don't have occurrences
      selections.push(selection);
    }
  });
  return selections;
};
//
// Use the following lines to test the previous function
// var string = "0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890"
// var ranges = [ [3,9], [14,17], [20,40] ]
// console.info(module.exports.rangesToSelections(string, ranges))
// => [ { text: '3456789', occurrence: 1, occurrences: 2 },
//      { text: 'tyui', occurrence: 1, occurrences: 2 },
//      { text: 'asdfghjklzxcvbnmtyui0', occurrence: 1, occurrences: 1 }
//    ]

/**
 * This abstracts complex handling of selections such as order, deduping, concatenating, overlapping ranges
 * @param {string} string - the text selections are found in
 * @param {array}  selections - array of selection objects [Obj,...]
 * @returns {array} - array of selection objects
 */
export const optimizeSelections = (string, selections) => {
  let optimizedSelections; // return
  let ranges = selectionsToRanges(string, selections).map(rangeObject => rangeObject.range); // get char ranges of each selection
  ranges = optimizeRanges(ranges); // optimize the ranges
  optimizedSelections = rangesToSelections(string, ranges); // convert optimized ranges into selections

  return optimizedSelections;
};
//
// Use the following lines to test the previous function
// var string = "0123456789qwertyuiopasdfghjklzxcvbnmtyui01234567890"
// var selections = [
//   { text: '234', occurrence: 2, occurrences: 2 },
// ]
// var selections = [
//   { text: 'not found in here', occurrence: 2, occurrences: 2 },
//   { text: '234', occurrence: 1, occurrences: 2 },
//   { text: '56789', occurrence: 1, occurrences: 2 },
//   { text: '3456', occurrence: 1, occurrences: 2 },
//   { text: 'tyu', occurrence: 1, occurrences: 2 },
//   { text: 'yui', occurrence: 1, occurrences: 2 },
//   { text: 'yui', occurrence: 2, occurrences: 2 },
//   { text: 'asdfghjklzxcvbnmtyui0', occurrence: 1, occurrences: 1 }
// ]
// the following tests a repeated occurrence after an early selection is made
// var selections = [
//   { text: '234', occurrence: 1, occurrences: 2 },
//   { text: 'yui', occurrence: 2, occurrences: 2 },
//   { text: '0', occurrence: 3, occurrences: 3 }
// ]
// console.info(module.exports.optimizeSelections(string, selections))

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

  let n = 0, pos = 0, step = subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);

    if (pos === -1) {
      break;
    }
    ++n;
    pos += step;
  }
  return n;
};

// Use for testing/debugging...

// var string = 'abcdefghijklmnopqrstuvwxyz'
// var selectedText = [
//   {
//     "text": "cdef",
//     "occurrence": 1,
//     "occurrences": 1
//   },
//   {
//     "text": "klmno",
//     "occurrence": 1,
//     "occurrences": 1
//   },
//   {
//     "text": "wxyz",
//     "occurrence": 1,
//     "occurrences": 1
//   }
// ]

// var string = '012345678901234567890123456789'
// var selectedText = [
//   {
//     "text": "1234",
//     "occurrence": 1,
//     "occurrences": 3
//   },
//   {
//     "text": "01234",
//     "occurrence": 2,
//     "occurrences": 3
//   },
//   {
//     "text": "01234",
//     "occurrence": 3,
//     "occurrences": 3
//   }
// ]
// loop through occurrences to get character ranges
// var selectionCharacterRanges = [
//   [1,4],
//   [10,14],
//   [20,24]
// ]
// var ranges = module.exports.selectionsToRanges(string, selectedText)
// console.info(ranges)
//
// var selectionArray = module.exports.spliceStringOnRanges(string, ranges)
// console.info(selectionArray)

// var selectionArray = module.exports.selectionArray(string, selectedText)
// console.info(selectionArray)
