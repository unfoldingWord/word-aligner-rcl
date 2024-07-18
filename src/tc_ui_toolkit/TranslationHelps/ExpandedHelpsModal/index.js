/**
* @description This component displays a modal when the user clicks the
* new-window glyphicon button on translationHelps component.
*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import marked from 'marked';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import './ExpandedHelpsModal.styles.css';
import { GrClose } from 'react-icons/gr'

function PaperComponent(props) {
  // component will only be draggable by element with the className in the handle prop
  return (
    <Draggable handle=".thelps-tool-bar ">
      <Paper {...props} elevation={2} />
    </Draggable>
  );
}

const styles = {
  paper: {
    minWidth: 800,
    minHeight: 500,
  },
  paperRoot: { margin: '0px' },
};

const ExpandedHelpsModal = ({
  show,
  onHide,
  title,
  article,
  classes,
  translate,
  direction,
}) => (
  <Dialog
    classes={{ paper: classes.paper }}
    dir={direction}
    open={show}
    onClose={onHide}
    maxWidth='md'
    PaperComponent={PaperComponent}
    PaperProps={{ className: classes.paperRoot }}
    aria-labelledby="thelps-dialog"
  >
    <Toolbar className="thelps-tool-bar">
      <div className="tool-bar-title">
        {title}
      </div>
      <IconButton style={{ position: 'absolute', right: 10 }} color="inherit" onClick={onHide} aria-label="Close" className="close-button">
        <GrClose />
      </IconButton>
    </Toolbar>
    <DialogContent
      className="dialog-content"
      dir={direction}
    >
      <div dangerouslySetInnerHTML={{ __html: marked(article) }} />
    </DialogContent>
    <DialogActions disableSpacing className="dialog-actions">
      <button className="btn-prime" onClick={onHide}>
        {translate('close')}
      </button>
    </DialogActions>
  </Dialog>
);


ExpandedHelpsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

ExpandedHelpsModal.defaultProps = { direction: 'ltr' };

export default withStyles(styles)(ExpandedHelpsModal);
