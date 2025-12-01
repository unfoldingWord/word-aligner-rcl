import React from 'react';
import PropTypes from 'prop-types';

const addBibleButtonContainerStyles = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '130px',
  minWidth: '240px',
  flexDirection: 'column',
  borderRight: '1px solid var(--border-color)'
};

const AddBibleSVG = ({ title }) => (
  <svg viewBox="-424 2130 45.573 45.724" width="100%" height="100%">
    <defs>
    </defs>
    <title>{title}</title>
    <g id="Group_1424" data-name="Group 1424" opacity="0.5" transform="translate(-1484 1794)">
      <g id="Book_font_awesome" transform="translate(1060 336)">
        <path id="path3029" fill="#333" d="M42.89-1398.733a3.747,3.747,0,0,1,.477,3.416l-7.282,23.99a5.469,5.469,0,0,1-2.026,2.846,5.284,5.284,0,0,1-3.244,1.152H6.376a6.484,6.484,0,0,1-3.932-1.417,7.437,7.437,0,0,1-2.635-3.482,4.8,4.8,0,0,1-.053-3.362q0-.106.079-.715t.106-.98a1.474,1.474,0,0,0-.079-.569,1.31,1.31,0,0,1-.079-.516,1.647,1.647,0,0,1,.212-.556,6.46,6.46,0,0,1,.437-.622,6.505,6.505,0,0,0,.437-.622,17.764,17.764,0,0,0,1.192-2.422,14.377,14.377,0,0,0,.794-2.423,2.066,2.066,0,0,0,.013-.794,2.326,2.326,0,0,1-.013-.741,2.22,2.22,0,0,1,.45-.741,4.328,4.328,0,0,0,.45-.609,16.187,16.187,0,0,0,1.112-2.436,10.842,10.842,0,0,0,.662-2.383,3.831,3.831,0,0,0-.066-.847q-.093-.609.013-.741a2.117,2.117,0,0,1,.583-.808q.477-.464.583-.6a10.921,10.921,0,0,0,1.125-2.238,10.042,10.042,0,0,0,.728-2.555,2.189,2.189,0,0,0-.079-.675,1.719,1.719,0,0,1-.053-.7,1.493,1.493,0,0,1,.238-.477c.124-.177.282-.379.477-.61s.344-.414.45-.556a5.968,5.968,0,0,0,.437-.807c.15-.327.282-.635.4-.927s.256-.609.424-.953a4.56,4.56,0,0,1,.516-.847,3.065,3.065,0,0,1,.7-.622,1.768,1.768,0,0,1,.953-.3,5.5,5.5,0,0,1,1.258.146l-.026.079a7.374,7.374,0,0,1,1.35-.238h20.15a3.488,3.488,0,0,1,3.019,1.483,3.777,3.777,0,0,1,.477,3.442l-7.255,23.99a10.352,10.352,0,0,1-1.893,4.064,4.879,4.879,0,0,1-3.4.914H3.623a1.167,1.167,0,0,0-1.006.4,1.209,1.209,0,0,0-.026,1.139q.635,1.853,3.813,1.853H30.842a2.938,2.938,0,0,0,1.483-.41,1.9,1.9,0,0,0,.927-1.1l7.943-26.134a4.277,4.277,0,0,0,.132-1.509A3.5,3.5,0,0,1,42.89-1398.733Zm-28.173.053a.69.69,0,0,0,.053.6.578.578,0,0,0,.53.252H31.4a1.107,1.107,0,0,0,.675-.252,1.181,1.181,0,0,0,.437-.6l.556-1.695a.69.69,0,0,0-.053-.6.578.578,0,0,0-.53-.252h-16.1a1.108,1.108,0,0,0-.675.252,1.182,1.182,0,0,0-.437.6Zm-2.2,6.779a.689.689,0,0,0,.053.6.577.577,0,0,0,.53.251H29.2a1.106,1.106,0,0,0,.675-.251,1.181,1.181,0,0,0,.437-.6l.556-1.695a.689.689,0,0,0-.053-.6.578.578,0,0,0-.53-.252h-16.1a1.108,1.108,0,0,0-.675.252,1.182,1.182,0,0,0-.437.6Z" transform="translate(0.522 1408)"/>
      </g>
      <g id="ic_add" transform="translate(1069.493 345.644)">
        <path fill="#f8f8f8" stroke="#333" strokeWidth="4px" fillRule="evenodd" d="M26.047-6.973h-9.02v9.02H14.02v-9.02H5V-9.98h9.02V-19h3.007v9.02h9.02v3.007Z" transform="translate(2.517 26.517)"/>
        <path fill="#f8f8f8" fillRule="evenodd" stroke="#f8f8f8" d="M26.047-6.973h-9.02v9.02H14.02v-9.02H5V-9.98h9.02V-19h3.007v9.02h9.02v3.007Z" transform="translate(2.517 26.517)"/>
        <path fill="none" fillRule="evenodd" d="M36.08,12.08H0V-24H36.08Z" transform="translate(0 24)"/>
      </g>
    </g>
  </svg>
);

AddBibleSVG.propTypes = { title: PropTypes.string.isRequired };

class AddBible extends React.Component {
  render() {
    let { showAddBibleModal, clickAddResource } = this.props;
    return (
      <div style={addBibleButtonContainerStyles}>
        <div style={{
          height: '60px', width: '60px', cursor: 'pointer',
        }} title={clickAddResource} onClick={showAddBibleModal}>
          <AddBibleSVG title={clickAddResource} />
        </div>
      </div>
    );
  }
}

AddBible.propTypes = {
  clickAddResource: PropTypes.string.isRequired,
  showAddBibleModal: PropTypes.func.isRequired,
};

export default AddBible;
