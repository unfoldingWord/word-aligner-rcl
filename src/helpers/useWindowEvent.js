import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Takes a type of window event and a callback and attaches and removes it from window.
 * @param {string} type
 * @param {function} callback
 * @returns
 */
const useWindowEvent = ({type, callback}) => {
  useEffect(() => {
    window.addEventListener(type, callback);
    return () => {
      window.removeEventListener(type, callback);
    };
  }, [type, callback]);
}

useWindowEvent.propTypes = {
  type: PropTypes.string,
  callback: PropTypes.func
};

export default useWindowEvent;
