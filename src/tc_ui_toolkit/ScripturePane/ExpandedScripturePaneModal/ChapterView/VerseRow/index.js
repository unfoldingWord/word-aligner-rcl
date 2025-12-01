import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
// components
import Verse from '../../../Verse';
// helpers
import {
  getBibleElement,
  getVerseDataFromBible,
  isVerseInSpan,
  verseString,
  verseArray,
} from '../../../helpers/verseHelpers';
import { getFontClassName } from '../../../../common/fontUtils';

const rowContainerStyles = {
  display: 'flex',
  margin: 0,
  color: 'var(--text-color-dark)',
};

class VerseRow extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleEdit(bibleId, chapter, verse, verseText) {
    const { onEditTargetVerse } = this.props;

    if (bibleId === 'targetBible' && typeof onEditTargetVerse === 'function') {
      onEditTargetVerse(bibleId, chapter, verse, verseText);
    }
  }

  render() {
    const {
      bibles,
      chapter,
      translate,
      contextId,
      selections,
      showPopover,
      getLexiconData,
      targetLanguageFont,
      currentVerseNumber,
      currentPaneSettings,
      evenVerse,
      showTargetUsfm,
    } = this.props;
    let verseCells = [];

    let rowStyle = {
      ...rowContainerStyles,
      width: '100%',
    };

    if (evenVerse) {
      rowStyle.backgroundColor = 'var(--background-color-light)';
    }

    if (currentPaneSettings.length > 0) {
      for (let i = 0, len = currentPaneSettings.length; i < len; i++) {
        const paneSetting = currentPaneSettings[i];

        try {
          let {
            font,
            bibleId,
            fontSize,
            languageId,
            owner,
          } = paneSetting;
          const bible = getBibleElement(bibles, languageId, bibleId, owner);
          const direction = bible?.manifest?.direction || 'ltr';
          let verseElements = [];
          let verseText = '';
          let verseLabel = '';
          let verseData = '';
          let blankVerse = false;

          if (bible) {
            const verseDataFromBible = getVerseDataFromBible(bible, chapter, currentVerseNumber);
            verseData = verseDataFromBible.verseData;
            verseLabel = verseDataFromBible.verseLabel;
            const { isVerseSpan, isFirstVerse } = isVerseInSpan(verseLabel, currentVerseNumber);
            blankVerse = isVerseSpan && !isFirstVerse;
            verseText = verseData;
          }

          let colStyle = {
            minWidth: '240px',
            alignItems: 'stretch',
            padding: '10px',
            paddingTop: '20px',
            borderRight: '1px solid var(--border-color)',
          };
          const isTargetBible = bibleId === 'targetBible';
          let fontClass = '';
          let showUsfm = false;

          if (isTargetBible) {
            font = targetLanguageFont;
            fontClass = getFontClassName (targetLanguageFont);
            showUsfm = showTargetUsfm;
          } else if (font) {
            fontClass = getFontClassName(font);
          }

          if (typeof verseData === 'string') { // if the verse content is string.
            verseElements = verseString(verseData, selections, translate, null, isTargetBible, fontClass, showUsfm);
          } else if (verseData) { // else the verse content is an array of verse objects.
            verseElements = verseArray(verseData, bibleId, contextId, getLexiconData, showPopover, translate, {}, fontClass);
          }

          if (fontSize) {
            colStyle.fontSize = `${fontSize}%`;
          }

          verseCells.push(
            <Col key={i.toString()} md={4} sm={4} xs={4} lg={4} style={colStyle}>
              {blankVerse ?
                <div/>
                :
                <Verse
                  chapter={chapter}
                  bibleId={bibleId}
                  translate={translate}
                  verseText={verseText}
                  direction={direction}
                  fontClass={fontClass}
                  onEdit={this.handleEdit}
                  verse={verseLabel || currentVerseNumber}
                  verseElements={verseElements}
                />
              }
            </Col>,
          );
        } catch (error) {
          console.error(`VerseRow: error rendering verse ${JSON.stringify(paneSetting)}`, error);
        }
      }
    }

    return (
      <Row style={rowStyle}>
        {verseCells}
      </Row>
    );
  }
}

VerseRow.propTypes = {
  chapter: PropTypes.number.isRequired,
  verse: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  currentVerseNumber: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  currentPaneSettings: PropTypes.array.isRequired,
  verseElements: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.array.isRequired,
  ]),
  onEditTargetVerse: PropTypes.func.isRequired,
  bibles: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  contextId: PropTypes.object.isRequired,
  selections: PropTypes.array.isRequired,
  getLexiconData: PropTypes.func.isRequired,
  showPopover: PropTypes.func.isRequired,
  targetLanguageFont: PropTypes.string,
  evenVerse: PropTypes.bool,
  showTargetUsfm: PropTypes.bool,
};

export default VerseRow;
