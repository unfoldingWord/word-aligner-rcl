import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { withStyles } from '@mui/styles';

const styles = {
  colorSwitchBase: {
    '&$colorChecked': {
      'color': 'var(--accent-color-dark)',
      '& + $colorTrack': { backgroundColor: 'var(--accent-color-dark)' },
    },
  },
  colorTrack: {},
  colorChecked: {},
  label: {
    color: 'var(--accent-color-dark)',
    fontWeight: 'normal',
    fontSize: 14,
  },
};

const Bookmark = ({
  value,
  label,
  checked,
  color,
  onChange,
  disabled,
  classes,
}) => (
  <FormControlLabel
    style={{ paddingLeft:10 }}
    control={
      <Switch
        value={value}
        checked={checked}
        color={color}
        onChange={onChange}
        disabled={disabled}
        classes={{
          switchBase: classes.colorSwitchBase,
          checked: classes.colorChecked,
          track: classes.colorTrack,
        }}
      />
    }
    classes={{ label: classes.label }}
    label={label}
  />
);

Bookmark.defaultProps = {
  checked: false,
  disabled: false,
  color: 'primary',
};

Bookmark.propTypes = {
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  color: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styles)(Bookmark);
