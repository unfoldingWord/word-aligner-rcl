import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import FunnelIcon from '../../icons/Funnel';

const styles = () => ({
  badge: {
    border: '2px solid #19579E',
    backgroundColor: '#933',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    margin: 8,
    width: 20,
    height: 20,
  },
  root: { padding: 5 },
  rootOpen: {
    padding: 5,
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
  colorPrimary: { color: '#fff' },
  colorPrimaryOpen: { color: '#933' },
});

/**
 * A badged filter icon
 * @param {number} enabledFilterCount - the number of filters that have been selected
 */
const MenuFilterIcon = ({
  enabledFilterCount, open, classes,
}) => {
  const count = enabledFilterCount > 0 ? enabledFilterCount : 0;
  const rootClass = open ? classes.rootOpen : classes.root;
  return (
    <Badge
      badgeContent={count}
      invisible={count <= 0}
      classes={{ badge: classes.badge, root: rootClass }}
    >
      <FunnelIcon style={{ color: open ? '#19579E' : '#ffffff' }} />
    </Badge>
  );
};

MenuFilterIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  enabledFilterCount: PropTypes.number.isRequired,
};
MenuFilterIcon.defaultProps = { open: false };

export default withStyles(styles)(MenuFilterIcon);
