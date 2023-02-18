/* eslint-disable array-callback-return */
import _ from 'lodash';
import {getParsedUSFM, usfmVerseToJson} from "../utils/usfmHelpers";
import {
  convertAlignmentsFromVerseSpansToVerseSub,
  fixAlignmentsInVerseSpan,
  getRawAlignmentsForVerseSpan,
  parseUsfmToWordAlignerData
} from "../utils/alignmentHelpers";
import {convertAlignmentFromVerseToVerseSpanSub, convertVerseDataToUSFM} from "../utils/UsfmFileConversionHelpers";
import * as verseHelpers from "tc-ui-toolkit/lib/ScripturePane/helpers/verseHelpers";

const en_ust_gal_2_data = require(`./fixtures/alignments/en_gal_2_data.json`);
const en_ust_gal_2_usfm = en_ust_gal_2_data.ust_usfm;
const ugnt_gal_2_verseObjects = en_ust_gal_2_data.ugnt_verseObjects;
const en_ust_gal_2_verseObjects = getParsedUSFM(en_ust_gal_2_usfm);

describe('test verseSpans', () => {

  it('check verse span support for alignments', () => {
    const chapter = '2';
    const verseSpan = '11-13';
    let en_ust_gal_2_11_to_13 = en_ust_gal_2_verseObjects.chapters[chapter][verseSpan];

    const targetLanguageVerse = en_ust_gal_2_11_to_13;
    const originalLanguageChapterData = ugnt_gal_2_verseObjects;
    const { alignedTargetVerseObjects, originalLanguageVerseObjects } = fixAlignmentsInVerseSpan(targetLanguageVerse, originalLanguageChapterData, chapter, verseSpan);
    expect(originalLanguageVerseObjects.verseObjects.length).toBeTruthy();
    expect(alignedTargetVerseObjects.verseObjects.length).toBeTruthy();
    // expect(verseAlignments.length).toBeTruthy();

    const blankVerseAlignments = {};
    const {low, hi} = getRawAlignmentsForVerseSpan(verseSpan, originalLanguageChapterData, blankVerseAlignments);
    const verseSpanData = _.cloneDeep(alignedTargetVerseObjects)
    convertAlignmentsFromVerseSpansToVerseSub(verseSpanData, low, hi, blankVerseAlignments, chapter)
    expect(verseSpanData.verseObjects.length).toBeTruthy();
    const finalUSFM = convertVerseDataToUSFM(verseSpanData)
    expect(finalUSFM).toEqual(convertVerseDataToUSFM(en_ust_gal_2_11_to_13))
  });
});

//
// Helpers
//

