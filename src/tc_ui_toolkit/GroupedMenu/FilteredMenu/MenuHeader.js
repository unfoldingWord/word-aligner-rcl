import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

const styles = () => ({
  root: {
    backgroundColor: '#19579E',
    color: '#FFFFFF',
    zIndex: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

/**
 * A plain header to display when there are no filters.
 * @param {string} title - the menu title
 */
const MenuHeader = ({ classes, title }) => (
  <ListSubheader disableGutters className={classes.root}>
    <ListItem className={classes.header}>
      <ListItemText
        classes={{ primary: classes.text }}
        primary={title}
      />
    </ListItem>
  </ListSubheader>
);

MenuHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(MenuHeader);
