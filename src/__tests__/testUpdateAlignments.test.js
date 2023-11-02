/* eslint-env jest */
import _ from 'lodash';
// import {describe, expect, test} from '@jest/globals'
import {
  areAlgnmentsComplete,
  extractAlignmentsFromTargetVerse,
  parseUsfmToWordAlignerData,
  updateAlignmentsToTargetVerse
} from "../utils/alignmentHelpers";
import {removeUsfmMarkers, usfmVerseToJson} from "../utils/usfmHelpers";
import Lexer from "wordmap-lexer";
import {migrateTargetAlignmentsToOriginal} from "../utils/migrateOriginalLanguageHelpers";
import {getUsfmForVerseContent} from "../utils/UsfmFileConversionHelpers";
import path from "path-extra";
import fs from 'fs-extra';

jest.unmock('fs-extra');

const initialText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\\p\n';
const alignedInitialVerseText = '\\zaln-s |x-strong="G51030" x-lemma="Τίτος" x-morph="Gr,N,,,,,DMS," x-occurrence="1" x-occurrences="1" x-content="Τίτῳ"\\*\\w I|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w am|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w writing|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w to|x-occurrence="1" x-occurrences="5"\\w*\n' +
  '\\w you|x-occurrence="1" x-occurrences="4"\\w*,\n' +
  '\\w Titus|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*;\n' +
  '\\zaln-s |x-strong="G11030" x-lemma="γνήσιος" x-morph="Gr,AA,,,,DNS," x-occurrence="1" x-occurrences="1" x-content="γνησίῳ"\\*\\w you|x-occurrence="2" x-occurrences="4"\\w*\n' +
  '\\w have|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w become|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w like|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w a|x-occurrence="1" x-occurrences="2"\\w*\n' +
  '\\w real|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G50430" x-lemma="τέκνον" x-morph="Gr,N,,,,,DNS," x-occurrence="1" x-occurrences="1" x-content="τέκνῳ"\\*\\w son|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w to|x-occurrence="2" x-occurrences="5"\\w*\n' +
  '\\w me|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G25960" x-lemma="κατά" x-morph="Gr,P,,,,,A,,," x-occurrence="1" x-occurrences="1" x-content="κατὰ"\\*\\w because|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G28390" x-lemma="κοινός" x-morph="Gr,AA,,,,AFS," x-occurrence="1" x-occurrences="1" x-content="κοινὴν"\\*\\w we|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w both|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w now|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G41020" x-lemma="πίστις" x-morph="Gr,N,,,,,AFS," x-occurrence="1" x-occurrences="1" x-content="πίστιν"\\*\\w believe|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w in|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w Jesus|x-occurrence="1" x-occurrences="2"\\w*\n' +
  '\\w the|x-occurrence="1" x-occurrences="3"\\w*\n' +
  '\\w Messiah|x-occurrence="1" x-occurrences="2"\\w*\\zaln-e\\*.\n' +
  '\\zaln-s |x-strong="G05750" x-lemma="ἀπό" x-morph="Gr,P,,,,,G,,," x-occurrence="1" x-occurrences="1" x-content="ἀπὸ"\\*\\zaln-s |x-strong="G23160" x-lemma="θεός" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Θεοῦ"\\*\\w May|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w God|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G39620" x-lemma="πατήρ" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Πατρὸς"\\*\\w the|x-occurrence="2" x-occurrences="3"\\w*\n' +
  '\\w Father|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G25320" x-lemma="καί" x-morph="Gr,CC,,,,,,,," x-occurrence="1" x-occurrences="2" x-content="καὶ"\\*\\w and|x-occurrence="1" x-occurrences="2"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G55470" x-lemma="χριστός" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Χριστοῦ"\\*\\w the|x-occurrence="3" x-occurrences="3"\\w*\n' +
  '\\w Messiah|x-occurrence="2" x-occurrences="2"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G24240" x-lemma="Ἰησοῦς" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Ἰησοῦ"\\*\\w Jesus|x-occurrence="2" x-occurrences="2"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G35880" x-lemma="ὁ" x-morph="Gr,EA,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="τοῦ"\\*\\w who|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G49900" x-lemma="σωτήρ" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Σωτῆρος"\\*\\w saves|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G14730" x-lemma="ἐγώ" x-morph="Gr,RP,,,1G,P," x-occurrence="1" x-occurrences="1" x-content="ἡμῶν"\\*\\w us|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G54850" x-lemma="χάρις" x-morph="Gr,N,,,,,NFS," x-occurrence="1" x-occurrences="1" x-content="χάρις"\\*\\w continue|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w to|x-occurrence="3" x-occurrences="5"\\w*\n' +
  '\\w be|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w kind|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w to|x-occurrence="4" x-occurrences="5"\\w*\n' +
  '\\w you|x-occurrence="3" x-occurrences="4"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G25320" x-lemma="καί" x-morph="Gr,CC,,,,,,,," x-occurrence="2" x-occurrences="2" x-content="καὶ"\\*\\w and|x-occurrence="2" x-occurrences="2"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="G15150" x-lemma="εἰρήνη" x-morph="Gr,N,,,,,NFS," x-occurrence="1" x-occurrences="1" x-content="εἰρήνη"\\*\\w to|x-occurrence="5" x-occurrences="5"\\w*\n' +
  '\\w give|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w you|x-occurrence="4" x-occurrences="4"\\w*\n' +
  '\\w a|x-occurrence="2" x-occurrences="2"\\w*\n' +
  '\\w peaceful|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w spirit|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*.\n' +
  '\\p\n'
