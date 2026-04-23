import React from 'react';
import PropTypes from 'prop-types';
import * as windowSelectionHelpers from '../helpers/windowSelectionHelpers';
import { getFontClassName } from '../../common/fontUtils';
import { Typography } from '@mui/material';

const BREAK_CHAR = '&';

export const SelectedText = ({ children }) => <Typography component='strong' sx={{ color: 'var(--accent-color)' }}>{children}</Typography>;

SelectedText.propTypes = { children: PropTypes.node.isRequired };

const getSelectionSpans = (selections, targetLanguageFont) => {
  const results = [];
  const fontClass = getFontClassName(targetLanguageFont);

  for (let i = 0, len = selections.length; i < len; i++) {
    const selection = selections[i];
    const index = i;

    results.push(
      <Typography component='span' key={index} >
        <Typography component='strong' sx={{ color: 'var(--accent-color)' }} className={fontClass}>
          {`${selection.text.trim()}`}
        </Typography>
        {selections[index + 1] ? <Typography component='span'>{' '}</Typography> : null}
      </Typography>,
    );
  }

  return results;
};

const InstructionsAreaTextSelection = ({
  verseText,
  selections,
  targetLanguageFont,
  languageDirection,
}) => {
  const fontClass = getFontClassName(targetLanguageFont);

  if (windowSelectionHelpers.shouldRenderBreak(selections, verseText)) {
    return (
      <div style={{ color: 'var(--accent-color)', direction: languageDirection }}>
        <Typography component='span' className={fontClass}>{selections[0].text.trim()}</Typography>
        <Typography component='strong' className={fontClass} sx={{ color: 'var(--accent-color)' }}>
          {` ${BREAK_CHAR} `}
        </Typography>
        <Typography component='span' className={fontClass}>{selections[selections.length - 1].text.trim()}</Typography>
      </div>
    );
  } else {
    return (
      <div style={{ color: 'var(--accent-color)', direction: languageDirection }}>
        {getSelectionSpans(selections, targetLanguageFont)}
      </div>
    );
  }
};

InstructionsAreaTextSelection.propTypes = {
  selections: PropTypes.array.isRequired,
  verseText: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  languageDirection: PropTypes.string,
};

InstructionsAreaTextSelection.defaultProps = { languageDirection: 'ltr' };

export default InstructionsAreaTextSelection;
