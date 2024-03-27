import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import InvalidatedIcon from './svgIcons/InvalidatedIcon';

const IconIndicators = ({
  isVerseEdited,
  selections,
  bookmarkEnabled,
  translate,
  invalidated,
  comment,
  nothingToSelect,
}) => {
  function getInvalidatedIcon() {
    if (invalidated) {
      return (
        <div key='invalidated'
          className={'glyphicon glyphicon-invalidated'}
          style={{ margin: '0px 20px' }}>
          <InvalidatedIcon
            height={16}
            width={16}
            color='#ffffff'
          />
        </div>
      );
    }
  }

  let title;

  if (selections.length > 0) {
    title = translate('icons.selections_found');
  } else if (nothingToSelect) {
    title = translate('no_selection_needed');
  } else {
    title = translate('icons.no_selections_found');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {getInvalidatedIcon()}
      <Glyphicon
        glyph="ok"
        style={{
          margin: '0px 20px',
          color: 'var(--reverse-color)',
          opacity: selections.length > 0 || nothingToSelect ? 1 : 0.2,
        }}
        title={title}
      />
      <Glyphicon
        glyph="pencil"
        style={{
          margin: '0px 20px',
          color: 'var(--reverse-color)',
          opacity: isVerseEdited ? 1 : 0.2,
        }}
        title={isVerseEdited ? translate('icons.verse_edits_found') : translate('icons.no_verse_edits_found')}
      />
      <Glyphicon
        glyph="comment"
        style={{
          margin: '0px 20px',
          color: 'var(--reverse-color)',
          opacity: comment && comment.length > 0 ? 1 : 0.2,
        }}
        title={comment && comment.length > 0 ? translate('icons.comments_found') : translate('icons.no_comments_found')}
      />
      <Glyphicon
        glyph="bookmark"
        style={{
          margin: '0px 20px',
          color: 'var(--reverse-color)',
          opacity: bookmarkEnabled ? 1 : 0.2,
        }}
        title={bookmarkEnabled ? translate('icons.bookmarked') : translate('icons.not_bookmarked')}
      />
    </div>
  );
};

IconIndicators.propTypes = {
  translate: PropTypes.func.isRequired,
  invalidated: PropTypes.bool.isRequired,
  isVerseEdited: PropTypes.bool.isRequired,
  selections: PropTypes.array,
  comment: PropTypes.string,
  bookmarkEnabled: PropTypes.bool,
  nothingToSelect: PropTypes.bool,
};

export default IconIndicators;
