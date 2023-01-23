let i = 1;

const groupsDataReducer = {
  groupsData: {
    apostle: [{
      'priority': 1,
      'comments': false,
      'reminders': false,
      'selections': false,
      'verseEdits': false,
      'contextId': {
        'reference': {
          'bookId': 'tit',
          'chapter': 1,
          'verse': 1,
        },
        'tool': 'translationWords',
        'groupId': 'apostle',
        'quote': 'ἀπόστολος',
        'strong': [
          'G06520',
        ],
        'occurrence': 1,
      },
    },
    ...Array(50).fill(0).map(()=>({
      'priority': 1,
      'comments': false,
      'reminders': false,
      'selections': false,
      'verseEdits': false,
      'contextId': {
        'reference': {
          'bookId': 'tit',
          'chapter': 2,
          'verse': i++,
        },
        'tool': 'translationWords',
        'groupId': 'apostle',
        'quote': 'ἀπόστολος',
        'strong': [
          'G06520',
        ],
        'occurrence': 1,
      },
    }))],

  },
}

export default groupsDataReducer;
