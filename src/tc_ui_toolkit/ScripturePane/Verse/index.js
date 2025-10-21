import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { getReferenceStr } from '../helpers/utils';

import './Verse.styles.css';

const styles = {
  edit_wrapper: { textAlign: 'right' },
  edit_button: {
    padding: 0,
    width: 28,
    height: 28,
  },
};

class Verse extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleEdit() {
    const {
      bibleId, chapter, verse, verseText, onEdit,
    } = this.props;

    if (typeof onEdit === 'function') {
      onEdit(bibleId, chapter, verse, verseText);
    }
  }

  render() {
    const {
      verse,
      onEdit,
      bibleId,
      chapter,
      fontClass,
      direction,
      translate,
      verseElements,
    } = this.props;
    const chapterVerseContent = getReferenceStr(chapter, verse) + ' ';
    const chapterVerse = <strong className={fontClass}>{chapterVerseContent}</strong>;
    const isEditable = bibleId === 'targetBible';
    let verseSpan = verseElements;
    let verseContainerStyle = {};

    if (bibleId === 'uhb') {
      verseContainerStyle = { WebkitFontSmoothing: 'antialiased', fontSize: '175%' };
    }

    if (!verseElements) {
      verseSpan = (
        <span className='placeholder-text'>
          {translate('pane.missing_verse_warning')}
        </span>
      );
    }

    let edit = null;

    if (isEditable && onEdit) {
      edit = (
        <div style={styles.edit_wrapper}>
          <IconButton style={styles.edit_button} onClick={this.handleEdit}>
            <EditIcon style={{ fontSize: '24px' }}/>
          </IconButton>
        </div>
      );
    }

    const directionClassName = direction === 'ltr' ? 'verse-content-ltr' : 'verse-content-rtl';

    return (
      <div className="verse-container" style={verseContainerStyle}>
        <div className={directionClassName}>
          {chapterVerse}
          <span>{verseSpan}</span>
        </div>
        {edit}
      </div>
    );
  }
}

Verse.propTypes = {
  onEdit: PropTypes.func,
  fontClass: PropTypes.string,
  translate: PropTypes.func.isRequired,
  chapter: PropTypes.number.isRequired,
  bibleId: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  verse: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  verseText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  verseElements: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default Verse;
