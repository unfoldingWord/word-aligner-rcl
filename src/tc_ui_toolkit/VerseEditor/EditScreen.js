import React from 'react';
import PropTypes from 'prop-types';
import { isLTR } from '../ScripturePane/helpers/utils';
import { moveCursorToEnd } from './helpers/editHelpers';

/**
 * @callback EditScreen~onChange
 * @param {string} newVerse - the edited verse
 */

/**
 * Renders a text area for editing the verse
 * @property {string} verseText - the verse text to edit
 * @property {EditScreen~onChange} onChange - callback when the text has changed
 */
class EditScreen extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(event) {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    const {
      rows,
      style,
      verseText,
      targetLanguageFontClassName,
      targetLanguageFontSize,
      direction,
    } = this.props;
    const className = targetLanguageFontClassName ? `edit-screen ${targetLanguageFontClassName}` : 'edit-screen';
    const style_ = {
      ...style,
      textAlign: isLTR(direction) ? 'left' : 'right',
      direction,
    };
    return (
      <div style={{ fontSize: targetLanguageFontSize }}> {/*apply desired font size multiplier before font class styling*/}
        <textarea
          id="verse-editor-field"
          rows={rows}
          className={className}
          autoFocus={true}
          onFocus={moveCursorToEnd}
          onChange={this._handleChange}
          value={verseText}
          style={style_}
        />
      </div>
    );
  }
}

EditScreen.propTypes = {
  rows: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  verseText: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  targetLanguageFontClassName: PropTypes.string,
  targetLanguageFontSize: PropTypes.string,
};

EditScreen.defaultProps = {
  rows: 4,
  style: {},
  direction: 'ltr',
  targetLanguageFontSize: '100%',
};

export default EditScreen;
