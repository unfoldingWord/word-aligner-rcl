import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { Col } from 'react-bootstrap';
import { getReferenceStr } from '../../ScripturePane/helpers/utils'
import { Typography } from '@mui/material';

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
        <Typography component='span' className={targetLanguageFontClassName}>{verseText}</Typography>
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
