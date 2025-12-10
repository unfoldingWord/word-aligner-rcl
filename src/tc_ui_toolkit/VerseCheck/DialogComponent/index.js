import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import { getTranslatedParts } from '../helpers/localizationHelpers';
import { GrClose } from 'react-icons/gr'

let DialogComponent = ({
  dialogModalVisibility, translate, handleSkip, handleClose,
}) => {
  const actions = [
    <button
      key={1}
      className="btn-second"
      onClick={handleSkip}>
      {translate('skip')}
    </button>,
    <button
      key={2}
      className="btn-prime"
      onClick={handleClose} >
      {translate('close')}
    </button>,
  ];

  const headerContent = (
    <div style={{
      display: 'flex', justifyContent: 'space-between', width:'100%', marginLeft:20, marginRight:20,
    }}>
      <span style={{ color: 'var(--reverse-color)' }}>{translate('attention')}</span>
      <GrClose
        onClick={handleClose}
        style={{
          color: 'var(--reverse-color)', cursor: 'pointer', fontSize: '18px', float: 'right',
        }}
      />
    </div>
  );

  let select = getTranslatedParts(translate, 'select_translation', '${span}', 3);
  let skip = getTranslatedParts(translate, 'can_skip', '${span}', 3);
  return (
    <div>
      <Dialog
        open={dialogModalVisibility}
        onClose={handleClose}>
        <Toolbar disableGutters={true} style={{ backgroundColor: 'var(--accent-color-dark)' }}>
          {headerContent}
        </Toolbar>
        <br />
        <br />
        <DialogContent>
          <p>
            {select[0]} <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}> {select[1]} </span> {select[2]}
          </p>
          <p>
            {skip[0]} <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}> {skip[1]} </span> {skip[2]}
          </p>
        </DialogContent>
        <DialogActions disableSpacing={true}>
          {actions}
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogComponent.propTypes = {
  translate: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  dialogModalVisibility: PropTypes.bool.isRequired,
  handleSkip: PropTypes.func.isRequired,
};

export default DialogComponent;
