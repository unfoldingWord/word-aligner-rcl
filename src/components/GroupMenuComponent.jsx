/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BlockIcon from '@mui/icons-material/Block';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import UnalignedIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import { generateItemId } from '../helpers/groupMenuHelpers';
import CheckIcon from '../tc_ui_toolkit/icons/Check'
import InvalidatedIcon from '../tc_ui_toolkit/icons/Invalidated'
import { generateMenuData, generateMenuItem } from '../tc_ui_toolkit/GroupedMenu'
import {
  default as GroupedMenu,
} from '../tc_ui_toolkit/GroupedMenu/FilteredMenu/';
import { getReferenceStr } from '../tc_ui_toolkit/ScripturePane/helpers/utils'
export function GroupMenuComponent({
  translate,
  contextId,
  groupsData,
  groupsIndex,
  targetLanguageFont,
  changeCurrentContextId,
  direction,
}) {
  const [orderHelpsByRef, setOrderHelpsByRef] = useState(false);

  /**
   * Handles click events from the menu
   * @param {object} contextId - the menu item's context id
   */
  function handleClick(contextId) {
    changeCurrentContextId(contextId);
  }

  /**
   * Preprocess a menu item
   * @param {object} item - an item in the groups data
   * @returns {object} the updated item
   */
  function onProcessItem(item) {
    const { contextId } = item;
    const { reference: { chapter, verse } } = contextId;

    const itemState = toolApi.getVerseData(chapter, verse, contextId);
    const title = getReferenceStr(chapter, verse);
    return {
      ...item,
      title,
      direction: item.direction,
      completed: itemState[FINISHED_KEY],
      invalid: itemState[INVALID_KEY],
      unaligned: itemState[UNALIGNED_KEY],
      verseEdits: itemState[EDITED_KEY],
      comments: itemState[COMMENT_KEY],
      bookmarked: itemState[BOOKMARKED_KEY],
    };
  }

  const filters = [
    {
      label: translate('menu.invalidated'),
      key: 'invalid',
      icon: <InvalidatedIcon/>,
    },
    {
      label: translate('menu.bookmarks'),
      key: 'bookmarked',
      icon: <BookmarkIcon/>,
    },
    {
      label: translate('menu.completed'),
      key: 'completed',
      disables: ['incomplete'],
      icon: <CheckIcon/>,
    },
    {
      label: translate('menu.incomplete'),
      id: 'incomplete',
      key: 'completed',
      value: false,
      disables: ['completed'],
      icon: <BlockIcon/>,
    },
    {
      label: translate('menu.verse_edit'),
      key: 'verseEdits',
      icon: <EditIcon/>,
    },
    {
      label: translate('menu.comments'),
      key: 'comments',
      icon: <ModeCommentIcon/>,
    },
    {
      label: translate('menu.unaligned'),
      key: 'unaligned',
      icon: <UnalignedIcon/>,
    },
  ];

  const statusIcons = [
    {
      key: 'invalidated',
      icon: <InvalidatedIcon style={{ color: 'white' }} />,
    },
    {
      key: 'reminders',
      icon: <BookmarkIcon style={{ color: 'white' }} />,
    },
    {
      key: 'finished',
      icon: <CheckIcon style={{ color: '#58c17a' }} />,
    },
    {
      key: 'nothingToSelect',
      icon: <CheckIcon style={{ color: '#58c17a' }} />,
    },
    {
      key: 'verseEdits',
      icon: <EditIcon style={{ color: 'white' }} />,
    },
    {
      key: 'comments',
      icon: <ModeCommentIcon style={{ color: 'white' }} />,
    },
  ];

  const entries = generateMenuData(
    groupsIndex,
    groupsData,
    'completed',
    direction,
    onProcessItem
  );

  if (contextId) {
    const activeEntry = generateMenuItem(contextId, direction, onProcessItem);
    return (
      <GroupedMenu
        filters={filters}
        entries={entries}
        active={activeEntry}
        statusIcons={statusIcons}
        emptyNotice={translate('menu.no_results')}
        title={translate('menu.menu_title')}
        onItemClick={handleClick}
      />
    );
  } else {
    return null;
  }
}

GroupMenuComponent.propTypes = {
  translate: PropTypes.func.isRequired,
  groupsIndex: PropTypes.array.isRequired,
  groupsData: PropTypes.object.isRequired,
  contextId: PropTypes.object,
  bookName: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  changeCurrentContextId: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

GroupMenuComponent.defaultProps = { direction: 'ltr' };

export default GroupMenuComponent;
