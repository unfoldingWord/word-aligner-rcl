import React, { Component } from 'react';
import WordAligner from 'word-aligner-rcl';

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
      // <div style={{
      //   display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh',
      // }}>
        <WordAligner
          verseAlignments={verseAlignments}
        />
      // </div>
    );
  }
}

export default App;
