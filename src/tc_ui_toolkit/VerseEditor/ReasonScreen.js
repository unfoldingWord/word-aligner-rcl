/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import ReasonCheckbox from './ReasonCheckbox';

export const updateReasons = (reason, checked, selectedReasons) => {
  let newReasons = [
    ...selectedReasons,
  ];

  if (checked && !newReasons.includes(reason)) {
    newReasons.push(reason);
  } else if (!checked && newReasons.includes(reason)) {
    const index = newReasons.indexOf(reason);
    newReasons.splice(index, 1);
  }
  return newReasons;
};

/**
 * @callback ReasonScreen~onChange
 * @param {string[]} newReasons - an array of reasons for editing the verse
 */

/**
 * Renders checkboxes to indicate the reason for the change
 * @property {ReasonScreen~onChange} onChange - callback when the selected reasons change
 * @property {func} translate - the locale function
 * @property {string[]} selectedReasons - an array of selected reasons
 */
class ReasonScreen extends React.Component {
  constructor(props) {
    super(props);
    this._handleCheck = this._handleCheck.bind(this);
  }

  /**
   * Checks if a checkbox is selected
   * @param {string} reason
   * @param {bool} checked
   * @return {boolean}
   * @private
   */
  _handleCheck(reason, checked) {
    const { selectedReasons, onChange } = this.props;
    const newReasons = updateReasons(reason, checked, selectedReasons);
    onChange(newReasons);
  }

  /**
   * get reasons as an array, so easy to separate into columns
   * @param {Function} translate
   * @param {Object} selectedReasons - selections state
   * @return {*[]}
   */
  getReasons(translate, selectedReasons) {
    const reasons = [
      <ReasonCheckbox reason="spelling"
        label={translate('spelling')}
        key={'spelling'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
      <ReasonCheckbox reason="punctuation"
        label={translate('punctuation')}
        key={'punctuation'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
      <ReasonCheckbox reason="word_choice"
        label={translate('word_choice')}
        key={'word_choice'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
      <ReasonCheckbox reason="meaning"
        label={translate('meaning')}
        key={'meaning'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
      <ReasonCheckbox reason="grammar"
        label={translate('grammar')}
        key={'grammar'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
      <ReasonCheckbox reason="other"
        label={translate('other')}
        key={'other'}
        onCheck={this._handleCheck}
        selectedReasons={selectedReasons}/>,
    ];
    return reasons;
  }

  /**
   * formats layout based on number of columns
   * @param {int} columns
   * @param {Array} reasons
   * @return {*}
   */
  getLayout(columns, reasons) {
    let perColumn = reasons.length / columns;
    const perColumnInt = Math.floor(perColumn);

    if (perColumnInt !== perColumn) {
      perColumn = perColumnInt + 1; // if not whole count
    }

    if (columns > 1) {
      return (
        <div className='reasons-screen'>
          {
            Array(columns).fill(0).map((value, index) => { // for each column
              const column = reasons.slice(index * perColumn, perColumn);
              return (
                <div className='reasons-screen-column'>
                  {column}
                </div>
              );
            })
          }
        </div>
      );
    }
    // else single column
    return (
      <div className='reasons-screen-column'>
        {reasons}
      </div>
    );
  }

  render() {
    const {
      translate, selectedReasons, columns,
    } = this.props;
    const reasons = this.getReasons(translate, selectedReasons);
    return this.getLayout(columns, reasons);
  }
}

ReasonScreen.propTypes = {
  onChange: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  selectedReasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  columns: PropTypes.number.isRequired,
};

ReasonScreen.defaultProps = { columns: 2 };

export default ReasonScreen;
