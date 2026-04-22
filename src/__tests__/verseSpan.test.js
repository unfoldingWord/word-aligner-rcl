/* eslint-disable array-callback-return */
import { verseHelpers } from "word-aligner-lib"
import {getParsedUSFM, usfmVerseToJson} from "../helpers/usfmHelpers";
import {
  convertAlignmentsFromVerseSpansToVerse,
  convertAlignmentFromVerseToVerseSpan,
} from "../helpers/alignmentHelpers";
import {convertVerseDataToUSFM } from "../helpers/UsfmFileConversionHelpers";
import { expect } from '@jest/globals'

const en_ust_gal_2_data = require(`./fixtures/alignments/en_gal_2_data.json`);
const en_ust_gal_2_usfm = en_ust_gal_2_data.ust_usfm;
const en_ust_gal_2_no_alignments_usfm = en_ust_gal_2_data.ust_usfm_no_alignments;
const en_ust_gal_2_partial_alignments_usfm = en_ust_gal_2_data.ust_usfm_partial_alignments;
const ugnt_gal_2_verseObjects = en_ust_gal_2_data.ugnt_verseObjects;
const en_ust_gal_2_verseObjects = getParsedUSFM(en_ust_gal_2_usfm);
const en_ust_gal_2_no_alignments_verseObjects = getParsedUSFM(en_ust_gal_2_no_alignments_usfm);
const en_ust_gal_2_partial_alignments_verseObjects = getParsedUSFM(en_ust_gal_2_partial_alignments_usfm);

describe('verseSpan ', () => {

  it('test getVerse()', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    const en_ust_gal_2_11_to_13 = verseHelpers.getVerse(en_ust_gal_2_verseObjects.chapters[chapter], verseSpan);
    expect(en_ust_gal_2_11_to_13).toMatchSnapshot();
  })

  it('test getBestVerseFromChapter()', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    const en_ust_gal_2_11_to_13 = verseHelpers.getBestVerseFromChapter(en_ust_gal_2_verseObjects, chapter, verseSpan);
    expect(en_ust_gal_2_11_to_13).toMatchSnapshot();
  })
})

describe('test verseSpans round trip conversions', () => {

  it('check verse span support for alignments', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    const en_ust_gal_2_11_to_13 = en_ust_gal_2_verseObjects.chapters[chapter][verseSpan];

    const targetLanguageVerse = en_ust_gal_2_11_to_13;
    const originalLanguageChapterData = ugnt_gal_2_verseObjects;
    const { alignedTargetVerseObjects, originalLanguageVerseObjects } = convertAlignmentFromVerseToVerseSpan(targetLanguageVerse, originalLanguageChapterData, chapter, verseSpan);
    expect(originalLanguageVerseObjects.verseObjects.length).toBeTruthy();
    expect(alignedTargetVerseObjects.verseObjects.length).toBeTruthy();

    const finalUSFM = convertAlignmentsFromVerseSpansToVerse(originalLanguageChapterData, alignedTargetVerseObjects, chapter, verseSpan);
    expect(finalUSFM).toEqual(convertVerseDataToUSFM(en_ust_gal_2_11_to_13))
  });

  it('check verse span support for no alignments', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    const en_ust_gal_2_11_to_13 = en_ust_gal_2_no_alignments_verseObjects.chapters[chapter][verseSpan];

    const targetLanguageVerse = en_ust_gal_2_11_to_13;
    const originalLanguageChapterData = ugnt_gal_2_verseObjects;
    const { alignedTargetVerseObjects, originalLanguageVerseObjects } = convertAlignmentFromVerseToVerseSpan(targetLanguageVerse, originalLanguageChapterData, chapter, verseSpan);
    expect(originalLanguageVerseObjects.verseObjects.length).toBeTruthy();
    expect(alignedTargetVerseObjects.verseObjects.length).toBeTruthy();

    const finalUSFM = convertAlignmentsFromVerseSpansToVerse(originalLanguageChapterData, alignedTargetVerseObjects, chapter, verseSpan);
    expect(finalUSFM).toEqual(convertVerseDataToUSFM(en_ust_gal_2_11_to_13))
  });

  it('check verse span support for partial alignments', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    const en_ust_gal_2_11_to_13 = en_ust_gal_2_partial_alignments_verseObjects.chapters[chapter][verseSpan];

    const targetLanguageVerse = en_ust_gal_2_11_to_13;
    const originalLanguageChapterData = ugnt_gal_2_verseObjects;
    const { alignedTargetVerseObjects, originalLanguageVerseObjects } = convertAlignmentFromVerseToVerseSpan(targetLanguageVerse, originalLanguageChapterData, chapter, verseSpan);
    expect(originalLanguageVerseObjects.verseObjects.length).toBeTruthy();
    expect(alignedTargetVerseObjects.verseObjects.length).toBeTruthy();

    const finalUSFM = convertAlignmentsFromVerseSpansToVerse(originalLanguageChapterData, alignedTargetVerseObjects, chapter, verseSpan);
    expect(finalUSFM).toEqual(convertVerseDataToUSFM(en_ust_gal_2_11_to_13))
  });
});

//
// Helpers
//

