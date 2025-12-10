import { generateMenuData } from '../utils';

describe('generate menu data', () => {
  it('has empty input data', () => {
    const groupIndex = [];
    const groupData = {};
    const progressKey = 'complete';
    const onProcessItem = null;
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem);
    expect(menuData).toEqual([]);
  });

  it('has a custom item processor', () => {
    const groupIndex = [
      {
        id: 'abraham',
        name: 'Abraham',
      }, {
        id: 'adoption',
        name: 'adoption, adopt, adopted',
      }];
    const groupData = {
      adoption: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 4,
              verse: 5,
            },
            groupId: 'adoption',
            occurrence: 1,
          },
        }],
    };
    const progressKey = 'completed';
    const onProcessItem = item => ({
      ...item,
      customField: 'hello world',
      title: item.contextId.reference.bookId,
    });
    const expected = [
      {
        children: [
          {
            contextId: {
              groupId: 'adoption',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 4, 'verse': 5,
              },
            },
            customField: 'hello world',
            groupId: 'adoption',
            itemId: '4:5',
            title: 'gal',
            direction: 'ltr',
          }],
        id: 'adoption',
        progress: 0,
        title: 'adoption, adopt, adopted',
      }];
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem);
    expect(menuData).toEqual(expected);
  });

  it('has input data', () => {
    const groupIndex = [
      {
        id: 'abraham',
        name: 'Abraham',
      }, {
        id: 'adoption',
        name: 'adoption, adopt, adopted',
      }];
    const groupData = {
      abraham: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 3,
              verse: 6,
            },
            groupId: 'abraham',
            occurrence: 1,
          },
          completed: true,
        }, {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 3,
              verse: 7,
            },
            groupId: 'abraham',
            occurrence: 1,
          },
        }],
      adoption: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 4,
              verse: 5,
            },
            groupId: 'adoption',
            occurrence: 1,
          },
        }],
    };
    const progressKey = 'completed';
    const onProcessItem = null;
    const expected = [
      {
        children: [
          {
            contextId: {
              groupId: 'abraham',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 3, 'verse': 6,
              },
            },
            completed: true,
            groupId: 'abraham',
            itemId: '3:6',
            title: 'gal 3:6',
            direction: 'ltr',
          },
          {
            contextId: {
              groupId: 'abraham',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 3, 'verse': 7,
              },
            },
            groupId: 'abraham',
            itemId: '3:7',
            title: 'gal 3:7',
            direction: 'ltr',
          }],
        id: 'abraham',
        progress: 50,
        title: 'Abraham',
      },
      {
        children: [
          {
            contextId: {
              groupId: 'adoption',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 4, 'verse': 5,
              },
            },
            groupId: 'adoption',
            itemId: '4:5',
            title: 'gal 4:5',
            direction: 'ltr',
          }],
        id: 'adoption',
        progress: 0,
        title: 'adoption, adopt, adopted',
      }];
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem);
    expect(menuData).toEqual(expected);
  });
});

describe('generate menu data by reference', () => {
  it('has empty input data', () => {
    const groupIndex = [];
    const groupData = {};
    const progressKey = 'complete';
    const onProcessItem = null;
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem, null, true);
    expect(menuData).toEqual([]);
  });

  it('has a custom item processor', () => {
    const groupIndex = [
      {
        id: 'abraham',
        name: 'Abraham',
      }, {
        id: 'adoption',
        name: 'adoption, adopt, adopted',
      }];
    const groupData = {
      adoption: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 4,
              verse: 5,
            },
            groupId: 'adoption',
            occurrence: 1,
          },
        }],
    };
    const progressKey = 'completed';
    const onProcessItem = item => ({
      ...item,
      customField: 'hello world',
      title: item.contextId.reference.bookId,
    });
    const expected = [
      {
        children: [
          {
            contextId: {
              groupId: 'adoption',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 4, 'verse': 5,
              },
            },
            customField: 'hello world',
            groupId: 'adoption',
            groupName: 'adoption, adopt, adopted',
            itemId: '4:5',
            organizeByRef: '4:5',
            title: 'gal',
            direction: 'ltr',
          }],
        id: '4:5',
        organizeByRef: '4:5',
        progress: 0,
        title: '4:5',
      }];
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem, null, true);
    expect(menuData).toEqual(expected);
  });

  it('has input data', () => {
    const groupIndex = [
      {
        id: 'abraham',
        name: 'Abraham',
      }, {
        id: 'adoption',
        name: 'adoption, adopt, adopted',
      }];
    const groupData = {
      abraham: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 3,
              verse: 6,
            },
            groupId: 'abraham',
            occurrence: 1,
          },
          completed: true,
        }, {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 3,
              verse: 7,
            },
            groupId: 'abraham',
            occurrence: 1,
          },
        }],
      adoption: [
        {
          contextId: {
            reference: {
              bookId: 'gal',
              chapter: 4,
              verse: 5,
            },
            groupId: 'adoption',
            occurrence: 1,
          },
        }],
    };
    const progressKey = 'completed';
    const onProcessItem = null;
    const expected = [
      {
        children: [
          {
            contextId: {
              groupId: 'abraham',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 3, 'verse': 6,
              },
            },
            completed: true,
            groupId: 'abraham',
            groupName: 'Abraham',
            itemId: '3:6',
            organizeByRef: '3:6',
            title: 'gal 3:6',
            direction: 'ltr',
          },
        ],
        id: '3:6',
        organizeByRef: '3:6',
        progress: 100,
        title: '3:6',
      },
      {
        children: [
          {
            contextId: {
              groupId: 'abraham',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 3, 'verse': 7,
              },
            },
            groupId: 'abraham',
            groupName: 'Abraham',
            itemId: '3:7',
            organizeByRef: '3:7',
            title: 'gal 3:7',
            direction: 'ltr',
          }],
        id: '3:7',
        organizeByRef: '3:7',
        progress: 0,
        title: '3:7',
      },
      {
        children: [
          {
            contextId: {
              groupId: 'adoption',
              occurrence: 1,
              reference: {
                'bookId': 'gal', 'chapter': 4, 'verse': 5,
              },
            },
            groupId: 'adoption',
            groupName: 'adoption, adopt, adopted',
            itemId: '4:5',
            organizeByRef: '4:5',
            title: 'gal 4:5',
            direction: 'ltr',
          }],
        id: '4:5',
        organizeByRef: '4:5',
        progress: 0,
        title: '4:5',
      }];
    const menuData = generateMenuData(groupIndex, groupData, progressKey, undefined,
      onProcessItem, null, true);
    expect(menuData).toEqual(expected);
  });
});
