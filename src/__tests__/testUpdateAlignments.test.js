/* eslint-env jest */
import {describe, expect, test} from '@jest/globals'
import {
  areAlgnmentsComplete,
  extractAlignmentsFromTargetVerse,
  parseUsfmToWordAlignerData,
  updateAlignmentsToTargetVerse,
  updateAlignmentsToTargetVerseWithOriginal,
} from "../utils/alignmentHelpers";
import {removeUsfmMarkers, usfmVerseToJson} from "../utils/usfmHelpers";
import Lexer from "wordmap-lexer";
import {migrateTargetAlignmentsToOriginal} from "../utils/migrateOriginalLanguageHelpers";
import {convertVerseDataToUSFM, getUsfmForVerseContent} from "../utils/UsfmFileConversionHelpers";
import path from "path-extra";
import fs from 'fs-extra';

jest.unmock('fs-extra');

const simpleUpdatesPath = path.join(__dirname, './fixtures/alignments/simpleEditsTests.json');
const migrationUpdatesPath = path.join(__dirname, './fixtures/alignments/migrationEditsTests.json');
const editsTests = {}

function addMigrationTest(testName, initialAlignedUsfm, initialEditText, newEditText, expectedFinalUsfm, originalLanguageUsfm, migrationExpected) {
  let test = editsTests[testName]
  if (!test) { // if first in a series
    test = {
      initialAlignedUsfm,
      initialEditText,
      originalLanguageUsfm,
      steps: [ ]
    }
    editsTests[testName] = test
  }

  test.steps.push(
    {
      newEditText,
      expectedFinalUsfm,
      migrationExpected,
    }
  )

  const output = JSON.stringify(editsTests, null, 2)
  fs.writeFileSync(migrationUpdatesPath, output, 'utf8') // update tests fixture
}

describe('testing edit of aligned target text', () => {
  const tests = fs.readJsonSync(simpleUpdatesPath)
  const testNames = Object.keys(tests)
  // console.log(tests)
  for (const testName of testNames) {
    const test_ = tests[testName]
    test(`${testName}`, () => {
      let {
        initialAlignedUsfm,
        initialEditText,
        steps,
      } = test_

      let currentVerseObjects = usfmVerseToJson(initialAlignedUsfm); // set initial test conditions

      for (const step of steps) {
        ////////////
        // Given

        const {newEditText, expectedFinalUsfm} = step

        ////////////
        // When

        const results = updateAlignmentsToTargetVerse(currentVerseObjects, newEditText)

        ////////////
        // Then

        expect(results.targetVerseText).toEqual(expectedFinalUsfm)

        const initialWords = Lexer.tokenize(removeUsfmMarkers(newEditText))
        const { targetWords: targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null)
        expect(targetWords.length).toEqual(initialWords.length)

        // final conditions of step become initial conditions for next step
        currentVerseObjects = results.targetVerseObjects
      }
    })
  }
})

