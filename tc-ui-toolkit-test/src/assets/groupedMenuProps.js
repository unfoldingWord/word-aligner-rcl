import React from 'react';
import { CheckIcon } from 'tc-ui-toolkit';
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";
import ModeCommentIcon from '@material-ui/icons/ModeComment';

export const sampleIndex = [
  {
    id: "chapter_1",
    name: "Chapter 1"
  },
  {
    id: "chapter_2",
    name: "Chapter 2"
  }
];

export const sampleData = {
  chapter_1: [
    {
      done: true,
      contextId: {
        groupId: "chapter_1",
        reference: {
          bookId: "gal",
          chapter: 1,
          verse: 1
        }
      }
    },
    {
      edited: true,
      contextId: {
        groupId: "chapter_1",
        reference: {
          bookId: "gal",
          chapter: 1,
          verse: 2
        }
      }
    },
    {
      bookmarked: true,
      contextId: {
        groupId: "chapter_1",
        reference: {
          bookId: "gal",
          chapter: 1,
          verse: 3
        }
      }
    }
  ],
  chapter_2: [
    {
      done: true,
      edited: true,
      contextId: {
        groupId: "chapter_2",
        reference: {
          bookId: "gal",
          chapter: 2,
          verse: 1
        }
      }
    },
    {
      contextId: {
        groupId: "chapter_2",
        reference: {
          bookId: "gal",
          chapter: 2,
          verse: 2
        }
      }
    }
  ]
};


export const groupedMenufilters = [
  {
    label: "Bookmarked",
    key: 'bookmarked',
    icon: <BookmarkIcon style={{color: "white"}}/>
  },
  {
    label: "Complete",
    key: 'done',
    disables: ['incomplete'],
    icon: <CheckIcon style={{color: "white"}}/>
  },
  {
    label: "Incomplete",
    id: 'incomplete',
    key: 'done',
    value: false,
    disables: ['done'],
    icon: <BlockIcon style={{color: "white"}}/>
  },
  {
    label: "Edited",
    key: 'edited',
    icon: <EditIcon style={{color: "white"}}/>
  },
  {
    label: "Comments",
    key: 'comments',
    icon: <ModeCommentIcon/>
  }
];

export const groupedMenuActions = {
  getGroupProgress: () => 1,
  isVerseFinished: () => false,
  isVerseValid: () => true,
  getSelections: () => 'A selection',
  translate: key => key,
  setFilter: () => {},
  groupMenuChangeGroup: () => {},
  groupMenuExpandSubMenu: () => {},
};
