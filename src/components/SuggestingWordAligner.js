import React, {useState} from 'react';
import PropTypes from 'prop-types';
import WordList from './WordList/index';
import AlignmentGrid from "./AlignmentGrid";
import {OT_ORIG_LANG} from "../common/constants";
import delay from "../utils/delay";
import * as types from '../common/WordCardTypes';
import MAPControls from './MAPControls';
import { Alignment, Ngram } from "wordmap";
import {Token} from 'wordmap-lexer';

// on alignment changes, identifies possible source and destination
const TARGET_WORD_BANK=`Target Word Bank`;
const GRID=`Alignment Grid`;

// On alignment change identifies event type
const MERGE_ALIGNMENT_CARDS=`Alignment Grid - merge alignments`;
const CREATE_NEW_ALIGNMENT_CARD=`Alignment Grid - new alignment`;
const UNALIGN_TARGET_WORD = `Unalign Target Word`;
const ALIGN_TARGET_WORD = `Align Target Word`;
const ALIGN_SOURCE_WORD = `Align Source Word`;

const lexiconCache_ = {};
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    fontSize: '14px',
  },
  groupMenuContainer: {
    width: '250px',
    height: '100%',
  },
  wordListContainer: {
    minWidth: '150px',
    maxWidth: '400px',
    height: '100%',
    display: 'flex',
  },
  alignmentAreaContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: 'calc(100vw - 650px)',
    height: '100%',
  },
  scripturePaneWrapper: {
    minHeight: '250px',
    marginBottom: '20px',
    maxHeight: '310px',
  },
  alignmentGridWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
    boxSizing: 'border-box',
    margin: '0 10px 6px 10px',
    boxShadow: '0 3px 10px var(--background-color)',
  },
  wordStyle: {
    backgroundColor: 'lightblue',
    margin: '20px 25%',
    textAlign: 'center',
    fontSize: '40px'
  },
};

/**
 * search word list to find index of token
 * @param {array} wordList
 * @param {object} token
 * @return {number} - index of token or -1 if not found
 */
function findInWordList(wordList, token) {
  let found = -1;
  for (let i = 0, l = wordList.length; i < l; i++) {
    const item = wordList[i];
    if (item.text === token.text &&
      item.occurrence === token.occurrence) {
      found = i;
      break;
    }
  }
  return found;
}

/**
 * search tokens array to find index of token
 * @param {array} tokens
 * @param {object} token
 * @return {number} - index of token or -1 if not found
 */
function findToken(tokens, token) {
  let found = -1;
  for (let i = 0, l = tokens.length; i < l; i++) {
    const item = tokens[i];
    if (item.text === token.text &&
      item.occurrence === token.occurrence) {
      found = i;
      break;
    }
  }
  return found;
}

/**
 * search alignments array to find location of target token
 * @param {array} alignments
 * @param {object} token
 * @return {{tokenIndex: number, alignmentIndex: number}} - index of token in alignment and index of alignment, or -1 if not found
 */
function findAlignment(alignments, token) {
  let tokenIndex = -1;
  let alignmentIndex = -1;
  for (let i = 0, l = alignments.length; i < l; i++) {
    const targets = alignments[i].targetNgram;
    tokenIndex = findToken(targets, token)
    if (tokenIndex >= 0) {
      alignmentIndex = i;
      break;
    }
  }
  return { tokenIndex, alignmentIndex };
}

/**
 * convert from token format to format used by word alignment
 * @param {object} token
 * @return {*&{occurrences: *, suggestion: boolean, index: *, occurrence: *, text}}
 */
function tokenToAlignment(token) {
  return {
    ...token,
    suggestion: false,
  }
}

/**
 * const from word alignment format to token format
 * @param {object} alignment
 * @return {*&{occurrence, occurrences, text, index}}
 */
function alignmentToToken(alignment) {
  return { // make shallow copy
    ...alignment,
  }
}

/**
 * clean up alignment data:
 *     - remove any alignments that have no words
 *     - sort the source and target words within each card
 *     - sort the alignment cards to by primary words
 * @param {array} alignments
 * @return {*[]}
 */
function alignmentCleanup(alignments) {
  let alignments_ = [...alignments]

  // remove empty and sort words
  for (let i = 0; i < alignments_.length; i++) {
    const alignment = alignments_[i]
    if (!alignment.targetNgram.length && !alignment.sourceNgram.length) {
      alignments_.splice(i, 1);
      i--; // backup to accommodate deleted item
    } else { // order words in alignment
      alignment.targetNgram = alignment.targetNgram.sort(indexComparator)
      alignment.sourceNgram = alignment.sourceNgram.sort(indexComparator)
    }
  }

  // alignment ordering by source words
  alignments_ = alignments_.sort(alignmentComparator);

  // update index and ordering
  for (let i = 0; i < alignments_.length; i++) {
    const alignment = alignments_[i]
    alignment.index = i;
  }

  return alignments_;
}

