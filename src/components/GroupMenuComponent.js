/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BlockIcon from '@material-ui/icons/Block';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import CategoryIcon from '@material-ui/icons/Category';
import EditIcon from '@material-ui/icons/Edit';
import { generateItemId } from '../helpers/groupMenuHelpers';
import CheckIcon from '../tc_ui_toolkit/icons/Check'
import InvalidatedIcon from '../tc_ui_toolkit/icons/Invalidated'
import { generateMenuData, generateMenuItem } from '../tc_ui_toolkit/GroupedMenu'
import {
  default as GroupedMenu,
} from '../tc_ui_toolkit/GroupedMenu/FilteredMenu/';
import { getReferenceStr } from '../tc_ui_toolkit/ScripturePane/helpers/utils'
function GroupMenuComponent({
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
   * @param {boolean} sortingByRef - if true then we are ordering by reference
   * @returns {object} the updated item
   */
  function onProcessItem(item, sortingByRef) {
    const {
      contextId: {
        quote,
        checkId,
        occurrence,
        reference: {
          bookId, chapter, verse,
        },
        verseSpan,
      },
    } = item;

    // build selection preview
    let selectionText = '';

    if (item.selections) {
      selectionText = item.selections.map(s => s.text).join(' ');
    }

    // build passage title
    const verseLabel = verseSpan || verse;
    const refStr = getReferenceStr(chapter, verseLabel);
    const groupName = sortingByRef ? item.groupName : refStr;
    let title = groupName;

    if (selectionText) {
      title = `${groupName} ${selectionText}`;
    }

    return {
      ...item,
      title,
      itemId: generateItemId(occurrence, bookId, chapter, verse, quote, checkId),
      finished: (!!item.selections && !item.invalidated) || item.nothingToSelect,
      nothingToSelect: !!item.nothingToSelect,
      tooltip: selectionText,
    };
  }

  function sortEntries(entries) {
    return entries.sort((a, b) => {
      const aName = (a.title || a.id).toLowerCase();
      const bName = (b.title || b.id).toLowerCase();
      return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
    });
  }

  /**
   * callback for when filters change
   * @param {array} newFilters
   */
  function onFiltersChanged(newFilters) {
    newFilters = newFilters || [];
    let groupingOn = false;

    for (let i = 0; i < newFilters.length; i++) {
      if (newFilters[i].key === 'grouping') {
        groupingOn = true;
        break;
      }
    }
    setOrderHelpsByRef(groupingOn);
  }

  const filters = [
    {
      label: translate('menu.invalidated'),
      key: 'invalidated',
      icon: <InvalidatedIcon />,
    },
    {
      label: translate('menu.bookmarks'),
      key: 'reminders',
      icon: <BookmarkIcon />,
    },
    {
      label: translate('menu.selected'),
      key: 'finished',
      disables: ['not-finished'],
      icon: <CheckIcon />,
    },
    {
      label: translate('no_selection_needed'),
      key: 'nothingToSelect',
      icon: <CheckIcon />,
    },
    {
      label: translate('menu.no_selection'),
      id: 'not-finished',
      key: 'finished',
      value: false,
      disables: ['finished'],
      icon: <BlockIcon />,
    },
    {
      label: translate('menu.verse_edit'),
      key: 'verseEdits',
      icon: <EditIcon />,
    },
    {
      label: translate('menu.comments'),
      key: 'comments',
      icon: <ModeCommentIcon />,
    },
    {
      label: translate('menu.grouping'),
      key: 'grouping',
      icon: <CategoryIcon />,
      nonFilter: true,
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
    'selections',
    direction,
    onProcessItem,
    'nothingToSelect',
    orderHelpsByRef
  );

  const activeEntry = generateMenuItem(
    contextId,
    direction,
    onProcessItem,
    orderHelpsByRef,
  );
  const sorted = orderHelpsByRef ? entries : sortEntries(entries);

  return (
    <GroupedMenu
      entries={sorted}
      filters={filters}
      active={activeEntry}
      statusIcons={statusIcons}
      onItemClick={handleClick}
      targetLanguageFont={targetLanguageFont}
      title={translate('menu.menu')}
      emptyNotice={translate('menu.no_results')}
      onFiltersChanged={onFiltersChanged}
    />
  );
}

GroupMenuComponent.propTypes = {
  translate: PropTypes.func.isRequired,
  groupsIndex: PropTypes.array.isRequired,
  groupsData: PropTypes.object.isRequired,
  contextId: PropTypes.object.isRequired,
  bookName: PropTypes.string.isRequired,
  targetLanguageFont: PropTypes.string,
  changeCurrentContextId: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

GroupMenuComponent.defaultProps = { direction: 'ltr' };

export default GroupMenuComponent;
