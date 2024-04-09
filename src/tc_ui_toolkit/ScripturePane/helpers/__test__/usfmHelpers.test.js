import { removeMarker } from '../usfmHelpers';

const input = '...Christ Jesus. \\f + \\ft Some early versions omit, \\fqa in Ephesus, \\fqa* but this expression is probably in Paul\'s original letter.\\f*';

it('removes all extra tags', () => {
  const expected = '...Christ Jesus. ';
  const output = removeMarker(input);
  expect(output).toEqual(expected);
});

it('removes f tags with following s5 tag', () => {
  const input = 'He even tried to desecrate the temple, so we arrested him.\\f + \\ft Some ancient copies add, \\fqa "We wanted to judge him according to our law \\fqa* . \\f*\\s5';
  const expected = 'He even tried to desecrate the temple, so we arrested him.';
  const output = removeMarker(input);
  expect(output).toEqual(expected);
});

it('removes f and s5 tags', () => {
  const input = 'He even tried to desecrate the temple, so we arrested him.\\f + \\ft Some ancient copies add, \\fqa "We wanted to judge him according to our law \\fqa* . \\f*\\s5';
  const expected = 'He even tried to desecrate the temple, so we arrested him.';
  const output = removeMarker(input);
  expect(output).toEqual(expected);
});

it('removes f tags with following p tag', () => {
  const input = '\\f + \\ft Acts 28:29—Some ancient copies have verse 29: \\fqa When he had said these things, the Jews went away. They were having a great dispute among themselves \\fqa* . \\f*\\p';
  const expected = '';
  const output = removeMarker(input);
  expect(output).toEqual(expected);
});

it('removes f and pi tags', () => {
  const input = '\\f + \\ft Acts 28:29—Some ancient copies have verse 29: \\fqa When he had said these things, the Jews went away. They were having a great dispute among themselves \\fqa* . \\f*\\pi more';
  const expected = 'more';
  const output = removeMarker(input);
  expect(output).toEqual(expected);
});
