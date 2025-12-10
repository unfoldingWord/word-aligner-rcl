import React from 'react';
import PropTypes from 'prop-types';
// helpers
import * as lexiconHelpers from '../helpers/lexiconHelpers';

/**
 * lookup translations and convert to morph description
 * @param {string} morph - morph code to convert
 * @param {Function} translate
 * @return {Array} morph description for each part
 */
function getWordParts(morph, translate) {
  const morphKeysForParts = lexiconHelpers.getMorphKeys(morph);
  const morphStrs = [];

  morphKeysForParts.forEach(morphKeys => {
    const translatedMorphs = [];

    morphKeys.forEach(key => {
      if (key.startsWith('*')) {
        translatedMorphs.push(key.substr(1));
      } else {
        translatedMorphs.push(translate(key));
      }
    });
    morphStrs.push(translatedMorphs.join(', '));
  });
  return morphStrs;
}

/**
 * creates span with formatted html
 * @param html
 * @return {*}
 */
function getFormatted(html) {
  const props = { dangerouslySetInnerHTML: { __html: html } };
  return <span {...props}></span>;
}

/**
 * creates a data line with label, text and optionally text can be formatted html
 * @param {string} label
 * @param {string} text
 * @param {boolean} isFormatted - if true then text contains html formatting
 * @param {string} fontSize - font size to use for text
 * @return {*}
 */
function generateDataSegment(label, text, isFormatted = false, fontSize = '1.0em') {
  return (isFormatted ?
    <span><strong>{label}</strong> <span style={{ fontSize }}>{(text && getFormatted(text)) || ''}</span></span>
    :
    <span><strong>{label}</strong> <span style={{ fontSize }}>{text}</span></span>
  );
}

/**
 * draws line between word parts
 * @param {Number} pos - order of part on screen (0 is top)
 * @return {*}
 */
function generateLine(pos) {
  return (pos > 0) ?
    <hr style={{
      'height': '6px', 'borderBottom': '1px solid gray', 'marginBottom': '5px', 'marginTop': '0px',
    }}/>
    : '';
}

/**
 * creates an html word
 * @param {boolean} multipart - if true then this is a multipart word
 * @param {string} word
 * @param {string} fontSize - font size to use for word
 * @return {*}
 */
function generateWordEntry(multipart, word, fontSize = '1.2em') {
  return multipart ?
    <div style={{ margin: '0', padding: '0' }}>
      <strong style={{ fontSize }}>{word}</strong>
      <br/>
    </div>
    : '';
}

/**
 * creates an entry for a word part
 * @param {function} translate
 * @param {string} lemma
 * @param {string} morphStr
 * @param {Number} strongsNum
 * @param {string} strongs
 * @param {string} lexicon
 * @param {string} word
 * @param {Number} itemNum - number of part in word
 * @param {Number} pos - order of part on screen (0 is top)
 * @param {Number} count - total number of parts to show
 * @param {boolean} isHebrew - if true then we adjust font size for Original language
 * @return {*}
 */
function generateWordPart(translate, lemma, morphStr, strongsNum, strongs, lexicon, word, itemNum, pos, count,
  isHebrew = false) {
  morphStr = morphStr || translate('morph_missing');
  const multipart = count > 1;
  const key = 'lexicon_details_' + pos;
  const origLangFontSize = isHebrew ? '1.7em' : '1.2em';

  if (strongsNum) {
    return <div key={key} style={{ margin: '0px 10px 0px 10px', maxWidth: '400px' }}>
      {generateLine(pos)}
      {generateWordEntry(multipart, word, origLangFontSize)}
      {generateDataSegment(translate('lemma'), lemma, false, origLangFontSize)}<br/>
      {generateDataSegment(translate('morphology'), morphStr)}<br/>
      {generateDataSegment(translate('strongs'), strongs)}<br/>
      {generateDataSegment(translate('lexicon'), lexicon, true)}<br/>
    </div>;
  } else { // not main word
    return <div key={key} style={{ margin: '0px 0px 0px 10px', maxWidth: '400px' }}>
      {generateLine(pos)}
      {generateWordEntry(multipart, word, origLangFontSize)}
      {generateDataSegment(translate('morphology'), morphStr)}<br/>
    </div>;
  }
}

