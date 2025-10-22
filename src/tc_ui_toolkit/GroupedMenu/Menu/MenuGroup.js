import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ProgressIcon from './ProgressIcon';

const styles = {
  textRoot: {
    padding: '0 0 0 5px',
    margin: '0px',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'normal',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 700,
  },
  root: {
    'borderBottom': 'solid #ffffff4d 1px',
    'cursor': 'pointer',
    '&$selected': {
      'backgroundColor': '#2196F3',
      '&:hover': { backgroundColor: '#2196F3' },
    },
  },
  selected: {},
  listItemIconRoot: { minWidth: '0px' },
};

/**
 * Renders a group within the menu
 * @param {string} label - the group text
 * @param {function} onClick - a callback to receive group click events
 * @param {boolean} [selected=false] - indicates if the group is selected
 * @param {boolean} [open=false] - indicates if the group is open/expanded
 * @param {number} [progress=0] - a value between 0 and 100 inclusive
 */
class MenuGroup extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      selected, open, label, progress,
    } = this.props;
    return selected !== nextProps.selected || open !== nextProps.open ||
      label !== nextProps.label || progress !== nextProps.progress;
  }

  render() {
    const {
      classes, selected, open, onClick, label, progress,
    } = this.props;

    return (
      <ListItem
        disableGutters={false}
        selected={selected}
        classes={{
          root: classes.root,
          selected: classes.selected,
        }}
        onClick={onClick}
      >
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <ProgressIcon progress={progress}/>
        </ListItemIcon>
        <ListItemText
          inset={false}
          classes={{
            root: classes.textRoot,
            primary: selected ? classes.selectedText : classes.text,
          }}
          primary={label}
        />
        {open ? <ExpandMore style={{ fontSize: '22px' }} /> : <ChevronRight style={{ fontSize: '22px' }} />}
      </ListItem>
    );
  }
}

MenuGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  open: PropTypes.bool,
  progress: PropTypes.number,
};

MenuGroup.defaultProps = {
  selected: false,
  open: false,
  progress: 0,
};

export default withStyles(styles)(MenuGroup);
