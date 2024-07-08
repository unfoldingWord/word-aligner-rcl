/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import './SaveArea.styles.css';
import Hint from '../../Hint/Hint';
import { IoIosShareAlt } from 'react-icons/io'

const styles = {
  actionButtons: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingRight: '0px',
  },
};

const SaveArea = ({
  translate,
  selections,
  nothingToSelect,
  handleGoToNext,
  handleGoToPrevious,
  handleOpenDialog,
}) => {
  const handleNext = () => {
    selections.length > 0 || nothingToSelect ? handleGoToNext() : handleOpenDialog('next');
  };

  const handlePrevious = () => {
    selections.length > 0 || nothingToSelect ? handleGoToPrevious() : handleOpenDialog('previous');
  };

  const savePreviousText = translate('save_previous');
  const saveContinueText = translate('save_continue');
  return (
    <div className='save-area'>
      <Hint
        position={'top'}
        size='medium'
        label={savePreviousText}
        enabled={!!savePreviousText}
        hintLength={19}
      >
        <button className='btn-second'
          style={styles.actionButtons}
          onClick={handlePrevious}
        >
          <IoIosShareAlt style={{ marginRight: '10px', transform: 'scaleX(-1)' }} />
          {savePreviousText}
        </button>
      </Hint>
      <Hint
        position={'top'}
        size='medium'
        label={saveContinueText}
        enabled={!!saveContinueText}
        hintLength={19}
      >
        <button className='btn-prime'
          style={styles.actionButtons}
          onClick={handleNext}
        >
          {saveContinueText}
          <IoIosShareAlt style={{ marginLeft: '10px' }} />
        </button>
      </Hint>
    </div>
  );
};

SaveArea.propTypes = {
  translate: PropTypes.func.isRequired,
  selections: PropTypes.array.isRequired,
  nothingToSelect: PropTypes.bool.isRequired,
  handleGoToNext: PropTypes.func.isRequired,
  handleGoToPrevious: PropTypes.func.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
};

export default SaveArea;
