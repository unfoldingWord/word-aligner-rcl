/* eslint-disable no-unused-vars */
/* eslint-env jest */
import path from 'path';
import fs from 'fs';
import React from 'react';
import renderer from 'react-test-renderer';
import ospath from 'ospath';
import * as lexiconHelpers from '../ScripturePane/helpers/lexiconHelpers';
import WordDetails, { generateWordLexiconDetails } from './WordLexiconDetails';

const RESOURCE_PATH = path.join(ospath.home(), 'translationCore', 'resources');

describe('WordLexiconDetails', () => {
  describe('rendering ', () => {
    it('renders Greek', () => {
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            lemma: 'lemma',
            morph: 'Gr,NS,,,,GMPF',
            strong: 'G1230',
          }}
          translate={k => k}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew two part', () => { // Gen 1:1 word 1
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'בְּ​רֵאשִׁ֖ית',
            lemma: 'אשִׁירֵת',
            morph: 'He,R:Ncfsa',
            strong: 'b:H7225',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew single part', () => { // Gen 1:1 word 2
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'בָּרָ֣א',
            lemma: 'בָּרָא',
            morph: 'He,Vqp3ms',
            strong: 'H1254a',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew three part', () => { // Gen 1:2 word 1
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'וְ​הָ​אָ֗רֶץ',
            lemma: 'אֶרֶץ',
            morph: 'He,C:Td:Ncbsa',
            strong: 'c:d:H0776',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew two part with suffix', () => { // Gen 1:11 word 15
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'זַרְע​וֹ',
            lemma: 'זֶרַע',
            morph: 'He,Ncmsc:Sp3ms',
            strong: 'H2233',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew three part with suffix', () => { // Gen 1:12 word 14
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'לְ​מִינ֔​וֹ',
            lemma: 'מִין',
            morph: 'He,R:Ncmsc:Sp3ms',
            strong: 'l:H4327',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew extra word part', () => { // 2ki-20:17.16
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'בָּבֶֽלָ​ה',
            lemma: 'בָּבֶל',
            morph: 'He,Np',
            strong: 'H0894',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew missing strongs part', () => { // dan-3:16.6
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'לְ​מַלְכָּ֣​א',
            lemma: 'מֶלֶךְ',
            morph: 'Ar,R:Ncmsd:Td',
            strong: 'l:H4430',
          }}
          translate={k => k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders Hebrew with no strongs number', () => { // jdg-1:1 last
      const wrapper = renderer.create(
        <WordDetails
          lexiconData={{}}
          wordObject={{
            text: 'בּֽ​וֹ',
            lemma: '',
            morph: 'He,R:Sp3ms',
            strong: 'b',
          }}
          translate={k=>k}
          isHebrew={true}/>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('test popup layout for single and multipart', () => {
    const strongsTests = [
      {
        text: 'בּֽ​וֹ', lemma: '', morph: 'He,R:Sp3ms', strong: '', // empty strongs number
        results: [
          {
            'word': 'בּֽ',
            'itemNum': 0,
            'morph': 'preposition',
          },
          {
            'word': 'וֹ',
            'itemNum': 1,
            'morph': 'suffix, pronominal, third, masculine, singular',
          },
        ],
      },
      {
        text: 'בּֽ​וֹ', lemma: '', morph: 'He,R:Sp3ms', strong: 'b', // jdg-1:1 last word - no actual strongs number
        results: [
          {
            'word': 'בּֽ',
            'itemNum': 0,
            'strong': 'b',
            'morph': 'preposition',
          },
          {
            'word': 'וֹ',
            'itemNum': 1,
            'morph': 'suffix, pronominal, third, masculine, singular',
          },
        ],
      },
      {
        text: 'לְ​מַלְכָּ֣​א', lemma: 'מֶלֶךְ', morph: 'Ar,R:Ncmsd:Td', strong: 'l:H4430', // dan-3:16.6 - missing strongs part
        results: [
          {
            'word': 'מַלְכָּ֣',
            'itemNum': 1,
            'strongNum': 4430,
            'strong': 'H4430',
            'lemma': 'מֶלֶךְ',
            'morph': 'noun, common, masculine, singular, determined',
            'lexicon': 'uhl-4430',
          },
          {
            'word': 'לְ',
            'itemNum': 0,
            'strong': 'l',
            'morph': 'preposition',
          },
          {
            'word': 'א',
            'itemNum': 2,
            'morph': 'particle, definite_article',
          },
        ],
      },
      {
        text: 'בָּבֶֽלָ​ה', lemma: 'בָּבֶל', morph: 'He,Np', strong: 'H0894', // 2ki-20:17.16 - extra word part not in strongs or morph
        results: [
          {
            'word': 'בָּבֶֽלָ',
            'itemNum': 0,
            'strongNum': 894,
            'strong': 'H0894',
            'lemma': 'בָּבֶל',
            'morph': 'noun, proper_name',
            'lexicon': 'uhl-894',
          },
          {
            'word': 'ה',
            'itemNum': 1,
            'morph': 'morph_missing',
          },
        ],
      },
      {
        text: 'לְ​מִינ֔​וֹ', lemma: 'מִין', morph: 'He,R:Ncmsc:Sp3ms', strong: 'l:H4327', // Gen 1:12 word 14 - three part with suffix
        results: [
          {
            'word': 'מִינ֔',
            'itemNum': 1,
            'strongNum': 4327,
            'strong': 'H4327',
            'lemma': 'מִין',
            'morph': 'noun, common, masculine, singular, construct',
            'lexicon': 'uhl-4327',
          },
          {
            'word': 'לְ',
            'itemNum': 0,
            'strong': 'l',
            'morph': 'preposition',
          },
          {
            'word': 'וֹ',
            'itemNum': 2,
            'morph': 'suffix, pronominal, third, masculine, singular',
          },
        ],
      },
      {
        text: 'זַרְע​וֹ', lemma: 'זֶרַע', morph: 'He,Ncmsc:Sp3ms', strong: 'H2233', // Gen 1:11 word 15 - two part with suffix
        results: [
          {
            'word': 'זַרְע',
            'itemNum': 0,
            'strongNum': 2233,
            'strong': 'H2233',
            'lemma': 'זֶרַע',
            'morph': 'noun, common, masculine, singular, construct',
            'lexicon': 'uhl-2233',
          },
          {
            'word': 'וֹ',
            'itemNum': 1,
            'morph': 'suffix, pronominal, third, masculine, singular',
          },
        ],
      },
      {
        text: 'בָּרָ֣א', lemma: 'בָּרָא', morph: 'He,Vqp3ms', strong: 'H1254a', // Gen 1:1 word 2
        results: {
          'word': 'בָּרָ֣א',
          'itemNum': 0,
          'strongNum': 1254,
          'strong': 'H1254a',
          'lemma': 'בָּרָא',
          'morph': 'verb, qal, perfect_qatal, third, masculine, singular',
          'lexicon': 'uhl-1254',
        },
      },
      {
        text: 'בְּ​רֵאשִׁ֖ית', lemma: 'אשִׁירֵת', morph: 'He,R:Ncfsa', strong: 'b:H7225', // Gen 1:1 word 1
        results: [
          {
            'word': 'רֵאשִׁ֖ית',
            'itemNum': 1,
            'strongNum': 7225,
            'strong': 'H7225',
            'lemma': 'אשִׁירֵת',
            'morph': 'noun, common, feminine, singular, absolute',
            'lexicon': 'uhl-7225',
          },
          {
            'word': 'בְּ',
            'itemNum': 0,
            'strong': 'b',
            'morph': 'preposition',
          },
        ],
      },
      {
        'text': 'Παῦλος', 'lemma': 'Παῦλος', 'strong': 'G39720', 'morph': 'Gr,N,,,,,NMS,', // Titus 1:1 word 1
        'results': {
          'word': 'Παῦλος',
          'itemNum': 0,
          'strongNum': 3972,
          'strong': 'G39720',
          'lemma': 'Παῦλος',
          'morph': 'noun, nominative, masculine, singular',
          'lexicon': 'ugl-3972',
        },
      },
      {
        'text': 'וְ​הָ​אָ֗רֶץ', 'lemma': 'אֶרֶץ', 'strong': 'c:d:H0776', 'morph': 'He,C:Td:Ncbsa', // Gen 1:2 word 1
        'results': [
          {
            'word': 'אָ֗רֶץ',
            'itemNum': 2,
            'strongNum': 776,
            'strong': 'H0776',
            'lemma': 'אֶרֶץ',
            'morph': 'noun, common, both_genders, singular, absolute',
            'lexicon': 'uhl-776',
          },
          {
            'word': 'וְ',
            'itemNum': 0,
            'strong': 'c',
            'morph': 'conjunction',
          },
          {
            'word': 'הָ',
            'itemNum': 1,
            'strong': 'd',
            'morph': 'particle, definite_article',
          },
        ],
      },
      {
        'text':'רֵאשִׁיתְ​ךָ֣','tag':'w','type':'word','lemma':'רֵאשִׁית','strong':'H7225:H123',
        'results': [
          {
            'word': 'רֵאשִׁיתְ',
            'strongNum': 7225,
            'strong': 'H7225',
            'lemma': 'רֵאשִׁית',
            'morph': 'morph_missing',
            'lexicon': 'uhl-7225',
            'itemNum': 0,
          },
          {
            'word': 'ךָ֣',
            'strongNum': 123,
            'strong': 'H123',
            'morph': 'morph_missing',
            'lexicon': 'uhl-123',
            'itemNum': 1,
          },
        ],
      },
      {
        text: 'בַּ​תְּחִלָּ֖ה', strong: 'b:H8462', morph: 'He,Rd:Ncfsa', lemma: 'תְּחִלָּה',
        results: [
          {
            'word': 'תְּחִלָּ֖ה',
            'strongNum': 8462,
            'strong': 'H8462',
            'lexicon': 'uhl-8462',
            'lemma': 'תְּחִלָּה',
            'morph': 'noun, common, feminine, singular, absolute',
            'itemNum': 1,
          },
          {
            'word': 'בַּ',
            'strong': 'b',
            'morph': 'preposition, definite_article',
            'itemNum': 0,
          },
        ],
      },
      {
        'text':'מֵ​רֵאשִׁת֑​וֹ','lemma':'רֵאשִׁית','strong':'m:H7225', // morph missing
        'results': [
          {
            'word': 'רֵאשִׁת֑',
            'strongNum': 7225,
            'strong': 'H7225',
            'lemma': 'רֵאשִׁית',
            'morph': 'morph_missing',
            'itemNum': 1,
            'lexicon': 'uhl-7225',
          },
          {
            'word': 'מֵ',
            'strong': 'm',
            'morph': 'morph_missing',
            'itemNum': 0,
          },
          {
            'word': 'וֹ',
            'morph': 'morph_missing',
            'itemNum': 2,
          },
        ],
      },
      {
        'text':'רֵאשִׁיתְ​ךָ֣','tag':'w','type':'word','lemma':'רֵאשִׁית','strong':'H7225', // missing morph
        'results': [
          {
            'word': 'רֵאשִׁיתְ',
            'strongNum': 7225,
            'strong': 'H7225',
            'lemma': 'רֵאשִׁית',
            'morph': 'morph_missing',
            'lexicon': 'uhl-7225',
            'itemNum': 0,
          },
          {
            'word': 'ךָ֣',
            'morph': 'morph_missing',
            'itemNum': 1,
          },
        ],
      },
      {
        'text':'הַ⁠שֹּׁפְטִ֔ים','lemma':'שָׁפַט','strong':'d:H8199','morph': 'He,Td:Vqrmpa', // Ruth 1:1 - zero space joiner
        'results': [
          {
            'word': 'שֹּׁפְטִ֔ים',
            'strongNum': 8199,
            'strong': 'H8199',
            'lemma': 'שָׁפַט',
            'morph': 'verb, qal, participle_active, masculine, plural, absolute',
            'lexicon': 'uhl-8199',
            'itemNum': 1,
          },
          {
            'word': 'הַ',
            'strong': 'd',
            'morph': 'particle, definite_article',
            'itemNum': 0,
          },

        ],
      },
    ];

    for (let test of strongsTests) {
      const {
        text, strong, morph, lemma, results,
      } = test;
      const expectedResults = results;


      it('should succeed with "' + strong + '"', () => {
        //when
        const lexiconData = lexiconHelpers.lookupStrongsNumbers(strong, (lexiconId, entryId) => (getLexiconDataSimulate(lexiconId, entryId)));
        const word = {
          text, strong, morph, lemma,
        };
        const isHebrew = strong.charAt(0).toUpperCase() === 'H';
        let wordLexiconDetails = generateWordLexiconDetails(word, lexiconData, t => (t), generateWordPart, isHebrew);

        // then
        expect(wordLexiconDetails).toEqual(expectedResults);
      });
    }
  });
});

//
// helpers
//

export function getLexiconDataSimulate(lexiconId, entryId) {
  const key = lexiconId + '-' + entryId;
  return { [lexiconId]: { [entryId]: { brief: key, long: key } } };
}

function generateWordPart(translate, lemma, morph, strongNum, strong, lexicon, word, itemNum, pos, count) {
  morph = morph || 'morph_missing';
  const data = {
    word,
    itemNum,
  };

  if (strongNum) {
    data.strongNum = strongNum;
  }

  if (strong) {
    data.strong = strong;
  }

  if (lemma) {
    data.lemma = lemma;
  }

  if (morph) {
    data.morph = morph;
  }

  if (lexicon) {
    data.lexicon = lexicon;
  }
  return data;
}

function getLexiconDataReal(lexiconId, entryId) {
  try {
    const languageId = 'en';
    const resourceVersion = 'v0';
    // generate path from resourceType and articleId
    const lexiconPath = path.join(RESOURCE_PATH, languageId, 'lexicons', lexiconId, resourceVersion, 'content');
    const entryPath = path.join(lexiconPath, entryId + '.json');
    let entryData;

    if (fs.existsSync(entryPath)) {
      entryData = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
    }
    return { [lexiconId]: { [entryId]: entryData } };
  } catch (error) {
    console.error(error);
  }
}
