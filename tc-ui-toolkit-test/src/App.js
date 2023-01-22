import React, { Component } from 'react';
import {
  ScripturePane, VerseCheck, CheckInfoCard, GroupedMenu, generateMenuData, TranslationHelps, TcuiThemeProvider, createTcuiTheme,
} from 'tc-ui-toolkit';
import {
  sampleIndex,
  sampleData,
  groupedMenufilters,
  groupedMenuActions,
} from './assets/groupedMenuProps';
import {
  bibles,
  contextId,
  currentPaneSettings,
  otherSPProps,
} from './assets/scripturePaneProps';
import {
  verseCheckActions,
  // verseCheckSelections
} from './assets/verseCheckProps';
import translationHelpsProps from './assets/translationHelpsProps';
// reducers props
import projectDetailsReducer from './assets/projectDetailsReducer';
import contextIdReducer from './assets/contextIdReducer';
import groupsDataReducer from './assets/groupsDataReducer';
import groupsIndexReducer from './assets/groupsIndexReducer';
import groupMenuReducer from './assets/groupMenuReducer';
import toolsReducer from './assets/toolsReducer';
import selectionsReducer from './assets/selectionsReducer';
// import resourcesReducer from './assets/resourcesReducer'
// import commentsReducer from './assets/commentsReducer'
// import remindersReducer from './assets/remindersReducer'
// import loginReducer from './assets/loginReducer'
// files
import { article } from './assets/thelps';

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
      selectionsReducer,
      projectDetailsReducer,
    };
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps });
  }

  toggleHelpsModal() {
    this.setState({ showHelpsModal: !this.state.showHelpsModal });
  }

  toggleBookmark(event) {
    this.setState({
      remindersReducer: {
        ...this.state.remindersReducer,
        enabled: event.target.checked,
      },
    });
  }

  render() {
    const theme = createTcuiTheme({ scrollbarThumb: { borderRadius: '10px' } });

    const statusIcons = groupedMenufilters.filter(f => f.id !== 'incomplete');

    const entries = generateMenuData(sampleIndex, sampleData, 'done');

    return (
      <TcuiThemeProvider theme={theme}>
        <div style={{
          display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh',
        }}>
          <GroupedMenu
            title="Menu"
            filters={groupedMenufilters}
            statusIcons={statusIcons}
            entries={entries}
            actions={groupedMenuActions}
            projectDetailsReducer={projectDetailsReducer}
            contextIdReducer={contextIdReducer}
            groupsDataReducer={groupsDataReducer}
            groupsIndexReducer={groupsIndexReducer}
            groupMenuReducer={groupMenuReducer}
            toolsReducer={toolsReducer}
          />
          <div style={{
            display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'auto',
          }}>
            <ScripturePane
              {...otherSPProps}
              translate={k => k}
              bibles={bibles}
              contextId={contextId}
              currentPaneSettings={currentPaneSettings}
              projectDetailsReducer={projectDetailsReducer}
            />
            <CheckInfoCard
              getScriptureFromReference={() => 'Scripture Reference'}
              phrase="For the grace of God has appeared for the salvation of all people. Paul speaks of the grace of God [Titus 2:11](rc://en/ulb/book/tit/02/11) as if it were a person who goes to other people and trains them to live holy lives."
              translate={k => k}
              seeMoreLabel="see more"
              toggleHelps={this.toggleHelps.bind(this)}
              showHelps={this.state.showHelps} />
            <VerseCheck
              {...verseCheckActions}
              mode={this.state.mode}
              tags={this.state.tags}
              contextId={contextId}
              handleTagsCheckbox={(tag) => this.setState({ tags: [...this.state.tags, tag] })}
              changeMode={(mode) => this.setState({ mode })}
              cancelComment={() => this.setState({ mode: 'default' })}
              cancelEditVerse={() => this.setState({ mode: 'default' })}
              toggleNothingToSelect={nothingToSelect => this.setState({ nothingToSelect })}
              selections={this.state.selectionsReducer.selections}
              saveSelection={() => this.setState({ mode: 'default' })}
              nothingToSelect={this.state.nothingToSelect}
              cancelSelection={() => this.setState({ mode: 'default' })}
              clearSelection={() => {
                this.setState({ selectionsReducer: { selections: [] } });
              }}
              translate={k => k}
              newSelections={[]}
              verseText={'dummy text'}
              findIfVerseEdited={() => (true)}
              findIfVerseInvalidated={() => (true)}
              alignedGLText={'Dummy'}
              maximumSelections={5}
              verseEdited={false}
              commentText={''}
              dialogModalVisibility={false}
              unfilteredVerseText={''}
              bookmarkEnabled={false}
              isVerseInvalidated={false}
              isCommentChanged={false}
              localNothingToSelect={false}
              isVerseChanged={false}
              targetBible={bibles.targetLanguage.targetBible}
              bookDetails={this.state.projectDetailsReducer.manifest.project}
              targetLanguageDetails={this.state.projectDetailsReducer.manifest.target_language}
            />
          </div>
          <TranslationHelps
            modalArticle={article}
            article={article}
            translate={k => k}
            isShowHelpsExpanded={this.state.showHelpsModal}
            openExpandedHelpsModal={this.toggleHelpsModal.bind(this)}
            sidebarToggle={this.toggleHelps.bind(this)}
            isShowHelpsSidebar={this.state.showHelps}
            {...translationHelpsProps}
          />
        </div>
      </TcuiThemeProvider>
    );
  }
}

export default App;
