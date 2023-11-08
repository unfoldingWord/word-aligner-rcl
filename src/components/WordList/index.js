import React from 'react';
import PropTypes from 'prop-types';
import WordList from './WordList';
import * as types from "../../common/WordCardTypes";

/**
 * Renders a word bank with drag-drop support
 */
class DroppableWordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordListScrollTop: null,
      selectedWordPositions: [],
      selectedWords: [],
      isOver:false,
    };
    this.handleWordSelection = this.handleWordSelection.bind(this);
    this.clearWordSelections = this.clearWordSelections.bind(this);
    this.onEscapeKeyPressed = this.onEscapeKeyPressed.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.drop = this.drop.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  setScrollState(wordList, nextProps) {
    if (this.props.chapter !== nextProps.chapter || this.props.verse !== nextProps.verse) {
      wordList.scrollTop = 0;
      this.setState({ wordListScrollTop: null });
    } else if (!this.state.isOver) {
      this.setState({ wordListScrollTop: wordList.scrollTop });
    }
  }

  setWordListScroll(wordList) {
    if (!this.state.isOver && this.state.wordListScrollTop) {
      wordList.scrollTop = this.state.wordListScrollTop;
      this.setState({ wordListScrollTop: null });
    }
  }

  resetSelectedWordsState(nextProps) {
    if (this.props.chapter !== nextProps.chapter || this.props.verse !== nextProps.verse || nextProps.reset) {
      this.clearWordSelections();
    }
  }

  componentWillReceiveProps(nextProps) {
    let wordList = document.getElementById('wordList');

    if (!wordList) {
      wordList = this.props.wordList;
    }
    this.setScrollState(wordList, nextProps);
    this.resetSelectedWordsState(nextProps);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onEscapeKeyPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscapeKeyPressed);
  }

  onEscapeKeyPressed(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.clearWordSelections();
    }
  }

  componentDidUpdate() {
    let wordList = document.getElementById('wordList');

    if (!wordList) {
      wordList = this.props.wordList;
    }
    this.setWordListScroll(wordList);
  }

  onDragLeave(ev) {
    this.setState({ isOver: false });
    // console.log(`WordList.onDragLeave()`);
  }

  onDragOver(ev) {
    const item = this.props.dragToken;
    let canDrop = false;
    if (item) {
      const notPrimary = (item.type !== types.PRIMARY_WORD);
      const fromWordBank = (Array.isArray(item)) || !item.type;

      if (notPrimary && !fromWordBank && !this.props.reset) {
        canDrop = true;
      }
      // console.log(`WordList.onDragOver()- canDrop=${canDrop}, item.type=${item?.type}, fromWordBank=${fromWordBank}`);
    } else {
      // console.log(`WordList.onDragOver()- no drag item, canDrop=${canDrop}`);
    }

    if (canDrop) {
      ev.preventDefault();
    }
    this.setState({ isOver: canDrop })
  }

  drop(ev) {
    const {
      dragToken,
      onWordDropped,
    } = this.props;

    ev.preventDefault();
    this.props.onDropTargetToken(dragToken);
    this.setState({ isOver: false })
    // console.log(`WordList.drop()`, dragToken);
  }

  onDrag(token) {
    if (token) {
      const words = [...this.state.selectedWords];
      let dragging = {
        ...token,
        type: null,
      };
      const index = words.findIndex(item => (
        token.text === item.text &&
        token.occurrence === item.occurrence
      ));

      if (index === -1) {
        words.push(dragging);
      }

      if (words.length > 1) {
        dragging = words
      }

      this.props.setDragToken(dragging);
      // console.log(`WordList.onDrag()`, dragging);
    } else {
      // drag stopped
      this.setState({ isOver: false })
    }
  }

  /**
   * maintains the list of selected words
   * @param {object} token - token clicked
   * @param {boolean} selectToCurrentToken - if true then select all the words from first selection up through selected token
   */
  handleWordSelection(token, selectToCurrentToken) {
    const { selectedWordPositions, selectedWords } = this.state;
    let _selectedPositions = [...selectedWordPositions];
    let _selectedWords = [...selectedWords];
    token = {
      ...token,
      type: null,
    }

    const index = _selectedPositions.indexOf(token.index);

    if (index === -1) {
      _selectedPositions.push(token.index);
      _selectedWords.push(token);

      // if we are also to select words in-between
      if (selectToCurrentToken && _selectedPositions?.length) {
        var tIndex = token.index;
        let firstSelection = tIndex
        const _positions = _selectedPositions.toSorted();

        // find first selection
        for (const index of _positions) {
          if (index < firstSelection) {
            firstSelection = index
            break
          }
        }

        if (firstSelection < tIndex && this.props.words?.length) { // if there was a first selection, then select from that item up to token
          for (const word of this.props.words) { // search through the word list
            const index = word.index
            if ( index > firstSelection && index < tIndex && !word.disabled ) {
              const pos = _selectedPositions.indexOf(index);
              if (pos < 0) {
                _selectedPositions.push(index);
                _selectedWords.push(word);
              }
            }
          }
        }
      }
    } else {
      _selectedPositions.splice(index, 1);
      _selectedWords.splice(index, 1);
    }

    this.setState({
      selectedWords: _selectedWords,
      selectedWordPositions: _selectedPositions,
    });
  }

  /**
   * Un-selects all words in the list
   */
  clearWordSelections() {
    this.setState({
      selectedWords: [],
      selectedWordPositions: [],
    });
  }

  render() {
    const {
      words,
      direction,
      toolsSettings,
      setToolSettings,
      targetLanguageFont,
      dragToken,
      reset,
      styles,
    } = this.props;
    const { selectedWords, selectedWordPositions } = this.state;
    const { fontSize } = toolsSettings['WordList'] || {};
    const wordListStyle = {
      height: '100%',
      width: '100%',
      backgroundColor: '#DCDCDC',
      overflowY: 'auto',
      padding: '8px',
      direction: direction,
    };

    if (fontSize) {
      wordListStyle.fontSize = `${fontSize}%`;
    }

    return (
      <div id='wordList'
       style={{ ...wordListStyle, ...styles }}
       onDrop={this.drop}
       onDragOver={this.onDragOver}
       onDragLeave={this.onDragLeave}
      >
        <WordList
          toolSettings={toolsSettings['WordList']}
          words={words}
          direction={direction}
          toolsSettings={toolsSettings}
          selectedWords={selectedWords}
          setToolSettings={setToolSettings}
          onWordClick={this.handleWordSelection}
          targetLanguageFont={targetLanguageFont}
          selectedWordPositions={selectedWordPositions}
          dragToken={dragToken}
          setDragToken={this.onDrag}
          reset={reset}
          isOver={this.state.isOver}
        />
      </div>
    );
  }
}

DroppableWordList.propTypes = {
  styles: PropTypes.object,
  reset: PropTypes.bool,
  verse: PropTypes.oneOf(PropTypes.number, PropTypes.string),
  chapter: PropTypes.number,
  wordList: PropTypes.object,
  targetLanguageFont: PropTypes.string,
  toolsSettings: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  dragToken: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
  setDragToken: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  onDropTargetToken: PropTypes.func.isRequired,
  words: PropTypes.arrayOf(PropTypes.object),
};

DroppableWordList.defaultProps = {
  direction: 'ltr',
  reset: false,
  styles: {}
};

export default DroppableWordList;
