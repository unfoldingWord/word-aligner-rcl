/**
 *  TranslationHelps is a feature of the TranslationWords tool and consists of:
 *   A collapible sidebar showing the complete artical sumarized in panel
 *     The sidebar has a sash that expands to about 20% of the application window
 *     The sash can collapse to about 0.25in
 *     The expanded sidebar vertically wraps article text and can scroll entire article
 *     When expanded the "See More" button in panel is hidden
 *
 *
 *   It interoperates with CheckInfoCard
 */

import React from 'react';
import PropTypes from 'prop-types';
// components
import ExpandedHelpsModal from './ExpandedHelpsModal';
import THelpsMarkDown from './THelpsMarkDown';

import './TranslationHelps.styles.css';
import { BsArrowsFullscreen } from 'react-icons/bs'
import { FaChevronCircleRight, FaChevronLeft } from 'react-icons/fa'

const TranslationHelps = ({
  modalArticle,
  article, // Article to display in sidebar and expanded modal
  expandedHelpsButtonHoverText, // Text to display when hovering over sash and expansion button
  openExpandedHelpsModal, // Function to open the expanded Translation Helps Modal
  isShowHelpsSidebar, // is the Translation helps sidebar displayed
  sidebarToggle, // toggle the translation helps sidebar
  isShowHelpsExpanded, // is the expanded Translation Helps modal displayed?
  modalTitle, // Title for the expanded helps modal
  translate,
  direction, // language direction
}) => {
  if (isShowHelpsSidebar) {
    return (
      <div className="helps-sash-container" style={{ direction }}>
        <div className="helps-sash-closed" onClick={sidebarToggle}>
          <FaChevronCircleRight
            style={{ cursor: 'pointer' }} />
        </div>
        <div className="helps">
          <div className="helps-title-bar">
            <BsArrowsFullscreen
              onClick={openExpandedHelpsModal}
              style={{ cursor: 'pointer' }}
              title={expandedHelpsButtonHoverText} />
          </div>
          <THelpsMarkDown article={article} />
        </div>
        <ExpandedHelpsModal
          translate={translate}
          show={isShowHelpsExpanded}
          onHide={openExpandedHelpsModal}
          title={modalTitle}
          article={modalArticle || article}
          direction={direction}
        />
      </div>
    );
  } else {
    return (
      <div className="helps-sash-closed" style={{ direction }} onClick={sidebarToggle}>
        <FaChevronLeft
          style={{ cursor: 'pointer' }}
          onClick={sidebarToggle}
        />
      </div>
    );
  }
};

TranslationHelps.propTypes = {
  modalArticle: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,
  expandedHelpsButtonHoverText: PropTypes.string.isRequired,
  openExpandedHelpsModal: PropTypes.func.isRequired,
  isShowHelpsSidebar: PropTypes.bool.isRequired,
  sidebarToggle: PropTypes.func.isRequired,
  isShowHelpsExpanded: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

TranslationHelps.defaultProps = {
  modalTitle: 'translationHelps',
  article: '',
  modalArticle: '',
  direction: 'ltr',
};

export default TranslationHelps;
