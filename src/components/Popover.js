
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Divider from '@material-ui/core/Divider'
import { CgClose } from 'react-icons/cg'
import useWindowEvent from '../helpers/useWindowEvent'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(() => ({
  popover: {
    padding: '0.75em',
    maxWidth: '400px',
  }
}))

const PopoverComponent = ({
  popoverVisibility,
  title,
  bodyText,
  positionCoord,
  onClosePopover,
}) => {
  const classes = useStyles();
  const onEscapeKeyPressed = useCallback((e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      onClosePopover();
    }
  },[onClosePopover]);

  useWindowEvent('keydown', onEscapeKeyPressed)

  return (
    <div>
      <Popover
        classes={{paper: classes.popover}}
        open={popoverVisibility}
        anchorEl={positionCoord}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        onClose={onClosePopover}
      >
        <div style={{
          display: 'flex', alignItems:'top', padding: 0,
        }}>
          <span style={{
            fontSize: '1.2em', fontWeight: 'bold', marginBottom: 10, marginTop: 0, paddingTop: 0,
          }}>
            {title}
          </span>
          <IconButton
            key='lexicon-close-button'
            onClick={onClosePopover}
            title={'Close Lexicon'}
            aria-label={'Close Lexicon'}
            style={{
              paddingTop: '0px',
              cursor: 'pointer',
              alignItems: 'top',
              marginLeft: 'auto', marginRight: 5,
            }}
          >
            <CgClose id='lexicon-close-icon' color='black' />
          </IconButton>
        </div>
        <Divider />
        <span style={{ padding: '10px 0 15px 0' }}>
          {bodyText}
        </span>
      </Popover>
    </div>
  );
}

PopoverComponent.propTypes = {
  popoverVisibility: PropTypes.any,
  title: PropTypes.any,
  bodyText: PropTypes.any,
  positionCoord: PropTypes.any,
  onClosePopover: PropTypes.func,
};

export default PopoverComponent;
