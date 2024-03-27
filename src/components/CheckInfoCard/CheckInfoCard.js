import React from 'react';
import PropTypes from 'prop-types';

import './CheckInfoCard.styles.css';
import PhraseWithToolTip from './PhraseWithToolTip';


const CheckInfoCard = ({
  title,
  phrase,
  seeMoreLabel,
  onSeeMoreClick,
  onLinkClick,
  showSeeMoreButton,
  getScriptureFromReference,
}) => (
  <div className="checkInfo">
    <div className="leftSide">
      <div className="title">
        {title}
      </div>
    </div>
    <div className="rightSide">
      <div className="phrase">
        <PhraseWithToolTip getScriptureFromReference={getScriptureFromReference} phrase={phrase} onClickLink={onLinkClick} />
      </div>
      <div onClick={showSeeMoreButton ? onSeeMoreClick : null} className={showSeeMoreButton ? 'linkActive' : 'linkInactive'}>
        {seeMoreLabel}
      </div>
    </div>
  </div>
);

CheckInfoCard.propTypes = {
  phrase: PropTypes.string,
  title: PropTypes.string,
  seeMoreLabel: PropTypes.string,
  onSeeMoreClick: PropTypes.func,
  onLinkClick: PropTypes.func,
  showSeeMoreButton: PropTypes.bool,
  getScriptureFromReference: PropTypes.func,
};

export default CheckInfoCard;
