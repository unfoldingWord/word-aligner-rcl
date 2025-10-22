import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import CheckBoxOutlineIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import MenuFilterIcon from './MenuFilterIcon';

const styles = () => ({
  root: {
    backgroundColor: '#19579E',
    zIndex: 10,
    color: '#FFFFFF',
    paddingTop: 5,
    paddingBottom: 5,
  },
  filterItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 'auto',
  },
  divider: { borderBottom: 'solid 1px #FFFFFF9e' },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: 14,
  },
  checkbox: { color: '#FFFFFF', fontSize: '22px' },
  chip: {
    color: '#19579E',
    margin: 5,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chipDeleteIcon: {
    'color': '#19579E99',
    '&:hover': { color: '#19579E' },
  },
  hover: {},
  listItemIconRoot: { minWidth: '0px' },
});

/**
 * A list of filter controls
 * @param {object[]} filters - an array of filters
 * @param {function} onToggle - callback to receive filter events
 * @param {string} [title] - the menu title
 * @param {object[]} [selected] - an array of selected filters
 *
 */
class MenuFilter extends React.Component {
  state = { open: false };

  /**
   * Handles opening the filter menu
   */
  handleOpen = () => {
    this.setState(state => ({ open: !state.open }));
  };

  /**
   * Handles toggling a filter
   * @param {object} filter - the filter being toggled
   */
  handleToggle = filter => () => {
    const { onToggle } = this.props;
    onToggle(filter);
  };

  /**
   * Checks if the filter is selected
   * @param {object} filter - the filter being inspected
   * @return {boolean} true if the filter is selected
   */
  isChecked = filter => {
    const { selected } = this.props;

    for (let i = 0, len = selected.length; i < len; i++) {
      if (selected[i].id === filter.id) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks if a filter is enabled
   * @param {object} filter - the filter
   */
  isEnabled = filter => {
    const { selected } = this.props;

    for (const f of selected) {
      if (f.disables.indexOf(filter.id) >= 0) {
        return false;
      }
    }
    return true;
  };

  getOrder = filter => {
    if (!(filter.order > 0)) { // if order not defined or invalid, set it
      const { filters } = this.props;
      filter.order = -1;

      for (let i = 0, l = filters.length; i < l; i++) {
        const f = filters[i];

        if (f.id === filter.id) {
          filter.order = i + 1; // cache order of filter
          break;
        }
      }
    }
    return filter.order;
  };

  /**
   * create a chip in a table element
   * @param {Object} filter - to create chip for
   * @param {Object} classes - to apply to filter
   * @return {*}
   */
  getChip = (filter, classes) => (
    <td key={'chip_td_' + filter.id}>
      <Chip
        key={filter.id}
        label={filter.label}
        classes={{
          deleteIcon: classes.chipDeleteIcon,
          label: classes.chipLabel,
        }}
        onDelete={this.handleToggle(filter)}
        className={classes.chip}
      />
    </td>);

  /**
   * get a single table row
   * @param {Array} selected - array of filters
   * @param {Number} start - filter number for start of row
   * @param {Number} count - number of items in a row
   * @param {Object} classes - to apply to filter
   * @return {*} table row
   */
  getRow = (selected, start, count, classes) => {
    const chips = [];

    for (let i = start, l = selected.length; (i < l) && (i < start + count); i++) {
      chips.push(this.getChip(selected[i], classes));
    }
    return ( <tr key={'chip_tr_' + start}>
      {chips}
    </tr> );
  };

  /**
   * get all the chips sort them and format in a table
   * @param {Array} selected - array of filters
   * @param {Object} classes - to apply to filter
   * @return {*} table
   */
  getChips = (selected, classes) => {
    if (selected && selected.length) {
      const sortedSelected = selected.sort((a, b) => (this.getOrder(a) - this.getOrder(b)));
      const rows = [];
      const columns = 2;

      for (let i = 0, l = sortedSelected.length; i < l; i+=columns) {
        rows.push(this.getRow(selected, i, columns, classes));
      }
      return (<table>
        <tbody>{rows}</tbody>
      </table>);
    }
  };

  render() {
    const {
      selected, classes, filters, title,
    } = this.props;
    const { open } = this.state;

    const filterCount = open ? 0 : selected.length;

    return (
      <ListSubheader disableGutters className={classes.root}>
        <ListItem button className={classes.header} onClick={this.handleOpen}>
          <ListItemText
            classes={{ primary: classes.text }}
            primary={title}
          />
          <MenuFilterIcon enabledFilterCount={filterCount} open={open}/>
        </ListItem>
        <Collapse
          in={!open && selected.length > 0}
          timeout="auto"
          unmountOnExit
        >
          <Divider variant="middle" classes={{ middle: classes.divider }}/>
          <div>
            {this.getChips(selected, classes)}
          </div>
        </Collapse>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider variant="middle" classes={{ middle: classes.divider }}/>
          <List component="div" disablePadding>
            {filters.map((item, index) => (
              <ListItem
                key={index}
                button
                classes={{ root: classes.filterItemRoot }}
                disabled={!this.isEnabled(item)}
                onClick={this.handleToggle(item)}
              >
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                  {this.isChecked(item) ? (
                    <CheckBoxIcon className={classes.checkbox}/>
                  ) : (
                    <CheckBoxOutlineIcon className={classes.checkbox}/>
                  )}
                </ListItemIcon>
                {item.icon
                  ? React.cloneElement(item.icon, { style: { color: '#ffffff', fontSize: '22px' } })
                  : null}
                <ListItemText
                  classes={{ primary: classes.filterText }}
                  primary={item.label}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </ListSubheader>
    );
  }
}

MenuFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.object),
};
MenuFilter.defaultProps = { selected: [] };

export default withStyles(styles)(MenuFilter);
