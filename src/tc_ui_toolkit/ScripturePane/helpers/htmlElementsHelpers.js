import React from 'react';
// Components
import WordLexiconDetails from '../../WordLexiconDetails';
// helpers
import * as lexiconHelpers from './lexiconHelpers';
import { removeMarker } from './usfmHelpers';

/**
 * on word click show lexicon
 * @param {Object} e - clicked element
 * @param {Object} word
 * @param {Function} getLexiconData
 * @param {Function} showPopover
 * @param {Function} translate
 * @param {boolean} isHebrew - if true then we adjust font size
 */
export const onWordClick = (e, word, getLexiconData, showPopover, translate, isHebrew) => {
  if (word && word.strong) {
    let lexiconData = lexiconHelpers.lookupStrongsNumbers(word.strong, getLexiconData);
    const positionCoord = e.target;
    const fontSize = isHebrew ? '1.7em' : '1.2em';
    const PopoverTitle = (
      <strong style={{ fontSize }}>{word.text}</strong>
    );
    const wordDetails = (
      <WordLexiconDetails lexiconData={lexiconData} wordObject={word} translate={translate}
        isHebrew={!!isHebrew}/>
    );
    showPopover(PopoverTitle, wordDetails, positionCoord);
  }
};

export const createNonClickableSpan = (index, paddingSpanStyle, padding, isHighlightedWord, text, fontClass) => (
  <span key={index.toString()}>
    <span className={fontClass} style={paddingSpanStyle}>
      {padding}
    </span>
    <span className={fontClass} style={{ backgroundColor: isHighlightedWord ? 'var(--highlight-color)' : '' }}>
      {removeMarker(text)}
    </span>
  </span>
);

export const createTextSpan = (index, text, fontClass) => (
  <span key={index} className={fontClass}>
    {removeMarker(text)}
  </span>
);

export const createHighlightedSpan = (index, text, fontClass) => (
  <span key={index} className={fontClass} style={{ backgroundColor: 'var(--highlight-color)' }}>
    {removeMarker(text)}
  </span>
);
