import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import GroupMenuComponent from './GroupMenuComponent'
import {
  groupDataHelpers,
  selectionsHelpers,
  UsfmFileConversionHelpers,
  verseHelpers
} from 'word-aligner-lib'
import isEqual from 'deep-equal'
import {
  findCheck,
  findNextCheck,
  findPreviousCheck,
  getAlignedGLText,
  getPhraseFromTw,
  getTitleFromIndex,
  parseTwToIndex
} from '../helpers/translationHelps/twArticleHelpers'
import CheckInfoCard from '../tc_ui_toolkit/CheckInfoCard'
import { parseTnToIndex } from '../helpers/translationHelps/tnArticleHelpers'
import ScripturePane from '../tc_ui_toolkit/ScripturePane'
import PopoverContainer from '../containers/PopoverContainer'
import { NT_ORIG_LANG, OT_ORIG_LANG } from '../common/BooksOfTheBible'
import complexScriptFonts from '../common/complexScriptFonts'
import TranslationHelps from '../tc_ui_toolkit/TranslationHelps'
import * as tHelpsHelpers from '../helpers/tHelpsHelpers'
import VerseCheck from '../tc_ui_toolkit/VerseCheck'
import { getScriptureFromReference } from '../helpers/checkInfoCardHelpers'



const localStyles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    width: '97vw',
    height: '65vw',
  },
  centerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    overflowX: 'auto',
    marginLeft: '10px',
  },
  scripturePaneDiv: {
    display: 'flex',
    flexShrink: '0',
    height: '250px',
    paddingBottom: '20px',
  },
};

export const translationWords = 'translationWords'
export const translationNotes = 'translationNotes'

console.log('Checker.js - startup')
const name = 'Checker'

/**
 * @namespace Checker
 * The Checker component is responsible for managing and presenting Bible checking data and translations.
 * It handles state updates, settings management, and ensures the necessary data is loaded and displayed to the user.
 *
 * @param {object} parameters - An object with initialization parameters for the Checker component.
 * @param {object} parameters.alignedGlBible - The aligned Gateway Language Bible data used for translations.
 * @param {object} parameters.bibles - Bible data for various languages.
 * @param {Function} parameters.changedCurrentCheck - callback to notify of changes in context.
 * @param {Function} parameters.changeTargetVerse - A function to update the current verse being checked.
 * @param {object} parameters.checkingData - Data related to checks (e.g., translation notes or translation words).
 * @param {string} parameters.checkType - The type of check being performed (e.g., translation notes, translation words).
 * @param {object} parameters.contextId - Object containing metadata about the current group/verse being worked on.
 * @param {Function} parameters.getLexiconData - Function to retrieve lexicon data.
 * @param {object} parameters.glWordsData - Data related to Gateway Language words and alignment information.
 * @param {object} parameters.initialSettings - The initial configuration values for the Checker component.
 * @param {Function} parameters.saveCheckingData - Function to save the modified checking data.
 * @param {Function} parameters.saveSettings - Function to persist user's component settings.
 * @param {Function} parameters.showDocument - Function to display a document in the interface.
 * @param {object} parameters.styles - Styling information to customize the component's appearance.
 * @param {object} parameters.targetBible - The target Bible data for the working language.
 * @param {object} parameters.targetLanguageDetails - Metadata about the target language, including book and language-specific details.
 * @param {Function} parameters.translate - A function used for string translations in the UI.
 */
