import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Stack } from '@mui/material';
import * as lexiconHelpers from '../helpers/lexiconHelpers';

/**
 * Lookup translations and convert to morph description
 */
function getWordParts(morph, translate) {
  const morphKeysForParts = lexiconHelpers.getMorphKeys(morph);
  const morphStrs = [];

  morphKeysForParts.forEach(morphKeys => {
    const translatedMorphs = morphKeys.map(key =>
      key.startsWith('*') ? key.substr(1) : translate(key)
    );
    morphStrs.push(translatedMorphs.join(', '));
  });

  return morphStrs;
}

/**
 * Render formatted HTML inside Typography
 */
function getFormatted(html) {
  return <Typography component="span" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Render a data segment with label and value
 */
function generateDataSegment(label, text, isFormatted = false, fontSize = '1rem') {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography component="span" fontWeight="bold">
        {label}
      </Typography>
      <Typography component="span" sx={{ fontSize }}>
        {isFormatted ? (text && getFormatted(text)) : text}
      </Typography>
    </Box>
  );
}

/**
 * Draw a separator line
 */
function generateLine(pos) {
  if (pos === 0) return null;
  return <Box sx={{ borderBottom: '1px solid gray', height: 6, mb: 1 }} />;
}

/**
 * Render a word entry
 */
function generateWordEntry(multipart, word, fontSize = '1.2rem') {
  if (!multipart) return null;
  return (
    <Typography variant="h6" fontWeight="bold" sx={{ fontSize }}>
      {word}
    </Typography>
  );
}

/**
 * Render a single word part
 */
function generateWordPart(
  translate,
  lemma,
  morphStr,
  strongsNum,
  strongs,
  lexicon,
  word,
  itemNum,
  pos,
  count,
  isHebrew = false
) {
  morphStr = morphStr || translate('morph_missing');
  const multipart = count > 1;
  const key = `lexicon_details_${pos}`;
  const origLangFontSize = isHebrew ? '1.7rem' : '1.2rem';

  return (
    <Box key={key} sx={{ mx: 1, maxWidth: 400 }}>
      {generateLine(pos)}
      {generateWordEntry(multipart, word, origLangFontSize)}
      {strongsNum ? (
        <Stack spacing={0.5}>
          {generateDataSegment(translate('lemma'), lemma, false, origLangFontSize)}
          {generateDataSegment(translate('morphology'), morphStr)}
          {generateDataSegment(translate('strongs'), strongs)}
          {generateDataSegment(translate('lexicon'), lexicon, true)}
        </Stack>
      ) : (
        generateDataSegment(translate('morphology'), morphStr)
      )}
    </Box>
  );
}

/**
 * Move the longest word part to top
 */
function movePrimaryWordToTop(partCount, wordParts) {
  let majorHighest = 0;
  let majorPos = 0;
  const indices = Array.from({ length: partCount }, (_, i) => i);

  indices.forEach(i => {
    const partLen = (wordParts[i] || '').length;
    if (partLen > majorHighest) {
      majorHighest = partLen;
      majorPos = i;
    }
  });

  if (majorPos > 0) {
    indices.splice(majorPos, 1);
    indices.unshift(majorPos);
  }
  return indices;
}

/**
 * Extract strongs and lexicon
 */
function getStrongsAndLexicon(strong, lexiconData, pos) {
  let lexicon = '';
  let strongNumber = 0;
  const strongsParts = lexiconHelpers.getStrongsParts(strong);

  if (strongsParts.length > pos) strong = strongsParts[pos];
  else strong = '';

  const lexiconId = lexiconHelpers.lexiconIdFromStrongs(strong);
  strongNumber = lexiconHelpers.lexiconEntryIdFromStrongs(strong);

  if (lexiconData?.[lexiconId]?.[strongNumber]) {
    lexicon = lexiconData[lexiconId][strongNumber].long;
  }

  return { strongNumber, lexicon, strong };
}

/**
 * Generate all word lexicon details
 */
export function generateWordLexiconDetails(wordObject, lexiconData, translate, generateWordPart, isHebrew) {
  const wordParts = lexiconHelpers.getWordParts(wordObject.text);
  const morphStrs = getWordParts(wordObject.morph, translate);
  const strongsParts = lexiconHelpers.getStrongsParts(wordObject.strong);
  const partCount = Math.max(morphStrs.length, strongsParts.length, wordParts.length);

  if (partCount < 2) {
    const { strongNumber, lexicon, strong } = getStrongsAndLexicon(wordObject.strong, lexiconData, 0);
    return generateWordPart(
      translate,
      wordObject.lemma,
      morphStrs[0],
      strongNumber,
      strong,
      lexicon,
      wordParts[0],
      0,
      0,
      partCount,
      isHebrew
    );
  }

  const indices = movePrimaryWordToTop(partCount, wordParts);
  return indices.map((pos, index) => {
    const morphStr = morphStrs[pos] || '';
    const word = wordParts[pos] || '';
    const { strongNumber, lexicon, strong } = getStrongsAndLexicon(wordObject.strong, lexiconData, pos);
    const lemmaStr = index === 0 ? wordObject.lemma : '';
    return generateWordPart(translate, lemmaStr, morphStr, strongNumber, strong, lexicon, word, pos, index, partCount, isHebrew);
  });
}

/**
 * React component
 */
class WordLexiconDetails extends React.Component {
  render() {
    const { wordObject, translate, lexiconData, isHebrew } = this.props;
    const wordLexiconDetails = generateWordLexiconDetails(wordObject, lexiconData, translate, generateWordPart, isHebrew);
    return <Stack spacing={1}>{wordLexiconDetails}</Stack>;
  }
}

WordLexiconDetails.propTypes = {
  translate: PropTypes.func.isRequired,
  wordObject: PropTypes.shape({
    lemma: PropTypes.string.isRequired,
    morph: PropTypes.string.isRequired,
    strong: PropTypes.string.isRequired,
  }).isRequired,
  lexiconData: PropTypes.object.isRequired,
  isHebrew: PropTypes.bool.isRequired,
};

export default WordLexiconDetails;