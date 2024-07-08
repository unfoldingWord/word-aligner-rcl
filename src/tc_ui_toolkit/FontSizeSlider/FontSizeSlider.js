import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { AiOutlineFontSize } from 'react-icons/ai'

const useStyles = makeStyles({
  gridItem: { cursor: 'pointer' },
  smallFont: {
    display: 'flex',
    margin: '0px',
    fontSize: '16px',
  },
  largeFont: {
    margin: '0px',
    cursor: 'pointer',
    fontSize: '22px',
  },
  sliderRoot: { color: '#19579E' },
  sliderMark: { backgroundColor: '#19579E' },
  valueLabel: {
    'top': -14,
    'fontSize': '10px',
    'fontWeight': 'bold',
    'userSelect': 'none',
    '& *': {
      background: 'transparent',
      color: 'var(--accent-color-dark)',
    },
  },
});

function FontSizeSlider({
  min,
  max,
  step,
  marks,
  value,
  onChange,
}) {
  const classes = useStyles();

  const handleChange = (_, newValue) => {
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item onClick={handleDecrease} classes={{ root: classes.gridItem }}>
        <AiOutlineFontSize
          className={classes.smallFont}
        />
      </Grid>
      <Grid item style={{ display: 'flex', width: '120px' }}>
        <Slider
          marks={marks}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          classes={{
            root: classes.sliderRoot,
            mark: classes.sliderMark,
            valueLabel: classes.valueLabel,
          }}
          valueLabelDisplay='on'
          aria-labelledby='font-size-slider'
          value={typeof value === 'number' ? value : min}
        />
      </Grid>
      <Grid item onClick={handleIncrease} classes={{ root: classes.gridItem }}>
        <AiOutlineFontSize
          glyph='font'
          className={classes.largeFont}
        />
      </Grid>
    </Grid>
  );
}

FontSizeSlider.defaultProps = {
  min: 80,
  max: 240,
  step: 20,
  value: 100,// 100%
  marks: true,
};

FontSizeSlider.propTypes = {
  marks: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default FontSizeSlider;