const Checker = ({
  alignedGlBible,
  bibles: bibles_,
  changedCurrentCheck,
  changeTargetVerse,
  checkingData,
  checkType,
  contextId,
  getLexiconData,
  glWordsData,
  initialSettings,
  saveCheckingData,
  saveSettings,
  showDocument,
  styles,
  targetBible: targetBible_,
  targetLanguageDetails,
  translate,
}) => {
  const [settings, _setSettings] = useState({
    paneSettings: [],
    paneKeySettings: {},
    toolsSettings: {},
    manifest: {}
  })
  const {
    paneSettings,
    paneKeySettings,
    toolsSettings,
    manifest
  } = settings
  const [bibles, setBibles] = useState({ })
  const [targetBible, setTargetBible] = useState(targetBible_)
  const [tempCheckingData, setTempCheckingData] = useState(null)
  const [localCheckingData, setLocalCheckingData] = useState(null)
  const [state, _setState] = useState({
    alignedGLText: '',
    article: null,
    currentCheck: null,
    currentCheckingData: null,
    groupTitle: '',
    groupPhrase: '',
    groupsData: null,
    groupsIndex: null,
    isCommentChanged: false,
    isVerseChanged: false,
    mode: 'default',
    newVerseText: null,
    popoverProps: {
      popoverVisibility: false
    },
    showHelpsModal: false,
    showHelps: true,
    newTags: null,
    verseText: '',
  })

  const {
    alignedGLText,
    article,
    currentCheck,
    currentCheckingData,
    groupTitle,
    groupPhrase,
    groupsData,
    groupsIndex,
    isCommentChanged,
    isVerseChanged,
    mode,
    newVerseText,
    popoverProps,
    showHelpsModal,
    showHelps,
    newTags,
    verseText,
  } = state

  function setState(newState) {
    _setState(prevState => ({ ...prevState, ...newState }))
  }

  function getCurrentValueFor(key) {
    if (localCheckingData?.hasOwnProperty(key)) {
      return localCheckingData[key]
    }
    return currentCheck?.[key]
  }

  function getTempValueFor(key) {
    if (tempCheckingData?.hasOwnProperty(key)) {
      return tempCheckingData[key]
    }
    return getCurrentValueFor(key)
  }

  const currentSelections = getCurrentValueFor('selections') || []
  const tempSelections = getTempValueFor('selections') || []
  const tempNothingToSelect = getTempValueFor('nothingToSelect')
  const currentNothingToSelect = getCurrentValueFor('nothingToSelect')
  const groupsDataLoaded = !!groupsData

  function updateModeForSelections(newSelections, nothingToSelect) {
    const noSelections = (!newSelections?.length)
    const newMode = noSelections && !nothingToSelect ? 'select' : 'default'
    setState({
      mode: newMode
    })
  }

  useEffect(() => {
    const haveData = checkingData && Object.keys(checkingData).length && glWordsData && Object.keys(glWordsData).length
    const groupsDataInitialized = groupsData && Object.keys(groupsData).length
    if (haveData && !groupsDataInitialized) {
      let flattenedGroupData = null
      let groupsIndex = null
      if (checkingData) {
        flattenedGroupData = groupDataHelpers.flattenGroupData(checkingData)
      }

      if (glWordsData) {
        if (checkType === translationNotes) {
          groupsIndex = parseTnToIndex(glWordsData)
        } else {
          groupsIndex = parseTwToIndex(glWordsData)
        }
      }

      const check = findCheck(flattenedGroupData, contextId, true)
      const newState = {
        groupsData: flattenedGroupData,
        groupsIndex,
        currentCheckingData: checkingData,
        currentCheck: check,
        modified: false,
        isCommentChanged: false,
      }

      // validate all checks
      selectionsHelpers.validateSelectionsForAllChecks(targetBible, flattenedGroupData, (check, invalidated) => {
        if (check) {
          console.log(`${name}-saveEditVerse - check validation changed`, check)
          _saveCheckingData(check, { invalidated })
        }
      })

      setState(newState)

      if (flattenedGroupData && check?.contextId) {
        updateContext(check, groupsIndex)
        updateModeForSelections(check?.selections, check?.nothingToSelect)
      }
    }
  }, [contextId, checkingData, glWordsData]);

  function updateContext(newCheck, groupsIndex_ = groupsIndex) {
    const contextId = newCheck?.contextId
    const reference = contextId?.reference
    const verseText = verseHelpers.getVerseTextFromBible(targetBible, reference)
    const alignedGLText = getAlignedGLText(alignedGlBible, contextId);
    const groupTitle = getTitleFromIndex(groupsIndex_, contextId?.groupId)
    const groupPhrase =
      checkType === translationNotes
        ? contextId?.occurrenceNote
        : getPhraseFromTw(glWordsData, contextId?.groupId)

    let groupData
    if (glWordsData) {
      if (checkType === translationNotes) {
        groupData = {
          translate: {
            articles: glWordsData?.translate
          }
        }
      } else {
        groupData = {
          ...glWordsData,
          manifest: {}
        }
      }
    }

    let _article
    const articleId = contextId?.groupId
    const groupsIds = Object.keys(groupData)
    for (const _groupId of groupsIds) {
      const group = groupData[_groupId]
      const articles = group?.articles || {}
      _article = articles?.[articleId] || null
      if (_article) {
        const currentArticleMarkdown = tHelpsHelpers.convertMarkdownLinks(_article, gatewayLanguageId);
        _article = currentArticleMarkdown
        // const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(modalArticle, gatewayLanguageCode, articleCategory);
        break
      }
    }

    setState({
      alignedGLText,
      currentCheck: newCheck,
      verseText,
      groupTitle,
      groupPhrase,
      article: _article
    })
  }

  const commentText = getCurrentValueFor('comments') || ''
  const bookId = targetLanguageDetails?.book?.id
  const bookName = targetLanguageDetails?.book?.name
  const bookDetails = {
    id: bookId,
    name: bookName
  };
  const gatewayLanguageId = targetLanguageDetails?.gatewayLanguageId
  const targetLanguageFont = manifest?.projectFont || ''
  const currentContextId = currentCheck?.contextId

  const setToolSettings = (NAMESPACE, fieldName, fieldValue) => {
    console.log(`${name}-setToolSettings ${fieldName}=${fieldValue}`)
    if (toolsSettings) {
      // Deep cloning object to avoid modifying original object
      const _toolsSettings = { ...toolsSettings };
      let componentSettings = _toolsSettings?.[NAMESPACE]
      if (!componentSettings) {
        componentSettings = { }
        _toolsSettings[NAMESPACE] = componentSettings
      }
      componentSettings[fieldName] = fieldValue
      setSettings({ toolsSettings: _toolsSettings }, true)
    }
  }

  /**
   * persist the settings, but first clear out bible data before saving settings
   * @param {object} _settings
   * @private
   */
  function _saveSettings(_settings) {
    if (saveSettings && _settings) {
      const newSettings = { ..._settings }
      delete newSettings.manifest
      const _paneSettings = [ ...newSettings.paneSettings ]
      for (let i = 0; i < _paneSettings.length; i++) {
        const _paneSetting = {..._paneSettings[i]} // shallow copy
        if (_paneSetting?.book) {
          delete _paneSetting.book // remove all the book data before saving
        }
        _paneSettings[i] = _paneSetting
      }
      newSettings.paneSettings = _paneSettings

      const _paneKeySettings = { ...newSettings.paneKeySettings }
      const keys = Object.keys(_paneKeySettings)
      for (const key of keys) {
        const _paneSetting = {..._paneKeySettings[key]} // shallow copy
        if (_paneSetting?.book) {
          delete _paneSetting.book // remove all the book data before saving
        }
        _paneKeySettings[key] = _paneSetting
      }
      newSettings.paneKeySettings = _paneKeySettings

      saveSettings(newSettings)
    }
  }

  function setSettings(newSettings, doSave = false) {
    const _settings = {
      ...settings,
      ...newSettings
    }

    _setSettings(_settings)
    doSave && _saveSettings(_settings)
  }

  const setToolSettingsScripture = (NAMESPACE, fieldName, _paneSettings) => {
    console.log(`${name}-setToolSettingsScripture ${fieldName}`, _paneSettings)
    const _paneKeySettings = {...paneKeySettings}

    for (const paneSettings of _paneSettings) {
      const languageId = paneSettings?.languageId
      const key = `${languageId}/${paneSettings?.bibleId}/${paneSettings?.owner}`
      _paneKeySettings[key] = paneSettings
    }

    const _settings = {
      paneSettings: _paneSettings,
      paneKeySettings: _paneKeySettings,
    }

    setSettings(_settings, true)
  }

  const addObjectPropertyToManifest = (fieldName, fieldValue) => {
    console.log(`${name}-addObjectPropertyToManifest ${fieldName}=${fieldValue}`)
    if (manifest) {
      const _manifest = {
        ...manifest,
        [fieldName]: fieldValue
      }

      // also save this in appSettings
      const appSettings = settings.appSettings || {}
      const _appSettings = {
        ...appSettings,
        [fieldName]: fieldValue
      }

      setSettings({
        manifest: _manifest,
        appSettings: _appSettings
      }, true)
    }
  }

  const openAlertDialog = () => {
    console.log(`${name}-openAlertDialog`)
  }

  const checkIfVerseChanged = (e) => {
    console.log(`${name}-checkIfVerseChanged`)
    const _newVerseText = e.target.value
    const _isVerseChanged = _newVerseText !== verseText
    setState({ isVerseChanged: _isVerseChanged });
  }

  const handleEditVerse = (e) => {
    console.log(`${name}-handleEditVerse`)
    const _newVerseText = e.target.value
    setState({ newVerseText: _newVerseText });
  }

  const cancelEditVerse = () => {
    console.log(`${name}-cancelEditVerse`)
    setState({ newVerseText: null, newTags: [], mode: "default" });
  }

  const saveEditVerse = () => {
    console.log(`${name}-saveEditVerse`)
    const { chapter, verse } = currentContextId.reference;
    const verseRef = currentContextId.verseSpan || verse; // if in verse span, use it
    const before = targetBible[chapter][verseRef];

    setState({
      newVerseText: null,
      newTags: [],
      mode: "default",
      isVerseChanged: false,
    });
    editTargetVerse(chapter, verseRef, before, newVerseText);
  }

  function handleGoToNext() {
    console.log(`${name}-handleGoToNext`)
    const nextCheck = findNextCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(nextCheck, true)
  }

  function handleGoToPrevious() {
    console.log(`${name}-handleGoToPrevious`)
    const previousCheck = findPreviousCheck(groupsData, currentContextId, false)
    changeCurrentCheck_(previousCheck, true)
  }

  const maximumSelections = 10

  const handleTagsCheckbox = (tag) => {
    console.log(`${name}-handleTagsCheckbox`, tag)
    const currentTags = newTags || []
    const tagIndex = currentTags.indexOf(tag);
    let _newTags;

    if (tagIndex > -1) {
      const copy = currentTags.slice(0);
      copy.splice(tagIndex, 1);
      _newTags = copy;
    } else {
      _newTags = [...currentTags, tag];
    }

    setState({ newTags: _newTags });
  }

  const validateSelections = (verseText_, selections_) => {
    console.log(`${name}-validateSelections`, selections_)
    return selectionsHelpers.validateVerseSelections(verseText_, selections_)
  }

  const unfilteredVerseText = useMemo(() => {
    let unfilteredVerseText_ = ''
    const reference = currentContextId?.reference
    const chapter = reference?.chapter
    const verse = reference?.verse
    if (chapter && verse) {
      const verseData = targetBible?.[chapter]?.[verse]
      if (verseData) {
        unfilteredVerseText_ = verseData
        if (typeof verseData !== 'string') {
          unfilteredVerseText_ = UsfmFileConversionHelpers.getUsfmForVerseContent(verseData)
        }
      }
    }

    return unfilteredVerseText_
  }, [targetBible, currentContextId])

  const setTempCheckingItem = (key, value) => {
    const newCheckingData = tempCheckingData ? {...tempCheckingData} : {}
    newCheckingData[key] = value
    setTempCheckingData(newCheckingData)
  }

  const changeSelectionsInLocalState = (selections) => {
    console.log(`${name}-changeSelectionsInLocalState`, selections)
    setTempCheckingItem('selections', selections)
  }
  const toggleNothingToSelect = (select) => {
    console.log(`${name}-toggleNothingToSelect`, select)
    setTempCheckingItem('nothingToSelect', select)
  }

  const changeCurrentCheck_ = (newContext, noCheck = false) => {
    const newContextId = newContext?.contextId
    console.log(`${name}-changeCurrentContextId`, newContextId)

    const selectionsUnchanged = isEqual(currentSelections, tempSelections)
    if (noCheck || selectionsUnchanged) {
      if (newContextId) {
        let check = findCheck(groupsData, newContextId, false)
        updateContext(newContext)
        if (check) {
          setLocalCheckingData(null)
          setTempCheckingData(null)
          updateModeForSelections(check.selections, check.nothingToSelect)
        }
      }
    } else {
      console.log('Checker.changeCurrentContextId - unsaved changes')
    }
    changedCurrentCheck && changedCurrentCheck(newContext)
  }

  const direction = 'ltr'
  const bookmarkEnabled = getCurrentValueFor('reminders')
  const isVerseEdited = !!getCurrentValueFor('verseEdits')
  const isVerseInvalidated = !!getCurrentValueFor('invalidated')

  const _saveSelection = () => {
    console.log(`${name}-_saveSelection persist to file`)
    const { checkInGroupsData, _currentCheck, newState, _newCheckingData } = cloneDataForSaving()

    if (_currentCheck && newState) {
      if (tempNothingToSelect) {
        _newCheckingData.nothingToSelect = tempNothingToSelect
        _newCheckingData.selections = false
        _newCheckingData.invalidated = false
      } else {
        _newCheckingData.nothingToSelect = false
        _newCheckingData.selections = tempSelections
        _newCheckingData.invalidated = false
      }

      setLocalCheckingData(_newCheckingData)
      deleteTempCheckingData('nothingToSelect')
      deleteTempCheckingData('selections')
      deleteTempCheckingData('invalidated')

      updateValuesInCheckData(_currentCheck, checkInGroupsData, _newCheckingData)

      setState(newState);
      saveCheckingData && saveCheckingData(newState)
    }
  }

  function cloneDataForSaving() {
    const _groupsData = _.cloneDeep(groupsData)
    const checkInGroupsData = findCheck(_groupsData, currentContextId)
    let _currentCheck
    let newState
    let _newCheckingData
    if (checkInGroupsData) {
      // save the selection changes
      const category = checkInGroupsData.category
      const newCheckData = _.cloneDeep(currentCheckingData)
      _currentCheck = findCheck(newCheckData[category], currentContextId, false)
      newState = {
        currentCheckingData: newCheckData,
        currentCheck: _currentCheck,
        groupsData: _groupsData,
        mode: 'default',
        modified: true
      }
      _newCheckingData = localCheckingData ? {...localCheckingData} : {}
    }
    return { checkInGroupsData, _currentCheck, newState, _newCheckingData }
  }

  function updateValuesInCheckData(_currentCheck, checkInGroupsData, _newCheckingData) {
    for (const key of Object.keys(_newCheckingData)) {
      const newCheckingValue = _newCheckingData[key]
      _currentCheck[key] = newCheckingValue
      checkInGroupsData[key] = newCheckingValue
    }
  }

  /**
   * persist check changes to file
   * @param {object} newData - new data to apply to check (key: valua)
   * @private
   */
  const _saveData = (newData) => {
    console.log(`${name}-_saveData persist to file`)
    const { checkInGroupsData, _currentCheck, newState, _newCheckingData } = cloneDataForSaving()

    if (_currentCheck && newState) {
      for (const key of Object.keys(newData)) {
        _newCheckingData[key] = newData[key]
        deleteTempCheckingData(key)
      }
      setLocalCheckingData(_newCheckingData)

      updateValuesInCheckData(_currentCheck, checkInGroupsData, _newCheckingData)

      setState(newState);
      saveCheckingData && saveCheckingData(newState)
    }
  }

  /**
   * save changes to check data if not current check
   * @param {object} check
   * @param {object} newData - new data to apply to check (key: valua)
   * @private
   */
  const _saveCheckingData = (check, newData) => {
    let changedData = false
    if (check) {
      for (const key of Object.keys(newData)) {
        if (check[key] !== newData[key]) {
          check[key] = newData[key]
          changedData = true
        }
      }

      if (changedData) {
        console.log(`${name}-_saveCheckingData persist changes to file`, check)
        const newCheckingData = {
          currentCheck: check,
        }
        saveCheckingData && saveCheckingData(newCheckingData)
      }
    }
    return changedData
  }

  function deleteTempCheckingData(key) {
    if (tempCheckingData?.hasOwnProperty(key)) {
      const _tempCheckingData = {...tempCheckingData}
      delete _tempCheckingData[key]
      setTempCheckingData(_tempCheckingData)
    }
  }

  const cancelSelection = () => {
    console.log(`${name}-cancelSelection`)
    deleteTempCheckingData('selections')
    setState({
      mode: 'default'
    });
  }

  const clearSelection = () => {
    console.log(`${name}-clearSelection`)
    setTempCheckingItem('selections', [])
  }

  const toggleBookmark = () => {
    console.log(`${name}-toggleBookmark`)
    _saveData({
      reminders: !getTempValueFor('reminders')
    })
  }

  const changeMode = (mode) => {
    console.log(`${name}-changeMode`, mode)
    setState({ mode })
  }

  function checkIfCommentChanged(e) {
    console.log(`${name}-checkIfCommentChanged`)
    const newcomment = e.target.value || '';
    const oldcomment = commentText || '';
    const isCommentChanged = newcomment !== oldcomment

    setState({
      isCommentChanged
    });
  }

  const cancelComment = () => {
    console.log(`${name}-cancelComment`)
    deleteTempCheckingData('comments')
    setState({
      mode: 'default',
      isCommentChanged: false,
    });
  }

  const saveComment = () => {
    console.log(`${name}-saveComment`)
    const newComment = getTempValueFor('comments')
    _saveData({ comments: newComment })
    setState({
      mode: 'default',
      isCommentChanged: false,
    });
  }

  const handleComment = (e) => {
    e.preventDefault();
    console.log(`${name}-handleComment`)
    const newComment = e.target.value
    setTempCheckingItem('comments', newComment)
    setState({
      isCommentChanged: true,
    });
  }

  const readyToDisplayChecker = groupsData && groupsIndex && currentContextId && verseText

  const getLexiconData_ = (lexiconId, entryId) => {
    console.log(`${name}-getLexiconData_`, {lexiconId, entryId})
    const lexiconData = getLexiconData && getLexiconData(lexiconId, entryId)
    return lexiconData
  }

  const onClosePopover = () => {
    console.log(`${name}-onClosePopover`)
    setState({
      popoverProps: {
        popoverVisibility: false,
      }
    })
  }

  const showPopover = (title, bodyText, positionCoord) => {
    console.log(`${name}-showPopover`, title)
    setState({
      popoverProps: {
        popoverVisibility: true,
        title,
        bodyText,
        positionCoord,
        onClosePopover: () => onClosePopover()
      }
    })
  }

  const toggleHelpsModal = () => {
    const _showHelpsModal = !showHelpsModal
    setState({
      showHelpsModal: _showHelpsModal
    })
  }

  const toggleHelps = () => {
    const _showHelps = !showHelps
    setState({
      showHelps: _showHelps
    })
  }

  function saveBibleToKey(bibles, key, bibleId, book) {
    let keyGroup = bibles[key]
    if (!keyGroup) { // if group does not exist, create new
      keyGroup = {}
      bibles[key] = keyGroup
    }
    keyGroup[bibleId] = book
  }

  /**
   * change content of verse
   * @param {string} chapter
   * @param {string} verse
   * @param {string} oldVerseText
   * @param {string} newVerseText
   */
  function editTargetVerse(chapter, verse, oldVerseText, newVerseText) {
    console.log(`editTargetVerse ${chapter}:${verse} - changed to ${newVerseText}`)

    //////////////////////////////////
    // first update component state

    const _bibles = [ ...bibles_]
    const _targetBible = {..._bibles[0]}
    _bibles[0] = _targetBible
    const targetBook = {..._targetBible?.book}
    _targetBible.book = targetBook
    const targetChapter = {...targetBook[chapter]}
    targetBook[chapter] = targetChapter
    targetChapter[verse] = newVerseText


    //////////////////////////////////
    // now apply new verse text to selected aligned verse and call back to extension to save

    let _newVerseText = newVerseText
    if (typeof _newVerseText !== 'string') {
      _newVerseText = UsfmFileConversionHelpers.convertVerseDataToUSFM(_newVerseText)
    }

    const currentChapterData = targetBible?.[chapter]
    const currentVerseData = currentChapterData?.[verse]
    const { targetVerseObjects } = AlignmentHelpers.updateAlignmentsToTargetVerse(currentVerseData, _newVerseText)
    targetChapter[verse] = { verseObjects: targetVerseObjects }; // save

    updateSettings(_bibles, targetBook)

    const verseText = removeUsfmMarkers(_newVerseText)
    setState({
      verseText
    })

    changeTargetVerse && changeTargetVerse(chapter, verse, newVerseText, targetVerseObjects)
    _saveData({ verseEdits: true })

    const _groupsData = _.cloneDeep(groupsData)
    let changedData = false
    selectionsHelpers.validateAllSelectionsForVerse(newVerseText, bookId, chapter, verse, _groupsData, (check, invalidated) => {
      if (check) {
        const currentCheckId = currentCheck?.contextId?.checkId
        const checkId = check?.contextId?.checkId

        if (checkId === currentCheckId) {
          // need to update current check
          _saveData({
            invalidated,
            verseEdits: true,
          })
        }

        console.log(`${name}-editTargetVerse - check validated, state changed: invalid: ${invalidated}`, check)
        changedData = changedData || _saveCheckingData(check, { invalidated, verseEdits: true })
      }
    })

    if (changedData) {
      console.log(`${name}-editTargetVerse - changes detected updating groupsData`)
      setState({
        groupsData: _groupsData
      })
    }
  }

  function updateSettings(newBibles, targetBible) {
    const _bibles = {}
    let _paneSettings = []
    const _paneKeySettings = initialSettings?.paneKeySettings || {}
    if (newBibles?.length) {
      for (const bible of newBibles) {
        let languageId = bible?.languageId
        const owner = bible?.owner
        const book = bible?.book
        const bibleId = bible?.bibleId
        if (languageId === NT_ORIG_LANG || languageId === OT_ORIG_LANG) {
          languageId = 'originalLanguage'
        }
        const key = `${languageId}/${bibleId}/${owner}`
        const initialPaneSettings = _paneKeySettings?.[key]
        const langKey = `${languageId}_${owner}`
        saveBibleToKey(_bibles, langKey, bibleId, book)
        saveBibleToKey(_bibles, languageId, bibleId, book) // also save as default for language without owner
        const pane = initialPaneSettings || {
          ...bible,
          languageId
        }
        _paneSettings.push(pane)
        if (!initialPaneSettings) {
          _paneKeySettings[key] = pane
        }
      }
    } else {
      _paneSettings = []
    }

    const _toolsSettings = initialSettings?.toolsSettings ||
    {
      'CheckArea': {
        'fontSize': 100
      }
    }

    let _manifest = initialSettings?.manifest ||
    {
      language_name: targetBible?.manifest?.dublin_core?.language?.title || 'Current',
      projectFont: targetBible?.manifest?.projectFont || ''
    }

    const appSettings = initialSettings?.appSettings || {}
    _manifest = {
      ..._manifest,
      ...appSettings // older code is looking for appSettings in manifest
    }

    setBibles(_bibles)
    setTargetBible(targetBible)
    setSettings({
      paneSettings: _paneSettings,
      paneKeySettings: _paneKeySettings,
      toolsSettings: _toolsSettings,
      manifest: _manifest,
      newComment: '',
      appSettings,
    }, false)
  }

  function _getScriptureFromReference(lang, id, book, chapter, verse) {
    return getScriptureFromReference(bibles, lang, id, book, chapter, verse)
  }

  useEffect(() => {
    updateSettings(bibles_, targetBible_)
  }, [bibles_, targetBible_])

  // build the title
  const { target_language, project } = manifest;
  let expandedScripturePaneTitle = project?.title || '';

  if (target_language?.book?.name) {
    expandedScripturePaneTitle = target_language.book.name;
  }


  const styleProps = styles || {}
  const _checkerStyles = {
    ...localStyles.containerDiv,
    ...styleProps,
  }

  return (
    readyToDisplayChecker ?
      <div id='checker' style={_checkerStyles}>
        <GroupMenuComponent
          bookName={bookName}
          changeCurrentContextId={changeCurrentCheck_}
          contextId={currentContextId}
          direction={direction}
          groupsData={groupsData}
          groupsIndex={groupsIndex}
          targetLanguageFont={targetLanguageFont}
          translate={translate}
        />
        <div style={localStyles.centerDiv}>
          { bibles && Object.keys(bibles).length &&
            <div style={localStyles.scripturePaneDiv}>
              <ScripturePane
                addObjectPropertyToManifest={addObjectPropertyToManifest}
                bibles={bibles}
                complexScriptFonts={complexScriptFonts}
                contextId={currentContextId}
                currentPaneSettings={paneSettings}
                editVerseRef={null}
                editTargetVerse={editTargetVerse}
                expandedScripturePaneTitle={expandedScripturePaneTitle}
                getAvailableScripturePaneSelections={null}
                getLexiconData={getLexiconData_}
                makeSureBiblesLoadedForTool={null}
                projectDetailsReducer={{ manifest }}
                selections={currentSelections}
                setToolSettings={setToolSettingsScripture}
                showPopover={showPopover}
                onExpandedScripturePaneShow={null}
                translate={translate}
              />
            </div>
          }
          <div>
            <CheckInfoCard
              getScriptureFromReference={_getScriptureFromReference}
              onLinkClick={() => false}
              onSeeMoreClick={() => false}
              phrase={groupPhrase}
              seeMoreLabel={translate('see_more')}
              showSeeMoreButton={false}
              title={groupTitle}
            />
            <VerseCheck
              alignedGLText={alignedGLText}
              bookDetails={bookDetails}
              bookmarkEnabled={bookmarkEnabled}
              cancelEditVerse={cancelEditVerse}
              cancelComment={cancelComment}
              cancelSelection={cancelSelection}
              changeMode={changeMode}
              changeSelectionsInLocalState={changeSelectionsInLocalState}
              checkIfCommentChanged={checkIfCommentChanged}
              checkIfVerseChanged={checkIfVerseChanged}
              clearSelection={clearSelection}
              commentText={commentText}
              contextId={currentContextId}
              dialogModalVisibility = {false}
              isCommentChanged={isCommentChanged}
              isVerseChanged={isVerseChanged}
              isVerseEdited={isVerseEdited}
              handleEditVerse={handleEditVerse}
              handleGoToNext={handleGoToNext}
              handleGoToPrevious={handleGoToPrevious}
              handleOpenDialog={null}
              isVerseInvalidated={isVerseInvalidated}
              handleCloseDialog={null}
              handleComment={handleComment}
              handleSkip={null}
              handleTagsCheckbox={handleTagsCheckbox}
              localNothingToSelect={tempNothingToSelect}
              manifest={manifest}
              maximumSelections={maximumSelections}
              mode={mode}
              newSelections={tempSelections}
              nothingToSelect={currentNothingToSelect}
              openAlertDialog={openAlertDialog}
              saveComment={saveComment}
              saveEditVerse={saveEditVerse}
              saveSelection={_saveSelection}
              selections={currentSelections}
              setToolSettings={setToolSettings}
              tags={newTags || []}
              targetBible={targetBible}
              targetLanguageDetails={targetLanguageDetails}
              toggleBookmark={toggleBookmark}
              toggleNothingToSelect={toggleNothingToSelect}
              toolsSettings={toolsSettings}
              translate={translate}
              unfilteredVerseText={unfilteredVerseText}
              validateSelections={validateSelections}
              verseText={verseText}
            />
          </div>
        </div>
        {showDocument && <TranslationHelps
          modalArticle={article}
          article={article}
          expandedHelpsButtonHoverText={'Click to show expanded help pane'}
          modalTitle={'translationHelps'}
          translate={translate}
          isShowHelpsExpanded={showHelpsModal}
          openExpandedHelpsModal={toggleHelpsModal}
          sidebarToggle={toggleHelps}
          isShowHelpsSidebar={showHelps}
        />}
        { popoverProps?.popoverVisibility &&
          <PopoverContainer {...popoverProps} />
        }
      </div>
      :
      'Waiting for Data'
  );
};

Checker.propTypes = {
  styles:PropTypes.object,
  alignedGlBible: PropTypes.object,
  bibles: PropTypes.array,
  changeTargetVerse: PropTypes.func,
  checkingData: PropTypes.object.isRequired,
  checkType: PropTypes.string,
  contextId: PropTypes.object.isRequired,
  glWordsData: PropTypes.object.isRequired,
  getLexiconData: PropTypes.func,
  initialSettings: PropTypes.object,
  saveCheckingData: PropTypes.func,
  saveSettings: PropTypes.func,
  showDocument: PropTypes.bool,
  targetBible: PropTypes.object.isRequired,
  targetLanguageDetails: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};
export default Checker;
