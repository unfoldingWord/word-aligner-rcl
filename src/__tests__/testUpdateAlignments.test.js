/* eslint-env jest */
import _ from 'lodash';
// import {describe, expect, test} from '@jest/globals'

import {parseUsfmToWordAlignerData, updateAlignmentsToTargetVerse} from "../utils/alignmentHelpers";
import {removeUsfmMarkers, usfmVerseToJson} from "../utils/usfmHelpers";
import Lexer from "wordmap-lexer";

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

describe('testing alignment updates', () => {
  test('should pass alignment unchanged', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = initialText;
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results.targetVerseText).toEqual(alignedInitialVerseText)
    const initialWords = Lexer.tokenize(removeUsfmMarkers(newText));
    const { targetWords } = parseUsfmToWordAlignerData(results.targetVerseText, null);
    expect(targetWords.length).toEqual(initialWords.length)
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

    // add second word
    newText = newText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="2"\\w*\n\\w zzz|x-occurrence="2" x-occurrences="2"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
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

    // add second word
    newText = newText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="2"\\w*\n\\w zzz|x-occurrence="2" x-occurrences="2"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)

    // remove second word
    newText = initialText + ' zzz';
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText + '\n\\w zzz|x-occurrence="1" x-occurrences="1"\\w*';
    expect(results.targetVerseText).toEqual(expectedFinalAlign)

    // remove first word
    newText = initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expectedFinalAlign = alignedInitialVerseText;
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
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

    // remove second word
    newText = 'I ' + initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    expect(results.targetVerseText).toEqual(expectedFinalAlign1)

    // remove first word
    newText = initialText;
    results = updateAlignmentsToTargetVerse(results.targetVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results.targetVerseText).toEqual(expectedFinalAlign)
  });

  test('should pass alignment with "to" added', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = initialText + ' to';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results).toMatchSnapshot()
  });

  test('should pass alignment with "spirit" changed to "heart"', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful heart.\n\\p\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
  });

  test('should pass alignment with "to" moved', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\\p\n to';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
  });

  test('should pass alignment with "to" renamed to "too"', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son too me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\\p\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
  });

  test('should pass alignment with half of verse deleted', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah.';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
  });

  test('should pass alignment with half of verse replaced', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah.  How are you doing man? Wish I could come see you';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    const expectedFinalAlign = alignedInitialVerseText;
    expect(results).toMatchSnapshot()
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
  });

  test('should pass alignment with "/p" removed', () => {
    const initialVerseObjects = _.cloneDeep(initialVerseObjects_);
    const newText = 'I am writing to you, Titus; you have become like a real son to me because we both now believe in Jesus the Messiah. May God the Father and the Messiah Jesus who saves us continue to be kind to you and to give you a peaceful spirit.\n\n';
    const results = updateAlignmentsToTargetVerse(initialVerseObjects, newText)
    expect(results).toMatchSnapshot()
  });
});

