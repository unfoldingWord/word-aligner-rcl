import React, { useState } from 'react';
import PropTypes from 'prop-types';
// components
import RenderSelectionTextComponent from '../RenderSelectionTextComponent';
import ThreeDotMenu from '../ThreeDotMenu';
import MyLanguageModal from '../MyLanguageModal';
import {
  getReferenceStr,
  getTitleStr,
  getTitleWithId,
  isLTR,
} from '../../ScripturePane/helpers/utils';
import { getFontClassName } from '../../common/fontUtils';
import '../VerseCheck.styles.css';
const NAMESPACE = 'CheckArea';

const SelectionArea = ({
  mode,
  translate,
  reference,
  verseText,
  selections,
  bookDetails,
  targetBible,
  toolsSettings,
  setToolSettings,
  openAlertDialog,
  maximumSelections,
  targetLanguageFont,
  targetLanguageDetails,
  changeSelectionsInLocalState,
}) => {
  const {
    book,
    direction,
    id:languageCode,
  } = targetLanguageDetails;
  const [isModalVisible, changeModalVisibility] = useState(false);
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
    <div className='selection-area-root'>
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
              handleMyLanguageModal={() => changeModalVisibility(true)}
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
              handleMyLanguageModal={() => changeModalVisibility(true)}
            />
            :
            ''
        }
        {
          isModalVisible &&
          <MyLanguageModal
            bookName={bookName}
            show={isModalVisible}
            translate={translate}
            fontSize={`${fontSize}%`}
            targetBible={targetBible}
            chapter={reference.chapter}
            currentVerse={reference.verse}
            targetLanguageFont={targetLanguageFont}
            targetLanguageDetails={targetLanguageDetails}
            languageDirection={direction || 'ltr'}
            onHide={() => changeModalVisibility(false)}
          />
        }
      </div>
      <div style={{ overflow: 'auto' }}>
        <div className={direction === 'ltr' ? 'ltr-content' : 'rtl-content'} style={textStyle}>
          <RenderSelectionTextComponent
            mode={mode}
            translate={translate}
            verseText={verseText}
            selections={selections}
            openAlertDialog={openAlertDialog}
            maximumSelections={maximumSelections}
            targetLanguageFontClassName={targetLanguageFontClassName}
            changeSelectionsInLocalState={changeSelectionsInLocalState}
          />
        </div>
      </div>
    </div>
  );
};


SelectionArea.propTypes = {
  mode: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  translate: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
  verseText: PropTypes.string.isRequired,
  selections: PropTypes.array.isRequired,
  targetBible: PropTypes.object.isRequired,
  bookDetails: PropTypes.object.isRequired,
  toolsSettings: PropTypes.object.isRequired,
  openAlertDialog: PropTypes.func.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  maximumSelections: PropTypes.number.isRequired,
  targetLanguageDetails: PropTypes.object.isRequired,
  changeSelectionsInLocalState: PropTypes.func.isRequired,
};

export default SelectionArea;
