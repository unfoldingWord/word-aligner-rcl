import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'deep-equal';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InfoIcon from '@material-ui/icons/Info';
import CheckBoxOutlineIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ReactTooltip from 'react-tooltip';
// components
import Bookmark from '../../Bookmark';
// css
import './ActionsArea.styles.css';
import Hint from '../../Hint/Hint';
import { FaCheck } from 'react-icons/fa'
import { TfiComment, TfiPencil } from 'react-icons/tfi'
import { LuEraser } from 'react-icons/lu'

const styles = {
  formControl: { margin: '0' },
  label: {
    color: 'var(--accent-color-dark)',
    fontWeight: 'normal',
    fontSize: 14,
  },
  checkBoxRoot: {
    'padding': '12px 5px',
    'color': 'var(--accent-color-dark)',
    '&$checked': { color: 'var(--accent-color-dark)' },
  },
  checked: {},
  icon: {
    color: 'var(--accent-color-dark)',
    verticalAlign: 'middle',
    margin: '5px',
    width: 30,
    height: 30,
    cursor: 'pointer',
  },
  actionButtons: {
    width: '140px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingRight: '0px',
  },
};

const hideBookmarks = true;
const hideEdit = true;
const hideComment = true;

const actionButtonStyleRM = {
  ...styles.actionButtons,
  marginRight: '5px',
};

const isSelectionsSaveDisable = (localNothingToSelect, nothingToSelect, newSelections, selections) => {
  if (newSelections.length > 0 || (newSelections.length === 0 && !isEqual(newSelections, selections))) {
    return isEqual(newSelections, selections);
  }

  return localNothingToSelect === nothingToSelect;
};

/* eslint-disable react/prop-types */
const ChangeModeArea = ({
  translate,
  bookmarkEnabled,
  toggleBookmark,
  changeMode,
}) => {
  const selectText = translate('select');
  const editVerseText = translate('edit_verse');
  const commentText = translate('comment');
  return (
    <div className='actions-area'>
      {!hideBookmarks &&
        <Bookmark
          value='bookmark'
          color='primary'
          checked={bookmarkEnabled}
          label={translate('bookmark')}
          onChange={toggleBookmark} />
      }
      <div style={{ display: 'flex', marginLeft: 'auto' }}>
        <Hint
          position={'top'}
          size='medium'
          label={selectText}
          enabled={!!selectText}
          hintLength={14}
        >
          <button
            style={actionButtonStyleRM}
            className='btn-second'
            onClick={() => changeMode('select')}
          >
            <FaCheck style={{ marginRight: '10px' }} />
            {selectText}
          </button>
        </Hint>
        {!hideEdit &&
          <Hint
            position={'top'}
            size='medium'
            label={editVerseText}
            enabled={!!editVerseText}
            hintLength={14}
          >
            <button
              style={actionButtonStyleRM}
              className='btn-second'
              onClick={() => changeMode('edit')}
            >
              <TfiPencil style={{ marginRight: '10px' }} />
              {editVerseText}
            </button>
          </Hint>
        }
        {!hideComment &&
          <Hint
            position={'top'}
            size='medium'
            label={commentText}
            enabled={!!commentText}
            hintLength={14}
          >
            <button
              style={styles.actionButtons}
              className='btn-second'
              onClick={() => changeMode('comment')}
            >
              <TfiComment style={{ marginRight: '10px' }} />
              {commentText}
            </button>
          </Hint>
        }
      </div>
    </div>
  );
};

const ConfirmEditVerseArea = ({
  translate,
  tags,
  cancelEditVerse,
  saveEditVerse,
}) => {
  const cancelText = translate('cancel');
  const saveText = translate('save');
  return (
    <div className='actions-area'>
      <Hint
        position={'top'}
        size='medium'
        label={cancelText}
        enabled={!!cancelText}
        hintLength={14}
      >
        <button
          className='btn-second'
          onClick={cancelEditVerse}
        >
          {cancelText}
        </button>
      </Hint>
      <Hint
        position={'top'}
        size='medium'
        label={saveText}
        enabled={!!saveText}
        hintLength={14}
      >
        <button className='btn-prime'
          disabled={!tags.length}
          onClick={saveEditVerse}
        >
          <FaCheck style={{ marginRight: '10px' }} />
          {saveText}
        </button>
      </Hint>
    </div>
  );
};

const ConfirmCommentArea = ({
  translate,
  isCommentChanged,
  cancelComment,
  saveComment,
}) => {
  const cancelText = translate('cancel');
  const saveText = translate('save');
  return (
    <div className='actions-area'>
      <Hint
        position={'top'}
        size='medium'
        label={cancelText}
        enabled={!!cancelText}
        hintLength={14}
      >
        <button className='btn-second'
          onClick={cancelComment}
        >
          {cancelText}
        </button>
      </Hint>
      <Hint
        position={'top'}
        size='medium'
        label={saveText}
        enabled={!!saveText}
        hintLength={14}
      >
        <button className='btn-prime'
          disabled={!isCommentChanged}
          onClick={saveComment}
        >
          <FaCheck style={{ marginRight: '10px' }}/>
          {saveText}
        </button>
      </Hint>
    </div>
  );
};

