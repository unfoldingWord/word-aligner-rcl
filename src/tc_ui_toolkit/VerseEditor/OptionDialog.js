import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import { GrClose } from 'react-icons/gr'

const OptionDialog = ({
  isOpen,
  primaryOnclick,
  content,
  handleClose,
  headerTitleText,
  primaryButtonText,
  secondaryButtonText,
}) => {
  const actions = [
    <button
      key={1}
      className="btn-second"
      onClick={handleClose}
    >
      {secondaryButtonText}
    </button>,
    <button
      key={2}
      className="btn-prime"
      onClick={primaryOnclick}
    >
      {primaryButtonText}
    </button>,
  ];

  const headerContent = (
    <div style={{
      display: 'flex', justifyContent: 'space-between', width:'100%', marginLeft:20, marginRight:20,
    }}>
      <span style={{ color: 'var(--reverse-color)' }}>{headerTitleText}</span>
      <GrClose
        onClick={handleClose}
        style={{
          color: 'var(--reverse-color)', cursor: 'pointer', fontSize: '18px', float: 'right',
        }}
      />
    </div>
  );

  return (
    <div>
      <Dialog
        open={isOpen}
        fullWidth
        onClose={handleClose}>
        <Toolbar disableGutters={true} style={{ backgroundColor: 'var(--accent-color-dark)' }}>
          {headerContent}
        </Toolbar>
        <br />
        <DialogContent style={{ padding: '0 18px 18px' }}>
          {content}
        </DialogContent>
        <DialogActions disableSpacing={true}>
          {actions}
        </DialogActions>
      </Dialog>
    </div>
  );
};

OptionDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  primaryOnclick: PropTypes.func.isRequired,
  content: PropTypes.any,
  headerTitleText: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  secondaryButtonText: PropTypes.string.isRequired,
};

export default OptionDialog;
