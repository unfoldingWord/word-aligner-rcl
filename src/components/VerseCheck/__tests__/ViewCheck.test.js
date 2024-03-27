/* eslint-env jest */
import path from 'path';
import fs from 'fs-extra';
import React from 'react';
import renderer from 'react-test-renderer';
import VerseCheck from '../VerseCheck';

const mock_translate = (text) => (text);
const base_props = fs.readJsonSync(path.join('./src/VerseCheck/__tests__/fixtures/project/loadedProjectShortened.json'));
let currentInvalidated = false;
let currentEdited = false;

describe('VerseCheck component:', () => {
  currentInvalidated = false;
  currentEdited = false;

  test('Integrated View test', () => {
    // given
    const props = getBasePropertiesAndMockActions();
    currentInvalidated = false;
    currentEdited = false;

    // when
    const component = renderer.create(
      <VerseCheck {...props} />,
    );

    // then
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Integrated View test with verseEdit', () => {
    // given
    const props = getBasePropertiesAndMockActions();
    currentInvalidated = false;
    currentEdited = true;

    // when
    const component = renderer.create(
      <VerseCheck {...props} />,
    );

    // then
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Integrated View test with invalidated', () => {
    // given
    const props = getBasePropertiesAndMockActions();
    currentInvalidated = true;
    currentEdited = false;

    // when
    const component = renderer.create(
      <VerseCheck {...props} />,
    );

    // then
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Integrated View test with default and invalidated', () => {
    // given
    const props = getBasePropertiesAndMockActions();
    props.mode = ''; // default mode
    currentInvalidated = true;
    currentEdited = false;

    // when
    const component = renderer.create(
      <VerseCheck {...props} />,
    );

    // then
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Integrated View test - edit mode', () => {
    // given
    const props = getBasePropertiesAndMockActions();
    currentInvalidated = false;
    currentEdited = false;
    props.mode = 'edit';

    // when
    const component = renderer.create(
      <VerseCheck {...props} />,
    );

    // then
    expect(component.toJSON()).toMatchSnapshot();
  });
});

//
// helpers
//

function addMockActions(props) {
  props.actions = {
    handleGoToNext: () => jest.fn(),
    handleGoToPrevious: () => jest.fn(),
    handleOpenDialog: () => jest.fn(),
    handleCloseDialog: () => jest.fn(),
    skipToNext: () => jest.fn(),
    skipToPrevious: () => jest.fn(),
    changeSelectionsInLocalState: () => jest.fn(),
    changeMode: () => jest.fn(),
    handleComment: () => jest.fn(),
    checkComment: () => jest.fn(),
    cancelComment: () => jest.fn(),
    saveComment: () => jest.fn(),
    handleTagsCheckbox: () => jest.fn(),
    handleEditVerse: () => jest.fn(),
    checkVerse: () => jest.fn(),
    cancelEditVerse: () => jest.fn(),
    saveEditVerse: () => jest.fn(),
    validateSelections: () => jest.fn(),
    toggleBookmark: () => jest.fn(),
    openAlertDialog: () => jest.fn(),
    selectModalTab: () => jest.fn(),
    cancelSelection: () => jest.fn(),
    clearSelection: () => jest.fn(),
    saveSelection: () => jest.fn(),
  };
  return {
    ...props,
    translate: mock_translate,
    cancelSelection: () => jest.fn(),
    clearSelection: () => jest.fn(),
    saveSelection: () => jest.fn(),
    toggleNothingToSelect: () => jest.fn(),
    goToNextOrPrevious: 'next',
    findIfVerseEdited: jest.fn(() => ( currentEdited)),
    findIfVerseInvalidated: jest.fn(() => (currentInvalidated)),
    manifest: { projectFont: 'default' },
  };
}

function getBasePropertiesAndMockActions() {
  // clone properties so we can modify before test
  let props = base_props;
  console.log(base_props);
  console.log('base_props');
  props = addMockActions(props);
  return props;
}
