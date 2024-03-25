/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TranslationHelps } from 'tc-ui-toolkit';
import { connect } from 'react-redux';
// helpers
import * as tHelpsHelpers from '../helpers/tHelpsHelpers';
// selectors
import {
  getContextId,
  getCurrentToolName,
  getGatewayLanguageCode,
  getGatewayLanguageDirection,
  getGatewayLanguageOwner,
  getResourcesReducer,
  getTranslationHelpsArticle,
} from '../selectors/index';

// resourcesReducer needs to be global so that the followTHelpsLink has the new article's content
let resourcesReducer = {};

function useTnArticleState(initialState) {
  const [
    {
      showHelpsModal, modalArticle, articleCategory,
    },
    setTnArticleState,
  ] = useState(initialState);

  return {
    showHelpsModal,
    modalArticle,
    articleCategory,
    setThState: (updatedValues) => {
      setTnArticleState(prevState => ({ ...prevState, ...updatedValues }));
    },
  };
}

function TranslationHelpsWrapper({
  contextId: { groupId = '' },
  showHelps,
  toggleHelps,
  translate,
  currentFile,
  gatewayLanguageCode,
  gatewayLanguageOwner,
  currentToolName,
  loadResourceArticle,
  resourcesReducer: resourcesReducerProp,
  direction,
}) {
  resourcesReducer = resourcesReducerProp;

  const initialState = {
    showHelpsModal: false,
    modalArticle: '',
    articleCategory: '',
  };
  const {
    showHelpsModal,
    modalArticle,
    articleCategory,
    setThState,
  } = useTnArticleState(initialState);

  /**
   * extract article from reducer if present.
   * @param {String} resourceType - subpath for resource such as 'translationAcademy'
   * @param {String} article - name of article to find
   * @return {String|null} - returns article if found
   */
  function getArticleFromReducer(resourceType, article) {
    const resources = resourcesReducer.translationHelps[resourceType];
    let articleData = resources && resources[article];
    return articleData;
  }

  /**
   * load the resource article for the link and display
   * @param {String} link
   * @return {boolean}
   */
  function followTHelpsLink(link) {
    const linkParts = link.split('/'); // link format: <lang>/<resource>/<category>/<article>
    const [lang, type, category, article] = linkParts;
    const resourceSubDir = tHelpsHelpers.getResourceDirByType(type);
    let articleData = getArticleFromReducer(resourceSubDir, article);

    if (!articleData) { // if not cached
      loadResourceArticle(resourceSubDir, article, lang, category, false, gatewayLanguageOwner); // do synchronous load
      articleData = getArticleFromReducer(resourceSubDir, article);
    }
    setThState({
      showHelpsModal: true,
      modalArticle: articleData || 'Cannot find an article for ' + link,
      articleCategory: category,
    });
    return true;
  }
  window.followLink = followTHelpsLink;

  useEffect(() => {
    if (groupId) {
      loadResourceArticle(currentToolName, groupId, gatewayLanguageCode, '', true, gatewayLanguageOwner); // do asynchronous load
    }
  }, [currentToolName, groupId, gatewayLanguageCode]);

  useEffect(() => {
    const page = document.getElementById('helpsbody');

    if (page) {
      page.scrollTop = 0;
    }
  }, []);

  function toggleHelpsModal() {
    setThState({
      showHelpsModal: !showHelpsModal,
      modalArticle: '',
    });
  }

  const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, gatewayLanguageCode);
  const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(modalArticle, gatewayLanguageCode, articleCategory);
  const expandedHelpsButtonHoverText = translate('click_show_expanded');

  return (
    <TranslationHelps
      translate={translate}
      article={currentFileMarkdown}
      modalArticle={tHelpsModalMarkdown}
      openExpandedHelpsModal={toggleHelpsModal}
      isShowHelpsSidebar={showHelps}
      sidebarToggle={toggleHelps}
      isShowHelpsExpanded={showHelpsModal}
      expandedHelpsButtonHoverText={expandedHelpsButtonHoverText}
      direction={direction}
    />
  );
}

TranslationHelpsWrapper.propTypes = {
  translate: PropTypes.func.isRequired,
  contextId: PropTypes.object.isRequired,
  showHelps: PropTypes.bool.isRequired,
  toggleHelps: PropTypes.func.isRequired,
  currentFile: PropTypes.string,
  gatewayLanguageCode: PropTypes.string.isRequired,
  gatewayLanguageOwner: PropTypes.string.isRequired,
  currentToolName: PropTypes.string.isRequired,
  resourcesReducer: PropTypes.object.isRequired,
  loadResourceArticle: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

export const mapStateToProps = (state, ownProps) => {
  const contextId = getContextId(state) || {};

  return {
    contextId,
    currentToolName: getCurrentToolName(ownProps),
    gatewayLanguageCode: getGatewayLanguageCode(ownProps),
    gatewayLanguageOwner: getGatewayLanguageOwner(ownProps),
    resourcesReducer: getResourcesReducer(ownProps),
    loadResourceArticle: ownProps.tc.loadResourceArticle,
    currentFile: getTranslationHelpsArticle(ownProps, contextId),
    direction: getGatewayLanguageDirection(ownProps),
  };
};

TranslationHelpsWrapper.defaultProps = { direction: 'ltr' };

export default connect(mapStateToProps)(TranslationHelpsWrapper);
