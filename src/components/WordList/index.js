import React from 'react';
import PropTypes from 'prop-types';
// import { DropTarget } from 'react-dnd';
import { Token } from 'wordmap-lexer';
import * as types from '../../common/WordCardTypes';
import WordList from './WordList';

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
    };
    this.handleWordSelection = this.handleWordSelection.bind(this);
    this.clearWordSelections = this.clearWordSelections.bind(this);
    this.onEscapeKeyPressed = this.onEscapeKeyPressed.bind(this);
    this.onWordDropped = this.onWordDropped.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  setScrollState(wordList, nextProps) {
    if (this.props.chapter !== nextProps.chapter || this.props.verse !== nextProps.verse) {
      wordList.scrollTop = 0;
      this.setState({ wordListScrollTop: null });
    } else if (!this.props.isOver) {
      this.setState({ wordListScrollTop: wordList.scrollTop });
    }
  }

  setWordListScroll(wordList) {
    if (!this.props.isOver && this.state.wordListScrollTop) {
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

  onDrag(token) {
    const words = [...this.state.selectedWords];
    let dragging = token;
    const index = words.findIndex(item => (
      token.text === item.text &&
      token.tokenOccurrence === item.tokenOccurrence
    ));

    if (index === -1) {
      words.push(token);
    }
    
    if (words.length > 1) {
      dragging = words
    }

    this.props.setDragToken(dragging);
  }
  
  /**
   * maintains the list of selected words
   * @param token
   */
  handleWordSelection(token) {
    const { selectedWordPositions, selectedWords } = this.state;
    let positions = [...selectedWordPositions];
    let words = [...selectedWords];

    const index = positions.indexOf(token.tokenPos);

    if (index === -1) {
      positions.push(token.tokenPos);
      words.push(token);
    } else {
      positions.splice(index, 1);
      words.splice(index, 1);
    }

    this.setState({
      selectedWords: words,
      selectedWordPositions: positions,
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

  onWordDropped() {
    this.props.onDropTargetToken(this.props.dragToken);
  }

  render() {
    const {
      words,
      chapter,
      verse,
      isOver,
      direction,
      toolsSettings,
      setToolSettings,
      targetLanguageFont,
      dragToken,
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
      <div id='wordList' style={wordListStyle}>
        <WordList
          toolSettings={toolsSettings['WordList']}
          verse={verse}
          words={words}
          isOver={isOver}
          chapter={chapter}
          direction={direction}
          toolsSettings={toolsSettings}
          selectedWords={selectedWords}
          setToolSettings={setToolSettings}
          onWordClick={this.handleWordSelection}
          targetLanguageFont={targetLanguageFont}
          onWordDropped={this.onWordDropped}
          selectedWordPositions={selectedWordPositions}
          dragToken={dragToken}
          setDragToken={this.onDrag}
        />
      </div>
    );
  }
}

DroppableWordList.propTypes = {
  reset: PropTypes.bool,
  verse: PropTypes.oneOf(PropTypes.number, PropTypes.string),
  chapter: PropTypes.number,
  wordList: PropTypes.object,
  isOver: PropTypes.bool.isRequired,
  targetLanguageFont: PropTypes.string,
  toolsSettings: PropTypes.object.isRequired,
  setToolSettings: PropTypes.func.isRequired,
  dragToken: PropTypes.object.isRequired,
  setDragToken: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  onDropTargetToken: PropTypes.func.isRequired,
  words: PropTypes.arrayOf(PropTypes.instanceOf(Token)),
};

DroppableWordList.defaultProps = {
  direction: 'ltr',
  reset: false,
};

/**
 * Handles drag events on the word bank
 */
const dragHandler = {
  drop(props, monitor) {
    const item = monitor.getItem();

    if (item.alignmentIndex !== undefined) {
      props.onDropTargetToken(item.token, item.alignmentIndex);
    }
  },
};

export default DroppableWordList;
