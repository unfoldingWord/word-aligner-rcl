import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { withStyles } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import MyTargetVerse from '../MyTargetVerse';

import './MyLanguageModal.styles.css';
import { getFontClassName } from '../../common/fontUtils';
import { GrClose } from 'react-icons/gr'

function PaperComponent(props) {
  // component will only be draggable by element with the className in the handle prop
  return (
    <Draggable handle=".my-language-modal-draggable-handle">
      <Paper {...props} elevation={2} />
    </Draggable>
  );
}

const styles = { paperRoot: { margin: '0px' } };

const MyLanguageModal = ({
  show,
  onHide,
  chapter,
  classes,
  bookName,
  fontSize,
  translate,
  targetBible,
  currentVerse,
  languageDirection,
  targetLanguageFont,
}) => {
  function scrollToCurrentVerse() {
    let verseReference = 'MyTargetVerse:' + chapter.toString() + currentVerse.toString();
    let element = document.getElementById(verseReference);

    if (element) {
      element.scrollIntoView();
    }
  }

  const title = bookName;
  let MyTargetLanguage = [];
  const targetLanguageFontClassName = getFontClassName(targetLanguageFont);
  const contentStyle = {
    padding: '0px',
    height: '500px',
    overflowY: 'auto',
    backgroundColor: 'var(--reverse-color)',
  };

  if (fontSize) {
    contentStyle.fontSize = fontSize;
  }

  if (show) {
    for (let key in targetBible[chapter]) {
      if (targetBible[chapter].hasOwnProperty(key)) {
        let verseText = targetBible[chapter][key];
        if (typeof verseText !== 'string') { // convert to string
          const text = UsfmFileConversionHelpers.getUsfmForVerseContent(verseText)
          verseText = text
        }
        let versePaneStyle = {};

        if (key == currentVerse) {
          if (key % 2 == 0) {
            versePaneStyle = {
              borderLeft: '6px solid var(--accent-color)', backgroundColor: 'var(--background-color-light)', marginTop: '10px', color: 'var(--text-color-dark)', padding: '10px',
            };
          } else {
            versePaneStyle = {
              borderLeft: '6px solid var(--accent-color)', marginTop: '10px', color: 'var(--text-color-dark)', padding: '10px',
            };
          }
        } else if (key % 2 == 0) {
          versePaneStyle = {
            backgroundColor: 'var(--background-color-light)', marginTop: '10px', color: 'var(--text-color-dark)', padding: '10px',
          };
        } else {
          versePaneStyle = {
            marginTop: '10px', color: 'var(--text-color-dark)', padding: '10px',
          };
        }
        MyTargetLanguage.push(
          <div key={key} id={'MyTargetVerse:' + chapter.toString() + key.toString()}>
            <MyTargetVerse
              chapter={chapter}
              verse={key}
              verseText={verseText}
              styles={versePaneStyle}
              dir={languageDirection}
              targetLanguageFontClassName={targetLanguageFontClassName}
            />
          </div>,
        );
      }
    }
  }

  return (
    <Dialog
      onEntered={scrollToCurrentVerse}
      maxWidth={'md'}
      fullWidth={true}
      open={show}
      onClose={onHide}
      PaperComponent={PaperComponent}
      PaperProps={{ className: classes.paperRoot }}
    >
      <Toolbar
        className="my-language-modal-draggable-handle"
        disableGutters={true}
        style={{
          display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--accent-color-dark)', cursor: 'move',
        }}
      >
        <DialogTitle disableTypography={true} className='verse-check-modal-title'>
          <h4 style={{ color: 'var(--reverse-color)' }} className={targetLanguageFontClassName}>
            {title}
          </h4>
          <GrClose
            onClick={onHide}
            style={{
              position:'absolute', right: 0, margin: 24, color: 'var(--reverse-color)', cursor: 'pointer', fontSize: '18px',
            }}
          />
        </DialogTitle>
      </Toolbar>
      <DialogContent style={contentStyle}>
        {MyTargetLanguage}
      </DialogContent>
      <DialogActions disableSpacing={true}>
        <button className='btn-prime' onClick={onHide}>{translate('close')}</button>
      </DialogActions>
    </Dialog>
  );
};

MyLanguageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  targetBible: PropTypes.object.isRequired,
  chapter: PropTypes.number.isRequired,
  currentVerse: oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  languageDirection: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  bookName: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  fontSize: PropTypes.string,
};

export default withStyles(styles)(MyLanguageModal);
