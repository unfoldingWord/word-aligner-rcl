import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { default as WordLexiconDetails } from 'tc-ui-toolkit/lib/WordLexiconDetails/index';
import * as lexiconHelpers from 'tc-ui-toolkit/lib/ScripturePane/helpers/lexiconHelpers';
import { Token } from 'wordmap-lexer';
import * as types from '../common/WordCardTypes';
// components
import Word from './WordCard';

const internalStyle = {
  word: {
    color: '#ffffff',
    backgroundColor: '#333333',
  },
};

/**
 * Renders a draggable primary word
 * @see WordCard
 *
 * @property wordObject
 * @property alignmentIndex
 * @property style
 * @property resourcesReducer
 *
 */
class PrimaryToken extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleOut = this._handleOut.bind(this);
    this._handleOver = this._handleOver.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.state = {
      hover: false,
      anchorEl: null,
    };
  }

  /**
   * called when drag is initialized
   */
  onDragStart(e) {
    const {
      selectedTokens,
      token,
      setDragToken,
      onClick,
      // connectDragPreview,
    } = this.props;

    // const hasSelections = selectedTokens && selectedTokens.length > 0;

    const token_ = {
      ...token,
      type: types.PRIMARY_WORD
    };
    setDragToken && setDragToken(token_);

    // let tokens = [];

    // if (selectedTokens) {
    //   tokens = [...selectedTokens];
    //
    //   // TRICKY: include the dragged token in the selection
    //   if (!containsToken(tokens, token)) {
    //     tokens.push(token);
    //
    //     // select the token so it's renders with the selections
    //     if (onClick && selectedTokens.length > 0) {
    //       onClick(token);
    //     }
    //   }
    // } else {
    //   // TRICKY: always populate tokens.
    //   tokens.push(token);
    // }


    // const numSelections = tokens.length;
    //
    // if (numSelections > 1 && connectDragPreview) {
    //   const img = new Image();
    //   img.onload = () => connectDragPreview(img);
    //   img.src = this.getDragPreviewImage(numSelections);
    // } else if (connectDragPreview) {
    //   // use default preview
    //   connectDragPreview(null);
    // }
  }

  /**
   * Enables hover state
   * @private
   */
  _handleOver(e) {
    this.setState({
      hover: true,
      anchorEl: e.currentTarget,
    });
  }

  /**
   * Disables hover state
   * @private
   */
  _handleOut() {
    this.setState({
      hover: false,
      anchorEl: null,
    });
  }

  render() {
    const {
      token,
      style,
      canDrag,
      fontSize,
      isHebrew,
      direction,
      isDragging,
      setDragToken,
      connectDragSource,
    } = this.props;
    const { hover } = this.state;

    const disabled = (isDragging || hover) && !canDrag;
    const word = (
      <div>
        <Word
          word={token.text}
          disabled={disabled}
          fontSize={fontSize}
          isHebrew={isHebrew}
          direction={direction}
          occurrence={token.occurrence}
          occurrences={token.occurrences}
          style={{ ...internalStyle.word, ...style }}
          onDragStart={this.onDragStart}
        />
      </div>
    );
    return (
      <div style={{ flex: 1, position: 'relative' }}
        onClick={this._handleClick}
        onMouseOver={this._handleOver}
        onMouseOut={this._handleOut}>
        {word}
      </div>
    );
  }

  /**
   * Handles clicks on the word
   * @param e - the click event
   * @private
   */
  _handleClick(e) {
    const {
      translate, token, isHebrew, showPopover,
    } = this.props;
    const lexiconData = lexiconHelpers.lookupStrongsNumbers(token.strong, this.props.getLexiconData);
    const positionCoord = e.target;
    const fontSize = isHebrew ? '1.7em' : '1.2em';
    const PopoverTitle = (
      <strong style={{ fontSize }}>{token.text}</strong>
    );
    const wordDetails = (
      <WordLexiconDetails lexiconData={lexiconData} wordObject={token} translate={translate}
        isHebrew={isHebrew}/>
    );
    showPopover(PopoverTitle, wordDetails, positionCoord);
  }
}

PrimaryToken.propTypes = {
  fontSize: PropTypes.number,
  translate: PropTypes.func.isRequired,
  wordIndex: PropTypes.number,
  alignmentLength: PropTypes.number,
  canDrag: PropTypes.bool,
  token: PropTypes.instanceOf(Token),
  alignmentIndex: PropTypes.number.isRequired,
  style: PropTypes.object,
  lexicons: PropTypes.object.isRequired,
  dragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  isDragging: PropTypes.bool.isRequired,
  setDragToken: PropTypes.bool.isRequired,
  isHebrew: PropTypes.bool.isRequired,
  showPopover: PropTypes.func.isRequired,
  getLexiconData: PropTypes.func.isRequired,
  loadLexiconEntry: PropTypes.func.isRequired,
};

PrimaryToken.defaultProps = {
  alignmentLength: 1,
  wordIndex: 0,
  canDrag: true,
  direction: 'ltr',
  style: {},
};

export default PrimaryToken;
