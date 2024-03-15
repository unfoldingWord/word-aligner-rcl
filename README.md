
# suggesting-word-aligner-rcl

This is a fork of [word-aligner-rcl](https://github.com/unfoldingWord/word-aligner-rcl).  word-aligner-rcl is a react component which allows a translator to connect source and target words in a translation and thus map out an alignment.  

This fork adds the addition of connecting an AI suggester for creating word alignments.

The demonstration app for this is [Alignment Transferer](https://github.com/JEdward7777/alignment-transferer) which has a [Netlify demo.](https://alignment-transferer.netlify.app/).  

## Usage Difference from WordAligner

The main react component instead of being called `WordAligner`, it is called `SuggestingWordAligner`.  It has two additional properties in addition to those of `WordAligner`.

 - `suggester`:  This is function call by which this component calls the model to make alignment suggestions.  The TypeScript type signature for this function is
    ```
    suggester: ((sourceSentence: string | Token[], targetSentence: string | Token[], maxSuggestions?: number, manuallyAligned?: Alignment[] ) => Suggestion[])|null
    ```
    The JavaScript type signature for this function is
    ```
    /**
    * @callback SuggesterCB Takes The source and target translation as well as manual alignments and returns a list of suggestions
    * @param {string|array[Token]} source - source translation 
    * @param {string|array[Token]} target - target translation
    * @param {number} maxSuggestions - max number of suggestions
    * @param {array[Alignment]} manualAlignments - array manual alignments
    * @return {array[Suggestion]} list of suggestions
    */
    ```
    If the suggester is not available, pass in `null`.
    The type signature for this function matches the signature of the [AbstractWordMapWrapper predict method](https://github.com/JEdward7777/wordmapbooster/blob/b2a65ec5d20423428178243907339420cca86f37/src/boostwordmap_tools.ts#L294) in the [wordmapbooster project](https://github.com/JEdward7777/wordmapbooster).

    Here is the description of the arguments.

    - `sourceSentence`: The aligner component will pass in an array of [Token](https://github.com/unfoldingWord/wordMAP-lexer/blob/develop/src/Token.ts)s representing the source text such as Greek or Hebrew in the case of scripture.
    - `targetSentence`: This will be an array of Tokens for the target text of whatever language is being aligned.
    - `maxSuggestions`: This is the number of [Suggestion](https://github.com/unfoldingWord/wordMAP/blob/master/src/core/Suggestion.ts)s which should be returned.

    - `manuallyAligned`: This parameter contains existing [Alignment](https://github.com/unfoldingWord/wordMAP/blob/master/src/core/Alignment.ts) objects, so that the suggester can respect existing and partial alignments when making suggestions.

    - `return`: The suggester function should return an array of [Suggestion](https://github.com/unfoldingWord/wordMAP/blob/master/src/core/Suggestion.ts) objects which contain the suggested alignments made by the suggester.
- `asyncSuggester`: This callback is supposed to take the same arguments as suggester but return the answer wrapped in a promise.  Either use this or the other but not both.
    The JavaScript type signature for this function is
   ```
   /**
   * @callback AsyncSuggesterCB Takes The source and target translation as well as manual alignments and returns a list of suggestions
   * @param {string|array[Token]} source - source translation 
   * @param {string|array[Token]} target - target translation
   * @param {number} maxSuggestions - max number of suggestions
   * @param {array[Alignment]} manualAlignments - array manual alignments
   * @return {Promise<array[Suggestion]>} list of suggestions
   */
    ```

 - `hasRenderedSuggestions`: This is a boolean property to `SuggestingWordAligner` which indicates if there are any active suggestions going on.  If this property is false, then alignment related buttons become disabled.

 ## Usage Similar to  WordAligner

 The following properties are left unchanged and are the same as `WordAligner`:

 - `contextId`:  Current verse context. This is an object which identifies which book is being aligned.
    ```
    /**
    * @typedef ContextID
    * @param {object} details
    * @property {string} book
    * @property {string} chapter
    * @property {string} verse
    */
    ```
 - `lexiconCache`: Cache for lexicon data
 - `loadLexiconEntry`: Callback to load lexicon for language and strong number
    ```
    /**
    * @callback LoadLexiconEntryCB
    * @param {string} lexiconId
    * @param {string} entryId
    */
    ```
 - `onChange`: Optional callback for whenever alignment changed.  Contains the specific operation performed as well as the latest state of the verse alignments and target words usage.
    ```
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
    ```
 - `showPopover`: Callback function to display a popover
    ```
    /**
    * @callback ShowPopOverCB
    * @param {object} PopoverTitle - JSX to show on title of popover
    * @param {object} wordDetails - JSX to show on body of popover
    * @param {object} positionCoord - where to position to popover
    * @param {object} rawData - where to position to popover
    * @param {SourceWordType} rawData.token - where to position to popover
    * @param {LexiconType} rawData.lexiconData - current lexicon data cache
    */
    ```
 - `sourceLanguage`: ID of source language.
 - `sourceLanguageFont`: Font to use for source.
 - `sourceFontSizePercent`: Percentage size for font.
 - `targetLanguage`: Details about the language.
 - `targetLanguageFont`: Font to use for target.
 - `targetFontSizePercent`: Percentage size for font.
 - `translate`: Callback to look up localized text.
    ```
    /**
    * @callback TranslateCB
    * @param {string} key - key for locale string lookup
    */
    ```
 - `verseAlignments`: Initial verse alignment.  An array of `AlignmentType`.
    ```
    /**
    * @typedef AlignmentType
    * @param {array[SourceWordType]} sourceNgram - list of the source words for an alignment
    * @param {array[TargetWordType]} targetNgram - list of the target words for an alignment
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
    * @typedef TargetWordType
    * @param {number} index - position in the list of words for the verse
    * @property {number} occurrence - the specific occurrence of the word in verse
    * @property {number} occurrences - total occurrences of the word in verse
    * @property {string} text - text of the word itself
    */
    ```
 - `targetWords`: List of target words for use in wordbank.  
    An array of `TargetWordBankType`
    ```
    /**
    * @typedef TargetWordBankType
    * @param {number} index - position in the list of words for the verse
    * @property {number} occurrence - the specific occurrence of the word in verse
    * @property {number} occurrences - total occurrences of the word in verse
    * @property {string} text - text of the word itself
    * @property {boolean} disabled - if true then word is already used in alignment
    */
    ```




## Installation

### npm
```bash
yarn add suggesting-word-aligner-rcl
```

### yarn
```bash
yarn add suggesting-word-aligner-rcl
```