const ConfirmSelectionArea = ({
  classes,
  translate,
  localNothingToSelect,
  newSelections,
  nothingToSelect,
  selections,
  toggleNothingToSelect,
  cancelSelection,
  clearSelection,
  saveSelection,
}) => {
  const cancelText = translate('cancel');
  const clearSelectionText = translate('clear_selection');
  const saveText = translate('save');
  return (
    <div className='selection-actions-area'>
      <div className='flex-row'>
        <FormControlLabel
          value="end"
          control={
            <Checkbox
              checked={localNothingToSelect}
              disabled={newSelections && newSelections.length > 0}
              color="primary"
              onChange={event => toggleNothingToSelect(event.target.checked)}
              value="nothingToSelect"
              classes={{
                root: classes.checkBoxRoot,
                checked: classes.checked,
              }}
              icon={<CheckBoxOutlineIcon style={{ fontSize: '24px' }}/>}
              checkedIcon={<CheckBoxIcon style={{ fontSize: '24px' }}/>}
            />
          }
          label={translate('no_selection_needed')}
          classes={{
            root: classes.formControl,
            label: classes.label,
          }}
        />
        <div
          data-tip={translate('nothing_to_select_description')}
          data-place="top"
          data-effect="float"
          data-type="dark"
          data-class="selection-tooltip"
          data-delay-hide="100"
          style={{ verticalAlign: 'super', fontSize: '0.8em' }}
        >
          <InfoIcon classes={{ root: classes.icon }}/>
          <ReactTooltip/>
        </div>
      </div>
      <div style={{ whiteSpace: 'nowrap' }}>
        <Hint
          position={'top'}
          size='medium'
          label={cancelText}
          enabled={!!cancelText}
          hintLength={14}
        >
          <button
            className='btn-second'
            style={{
              ...actionButtonStyleRM, marginLeft: '0px', alignSelf: 'flex-start',
            }}
            onClick={cancelSelection}
          >
            {cancelText}
          </button>
        </Hint>
        <Hint
          position={'top'}
          size='medium'
          label={clearSelectionText}
          enabled={!!clearSelectionText}
          hintLength={14}
        >
          <button
            className='btn-second'
            style={actionButtonStyleRM}
            disabled={newSelections.length > 0 ? false : true}
            onClick={clearSelection}
          >
            <LuEraser style={{ marginRight: '10px' }}/>
            {clearSelectionText}
          </button>
        </Hint>
        <Hint
          position={'top'}
          size='medium'
          label={saveText}
          enabled={!!saveText}
          hintLength={14}
        >
          <button
            className='btn-prime'
            style={actionButtonStyleRM}
            disabled={isSelectionsSaveDisable(localNothingToSelect, nothingToSelect, newSelections, selections)}
            onClick={saveSelection}
          >
            <FaCheck style={{ marginRight: '10px' }}/>
            {saveText}
          </button>
        </Hint>
      </div>
    </div>
  );
};
/* eslint-enable react/prop-types */

const ActionsArea = ({
  tags,
  mode,
  isCommentChanged,
  selections,
  newSelections,
  bookmarkEnabled,
  saveSelection,
  cancelSelection,
  clearSelection,
  translate,
  classes,
  localNothingToSelect,
  nothingToSelect,
  toggleNothingToSelect,
  toggleBookmark,
  changeMode,
  cancelEditVerse,
  saveEditVerse,
  cancelComment,
  saveComment,
  disables,
}) => {

  const {
    bookMark: disableBookMark,

  } = (disables || {})
  switch (mode) {
  case 'edit':
    return (
      <ConfirmEditVerseArea
        tags={tags}
        translate={translate}
        cancelEditVerse={cancelEditVerse}
        saveEditVerse={saveEditVerse}
      />
    );
  case 'comment':
    return (
      <ConfirmCommentArea
        translate={translate}
        isCommentChanged={isCommentChanged}
        cancelComment={cancelComment}
        saveComment={saveComment}
      />
    );
  case 'select':
    return (
      <ConfirmSelectionArea
        classes={classes}
        translate={translate}
        localNothingToSelect={localNothingToSelect}
        newSelections={newSelections}
        nothingToSelect={nothingToSelect}
        selections={selections}
        toggleNothingToSelect={toggleNothingToSelect}
        cancelSelection={cancelSelection}
        clearSelection={clearSelection}
        saveSelection={saveSelection}
      />
    );
  case 'default':
    return (
      <ChangeModeArea
        translate={translate}
        bookmarkEnabled={bookmarkEnabled}
        toggleBookmark={toggleBookmark}
        changeMode={changeMode}
      />
    );
  default:
    return (
      <ChangeModeArea
        translate={translate}
        bookmarkEnabled={bookmarkEnabled}
        toggleBookmark={toggleBookmark}
        changeMode={changeMode}
      />
    );
  }
};

ActionsArea.propTypes = {
  tags: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  isCommentChanged: PropTypes.bool.isRequired,
  selections: PropTypes.array.isRequired,
  newSelections: PropTypes.array.isRequired,
  bookmarkEnabled: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  localNothingToSelect: PropTypes.bool.isRequired,
  nothingToSelect: PropTypes.bool.isRequired,
  saveSelection: PropTypes.func.isRequired,
  cancelSelection: PropTypes.func.isRequired,
  clearSelection: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  toggleNothingToSelect: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  cancelEditVerse: PropTypes.func.isRequired,
  saveEditVerse: PropTypes.func.isRequired,
  cancelComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  disables: PropTypes.object
};

ActionsArea.defaultProps = {
  disables: { }
}

export default withStyles(styles)(ActionsArea);
