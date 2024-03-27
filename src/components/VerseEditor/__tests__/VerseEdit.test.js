/* eslint-env jest */
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import VerseEditor from '../VerseEditor';

const mock_translate = (text, params) => {
  if (params) {
    text += ': ' + JSON.stringify(params);
  }
  return text;
};

describe('VerseEditor component:', () => {
  test('should render', () => {
    // given
    const props = getBasePropertiesAndMockActions();

    // when
    const wrapper = shallow(
      <VerseEditor {...props} />,
    );

    // then
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

//
// helpers
//

function getBasePropertiesAndMockActions() {
  const props = {
    open: true,
    verseTitle: 'Rom 3:11',
    verseText: 'Dummy Text',
    translate: mock_translate,
    onCancel: () => jest.fn(),
    onSubmit: () => jest.fn(),
    targetLanguage: 'Klingon',
  };

  return props;
}
