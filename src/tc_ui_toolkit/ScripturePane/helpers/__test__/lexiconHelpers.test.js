/* eslint-env jest */
import fs from 'fs';
import path from 'path';
import ospath from 'ospath';
import * as lexiconHelpers from '../lexiconHelpers';

const RESOURCE_PATH = path.join(ospath.home(), 'translationCore', 'resources');
const OT_PATH = path.join(RESOURCE_PATH, 'hbo/bibles/uhb/v1.4.1');
const outputFolder = path.join(__dirname, 'fixtures/words');

export const BIBLE_BOOKS = {
  oldTestament: {
    'gen': 'Genesis',
    'exo': 'Exodus',
    'lev': 'Leviticus',
    'num': 'Numbers',
    'deu': 'Deuteronomy',
    'jos': 'Joshua',
    'jdg': 'Judges',
    'rut': 'Ruth',
    '1sa': '1 Samuel',
    '2sa': '2 Samuel',
    '1ki': '1 Kings',
    '2ki': '2 Kings',
    '1ch':'1 Chronicles',
    '2ch': '2 Chronicles',
    'ezr': 'Ezra',
    'neh': 'Nehemiah',
    'est': 'Esther',
    'job': 'Job',
    'psa': 'Psalms',
    'pro': 'Proverbs',
    'ecc': 'Ecclesiastes',
    'sng': 'Song of Solomon',
    'isa': 'Isaiah',
    'jer': 'Jeremiah',
    'lam': 'Lamentations',
    'ezk': 'Ezekiel',
    'dan': 'Daniel',
    'hos': 'Hosea',
    'jol': 'Joel',
    'amo': 'Amos',
    'oba': 'Obadiah',
    'jon': 'Jonah',
    'mic': 'Micah',
    'nam': 'Nahum',
    'hab': 'Habakkuk',
    'zep': 'Zephaniah',
    'hag': 'Haggai',
    'zec': 'Zechariah',
    'mal':'Malachi',
  },
  newTestament: {
    'mat': 'Matthew',
    'mrk': 'Mark',
    'luk': 'Luke',
    'jhn': 'John',
    'act': 'Acts',
    'rom': 'Romans',
    '1co': '1 Corinthians',
    '2co': '2 Corinthians',
    'gal': 'Galatians',
    'eph': 'Ephesians',
    'php': 'Philippians',
    'col': 'Colossians',
    '1th': '1 Thessalonians',
    '2th': '2 Thessalonians',
    '1ti': '1 Timothy',
    '2ti': '2 Timothy',
    'tit': 'Titus',
    'phm': 'Philemon',
    'heb': 'Hebrews',
    'jas': 'James',
    '1pe': '1 Peter',
    '2pe': '2 Peter',
    '1jn': '1 John',
    '2jn': '2 John',
    '3jn': '3 John',
    'jud': 'Jude',
    'rev': 'Revelation',
  },
};

