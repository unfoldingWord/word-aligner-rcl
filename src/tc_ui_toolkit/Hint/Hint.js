import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

class Hint extends Component {
  render() {
    let position = this.props.position || 'top';
    let size = this.props.size || 'medium';
    let className = `hint--${position} hint--${size}`;
    let label = this.props.label || '';
    let enable = true;

    if ( this.props.hasOwnProperty('enabled') ) {
      enable = this.props.enabled;
    }

    if (enable && this.props.hasOwnProperty('hintLength') ) {
      const hintLength = this.props.hintLength;

      if (hintLength && label) {
        enable = label.length > hintLength;
      }
    }

    if (enable===true) {
      return (
        <Typography component='span'
          className={className}
          aria-label={label}>
          {this.props.children}
        </Typography>
      );
    } else {
      return (
        <Typography component='span'>
          {this.props.children}
        </Typography>
      );
    }
  }
}

Hint.propTypes = {
  children: PropTypes.any,
  size: PropTypes.any,
  position: PropTypes.any,
  label: PropTypes.any,
  enabled: PropTypes.any,
  hintLength: PropTypes.any, // only show hint if string length is greater then this length
};

export default Hint;
