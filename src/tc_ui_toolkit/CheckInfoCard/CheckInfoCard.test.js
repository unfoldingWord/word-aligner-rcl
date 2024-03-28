import React from 'react';
import renderer from 'react-test-renderer';
import CheckInfoCard from './CheckInfoCard';


describe('CheckInfoCard', () => {
  it('renders correctly', () => {
    const props = {
      title: 'save, saves, saved, safe, salvation',
      phrase: 'The term "save" refers to keeping someone from experiencing something bad or harmful. To "be safe" means to be protected from harm or danger.',
      seeMoreLabel: 'See More',
      showSeeMoreButton: true,
      onSeeMoreClick: () => {},
    };
    const tree = renderer
      .create(
        <CheckInfoCard
          title={props.title}
          phrase={props.phrase}
          seeMoreLabel={props.seeMoreLabel}
          showSeeMoreButton={props.showSeeMoreButton}
          onSeeMoreClick={props.onSeeMoreClick}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
