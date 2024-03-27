import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, FormControl, Glyphicon,
} from 'react-bootstrap';
import './CommentArea.styles.css';
import { moveCursorToEnd } from '../../VerseEditor/helpers/editHelpers';

const CommentArea = ({
  comment,
  translate,
  handleComment,
  checkIfCommentChanged,
}) => (
  <div className='comment-area'>
    <div style={{ fontWeight: 'bold' }}>
      <Glyphicon glyph='comment' style={{ marginRight: '5px' }} />
      {translate('comment')}
    </div>
    <FormGroup style={{ flex: 'auto', display: 'flex' }} controlId="formControlsTextarea">
      <FormControl
        autoFocus
        onFocus={moveCursorToEnd}
        componentClass='textarea'
        type='text'
        defaultValue={comment}
        style={{ flex: 'auto' }}
        onBlur={handleComment}
        onInput={checkIfCommentChanged}
      />
    </FormGroup>
  </div>
);

CommentArea.propTypes = {
  translate: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  handleComment: PropTypes.func.isRequired,
  checkIfCommentChanged: PropTypes.func.isRequired,
};

export default CommentArea;
