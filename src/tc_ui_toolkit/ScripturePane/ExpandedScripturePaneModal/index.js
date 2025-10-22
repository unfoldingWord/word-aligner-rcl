import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { withStyles } from '@mui/styles';
// components
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import deepEqual from 'deep-equal';
import { getFontClassName } from '../../common/fontUtils';
import { getBibleElement, getVerseDataFromBible } from '../helpers/verseHelpers';
import ChapterView from './ChapterView';
import BibleHeadingsRow from './ChapterView/BibleHeadingsRow';

import './ExpandedScripturePaneModal.styles.css';
import { GrClose } from 'react-icons/gr'

function PaperComponent(props) {
  // component will only be draggable by element with the className in the handle prop
  return (
    <Draggable handle=".expanded-scripture-draggable-handle">
      <Paper {...props} elevation={2} />
    </Draggable>
  );
}

const styles = {
  toolBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--reverse-color)',
    backgroundColor: 'var(--accent-color-dark)',
    padding: '15px',
    width: '100%',
    cursor: 'move',
  },
  title: {
    marginLeft: 'auto',
    fontSize: '22px',
    fontWeight: '400',
  },
  usfmButton: { marginLeft: 'auto' },
  closeButton: { marginLeft: '10px' },
  dialogContent: {
    padding: '0px',
    margin: '0px',
  },
  dialogActions: {
    height: '70px',
    padding: '10px',
    margin: '0px',
    borderTop: '1px solid var(--border-color)',
  },
  progressRoot: { color: 'var(--accent-color-dark)' },
  progressSvg: { margin: '5px' },
  paperRoot: { margin: '0px' },
};

function ExpandedScripturePaneModal({
  show,
  title,
  onHide,
  bibles,
  classes,
  contextId,
  translate,
  selections,
  showPopover,
  getLexiconData,
  editTargetVerse,
  targetLanguageFont,
  currentPaneSettings,
  projectDetailsReducer,
  editVerseRef,
}) {
  const [verseTextReference, editVerseText] = useState({});
  const [showTargetUsfm, setShowTargetUsfm] = useState(false);

  useEffect(() => {
    if (editVerseRef) { // if verse is to be edited
      const { chapter } = contextId.reference;
      const bibleId = 'targetBible';
      const currentVerseNumber = editVerseRef;
      const bible = getBibleElement(bibles, 'targetLanguage', bibleId);
      const verseObj = bible && getVerseDataFromBible(bible, chapter, currentVerseNumber);
      const verseText = verseObj?.verseData;

      if (verseText) {
        editVerseText(prevState => ({
          ...prevState,
          bibleId,
          chapter,
          verse: currentVerseNumber,
          verseText,
        }));
      } else {
        console.warn(`ExpandedScripturePaneModal - cannot open edit verse`);
      }
    }
  }, [editVerseRef]);

  function handleEditTargetVerse(bibleId, chapter, verse, verseText) {
    editVerseText(prevState => ({
      ...prevState,
      bibleId,
      chapter,
      verse,
      verseText,
    }));
  }

  function toggleUsfm() {
    setShowTargetUsfm(!showTargetUsfm);
  }

  function handleEditorSubmit(originalVerse, newVerse, reasons) {
    if (Object.keys(verseTextReference).length === 0) {
      return;
    }

    const { chapter, verse } = verseTextReference;

    if (typeof editTargetVerse === 'function') {
      editTargetVerse(chapter, verse, originalVerse, newVerse, reasons);
    } else {
      console.warn('Unable to edit verse. Callback is not a function.');
    }
    editVerseText({});
  }

  function handleEditorCancel() {
    editVerseText({});
  }

  const fontClass = getFontClassName(targetLanguageFont);

  return (
    <Dialog
      open={show}
      onClose={onHide}
      fullWidth
      maxWidth='md'
      PaperComponent={PaperComponent}
      PaperProps={{ className: classes.paperRoot }}
      aria-labelledby="draggable-expanded-scripture-pane"
    >
      <Toolbar style={styles.toolBar} className="expanded-scripture-draggable-handle">
        <div style={styles.title} className={fontClass}>
          {title}
        </div>
        <IconButton
          title={showTargetUsfm ? 'Hide USFM' : 'Show USFM'}
          aria-label={showTargetUsfm ? 'HideUSGM' : 'ShowUSFM'}
          onClick={() => toggleUsfm()}
          style={styles.usfmButton}
          color="inherit"
        >
          {showTargetUsfm ? (
            <VisibilityIcon id='visibility_icon' htmlColor='#FFF' />
          ) : (
            <VisibilityOffIcon id='visibility_icon' htmlColor='#FFF' />
          )}
        </IconButton>
        <IconButton color="inherit" onClick={onHide} aria-label="Close" style={styles.closeButton}>
          <GrClose />
        </IconButton>
      </Toolbar>
      <DialogContent style={styles.dialogContent}>
        <BibleHeadingsRow
          bibles={bibles}
          currentPaneSettings={currentPaneSettings}
          projectDetailsReducer={projectDetailsReducer} />
        <ChapterView
          bibles={bibles}
          contextId={contextId}
          translate={translate}
          editVerse={Object.keys(verseTextReference).length === 0 ? null : verseTextReference}
          editTargetVerse={editTargetVerse}
          projectDetailsReducer={projectDetailsReducer}
          currentPaneSettings={currentPaneSettings}
          handleEditTargetVerse={handleEditTargetVerse}
          handleEditorSubmit={handleEditorSubmit}
          handleEditorCancel={handleEditorCancel}
          selections={selections}
          showPopover={showPopover}
          getLexiconData={getLexiconData}
          showTargetUsfm={showTargetUsfm}
        />
      </DialogContent>
      <DialogActions disableSpacing style={styles.dialogActions}>
        <button className="btn-prime" onClick={onHide}>
          {translate('close')}
        </button>
      </DialogActions>
    </Dialog>
  );
}

ExpandedScripturePaneModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  bibles: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  targetLanguageFont: PropTypes.string,
  contextId: PropTypes.object.isRequired,
  showPopover: PropTypes.func.isRequired,
  selections: PropTypes.array.isRequired,
  primaryLabel: PropTypes.string.isRequired,
  getLexiconData: PropTypes.func.isRequired,
  editTargetVerse: PropTypes.func.isRequired,
  currentPaneSettings: PropTypes.array.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired,
  editVerseRef: PropTypes.string, // if given then open verse for edit (single verse)
};

/**
 * Custom comparison function to determine if component should rerender.
 * @param {object} prevProps
 * @param {object} nextProps
 */
function areEqual(prevProps, nextProps) {
  /*
    Return true if passing nextProps.bibles to
    render would return the same result as passing
    prevProps.bibles to render, otherwise return false
  */
  return deepEqual(prevProps.bibles, nextProps.bibles) &&
    deepEqual(prevProps.currentPaneSettings, nextProps.currentPaneSettings) &&
    (prevProps.editVerseRef === nextProps.editVerseRef);
}

// using React.memo to boost performance by memoizing the result
export default React.memo(withStyles(styles)(ExpandedScripturePaneModal), areEqual);
