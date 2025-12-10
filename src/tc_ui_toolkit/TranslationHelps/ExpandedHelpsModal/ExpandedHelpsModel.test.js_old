import React from 'react';
import { ThemeProvider as MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { mount } from 'enzyme';
import ExpandedHelpsModal from './index';

describe('Test ExpandedHelpsModal component', () => {
  test('Test initial display', () => {
    const theme = createMuiTheme({ scrollbarThumb: { borderRadius: '10px' } });

    const expectedTitle = 'Title';
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <ExpandedHelpsModal
          show={true}
          onHide={() => {}}
          title={expectedTitle}
          article={'Test article'}
          translate={k => k}
        />
      </MuiThemeProvider>);
    expect(wrapper.find('.tool-bar-title').text(expectedTitle));
  });
});