/**
 * find the major part of the word and move to top
 * @param {Number} partCount - actual part count
 * @param {Array} wordParts - word split into parts
 * @return {number[]}
 */
function movePrimaryWordToTop(partCount, wordParts) {
  let majorHighest = 0;
  let majorPos = 0;
  let indices = Array.from({ length: partCount }).map((u, i) => i);

  indices.forEach(i => {
    // sort by part length, longest first
    const partLen = ((wordParts && (wordParts.length > i) && wordParts[i]) || '').length;

    if (partLen > majorHighest) {
      majorHighest = partLen;
      majorPos = i;
    }
  });

  if (majorPos > 0) { // move
    indices.splice(majorPos, 1);
    indices.unshift(majorPos);
  }
  return indices;
}

/**
 * get the strongs and lexicon for position
 * checks for formats such as `c:d:H0776` or 'H123:H7225' and extracts the actual strongs number(s)
 * @param {String} strong - parse the strongs numbers for part
 * @param {Object} lexiconData
 * @param {number} pos - position of part to get strongs and lexicon
 * @return {strongNumber, lexicon}
 */
function getStrongsAndLexicon(strong, lexiconData, pos) {
  let lexicon = '';
  let strongNumber = 0;
  const strongsParts = lexiconHelpers.getStrongsParts(strong);

  if (strongsParts.length > pos) {
    strong = strongsParts[pos];
  } else {
    strong = '';
  }

  const lexiconId = lexiconHelpers.lexiconIdFromStrongs(strong);
  strongNumber = lexiconHelpers.lexiconEntryIdFromStrongs(strong);

  if (lexiconData && lexiconData[lexiconId] && lexiconData[lexiconId][strongNumber]) {
    lexicon = lexiconData[lexiconId][strongNumber].long;
  }
  return {
    strongNumber, lexicon, strong,
  };
}

/**
 *
 * @param {Object} wordObject - word to display in lexicon
 * @param {String} lexiconData - contains lexicon for strongs
 * @param {Function} translate
 * @param {Function} generateWordPart
 * @param {boolean} isHebrew - if true then we adjust font size for Original language
 * @return {*[]}
 */
export function generateWordLexiconDetails(wordObject, lexiconData, translate, generateWordPart, isHebrew) {
  let wordLexiconDetails;
  const wordParts = lexiconHelpers.getWordParts(wordObject.text);
  const morphStrs = getWordParts(wordObject.morph, translate);
  const strongsParts = lexiconHelpers.getStrongsParts(wordObject.strong);
  const partCount = Math.max(morphStrs.length, strongsParts.length, wordParts.length); // since there may be inconsistancies, use largest count

  if (partCount < 2) {
    const {
      strongNumber, lexicon, strong: strongs,
    } = getStrongsAndLexicon(wordObject.strong, lexiconData, 0);
    wordLexiconDetails = generateWordPart(translate, wordObject.lemma, morphStrs[0], strongNumber, strongs, lexicon, wordParts[0], 0, 0, partCount, isHebrew);
  } else {
    const indices = movePrimaryWordToTop(partCount, wordParts);

    wordLexiconDetails = indices.map((pos, index) => {
      const morphStr = ((morphStrs.length > pos) && morphStrs[pos]) || '';
      const word = ((wordParts.length > pos) && wordParts[pos]) || '';
      const {
        strongNumber, lexicon, strong: strongs,
      } = getStrongsAndLexicon(wordObject.strong, lexiconData, pos);
      const lemmaStr = (index === 0) ? wordObject.lemma : '';
      return (
        generateWordPart(translate, lemmaStr, morphStr, strongNumber, strongs, lexicon, word, pos, index, partCount, isHebrew)
      );
    });
  }
  return wordLexiconDetails;
}

class WordLexiconDetails extends React.Component {
  render() {
    const {
      wordObject, translate, lexiconData, isHebrew,
    } = this.props;
    let wordLexiconDetails = generateWordLexiconDetails(wordObject, lexiconData, translate, generateWordPart, isHebrew);
    return wordLexiconDetails;
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
