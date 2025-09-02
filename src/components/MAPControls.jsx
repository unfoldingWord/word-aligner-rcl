import React from 'react';
import PropTypes from 'prop-types';
import { MdRefresh, MdCheck, MdInfo, MdCancel } from 'react-icons/md';
import ThemedTooltip from './ThemedTooltip';
import { Box } from '@mui/material';

/**
 * Renders a secondary styled button
 * @param {*} [children] - the button content
 * @param {bool} [disabled=false] - controls whether the button is disabled
 * @param {func} [onClick] - optional click handler
 * @return {*}
 * @constructor
 */
const SecondaryButton = React.forwardRef((props, ref) => {
  const { children, disabled, onClick, style, ...other } = props;

  return (
    <button
      className="btn-second"
      style={style}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      {...other}
    >
      {children}
    </button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

SecondaryButton.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
};
SecondaryButton.defaultProps = { disabled: false };

const styles = {
  root: {
    width: '100%',
    padding: '0 10px',
    textAlign: 'center',
    borderStyle: 'solid none none none',
    borderWidth: '2px',
    borderColor: 'var(--background-color-light)',
  },
  button: {
    marginTop: 7,
    marginLeft: 5,
    backgroundColor: 'white',
    color: '#19579e',
    marginRight: 5,
    marginBottom: 10,
    padding: '2px 25px',
    border: '2px solid #19579e',

    transition: 'box-shadow 0.3s', // Add transition for smooth effect
    boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)', // Initial box shadow
    ':hover': {
      boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)', // Box shadow on hover
    },
  },
  icon: {
    color: 'var(--accent-color-dark)',
    verticalAlign: 'middle',
    marginRight: '5px',
    width: 30,
    height: 30,
    cursor: 'pointer',
  },
  toggle: {
    display: 'inline-block',
    width: 'auto',
    margin: '10px',
    verticalAlign: 'middle',
    fontSize: '14px',
  },
  toggleIcon: { marginTop: '0px' },
  toggleLabel: {
    color: 'var(--accent-color-dark)',
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: '14px',
    width: '100%',
    lineHeight: 'inherit',
  },
  buttonIcon: {
    display: 'inline-block',
    color: 'var(--accent-color-dark)',
    verticalAlign: 'middle',
    marginRight: '5px',
    width: 20,
    height: 20,
  },
  thumb: { boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px' },
  thumbSwitched: {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
    backgroundColor: 'var(--accent-color-dark)',
  },
  track: {
    backgroundColor: '#000',
    opacity: '0.38',
  },
  trackSwitched: {
    backgroundColor: 'var(--accent-color-dark)',
    opacity: '0.38',
  },
};

const InfoPopup = ({ translate }) => (
  <div style={{ width: '400px', padding: '0 10px' }}>
    {translate('map_instructions', {
      word_map: translate('_.word_map'),
      icon: '(x)',
    })}
  </div>
);

InfoPopup.propTypes = { translate: PropTypes.func.isRequired };

function log( message ){
    //console.log( `log(${message})` );
    console.table( message );
    return message;
}

/**
 * Renders controls for managing Word MAP predictions
 * @param {func} onRefresh
 * @param {func} onAccept
 * @param {func} nReject
 */
class MAPControls extends React.Component {
  constructor(props) {
    super(props);
    this._handleOnInfoClick = this._handleOnInfoClick.bind(this);
    this.state = { infoHovered: false };
  }

  /**
   * Handles opening the info popup
   * @private
   */
  _handleOnInfoClick(e) {
    const { showPopover, translate } = this.props;

    showPopover(
      <strong>{translate('instructions')}</strong>,
      <InfoPopup translate={translate}/>,
      e.target
    );
  }

  render() {
    const {
      hasSuggestions,
      onAccept,
      onClear,
      onRefresh,
      onReject,
      removeClear,
      translate,
    } = this.props;

    return (
        <div style={styles.root}>

            {/* This tool tip uses the showPopover callback to show instructions.
            This showPopover now has four arguments instead of three and seems to be tied specifically
            in gateway-edit to showing lexical information from the tokens.
            This could be resolved by having a separate popup function callback more in line with
            the original function, but all this work is for some instructions which may already be presented
            somewhere else.  Once this decision has been confirmed, this code can be removed. */}
          {/* <MdInfo style={styles.icon}
            onClick={this._handleOnInfoClick}/>*/}

          <ThemedTooltip message={translate('suggestions.refresh_suggestions')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onRefresh}
              >
                <MdRefresh style={styles.buttonIcon}/>
                {translate('suggestions.refresh')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          <ThemedTooltip message={translate('suggestions.accept_suggestions')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onAccept}
                disabled={!hasSuggestions}
              >
                <MdCheck style={styles.buttonIcon}/>
                {translate('suggestions.accept')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          <ThemedTooltip message={translate('suggestions.reject_suggestions')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onReject}
                disabled={!hasSuggestions}
              >
                <MdCancel style={styles.buttonIcon}/>
                {translate('suggestions.reject')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          { !removeClear &&
            <ThemedTooltip message={translate('alignments.clear_alignments')}>
              <Box component="span">
                <SecondaryButton
                  style={styles.button}
                  onClick={onClear}
                >
                  <MdCancel style={styles.buttonIcon} />
                  {translate('alignments.clear')}
                </SecondaryButton>
              </Box>
            </ThemedTooltip>
          }
        </div>
    );
  }
}

MAPControls.propTypes = {
  hasSuggestions: PropTypes.bool,
  removeClear: PropTypes.bool,
  onAccept: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onRefresh: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  showPopover: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};
MAPControls.defaultProps = { hasSuggestions: true };
export default MAPControls;
