import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScripturePane } from 'tc-ui-toolkit';
import { getAvailableScripturePaneSelections } from '../helpers/resourcesHelpers';
import { getLexiconData } from '../helpers/lexiconHelpers';
import {
  getContextId,
  getBibles,
  getProjectManifest,
  getSelections,
  getProjectDetailsReducer,
  getCurrentPaneSettings,
  getUsername,
  getProjectPath,
  getCurrentToolName,
} from '../selectors';
import { editTargetVerse } from '../state/actions/verseEditActions';
import { contextNotEmpty } from '../utils/utils';

function ScripturePaneWrapper({
  bibles,
  manifest,
  contextId,
  translate,
  selections,
  showPopover,
  editTargetVerse,
  setToolSettings,
  complexScriptFonts,
  currentPaneSettings,
  projectDetailsReducer,
  addObjectPropertyToManifest,
  makeSureBiblesLoadedForTool,
  onExpandedScripturePaneShow,
  editVerseInScrPane,
}) {
  function makeTitle(manifest) {
    const { target_language, project } = manifest;

    if (target_language && target_language.book && target_language.book.name) {
      return target_language.book.name;
    } else {
      return project.name;
    }
  }

  function getScripturePaneSelections(resourceList) {
    getAvailableScripturePaneSelections(resourceList, contextId, bibles);
  }

  function ensureBiblesAreLoadedForTool() {
    makeSureBiblesLoadedForTool(contextId);
  }

  let contextId_ = contextId;

  if (contextId && contextId.verseSpan) { // if we have a verse span, create new contextId with verse span
    contextId_ = {
      ...contextId,
      reference: {
        ...contextId.reference,
        verse: contextId.verseSpan,
      },
    };
  }

  const expandedScripturePaneTitle = makeTitle(manifest);

  function renderScripturePane() {
    if (contextNotEmpty(contextId)) {
      return (
        <ScripturePane
          editVerseRef={editVerseInScrPane}
          bibles={bibles}
          contextId={contextId_}
          translate={translate}
          selections={selections}
          showPopover={showPopover}
          getLexiconData={getLexiconData}
          editTargetVerse={editTargetVerse}
          setToolSettings={setToolSettings}
          complexScriptFonts={complexScriptFonts}
          currentPaneSettings={currentPaneSettings}
          projectDetailsReducer={projectDetailsReducer}
          expandedScripturePaneTitle={expandedScripturePaneTitle}
          addObjectPropertyToManifest={addObjectPropertyToManifest}
          makeSureBiblesLoadedForTool={ensureBiblesAreLoadedForTool}
          getAvailableScripturePaneSelections={getScripturePaneSelections}
          onExpandedScripturePaneShow={onExpandedScripturePaneShow}
        />
      );
    } else {
      return null;
    }
  }

  return renderScripturePane();
}

ScripturePaneWrapper.propTypes = {
  bibles: PropTypes.object.isRequired,
  manifest: PropTypes.object.isRequired,
  contextId: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  selections: PropTypes.array.isRequired,
  complexScriptFonts: PropTypes.object.isRequired,
  currentPaneSettings: PropTypes.array.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired,
  // actions
  showPopover: PropTypes.func.isRequired,
  editTargetVerse: PropTypes.func.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  makeSureBiblesLoadedForTool: PropTypes.func.isRequired,
  editVerseInScrPane: PropTypes.string, // if given then open verse for edit (single verse)
  onExpandedScripturePaneShow: PropTypes.func.isRequired, // called when expanded Scripture Pane as shown or hidden
};

export const mapStateToProps = (state, ownProps) => ({
  bibles: getBibles(ownProps),
  contextId: getContextId(state),
  selections: getSelections(state),
  showPopover: ownProps.tc.showPopover,
  manifest: getProjectManifest(ownProps),
  setToolSettings: ownProps.tc.setToolSettings,
  complexScriptFonts: ownProps.tc.complexScriptFonts,
  currentPaneSettings: getCurrentPaneSettings(ownProps),
  projectDetailsReducer: getProjectDetailsReducer(ownProps),
  makeSureBiblesLoadedForTool: ownProps.tc.makeSureBiblesLoadedForTool,
  addObjectPropertyToManifest: ownProps.tc.addObjectPropertyToManifest,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    tc: {
      showAlert,
      closeAlert,
      updateTargetVerse,
      showIgnorableAlert,
      gatewayLanguageCode,
    },
    toolApi,
    translate,
    gatewayLanguageQuote,
  } = ownProps;
  const username = getUsername(ownProps);
  const currentToolName = getCurrentToolName(ownProps);
  const projectSaveLocation = getProjectPath(ownProps);

  return {
    editTargetVerse: (chapter, verse, before, after, tags) => {
      dispatch(editTargetVerse(chapter, verse, before, after, tags, username, gatewayLanguageCode, gatewayLanguageQuote, projectSaveLocation, currentToolName, translate, showAlert, closeAlert, showIgnorableAlert, updateTargetVerse, toolApi));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScripturePaneWrapper);
