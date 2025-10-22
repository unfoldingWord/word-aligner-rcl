import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import {
  FormGroup, FormControl,
} from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { moveCursorToEnd } from '../../VerseEditor/helpers/editHelpers';
import { getFontClassName } from '../../common/fontUtils';

import './EditVerseArea.styles.css';
import { TfiPencil } from 'react-icons/tfi'

const styles = {
  formControlLabelRoot: { height: 30 },
  formControlLabel: {
    justifyContent: 'flex-start',
    fontSize: 16,
    color: 'var(--text-color-dark)',
  },
  checkBox: { '&$checked': { color: 'var(--accent-color-dark)' } },
  checked:{},
};

const EditVerseArea = ({
  tags,
  isVerseChanged,
  verseText,
  languageDirection,
  translate,
  classes,
  handleTagsCheckbox,
  handleEditVerse,
  checkIfVerseChanged,
  targetLanguageFont,
  targetLanguageFontSize,
}) => {
  const tagList1 = [
    ['spelling', translate('spelling')],
    ['punctuation', translate('punctuation')],
    ['wordChoice', translate('word_choice')],
  ];

  const tagList2 = [
    ['meaning', translate('meaning')],
    ['grammar', translate('grammar')],
    ['other', translate('other')],
  ];

  const checkboxesColumn1 = tagList1.map(tag =>
    <FormControlLabel
      key={tag[0]}
      disabled={!isVerseChanged}
      classes={{
        root: classes.formControlLabelRoot,
        label: classes.formControlLabel,
      }}
      control={
        <Checkbox
          classes={{
            root: classes.checkBox,
            checked:classes.checked,
          }}
          checked={tags.includes(tag[0])}
          onChange={() => handleTagsCheckbox(tag[0])}
          icon={<CheckBoxOutlineIcon style={{ fontSize: '24px' }} />}
          checkedIcon={<CheckBoxIcon style={{ fontSize: '24px' }} />}
        />
      }
      label={tag[1]}
    />,
  );

  const checkboxesColumn2 = tagList2.map(tag =>
    <FormControlLabel
      key={tag[0]}
      disabled={!isVerseChanged}
      classes={{
        root: classes.formControlLabelRoot,
        label: classes.formControlLabel,
      }}
      control={
        <Checkbox
          classes={{
            root: classes.checkBox,
            checked:classes.checked,
          }}
          checked={tags.includes(tag[0])}
          onChange={() => handleTagsCheckbox(tag[0])}
          icon={<CheckBoxOutlineIcon style={{ fontSize: '24px' }} />}
          checkedIcon={<CheckBoxIcon style={{ fontSize: '24px' }} />}
        />
      }
      label={tag[1]}
    />,
  );
  const checkBoxText = isVerseChanged ? translate('next_change_reason') : translate('first_make_change');
  const fontClass = getFontClassName(targetLanguageFont) || 'default-text'; // TRICKY defaulting to the 'default-text' class prevents 'form-control' class from resetting font-size to 14px

  return (
    <div className='edit-area'>
      <div style={{ fontWeight: 'bold' }}>
        <TfiPencil style={{ marginRight: '5px' }} />
        {translate('edit_verse')}
      </div>
      <FormGroup style={{
        flex: 'auto', display: 'flex', flexDirection: 'column', marginBottom: '5px',
      }} controlId='formControlsTextarea'>
        <div style={{ fontSize: targetLanguageFontSize }}> {/*apply desired font size multiplier before font class styling*/}
          <FormControl
            autoFocus
            onFocus={moveCursorToEnd}
            componentClass='textarea'
            type='text'
            defaultValue={verseText}
            className={fontClass}
            style={{
              flex: 'auto',
              minHeight: '110px',
              direction: languageDirection,
            }}
            onBlur={handleEditVerse}
            onInput={checkIfVerseChanged}
          />
        </div>
        <div style={{
          flex: '0 0 65px', marginTop: '5px', fontSize: '0.9em',
        }}>
          {checkBoxText}
          <br />
          <div style={{ display: 'flex' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', margin: '0px 0px 0px 15px',
            }}>
              {checkboxesColumn1}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', margin: '0px 0px 0px 15px',
            }}>
              {checkboxesColumn2}
            </div>
          </div>
        </div>
      </FormGroup>
    </div>
  );
};

EditVerseArea.propTypes = {
  translate: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  isVerseChanged: PropTypes.bool.isRequired,
  verseText: PropTypes.string.isRequired,
  languageDirection: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleTagsCheckbox: PropTypes.func.isRequired,
  handleEditVerse: PropTypes.func.isRequired,
  checkIfVerseChanged: PropTypes.func.isRequired,
  targetLanguageFont: PropTypes.string,
  targetLanguageFontSize: PropTypes.string.isRequired,
};

export default withStyles(styles)(EditVerseArea);
