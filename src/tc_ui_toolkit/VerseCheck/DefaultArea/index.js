import React from 'react';
import PropTypes from 'prop-types';
import { selectionArray, normalizeString } from '../helpers/selectionHelpers';
import { occurrencesInString } from '../helpers/stringHelpers';
import MyLanguageModal from '../MyLanguageModal';
import ThreeDotMenu from '../ThreeDotMenu';
import { getFontClassName } from '../../common/fontUtils';
import {
  getReferenceStr,
  getTitleStr,
  getTitleWithId,
  isLTR,
} from '../../ScripturePane/helpers/utils';
// styling
import '../VerseCheck.styles.css';
const NAMESPACE = 'CheckArea';

class DefaultArea extends React.Component {
  constructor() {
    super();
    this.state = {
      inBox: false,
      modalVisibility: false,
    };
  }

  displayText(verseText, selections, targetLanguageFontClassName) {
    const { validateSelections } = this.props;
    // normalize whitespace for text rendering in order to display highlights with more than one space since html selections show one space
    verseText = normalizeString(verseText);
    let verseTextSpans = <span className={targetLanguageFontClassName}>{verseText}</span>;

    if (selections && selections.length > 0) {
      let _selectionArray = selectionArray(verseText, selections);

      for (let j = 0, len = selections.length; j < len; j++) {
        const selection = selections[j];
        selection.selected = true; // default to enabled

        if (occurrencesInString(verseText, selection.text) !== selection.occurrences) {
          // validate selection and disable if invalid
          const { selectionsChanged } = validateSelections(verseText, [selection]);
          if (selectionsChanged) {
            selection.selected = false;
          }
        }
      }

      verseTextSpans = [];

      for (let i = 0, len = _selectionArray.length; i < len; i++) {
        const selection = _selectionArray[i];
        const index = i;
        let style = selection.selected ? { backgroundColor: 'var(--highlight-color)' } : {};

        verseTextSpans.push(
          <span key={index} className={targetLanguageFontClassName} style={style}>
            {selection.text}
          </span>,
        );
      }
    }
    return (
      <div style={{ userSelect: 'none', color: 'var(--text-color-light)' }}>
        {verseTextSpans}
      </div>
    );
  }

  render() {
    const {
      translate,
      reference,
      verseText,
      selections,
      targetBible,
      bookDetails,
      toolsSettings,
      setToolSettings,
      targetLanguageFont,
      targetLanguageDetails,
    } = this.props;
    const {
      book,
      direction,
      id:languageCode,
    } = targetLanguageDetails;
    const bookName = book && book.name ? book.name : bookDetails.name;
    const languageName = targetLanguageDetails.name || null;
    const languageStr = getTitleWithId(languageName, languageCode);
    const refStr = getReferenceStr(reference.chapter, reference.verse);
    const title = getTitleStr(bookName, refStr);
    const isLTR_ = isLTR(direction);
    const style = { display: 'flex', flexDirection: 'column' };
    const targetLanguageFontClassName = getFontClassName(targetLanguageFont);
    const verseTitleClassName = targetLanguageFontClassName ? `verse-title-title ${targetLanguageFontClassName}` : 'verse-title-title';
    const verseSubtitleClassName = targetLanguageFontClassName ? `verse-title-subtitle ${targetLanguageFontClassName}` : 'verse-title-subtitle';
    const lineHeightStyle = targetLanguageFontClassName ? { lineHeight: 1.4, padding: targetLanguageFontClassName.includes('Awami') ? '0 0 10px' : 0 } : {};
    const { fontSize } = toolsSettings[NAMESPACE] || {};
    const textStyle = fontSize ? { fontSize: `${fontSize}%` } : {};

    if (!isLTR_) { // for RTL
      style.justifyContent = 'right';
      style.width = '100%';
      style.direction = 'rtl';
      style.paddingRight = '15px';
    }

    return (
      <div style={{
        WebkitUserSelect: 'none',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className='verse-title'>
          {/* put icon here if RTL */}
          {
            isLTR_ ?
              ''
              :
              <ThreeDotMenu
                namespace={NAMESPACE}
                toolsSettings={toolsSettings}
                setToolSettings={setToolSettings}
                label={translate('expand_verses')}
                title={translate('click_show_expanded')}
                handleMyLanguageModal={() => this.setState({ modalVisibility: true })}
              />
          }
          <div className='pane' style={style}>
            <span className={verseTitleClassName} style={lineHeightStyle}>
              {languageStr}
            </span>
            <span className={verseSubtitleClassName} style={lineHeightStyle}>
              {title}
            </span>
          </div>
          {/* put icon here if LTR */}
          {
            isLTR_ ?
              <ThreeDotMenu
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                namespace={NAMESPACE}
                toolsSettings={toolsSettings}
                setToolSettings={setToolSettings}
                label={translate('expand_verses')}
                title={translate('click_show_expanded')}
                handleMyLanguageModal={() => this.setState({ modalVisibility: true })}
              />
              :
              ''
          }
          <MyLanguageModal
            bookName={bookName}
            translate={translate}
            targetBible={targetBible}
            fontSize={`${fontSize}%`}
            chapter={reference.chapter}
            currentVerse={reference.verse}
            show={this.state.modalVisibility}
            targetLanguageFont={targetLanguageFont}
            targetLanguageDetails={targetLanguageDetails}
            languageDirection={direction || 'ltr'}
            onHide={() => this.setState({ modalVisibility: false })}
          />
        </div>
        <div className={direction === 'ltr' ? 'ltr-content' : 'rtl-content'} style={textStyle}>
          {this.displayText(verseText, selections, targetLanguageFontClassName)}
        </div>
      </div>
    );
  }
}

DefaultArea.propTypes = {
  targetLanguageFont: PropTypes.string,
  translate: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
  selections: PropTypes.array.isRequired,
  verseText: PropTypes.string.isRequired,
  bookDetails: PropTypes.object.isRequired,
  targetBible: PropTypes.object.isRequired,
  toolsSettings: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  validateSelections: PropTypes.func.isRequired,
  targetLanguageDetails: PropTypes.object.isRequired,
};

export default DefaultArea;
