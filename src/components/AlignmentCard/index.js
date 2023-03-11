import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as types from '../../common/WordCardTypes';
import SecondaryToken from '../SecondaryToken';
import PrimaryToken from '../PrimaryToken';
import AlignmentCard from './AlignmentCard';

const styles = {
  root: {
    open: {
      width: 'auto',
      display: 'inherit',
      transition: '0.5s',
    },
    closed: {
      width: '0',
      display: 'none',
      transition: '0.5s',
    },
  },
};

/**
 * Renders the alignment of primary and secondary words/phrases
 */
class DroppableAlignmentCard extends Component {
  constructor(props) {
    super(props);
    this._handleCancelSuggestion = this._handleCancelSuggestion.bind(this);
    this._handleAcceptSuggestion = this._handleAcceptSuggestion.bind(this);
    this.drop = this.drop.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
  }

  _handleCancelSuggestion(token) {
    const { onCancelTokenSuggestion, alignmentIndex } = this.props;

    if (typeof onCancelTokenSuggestion === 'function') {
      onCancelTokenSuggestion(alignmentIndex, token);
    }
  }

  _handleAcceptSuggestion(token) {
    const { onAcceptTokenSuggestion, alignmentIndex } = this.props;

    if (typeof onAcceptTokenSuggestion === 'function') {
      onAcceptTokenSuggestion(alignmentIndex, token);
    }
  }

  drop(ev) {
    ev.preventDefault();
    const token = this.props.dragToken;
    const alignmentIndex = this.props.alignmentIndex;
    this.props.onDrop(token, alignmentIndex);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  onDrag(token, isPrimary) {
    this.props.setDragToken(token, isPrimary)
  }

  render() {
    const {
      translate,
      lexicons,
      canDrop,
      dragItemType,
      isOver, //TODO: need to fix logic in alignment card determine droppable target
      targetNgram,
      sourceNgram,
      alignmentIndex,
      sourceStyle,
      sourceDirection,
      targetDirection,
      isSuggestion,
      isHebrew,
      showPopover,
      loadLexiconEntry,
      fontSize,
      targetLanguageFontClassName,
      showAsDrop,
    } = this.props;
    const acceptsTop = canDrop && dragItemType === types.PRIMARY_WORD;
    const acceptsBottom = canDrop && dragItemType === types.SECONDARY_WORD;

    const hoverTop = isOver && acceptsTop;
    const hoverBottom = isOver && acceptsBottom;

    const emptyAlignment = sourceNgram.length === 0 && targetNgram.length === 0;

    const topWordCards = sourceNgram.map((token, index) => (
      <PrimaryToken
        key={index}
        token={token}
        wordIndex={index}
        style={sourceStyle}
        lexicons={lexicons}
        isHebrew={isHebrew}
        fontSize={fontSize}
        translate={translate}
        direction={sourceDirection}
        alignmentLength={sourceNgram.length}
        alignmentIndex={alignmentIndex}
        showPopover={showPopover}
        loadLexiconEntry={loadLexiconEntry}
        setDragToken={(token) => this.onDrag(token, true)}
      />
    ));
    const bottomWordCards = targetNgram.map((token, index) => (
      <SecondaryToken
        key={index}
        token={token}
        direction={targetDirection}
        alignmentIndex={alignmentIndex}
        onCancel={this._handleCancelSuggestion}
        onAccept={this._handleAcceptSuggestion}
        targetLanguageFontClassName={targetLanguageFontClassName}
        setDragToken={(token) => this.onDrag(token, false)}
      />
    ));

    if (emptyAlignment && !showAsDrop) {
      return <div style={styles.root.closed}/>;
    } else {
      return (
        <div
          onDragOver={this.allowDrop}
          onDrop={this.drop}
        >
          <AlignmentCard targetTokenCards={bottomWordCards}
            targetDirection={targetDirection}
            hoverBottom={hoverBottom}
            hoverTop={hoverTop}
            isSuggestion={isSuggestion}
            acceptsTargetTokens={acceptsBottom}
            acceptsSourceTokens={acceptsTop}
            sourceTokenCards={topWordCards}/>
        </div>
      );
    }
  }
}

DroppableAlignmentCard.propTypes = {
  fontSize: PropTypes.number,
  onCancelTokenSuggestion: PropTypes.func,
  onAcceptTokenSuggestion: PropTypes.func,
  translate: PropTypes.func.isRequired,
  placeholderPosition: PropTypes.string,
  sourceStyle: PropTypes.object.isRequired,
  dragItemType: PropTypes.string,
  isOver: PropTypes.bool,
  sourceNgram: PropTypes.arrayOf(PropTypes.object).isRequired,
  targetNgram: PropTypes.arrayOf(PropTypes.object).isRequired,
  alignmentIndex: PropTypes.number.isRequired,
  isSuggestion: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  lexicons: PropTypes.object.isRequired,
  sourceDirection: PropTypes.oneOf(['ltr', 'rtl']),
  targetDirection: PropTypes.oneOf(['ltr', 'rtl']),
  isHebrew: PropTypes.bool.isRequired,
  targetLanguageFontClassName: PropTypes.string,
  showPopover: PropTypes.func.isRequired,
  loadLexiconEntry: PropTypes.func.isRequired,
  dragToken: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
  setDragToken: PropTypes.func,
  showAsDrop: PropTypes.bool,
};

DroppableAlignmentCard.defaultProps = {
  sourceDirection: 'ltr',
  targetDirection: 'ltr',
  sourceStyle: { fontSize: '100%' },
};

const dragHandler = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    const alignmentEmpty = (props.sourceNgram.length === 0 &&
      props.targetNgram.length === 0);
    let canDrop = false;

    if (item.type === types.SECONDARY_WORD) {
      if (item.alignmentIndex === undefined) {
        // TRICKY: tokens from the word list will not have an alignment
        canDrop = !alignmentEmpty;
      } else {
        const alignmentPositionDelta = props.alignmentIndex - item.alignmentIndex;
        canDrop = alignmentPositionDelta !== 0 && !alignmentEmpty;
      }
      return canDrop;
    }

    if (item.type === types.PRIMARY_WORD) {
      return canDropPrimaryToken(props, item);
    }
  },
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  },
};

export default DroppableAlignmentCard;
