import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { Col } from 'react-bootstrap';
import { getReferenceStr } from '../../../helpers/utils';

const MyTargetVerse = ({
  chapter,
  verse,
  verseText,
  styles,
  dir,
  targetLanguageFontClassName,
}) => {
  const chapterVerse = getReferenceStr(chapter, verse) + ' ';

  return (
    <Col md={12} sm={12} xs={12} lg={12} style={styles}>
      <div style={{ direction: dir }}>
        <b>{chapterVerse}</b>
        <span className={targetLanguageFontClassName}>{verseText}</span>
      </div>
    </Col>
  );
};

MyTargetVerse.propTypes = {
  chapter: PropTypes.number.isRequired,
  verse: oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  verseText: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
  targetLanguageFontClassName: PropTypes.string,
};

export default MyTargetVerse;
