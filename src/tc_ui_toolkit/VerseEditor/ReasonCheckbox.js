import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckBoxOutlineIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const useStyles = makeStyles({
  formControlLabelRoot: { height: 30 },
  formControlLabel: {
    justifyContent: 'flex-start',
    fontWeight: 700,
    fontSize: 16,
  },
  checkBoxRoot: { '&$checked': { color: 'var(--accent-color-dark)' } },
  checked:{},
});

function ReasonCheckbox({
  label,
  reason,
  onCheck,
  selectedReasons,
}) {
  function handleCheck(e, checked) {
    onCheck(reason, checked);
  }

  const classes = useStyles();

  return (
    <FormControlLabel
      classes={{
        root: classes.formControlLabelRoot,
        label: classes.formControlLabel,
      }}
      control={
        <Checkbox
          classes={{
            root: classes.checkBoxRoot,
            checked: classes.checked,
          }}
          checked={selectedReasons.includes(reason)}
          onChange={handleCheck}
          icon={<CheckBoxOutlineIcon style={{ fontSize: '24px' }} />}
          checkedIcon={<CheckBoxIcon style={{ fontSize: '24px' }} />}
        />
      }
      label={label}
    />
  );
}

ReasonCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
  reason: PropTypes.string.isRequired,
  selectedReasons: PropTypes.arrayOf(PropTypes.string),
};

ReasonCheckbox.defaultProps = { selectedReasons: [] };

export default ReasonCheckbox;