//
// const psa_73_5_newVerseText = 'They do not experience the difficult things that other people do;\n' +
//   '\\q2 they do not experience catastrophes and sicknesses like other people.\n' +
//   '\n' +
//   '\\ts\\*\n' +
//   '\\q1 ';
// const psa_73_5_bareVerseText = 'They do not have the troubles that other people have;\n' +
// '\\q2 they do not have problems as others do.\n';
// const psa_73_5_alignedInitialVerseText = '\\zaln-s |x-strong="H0369" x-lemma="אַיִן" x-morph="He,Tn:Sp3mp" x-occurrence="1" x-occurrences="1" x-content="אֵינֵ֑⁠מוֹ"\\*\\w They|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w do|x-occurrence="1" x-occurrences="3"\\w*\n' +
//   '\\w not|x-occurrence="1" x-occurrences="2"\\w*\n' +
//   '\\w have|x-occurrence="1" x-occurrences="3"\\w*\\zaln-e\\*\n' +
//   '\\zaln-s |x-strong="b:H5999" x-lemma="עָמָל" x-morph="He,R:Ncbsc" x-occurrence="1" x-occurrences="1" x-content="בַּ⁠עֲמַ֣ל"\\*\\w the|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w troubles|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
//   '\\zaln-s |x-strong="c:H5973a" x-lemma="עִם" x-morph="He,C:R" x-occurrence="1" x-occurrences="1" x-content="וְ⁠עִם"\\*\\w that|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
//   '\\zaln-s |x-strong="H0582" x-lemma="אֱנוֹשׁ" x-morph="He,Ncmsa" x-occurrence="1" x-occurrences="1" x-content="אֱנ֣וֹשׁ"\\*\\w other|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
//   '\\zaln-s |x-strong="H0120" x-lemma="אָדָם" x-morph="He,Ncmsa" x-occurrence="1" x-occurrences="1" x-content="אָ֝דָ֗ם"\\*\\w people|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w have|x-occurrence="2" x-occurrences="3"\\w*\\zaln-e\\*;\n' +
//   '\\q2 \\zaln-s |x-strong="H3808" x-lemma="לֹא" x-morph="He,Tn" x-occurrence="1" x-occurrences="1" x-content="לֹ֣א"\\*\\w they|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w do|x-occurrence="2" x-occurrences="3"\\w*\n' +
//   '\\w not|x-occurrence="2" x-occurrences="2"\\w*\\zaln-e\\*\n' +
//   '\\zaln-s |x-strong="H5060" x-lemma="נָגַע" x-morph="He,VPi3mp" x-occurrence="1" x-occurrences="1" x-content="יְנֻגָּֽעוּ"\\*\\w have|x-occurrence="3" x-occurrences="3"\\w*\n' +
//   '\\w problems|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w as|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w others|x-occurrence="1" x-occurrences="1"\\w*\n' +
//   '\\w do|x-occurrence="3" x-occurrences="3"\\w*\\zaln-e\\*.\n'
// const psa_73_5_originalVerseText =
//   '\\w בַּ⁠עֲמַ֣ל|lemma="עָמָל" strong="b:H5999" x-morph="He,R:Ncbsc"\\w*\n' +
//   '\\w אֱנ֣וֹשׁ|lemma="אֱנוֹשׁ" strong="H0582" x-morph="He,Ncmsa"\\w*\n' +
//   '\\w אֵינֵ֑⁠מוֹ|lemma="אַיִן" strong="H0369" x-morph="He,Tn:Sp3mp"\\w*\n' +
//   '\\w וְ⁠עִם|lemma="עִם" strong="c:H5973a" x-morph="He,C:R"\\w*־\\w אָ֝דָ֗ם|lemma="אָדָם" strong="H0120" x-morph="He,Ncmsa"\\w*\n' +
//   '\\w לֹ֣א|lemma="לֹא" strong="H3808" x-morph="He,Tn"\\w*\n' +
//   '\\w יְנֻגָּֽעוּ|lemma="נָגַע" strong="H5060" x-morph="He,VPi3mp"\\w*׃\n';
// const psa_73_5_originalLanguageVerseObjects = usfmVerseToJson(psa_73_5_originalVerseText)

describe('testing alignment migrations', () => {
  const tests = fs.readJsonSync(migrationUpdatesPath)
  const testNames = Object.keys(tests)
  // console.log(tests)
  for (const testName of testNames) {
    const test_ = tests[testName]
    test(`${testName}`, () => {
      let {
        initialAlignedUsfm,
        originalLanguageUsfm,
        steps,
      } = test_

      let currentVerseObjects = usfmVerseToJson(initialAlignedUsfm); // set initial test conditions
      const originalLanguageVerseObjects = usfmVerseToJson(originalLanguageUsfm); // set initial test conditions

      for (const step of steps) {

        ////////////
        // Given

        const {newEditText, migrationExpected} = step

        ////////////
        // When

        const targetVerseObjects = migrateTargetAlignmentsToOriginal(currentVerseObjects, originalLanguageVerseObjects)

        ////////////
        // Then

        validateMigrations(currentVerseObjects, targetVerseObjects, migrationExpected);
      }
    })
  }
})

describe('testing edits with original language validation', () => {
  const tests = fs.readJsonSync(migrationUpdatesPath)
  const testNames = Object.keys(tests)
  // console.log(tests)
  for (const testName of testNames) {
    const test_ = tests[testName]
    test(`${testName}`, () => {
      let {
        initialAlignedUsfm,
        initialEditText,
        originalLanguageUsfm,
        steps,
      } = test_

      let currentVerseObjects = usfmVerseToJson(initialAlignedUsfm); // set initial test conditions
      const originalLanguageVerseObjects = usfmVerseToJson(originalLanguageUsfm); // set initial test conditions

      for (const step of steps) {

        ////////////
        // Given

        const {newEditText, expectedFinalUsfm} = step
        const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)

        ////////////
        // when

        // apply edited text
        const results = updateAlignmentsToTargetVerseWithOriginal(currentVerseObjects, newEditText, originalLanguageVerseObjects)

        ////////////
        // then

        expect(results.targetVerseText).toEqual(expectedFinalUsfm)
      }
    })
  }
})

