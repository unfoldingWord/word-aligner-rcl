import * as stringHelpers from '../stringHelpers';

describe('stringHelpers.isDeepNestedChild', () => {
  it('Returns true with a nested array as argument', () => {
    expect(stringHelpers.isDeepNestedChild(deepNestedChild)).toBeTruthy();
  });

  it('Returns false without a nested array as argument', () => {
    expect(stringHelpers.isDeepNestedChild([])).toBeFalsy();
  });
});

describe('stringHelpers.punctuationWordSpacing', () => {
  const tests = [
    { test: '', expected: ' ' },
    { test: ' .\'', expected: '' }, // last character APOSTROPHE - no space
    { test: ' ,"  ', expected: ' ' },
    { test: ':”  ', expected: ' ' }, // last character SPACE - should add space
    { test: '  ;"', expected: '' }, // last character QUOTATION MARK - no space
    { test: '" ; \'', expected: '' }, // last character APOSTROPHE - no space
    { test: '   “', expected: '' }, // last character LEFT DOUBLE QUOTATION MARK - no space
    { test: '   ”', expected: ' ' }, // last character RIGHT DOUBLE QUOTATION MARK - should add space
    { test: '    , ‘', expected: '' }, // last character LEFT SINGLE QUOTATION MARK - no space
    { test: '   ’', expected: ' ' }, // last character RIGHT SINGLE QUOTATION MARK - should add space
  ];

  for (let test of tests) {
    it('test: "' + test.test + '"', () => {
      expect(stringHelpers.punctuationWordSpacing({ text: test.test })).toEqual(test.expected);
    });
  }
});

describe('stringHelpers.isIsolatedLeftQuote', () => {
  const tests = [
    { test: '', expected: false },
    { test: ' .\'', expected: false },
    { test: ' ,"  ', expected: false },
    { test: ':”  ', expected: false },
    { test: '  ;"', expected: false }, // last character QUOTATION MARK - false
    { test: '"', expected: false }, // single QUOTATION MARK - false
    { test: '" ; \'', expected: false }, // last character APOSTROPHE - false
    { test: '\'', expected: false }, // single APOSTROPHE - false
    { test: '   “', expected: false }, // last character LEFT DOUBLE QUOTATION MARK - false
    { test: '“', expected: true }, // single LEFT DOUBLE QUOTATION MARK - true
    { test: '   ”', expected: false }, // last character RIGHT DOUBLE QUOTATION MARK - false
    { test: '”', expected: false }, // single RIGHT DOUBLE QUOTATION MARK - false
    { test: '    , ‘', expected: false }, // last character LEFT SINGLE QUOTATION MARK - false
    { test: '‘', expected: true }, // single LEFT SINGLE QUOTATION MARK - true
    { test: '   ’', expected: false }, // last character RIGHT SINGLE QUOTATION MARK - false
    { test: '’', expected: false }, // single RIGHT SINGLE QUOTATION MARK - false
  ];

  for (let test of tests) {
    it('test: "' + test.test + '"', () => {
      expect(stringHelpers.isIsolatedLeftQuote(test.test)).toEqual(test.expected);
    });
  }
});

// test data
const deepNestedChild = [
  [
    {
      content: [
        {
          children: [
            {
              content: [{}],
              occurrence: 1,
              occurrences: 2,
              tag: 'w',
              text: 'this',
              type: 'word',
            },
            {
              content: [{}],
              occurrence: 1,
              occurrences: 1,
              tag: 'w',
              text: 'message',
              type: 'word',
            },
          ],
          content: 'αὐτοῦ',
          lemma: 'αὐτός',
          morph: 'Gr,RP,,,3GMS,',
          occurrence: 1,
          occurrences: 1,
          strong: 'G08460',
          tag: 'zaln',
          type: 'milestone',
        },
        {
          children: [
            {
              children: [{}],
              content: 'αὐτοῦ',
              lemma: 'αὐτός',
              morph: 'Gr,RP,,,3GMS,',
              occurrence: 1,
              occurrences: 1,
              strong: 'G08460',
              tag: 'zaln',
              type: 'milestone',
            },
          ],
          content: 'λόγον',
          lemma: 'λόγος',
          morph: 'Gr,N,,,,,AMS,',
          occurrence: 1,
          occurrences: 1,
          strong: 'G30560',
          tag: 'zaln',
          type: 'milestone',
        },
      ],
      occurrence: 1,
      occurrences: 2,
      tag: 'w',
      text: 'this',
      type: 'word',
    },
  ],
];