const initialVerseObjects_ = usfmVerseToJson(alignedInitialVerseText);

const simpleUpdatesPath = path.join(__dirname, './fixtures/alignments/simpleUpdatesTests.json');
const simpleUpdatesTests = {}

function addSimpleTest(testName, initialAlignedUsfm, initialEditText, newEditText, expectedFinalUsfm) {
  let test = simpleUpdatesTests[testName]
  if (!test) { // if first in a series
    test = {
      initialAlignedUsfm,
      initialEditText,
      steps: [
        {newEditText, expectedFinalUsfm}
      ]
    }
    simpleUpdatesTests[testName] = test
  } else {
   test.steps.push(
      {newEditText, expectedFinalUsfm}
    )
  }
  const output = JSON.stringify(simpleUpdatesTests, null, 2)
  fs.writeFileSync(simpleUpdatesPath, output, 'utf8') // update tests fixture
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

describe.skip('testing alignment updates', () => {
  test('should pass alignment unchanged', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = initialText;
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results.targetVerseText).toEqual(alignedInitialVerseText)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('edit text unchanged', alignedInitialVerseText, initialText, newText, alignedInitialVerseText)
  });

  test('should pass alignment with "to" added', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = initialText + ' to';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results).toMatchSnapshot()
    addSimpleTest('"to" added to end', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with "spirit" changed to "heart"', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful heart.\n\\p\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
    addSimpleTest('"spirit" changed to "heart"', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with "to" moved', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\\p\n to';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
    addSimpleTest('"to" moved', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with "to" renamed to "too"', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son too me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\\p\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
    addSimpleTest('"to" renamed to "too"', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with half of verse deleted', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah.';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
    addSimpleTest('half of verse deleted', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with half of verse replaced', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah.  How are you doing man? Wish I could come see you';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
    addSimpleTest('half of verse replaced', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with all text removed', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = '';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = '';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('all text removed', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with unaligned initial verse', () => {
    const initialText = 'unaligned verse';
    const initialVerseObjects = usfmVerseToJson(initialText);
    const newText = initialText;
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = '\\w unaligned|x-occurrence=\"1\" x-occurrences=\"1\"\\w*\n\\w verse|x-occurrence=\"1\" x-occurrences=\"1\"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('unaligned initial verse', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with unaligned initial verse and changed', () => {
    const initialVerseObjects = usfmVerseToJson('unaligned verse');
    const newText = 'furby furry';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = '\\w furby|x-occurrence=\"1\" x-occurrences=\"1\"\\w*\n\\w furry|x-occurrence=\"1\" x-occurrences=\"1\"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('unaligned initial verse and changed', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with "\\p" removed', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results).toMatchSnapshot()
    addSimpleTest('"\\p" removed', alignedInitialVerseText, initialText, newText, results.targetVerseText)
  });

  test('should pass alignment with "zzz" added', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = initialText + ' zzz';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="1"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('"zzz" added to end', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with "zzz" added twice', () => {

    // add first word
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    let newText = initialText + ' zzz';
    let results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    let expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="1"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    let initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    let { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('"zzz" added to end twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)

    // add second word
    newText = newText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="2"\\w*\n\\w zzz|x-occurrence="2" x-occurrences="2"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    addSimpleTest('"zzz" added to end twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with "zzz" added twice and removed twice', () => {

    // add first word
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    let newText = initialText + ' zzz';
    let results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    let expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="1"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    let initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    let { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('"zzz" added to end twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)

    // add second word
    newText = newText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="2"\\w*\n\\w zzz|x-occurrence="2" x-occurrences="2"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    addSimpleTest('"zzz" added to end twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)

    // remove second word
    newText = initialText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="1"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    addSimpleTest('"zzz" added to end twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)

    // remove first word
    newText = initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText;
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    addSimpleTest('"zzz" added to end twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

  test('should pass alignment with "I" prefixed twice and removed twice', () => {
    // this tests adding a word that is already in the target text

    // add first word
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    let newText = 'I ' + initialText;
    let results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign1 = alignedInitialVerseText.replace(
        "\\w I|x-occurrence=\"1\" x-occurrences=\"1\"\\w*\n\\w am|x-occurrence=\"1\" x-occurrences=\"1\"\\w*",
        "\\w I|x-occurrence=\"1\" x-occurrences=\"2\"\\w*\\zaln-e\\*\n\\w I|x-occurrence=\"2\" x-occurrences=\"2\"\\w*\n" +
        "\\zaln-s |x-strong=\"G51030\" x-lemma=\"Τίτος\" x-morph=\"Gr,N,,,,,DMS,\" x-occurrence=\"1\" x-occurrences=\"1\" x-content=\"Τίτῳ\"\\*\\w am|x-occurrence=\"1\" x-occurrences=\"1\"\\w*")
    expect(results.targetVerseText).toEqual(expectedFinalAlign1)
    let initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    let { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
    addSimpleTest('"I" prefixed twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign1)

    // add second word
    newText = 'I ' + newText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    const expectedFinalAlign2 = alignedInitialVerseText.replace(
        "\\w I|x-occurrence=\"1\" x-occurrences=\"1\"\\w*\n\\w am|x-occurrence=\"1\" x-occurrences=\"1\"\\w*",
        "\\w I|x-occurrence=\"1\" x-occurrences=\"3\"\\w*\\zaln-e\\*\n" +
        "\\w I|x-occurrence=\"2\" x-occurrences=\"3\"\\w*\n" +
        "\\w I|x-occurrence=\"3\" x-occurrences=\"3\"\\w*\n" +
        "\\zaln-s |x-strong=\"G51030\" x-lemma=\"Τίτος\" x-morph=\"Gr,N,,,,,DMS,\" x-occurrence=\"1\" x-occurrences=\"1\" x-content=\"Τίτῳ\"\\*\\w am|x-occurrence=\"1\" x-occurrences=\"1\"\\w*")
    expect(results.targetVerseText).toEqual(expectedFinalAlign2)
    addSimpleTest('"I" prefixed twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign2)

    // remove second word
    newText = 'I ' + initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expect(results.targetVerseText).toEqual(expectedFinalAlign1)
    addSimpleTest('"I" prefixed twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign1)

    // remove first word
    newText = initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
    addSimpleTest('"I" prefixed twice and removed twice', alignedInitialVerseText, initialText, newText, expectedFinalAlign)
  });

});

const psa_73_5_newVerseText = 'They do not experience the difficult things that other people do;\n' +
  '\\q2 they do not experience catastrophes and sicknesses like other people.\n' +
  '\n' +
  '\\ts\\*\n' +
  '\\q1 ';
const psa_73_5_bareVerseText = 'They do not have the troubles that other people have;\n' +
'\\q2 they do not have problems as others do.\n';
const psa_73_5_alignedInitialVerseText = '\\zaln-s |x-strong="H0369" x-lemma="אַיִן" x-morph="He,Tn:Sp3mp" x-occurrence="1" x-occurrences="1" x-content="אֵינֵ֑⁠מוֹ"\\*\\w They|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w do|x-occurrence="1" x-occurrences="3"\\w*\n' +
  '\\w not|x-occurrence="1" x-occurrences="2"\\w*\n' +
  '\\w have|x-occurrence="1" x-occurrences="3"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="b:H5999" x-lemma="עָמָל" x-morph="He,R:Ncbsc" x-occurrence="1" x-occurrences="1" x-content="בַּ⁠עֲמַ֣ל"\\*\\w the|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w troubles|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="c:H5973a" x-lemma="עִם" x-morph="He,C:R" x-occurrence="1" x-occurrences="1" x-content="וְ⁠עִם"\\*\\w that|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="H0582" x-lemma="אֱנוֹשׁ" x-morph="He,Ncmsa" x-occurrence="1" x-occurrences="1" x-content="אֱנ֣וֹשׁ"\\*\\w other|x-occurrence="1" x-occurrences="1"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="H0120" x-lemma="אָדָם" x-morph="He,Ncmsa" x-occurrence="1" x-occurrences="1" x-content="אָ֝דָ֗ם"\\*\\w people|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w have|x-occurrence="2" x-occurrences="3"\\w*\\zaln-e\\*;\n' +
  '\\q2 \\zaln-s |x-strong="H3808" x-lemma="לֹא" x-morph="He,Tn" x-occurrence="1" x-occurrences="1" x-content="לֹ֣א"\\*\\w they|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w do|x-occurrence="2" x-occurrences="3"\\w*\n' +
  '\\w not|x-occurrence="2" x-occurrences="2"\\w*\\zaln-e\\*\n' +
  '\\zaln-s |x-strong="H5060" x-lemma="נָגַע" x-morph="He,VPi3mp" x-occurrence="1" x-occurrences="1" x-content="יְנֻגָּֽעוּ"\\*\\w have|x-occurrence="3" x-occurrences="3"\\w*\n' +
  '\\w problems|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w as|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w others|x-occurrence="1" x-occurrences="1"\\w*\n' +
  '\\w do|x-occurrence="3" x-occurrences="3"\\w*\\zaln-e\\*.\n'
const psa_73_5_originalVerseText =
  '\\w בַּ⁠עֲמַ֣ל|lemma="עָמָל" strong="b:H5999" x-morph="He,R:Ncbsc"\\w*\n' +
  '\\w אֱנ֣וֹשׁ|lemma="אֱנוֹשׁ" strong="H0582" x-morph="He,Ncmsa"\\w*\n' +
  '\\w אֵינֵ֑⁠מוֹ|lemma="אַיִן" strong="H0369" x-morph="He,Tn:Sp3mp"\\w*\n' +
  '\\w וְ⁠עִם|lemma="עִם" strong="c:H5973a" x-morph="He,C:R"\\w*־\\w אָ֝דָ֗ם|lemma="אָדָם" strong="H0120" x-morph="He,Ncmsa"\\w*\n' +
  '\\w לֹ֣א|lemma="לֹא" strong="H3808" x-morph="He,Tn"\\w*\n' +
  '\\w יְנֻגָּֽעוּ|lemma="נָגַע" strong="H5060" x-morph="He,VPi3mp"\\w*׃\n';


describe('testing alignment updates with original language', () => {
  test('should handle alignment with major edit', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText
    const newText = psa_73_5_newVerseText;
    const expectInitialAlignmentsValid = true
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = false;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle invalid alignment with major edit', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-content="אָ֝דָ֗ם"', 'x-content="אָ֝��ָ֗ם"');
    expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
    const _invalidCharacterFound = initialAlignment.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(_invalidCharacterFound).toBeTruthy()

    const expectInitialAlignmentsValid = false
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = true;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(invalidCharacterFound).toBeFalsy()
    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle alignment with major reset', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText
    const newText = "";
    const expectInitialAlignmentsValid = true
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = false;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle alignment with major reset to different word', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText
    const newText = "stuff";
    const expectInitialAlignmentsValid = true
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = false;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle alignment with major reset to included word', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText
    const newText = "do";
    const expectInitialAlignmentsValid = true
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = false;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle invalid alignment with major reset', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-content="אָ֝דָ֗ם"', 'x-content="אָ֝��ָ֗ם"');
    expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
    const _invalidCharacterFound = initialAlignment.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(_invalidCharacterFound).toBeTruthy()

    const expectInitialAlignmentsValid = false
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = true;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = "";
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(invalidCharacterFound).toBeFalsy()
    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should normalize invalid alignment with no edit', () => {

    ////////////
    // given

    const initialOriginalAlignment = 'x-content="אָ֝דָ֗ם"'
    const newOriginalAlignment = initialOriginalAlignment.replace('\u05B8\u0597', '\u0597\u05B8')
    expect(initialOriginalAlignment).not.toEqual(newOriginalAlignment)
    const initialAlignment = psa_73_5_alignedInitialVerseText.replace(initialOriginalAlignment, newOriginalAlignment);
    expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
    const expectInitialAlignmentsValid = false
    const expectFinalAlignmentsValid = true;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const bareTargetText = getUsfmForVerseContent({ verseObjects: initialVerseObjects})
    const expectMigration = true;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = bareTargetText;

    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should normalize invalid alignment with major edit', () => {

    ////////////
    // given

    const initialOriginalAlignment = 'x-content="אָ֝דָ֗ם"'
    const newOriginalAlignment = initialOriginalAlignment.replace('\u05B8\u0597', '\u0597\u05B8')
    expect(initialOriginalAlignment).not.toEqual(newOriginalAlignment)
    const initialAlignment = psa_73_5_alignedInitialVerseText.replace(initialOriginalAlignment, newOriginalAlignment);
    expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)
    const expectInitialAlignmentsValid = false
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = true;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = psa_73_5_newVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(invalidCharacterFound).toBeFalsy()
    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle alignment with no text change', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText;
    const expectInitialAlignmentsValid = true
    const expectFinalAlignmentsValid = true;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = false;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = psa_73_5_bareVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(invalidCharacterFound).toBeFalsy()
    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });

  test('should handle invalid alignment with occurrence change', () => {

    ////////////
    // given

    const initialAlignment = psa_73_5_alignedInitialVerseText.replace('x-occurrence="1" x-occurrences="1" x-content="אָ֝דָ֗ם"', 'x-occurrence="2" x-occurrences="2" x-content="אָ֝דָ֗ם"');
    expect(initialAlignment).not.toEqual(psa_73_5_alignedInitialVerseText)

    const expectInitialAlignmentsValid = false
    const expectFinalAlignmentsValid = false;
    const {
      initialVerseObjects,
      originalLanguageVerseObjects,
      areInitialAlignmentsComplete
    } = getVerseObjectsFromUsfms(initialAlignment);
    const expectedOriginalWords = getWordCountFromVerseObjects(originalLanguageVerseObjects)
    const expectMigration = true;

    ////////////
    // when

    // migrate the initial alignments to current original source
    const targetVerseObjects = migrateTargetAlignmentsToOriginal(initialVerseObjects, originalLanguageVerseObjects)

    // apply edited text
    const newText = psa_73_5_bareVerseText;
    const results = updateAlignmentsToTargetVerse(targetVerseObjects, newText)

    ////////////
    // then

    const invalidCharacterFound = results.targetVerseText.indexOf('�') >= 0; // this should not be found, because word is not in original language
    expect(invalidCharacterFound).toBeFalsy()
    validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration);
    validateFinalAlignment(areInitialAlignmentsComplete, expectInitialAlignmentsValid, results, newText, expectedOriginalWords, expectFinalAlignmentsValid, originalLanguageVerseObjects);
  });
});

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

function validateMigrations(initialVerseObjects, targetVerseObjects, expectMigration) {
  const migratedAlignments = JSON.stringify(initialVerseObjects) !== JSON.stringify(targetVerseObjects)
  expect(migratedAlignments).toEqual(expectMigration)
}
