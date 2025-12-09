import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

const styles = () => ({
  root: {
    position: 'relative',
    display: 'inline-flex',
    width: 22,
    height: 22,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: 'var(--completed-color)',
    zIndex: 2,
  },
  shadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#EEEEEE',
    zIndex: 1,
  },
});

/**
 * Displays a circular progress icon with a faint background
 * @param {number} progress - a value between 0 and 100 inclusive
 */
const ProgressIcon = ({ classes, progress }) => (
  <div className={classes.root}>
    <CircularProgress
      className={classes.shadow}
      color='#EEEEEE'
      size={22}
      thickness={6}
      variant="determinate"
      value={100}
    />
    <CircularProgress
      className={classes.progress}
      size={22}
      thickness={7}
      variant="determinate"
      value={progress}
    />
  </div>
);

ProgressIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
};

export default withStyles(styles)(ProgressIcon);
