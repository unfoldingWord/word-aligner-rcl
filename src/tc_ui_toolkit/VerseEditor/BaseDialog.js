import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { withStyles } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
  // component will only be draggable by element with the className in the handle prop
  return (
    <Draggable handle=".BaseDialog-draggable-handle">
      <Paper {...props} elevation={2} />
    </Draggable>
  );
}

/**
 * Generates the dialog actions
 * @param {bool} actionsEnabled enables/disables the action buttons
 * @param {*} primaryLabel the title of the primary button
 * @param {*} secondaryLabel the title of the secondary button
 * @param {func} onPrimaryClick the click callback of the primary button
 * @param {func} onSecondaryClick the click callback of the secondary button
 * @return {*}
 */
const makeDialogActions = ({
  actionsEnabled, primaryLabel, secondaryLabel, onPrimaryClick, onSecondaryClick,
}) => {
  const hasPrimaryLabel = Boolean(primaryLabel);
  const hasSecondaryLabel = Boolean(secondaryLabel);
  const hasPrimaryCallback = Boolean(onPrimaryClick);
  const hasSecondaryCallback = Boolean(onSecondaryClick);
  const actions = [];

  const primaryButton = (
    <button className="btn-prime"
      disabled={!actionsEnabled}
      onClick={onPrimaryClick}>
      {primaryLabel}
    </button>
  );
  const secondaryButton = (
    <button className="btn-second"
      disabled={!actionsEnabled}
      onClick={onSecondaryClick}>
      {secondaryLabel}
    </button>
  );

  if (hasSecondaryLabel && hasSecondaryCallback) {
    actions.push(secondaryButton);
  }

  if (hasPrimaryLabel && hasPrimaryCallback) {
    actions.push(primaryButton);
  }
  return actions;
};

const styles = {
  actionRoot: { padding: 0 },
  paperRoot: { margin: '0px' },
};


/**
 * Represents a generic dialog.
 * You could use this to display simple information,
 * or you could create a new component that wraps this component
 * with some custom functionality.
 *
 * @class
 * @property {bool} [modal] - controls whether this dialog is modal
 * @property {Object[]} [actions] - a custom list of actions. This overrides the default secondary and primary actions.
 * @property {*} [title] - the title of the dialog
 * @property {*} [secondaryLabel] - the label of the secondary action
 * @property {*} [primaryLabel] - the label of the primary action
 * @property {bool} [actionsEnabled] - controls whether the actions are enabled or disabled
 * @property {bool} [open] - controls whether the dialog is open
 * @property {func} [onClose] - callback when the secondary button is triggered. Overridden by `actions`
 * @property {func} [onSubmit] - callback when the primary button is triggered. Overridden by `actions`
 */
class BaseDialog extends React.Component {
  componentDidCatch(error, info) {
    console.error(error);
    console.warn(info);
  }

  render() {
    const {
      actionsEnabled,
      title,
      secondaryLabel,
      primaryLabel,
      onClose,
      onSubmit,
      open,
      children,
      actions,
      classes,
    } = this.props;

    let dialogActions = actions ? actions : makeDialogActions({
      actionsEnabled,
      primaryLabel,
      secondaryLabel,
      onPrimaryClick: onSubmit,
      onSecondaryClick: onClose,
    });

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        PaperComponent={PaperComponent}
        PaperProps={{ className: classes.paperRoot }}
        aria-labelledby={`draggable-${title}-dialog`}
      >
        <DialogTitle
          disableTypography={true}
          className="BaseDialog-draggable-handle"
          style={{
            color: 'var(--reverse-color)',
            backgroundColor: 'var(--accent-color-dark)',
            padding: '15px',
            display: 'block',
            width: '100%',
            fontSize: 22,
            fontWeight: 400,
            cursor: 'move',
          }}>
          {title}
        </DialogTitle>
        {children}
        { actionsEnabled ?
          <DialogActions disableSpacing={true}>
            {dialogActions}
          </DialogActions> : ''}
      </Dialog>
    );
  }
}

BaseDialog.propTypes = {
  modal: PropTypes.bool,
  actions: PropTypes.array,
  title: PropTypes.any,
  secondaryLabel: PropTypes.any,
  primaryLabel: PropTypes.any,
  actionsEnabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.any,
  classes: PropTypes.object,
};

BaseDialog.defaultProps = {
  actionsEnabled: true,
  modal: false,
};

export default withStyles(styles)(BaseDialog);
