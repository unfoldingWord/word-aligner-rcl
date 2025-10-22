import React from 'react';
import PropTypes from 'prop-types';

import {
  withStyles,
  ThemeProvider as MuiThemeProvider,
} from '@mui/styles';
import {createTheme} from '@mui/material/styles';
import List from '@mui/material/List';
import memoize from 'memoize-one';
import MenuItem from './MenuItem';
import MenuGroup from './MenuGroup';
import EmptyItem from './EmptyItem';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Noto Sans"',
      'Roboto',
      'Arial',
    ].join(','),
    fontSize: 12,
  },
  props: { MuiButtonBase: { disableRipple: true } },
  overrides: {
    MuiListItem: {
      root: {
        paddingTop: 6,
        paddingBottom: 6,
        minHeight: 40,
      },
      gutters: {
        paddingLeft: 10,
        paddingRight: 5,
      },
    },
    MuiSvgIcon: { root: { fontSize: 22 } },
    MuiListItemText: {
      root: { paddingLeft: 5 },
      inset: { paddingLeft: '32px!important' },
    },
    MuiListItemIcon: { root: { marginRight: 5 } },
    MuiChip: {
      root: {
        margin: 2,
        height: 26,
      },
      label: {
        paddingLeft: 8,
        paddingRight: 8,
      },
      deleteIcon: { marginRight: 2 },
    },
    MuiListSubheader: { root: { lineHeight: 'inherit' } },
  },
});

const styles = () => ({
  root: {
    overflowY: 'scroll',
    color: '#FFFFFF',
    backgroundColor: '#333333',
  },
  header: { borderBottom: 'solid #ffffff4d 1px' },
  text: {
    color: '#FFFFFF',
    fontSize: 'inherit',
  },
});

/**
 * Displays a list of grouped menu items
 * @param {[]} entries - an array of menu entries
 * @param {object} [active=null] - the active menu item object
 * @param {object[]} [statusIcons=[]] - an array of status configurations to control menu item icons
 * @param {*} [header=null] - a component to display as the menu header
 * @param {*} [height="auto"] - the height of the menu
 * @param {*} [width=250] - the width of the menu
 * @param {boolean} [autoSelect=true] - controls whether or not opening a group will automatically select the first child
 * @param {boolean} [autoScroll=true] - controls whether or not the menu will automatically scroll to the active item
 * @param {string} [emptyNotice=""] - an optional message to display when the menu is empty
 */
class Menu extends React.Component {
  menuRef = React.createRef();
  selectedGroupRef = React.createRef();
  selectedItemRef = React.createRef();

  constructor(props) {
    super(props);
    let autoOpen = null;

    // TRICKY: start with the controlled group open
    const { active, autoSelect } = props;

    if (active && autoSelect) {
      autoOpen = this.getGroupIdForItem(active);
    }

    this.state = {
      opened: autoOpen,
      active: null,
    };
  }

  /**
   * if organizeByRef is set, used it.  Otherwise we use the groupId
   * @param item
   * @return {string|*}
   */
  getGroupIdForItem(item) {
    return item?.organizeByRef || item?.groupId;
  }

  /**
   * if organizeByRef is set, used it.  Otherwise we use the Id
   * @param group
   * @return {string|*}
   */
  getGroupIdForGroup(group) {
    return group?.organizeByRef || group?.id;
  }

  componentDidMount() {
    const { opened } = this.state;
    const { autoScroll } = this.props;

    // scroll to the selection
    if (autoScroll && opened) {
      this.scrollToSelectedItem();
    } else if (autoScroll) {
      this.scrollToSelectedGroup();
    }
  }

