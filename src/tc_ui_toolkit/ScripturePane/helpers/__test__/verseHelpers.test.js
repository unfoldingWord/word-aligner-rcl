import fs from 'fs';
import path from 'path';
import React from 'react';
import isEqual from 'deep-equal';
import * as verseHelpers from '../verseHelpers';

function createMarker(verse) {
  return {
    type: 'verse',
    text: verse + '',
  };
}

describe('verseHelpers.getVerseData', () => {
  it('test multiple cases without verse spans in data', () => {
    const chapter1 = {
      '1': 'v1-Content',
      '2': 'v2-Content',
      '3': 'v3-Content',
      '4': 'v4-Content',
      '5': 'v5-Content',
    };
    const bibleData = { '1': chapter1 };
    const tests = [
      {
        chapter: 1, verse: 2, expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
      {
        chapter: '1', verse: '2', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
      {
        chapter: '1', verse: '2-3', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }, { 'text': '3', 'type': 'verse' }, { 'text': 'v3-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
      {
        chapter: '1', verse: '2,3', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }, { 'text': '3', 'type': 'verse' }, { 'text': 'v3-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
      {
        chapter: '1', verse: '2-3,5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }, { 'text': '3', 'type': 'verse' }, { 'text': 'v3-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
      {
        chapter: '1', verse: '2,4-5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-Content', 'type': 'text' }, { 'text': '4', 'type': 'verse' }, { 'text': 'v4-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2' },
      },
    ];

    for (const test of tests) {
      let {
        chapter, verse, expected,
      } = test;
      const results = verseHelpers.getVerseData(bibleData, chapter, verse, createMarker);

      const results_ = { verseData: results.verseData, verseLabel: results.verseLabel };

      if (!isEqual(results_, expected)) {
        console.log(`compare failed for ${chapter}:${verse}`);
        expect(results).toEqual(expected);
      }
    }
  });

  it('test multiple cases with verse spans in data', () => {
    const chapter1 = {
      '1': 'v1-Content',
      '2-3': 'v2-3-Content',
      '4': 'v4-Content',
      '5': 'v5-Content',
    };
    const bibleData = { '1': chapter1 };
    const tests = [
      {
        chapter: 1, verse: 1, expected: { 'verseData': { 'verseObjects': [{ 'text': 'v1-Content', 'type': 'text' }] }, 'verseLabel': '1' },
      },
      {
        chapter: '1', verse: '2', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2-3', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2,3', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2-3,5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2,4-5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }, { 'text': '4', 'type': 'verse' }, { 'text': 'v4-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2,3,4,5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }, { 'text': '4', 'type': 'verse' }, { 'text': 'v4-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '2-5', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v2-3-Content', 'type': 'text' }, { 'text': '4', 'type': 'verse' }, { 'text': 'v4-Content', 'type': 'text' }, { 'text': '5', 'type': 'verse' }, { 'text': 'v5-Content', 'type': 'text' }] }, 'verseLabel': '2-3' },
      },
      {
        chapter: '1', verse: '1-4', expected: { 'verseData': { 'verseObjects': [{ 'text': 'v1-Content', 'type': 'text' }, { 'text': '2-3', 'type': 'verse' }, { 'text': 'v2-3-Content', 'type': 'text' }, { 'text': '4', 'type': 'verse' }, { 'text': 'v4-Content', 'type': 'text' }] }, 'verseLabel': '1' },
      },
    ];

    for (const test of tests) {
      let {
        chapter, verse, expected,
      } = test;
      const results = verseHelpers.getVerseData(bibleData, chapter, verse, createMarker);

      const results_ = { verseData: results.verseData, verseLabel: results.verseLabel };

      if (!isEqual(results_, expected)) {
        console.log(`compare failed for ${chapter}:${verse}`);
        expect(results).toEqual(expected);
      }
    }
  });
});

describe('verseHelpers.verseArray', () => {
  it('should succeed with heb-12-27.el-x-koine', () => {
    generateTest('heb-12-27.el-x-koine', 'ugnt');
  });
  it('should succeed with heb-12-27.el-x-koine and tisch should not be clickable', () => {
    generateTest('heb-12-27.el-x-koine', 'tisch');
  });
  it('should succeed with mat-4-6', () => {
    generateTest('mat-4-6', 'ult');
  });
  it('should succeed with luke-22-30.ult', () => {
    const contextId = {
      'reference': {
        'bookId': 'luk',
        'chapter': 22,
        'verse': 30,
      },
      'tool': 'translationWords',
      'groupId': '12tribesofisrael',
      'quote': [
        {
          'word': 'δώδεκα',
          'occurrence': 1,
        },
        {
          'word': 'φυλὰς',
          'occurrence': 1,
        },
        {
          'word': 'κρίνοντες',
          'occurrence': 1,
        },
        {
          'word': 'τοῦ',
          'occurrence': 1,
        },
        {
          'word': 'Ἰσραήλ',
          'occurrence': 1,
        },
      ],
      'strong': [
        'G14270',
        'G54430',
        'G29190',
        'G35880',
        'G24740',
      ],
      'occurrence': 1,
    };
    generateTest('luke-22-30.ult', 'ult', contextId);
  });
  it('should succeed with jhn-6-21-en-t4t', () => {
    generateTest('jhn-6-21-en-t4t', 't4t');
  });
});

describe('verseHelpers.isVerseInSpan', () => {
  it('should return false if verseLabel not span', () => {
    // given
    const verseLabel = '1';
    const verse = '1';
    const expect_isVerseSpan = false;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
  });

  it('should return false if verseLabel number', () => {
    // given
    const verseLabel = 1;
    const verse = '1';
    const expect_isVerseSpan = false;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
  });

  it('should return false if verseLabel other text', () => {
    // given
    const verseLabel = 'front';
    const verse = '1';
    const expect_isVerseSpan = false;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
  });

  it('should return true if verseLabel span and verse is number', () => {
    // given
    const verseLabel = '1-2';
    const verse = 1;
    const expect_isVerseSpan = true;
    const expect_isFirstVerse = true;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
    expect(results.isFirstVerse).toEqual(expect_isFirstVerse);
  });

  it('should return true if verseLabel span and verse is number', () => {
    // given
    const verseLabel = '1-2';
    const verse = '1';
    const expect_isVerseSpan = true;
    const expect_isFirstVerse = true;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
    expect(results.isFirstVerse).toEqual(expect_isFirstVerse);
  });

  it('should return true if verseLabel span and verse is not first', () => {
    // given
    const verseLabel = '1-2';
    const verse = '2';
    const expect_isVerseSpan = true;
    const expect_isFirstVerse = false;

    // when
    const results = verseHelpers.isVerseInSpan(verseLabel, verse);

    // then
    expect(results.isVerseSpan).toEqual(expect_isVerseSpan);
    expect(results.isFirstVerse).toEqual(expect_isFirstVerse);
  });
});

describe('verseHelpers.getVerseSpanRange', () => {
  it('should return no range if single verse', () => {
    // given
    const verseIndex = '1';
    const expect_range = {};

    // when
    const results = verseHelpers.getVerseSpanRange(verseIndex);

    // then
    expect(results).toEqual(expect_range);
  });

  it('should return no range if not verse', () => {
    // given
    const verseIndex = 'front';
    const expect_range = {};

    // when
    const results = verseHelpers.getVerseSpanRange(verseIndex);

    // then
    expect(results).toEqual(expect_range);
  });

  it('should return no range if incomplete', () => {
    // given
    const verseIndex = '1-';
    const expect_range = {};

    // when
    const results = verseHelpers.getVerseSpanRange(verseIndex);

    // then
    expect(results).toEqual(expect_range);
  });

  it('should return no range if incomplete #2', () => {
    // given
    const verseIndex = '-2';
    const expect_range = {};

    // when
    const results = verseHelpers.getVerseSpanRange(verseIndex);

    // then
    expect(results).toEqual(expect_range);
  });

  it('should return range', () => {
    // given
    const verseIndex = '5-10';
    const expect_range = {
      low: 5,
      high: 10,
    };

    // when
    const results = verseHelpers.getVerseSpanRange(verseIndex);

    // then
    expect(results).toEqual(expect_range);
  });
});

describe('verseHelpers.createVerseMarker', () => {
  it('should succeed with string verse', () => {
    // given
    const verse = '1';
    const expected_html = <><br/><b>{verse}</b> </>;
    const expected_results = {
      html: expected_html,
      type: 'html',
      text: '',
    };

    // when
    const results = verseHelpers.createVerseMarker(verse);

    // then
    expect(results).toEqual(expected_results);
  });

  it('should succeed with numerical verse', () => {
    // given
    const verse = 1;
    const expected_html = <><br/><b>{verse}</b> </>;
    const expected_results = {
      html: expected_html,
      type: 'html',
      text: '',
    };

    // when
    const results = verseHelpers.createVerseMarker(verse);

    // then
    expect(results).toEqual(expected_results);
  });
});

//
// helpers
//

/**
 * Reads a usfm file from the resources dir
 * @param {string} filePath relative path to usfm file
 * @return {string} sdv
 */
export const readUSFM = filePath => {
  const fullPath = path.join('./src/tc_ui_toolkit/ScripturePane/helpers/__test__/fixtures', filePath);
  console.log(path.resolve(fullPath));
  return fs.readFileSync(fullPath, 'UTF-8').toString();
};

/**
 * Reads a json file from the resources dir
 * @param {string} filePath relative path to json file
 * @return {object} json object
 */
export const readJSON = filePath => JSON.parse(readUSFM(filePath));

/**
 * Generator for testing json to usfm migration
 * @param {string} name - the name of the test files to use. e.g. `valid` will test `valid.usfm` to `valid.json`
 * @param {string} bibleId
 * @param {Object} contextId
 */
const generateTest = (name, bibleId, contextId='') => {
  const input = readJSON(`${name}.json`);
  contextId = contextId || name;
  expect(input).toBeTruthy();
  // const expectedBaseName = expectedName ? expectedName : name;
  // const expected = readUSFM(`${expectedBaseName}.usfm`);
  // expect(expected).toBeTruthy();
  const output = verseHelpers.verseArray(input, bibleId, contextId);
  expect(output).toMatchSnapshot();
};
