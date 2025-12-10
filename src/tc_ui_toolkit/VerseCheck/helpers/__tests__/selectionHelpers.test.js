/* eslint-env jest */
/* eslint-disable object-curly-newline */
import _ from 'lodash';
import { optimizeSelections, unicodeTrim } from '../selectionHelpers';

// constants
const ZERO_WIDTH_SPACE = '\u200B';
const ZERO_WIDTH_JOINER = '\u2060';
const ZERO_WIDTH_NO_BREAK_SPACE = '\uFEFF';

describe('selectionHelpers.optimizeSelections', () => {
  const string = 'This is a random quote string for testing the odd  random quote   ';

  it('should not trim valid selections', () => {
    // given
    const selections_ = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(selections_);
  });

  it('should trim leading spaces', () => {
    // given
    const selections_ = [
      { text: ' is a', occurrence: 1, occurrences: 1 },
      { text: '  random quote', occurrence: 1, occurrences: 1 },
    ];
    const expectedSelections = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should not hang on leading spaces with invalid occurrence', () => {
    // given
    const selections_ = [
      { text: ' is a', occurrence: 1, occurrences: 1 },
      { text: '  random quote', occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should trim trailing spaces', () => {
    // given
    const selections_ = [
      { text: 'is a ', occurrence: 1, occurrences: 1 },
      { text: 'random quote  ', occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should remove empty selections', () => {
    // given
    const selections_ = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: '', occurrence: 1, occurrences: 0 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should remove space selections', () => {
    // given
    const selections_ = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: '  ', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random quote', occurrence: 2, occurrences: 2 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should have correct occurrence when removing spaces from " a "', () => {
    // given
    const string = 'And everyone who speaks a word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: ' a ', occurrence: 1, occurrences: 1 },
    ];
    const expectedSelections = [
      { text: 'a', occurrence: 2, occurrences: 5 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should have correct occurrence when removing spaces from " a"', () => {
    // given
    const string = 'And everyone who speaks a word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: ' a', occurrence: 1, occurrences: 1 },
    ];
    const expectedSelections = [
      { text: 'a', occurrence: 2, occurrences: 5 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should have correct occurrence when removing spaces from "a "', () => {
    // given
    const string = 'And everyone who speaka a word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: 'a ', occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'a', occurrence: 3, occurrences: 6 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should have correct occurrence when removing special spaces on trailing side', () => {
    // given
    const SPACES = ZERO_WIDTH_JOINER + ZERO_WIDTH_SPACE + ZERO_WIDTH_NO_BREAK_SPACE + ' ';
    const string = 'And everyone who speaka' + SPACES + 'a' + SPACES + 'word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: 'a' + SPACES, occurrence: 2, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'a', occurrence: 3, occurrences: 6 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should have correct occurrence when removing special spaces on both sides', () => {
    // given
    const SPACES = ZERO_WIDTH_JOINER + ZERO_WIDTH_SPACE + ZERO_WIDTH_NO_BREAK_SPACE + ' ';
    const string = 'And everyone who speaka' + SPACES + 'a' + SPACES + 'word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: SPACES + 'a' + SPACES, occurrence: 1, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'a', occurrence: 3, occurrences: 6 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should join contiguous selected words', () => {
    // given
    const selections_ = [
      { text: 'is a', occurrence: 1, occurrences: 1 },
      { text: 'random', occurrence: 1, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a random', occurrence: 1, occurrences: 1 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should join and trim contiguous selected words', () => {
    // given
    const selections_ = [
      { text: 'is a ', occurrence: 1, occurrences: 1 },
      { text: 'random ', occurrence: 1, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a random', occurrence: 1, occurrences: 1 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should join and trim contiguous selections', () => {
    // given
    const selections_ = [
      { text: 'is a r', occurrence: 1, occurrences: 1 },
      { text: 'andom ', occurrence: 1, occurrences: 2 },
    ];
    const expectedSelections = [
      { text: 'is a random', occurrence: 1, occurrences: 1 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });

  it('should trim and join contiguous selected words separated by unicode spaces', () => {
    // given
    const SPACES = ZERO_WIDTH_JOINER + ZERO_WIDTH_SPACE + ZERO_WIDTH_NO_BREAK_SPACE + ' ';
    const string = 'And everyone who speaks' + SPACES + 'a' + SPACES + 'word against the Son of Man, it will be forgiven him, ';
    const selections_ = [
      { text: ' everyone who speaks', occurrence: 1, occurrences: 1 },
      { text: SPACES + 'a' + SPACES, occurrence: 1, occurrences: 1 },
      { text: 'word ', occurrence: 1, occurrences: 1 },
    ];
    const expectedSelections = [
      { text: 'everyone who speaks' + SPACES + 'a' + SPACES + 'word', occurrence: 1, occurrences: 1 },
    ];

    // when
    const selections = optimizeSelections(string, _.cloneDeep(selections_));

    // then
    expect(selections).toEqual(expectedSelections);
  });
});

describe('selectionHelpers.unicodeTrim', () => {
  it('should trim space', () => {
    // given
    const selectedText = ' is ';
    const expectedTrimmed = 'is';

    // when
    const trimmedText = unicodeTrim(selectedText);

    // then
    expect(trimmedText).toEqual(expectedTrimmed);
  });

  it('should trim ZERO_WIDTH_SPACE', () => {
    // given
    const selectedText = ZERO_WIDTH_SPACE + ' is ' + ZERO_WIDTH_SPACE;
    const expectedTrimmed = 'is';

    // when
    const trimmedText = unicodeTrim(selectedText);

    // then
    expect(trimmedText).toEqual(expectedTrimmed);
  });

  it('should trim ZERO_WIDTH_JOINER', () => {
    // given
    const selectedText = ZERO_WIDTH_JOINER + ' is ' + ZERO_WIDTH_JOINER;
    const expectedTrimmed = 'is';

    // when
    const trimmedText = unicodeTrim(selectedText);

    // then
    expect(trimmedText).toEqual(expectedTrimmed);
  });

  it('should trim ZERO_WIDTH_NO_BREAK_SPACE', () => {
    // given
    const selectedText = ZERO_WIDTH_NO_BREAK_SPACE + ' is ' + ZERO_WIDTH_NO_BREAK_SPACE;
    const expectedTrimmed = 'is';

    // when
    const trimmedText = unicodeTrim(selectedText);

    // then
    expect(trimmedText).toEqual(expectedTrimmed);
  });

  it('should trim misc special characters', () => {
    // given
    const selectedText = ZERO_WIDTH_JOINER + ZERO_WIDTH_SPACE + ZERO_WIDTH_NO_BREAK_SPACE + ' is ' + ZERO_WIDTH_JOINER + ZERO_WIDTH_SPACE + ZERO_WIDTH_NO_BREAK_SPACE;
    const expectedTrimmed = 'is';

    // when
    const trimmedText = unicodeTrim(selectedText);

    // then
    expect(trimmedText).toEqual(expectedTrimmed);
  });
});