/**
 * get the sort order for sorting alignments - uses the first word in the primary tokens
 * @param {object} alignment
 * @return {number|*}
 */
function sortIndexForAlignment(alignment) {
  if (alignment.sourceNgram.length) {
    const index = alignment.sourceNgram[0].index;
    return index
  }
  return -1
}



/**
 * Adds the indexing location into tokens similar to tokenizeWords in Lexer.
 * https://github.com/unfoldingWord/wordMAP-lexer/blob/develop/src/Lexer.ts#L20
 * @param {Token[]} inputTokens - an array Wordmap Token objects.
 * @param sentenceCharLength - the length of the sentence in characters
 */
function updateTokenLocations(inputTokens, sentenceCharLength = -1){
  if (sentenceCharLength === -1) {
      sentenceCharLength = inputTokens.map( t => t.text ).join(" ").length;
  }

  //const tokens: {text: string, position: number, characterPosition: number, sentenceTokenLen: number, sentenceCharLen: number, occurrence: number}[] = [];
  let charPos = 0;
  let tokenCount = 0;
  const occurrenceIndex = {};
  for (const inputToken of inputTokens) {
      if (!occurrenceIndex[inputToken.text]) {
          occurrenceIndex[inputToken.text] = 0;
      }
      occurrenceIndex[inputToken.text] += 1;
      inputToken.tokenPos = tokenCount;
      inputToken.charPos = charPos;
      inputToken.sentenceTokenLen = inputTokens.length;
      inputToken.sentenceCharLen = sentenceCharLength;
      inputToken.tokenOccurrence = occurrenceIndex[inputToken.text];
      tokenCount++;
      charPos += inputToken.text.length;
  }

  // Finish adding occurrence information
  for( const t of inputTokens){
    t.tokenOccurrences = occurrenceIndex[t.text];
  }
}

/**
 * sort comparator function for alignments
 * @param a
 * @param b
 * @return {number}
 */
const alignmentComparator = (a, b) => sortIndexForAlignment(a) - sortIndexForAlignment(b);

/**
 * sort comparator function for ngram arrays
 * @param a
 * @param b
 * @return {number}
*/
const indexComparator = (a, b) => a.index - b.index;

/**
 * @callback LoadLexiconEntryCB
 * @param {string} lexiconId
 * @param {string} entryId
 */

/**
 * @typedef ContextID
 * @param {object} details
 * @property {string} book
 * @property {string} chapter
 * @property {string} verse
 */

/**
 * @typedef TargetWordType
 * @param {number} index - position in the list of words for the verse
 * @property {number} occurrence - the specific occurrence of the word in verse
 * @property {number} occurrences - total occurrences of the word in verse
 * @property {string} text - text of the word itself
 */

/**
 * @typedef TargetWordBankType
 * @param {number} index - position in the list of words for the verse
 * @property {number} occurrence - the specific occurrence of the word in verse
 * @property {number} occurrences - total occurrences of the word in verse
 * @property {string} text - text of the word itself
 * @property {boolean} disabled - if true then word is already used in alignment
 */

/**
 * @typedef SourceWordType
 * @param {number} index - position in the list of words for the verse
 * @property {number} occurrence - the specific occurrence of the word in verse
 * @property {number} occurrences - total occurrences of the word in verse
 * @property {string} text - text of the word itself
 * @property {string} lemma - lemma for the word
 * @property {string} morph - morph for the word
 * @property {string} strong - strong for the word.  Could be multipart separated by colons such as `c:H4191`
 */

/**
 * @typedef AlignmentType
 * @param {array[SourceWordType]} sourceNgram - list of the source words for an alignment
 * @param {array[TargetWordType]} targetNgram - list of the target words for an alignment
 */

/**
 * @callback OnChangeCB
 * @param {object} details - a change details object with the following fields:
 * @param {string} details.type is type of alignment change (MERGE_ALIGNMENT_CARDS,
 *      CREATE_NEW_ALIGNMENT_CARD, UNALIGN_TARGET_WORD, ALIGN_TARGET_WORD, or ALIGN_SOURCE_WORD)
 * @param {string} details.source - source(s) of the word being changed (TARGET_WORD_BANK or GRID)
 * @param {string} details.destination - destination of the word being changed  (TARGET_WORD_BANK or GRID)
 * @param {array[AlignmentType]} details.verseAlignments - array of the latest verse alignments
 * @param {array[TargetWordBankType]} details.targetWords - array of the latest target words
 * @param {ContextID} details.contextId - context of current verse
 */

/**
 * @typedef StrongNumsType
 * @param {object} [strongNums] - key is the strong's number
 * @param {string} [strongNums].brief - short note about strongs number
 * @param {string} [strongNums].long - long version of note about strongs number
 * @param {string} [strongNums].repo - source repo for the lexicon such as `en_uhl`
 */

