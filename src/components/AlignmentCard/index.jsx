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

function getAlignmentIndex(dropProps) {
  let index = dropProps && (dropProps.index !== undefined) ? dropProps.index : dropProps.alignmentIndex;
  return index;
}

function doesListIncludeIndex(targetList, index) {
  for (const item of (targetList || [])) {
    let listIndex = getAlignmentIndex(item);
    if (listIndex === index) {
      return true;
    }
  }
  return false;
}

/**
 * Determines if a word can be dropped
 * @param dropTargetProps
 * @param dragSourceProps
 * @return {boolean} true if target can be dropped on this card
 */
export const canDropPrimaryToken = (dropTargetProps, dragSourceProps) => {
  const emptyTarget = dropTargetProps.sourceNgram.length === 0;
  const singleTarget = dropTargetProps.sourceNgram.length === 1;
  const mergedTarget = dropTargetProps.sourceNgram.length > 1;
  const different = !doesListIncludeIndex(dropTargetProps.sourceNgram, getAlignmentIndex(dragSourceProps));
  // console.log(`AlignmentCard.canDropPrimaryToken()`, { emptyTarget, singleTarget, mergedTarget, different, dragSourceProps, dropTargetProps })

  // moving single word to group alignment
  // TRICKY: make sure this is to a different alignment
  if ((mergedTarget || singleTarget) && different) {
    // console.log(`AlignmentCard.canDropPrimaryToken() - single source to different group`)
    return true;
  }

  // moving single word to new alignment
  // TRICKY: make sure this is to a different alignment
  if (emptyTarget && different) {
    // console.log(`AlignmentCard.canDropPrimaryToken() - new alignment`)
    return true;
  }

  // console.log(`AlignmentCard.canDropPrimaryToken() - illegal drop`)
  return false; // any other destinations are not allowed
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
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.state = {
      isOver: false,
      canDrop: false,
    };
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
    this.setState({ isOver: false, canDrop: false })
  }

  onDragLeave(ev) {
    this.setState({ isOver: false, canDrop: false })
  }

  onDragOver(ev) {
    const item = this.props.dragToken;
    const alignmentEmpty = (this.props.sourceNgram.length === 0 &&
      this.props.targetNgram.length === 0);
    let canDrop = false;
    const fromWordBank = (Array.isArray(item)) || !item.type;
    // console.log(`DraggableAlignmentCard.onDragOver()`,  item)

    if (fromWordBank || (item.type === types.SECONDARY_WORD)) {
      if (fromWordBank) {
        canDrop = !alignmentEmpty;
        // console.log(`DraggableAlignmentCard.onDragOver() - fromWordBank`, { canDrop, fromWordBank})
      } else {
        const alignmentPositionDelta = this.props.alignmentIndex - item.alignmentIndex;
        //allow drop of suggestion on the source tile as a to mark it as not a suggestion.
        canDrop = (alignmentPositionDelta !== 0 || this.props.isSuggestion) && !alignmentEmpty;
        // console.log(`DraggableAlignmentCard.onDragOver() - not fromWordBank`, { canDrop, alignmentPositionDelta, alignmentEmpty})
      }
    } else if (item.type === types.PRIMARY_WORD) {
      canDrop = canDropPrimaryToken(this.props, item);
      // console.log(`DraggableAlignmentCard.onDragOver() - primary word`, { canDrop, alignmentEmpty})
    }

    if (canDrop) {
      ev.preventDefault();
    }
    this.setState({ isOver: true, canDrop })
  }

  onDrag(token, dragFinished, isPrimary) {
    this.props.setDragToken(token, dragFinished, isPrimary)
  }

  render() {
    const {
      translate,
      lexicons,
      dragItemType,
      targetNgram,
      sourceNgram,
      alignmentIndex,
      sourceStyle,
      sourceDirection,
      targetDirection,
      isSuggestion,
      sourceSuggested,
      isHebrew,
      showPopover,
      loadLexiconEntry,
      fontSize,
      targetLanguageFontClassName,
      showAsDrop,
    } = this.props;
    const acceptsTop = this.state.canDrop && dragItemType === types.PRIMARY_WORD;
    const acceptsBottom = this.state.canDrop && dragItemType === types.SECONDARY_WORD;

    const hoverTop = this.state.isOver && acceptsTop;
    const hoverBottom = this.state.isOver && acceptsBottom;

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
        setDragToken={(token, dragFinished) => this.onDrag(token, dragFinished, true)}
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
        setDragToken={(token, dragFinished) => this.onDrag(token, dragFinished, false)}
      />
    ));

    if (emptyAlignment && !showAsDrop) {
      return <div style={styles.root.closed}/>;
    } else {
      return (
        <div
          onDragOver={this.onDragOver}
          onDrop={this.drop}
          onDragLeave={this.onDragLeave}
        >
          <AlignmentCard targetTokenCards={bottomWordCards}
            targetDirection={targetDirection}
            hoverBottom={hoverBottom}
            hoverTop={hoverTop}
            isSuggestion={isSuggestion}
            sourceSuggested={sourceSuggested}
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
  sourceNgram: PropTypes.arrayOf(PropTypes.object).isRequired,
  targetNgram: PropTypes.arrayOf(PropTypes.object).isRequired,
  alignmentIndex: PropTypes.number.isRequired,
  isSuggestion: PropTypes.bool,
  sourceSuggested: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
  lexicons: PropTypes.object.isRequired,
  sourceDirection: PropTypes.oneOf(['ltr', 'rtl']),
  targetDirection: PropTypes.oneOf(['ltr', 'rtl']),
  isHebrew: PropTypes.bool.isRequired,
  targetLanguageFontClassName: PropTypes.string,
  showPopover: PropTypes.func.isRequired,
  loadLexiconEntry: PropTypes.func.isRequired,
  dragToken: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setDragToken: PropTypes.func.isRequired,
  showAsDrop: PropTypes.bool,
};

DroppableAlignmentCard.defaultProps = {
  sourceDirection: 'ltr',
  targetDirection: 'ltr',
  sourceStyle: { fontSize: '100%' },
};

export default DroppableAlignmentCard;
