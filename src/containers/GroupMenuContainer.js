/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupMenuComponent from '../tc_ui_toolkit/GroupMenuComponent';
// Actions
import { loadGroupsIndex, clearGroupsIndex } from '../state/actions/groupsIndexActions';
import { loadGroupsData, clearGroupsData } from '../state/actions/groupsDataActions';
import {
  loadCurrentContextId, changeCurrentContextId, clearContextId,
} from '../state/actions/contextIdActions';
// Selectors
import {
  getGroupsIndex,
  getGroupsData,
  getContextId,
  getGatewayLanguageCode,
  getGatewayLanguageOwner,
  getProjectPath,
  getProjectManifest,
  getUserData,
  getBookName,
  getCurrentToolName,
} from '../selectors/index';
import { contextNotEmpty } from '../utils/utils';

function GroupMenuContainer({
  bookName,
  translate,
  gatewayLanguageCode,
  currentToolName,
  projectSaveLocation,
  contextId,
  groupsData,
  groupsIndex,
  loadGroupsIndex,
  clearGroupsIndex,
  loadGroupsData,
  clearGroupsData,
  loadCurrentContextId,
  changeCurrentContextId,
  clearContextId,
  manifest,
}) {
  useEffect(() => {
    loadGroupsIndex(gatewayLanguageCode, currentToolName, projectSaveLocation, translate);

    return () => {
      // Clean up groupsIndex on unmount
      clearGroupsIndex();
    };
  }, [currentToolName]);

  useEffect(() => {
    loadGroupsData(currentToolName, projectSaveLocation);

    return () => {
      // Clean up groupsData on unmount
      clearGroupsData();
    };
  }, [currentToolName]);

  useEffect(() => {
    loadCurrentContextId();

    return () => {
      clearContextId();
    };
  }, [currentToolName]);

  if (contextNotEmpty(contextId) && manifest) {
    const direction = manifest.target_language && manifest.target_language.direction || '';
    const projectFont = manifest.projectFont || '';
    return (
      <GroupMenuComponent
        bookName={bookName}
        translate={translate}
        contextId={contextId}
        groupsData={groupsData}
        groupsIndex={groupsIndex}
        targetLanguageFont={projectFont}
        changeCurrentContextId={changeCurrentContextId}
        direction={direction}
      />
    );
  } else {
    return null;
  }
}

GroupMenuContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  gatewayLanguageCode: PropTypes.string.isRequired,
  gatewayLanguageOwner: PropTypes.string.isRequired,
  currentToolName: PropTypes.string.isRequired,
  projectSaveLocation: PropTypes.string.isRequired,
  manifest: PropTypes.object.isRequired,
  contextId: PropTypes.object.isRequired,
  groupsData: PropTypes.object.isRequired,
  groupsIndex: PropTypes.array.isRequired,
  // Actions
  loadGroupsIndex: PropTypes.func.isRequired,
  clearGroupsIndex: PropTypes.func.isRequired,
  loadGroupsData: PropTypes.func.isRequired,
  clearGroupsData: PropTypes.func.isRequired,
  loadCurrentContextId: PropTypes.func.isRequired,
  clearContextId: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  groupsData: getGroupsData(state),
  groupsIndex: getGroupsIndex(state),
  contextId: getContextId(state),
  gatewayLanguageCode: getGatewayLanguageCode(ownProps),
  gatewayLanguageOwner: getGatewayLanguageOwner(ownProps),
  currentToolName: getCurrentToolName(ownProps),
  projectSaveLocation: getProjectPath(ownProps),
  manifest: getProjectManifest(ownProps),
  userData: getUserData(ownProps),
  bookName: getBookName(ownProps),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    gatewayLanguageQuote,
    tc: {
      gatewayLanguageCode,
      gatewayLanguageOwner,
      targetBook,
    },
  } = ownProps;
  const projectSaveLocation = getProjectPath(ownProps);
  const { project: { id: bookId } } = getProjectManifest(ownProps);
  const currentToolName = getCurrentToolName(ownProps);
  const userData = getUserData(ownProps);

  return {
    loadGroupsIndex: (gatewayLanguageCode, currentToolName, projectSaveLocation, translate) => {
      dispatch(loadGroupsIndex(gatewayLanguageCode, currentToolName, projectSaveLocation, translate, gatewayLanguageOwner));
    },
    clearGroupsIndex: () => clearGroupsIndex(),
    loadGroupsData: (currentToolName, projectSaveLocation) => {
      dispatch(loadGroupsData(currentToolName, projectSaveLocation, targetBook));
    },
    clearGroupsData: () => clearGroupsData(),
    loadCurrentContextId: () => {
      dispatch(loadCurrentContextId(currentToolName, bookId, projectSaveLocation, userData, gatewayLanguageCode, gatewayLanguageQuote));
    },
    changeCurrentContextId: (item = null) => {
      const contextId = item.contextId || null;
      dispatch(changeCurrentContextId(contextId, projectSaveLocation, userData, gatewayLanguageCode, gatewayLanguageQuote));
    },
    clearContextId: () => clearContextId(),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMenuContainer);