/**
 * @typedef StrongsType
 * @param {StrongNumsType} [strongNums] - optional Hebrew lexicon
 */

/**
 * @typedef LexiconType
 * @param {StrongsType} uhl - optional Hebrew lexicon
 * @param {StrongsType} ugl - optional Greek lexicon
 */

/**
 * @callback ShowPopOverCB
 * @param {object} PopoverTitle - JSX to show on title of popover
 * @param {object} wordDetails - JSX to show on body of popover
 * @param {object} positionCoord - where to position to popover
 * @param {object} rawData - where to position to popover
 * @param {SourceWordType} rawData.token - where to position to popover
 * @param {LexiconType} rawData.lexiconData - current lexicon data cache
 */

/**
 * @callback TranslateCB
 * @param {string} key - key for locale string lookup
 */

/**
 * @callback SuggesterCB Takes The source and target translation as well as manual alignments and returns a list of suggestions
 * @param {string|array[Token]} source - source translation 
 * @param {string|array[Token]} target - target translation
 * @param {number} maxSuggestions - max number of suggestions
 * @param {array[Alignment]} manualAlignments - array manual alignments
 * @return {array[Suggestion]} list of suggestions
 */

/**
 * SuggestingWordAligner is a stand-alone component for aligning words with word alignment suggestions.
 * @param {(book, chapter, verse)} contextId - current verse context
 * @param {object|null} lexiconCache - cache for lexicon data
 * @param {LoadLexiconEntryCB} loadLexiconEntry - callback to load lexicon for language and strong number
 * @param {OnChangeCB} onChange - optional callback for whenever alignment changed.  Contains the specific operation performed as well as the latest state of the verse alignments and target words usage
 * @param {ShowPopOverCB} showPopover - callback function to display a popover
 * @param {string} sourceLanguage - ID of source language
 * @param {string} sourceLanguageFont - font to use for source
 * @param {string} sourceFontSizePercent - percentage size for font
 * @param {object} targetLanguage - details about the language
 * @param {string} targetLanguageFont - font to use for target
 * @param {string} targetFontSizePercent - percentage size f
 * @param {TranslateCB} translate - callback to look up localized text
 * @param {array[AlignmentType]} verseAlignments - initial verse alignment
 * @param {array[TargetWordBankType]} targetWords - list of target words for use in wordbank
 * @param {SuggesterCB|null} suggester - callback to suggest alignments
 * @return {JSX.Element}
 * @constructor
 */

