import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ThreeDotIcon from '../../ThreeDotIcon';
import FontSizeSlider from '../../FontSizeSlider';
import DropdownMenu, { MenuItem } from '../../DropdownMenu';
import { BsArrowsFullscreen } from 'react-icons/bs'

function ThreeDotMenu({
  title,
  label,
  namespace,
  anchorOrigin,
  toolsSettings,
  setToolSettings,
  transformOrigin,
  handleMyLanguageModal,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFontSizeChange = (fontSize) => {
    setToolSettings(namespace, 'fontSize', fontSize);
  };

  const { fontSize } = toolsSettings[namespace] || {};

  return (
    <>
      <ThreeDotIcon onClick={handleClick}/>
      <DropdownMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        style={{ margin: '-23px 0px 0px' }}
      >
        <MenuItem
          divider
          onClick={() => {
            handleMyLanguageModal();
            handleClose();
          }}
          style={{
            display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
          }}
        >
          <BsArrowsFullscreen
            title={title}
            style={{ fontSize: '20px', color: '#000000' }}
          />
          <div title={title} style={{ margin: '0px 10px', color: '#000000' }}>
            {label}
          </div>
        </MenuItem>
        <MenuItem disableOnClick>
          <FontSizeSlider value={fontSize} onChange={handleFontSizeChange}/>
        </MenuItem>
      </DropdownMenu>
    </>
  );
}

ThreeDotMenu.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  transformOrigin: { vertical: 'top', horizontal: 'right' },
};

ThreeDotMenu.propTypes = {
  anchorOrigin: PropTypes.object,
  transformOrigin: PropTypes.object,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  toolsSettings: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  handleMyLanguageModal: PropTypes.func.isRequired,
};

export default ThreeDotMenu;