describe('lexiconHelpers', () => {
  describe('test stongs lookup', () => {
    const strongsTests = [
      ['b:H7225', { 'uhl': { '7225': 'uhl-7225' } }],
      ['H123:H7225', { 'uhl': { '123': 'uhl-123', '7225': 'uhl-7225' } }],
      ['c:d:H0776', { 'uhl': { '776': 'uhl-776' } }],
      ['H1961', { 'uhl': { '1961': 'uhl-1961' } }],
      ['H5921a', { 'uhl': { '5921': 'uhl-5921' } }],
      ['G33260', { 'ugl': { '3326': 'ugl-3326' } }],
      ['H7225:b', { 'uhl': { '7225': 'uhl-7225' } }],
      ['', {}],
      ['b', {}],
      [null, {}],
    ];

    for (let test of strongsTests) {
      const strongs = test[0];
      const expectedResults = test[1];


      it('should succeed with "' + strongs + '"', () => {
        //when
        const results = lexiconHelpers.lookupStrongsNumbers(strongs, (lexiconId, entryId) => (getLexiconData(lexiconId, entryId)));

        // then
        expect(results).toEqual(expectedResults);
      });
    }
  });

  describe('test stongs parsing', () => {
    const strongsTests = [
      ['b:H7225', [0, 7225], ['uhl', 'uhl'], 2],
      ['H123:H7225', [123, 7225], ['uhl', 'uhl'], 2],
      ['c:d:H0776', [0, 0, 776], ['uhl', 'uhl', 'uhl'], 3],
      ['H1961', [1961], ['uhl'], 1],
      ['H5921a', [5921], ['uhl'], 1],
      ['G33260', [3326], ['ugl'], 1],
      ['', [], [], 0],
      ['b', [0], ['uhl'], 1],
      [null, [], [], 0],
    ];

    for (let test of strongsTests) {
      const strongs = test[0];
      const expectedEntryIds = test[1];
      const expectedLexiconId = test[2];
      const expectedPartCount = test[3];


      it('should succeed with "' + strongs + '"', () => {
        //when
        const results = extractStrongs(strongs);

        // then
        expect(results.entryIds).toEqual(expectedEntryIds);
        expect(results.lexiconIds).toEqual(expectedLexiconId);
        expect(results.parts.length).toEqual(expectedPartCount);
      });
    }
  });
  describe('test word parsing', () => {
    const wordTests = [
      ['בְּ​רֵאשִׁ֖ית', ['בְּ', 'רֵאשִׁ֖ית']],
      ['בָּרָ֣א', ['בָּרָ֣א']],
      ['הַ​שָּׁמַ֖יִם', ['הַ', 'שָּׁמַ֖יִם']],
      ['וְ​אֵ֥ת', ['וְ', 'אֵ֥ת']],
      ['וְ​הָ​אָ֗רֶץ', ['וְ', 'הָ', 'אָ֗רֶץ']],
      ['חֲכָמֶ֑י​הָ', ['חֲכָמֶ֑י', 'הָ']], // gen 41:8
      ['Ἰάκωβος', ['Ἰάκωβος']],
    ];

    for (let test of wordTests) {
      const word = test[0];
      const expectedParts = test[1];

      it('should succeed with "' + word + '"', () => {
        //when
        const results = lexiconHelpers.getWordParts(word);

        // then
        expect(results).toEqual(expectedParts);
      });
    }
  });

  describe('UHB tests', () => {
    describe.skip('consistency check OT', () => {
      for (let bookId of Object.keys(BIBLE_BOOKS.oldTestament)) {
        const BookName = BIBLE_BOOKS.oldTestament[bookId];

        it('check ' + BookName, () => { // reads all the words from book and saves parsed words to file
          const words = {};
          const bookPath = path.join(OT_PATH, bookId);
          const files = fs.readdirSync(bookPath);

          for (let file of files) {
            const chapter = JSON.parse(fs.readFileSync(path.join(bookPath, file), 'utf8'));
            const cRef = bookId + '-' + file.split('.')[0] + ':';
            const verses = Object.keys(chapter);

            for (let verseNum of verses) {
              const verse = chapter[verseNum];
              const objects = verse.verseObjects;
              const vRef = cRef + verseNum;
              getWords(objects, words, vRef);
            }
          }

          let output = '';
          let anomallies = '';
          let missingMorphs = 0;
          let invalidStrongsCount = 0;
          let invalidMorphCount = 0;
          const wordEntries = Object.keys(words).sort();

          for (let wordIndex of wordEntries) {
            const word = words[wordIndex];
            const morph = word.word.morph;
            const strongs = word.word.strong;
            const morphKeys = lexiconHelpers.getMorphKeys(morph);
            const wordParts = lexiconHelpers.getWordParts(word.word.text);
            word.wordParts = wordParts;

            if (!strongs) {
              const warning = 'Missing strongs: ' + JSON.stringify(word);
              anomallies += warning + '\n';
              // console.warn(warning);
            } else {
              const valid = lexiconHelpers.containsValidStrongsNumber(strongs);

              if (!valid) {
                const warning = 'Missing strongs Number: ' + JSON.stringify(word);
                anomallies += warning + '\n';
                // console.warn(warning);
              }
            }

            if (!morphKeys[0].length) {
              if (++missingMorphs < 0) {
                console.warn('Missing morph entry: ' + JSON.stringify(word));
              }
            } else {
              const strongsParts = lexiconHelpers.getStrongsParts(strongs);

              if (strongsParts.length !== morphKeys.length) {
                let morphLen = morphKeys.length;

                if ((strongsParts.length + 1 === morphLen) && (morphKeys.length && morphKeys[morphKeys.length - 1][0] === 'suffix')) { // add exception for suffix
                  morphLen--;
                }

                if (strongsParts.length !== morphLen) {
                  const warning = 'number of strongs parts ' + strongsParts.length + ' different than number of morph parts ' + morphKeys.length + ' : ' + JSON.stringify(word);
                  anomallies += warning + '\n';

                  if (++invalidStrongsCount > 0) {
                    // console.warn(warning);
                  }
                }
              }

              if (wordParts.length !== morphKeys.length) {
                let morphLen = morphKeys.length;

                if ((wordParts.length + 1 === morphLen) && (morphKeys.length && morphKeys[morphKeys.length - 1][0] === 'suffix')) { // add exception for suffix
                  morphLen--;
                }

                if (wordParts.length !== morphLen) {
                  const warning = 'number of word parts ' + wordParts.length + ' different than number of morph parts ' + morphKeys.length + ' : ' + JSON.stringify(word);
                  anomallies += warning + '\n';

                  if (++invalidMorphCount > 0) {
                    // console.warn(warning);
                  }
                }
              }
            }
            word.morphKeys = morphKeys;

            if (output) {
              output += ',\n';
            }
            output += '  "' + wordIndex + '": ' + JSON.stringify(word);
          }
          console.log('-----------\nin ' + BookName + ':\nnumber of unique words: ' + wordEntries.length);

          if (missingMorphs) {
            console.warn('missingMorphs: ' + missingMorphs);
          }

          if (invalidStrongsCount) {
            console.warn('inconsistant Strongs Count: ' + invalidStrongsCount);
          }

          if (invalidMorphCount) {
            console.warn('inconsistant Morph Count: ' + invalidMorphCount);
          }

          if (anomallies) {
            console.warn('anomallies:\n' + anomallies);
          }
          output = '{\n' + output + '\n}\n';
          const outFile = path.join(outputFolder, bookId + '-word-checks.json');
          fs.writeFileSync(outFile, output, { encoding: 'utf8' });
        });
      }
    });
  });
});

//
// helpers
//

function extractStrongs(strongs) {
  const parts = lexiconHelpers.getStrongsParts(strongs);
  const lexiconIds = [];
  const entryIds = [];

  for (let found of parts) {
    const lexiconId = lexiconHelpers.lexiconIdFromStrongs(found);
    lexiconIds.push(lexiconId);
    const entryId = lexiconHelpers.lexiconEntryIdFromStrongs(found);
    entryIds.push(entryId);
  }
  return {
    entryIds, lexiconIds, parts,
  };
}

function getWords(objects, words, ref) {
  for (let i = 0, len = objects.length; i < len; i++) {
    const object = objects[i];

    if ((object.type === 'word') && object.text && !words[object.text]) {
      const data = {
        word: object,
        ref: ref + '.' + i,
      };
      words[object.text] = data;
    }

    if (object.children) {
      getWords(object.children, words, ref + '.' + i);
    }
  }
}

function getLexiconData(lexiconId, entryId) {
  return { [lexiconId]: { [entryId]: lexiconId + '-' + entryId } };
}