const SuggestingWordAligner = ({
  contextId,
  lexiconCache = lexiconCache_,
  loadLexiconEntry,
  onChange,
  showPopover = null,
  sourceLanguage,
  sourceLanguageFont = '',
  sourceFontSizePercent = 100,
  targetLanguage= {},
  targetLanguageFont = '',
  targetFontSizePercent = 100,
  translate,
  verseAlignments,
  targetWords,
  style: styles_ = {},
  hasRenderedSuggestions = true,
  suggester = null,
  }) => {
  const [dragToken, setDragToken_] = useState(null);
  const [dragItemType, setDragItemType] = useState(null);
  const [verseAlignments_, setVerseAlignments] = useState(verseAlignments);
  const [targetWords_, setTargetWords] = useState(targetWords);
  const [resetDrag, setResetDrag] = useState(false);

  const over = false;
  const targetDirection = targetLanguage?.direction || 'ltr';
  let sourceDirection = 'ltr';
  const toolsSettings = {};
  const setToolSettings = () => {
    console.log('setToolSettings')
  };


  function updateSuggestedSourceToken(token) {
    let newVerseAlignments = verseAlignments_;

      //now test if the word being dragged is a secondary word.
      //and that the suggester is actually available.
      if( suggester && (token.type || types.SECONDARY_WORD) === types.SECONDARY_WORD ) {

          //Convert the data into the structure useful by the suggester.
          const sourceWordObjects = verseAlignments_.map( alignment => alignment.sourceNgram ).reduce( (a, b) => a.concat(b), []).sort(indexComparator).map( t=>new Token(t) ); 
          const targetWordObjects = [...targetWords_].sort(indexComparator).map( t=>new Token(t) ); 
          const manualAlignmentObjects = verseAlignments_.filter( alignment=>!alignment.isSuggestion ).map(alignment=>new Alignment( new Ngram( alignment.sourceNgram.map( n => new Token(n) ) ), new Ngram( alignment.targetNgram.map( n => new Token(n) )  ) ) );

          updateTokenLocations(sourceWordObjects);
          updateTokenLocations(targetWordObjects);

          //remove the token in consideration from the manualAlignments so that it doesn't restrict the suggestions for that word
          //first we will map it to alignments dropping the target word and then we will filter out the alignments which no longer have target words.
          const manualAlignmentObjectsWithoutToken = manualAlignmentObjects.map( alignment=> {
            //if the alignment doesn't include the target token, just pass it through.
            if( !alignment.targetNgram.tokens.find( t=>t.text === token.text && t.occurrence === token.occurrence ) ) {
              return alignment;
            }
            //otherwise, remove the target word from the alignment
            return new Alignment( alignment.sourceNgram, new Ngram(alignment.targetNgram.tokens.filter( t=>t.text !== token.text || t.occurrence !== token.occurrence )) );
          })
          //now filter out the dead alignments.
          .filter( alignment=>alignment.targetNgram.tokens.length > 0 );

          //now call the suggester.
          const numberOfSuggestions = 3;
          const suggestions = suggester(sourceWordObjects, targetWordObjects, numberOfSuggestions, manualAlignmentObjectsWithoutToken);


          //construct a hash from a source key to the probablity that that word is a target.
          const sourceTargetConfidence = {};

          suggestions.forEach( suggestion=> {
            const newConfidence = suggestion.compoundConfidence();
            //now go searching for the alignments which have the target word.
            suggestion.predictions.forEach( prediction=> {
              prediction.alignment.targetNgram.tokens.forEach( targetToken=> {
                //if the target token is the same as the dragged token
                if( targetToken.text === token.text && targetToken.occurrence === token.occurrence ) {
                  //now update the hash for all the target tokens in this alignment.
                  prediction.alignment.sourceNgram.tokens.forEach( sourceToken => {
                    const sourceHash = `${sourceToken.text}:${sourceToken.occurrence}:${sourceToken.occurrences}`;

                    //pull the existing probability defaulting to zero if it doesn't exist yet.
                    const existingConfidence = sourceTargetConfidence[sourceHash] || 0;

                    //update the hash
                    sourceTargetConfidence[sourceHash] = Math.max(existingConfidence, newConfidence);
                  });
                }
              });
            });
          });


          //now update the sourceSuggested property of the alignments to match that for the dragged token.
          newVerseAlignments = verseAlignments_.map( alignment=> {
            //Map the source tokens into their confidences.
            //and then take the max of that.
            const sourceTokenConfidences = alignment.sourceNgram.map( sourceToken=> {
              const sourceHash = `${sourceToken.text}:${sourceToken.occurrence}:${sourceToken.occurrences}`;
              return sourceTargetConfidence[sourceHash] || 0;
            });
            const maxSourceConfidence = Math.max(...sourceTokenConfidences);

            //now return the alignment with this confidence that it should be the source word.
            return {
              ...alignment,
              sourceSuggested: maxSourceConfidence,
            }
          });

      }else{  //this is if there is no suggester or if the word being dragged is not a secondary word.
        //clear out the suggestions when a source word is being dragged.
        newVerseAlignments = verseAlignments_.map( alignment=> {
          return {
            ...alignment,
            sourceSuggested: 0,
          }
        })
      }

      //now go ahead and do the set.
      setVerseAlignments(newVerseAlignments);
  }

  /**
   * on start of token drag, save drag token and drag item type
   * @param {object} token
   */
  function setDragToken(token) {
    setDragToken_(token)
    setDragItemType(token.type || types.SECONDARY_WORD)

    //handle this in a callback to not lag the UI.
    setTimeout(() => {
      updateSuggestedSourceToken(token);
    },0);
  }

  /**
   * callback for each alignment change so that app can keep track of last change or update valid alignment badge
   * @param {object} results
   * @param {string} results.type is type of alignment change
   * @param {string} results.source - source(s) of the word being changed
   * @param {string} results.destination - destination of the word being changed
   * @param {array} verseAlignments - optional new value for verseAlignments
   * @param {array} targetWords - optional new value for verseAlignments
   */
  function doChangeCallback(results = {}, verseAlignments = verseAlignments_, targetWords = targetWords_) {
    onChange && onChange({
      ...results,
      verseAlignments,
      targetWords,
      contextId,
    });
  }

  /**
   * does cleanup for new verse alignments before saving to state
   * @param {array} verseAlignments
   * @return cleaned up verseAlignments
   */
  function updateVerseAlignments(verseAlignments) {
    const _verseAlignments = alignmentCleanup(verseAlignments);
    setVerseAlignments(_verseAlignments);
    return _verseAlignments;
  }

  /**
   * unalign target word - find in alignment card and remove, then clear the disabled flag in the word bank
   * @param {object} targetToken - target word to unalign
   */
  const handleUnalignTargetToken = (targetToken) => {
    console.log('handleUnalignTargetToken');
    const source=GRID;
    const destination=TARGET_WORD_BANK;
    let sourceToken = {};
    const { tokenIndex, alignmentIndex } = findAlignment(verseAlignments_, targetToken);
    if (alignmentIndex >= 0) {
      let verseAlignments = [...verseAlignments_];
      verseAlignments[alignmentIndex].targetNgram.splice(tokenIndex, 1);
      sourceToken = verseAlignments[alignmentIndex].sourceNgram;
      updateVerseAlignments(verseAlignments);
    }

    const found_ = findInWordList(targetWords_, alignmentToToken(targetToken));
    if (found_ >= 0) {
      const words = [...targetWords_]
      words[found_].disabled = false;
      setTargetWords(words);
    }
    setResetDrag(true); // clear the selected words
    doChangeCallback({
      type: UNALIGN_TARGET_WORD,
      source,
      destination,
      sourceToken: sourceToken,
      targetToken: targetToken
    });
  };

  /**
   * add target token to alignment card - it can either be from word bank or a different alignment card
   * @param {object} targetToken- target word to align or change alignment
   * @param {number} alignmentIndex - index of alignment card that target word is going to
   * @param {number} srcAlignmentIndex - index of alignment card that target word is coming from, -1 means it was an unaligned word in the word bank
   */
  const handleAlignTargetToken = (targetToken, alignmentIndex, srcAlignmentIndex) => {
    console.log('handleAlignTargetToken', {alignmentIndex, srcAlignmentIndex})
    
    const destination=GRID
    let source=( srcAlignmentIndex === -1)?GRID:TARGET_WORD_BANK;
    let verseAlignments = [...verseAlignments_]
    const dest = verseAlignments[alignmentIndex];
    let src = null;
    let found = -1;

    //don't do a check if the target index is the same as the source, because if we pick up a suggested word
    //and drop it we still want any duplicates of it to be removed and for it to be removed from the word bank
    //and the alignment card to not be marked as a suggestion.

    //Make sure the targetToken isn't in dest.targetNgram
    found = findToken(dest.targetNgram, targetToken);
    if (found >= 0) {
      dest.targetNgram.splice(found, 1);
    }
    

    //now group the targetToken with the new target tokens in the dest and then handle them toether
    const newTargetTokens = [...dest.targetNgram, targetToken];


    //Make sure the target words don't exist anywhere else.
    for( const token of newTargetTokens) {
      for( src of verseAlignments) {
        found = findToken(src.targetNgram, token);
        if (found >= 0) {
          src.targetNgram.splice(found, 1);
        }
      }
    }

    //also make sure the target words are marked as disabled in the wordbank.
    let disabledTarget = false;
    let newWordList = [...targetWords_];
    for( const token of newTargetTokens) {
      found = findInWordList(newWordList, token);
      if (found >= 0 && newWordList[found].disabled !== true) {
        newWordList[found].disabled = true; //this is actually mutating the original object... but oh well.
        disabledTarget = true;
      }
    }
    if(disabledTarget) {
      setTargetWords(newWordList);
    }

    //new set the new list.
    dest.targetNgram = newTargetTokens; //technically mutating the original object
    dest.isSuggestion = false;
    dest.sourceSuggested = 0;
    const _verseAlignments = updateVerseAlignments(verseAlignments);
    doChangeCallback({
      type: ALIGN_TARGET_WORD,
      source,
      destination,
      srcSourceToken: src?.sourceNgram,
      destSourceToken: dest?.sourceNgram,
      srcTargetToken: src?.targetNgram,
      destTargetToken: dest?.targetNgram,
      sourceIndex: srcAlignmentIndex,
      destIndex: ""
    }, _verseAlignments);
    
  };

  /**
   * moves the primary token to a different alignment or split off as new alignment.
   *    if the source alignment is now empty of primary words, then move all the target words as well.
   * @param {object} primaryToken
   * @param destAlignmentIndex
   * @param srcAlignmentIndex
   * @param startNew
   */
  const handleAlignSourceToken = (primaryToken, destAlignmentIndex, srcAlignmentIndex, startNew) => {
    console.log('handleAlignSourceToken', {alignmentIndex: destAlignmentIndex, srcAlignmentIndex, startNew});
    if ((destAlignmentIndex !== srcAlignmentIndex) || startNew) {
      let destination=MERGE_ALIGNMENT_CARDS
      const source=GRID
      let verseAlignments = [...verseAlignments_];
      let dest = verseAlignments[destAlignmentIndex];
      let src = null;
      let found = -1;
      let emptySource = false;
      if (srcAlignmentIndex >= 0) { // find source alignment for primary word and remove the word
        src = verseAlignments[srcAlignmentIndex];
        found = findToken(src.sourceNgram, primaryToken);
        if (found >= 0) {
          src.sourceNgram.splice(found, 1);
          emptySource = !src.sourceNgram.length; // check if source alignment has any primary words left
        }
      }

      if (startNew) { // insert word into a new alignment
        destination = CREATE_NEW_ALIGNMENT_CARD;
        const newPosition = destAlignmentIndex + 1;
        dest = {
          index: newPosition,
          isSuggestion: false,
          sourceSuggested: 0,
          sourceNgram: [ primaryToken ],
          targetNgram: [],
        }
        verseAlignments.splice(newPosition, 0, dest)
        for (let i = newPosition + 1; i < verseAlignments.length; i++) {
          const item = verseAlignments[i]
          item.index++;
        }
      } else { // add to existing alignment
        dest.sourceNgram.push(primaryToken);
        dest.sourceNgram = dest.sourceNgram.sort(indexComparator)
      }

      if (emptySource && src) { // if source alignment is empty, move all the target words to the new alignment
        const targets = src.targetNgram;
        src.targetNgram = [];
        dest.targetNgram = dest.targetNgram.concat(targets);
        dest.targetNgram = dest.targetNgram.sort(indexComparator)
      }
      const _verseAlignments = updateVerseAlignments(verseAlignments);
      doChangeCallback({
        type: ALIGN_SOURCE_WORD,
        source,
        destination,
        srcSourceToken: src?.sourceNgram,
        destSourceToken: dest?.sourceNgram,
        srcTargetToken: src?.targetNgram,
        destTargetToken: dest?.targetNgram,
        sourceIndex: srcAlignmentIndex,
        destIndex: destAlignmentIndex
      }, _verseAlignments);
    }
  };

  const handleAcceptSuggestions = () => {
    //I am going to implement this as a drag event for every single suggested word as though from the wordbank.
    //This will automatically disable the words which are suggested as well as handle change callbacks.
    verseAlignments_
      //get all the alignments which are marked as suggestions.
      .filter( alignment => alignment.isSuggestion )
      //convert them to an info object per target token in them.
      .reduce( (acc, alignment) => {
        alignment.targetNgram.forEach( primaryToken => {
          acc.push( {
            primaryToken,
            destAlignmentIndex: alignment.index,
            sourceToken: alignment.sourceNgram,
            targetToken: alignment.targetNgram
          })
        })
        return acc;
      }, [])
      //Now execute the drag event with the info object produced by the reduce.
      .forEach( info => {
        handleAlignTargetToken(info.primaryToken, info.destAlignmentIndex, -1);
      })
  }

  const handleRefreshSuggestions = () => {

    console.log( "handleRefreshSuggestions" );

    //Just return if suggester is null or undefined
    if( !suggester ){
      //pop up a dialog telling the user that the model is not trained.
      alert( "Can not refresh suggestions. Model is not trained" );
      console.log( "suggester is null or undefined" );
      return;
    }
    

    //remove all suggested targets
    const alignmentsStage1 = verseAlignments_.map( alignment => {
      if( alignment.isSuggestion ){
        return {...alignment, targetNgram: [], isSuggestion: false };
      }else{
        return alignment;
      }
    })


    //Now break apart source tokens which have no targets on them still.
    const alignmentsStage2 = alignmentsStage1.reduce( (acc, alignment) => {
      if( !alignment.targetNgram.length && alignment.sourceNgram.length > 1 ){
        alignment.sourceNgram.forEach(sourceToken => {
          acc.push( {
            ...alignment
            , sourceNgram: [ sourceToken ]
          })
        });
      }else{
        acc.push(alignment);
      }
      return acc;
    },[]);

    //Now reindex it.
    const alignmentsStage3 = alignmentsStage2.map( (alignment, index) => ({...alignment, index}) );
    


    //Convert the data into the structure useful by the suggester.
    const sourceWordObjects = verseAlignments_.map( alignment => alignment.sourceNgram ).reduce( (a, b) => a.concat(b), []).sort(indexComparator).map( t=>new Token(t) ); 
    const targetWordObjects = [...targetWords_].sort(indexComparator).map( t=>new Token(t) ); 
    const manualAlignmentObjects = verseAlignments_.filter( alignment=>!alignment.isSuggestion ).map(alignment=>new Alignment( new Ngram( alignment.sourceNgram.map( n => new Token(n) ) ), new Ngram( alignment.targetNgram.map( n => new Token(n) )  ) ) );
    updateTokenLocations(sourceWordObjects);
    updateTokenLocations(targetWordObjects);

    //obtain the suggestions
    const predictions = suggester( sourceWordObjects, targetWordObjects, 1, manualAlignmentObjects )[0].predictions;


    const lookupNgrams = ( predictionNgram, targetWords ) => {
      const ngrams = [];
      for( let i = 0; i < predictionNgram.tokenLength; i++ ){
        const foundTargetWord = targetWords.find( targetWord => {
          if( targetWord.text !== predictionNgram.tokens[i].text ) return false;
          if( targetWord.occurrence !== predictionNgram.tokens[i].occurrence ) return false;
          return true;
        })
        //if( foundTargetWord ) ngrams.push( { ...foundTargetWord, disabled:false } );  //Marking the word as not disabled here probably doesn't update the word list and perhaps we don't want to mark out words which are only suggestions anyway.
        if( foundTargetWord ) ngrams.push( foundTargetWord );
      }
      return ngrams;
    }

    //Index the hash of all the target tokens already used so we can not use them again.
    const token_to_hash = (t) => `${t.text}:${t.occurrence}:${t.occurrences}`;
    
    const hashToManualTargetTokens = alignmentsStage3.reduce( (acc, alignment) => {
      alignment.targetNgram.forEach( targetToken => acc[token_to_hash(targetToken)] = targetToken );
      return acc;
    },{});
  

    //Now iterate through the suggestions and see which ones don't mess with an existing alignment.
    const alignmentsStage4 = alignmentsStage3.map( (alignmentToFilter, index) => {
      //if the alignment already has targets, they are manually aligned and should be respected.
      //We can't add in suggested additional targets because we can't represent a mixture of suggested and manual.
      if( alignmentToFilter.targetNgram.length > 0 ) return alignmentToFilter;
      

      //Next see if the given source word is the first of an ngram in a prediction.  If so create the alignment with
      //the suggestion flag set.
      const predictionWithSourceAsFirst = predictions.find( prediction => {
        if( prediction.alignment.sourceNgram.tokenLength < 1 ) return false;
        if( prediction.alignment.sourceNgram.tokens[0].text !== alignmentToFilter.sourceNgram[0].text ) return false;
        if( prediction.alignment.sourceNgram.tokens[0].occurrence !== alignmentToFilter.sourceNgram[0].occurrence ) return false;
        return true;
      });


      //filter the target ngrams to not use any manually used ngrams.
      let filteredSuggestedTargetNgram = null;
      if( predictionWithSourceAsFirst ){
        //predictionWithSourceAsFirst.alignment.targetNgram
        filteredSuggestedTargetNgram = predictionWithSourceAsFirst.alignment.targetNgram.tokens.filter( targetNgram => {
          if( hashToManualTargetTokens[token_to_hash(targetNgram)] ) return false;
          return true
        })
      }
      
      //Continue only if there was a prediction and filtered target suggestions still have at least one target
      if( predictionWithSourceAsFirst && filteredSuggestedTargetNgram.length > 0 ){
        //If there is only one suggested source ngram we are good, just pass it through.
        if( predictionWithSourceAsFirst.alignment.sourceNgram.tokenLength === 1 ){
          return {
            ...alignmentToFilter,
            isSuggestion: true,
            targetNgram: lookupNgrams( new Ngram(filteredSuggestedTargetNgram), targetWords_ )
          }
        }

        //otherwise, we need to hunt to make sure all the rest of the source ngrams are available, and go ahead and nab them if they are.
        const freeSourceNgrams = predictionWithSourceAsFirst.alignment.sourceNgram.tokens.map( sourceToken => {
          return alignmentsStage3.find( alignment => {
            if( alignment.sourceNgram.length < 1 ) return false;
            if( alignment.sourceNgram[0].text !== sourceToken.text ) return false;
            if( alignment.sourceNgram[0].occurrence !== sourceToken.occurrence ) return false;
            return true;
          })
        }).filter( alignmentWithTargetAsFirst => {
          if( alignmentWithTargetAsFirst === undefined ) return false; //Wasn't first or wasn't found
          if( alignmentWithTargetAsFirst.targetNgram.length > 0 ) return false; // already has a target
          return true;
        }).map( alignmentWithTargetAsFirst => alignmentWithTargetAsFirst.sourceNgram[0] );

        return {
          ...alignmentToFilter,
          isSuggestion: true,
          sourceNgram: freeSourceNgrams,
          targetNgram: lookupNgrams(  new Ngram(filteredSuggestedTargetNgram), targetWords_ ),
        }
      }

      //See if this word is one that is a non first source word in the suggestions.  If so then it would have been grabbed and we can just drop it here.
      const predictionWithSourceAsNonFirst = predictions.find( prediction => {
        //start ngramI at 1 because we are skipping the first entry.
        for( let ngramI = 1; ngramI < prediction.alignment.sourceNgram.tokenLength; ngramI++ ){
          if( prediction.alignment.sourceNgram.tokens[ngramI].text !== alignmentToFilter.sourceNgram[0].text ) continue;
          if( prediction.alignment.sourceNgram.tokens[ngramI].occurrence !== alignmentToFilter.sourceNgram[0].occurrence ) continue;
          return true;
        }
        return false;
      });
      if( predictionWithSourceAsNonFirst ){
        return undefined;
      }


      //for the remainder of items, they have no manual alignment or suggestion which involve them so just pass them through.
      return alignmentToFilter;

    //now filter out the undefined values and reindex.
    }).filter( alignment => alignment !== undefined ).map( (alignment, index) => ({...alignment, index}) );

    const alignmentsStage5 = updateVerseAlignments( alignmentsStage4 );
    setVerseAlignments(alignmentsStage5);
  }

  const handleRejectSuggestions = () => {
    console.log( "handleRejectSuggestions" );
    //Make sure all words which were dropped are not disabled in the word list.
    const targetTokensNeedingDisabled = verseAlignments_
      //filter to only suggestions
      .filter( alignment => alignment.isSuggestion) 
      //Now reduce to target words.
      .reduce( (acc, alignment) => {
        alignment.targetNgram.forEach( targetToken => {
          acc.push( targetToken );
        });
        return acc;
      },[])
      //now reduce these to target words which are not already disabled.
      .filter( targetToken => {
        const found = findInWordList(targetWords_, targetToken);
        if( found > 0 && !targetWords_[found].disabled ) return true;
        return false;
      });

    //if there are any of the target words needing to be disabled
    if( targetTokensNeedingDisabled.length > 0 ) {
      //Then map through creating new word objects which are disabled if they are in the targetTokensNeedingDisabled list.
      const newTargetWords = targetWords_.map( targetWord => {
        if( findInWordList( targetTokensNeedingDisabled, targetWord ) > 0 ) return { ...targetWord, disabled: false };
        return targetWord;
      });
      setTargetWords( newTargetWords );
    }


    //Drop all target tokens from verseAlignments which are suggestions
    const clearedAlignments = verseAlignments_.map( alignment => {
      if( alignment.isSuggestion ) return {...alignment, isSuggestion: false, targetNgram: []};
      return alignment;
    });
    setVerseAlignments(updateVerseAlignments( clearedAlignments ));
  }

  let sourceFontSizePercent_ = sourceFontSizePercent;
  const isHebrew = sourceLanguage === OT_ORIG_LANG;
  if (isHebrew) {
    sourceDirection = 'rtl'
    if (sourceFontSizePercent < 175) {
      sourceFontSizePercent_ = 175
    }
  }
  let sourceStyle = { fontSize: `${sourceFontSizePercent_}%` };
  if (sourceFontSizePercent_ > 120) {
    sourceStyle = {
      ...sourceStyle, paddingTop: '2px', paddingBottom: '2px', lineHeight: 'normal', WebkitFontSmoothing: 'antialiased',
    };
  }

  if (resetDrag) {
    delay(100).then(() => { // wait a moment for reset to happen before clearing
      setResetDrag(false);
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.wordListContainer}>
        <WordList
          styles={styles_}
          words={targetWords_}
          verse={contextId.reference.verse}
          isOver={over}
          chapter={contextId.reference.chapter}
          direction={targetDirection}
          toolsSettings={toolsSettings}
          reset={resetDrag}
          setToolSettings={setToolSettings}
          targetLanguageFont={targetLanguageFont}
          onDropTargetToken={handleUnalignTargetToken}
          dragToken={dragToken}
          setDragToken={setDragToken}
        />
      </div>
      <div style={styles.alignmentGridWrapper}>
        <AlignmentGrid
          styles={styles_}
          sourceStyle={sourceStyle}
          sourceDirection={sourceDirection}
          targetDirection={targetDirection}
          alignments={verseAlignments_}
          translate={translate}
          lexicons={lexiconCache}
          reset={resetDrag}
          toolsSettings={toolsSettings}
          onDropTargetToken={handleAlignTargetToken}
          onDropSourceToken={handleAlignSourceToken}
          contextId={contextId}
          isHebrew={isHebrew}
          showPopover={showPopover}
          loadLexiconEntry={loadLexiconEntry}
          targetLanguageFont={targetLanguageFont}
          dragToken={dragToken}
          dragItemType={dragItemType}
          setDragToken={setDragToken}
        />
        <MAPControls
          onAccept={handleAcceptSuggestions}
          hasSuggestions={hasRenderedSuggestions}
          showPopover={showPopover}
          onRefresh={handleRefreshSuggestions}
          onReject={handleRejectSuggestions}
          translate={translate}
        />
      </div>
    </div>

  );
};

SuggestingWordAligner.propTypes = {
  contextId: PropTypes.object.isRequired,
  lexiconCache: PropTypes.object,
  loadLexiconEntry: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showPopover: PropTypes.func.isRequired,
  sourceLanguage: PropTypes.string.isRequired,
  sourceLanguageFont: PropTypes.string,
  sourceFontSizePercent: PropTypes.number,
  targetLanguageFont: PropTypes.string,
  targetFontSizePercent: PropTypes.number,
  translate: PropTypes.func.isRequired,
  verseAlignments: PropTypes.array.isRequired,
  targetWords: PropTypes.array.isRequired,
  hasRenderedSuggestions: PropTypes.bool,
  suggester: PropTypes.func,
};

SuggestingWordAligner.defaultProps = { hasRenderedSuggestions: true };
export default SuggestingWordAligner;
