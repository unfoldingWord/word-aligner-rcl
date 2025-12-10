import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { getBibleElement } from '../../../helpers/verseHelpers';

const rowContainerStyles = {
  display: 'flex',
  height: '70px',
  margin: 0,
  marginRight: '12px',
  backgroundColor: 'var(--reverse-color)',
  minWidth: '500px',
};

const rowStyle = {
  display: 'flex',
  height: '80px',
  margin: '0',
  backgroundColor: 'var(--reverse-color)',
};

class BibleHeadingsRow extends Component {
  render() {
    const {
      currentPaneSettings,
      projectDetailsReducer,
      bibles,
    } = this.props;
    const bibleHeadings = [];

    for (let i = 0, len = currentPaneSettings.length; i < len; i++) {
      const {
        languageId,
        bibleId,
        owner,
        isPreRelease,
        description,
      } = currentPaneSettings[i];
      const bible = getBibleElement(bibles, languageId, bibleId, owner);
      const index = i;
      const {
        language_name,
        direction,
      } = bible?.manifest || {};

      const resourceText = bibleId !== 'targetBible' ? ` (${bibleId.toUpperCase()}) (${owner})` : '' ;
      let headingText = language_name + resourceText;
      let dir = direction;

      if (bibleId === 'viewURL') {
        headingText = `${language_name} (${description})`;
      }

      if (isPreRelease) {
        headingText = `[${headingText}] - ${isPreRelease}`;
      }

      if (!dir) {
        dir = projectDetailsReducer?.manifest?.target_language?.direction || 'ltr';
      }

      const colStyle = {
        minWidth: '240px', alignItems: 'stretch', padding: '10px', fontSize: '16px', fontWeight: 'bold',
        color: 'var(--text-color-dark)', borderRight: '1px solid var(--border-color)',
        borderBottom: '3px solid var(--border-color)', direction: dir,
        overflowX: 'hidden', overflowY: 'auto', overflowWrap: 'break-word',
      };

      bibleHeadings.push(
        <Col key={index} md={4} sm={4} xs={4} lg={4} style={colStyle} >
          <span>{headingText}</span>
        </Col>,
      );
    }

    return (
      <Row style={{...rowContainerStyles, ...rowStyle}}>
        {bibleHeadings}
      </Row>
    );
  }
}

BibleHeadingsRow.propTypes = {
  currentPaneSettings: PropTypes.array.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired,
  bibles: PropTypes.object.isRequired,
};

export default BibleHeadingsRow;
