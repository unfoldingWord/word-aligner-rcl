import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {OT_ORIG_LANG} from "../common/constants";
import delay from "../utils/delay";
import GroupMenuContainer from '../containers/GroupMenuContainer'
import ScripturePaneWrapper from './ScripturePaneWrapper'
import CheckInfoCardWrapper from './CheckInfoCardWrapper'
import VerseCheckWrapper from './VerseCheckWrapper'
import TranslationHelpsWrapper from './TranslationHelpsWrapper'

const lexiconCache_ = {};
const styles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
  },
  centerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowX: 'auto',
  },
  scripturePaneDiv: {
    display: 'flex',
    flexShrink: '0',
    height: '250px',
    paddingBottom: '20px',
  },
};


const Checker = ({  }) => {


  return (
    <div style={styles.containerDiv}>
      <GroupMenuContainer
        tc={tc}
        translate={translate}
        gatewayLanguageQuote={gatewayLanguageQuote}
      />
      <div style={styles.centerDiv}>
        <div style={styles.scripturePaneDiv}>
          <ScripturePaneWrapper
            tc={tc}
            toolApi={toolApi}
            translate={translate}
            onExpandedScripturePaneShow={onExpandedScripturePaneShow}
            editVerseInScrPane={editVerseInScrPane}
          />
        </div>
        <CheckInfoCardWrapper
          tc={tc}
          translate={translate}
          showHelps={showHelps}
          toggleHelps={() => setShowHelps(!showHelps)}
        />
        <VerseCheckWrapper
          tc={tc}
          toolApi={toolApi}
          translate={translate}
          contextId={contextId}
          gatewayLanguageQuote={gatewayLanguageQuote}
          editVerseInScripturePane={editVerseInExpandedScripturePane}
        />
      </div>
      <TranslationHelpsWrapper
        tc={tc}
        showHelps={showHelps}
        translate={translate}
        toggleHelps={() => setShowHelps(!showHelps)}
      />
    </div>

  );
};

Checker.propTypes = {
  contextId: PropTypes.object.isRequired,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showPopover: PropTypes.func.isRequired,
  sourceLanguage: PropTypes.string.isRequired,
  sourceLanguageFont: PropTypes.string,
  sourceFontSizePercent: PropTypes.number,
  targetLanguageFont: PropTypes.string,
  targetFontSizePercent: PropTypes.number,
  translate: PropTypes.func.isRequired,
  verseAlignments: PropTypes.array.isRequired,
  targetWords: PropTypes.array.isRequired,
};
export default Checker;
