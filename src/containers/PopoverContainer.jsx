import React from 'react';
import PropTypes from 'prop-types';
// components
import Popover from '../components/Popover';

class PopoverContainer extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onEscapeKeyPressed.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscapeKeyPressed.bind(this));
  }

  onEscapeKeyPressed(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.props.onClosePopover();
    }
  }

  render() {
    return (
      <div>
        <Popover {...this.props}/>
      </div>
    );
  }
}

PopoverContainer.propTypes = {
  bodyText: PropTypes.string,
  onClosePopover: PropTypes.func,
  positionCoord: PropTypes.object,
  title: PropTypes.string,
};

export default PopoverContainer
