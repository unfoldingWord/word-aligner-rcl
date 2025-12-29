import React from 'react';
import PropTypes from 'prop-types';
import { MdRefresh, MdCheck, MdInfo, MdCancel } from 'react-icons/md';
import ThemedTooltip from './ThemedTooltip';
import { Box, Typography } from '@mui/material';

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
    padding: '0 10px',
    textAlign: 'center',
    borderStyle: 'solid none none none',
    borderWidth: '2px',
    borderColor: 'var(--background-color-light)',
    marginLeft: '10px',
    marginRight: '10px',
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
  suggestions: {
    marginTop: '10px',
    marginLeft: '5px',
    marginRight: '5px',
    marginBottom: '10px',
    color: 'var(--accent-color-dark)',
    fontWeight: 'bold'
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
class ToolControls extends React.Component {
  constructor(props) {
    super(props);
    this._handleOnInfoClick = this._handleOnInfoClick.bind(this);
    this.state = { infoHovered: false };
  }

  render() {
    const {
      onClearClick,
      onRevertClick,
      onSaveClick,
      onTrainingClick,
      trainingButtonLabel,
      trainingStatusStr,
      translate
    } = this.props;

    return (
        <div style={styles.root}>

          <ThemedTooltip message={translate('alignments.revert_tip')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onRevertClick}
              >
                <MdRefresh style={styles.buttonIcon}/>
                {translate('alignments.revert')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          <ThemedTooltip message={translate('alignments.clear_tip')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onClearClick}
              >
                <MdCheck style={styles.buttonIcon}/>
                {translate('alignments.clear')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          <ThemedTooltip message={translate('alignments.save_tip')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onSaveClick}
              >
                <MdCancel style={styles.buttonIcon}/>
                {translate('alignments.save')}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          <ThemedTooltip message={translate('alignments.train_tip')}>
            <Box component="span">
              <SecondaryButton
                style={styles.button}
                onClick={onTrainingClick}
              >
                <MdCancel style={styles.buttonIcon} />
                {trainingButtonLabel}
              </SecondaryButton>
            </Box>
          </ThemedTooltip>

          { trainingStatusStr &&
            <Box component="span">
              {trainingStatusStr}
            </Box>
          }
        </div>
    );
  }
}

ToolControls.propTypes = {
  onClearClick: PropTypes.func,
  onRevertClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  onTrainingClick: PropTypes.func,
  trainingButtonLabel: PropTypes.string,
  trainingStatusStr: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

export default ToolControls;
