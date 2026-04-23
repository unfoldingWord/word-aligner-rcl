import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip as ReactTooltip} from 'react-tooltip';
// components
import InstructionsAreaTextSelection, { SelectedText } from '../InstructionsAreaTextSelection';
// css
import './InstructionsArea.styles.css';
import { Typography } from '@mui/material';

function getSelectionString(invalidated, translate) {
  if (invalidated) {
    return (
      <div>
        <Typography component='span'>{translate('selection_invalidated')}
          <Typography component='strong'
            data-tip={translate('invalidated_tooltip')}
            data-place="top"
            data-effect="float"
            data-type="dark"
            data-class="selection-tooltip"
            data-delay-hide="100"
            style={{ verticalAlign: 'super', fontSize: '0.8em' }}>
            1
          </Typography>
        </Typography>
        <ReactTooltip />
      </div>
    );
  }
}

const InstructionsArea = ({
  mode,
  verseText,
  translate,
  selections,
  invalidated,
  alignedGLText,
  nothingToSelect,
  targetLanguageFont,
  dontShowTranslation,
  targetLanguageDirection,
}) => {
  if (!verseText) {
    return (
      <div className='instructions-area'>
        <Typography component='span'>{translate('empty_verse')}</Typography><br />
      </div>
    );
  }

  if (nothingToSelect) { // if nothingToSelect is true
    return (
      <div className='instructions-area'>
        <Typography component='span'>{translate('no_selection_needed_description')}</Typography><br />
        <SelectedText>
          <Typography component='strong' className="no-selection-needed">
            {translate('no_selection_needed')}
          </Typography>
        </SelectedText>
      </div>
    );
  }

  if (selections.length === 0 && dontShowTranslation && !invalidated) { // if invalidated we had previous selection
    return (
      <div className='instructions-area'>
        <Typography component='span'>{translate('no_selection')}</Typography><br />
      </div>
    );
  }

  if (mode === 'select' || invalidated) { // if invalidated we had previous selection
    return (
      <div className='instructions-area'>
        {getSelectionString(invalidated, translate)}
        <Typography component='span'>{translate('please_select')}</Typography><br />
        <Typography component='span'>
          <Typography component='strong' sx={{ color: 'var(--accent-color)' }}>
            {`${alignedGLText}`}
          </Typography>
        </Typography><br />
      </div>
    );
  }

  return (
    <div className='instructions-area'>
      <Typography component='span'>
        <Typography component='strong' sx={{ color: 'var(--accent-color)' }}>
          {`${alignedGLText}`}
        </Typography>
      </Typography><br />
      <Typography component='span' sx={{ lineHeight: 2 }}>{translate('translated_as')}</Typography><br />
      <Typography component='span'>
        <InstructionsAreaTextSelection
          selections={selections}
          verseText={verseText}
          targetLanguageFont={targetLanguageFont}
          languageDirection={targetLanguageDirection}
        />
      </Typography>
    </div>
  );
};

InstructionsArea.propTypes = {
  translate: PropTypes.func.isRequired,
  alignedGLText: PropTypes.string.isRequired,
  selections: PropTypes.array.isRequired,
  dontShowTranslation: PropTypes.bool,
  verseText: PropTypes.string.isRequired,
  mode: PropTypes.string,
  invalidated: PropTypes.bool,
  nothingToSelect: PropTypes.bool,
  targetLanguageFont: PropTypes.string,
  targetLanguageDirection: PropTypes.string,
};

InstructionsArea.defaultProps = { targetLanguageDirection: 'ltr' };

export default InstructionsArea;
