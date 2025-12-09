import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import memoize from 'memoize-one';
import _ from 'lodash';
import { getFontClassName } from '../../common/fontUtils';
import { isLTR } from '../../ScripturePane/helpers/utils'

const styles = {
  root: {
    padding: 0,
  },
  button: {
    'borderBottom': 'solid #333333 1px',
    'backgroundColor': '#747474',
    'paddingTop': 6,
    'paddingBottom': 6,
    'paddingLeft': 10,
    'paddingRight': 5,
    'minHeight': 40,
    '&.Mui-selected': {
      'backgroundColor': '#2196F3',
      '&:hover': { backgroundColor: '#2196F3' },
    },
    '&:hover': {
      backgroundColor: '#747474',
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#2196F3',
    },
  },
  selected: {},
  textRoot: { paddingRight: 0 },
  text: {
    color: '#FFFFFF',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 12,
  },
  badge: {
    backgroundColor: '#ffffff',
    border: 'solid 2px #747474',
    borderColor: '#747474',
    color: '#747474',
    fontWeight: 'bold',
    fontSize: '75%',
    width: 18,
    height: 18,
    marginTop: 2,
    marginRight: 2,
  },
  selectedBadge: {
    backgroundColor: '#ffffff',
    border: 'solid 2px #747474',
    borderColor: '#2196F3',
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: '75%',
    width: 18,
    height: 18,
    marginTop: 2,
    marginRight: 2,
  },
  lightTooltip: {
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)',
    fontSize: 14,
    padding: 15,
  },
  lightTooltipSmall: {
    backgroundColor: '#fff',
    color: '#333333',
    boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)',
  },
  arrow: {
    'fontSize': 16,
    'width': 17,
    '&::before': {
      border: '1px solid #000',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
    },
  },
  listItemIconRoot: { minWidth: '0px' },
};

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: '#333333',
    boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)',
  },
}))(Tooltip);

/**
 * Renders a single item within the menu
 * @param {string} title - the menu item text
 * @param {function} [onClick] - a callback that receives click events from the menu item
 * @param {boolean} [selected] - indicates if this item is selected
 * @param {object} [status] - a dictionary of boolean values indicating the item's status
 * @param {object[]} [statusIcons] - an array if icons that may be mapped to the item's current status
 */
class MenuItem extends React.Component {
  state = {
    arrowRef: null,
    overflow: false,
  };
  textRef = React.createRef();
  listItemTextRef = React.createRef();

  /**
   * Handles the node ref used for the tooltip arrow
   * @param {object} node - a react ref
   */
  handleArrowRef = node => {
    this.setState({ arrowRef: node });
  };

  /**
   * Check for the tooltip text overflow
   */
  checkOverflow = () => {
    const { direction } = this.props;
    const padding = isLTR(direction) ? 8 : 20; // correct for padding width
    const overflow =
      this.listItemTextRef.current.offsetWidth <=
      this.textRef.current.offsetWidth + padding;

    if (overflow !== this.state.overflow) {
      this.setState({ overflow });
    }
  };

  /**
   * Handles clicks on the item
   */
  handleClick = e => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  /**
   * Builds the correct status icon to display
   * @param {object} status - the item status. this is an object of boolean keys
   * @param {object[]} statusIcons - an array of available status icons
   */
  generateStatusIcon = memoize((status, statusIcons, selected) => {
    const { classes } = this.props;

    if (!statusIcons || !status) {
      return null;
    }

    const icons = [];

    for (let i = 0, len = statusIcons.length; i < len; i++) {
      const icon = statusIcons[i];
      const s = status[icon.key];

      if (Boolean(s) === icon.value) {
        icons.push(icon.icon);
      }
    }

    if (icons.length === 1) {
      return (
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          {icons[0]}
        </ListItemIcon>
      );
    } else if (icons.length > 1) {
      // display badged icon with tooltip
      return (
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <LightTooltip
            placement="right"
            title={
              <React.Fragment>
                {icons.map((i, key) =>
                  React.cloneElement(i, {
                    key,
                    style: { color: '#333333' },
                  }),
                )}
              </React.Fragment>
            }
          >
            <Badge
              badgeContent={icons.length}
              classes={{ badge: selected ? classes.selectedBadge : classes.badge }}
            >
              {icons[0]}
            </Badge>
          </LightTooltip>
        </ListItemIcon>
      );
    } else {
      return null;
    }
  });

  shouldComponentUpdate(nextProps, nextState) {
    // TRICKY: we should technically check for an update to statusIcons
    // however that is not a known use case and it's faster to ignore it.
    const {
      key,
      title,
      status,
      selected,
      targetLanguageFont,
    } = this.props;
    const { overflow } = this.state;
    return (
      overflow !== nextState.overflow ||
      title !== nextProps.title ||
      key !== nextProps.key ||
      selected !== nextProps.selected ||
      targetLanguageFont !== nextProps.targetLanguageFont ||
      !_.isEqual(status, nextProps.status)
    );
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  componentDidMount() {
    this.checkOverflow();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.title !== this.props.title) {
      this.setState({ overflow: false });
    }
  }

  render() {
    const {
      key,
      title,
      status,
      tooltip,
      classes,
      selected,
      direction,
      statusIcons,
      targetLanguageFont,
    } = this.props;
    const { overflow } = this.state;
    const tooltipText = tooltip ? tooltip : title;
    const icon = this.generateStatusIcon(status, statusIcons, selected);
    const fontClass = getFontClassName(targetLanguageFont);
    const style = {};
    const toolTipStyle = {};

    if (!isLTR(direction)) { // if RTL
      style.textAlign = 'right';
      style.paddingRight = '16px';
      style.direction = 'rtl';
      toolTipStyle.direction = 'rtl';
      toolTipStyle.direction = 'rtl';
    }

    return (
      <ListItem
        key={key}
        disablePadding
        classes={{
          root: classes.root,
        }}
      >
        <ListItemButton
          selected={selected}
          onClick={this.handleClick}
          className={classes.button}
          sx={{
            backgroundColor: selected ? '#2196F3 !important' : '#747474 !important',
            borderBottom: 'solid #333333 1px !important',
            '&:hover': {
              backgroundColor: selected ? '#2196F3 !important' : '#747474 !important',
            },
          }}
        >
          {icon}
          <Tooltip
            ref={this.listItemTextRef}
            enterDelay={300}
            arrow={true}
            title={
              <div className={fontClass} style={toolTipStyle}>{tooltipText}</div>
            }
            disableFocusListener={!overflow}
            disableHoverListener={!overflow}
            disableTouchListener={!overflow}
            placement={'bottom-start'}
            classes={{
              tooltip: classes.lightTooltip,
              arrow: classes.arrow,
            }}
          >
            <ListItemText
              inset={!icon}
              classes={{
                root: classes.textRoot,
                primary: classes.text,
              }}
              style={style}
              primary={<span className={fontClass} ref={this.textRef}>{title}</span>}
            />
          </Tooltip>
        </ListItemButton>
      </ListItem>);
  }
}

MenuItem.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  key: PropTypes.any,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  statusIcons: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.object,
  targetLanguageFont: PropTypes.string,
  direction: PropTypes.string,
};

export default withStyles(styles)(MenuItem);