  /**
   *
   * @param prevProps
   * @param prevState
   * @param nextContent
   */
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, nextContent) {
    const { opened } = this.state;
    const { autoScroll } = this.props;
    const prevActive = prevProps.active ? prevProps.active : prevState.active;
    const active = this.getActive();
    const activeGroupId = this.getGroupIdForItem(active);

    if (
      active &&
      prevActive &&
      this.getGroupIdForItem(prevActive) !== activeGroupId &&
      activeGroupId !== opened
    ) {
      // open the active group if it was changed externally
      this.setState({ opened: activeGroupId });
    } else if (autoScroll && this.state.opened) {
      // scroll to the current selection
      this.scrollToSelectedItem();
    }
  }

  /**
   * Scrolls the selected group into view
   * @param {boolean} [instant=true] - makes the scroll execute instantly.
   */
  scrollToSelectedGroup = (instant = true) => {
    this.scrollIntoView(this.selectedGroupRef, instant);
  };

  /**
   * Scrolls the selected item into view
   * @param {boolean} [instant=true] - makes the scroll execute instantly.
   */
  scrollToSelectedItem = (instant = true) => {
    this.scrollIntoView(this.selectedItemRef, instant);
  };

  /**
   * Scrolls a ref into view
   * @param ref
   * @param {boolean} [instant=true] - makes the scroll execute instantly
   */
  scrollIntoView = (ref, instant = true) => {
    if (
      ref &&
      ref.scrollIntoView &&
      !this.isRefInView(ref)
    ) {
      ref.scrollIntoView({
        block: 'center',
        behavior: instant ? 'instant' : 'smooth',
      });
    }
  };

  /**
   * Checks if a dom rect is within another
   * @param ref - a react ref
   * @returns {boolean}
   */
  isRefInView = (ref) => {
    if (ref && ref.getBoundingClientRect && this.menuRef &&
      this.menuRef.current && this.menuRef.current.getBoundingClientRect) {
      const rect = ref.getBoundingClientRect();
      const menuRect = this.menuRef.current.getBoundingClientRect();
      return rect.top >= menuRect.top && rect.bottom <= menuRect.bottom;
    } else {
      return false;
    }
  };

  /**
   * Applies default key values to the status icons.
   * This prepares status icons for use in the menu.
   * @param {object[]} statusIcons - an array of status icon objects
   * @returns {object[]} - an array of normalized status icon objects.
   */
  normalizeStatusIcons = memoize(statusIcons => {
    const normalized = [];

    for (let i = 0, len = statusIcons.length; i < len; i++) {
      const icon = Object.assign({}, { value: true }, statusIcons[i]);
      normalized.push(icon);
    }
    return normalized;
  });

  /**
   * Handles opening a group within the menu.
   * If auto selected is enabled this will also select the first child
   * @param {object} group - the group being opened
   */
  handleOpen = group => () => {
    const { autoSelect } = this.props;
    const groupId = this.getGroupIdForGroup(group);

    if (this.state.opened === groupId) {
      this.setState({ opened: -1 });
    } else {
      this.setState({ opened: groupId });

      // auto select newly opened groups if not controlled elsewhere
      const firstChild = group.children[0];

      if (autoSelect && firstChild && !this.isGroupSelected(group)) {
        this.handleClick(firstChild)();
      }
    }
  };

  /**
   * Handles menu item clicks.
   * If the active menu item is controlled externally this will defer control to the parent
   * otherwise menu selections will be managed internally.
   * @param {object} item - the clicked menu item object
   */
  handleClick = item => () => {
    const { onItemClick, active } = this.props;

    if (typeof onItemClick === 'function') {
      onItemClick(item);
    }

    // skip internal state if managed externally.
    if (!active) {
      this.setState({ active: item });
    }
  };

  /**
   * Checks if a group is opened
   * @param {object} group - the menu group
   * @returns {boolean}
   */
  isGroupOpen = group => this.state.opened === this.getGroupIdForGroup(group);

  /**
   * Checks if a group is selected
   * @param {object} group - the menu group
   * @returns {boolean}
   */
  isGroupSelected = group => {
    const active = this.getActive();

    const selected = active && (
      (group.organizeByRef && group.organizeByRef === active.organizeByRef)
      || (group.id === active.groupId)
    );
    return selected;
  };

  /**
   * Checks if a menu item is selected
   * @param {object} item - the menu item
   * @returns {boolean}
   */
  isItemSelected = item => {
    const activeItem = this.getActive();
    const {
      groupId,
      itemId,
    } = item;
    const selected = activeItem &&
      activeItem.groupId === groupId &&
      activeItem.itemId === itemId;
    return selected;
  };

  /**
   * Returns the active context.
   * If the active item is controlled externally it will take precedence.
   * @returns {object|null}
   */
  getActive = () => this.props.active ? this.props.active : this.state.active;

  /**
   * Collects the react ref to the group.
   * This determines if the group is selected and stores its ref
   * @param {object} group - the menu group
   */
  handleGroupRef = group => ref => {
    if (this.isGroupSelected(group)) {
      this.selectedGroupRef = ref;
    }
  };

  /**
   * Collects the react ref to the item.
   * This determines if the menu item is selected and stores it's ref
   * @param {object} item - the menu item
   */
  handleItemRef = item => ref => {
    if (this.isItemSelected(item)) {
      this.selectedItemRef = ref;
    }
  };

  render() {
    const {
      classes,
      header,
      height,
      width,
      entries,
      statusIcons,
      emptyNotice,
      targetLanguageFont,
    } = this.props;
    const normalizedStatusIcons = this.normalizeStatusIcons(statusIcons);

    return (
      <MuiThemeProvider theme={theme}>
          <List
            ref={this.menuRef}
            component="nav"
            subheader={header}
            className={classes.root}
            style={{
              height, width, minWidth: width,
            }}
          >
            {entries.map((group, index) => (
              <div key={index} ref={this.handleGroupRef(group)}>
                <React.Fragment>
                  <MenuGroup
                    selected={this.isGroupSelected(group)}
                    onClick={this.handleOpen(group)}
                    progress={group.progress}
                    open={this.isGroupOpen(group)}
                    label={group.title}
                  />
                  {this.isGroupOpen(group) ? (
                    <List component="div" disablePadding>
                      {group.children.map((item, index) => (
                        <div key={index} ref={this.handleItemRef(item)}>
                          <MenuItem
                            status={item}
                            selected={this.isItemSelected(item)}
                            statusIcons={normalizedStatusIcons}
                            onClick={this.handleClick(item)}
                            tooltip={item.tooltip ? item.tooltip : item.title}
                            title={item.title}
                            targetLanguageFont={targetLanguageFont}
                            direction={item.direction}
                          />
                        </div>
                      ))}
                    </List>
                  ) : null}
                </React.Fragment>
              </div>
            ))}
            <EmptyItem key="empty" label={emptyNotice}
              enabled={entries.length === 0}/>
          </List>
      </MuiThemeProvider>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  entries: PropTypes.array,
  active: PropTypes.object,
  header: PropTypes.element,
  height: PropTypes.any,
  onItemClick: PropTypes.func,
  width: PropTypes.number,
  statusIcons: PropTypes.array,
  emptyNotice: PropTypes.string,
  autoSelect: PropTypes.bool,
  autoScroll: PropTypes.bool,
  targetLanguageFont: PropTypes.string,
};

Menu.defaultProps = {
  active: null,
  height: 'auto',
  entries: [],
  width: 250,
  emptyNotice: '',
  autoSelect: true,
  autoScroll: true,
  statusIcons: [],
};

Menu.muiName = 'List';

export default withStyles(styles)(Menu);
