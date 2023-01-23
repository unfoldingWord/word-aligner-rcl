import React, { Component } from 'react';
// import WordAligner from 'word-aligner-rcl';
// import DroppableWordList from 'word-aligner-rcl';
import { DragDropContext } from 'react-dnd';

const verseAlignments = require('./data/alignments.json');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelps: false,
      showHelpsModal: false,
      remindersReducer: { enabled: false },
      tags: [],
      mode: 'default',
      nothingToSelect: false,
    };
  }

  render() {
    console.log('verseAlignments=', JSON.stringify(verseAlignments).substring(0, 100));

    return (
      <DragDropContext>
        <div style={{
          display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh',
        }}>
          {/*<DroppableWordList*/}
          {/*  verseAlignments={verseAlignments}*/}
          {/*/>*/}
          Test
          {/*<WordAligner*/}
          {/*  verseAlignments={verseAlignments}*/}
          {/*/>*/}
        </div>
      </DragDropContext>
    );
  }
}

export default App;