describe('testing edits with original language validation and using manual migration', () => {
  const tests = fs.readJsonSync(migrationUpdatesPath)
  const testNames = Object.keys(tests)
  // console.log(tests)
  for (const testName of testNames) {
    const test_ = tests[testName]
    test(`${testName}`, () => {
      let {
        initialAlignedUsfm,
        initialEditText,
        originalLanguageUsfm,
        steps,
      } = test_

      let currentVerseObjects = usfmVerseToJson(initialAlignedUsfm); // set initial test conditions
      const originalLanguageVerseObjects = usfmVerseToJson(originalLanguageUsfm); // set initial test conditions

      for (const step of steps) {

        ////////////
        // Given

        const {newEditText, expectedFinalUsfm} = step
        const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)

        ////////////
        // when

        // migrate the initial alignments to current original source
        const targetVerseObjects = migrateTargetAlignmentsToOriginal(currentVerseObjects, originalLanguageVerseObjects)

        // apply edited text
        const results = updateAlignmentsToTargetVerse(targetVerseObjects, newEditText)

        ////////////
        // then

        expect(results.targetVerseText).toEqual(expectedFinalUsfm)
      }
    })
  }
})

// describe('testing alignment updates with original language', () => {
//   test('should handle alignment with major edit', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText
//     const newText = psa_73_5_newVerseText;
//     const expectInitialAlignmentsValid = true
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = false;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text    const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('major edit', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   })
//
//   test('should handle invalid alignment with major edit', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-content="אָ֝דָ֗ם"', 'x-content="אָ֝��ָ֗ם"');
//     expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
//     const _invalidCharacterFound = initialAlignment.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(_invalidCharacterFound).toBeTruthy()
//
//     const expectInitialAlignmentsValid = false
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = true;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(invalidCharacterFound).toBeFalsy()
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('invalid alignment with major edit', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle alignment with major reset', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText
//     const newText = "";
//     const expectInitialAlignmentsValid = true
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = false;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text    const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('major reset', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle alignment with major reset to different word', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText
//     const newText = "stuff";
//     const expectInitialAlignmentsValid = true
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = false;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text    const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('major reset to different word', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle alignment with major reset to included word', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText
//     const newText = "do";
//     const expectInitialAlignmentsValid = true
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = false;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text    const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('major reset to included word', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle invalid alignment with major reset', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-content="אָ֝דָ֗ם"', 'x-content="אָ֝��ָ֗ם"');
//     expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
//     const _invalidCharacterFound = initialAlignment.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(_invalidCharacterFound).toBeTruthy()
//
//     const expectInitialAlignmentsValid = false
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = true;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = "";
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(invalidCharacterFound).toBeFalsy()
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('invalid alignment with major reset', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should normalize invalid alignment with no edit', () => {
//
//     ////////////
//     // given
//
//     const initialOriginalAlignment = 'x-content="אָ֝דָ֗ם"'
//     const newOriginalAlignment = initialOriginalAlignment.replace('\u05B8\u0597', '\u0597\u05B8')
//     expect(initialOriginalAlignment).not.toEqual(newOriginalAlignment)
//     const initialAlignment = psa_73_5_alignedInitialVerseText.replace(initialOriginalAlignment, newOriginalAlignment);
//     expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
//     const expectInitialAlignmentsValid = false
//     const expectFinalAlignmentsValid = true;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const bareTargetText = getUsfmForVerseContent({ verseObjects: initialVerseObjects})
//     const expectMigration = true;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = bareTargetText;
//
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('normalize invalid alignment with no edit', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should normalize invalid alignment with major edit', () => {
//
//     ////////////
//     // given
//
//     const initialOriginalAlignment = 'x-content="אָ֝דָ֗ם"'
//     const newOriginalAlignment = initialOriginalAlignment.replace('\u05B8\u0597', '\u0597\u05B8')
//     expect(initialOriginalAlignment).not.toEqual(newOriginalAlignment)
//     const initialAlignment = psa_73_5_alignedInitialVerseText.replace(initialOriginalAlignment, newOriginalAlignment);
//     expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
//     const expectInitialAlignmentsValid = false
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = true;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = psa_73_5_newVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(invalidCharacterFound).toBeFalsy()
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('normalize invalid alignment with major edit', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle alignment with no text change', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText;
//     const expectInitialAlignmentsValid = true
//     const expectFinalAlignmentsValid = true;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = false;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = psa_73_5_bareVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(invalidCharacterFound).toBeFalsy()
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('no text change', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
//
//   test('should handle invalid alignment with occurrence change', () => {
//
//     ////////////
//     // given
//
//     const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-occurrence="1" x-occurrences="1" x-content="אָ֝דָ֗ם"', 'x-occurrence="2" x-occurrences="2" x-content="אָ֝דָ֗ם"');
//     expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
//
//     const expectInitialAlignmentsValid = false
//     const expectFinalAlignmentsValid = false;
//     const originalLanguageVerseObjects = psa_73_5_originalLanguageVerseObjects;
//     const {
//       initialVerseObjects,
//       areInitialAlignmentsComplete
//     } = getVerseObjectsFromUsfms(initialAlignment);
//     const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
//     const expectMigration = true;
//
//     ////////////
//     // when
//
//     // migrate the initial alignments to current original source
//     const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)
//
//     // apply edited text
//     const newText = psa_73_5_bareVerseText;
//     const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)
//
//     ////////////
//     // then
//
//     const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
//     expect(invalidCharacterFound).toBeFalsy()
//     validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
//     validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
//     addMigrationTest('invalid alignment with occurrence change', initialAlignment, removeUsfmMarkers(initialAlignment), newText, results.targetVerseText, psa_73_5_originalVerseText, expectMigration)
//   });
// });

//////////////////////////////
// Testing Support functions
//////////////////////////////

function getWordCountFromVerseObjects(verseObjects) {
  let count = 0
  for (const vo of verseObjects) {
    if (vo?.type === 'word') {
      count++
    }
    if (vo?.children) {
      const _count = getWordCountFromVerseObjects(vo.children)
      count += _count
    }
  }
  return count
}

function getWordCountFromAlignments(verseAlignments) {
  let count = 0
  for (const alignment of verseAlignments) {
    if (alignment?.sourceNgram) {
      count += alignment?.sourceNgram?.length
    }
  }
  return count
}

function _areAlgnmentsComplete(targetVerseUSFM, originalVerseObjects) {
  const {
    alignments,
    wordBank
  } = extractAlignmentsFromTargetVerse(targetVerseUSFM, originalVerseObjects)
  return areAlgnmentsComplete(wordBank, alignments)
}

function getVerseObjectsFromUsfms(initialAlignment) {
  const initialVerseObjects = usfmVerseToJson(initialAlignment);
  const originalLanguageVerseObjects = usfmVerseToJson(psa_73_5_originalVerseText);
  const areInitialAlignmentsComplete = _areAlgnmentsComplete(initialAlignment, originalLanguageVerseObjects)
  return {initialVerseObjects, originalLanguageVerseObjects, areInitialAlignmentsComplete};
}

function validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects) {
  expect(areInitialAlignmentsComplete).toEqual(expectInitialAlignmentsValid)
  expect(results).toMatchSnapshot()
  const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
  const alignerResults = parseUsfmToWordAlignerData(results.targetVerseText, psa_73_5_originalVerseText);
  expect(alignerResults).toMatchSnapshot()
  const {targetWords, verseAlignments} = alignerResults;
  expect(targetWords.length).toEqual(initialWords.length)
  const finalOriginalWords = getWordCountFromAlignments(verseAlignments)
  expect(finalOriginalWords).toEqual(expectedOriginalWords)
  const areAlignmentsComplete = _areAlgnmentsComplete(results.targetVerseText, originalLanguageVerseObjects)
  expect(areAlignmentsComplete).toEqual(expectFinalAlignmentsValid)
}

function validateMigrations(initialVerseObjects, migratedVerseObjects, expectMigration) {
  const initialVerseText = convertVerseDataToUSFM({verseObjects: initialVerseObjects})
  const migratedVerseText = convertVerseDataToUSFM({verseObjects: migratedVerseObjects});
  if (expectMigration) {
    expect(migratedVerseText).not.toEqual(initialVerseText)
  } else {
    expect(migratedVerseText).toEqual(initialVerseText)
  }
}
