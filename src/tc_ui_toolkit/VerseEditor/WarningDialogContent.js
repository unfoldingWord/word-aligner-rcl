import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../SpinningLogo/Logo';

const WarningDialogContent = ({ translate }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Logo
      height="100px"
      width="150px"
      style={{ margin: '15px 18px' }}
    />
    <p style={{ margin: '0 0 0 10px' }}>
      {translate('unsaved_changes')}
    </p>
  </div>
);

WarningDialogContent.propTypes = { translate: PropTypes.func.isRequired };

export default WarningDialogContent;
